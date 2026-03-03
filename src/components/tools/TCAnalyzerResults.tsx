import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, RotateCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TCAnalyzerResultsProps {
  result: string;
  isStreaming: boolean;
  onReset: () => void;
}

export function TCAnalyzerResults({ result, isStreaming, onReset }: TCAnalyzerResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (!result && !isStreaming) return null;

  // Parse the result for enhanced rendering
  const renderContent = () => {
    const lines = result.split("\n");
    const elements: JSX.Element[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Summary section header
      if (trimmedLine.startsWith("## Summary")) {
        elements.push(
          <h2 key={index} className="text-xl font-bold text-foreground mt-6 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Summary
          </h2>
        );
      }
      // Category headers
      else if (trimmedLine.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-xl font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">
            {trimmedLine.replace("## ", "")}
          </h2>
        );
      }
      // Finding headers with severity
      else if (trimmedLine.startsWith("### 🔴")) {
        elements.push(
          <div key={index} className="mt-6 mb-3 p-3 bg-destructive/10 border-l-4 border-destructive rounded-r">
            <h3 className="font-bold text-destructive">
              {trimmedLine.replace("### ", "")}
            </h3>
          </div>
        );
      }
      else if (trimmedLine.startsWith("### 🟠")) {
        elements.push(
          <div key={index} className="mt-6 mb-3 p-3 bg-orange-500/10 border-l-4 border-orange-500 rounded-r">
            <h3 className="font-bold text-orange-600 dark:text-orange-400">
              {trimmedLine.replace("### ", "")}
            </h3>
          </div>
        );
      }
      else if (trimmedLine.startsWith("### 🟡")) {
        elements.push(
          <div key={index} className="mt-6 mb-3 p-3 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r">
            <h3 className="font-bold text-yellow-600 dark:text-yellow-400">
              {trimmedLine.replace("### ", "")}
            </h3>
          </div>
        );
      }
      else if (trimmedLine.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold text-foreground mt-6 mb-3">
            {trimmedLine.replace("### ", "")}
          </h3>
        );
      }
      // Bold field labels
      else if (trimmedLine.startsWith("**What it says:**")) {
        elements.push(
          <div key={index} className="mt-3 p-3 bg-muted/50 rounded border-l-2 border-muted-foreground/30 italic">
            <span className="font-semibold text-foreground not-italic">What it says: </span>
            <span className="text-muted-foreground">{trimmedLine.replace("**What it says:**", "").trim()}</span>
          </div>
        );
      }
      else if (trimmedLine.startsWith("**Plain English:**")) {
        elements.push(
          <div key={index} className="mt-2 p-3 bg-primary/5 rounded">
            <span className="font-semibold text-primary">Plain English: </span>
            <span className="text-foreground">{trimmedLine.replace("**Plain English:**", "").trim()}</span>
          </div>
        );
      }
      else if (trimmedLine.startsWith("**Why it matters:**")) {
        elements.push(
          <p key={index} className="mt-2 text-foreground">
            <span className="font-semibold">Why it matters: </span>
            {trimmedLine.replace("**Why it matters:**", "").trim()}
          </p>
        );
      }
      else if (trimmedLine.startsWith("**Comparison:**")) {
        elements.push(
          <p key={index} className="mt-2 text-muted-foreground text-sm">
            <span className="font-semibold">Comparison: </span>
            {trimmedLine.replace("**Comparison:**", "").trim()}
          </p>
        );
      }
      // Other bold fields (for summary section)
      else if (trimmedLine.startsWith("- **")) {
        const content = trimmedLine.replace("- **", "").replace("**", ":");
        elements.push(
          <p key={index} className="text-foreground ml-4">
            • <span className="font-semibold">{content}</span>
          </p>
        );
      }
      // List items
      else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        elements.push(
          <li key={index} className="text-foreground ml-6 list-disc">
            {trimmedLine.slice(2)}
          </li>
        );
      }
      // Non-empty regular lines
      else if (trimmedLine) {
        elements.push(
          <p key={index} className="text-foreground">
            {trimmedLine}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Analysis Results
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!result || isStreaming}
            className="gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isStreaming}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Another
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-2">
          {renderContent()}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
