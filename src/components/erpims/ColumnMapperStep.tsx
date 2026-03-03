import { useEffect, useState, useRef } from "react";
import { Check, Loader2, AlertCircle, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ColumnMapping, ParsedData } from "@/pages/ErpimsFormatter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import InfoTooltip from "./InfoTooltip";

interface ColumnMapperStepProps {
  parsedData: ParsedData | null;
  mappings: ColumnMapping[];
  onMappingsChange: (mappings: ColumnMapping[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const ERPIMS_FIELDS = [
  { value: "LABSAMPID", label: "LABSAMPID - Lab Sample ID", category: "SAMPLE" },
  { value: "LOCID", label: "LOCID - Location ID", category: "SAMPLE" },
  { value: "LOGDATE", label: "LOGDATE - Collection Date", category: "SAMPLE" },
  { value: "LOGTIME", label: "LOGTIME - Collection Time", category: "SAMPLE" },
  { value: "MATRIX", label: "MATRIX - Sample Matrix", category: "SAMPLE" },
  { value: "SAESSION", label: "SAESSION - Sample Session/Event", category: "SAMPLE" },
  { value: "SACODE", label: "SACODE - Sample Type Code", category: "SAMPLE" },
  { value: "PARLABEL", label: "PARLABEL - Analyte Code", category: "RESULT" },
  { value: "PARVAL", label: "PARVAL - Result Value", category: "RESULT" },
  { value: "PESSION", label: "PESSION - Analytical Session/Event", category: "TEST" },
  { value: "PESSION_TEST", label: "PESSION_TEST - Test Session/Event", category: "TEST" },
  { value: "PESSION_RESULT", label: "PESSION_RESULT - Result Session/Event", category: "RESULT" },
  { value: "PARUNIT", label: "PARUNIT - Units", category: "RESULT" },
  { value: "PESSION", label: "PESSION - Test Session", category: "RESULT" },
  { value: "PARDETLIM", label: "PARDETLIM - MDL", category: "RESULT" },
  { value: "PARQL", label: "PARQL - Reporting Limit", category: "RESULT" },
  { value: "PARVQ", label: "PARVQ - Value Qualifier", category: "RESULT" },
  { value: "ANESSION", label: "ANESSION - Analytical Session/Event", category: "TEST" },
  { value: "ANMCODE", label: "ANMCODE - Analytical Method", category: "TEST" },
  { value: "ANDATE", label: "ANDATE - Analysis Date", category: "TEST" },
  { value: "ANFLAG", label: "ANFLAG - Analysis Flag", category: "TEST" },
  { value: "EXMCODE", label: "EXMCODE - Extraction Method", category: "TEST" },
  { value: "EXDATE", label: "EXDATE - Extraction Date", category: "TEST" },
  { value: "DILUTION", label: "DILUTION - Dilution Factor", category: "RESULT" },
  { value: "IGNORE", label: "(Ignore this column)", category: "OTHER" },
];

const ColumnMapperStep = ({
  parsedData,
  mappings,
  onMappingsChange,
  isProcessing,
  setIsProcessing,
}: ColumnMapperStepProps) => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const hasAutoMapped = useRef(false);

  const runAiMapping = async () => {
    if (!parsedData) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Get sample data for AI to analyze
      const sampleRows = parsedData.rows.slice(0, 5);
      
      const { data, error: fnError } = await supabase.functions.invoke("erpims-format", {
        body: {
          action: "map_columns",
          headers: parsedData.headers,
          sampleData: sampleRows,
          erpimsFields: ERPIMS_FIELDS.map((f) => f.value),
        },
      });

      if (fnError) throw fnError;

      if (data?.mappings) {
        const newMappings: ColumnMapping[] = data.mappings.map((m: { labColumn: string; erpimsField: string; confidence: number }) => ({
          labColumn: m.labColumn,
          erpimsField: m.erpimsField,
          confidence: m.confidence,
          confirmed: m.confidence >= 0.9, // Auto-confirm high confidence mappings
        }));
        onMappingsChange(newMappings);
        toast({
          title: "Column mapping complete",
          description: `Mapped ${newMappings.length} columns. Please review and confirm.`,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze columns";
      setError(message);
      toast({
        title: "Mapping failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateMapping = (labColumn: string, erpimsField: string) => {
    const updated = mappings.map((m) =>
      m.labColumn === labColumn
        ? { ...m, erpimsField, confirmed: true }
        : m
    );
    onMappingsChange(updated);
  };

  const confirmMapping = (labColumn: string) => {
    const updated = mappings.map((m) =>
      m.labColumn === labColumn ? { ...m, confirmed: true } : m
    );
    onMappingsChange(updated);
  };

  const confirmAll = () => {
    const updated = mappings.map((m) => ({ ...m, confirmed: true }));
    onMappingsChange(updated);
  };

  // Auto-run AI mapping when data is available and hasn't been mapped yet
  useEffect(() => {
    if (parsedData && !hasAutoMapped.current && !isProcessing) {
      hasAutoMapped.current = true;
      runAiMapping();
    }
  }, [parsedData]);

  if (!parsedData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Please upload a file first.</AlertDescription>
      </Alert>
    );
  }

  // Show loading state during auto-mapping
  if (isProcessing && mappings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Analyzing columns with AI...</p>
      </div>
    );
  }

  const unconfirmedCount = mappings.filter((m) => !m.confirmed && m.erpimsField).length;
  const unmappedCount = mappings.filter((m) => !m.erpimsField).length;

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={runAiMapping} disabled={isProcessing} variant="outline">
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Re-run AI Mapping
              </>
            )}
          </Button>
          {unconfirmedCount > 0 && (
            <Button variant="outline" onClick={confirmAll}>
              <Check className="h-4 w-4 mr-2" />
              Confirm All
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          {unmappedCount > 0 && (
            <Badge variant="secondary">{unmappedCount} unmapped</Badge>
          )}
          {unconfirmedCount > 0 && (
            <Badge variant="outline">{unconfirmedCount} to confirm</Badge>
          )}
        </div>
      </div>

      {/* Mapping table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lab Column</TableHead>
              <TableHead>Sample Value</TableHead>
              <TableHead className="inline-flex items-center">
                ERPIMS Field
                <InfoTooltip 
                  content="Map your lab columns to the corresponding ERPIMS field codes. Required fields include LABSAMPID (sample identifier), PARLABEL (analyte code), and PARVAL (result value)."
                />
              </TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((mapping) => (
              <TableRow key={mapping.labColumn}>
                <TableCell className="font-mono text-sm">
                  {mapping.labColumn}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground max-w-[150px] truncate">
                  {parsedData.rows[0]?.[mapping.labColumn] || "—"}
                </TableCell>
                <TableCell>
                  <Select
                    value={mapping.erpimsField}
                    onValueChange={(value) => updateMapping(mapping.labColumn, value)}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select ERPIMS field..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ERPIMS_FIELDS.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          <span className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {field.category}
                            </Badge>
                            {field.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {mapping.confidence > 0 && (
                    <Badge
                      variant={
                        mapping.confidence >= 0.9
                          ? "default"
                          : mapping.confidence >= 0.7
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {Math.round(mapping.confidence * 100)}%
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {mapping.confirmed ? (
                    <Badge className="bg-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Confirmed
                    </Badge>
                  ) : mapping.erpimsField ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmMapping(mapping.labColumn)}
                    >
                      Confirm
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ColumnMapperStep;
