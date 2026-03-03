import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";
import { validateString, validateArray, createValidationError } from "../_shared/validation.ts";

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const body = await req.json();
    const { headers, sampleData, dataDescription } = body;

    // Validate inputs
    const headersValidation = validateArray<string>(headers, 'headers', { 
      minLength: 1, 
      maxLength: 100,
      itemValidator: (item) => typeof item === 'string' && item.length <= 200
    });
    if (!headersValidation.success) {
      return createValidationError(headersValidation.error!, corsHeaders);
    }

    const sampleValidation = validateArray<Record<string, unknown>>(sampleData, 'sampleData', { 
      maxLength: 100, 
      required: false 
    });
    if (!sampleValidation.success) {
      return createValidationError(sampleValidation.error!, corsHeaders);
    }

    const descriptionValidation = validateString(dataDescription, 'dataDescription', { 
      maxLength: 2000, 
      required: false 
    });
    if (!descriptionValidation.success) {
      return createValidationError(descriptionValidation.error!, corsHeaders);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert data visualization assistant for environmental scientists.
Analyze the provided data headers, sample rows, and user description to suggest the best chart configuration.

INTELLIGENT DATA ANALYSIS:
1. Parse header names to extract embedded information:
   - Units in parentheses: "Benzene (mg/L)" → parameter is Benzene, unit is mg/L
   - Units after underscore: "GRO_mgL" → parameter is GRO, unit is mg/L
   - Date patterns: "Date", "Sample_Date", "Collection_Date" → time series data, use as X-axis
   - Location/ID patterns: "Sample ID", "Well ID", "Station", "MW-" → categorical X-axis
   
2. Infer appropriate axis labels:
   - If Y-axis columns share units (e.g., all mg/L), use "Concentration (mg/L)" as Y-axis label
   - If Y-axis columns are mixed units, use "Value" as Y-axis label
   - X-axis label should describe what the X values represent (Date, Sample Location, etc.)

3. Use the user's description (if provided) to understand:
   - What the data represents (groundwater monitoring, soil sampling, etc.)
   - The intended purpose of the chart
   - Any specific regulatory context (Alaska DEC, EPA, etc.)

4. Match parameters to regulatory limits based on:
   - Parameter names (GRO, DRO, RRO, Benzene, Arsenic, Lead, etc.)
   - Units (mg/L = water, mg/kg = soil)
   - User description context

DUAL Y-AXIS DETECTION:
Analyze the numeric ranges of different columns. If you find:
- One column with values in thousands (e.g., Flow: 5000-15000)
- Another column with values in single/double digits (e.g., Stage: 2-8)
Then recommend enableDualYAxis: true and split the columns appropriately.

Look for patterns like:
- "Flow" and "Stage" → different scales, use dual axis
- "Discharge" and "Level" → different scales
- Any columns where max/min ratio between columns > 10x

Available regulatory limit IDs:
Groundwater (18 AAC 75 Table C): gro_gw, dro_gw, rro_gw, arsenic_gw, lead_gw, benzene_gw, toluene_gw, ethylbenzene_gw, xylenes_gw
Soil Under 40" (18 AAC 75 Table B1): arsenic_soil, lead_soil, benzene_soil, dro_soil, gro_soil, rro_soil
Surface Water (18 AAC 70): tah_sw, taqh_sw, arsenic_sw, lead_sw

CHART TYPE SELECTION:
- Time series data → line chart
- Comparing samples at different locations → bar chart
- Looking for correlations between two variables → scatter chart
- Showing cumulative or stacked values → stacked-area or stacked-bar
- Part-to-whole relationship → pie chart
- Mixing bars and lines (e.g., precipitation bars + temperature line) → composed
- Data with very different scales → line with enableDualYAxis: true`;

    const userPrompt = `Analyze this environmental data and suggest chart configuration:

Headers: ${JSON.stringify(headersValidation.data)}

Sample Data (first rows):
${JSON.stringify(sampleValidation.data?.slice(0, 10), null, 2)}

${descriptionValidation.data ? `User's description of this data: ${descriptionValidation.data}` : "User did not provide a description."}

Analyze the headers carefully - they may contain units (e.g., "GRO (mg/L)") or date information.
Check if different numeric columns have vastly different scales (e.g., one in thousands, another in single digits) - if so, suggest dual Y-axis.
Extract meaningful axis labels from the data structure.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_chart_config",
              description: "Return the suggested chart configuration with intelligent axis labels and optional dual Y-axis",
              parameters: {
                type: "object",
                properties: {
                  chartType: {
                    type: "string",
                    enum: ["line", "bar", "scatter", "area", "composed", "stacked-bar", "stacked-area", "pie"],
                    description: "The recommended chart type based on data structure",
                  },
                  xAxis: {
                    type: "string",
                    description: "The column name to use for X-axis",
                  },
                  yAxis: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of column names for the left Y-axis",
                  },
                  enableDualYAxis: {
                    type: "boolean",
                    description: "Whether to enable dual Y-axis mode (true if columns have very different scales)",
                  },
                  rightYAxes: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of column names for the right Y-axis (when dual axis is recommended)",
                  },
                  rightYAxisLabel: {
                    type: "string",
                    description: "Label for the right Y-axis (when dual axis is recommended)",
                  },
                  xAxisLabel: {
                    type: "string",
                    description: "A descriptive label for the X-axis (e.g., 'Sample Date', 'Monitoring Well')",
                  },
                  yAxisLabel: {
                    type: "string",
                    description: "A descriptive label for the left Y-axis with units if applicable (e.g., 'Concentration (mg/L)')",
                  },
                  suggestedLimits: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of regulatory limit IDs to display",
                  },
                  titleSuggestion: {
                    type: "string",
                    description: "A descriptive, professional title for the chart",
                  },
                },
                required: ["chartType", "xAxis", "yAxis", "xAxisLabel", "yAxisLabel", "suggestedLimits", "titleSuggestion"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_chart_config" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI response received");

    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "suggest_chart_config") {
      throw new Error("Unexpected AI response format");
    }

    const suggestion = JSON.parse(toolCall.function.arguments);
    console.log("Parsed suggestion:", JSON.stringify(suggestion, null, 2));

    return new Response(JSON.stringify(suggestion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in graph-suggest function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
