import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, RefreshCw, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface RegFinderResultsProps {
  content: string;
  citations: string[];
  isLoading: boolean;
  onReset: () => void;
  onSimplify: (text: string) => void;
}

export function RegFinderResults({
  content,
  citations,
  isLoading,
  onReset,
  onSimplify,
}: RegFinderResultsProps) {
  const [copied, setCopied] = useState(false);

  if (!content && !isLoading) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Results copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy results");
    }
  };

  // Parse the content to identify regulation sections
  const formatContent = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        elements.push(<div key={index} className="h-2" />);
        return;
      }

      // Headers (lines starting with ## or containing AAC references)
      if (trimmedLine.startsWith("## ") || trimmedLine.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="font-semibold text-lg mt-4 mb-2 text-foreground">
            {trimmedLine.replace(/^#+\s*/, "")}
          </h3>
        );
        return;
      }

      // Bold AAC citations
      if (trimmedLine.match(/^\*\*.*\*\*$/)) {
        elements.push(
          <h4 key={index} className="font-medium text-base mt-3 mb-1 text-primary">
            {trimmedLine.replace(/\*\*/g, "")}
          </h4>
        );
        return;
      }

      // Numbered or bulleted items
      if (trimmedLine.match(/^[\d]+\./) || trimmedLine.match(/^[-•*]/)) {
        elements.push(
          <li key={index} className="ml-4 text-muted-foreground">
            {trimmedLine.replace(/^[\d]+\.\s*/, "").replace(/^[-•*]\s*/, "")}
          </li>
        );
        return;
      }

      // Regular paragraphs
      elements.push(
        <p key={index} className="text-muted-foreground">
          {trimmedLine}
        </p>
      );
    });

    return elements;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Applicable Regulations
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!content || isLoading}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="h-4 w-4 mr-1" />
            New Search
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">Searching Alaska DEC regulations...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="prose prose-sm max-w-none">
              {formatContent(content)}
            </div>

            {citations.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-2">Sources</h4>
                <ul className="space-y-1">
                  {citations.map((citation, index) => (
                    <li key={index}>
                      <a
                        href={citation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {citation.length > 60 ? citation.slice(0, 60) + "..." : citation}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Found a regulation you want to understand better?
              </p>
              <Button
                variant="secondary"
                onClick={() => onSimplify(content)}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Simplify These Regulations
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
