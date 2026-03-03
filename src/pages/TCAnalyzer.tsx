import { useState, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { TCAnalyzerForm } from "@/components/tools/TCAnalyzerForm";
import { TCAnalyzerResults } from "@/components/tools/TCAnalyzerResults";
import { TCComparisonForm } from "@/components/tools/TCComparisonForm";
import { TCComparisonResults } from "@/components/tools/TCComparisonResults";
import { FollowUpChat } from "@/components/tools/FollowUpChat";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Shield, Zap, FileText, Scale } from "lucide-react";
import { toast } from "sonner";

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-terms`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function streamResponse(
  response: Response,
  onContent: (content: string) => void
): Promise<string> {
  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullResult = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") break;

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) {
          fullResult += content;
          onContent(fullResult);
        }
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  // Process remaining buffer
  if (buffer.trim()) {
    for (let raw of buffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) {
          fullResult += content;
          onContent(fullResult);
        }
      } catch {
        // Ignore
      }
    }
  }

  return fullResult;
}

const tcQuickQuestions = [
  "Can I opt out of arbitration?",
  "How do I delete my data?",
  "What's the worst clause here?",
  "Is this normal for this type of service?",
];

const comparisonQuickQuestions = [
  "Which document is safer to agree to?",
  "What's the biggest change between them?",
  "Can I negotiate any of these differences?",
  "Which has better data protection?",
];

type AnalyzerMode = "single" | "compare";

export default function TCAnalyzer() {
  const [mode, setMode] = useState<AnalyzerMode>("single");
  const [result, setResult] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [comparisonLabels, setComparisonLabels] = useState<{ labelA?: string; labelB?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [followUpMessages, setFollowUpMessages] = useState<Message[]>([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [followUpStreaming, setFollowUpStreaming] = useState("");

  const handleAnalyzeSubmit = useCallback(async (text: string) => {
    setIsLoading(true);
    setIsStreaming(true);
    setResult("");
    setOriginalText(text);
    setComparisonLabels({});
    setFollowUpMessages([]);

    try {
      const response = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze text");
      }

      await streamResponse(response, setResult);
    } catch (error) {
      console.error("Error analyzing text:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze text");
      setResult("");
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, []);

  const handleCompareSubmit = useCallback(async (textA: string, textB: string, labelA?: string, labelB?: string) => {
    setIsLoading(true);
    setIsStreaming(true);
    setResult("");
    setOriginalText(`${textA}\n\n---\n\n${textB}`);
    setComparisonLabels({ labelA, labelB });
    setFollowUpMessages([]);

    try {
      const response = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ textA, textB, labelA, labelB }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to compare documents");
      }

      await streamResponse(response, setResult);
    } catch (error) {
      console.error("Error comparing documents:", error);
      toast.error(error instanceof Error ? error.message : "Failed to compare documents");
      setResult("");
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, []);

  const handleFollowUp = useCallback(async (question: string) => {
    if (!result || !originalText) return;

    setIsFollowUpLoading(true);
    setFollowUpStreaming("");
    setFollowUpMessages(prev => [...prev, { role: "user", content: question }]);

    try {
      const response = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          followUp: question,
          previousResult: result,
          originalText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get answer");
      }

      const answer = await streamResponse(response, setFollowUpStreaming);
      setFollowUpMessages(prev => [...prev, { role: "assistant", content: answer }]);
      setFollowUpStreaming("");
    } catch (error) {
      console.error("Error with follow-up:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get answer");
      setFollowUpMessages(prev => prev.slice(0, -1));
    } finally {
      setIsFollowUpLoading(false);
    }
  }, [result, originalText]);

  const handleReset = () => {
    setResult("");
    setOriginalText("");
    setComparisonLabels({});
    setFollowUpMessages([]);
  };

  const handleModeChange = (newMode: string) => {
    if (newMode === mode) return;
    handleReset();
    setMode(newMode as AnalyzerMode);
  };

  return (
    <Layout>
      <SEO
        title="T&C Analyzer"
        description="Find hidden gotchas in Terms & Conditions. Get severity ratings, WTF detection, and plain English explanations of legal documents."
        url="https://kaiconsulting.ai/tools/tc-analyzer"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              T&C Analyzer
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find the hidden gotchas in Terms & Conditions. Get severity ratings and plain English explanations.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span>WTF Detection</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-5 w-5 text-primary" />
                <span>Severity Scoring</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>Plain English</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Scale className="h-5 w-5 text-primary" />
                <span>Side-by-Side Compare</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Mode Toggle */}
            <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="single" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Single Analysis
                </TabsTrigger>
                <TabsTrigger value="compare" className="gap-2">
                  <Scale className="h-4 w-4" />
                  Compare Two
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Input Form */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                {mode === "single" ? (
                  <TCAnalyzerForm onSubmit={handleAnalyzeSubmit} isLoading={isLoading} />
                ) : (
                  <TCComparisonForm onSubmit={handleCompareSubmit} isLoading={isLoading} />
                )}
              </CardContent>
            </Card>

            {/* Results */}
            {mode === "single" ? (
              <TCAnalyzerResults 
                result={result} 
                isStreaming={isStreaming} 
                onReset={handleReset} 
              />
            ) : (
              <TCComparisonResults 
                result={result} 
                isStreaming={isStreaming}
                labelA={comparisonLabels.labelA}
                labelB={comparisonLabels.labelB}
                onReset={handleReset} 
              />
            )}

            {/* Follow-up Chat */}
            {result && !isStreaming && (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <FollowUpChat
                    onAskQuestion={handleFollowUp}
                    messages={followUpMessages}
                    isLoading={isFollowUpLoading}
                    streamingContent={followUpStreaming}
                    quickQuestions={mode === "single" ? tcQuickQuestions : comparisonQuickQuestions}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This tool provides AI-generated analysis for informational purposes only. 
            It is not legal advice. For binding agreements, consult with a qualified attorney.
          </p>
        </div>
      </section>
    </Layout>
  );
}
