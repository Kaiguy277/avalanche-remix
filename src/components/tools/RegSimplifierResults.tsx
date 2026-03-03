import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface RegSimplifierResultsProps {
  result: string;
  isStreaming: boolean;
  onReset: () => void;
}

export function RegSimplifierResults({ result, isStreaming, onReset }: RegSimplifierResultsProps) {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {isStreaming ? "Simplifying..." : "Simplified Version"}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!result || isStreaming}
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isStreaming}
          >
            <RotateCcw className="h-4 w-4" />
            Try Another
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {result.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h4 key={i} className="text-primary font-display font-semibold mt-4 mb-2 first:mt-0">
                    {line.replace("## ", "")}
                  </h4>
                );
              }
              if (line.startsWith("- ") || line.startsWith("* ")) {
                return (
                  <div key={i} className="flex gap-2 ml-2 my-1">
                    <span className="text-primary">•</span>
                    <span className="text-foreground">{line.slice(2)}</span>
                  </div>
                );
              }
              if (line.trim()) {
                return (
                  <p key={i} className="text-foreground my-2">
                    {line}
                  </p>
                );
              }
              return null;
            })}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
