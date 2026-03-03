import { useState, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { RegSimplifierForm } from "@/components/tools/RegSimplifierForm";
import { RegSimplifierResults } from "@/components/tools/RegSimplifierResults";
import { RegFinderForm, ContextMode } from "@/components/tools/RegFinderForm";
import { RegFinderResults } from "@/components/tools/RegFinderResults";
import { FollowUpChat } from "@/components/tools/FollowUpChat";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Shield, Zap, Search, BookOpen } from "lucide-react";
import { toast } from "sonner";

const SIMPLIFY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/simplify-regulation`;
const FIND_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/find-regulations`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Mode = "simplify" | "find";

async function streamResponse(
  response: Response,
  onContent: (content: string) => void
): Promise<string> {
  // Check if streaming is supported (some browsers like DuckDuckGo may not support it well)
  if (!response.body || !response.body.getReader) {
    // Fallback: read entire response as text
    const text = await response.text();
    let fullResult = "";
    
    // Parse SSE format from complete text
    for (const line of text.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) {
          fullResult += content;
        }
      } catch {
        // Skip malformed lines
      }
    }
    onContent(fullResult);
    return fullResult;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullResult = "";

  try {
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
  } catch (streamError) {
    console.error("Stream reading error:", streamError);
    // If we got partial content, return it; otherwise throw
    if (fullResult) {
      return fullResult;
    }
    throw new Error("Failed to read response. Please try again.");
  }

  return fullResult;
}

