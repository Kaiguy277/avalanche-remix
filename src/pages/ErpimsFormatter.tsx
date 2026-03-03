import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Database, Upload, Wand2, CheckCircle, Download } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectContextStep from "@/components/erpims/ProjectContextStep";
import FileUploadStep from "@/components/erpims/FileUploadStep";
import ColumnMapperStep from "@/components/erpims/ColumnMapperStep";
import VvlValidatorStep from "@/components/erpims/VvlValidatorStep";
import OutputGeneratorStep from "@/components/erpims/OutputGeneratorStep";

export type ProjectContext = {
  installationId: string;
  outputFormat: "prime" | "lab";
  locids: string[];
};

export type ColumnMapping = {
  labColumn: string;
  erpimsField: string;
  confidence: number;
  confirmed: boolean;
};

export type VvlMatch = {
  labValue: string;
  matchedCode: string;
  matchedName: string;
  confidence: number;
  field: string;
  confirmed: boolean;
};

export type ParsedData = {
  headers: string[];
  rows: Record<string, string>[];
  fileName: string;
};

const steps = [
  { id: 1, name: "Project Info", icon: Database },
  { id: 2, name: "Upload Data", icon: Upload },
  { id: 3, name: "Map Columns", icon: Wand2 },
  { id: 4, name: "Validate VVLs", icon: CheckCircle },
  { id: 5, name: "Generate Files", icon: Download },
];

const ErpimsFormatter = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectContext, setProjectContext] = useState<ProjectContext>({
    installationId: "",
    outputFormat: "prime",
    locids: [],
  });
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [vvlMatches, setVvlMatches] = useState<VvlMatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return projectContext.installationId.length === 5;
      case 2:
        return parsedData !== null;
      case 3:
        return columnMappings.length > 0 && columnMappings.every((m) => m.confirmed);
      case 4:
        return vvlMatches.length === 0 || vvlMatches.every((m) => m.confirmed);
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Layout>
      <SEO
        title="ERPIMS Data Formatter"
        description="Transform lab Excel spreadsheets into ERPToolsX-ready fixed-width import files with AI-powered column mapping for Alaska environmental data."
        url="https://kaiconsulting.ai/tools/erpims-formatter"
      />
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-secondary via-background to-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tools" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Built for ERPIMS
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              ERPIMS Data Formatter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform lab Excel spreadsheets into ERPToolsX-ready fixed-width import files
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-6 border-b border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center gap-2 md:gap-4">
              {steps.map((step, index) => (
                <li key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep > step.id
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                    <span className="hidden md:inline text-sm font-medium">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground hidden sm:block" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Step {currentStep}: {steps[currentStep - 1].name}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Enter your project information and ERPIMS configuration"}
                {currentStep === 2 && "Upload your lab data file (Excel or CSV)"}
                {currentStep === 3 && "Review and confirm column mappings to ERPIMS fields"}
                {currentStep === 4 && "Validate values against ERPIMS Valid Value Lists"}
                {currentStep === 5 && "Review and download your formatted ERPIMS files"}
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              {currentStep === 1 && (
                <ProjectContextStep
                  context={projectContext}
                  onChange={setProjectContext}
                />
              )}
              {currentStep === 2 && (
                <FileUploadStep
                  parsedData={parsedData}
                  onDataParsed={setParsedData}
                />
              )}
              {currentStep === 3 && (
                <ColumnMapperStep
                  parsedData={parsedData}
                  mappings={columnMappings}
                  onMappingsChange={setColumnMappings}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              )}
              {currentStep === 4 && (
                <VvlValidatorStep
                  parsedData={parsedData}
                  mappings={columnMappings}
                  matches={vvlMatches}
                  onMatchesChange={setVvlMatches}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              )}
              {currentStep === 5 && (
                <OutputGeneratorStep
                  projectContext={projectContext}
                  parsedData={parsedData}
                  mappings={columnMappings}
                  vvlMatches={vvlMatches}
                />
              )}
            </CardContent>

            {/* Navigation */}
            <div className="flex justify-between p-6 pt-0">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {currentStep < 5 && (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isProcessing}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default ErpimsFormatter;
