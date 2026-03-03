import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2, MessageCircle } from "lucide-react";

const DEFAULT_QUICK_QUESTIONS = [
  "What are the penalties for non-compliance?",
  "Give me a real-world example",
  "What does this mean for a small business?",
  "How do I get started with compliance?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FollowUpChatProps {
  onAskQuestion: (question: string) => Promise<void>;
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  quickQuestions?: string[];
}

export function FollowUpChat({ onAskQuestion, messages, isLoading, streamingContent, quickQuestions = DEFAULT_QUICK_QUESTIONS }: FollowUpChatProps) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput("");
    await onAskQuestion(question);
  };

  const handleQuickQuestion = async (question: string) => {
    if (isLoading) return;
    await onAskQuestion(question);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MessageCircle className="h-4 w-4" />
        <span>Have questions? Ask for clarification below.</span>
      </div>

      {/* Quick question buttons */}
      <div className="flex flex-wrap gap-2">
        {quickQuestions.map((question) => (
          <Button
            key={question}
            variant="outline"
            size="sm"
            onClick={() => handleQuickQuestion(question)}
            disabled={isLoading}
            className="text-xs"
          >
            {question}
          </Button>
        ))}
      </div>

      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.map((msg, i) => (
            <Card key={i} className={msg.role === "user" ? "bg-primary/5 border-primary/20" : "bg-card"}>
              <CardContent className="py-3 px-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {msg.role === "user" ? "You asked:" : "Answer:"}
                </p>
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {msg.content}
                </div>
              </CardContent>
            </Card>
          ))}
          {isLoading && streamingContent && (
            <Card className="bg-card">
              <CardContent className="py-3 px-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Answer:</p>
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {streamingContent}
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up question..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={!input.trim() || isLoading} size="icon">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