export default function RegSimplifier() {
  const [mode, setMode] = useState<Mode>("find");
  
  // Simplifier state
  const [result, setResult] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [followUpMessages, setFollowUpMessages] = useState<Message[]>([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [followUpStreaming, setFollowUpStreaming] = useState("");

  // Finder state
  const [finderResult, setFinderResult] = useState("");
  const [finderCitations, setFinderCitations] = useState<string[]>([]);
  const [finderQuery, setFinderQuery] = useState("");
  const [finderContextMode, setFinderContextMode] = useState<ContextMode>("research");
  const [finderQuickQuestions, setFinderQuickQuestions] = useState<string[]>([]);
  const [isFinderLoading, setIsFinderLoading] = useState(false);
  const [finderFollowUpMessages, setFinderFollowUpMessages] = useState<Message[]>([]);
  const [isFinderFollowUpLoading, setIsFinderFollowUpLoading] = useState(false);
  const [finderFollowUpStreaming, setFinderFollowUpStreaming] = useState("");

  const handleSimplifySubmit = useCallback(async (text: string) => {
    setIsLoading(true);
    setIsStreaming(true);
    setResult("");
    setOriginalText(text);
    setFollowUpMessages([]);

    try {
      const response = await fetch(SIMPLIFY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to simplify text");
      }

      await streamResponse(response, setResult);
    } catch (error) {
      console.error("Error simplifying text:", error);
      const message = error instanceof Error ? error.message : "Failed to simplify text";
      // Show more helpful message for network/streaming issues
      if (message.includes("load") || message.includes("network") || message.includes("fetch")) {
        toast.error("Connection failed. Please check your internet and try again.");
      } else {
        toast.error(message);
      }
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
      const response = await fetch(SIMPLIFY_URL, {
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

  const handleSimplifyReset = () => {
    setResult("");
    setOriginalText("");
    setFollowUpMessages([]);
  };

  const handleFinderSubmit = useCallback(async (data: {
    projectDescription: string;
    contextMode: ContextMode;
    category?: string;
    location?: string;
    activities?: string[];
  }, retryCount = 0) => {
    setIsFinderLoading(true);
    setFinderResult("");
    setFinderCitations([]);
    setFinderQuery(data.projectDescription);
    setFinderContextMode(data.contextMode);
    setFinderQuickQuestions([]);
    setFinderFollowUpMessages([]);

    const maxRetries = 2;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(FIND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to search regulations");
      }

      // Get response as text first to handle potential parsing issues
      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        throw new Error("Empty response received from server");
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Response:", responseText.substring(0, 200));
        throw new Error("Invalid response format from server");
      }

      setFinderResult(result.content || "No regulations found.");
      setFinderCitations(result.citations || []);
      setFinderQuickQuestions(result.quickQuestions || []);
    } catch (error) {
      console.error("Error finding regulations:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Retry on network/abort errors
      if (retryCount < maxRetries && (
        errorMessage.includes("abort") || 
        errorMessage.includes("network") ||
        errorMessage.includes("Empty response") ||
        errorMessage.includes("Failed to fetch")
      )) {
        console.log(`Retrying... attempt ${retryCount + 1} of ${maxRetries}`);
        toast.info("Connection issue, retrying...");
        setIsFinderLoading(false);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return handleFinderSubmit(data, retryCount + 1);
      }

      // Provide helpful error messages
      if (errorMessage.includes("abort")) {
        toast.error("Request timed out. Please check your connection and try again.");
      } else if (errorMessage.includes("network") || errorMessage.includes("Failed to fetch")) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsFinderLoading(false);
    }
  }, []);

  const handleFinderFollowUp = useCallback(async (question: string) => {
    if (!finderResult || !finderQuery) return;

    setIsFinderFollowUpLoading(true);
    setFinderFollowUpStreaming("");
    setFinderFollowUpMessages(prev => [...prev, { role: "user", content: question }]);

    try {
      const response = await fetch(FIND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          followUp: question,
          previousResult: finderResult,
          originalQuery: finderQuery,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get answer");
      }

      const result = await response.json();
      setFinderFollowUpMessages(prev => [...prev, { role: "assistant", content: result.content }]);
      setFinderFollowUpStreaming("");
    } catch (error) {
      console.error("Error with finder follow-up:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get answer");
      setFinderFollowUpMessages(prev => prev.slice(0, -1));
    } finally {
      setIsFinderFollowUpLoading(false);
    }
  }, [finderResult, finderQuery]);

  const handleFinderReset = () => {
    setFinderResult("");
    setFinderCitations([]);
    setFinderQuery("");
    setFinderContextMode("research");
    setFinderQuickQuestions([]);
    setFinderFollowUpMessages([]);
  };

  const handleSimplifyFromFinder = (text: string) => {
    setMode("simplify");
    setOriginalText(text);
    handleSimplifySubmit(text);
  };

  return (
    <Layout>
      <SEO
        title="Regulation Finder & Simplifier"
        description="Find Alaska DEC regulations and transform complex regulatory text into plain English. AI-powered search for environmental compliance."
        url="https://kaiconsulting.ai/tools/reg-simplifier"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Alaska DEC Regulation Tools
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find applicable regulations for your project or simplify complex regulatory text into plain English.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Search className="h-5 w-5 text-primary" />
                <span>AI-Powered Search</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-5 w-5 text-primary" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>Private & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Mode Toggle */}
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="find" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Find Regulations
                </TabsTrigger>
                <TabsTrigger value="simplify" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Simplify Text
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Find Regulations Mode */}
            {mode === "find" && (
              <>
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <RegFinderForm onSubmit={handleFinderSubmit} isLoading={isFinderLoading} />
                  </CardContent>
                </Card>

                <RegFinderResults
                  content={finderResult}
                  citations={finderCitations}
                  isLoading={isFinderLoading}
                  onReset={handleFinderReset}
                  onSimplify={handleSimplifyFromFinder}
                />

                {/* Finder Follow-up Chat */}
                {finderResult && !isFinderLoading && (
                  <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                      <FollowUpChat
                        onAskQuestion={handleFinderFollowUp}
                        messages={finderFollowUpMessages}
                        isLoading={isFinderFollowUpLoading}
                        streamingContent={finderFollowUpStreaming}
                        quickQuestions={finderQuickQuestions.length > 0 ? finderQuickQuestions : [
                          "Which regulation should I address first?",
                          "Do any of these require permits?",
                          "What are the typical compliance timelines?",
                          "Are there exemptions I might qualify for?",
                        ]}
                      />
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Simplify Text Mode */}
            {mode === "simplify" && (
              <>
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <RegSimplifierForm onSubmit={handleSimplifySubmit} isLoading={isLoading} />
                  </CardContent>
                </Card>

                <RegSimplifierResults 
                  result={result} 
                  isStreaming={isStreaming} 
                  onReset={handleSimplifyReset} 
                />

                {/* Follow-up Chat */}
                {result && !isStreaming && (
                  <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                      <FollowUpChat
                        onAskQuestion={handleFollowUp}
                        messages={followUpMessages}
                        isLoading={isFollowUpLoading}
                        streamingContent={followUpStreaming}
                      />
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This tool provides AI-generated information about Alaska DEC regulations 
            for educational purposes only. It is not legal advice. Always consult with qualified 
            legal or regulatory professionals and verify information with official sources.
          </p>
        </div>
      </section>
    </Layout>
  );
}
