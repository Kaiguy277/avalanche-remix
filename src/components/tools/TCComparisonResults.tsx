import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, RotateCcw, Scale } from "lucide-react";
import { toast } from "sonner";

interface TCComparisonResultsProps {
  result: string;
  isStreaming: boolean;
  labelA?: string;
  labelB?: string;
  onReset: () => void;
}

export function TCComparisonResults({ result, isStreaming, labelA, labelB, onReset }: TCComparisonResultsProps) {
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

  const renderContent = () => {
    const lines = result.split("\n");
    const elements: JSX.Element[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Document identification header
      if (trimmedLine.startsWith("## Document Identification") || trimmedLine.startsWith("## Key Differences")) {
        elements.push(
          <h2 key={index} className="text-xl font-bold text-foreground mt-8 mb-4 border-b border-border pb-2 flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            {trimmedLine.replace("## ", "")}
          </h2>
        );
      }
      // Overall Verdict section
      else if (trimmedLine.startsWith("## Overall Verdict")) {
        elements.push(
          <div key={index} className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Overall Verdict
            </h2>
          </div>
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
      // Document A is WORSE
      else if (trimmedLine.startsWith("### 🔴 Document A is WORSE") || trimmedLine.includes("Document A is WORSE")) {
        elements.push(
          <div key={index} className="mt-6 mb-3 p-3 bg-destructive/10 border-l-4 border-destructive rounded-r">
            <h3 className="font-bold text-destructive">
              🔴 {labelA || "Document A"} is WORSE in:
            </h3>
          </div>
        );
      }
      // Document A is BETTER / Document B is WORSE
      else if (trimmedLine.startsWith("### 🟢 Document A is BETTER") || trimmedLine.includes("Document A is BETTER")) {
        elements.push(
          <div key={index} className="mt-6 mb-3 p-3 bg-green-500/10 border-l-4 border-green-500 rounded-r">
            <h3 className="font-bold text-green-600 dark:text-green-400">
              🟢 {labelA || "Document A"} is BETTER in:
            </h3>
          </div>
        );
      }
      // Roughly Equal
      else if (trimmedLine.startsWith("### ⚖️") || trimmedLine.includes("Roughly Equal")) {
        elements.push(
          <div key={index} className="mt-6 mb-3 p-3 bg-muted border-l-4 border-muted-foreground/50 rounded-r">
            <h3 className="font-bold text-muted-foreground">
              ⚖️ Roughly Equal:
            </h3>
          </div>
        );
      }
      // Sub-headers
      else if (trimmedLine.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold text-foreground mt-6 mb-3">
            {trimmedLine.replace("### ", "")}
          </h3>
        );
      }
      // Winner indication
      else if (trimmedLine.startsWith("- **More Consumer-Friendly:**") || trimmedLine.startsWith("**More Consumer-Friendly:**")) {
        const winner = trimmedLine.replace(/[-*]/g, "").replace("More Consumer-Friendly:", "").trim();
        const isA = winner.toLowerCase().includes("document a") || winner.toLowerCase().includes(labelA?.toLowerCase() || "");
        const isB = winner.toLowerCase().includes("document b") || winner.toLowerCase().includes(labelB?.toLowerCase() || "");
        const isTie = winner.toLowerCase().includes("equal") || winner.toLowerCase().includes("tie");
        
        elements.push(
          <div key={index} className={`p-3 rounded-lg mt-2 ${
            isTie ? "bg-muted" : isA ? "bg-green-500/10" : isB ? "bg-blue-500/10" : "bg-muted"
          }`}>
            <span className="font-semibold">More Consumer-Friendly: </span>
            <span className={`font-bold ${
              isTie ? "text-muted-foreground" : isA ? "text-green-600 dark:text-green-400" : isB ? "text-blue-600 dark:text-blue-400" : ""
            }`}>
              {winner}
            </span>
          </div>
        );
      }
      // Recommendation
      else if (trimmedLine.startsWith("- **Recommendation:**") || trimmedLine.startsWith("**Recommendation:**")) {
        elements.push(
          <p key={index} className="mt-3 p-3 bg-primary/5 rounded">
            <span className="font-semibold text-primary">Recommendation: </span>
            <span className="text-foreground">{trimmedLine.replace(/[-*]/g, "").replace("Recommendation:", "").trim()}</span>
          </p>
        );
      }
      // Key Takeaway
      else if (trimmedLine.startsWith("- **Key Takeaway:**") || trimmedLine.startsWith("**Key Takeaway:**")) {
        elements.push(
          <p key={index} className="mt-3 p-3 bg-accent/50 rounded border-l-4 border-accent">
            <span className="font-semibold">Key Takeaway: </span>
            <span className="text-foreground">{trimmedLine.replace(/[-*]/g, "").replace("Key Takeaway:", "").trim()}</span>
          </p>
        );
      }
      // Table rows (basic rendering)
      else if (trimmedLine.startsWith("|")) {
        // Skip separator rows
        if (trimmedLine.includes("---")) return;
        
        const cells = trimmedLine.split("|").filter(cell => cell.trim());
        if (cells.length >= 3) {
          const isHeader = index > 0 && lines[index - 1]?.includes("---") === false && 
                          lines[index + 1]?.includes("---");
          elements.push(
            <div key={index} className={`grid grid-cols-4 gap-2 py-2 px-2 text-sm ${
              isHeader ? "font-semibold bg-muted rounded" : "border-b border-border/50"
            }`}>
              {cells.slice(0, 4).map((cell, i) => (
                <div key={i} className={`${
                  cell.trim() === "A" || cell.trim().includes("Document A") ? "text-green-600 dark:text-green-400 font-medium" :
                  cell.trim() === "B" || cell.trim().includes("Document B") ? "text-blue-600 dark:text-blue-400 font-medium" :
                  cell.trim() === "Tie" ? "text-muted-foreground" : ""
                }`}>
                  {cell.trim()}
                </div>
              ))}
            </div>
          );
        }
      }
      // Bold fields
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
          <Scale className="h-5 w-5 text-primary" />
          Comparison Results
          {labelA && labelB && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({labelA} vs {labelB})
            </span>
          )}
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
            New Comparison
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
