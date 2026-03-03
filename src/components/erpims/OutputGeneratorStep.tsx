import { useState } from "react";
import JSZip from "jszip";
import { Download, FileText, Loader2, CheckCircle, AlertTriangle, Package, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import InfoTooltip from "./InfoTooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColumnMapping, ParsedData, ProjectContext, VvlMatch } from "@/pages/ErpimsFormatter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OutputGeneratorStepProps {
  projectContext: ProjectContext;
  parsedData: ParsedData | null;
  mappings: ColumnMapping[];
  vvlMatches: VvlMatch[];
}

type GeneratedFiles = {
  sample: string;
  test: string;
  result: string;
  sampleCount: number;
  testCount: number;
  resultCount: number;
};

const OutputGeneratorStep = ({
  projectContext,
  parsedData,
  mappings,
  vvlMatches,
}: OutputGeneratorStepProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFiles | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateFiles = async () => {
    if (!parsedData) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Create a lookup map for VVL matches
      const vvlLookup: Record<string, Record<string, string>> = {};
      for (const match of vvlMatches) {
        if (!vvlLookup[match.field]) {
          vvlLookup[match.field] = {};
        }
        vvlLookup[match.field][match.labValue] = match.matchedCode;
      }

      // Create a column mapping lookup
      const columnLookup: Record<string, string> = {};
      for (const mapping of mappings) {
        if (mapping.erpimsField && mapping.erpimsField !== "IGNORE") {
          columnLookup[mapping.erpimsField] = mapping.labColumn;
        }
      }

      const { data, error: fnError } = await supabase.functions.invoke("erpims-format", {
        body: {
          action: "generate_files",
          projectContext,
          rows: parsedData.rows,
          columnLookup,
          vvlLookup,
        },
      });

      if (fnError) throw fnError;

      if (data?.files) {
        setGeneratedFiles(data.files);
        toast({
          title: "Files generated successfully",
          description: `Generated ${data.files.sampleCount} samples, ${data.files.testCount} tests, ${data.files.resultCount} results`,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate files";
      setError(message);
      toast({
        title: "Generation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllAsZip = async () => {
    if (!generatedFiles) return;

    const zip = new JSZip();
    
    // Add all three files to the ZIP
    zip.file(`SAMPLE_${projectContext.installationId}.txt`, generatedFiles.sample);
    zip.file(`TEST_${projectContext.installationId}.txt`, generatedFiles.test);
    zip.file(`RESULT_${projectContext.installationId}.txt`, generatedFiles.result);
    
    // Generate the ZIP and trigger download
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ERPIMS_${projectContext.installationId}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Package downloaded",
      description: "All ERPIMS files bundled into a single ZIP",
    });
  };

  // Validation checks
  const warnings: string[] = [];
  const confirmedMappings = mappings.filter((m) => m.confirmed && m.erpimsField !== "IGNORE");
  const requiredFields = ["LABSAMPID", "PARLABEL", "PARVAL"];
  
  for (const field of requiredFields) {
    if (!confirmedMappings.some((m) => m.erpimsField === field)) {
      warnings.push(`Missing required field: ${field}`);
    }
  }

  const unmatchedVvls = vvlMatches.filter((m) => !m.matchedCode);
  if (unmatchedVvls.length > 0) {
    warnings.push(`${unmatchedVvls.length} VVL value(s) are unmatched`);
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-secondary/50 rounded-lg text-center">
          <p className="text-2xl font-bold text-primary">
            {parsedData?.rows.length || 0}
          </p>
          <p className="text-sm text-muted-foreground">Data Rows</p>
        </div>
        <div className="p-4 bg-secondary/50 rounded-lg text-center">
          <p className="text-2xl font-bold text-primary">
            {confirmedMappings.length}
          </p>
          <p className="text-sm text-muted-foreground">Mapped Fields</p>
        </div>
        <div className="p-4 bg-secondary/50 rounded-lg text-center">
          <p className="text-2xl font-bold text-primary">
            {vvlMatches.filter((m) => m.confirmed).length}
          </p>
          <p className="text-sm text-muted-foreground">VVL Matches</p>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Generate button */}
      {!generatedFiles && (
        <div className="text-center py-8">
          <Button
            size="lg"
            onClick={generateFiles}
            disabled={isGenerating || warnings.length > 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating Files...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 mr-2" />
                Generate ERPIMS Files
              </>
            )}
          </Button>
          {warnings.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Please resolve warnings before generating files
            </p>
          )}
        </div>
      )}

      {/* Generated files preview */}
      {generatedFiles && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Files Generated Successfully</span>
            </div>
            <Button onClick={downloadAllAsZip}>
              <Package className="h-4 w-4 mr-2" />
              Download Package (ZIP)
            </Button>
          </div>

          <Tabs defaultValue="sample">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sample" className="gap-1">
                SAMPLE.txt
                <InfoTooltip 
                  content="Contains sample metadata: location, date, time, matrix, and collection information."
                />
                <Badge variant="secondary" className="ml-1">
                  {generatedFiles.sampleCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="test" className="gap-1">
                TEST.txt
                <InfoTooltip 
                  content="Contains analytical method information: method codes, analysis dates, and lab identifiers."
                />
                <Badge variant="secondary" className="ml-1">
                  {generatedFiles.testCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="result" className="gap-1">
                RESULT.txt
                <InfoTooltip 
                  content="Contains analytical results: parameter codes, values, units, qualifiers, and detection limits."
                />
                <Badge variant="secondary" className="ml-1">
                  {generatedFiles.resultCount}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sample">
              <div className="border rounded-lg">
                <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                  <span className="text-sm font-medium">SAMPLE.txt Preview (first 10 lines)</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(generatedFiles.sample, `SAMPLE_${projectContext.installationId}.txt`)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                <ScrollArea className="h-[200px]">
                  <pre className="p-4 text-xs font-mono whitespace-pre overflow-x-auto">
                    {generatedFiles.sample.split("\n").slice(0, 10).join("\n")}
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="test">
              <div className="border rounded-lg">
                <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                  <span className="text-sm font-medium">TEST.txt Preview (first 10 lines)</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(generatedFiles.test, `TEST_${projectContext.installationId}.txt`)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                <ScrollArea className="h-[200px]">
                  <pre className="p-4 text-xs font-mono whitespace-pre overflow-x-auto">
                    {generatedFiles.test.split("\n").slice(0, 10).join("\n")}
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="result">
              <div className="border rounded-lg">
                <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                  <span className="text-sm font-medium">RESULT.txt Preview (first 10 lines)</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(generatedFiles.result, `RESULT_${projectContext.installationId}.txt`)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                <ScrollArea className="h-[200px]">
                  <pre className="p-4 text-xs font-mono whitespace-pre overflow-x-auto">
                    {generatedFiles.result.split("\n").slice(0, 10).join("\n")}
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>

          {/* What's Next Instructions */}
          <Alert className="bg-blue-50 border-blue-200 mt-6">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">What's Next?</AlertTitle>
            <AlertDescription className="text-blue-700">
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Extract the ZIP file to a local folder</li>
                <li>Open <strong>ERPTools X</strong> and navigate to <strong>ERPIMS Import</strong></li>
                <li>Select each file (SAMPLE, TEST, RESULT) and import in that order</li>
                <li>Review the import summary for any validation errors</li>
              </ol>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default OutputGeneratorStep;
