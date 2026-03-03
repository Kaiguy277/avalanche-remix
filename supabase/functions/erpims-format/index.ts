import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    console.log(`ERPIMS Format action: ${action}`);

    switch (action) {
      case "map_columns":
        return await handleColumnMapping(params);
      case "validate_vvls":
        return await handleVvlValidation(params);
      case "generate_files":
        return await handleFileGeneration(params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error("Error in erpims-format:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleColumnMapping(params: {
  headers: string[];
  sampleData: Record<string, string>[];
  erpimsFields: string[];
}) {
  const { headers, sampleData, erpimsFields } = params;

  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY not configured");
  }

  const prompt = `You are an ERPIMS data formatting expert. Analyze these lab data columns and map them to ERPIMS fields.

Lab Data Columns: ${JSON.stringify(headers)}

Sample Data (first few rows):
${JSON.stringify(sampleData, null, 2)}

Available ERPIMS Fields:
${erpimsFields.join(", ")}

Common mappings:
- Sample ID, Lab Sample ID, SampleID -> LABSAMPID
- Location, Location ID, Well ID, Monitoring Point -> LOCID
- Collection Date, Sample Date, Date Collected -> LOGDATE
- Collection Time, Sample Time -> LOGTIME
- Matrix, Sample Matrix, Media -> MATRIX
- Analyte, Parameter, Chemical Name, Constituent -> PARLABEL
- Result, Concentration, Value, Final Result -> PARVAL
- Units, Unit, Reporting Units -> PARUNIT
- MDL, Method Detection Limit, Detection Limit -> PARDETLIM
- RL, Reporting Limit, PQL, Quantitation Limit -> PARQL
- Qualifier, Flag, Data Qualifier, Result Qualifier -> PARVQ
- Method, Analytical Method, Analysis Method -> ANMCODE
- Analysis Date, Analyzed Date -> ANDATE
- Sample Type, QC Type -> SACODE
- Dilution, Dilution Factor -> DILUTION

Return a JSON array of mappings. Each mapping should have:
- labColumn: the original column name
- erpimsField: the matching ERPIMS field (or "IGNORE" if no match)
- confidence: a number from 0 to 1 indicating confidence

Return ONLY the JSON array, no explanation.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are an expert at mapping environmental lab data to ERPIMS database fields. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI API error:", response.status, errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  
  // Parse the JSON from the response
  let mappings;
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      mappings = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No JSON array found in response");
    }
  } catch (parseError) {
    console.error("Failed to parse AI response:", content);
    // Fall back to basic mapping
    mappings = headers.map((header: string) => ({
      labColumn: header,
      erpimsField: guessField(header),
      confidence: 0.5,
    }));
  }

  return new Response(
    JSON.stringify({ mappings }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function guessField(header: string): string {
  const h = header.toLowerCase().replace(/[_\s-]/g, "");
  
  if (h.includes("sampleid") || h.includes("labsamp")) return "LABSAMPID";
  if (h.includes("location") || h.includes("locid") || h.includes("wellid")) return "LOCID";
  if (h.includes("collectiondate") || h.includes("sampledate") || h.includes("logdate")) return "LOGDATE";
  if (h.includes("collectiontime") || h.includes("sampletime")) return "LOGTIME";
  if (h.includes("matrix") || h.includes("media")) return "MATRIX";
  if (h.includes("analyte") || h.includes("parameter") || h.includes("chemical")) return "PARLABEL";
  if (h.includes("result") || h.includes("concentration") || h.includes("value")) return "PARVAL";
  if (h.includes("unit")) return "PARUNIT";
  if (h.includes("mdl") || h.includes("detectionlimit")) return "PARDETLIM";
  if (h.includes("rl") || h.includes("reportinglimit") || h.includes("pql")) return "PARQL";
  if (h.includes("qualifier") || h.includes("flag")) return "PARVQ";
  if (h.includes("method") && !h.includes("extraction")) return "ANMCODE";
  if (h.includes("analysisdate") || h.includes("analyzeddate")) return "ANDATE";
  if (h.includes("dilution")) return "DILUTION";
  
  return "IGNORE";
}

async function handleVvlValidation(params: {
  valuesToValidate: Record<string, string[]>;
  vvlOptions: Record<string, Array<{ code: string; name: string }>>;
}) {
  const { valuesToValidate, vvlOptions } = params;

  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY not configured");
  }

  const matches: Array<{
    labValue: string;
    matchedCode: string;
    matchedName: string;
    confidence: number;
    field: string;
  }> = [];

  // Process each field
  for (const [field, values] of Object.entries(valuesToValidate)) {
    const options = vvlOptions[field] || [];
    
    if (options.length === 0) {
      // No VVL options available, skip
      for (const value of values) {
        matches.push({
          labValue: value,
          matchedCode: "",
          matchedName: "",
          confidence: 0,
          field,
        });
      }
      continue;
    }

    // For each unique value, try to match
    for (const value of values) {
      // First try exact match
      const exactMatch = options.find(
        (o) => o.code.toUpperCase() === value.toUpperCase() || 
               o.name.toUpperCase() === value.toUpperCase()
      );

      if (exactMatch) {
        matches.push({
          labValue: value,
          matchedCode: exactMatch.code,
          matchedName: exactMatch.name,
          confidence: 1.0,
          field,
        });
        continue;
      }

      // Try fuzzy matching with AI for PARLABEL (chemical names vary a lot)
      if (field === "PARLABEL" && values.length <= 50) {
        const aiMatch = await fuzzyMatchWithAI(value, options.slice(0, 100), field);
        matches.push(aiMatch);
      } else {
        // Simple fuzzy match for other fields
        const fuzzyMatch = simpleFuzzyMatch(value, options);
        matches.push({
          labValue: value,
          matchedCode: fuzzyMatch?.code || "",
          matchedName: fuzzyMatch?.name || "",
          confidence: fuzzyMatch ? 0.7 : 0,
          field,
        });
      }
    }
  }

  return new Response(
    JSON.stringify({ matches }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function fuzzyMatchWithAI(
  value: string,
  options: Array<{ code: string; name: string }>,
  field: string
): Promise<{
  labValue: string;
  matchedCode: string;
  matchedName: string;
  confidence: number;
  field: string;
}> {
  const prompt = `Match this lab value to the closest ERPIMS ${field} code.

Lab Value: "${value}"

Available codes (format: CODE - Name):
${options.map((o) => `${o.code} - ${o.name}`).join("\n")}

Return JSON with:
- matchedCode: the best matching code (or empty string if no good match)
- matchedName: the name of the matched code
- confidence: 0-1 confidence score

Return ONLY the JSON object.`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert at matching environmental chemical names to ERPIMS codes. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        labValue: value,
        matchedCode: parsed.matchedCode || "",
        matchedName: parsed.matchedName || "",
        confidence: parsed.confidence || 0,
        field,
      };
    }
  } catch (error) {
    console.error("AI fuzzy match error:", error);
  }

  // Fallback to simple fuzzy match
  const fuzzyMatch = simpleFuzzyMatch(value, options);
  return {
    labValue: value,
    matchedCode: fuzzyMatch?.code || "",
    matchedName: fuzzyMatch?.name || "",
    confidence: fuzzyMatch ? 0.5 : 0,
    field,
  };
}

function simpleFuzzyMatch(
  value: string,
  options: Array<{ code: string; name: string }>
): { code: string; name: string } | null {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  for (const option of options) {
    const normalizedCode = option.code.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedName = option.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    if (normalizedCode.includes(normalized) || normalized.includes(normalizedCode)) {
      return option;
    }
    if (normalizedName.includes(normalized) || normalized.includes(normalizedName)) {
      return option;
    }
  }
  
  return null;
}

async function handleFileGeneration(params: {
  projectContext: {
    installationId: string;
    outputFormat: string;
    locids: string[];
  };
  rows: Record<string, string>[];
  columnLookup: Record<string, string>;
  vvlLookup: Record<string, Record<string, string>>;
}) {
  const { projectContext, rows, columnLookup, vvlLookup } = params;

  // Group rows by sample
  const sampleMap = new Map<string, Record<string, string>[]>();
  
  for (const row of rows) {
    const labSampId = row[columnLookup.LABSAMPID] || "";
    if (!sampleMap.has(labSampId)) {
      sampleMap.set(labSampId, []);
    }
    sampleMap.get(labSampId)!.push(row);
  }

  const sampleRecords: string[] = [];
  const testRecords: string[] = [];
  const resultRecords: string[] = [];

  const afiid = projectContext.installationId.padEnd(5);
  let sampleSeq = 1;

  for (const [labSampId, sampleRows] of sampleMap) {
    const firstRow = sampleRows[0];
    
    // Get values with VVL lookup
    const getValue = (field: string): string => {
      const labColumn = columnLookup[field];
      if (!labColumn) return "";
      const rawValue = firstRow[labColumn] || "";
      // Check VVL lookup
      if (vvlLookup[field] && vvlLookup[field][rawValue]) {
        return vvlLookup[field][rawValue];
      }
      return rawValue;
    };

    // Generate SAMPLE record (simplified - 409 chars for Prime format)
    const locid = getValue("LOCID").padEnd(15);
    const logdate = formatDate(getValue("LOGDATE")).padEnd(11);
    const logtime = formatTime(getValue("LOGTIME")).padEnd(4);
    const matrix = getValue("MATRIX").padEnd(2);
    const sacode = getValue("SACODE").padEnd(2) || "N ";
    const labSampIdPadded = labSampId.padEnd(30);
    
    // Prime format SAMPLE record (simplified version)
    const sampleRecord = [
      afiid,                          // 1-5: AFIID
      " ",                            // 6: delimiter
      locid,                          // 7-21: LOCID
      " ",                            // 22: delimiter
      logdate,                        // 23-33: LOGDATE (DD-MON-YYYY)
      logtime,                        // 34-37: LOGTIME (HHMM)
      " ",                            // 38: delimiter
      matrix,                         // 39-40: MATRIX
      " ",                            // 41: delimiter
      sacode,                         // 42-43: SACODE
      " ",                            // 44: delimiter
      labSampIdPadded,                // 45-74: LABSAMPID
      " ".repeat(335),                // Remaining fields padded
    ].join("");

    sampleRecords.push(sampleRecord.substring(0, 409));

    // Generate TEST and RESULT records for each analyte
    const testMap = new Map<string, Record<string, string>[]>();
    
    for (const row of sampleRows) {
      const anmcode = row[columnLookup.ANMCODE] || "UNKNOWN";
      if (!testMap.has(anmcode)) {
        testMap.set(anmcode, []);
      }
      testMap.get(anmcode)!.push(row);
    }

    let testSeq = 1;
    for (const [anmcode, testRows] of testMap) {
      const anmcodePadded = anmcode.padEnd(15);
      const andate = formatDate(testRows[0][columnLookup.ANDATE] || "").padEnd(11);
      
      // Prime format TEST record (simplified)
      const testRecord = [
        afiid,                        // 1-5: AFIID
        " ",                          // 6: delimiter
        locid,                        // 7-21: LOCID
        " ",                          // 22: delimiter
        logdate,                      // 23-33: LOGDATE
        logtime,                      // 34-37: LOGTIME
        " ",                          // 38: delimiter
        anmcodePadded,                // 39-53: ANMCODE
        " ",                          // 54: delimiter
        andate,                       // 55-65: ANDATE
        " ".repeat(155),              // Remaining fields padded
      ].join("");

      testRecords.push(testRecord.substring(0, 221));

      // Generate RESULT records
      for (const resultRow of testRows) {
        const getResultValue = (field: string): string => {
          const labColumn = columnLookup[field];
          if (!labColumn) return "";
          const rawValue = resultRow[labColumn] || "";
          if (vvlLookup[field] && vvlLookup[field][rawValue]) {
            return vvlLookup[field][rawValue];
          }
          return rawValue;
        };

        const parlabel = getResultValue("PARLABEL").padEnd(30);
        const parval = getResultValue("PARVAL").padEnd(20);
        const parunit = getResultValue("PARUNIT").padEnd(15);
        const parvq = getResultValue("PARVQ").padEnd(2) || "= ";
        const pardetlim = getResultValue("PARDETLIM").padEnd(20);
        const parql = getResultValue("PARQL").padEnd(20);

        // Prime format RESULT record (simplified)
        const resultRecord = [
          afiid,                      // 1-5: AFIID
          " ",                        // 6: delimiter
          locid,                      // 7-21: LOCID
          " ",                        // 22: delimiter
          logdate,                    // 23-33: LOGDATE
          logtime,                    // 34-37: LOGTIME
          " ",                        // 38: delimiter
          anmcodePadded,              // 39-53: ANMCODE
          " ",                        // 54: delimiter
          parlabel,                   // 55-84: PARLABEL
          " ",                        // 85: delimiter
          parval,                     // 86-105: PARVAL
          " ",                        // 106: delimiter
          parvq,                      // 107-108: PARVQ
          " ",                        // 109: delimiter
          parunit,                    // 110-124: PARUNIT
          " ",                        // 125: delimiter
          pardetlim,                  // 126-145: PARDETLIM
          " ",                        // 146: delimiter
          parql,                      // 147-166: PARQL
          " ".repeat(275),            // Remaining fields padded
        ].join("");

        resultRecords.push(resultRecord.substring(0, 441));
      }

      testSeq++;
    }

    sampleSeq++;
  }

  return new Response(
    JSON.stringify({
      files: {
        sample: sampleRecords.join("\n"),
        test: testRecords.join("\n"),
        result: resultRecords.join("\n"),
        sampleCount: sampleRecords.length,
        testCount: testRecords.length,
        resultCount: resultRecords.length,
      },
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "           "; // 11 spaces
  
  try {
    // Try to parse various date formats
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr.substring(0, 11).padEnd(11);
    }
    
    const day = date.getDate().toString().padStart(2, "0");
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr.substring(0, 11).padEnd(11);
  }
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "    "; // 4 spaces
  
  try {
    // Handle various time formats
    const cleaned = timeStr.replace(/[^0-9:]/g, "");
    const parts = cleaned.split(":");
    
    if (parts.length >= 2) {
      const hour = parts[0].padStart(2, "0");
      const minute = parts[1].padStart(2, "0");
      return `${hour}${minute}`;
    }
    
    // If it's already in HHMM format
    if (/^\d{4}$/.test(cleaned)) {
      return cleaned;
    }
    
    return timeStr.substring(0, 4).padEnd(4);
  } catch {
    return "    ";
  }
}
