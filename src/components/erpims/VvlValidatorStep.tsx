import { useEffect, useState } from "react";
import { Check, Loader2, AlertCircle, Search, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColumnMapping, ParsedData, VvlMatch } from "@/pages/ErpimsFormatter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import InfoTooltip from "./InfoTooltip";

interface VvlValidatorStepProps {
  parsedData: ParsedData | null;
  mappings: ColumnMapping[];
  matches: VvlMatch[];
  onMatchesChange: (matches: VvlMatch[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

// VVL fields that need validation
const VVL_FIELDS = ["PARLABEL", "ANMCODE", "MATRIX", "PARUNIT", "PARVQ", "SACODE"];

const VvlValidatorStep = ({
  parsedData,
  mappings,
  matches,
  onMatchesChange,
  isProcessing,
  setIsProcessing,
}: VvlValidatorStepProps) => {
  const [error, setError] = useState<string | null>(null);
  const [vvlOptions, setVvlOptions] = useState<Record<string, Array<{ code: string; name: string }>>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Fetch VVL options on mount
  useEffect(() => {
    const fetchVvls = async () => {
      const [parlabel, anmcode, matrix, units, parvq, sacode] = await Promise.all([
        supabase.from("erpims_parlabel").select("code, name").order("code"),
        supabase.from("erpims_anmcode").select("code, name").order("code"),
        supabase.from("erpims_matrix").select("code, name").order("code"),
        supabase.from("erpims_units").select("code, name").order("code"),
        supabase.from("erpims_parvq").select("code, name").order("code"),
        supabase.from("erpims_sacode").select("code, name").order("code"),
      ]);

      setVvlOptions({
        PARLABEL: parlabel.data || [],
        ANMCODE: anmcode.data || [],
        MATRIX: matrix.data || [],
        PARUNIT: units.data || [],
        PARVQ: parvq.data || [],
        SACODE: sacode.data || [],
      });
    };

    fetchVvls();
  }, []);

  const runVvlValidation = async () => {
    if (!parsedData) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Get unique values for each VVL field from the data
      const valuesToValidate: Record<string, string[]> = {};
      
      for (const mapping of mappings) {
        if (VVL_FIELDS.includes(mapping.erpimsField)) {
          const uniqueValues = [...new Set(
            parsedData.rows.map((row) => row[mapping.labColumn]).filter(Boolean)
          )];
          valuesToValidate[mapping.erpimsField] = uniqueValues;
        }
      }

      // Call edge function to match values
      const { data, error: fnError } = await supabase.functions.invoke("erpims-format", {
        body: {
          action: "validate_vvls",
          valuesToValidate,
          vvlOptions,
        },
      });

      if (fnError) throw fnError;

      if (data?.matches) {
        const newMatches: VvlMatch[] = data.matches.map((m: VvlMatch) => ({
          ...m,
          confirmed: m.confidence >= 0.95, // Auto-confirm very high confidence matches
        }));
        onMatchesChange(newMatches);
        
        const needsReview = newMatches.filter((m: VvlMatch) => !m.confirmed).length;
        toast({
          title: "VVL validation complete",
          description: needsReview > 0 
            ? `${needsReview} value(s) need review` 
            : "All values matched successfully",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to validate VVLs";
      setError(message);
      toast({
        title: "Validation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateMatch = (labValue: string, field: string, matchedCode: string) => {
    const matchedOption = vvlOptions[field]?.find((o) => o.code === matchedCode);
    const updated = matches.map((m) =>
      m.labValue === labValue && m.field === field
        ? { 
            ...m, 
            matchedCode, 
            matchedName: matchedOption?.name || "",
            confidence: 1.0,
            confirmed: true 
          }
        : m
    );
    onMatchesChange(updated);
  };

  const confirmMatch = (labValue: string, field: string) => {
    const updated = matches.map((m) =>
      m.labValue === labValue && m.field === field ? { ...m, confirmed: true } : m
    );
    onMatchesChange(updated);
  };

  const confirmAll = () => {
    const updated = matches.map((m) => ({ ...m, confirmed: true }));
    onMatchesChange(updated);
  };

  // Check if there are VVL fields mapped
  const vvlMappings = mappings.filter((m) => VVL_FIELDS.includes(m.erpimsField));
  
  if (vvlMappings.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No VVL Fields to Validate</h3>
        <p className="text-muted-foreground">
          Your column mappings don't include any fields that require Valid Value List validation.
          You can proceed to the next step.
        </p>
      </div>
    );
  }

  const unconfirmedCount = matches.filter((m) => !m.confirmed && m.matchedCode).length;
  const unmatchedCount = matches.filter((m) => !m.matchedCode).length;

  // Filter matches based on search
  const filteredMatches = matches.filter((m) =>
    m.labValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.matchedCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button onClick={runVvlValidation} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Validate VVLs
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
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px]"
          />
          <div className="flex items-center gap-2 text-sm">
            {unmatchedCount > 0 && (
              <Badge variant="destructive">{unmatchedCount} unmatched</Badge>
            )}
            {unconfirmedCount > 0 && (
              <Badge variant="outline">{unconfirmedCount} to confirm</Badge>
            )}
          </div>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2 inline-flex items-center justify-center">
            Ready to Validate
            <InfoTooltip 
              content="Valid Value Lists (VVLs) are standardized codes required by ERPIMS. Your lab values must be translated to these codes for successful data import."
            />
          </h3>
          <p className="text-muted-foreground mb-4">
            Click "Validate VVLs" to match your lab values against ERPIMS Valid Value Lists
          </p>
          <p className="text-sm text-muted-foreground">
            Fields to validate: {vvlMappings.map((m) => m.erpimsField).join(", ")}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Lab Value</TableHead>
                  <TableHead>Matched VVL Code</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.map((match, index) => (
                  <TableRow key={`${match.field}-${match.labValue}-${index}`}>
                    <TableCell>
                      <Badge variant="outline">{match.field}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {match.labValue}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={match.matchedCode}
                        onValueChange={(value) => updateMatch(match.labValue, match.field, value)}
                      >
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="Select matching code..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {vvlOptions[match.field]?.map((option) => (
                            <SelectItem key={option.code} value={option.code}>
                              <span className="font-mono">{option.code}</span>
                              <span className="text-muted-foreground ml-2">
                                {option.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {match.confidence > 0 && (
                        <Badge
                          variant={
                            match.confidence >= 0.95
                              ? "default"
                              : match.confidence >= 0.8
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {Math.round(match.confidence * 100)}%
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {match.confirmed ? (
                        <Badge className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Confirmed
                        </Badge>
                      ) : match.matchedCode ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmMatch(match.labValue, match.field)}
                        >
                          Confirm
                        </Button>
                      ) : (
                        <Badge variant="destructive">Unmatched</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default VvlValidatorStep;
