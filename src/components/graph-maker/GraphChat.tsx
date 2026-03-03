import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2, BarChart3, LineChart, Target, Ruler, Grid3X3, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string; // base64 image data
}

interface GraphChatProps {
  onSendMessage: (message: string, image?: string) => Promise<void>;
  messages: Message[];
  isLoading: boolean;
}

const quickActions = [
  { label: "Label axes", message: "Label the X-axis as 'Sample Date' and Y-axis as 'Concentration (mg/L)'", icon: Ruler },
  { label: "Bar chart", message: "Make it a bar chart", icon: BarChart3 },
  { label: "Line chart", message: "Make it a line chart", icon: LineChart },
  { label: "Add GW limits", message: "Add all groundwater regulatory limits", icon: Target },
  { label: "Hide grid", message: "Hide the grid", icon: Grid3X3 },
];

const GraphChat = ({ onSendMessage, messages, isLoading }: GraphChatProps) => {
  const [input, setInput] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachedImage) || isLoading) return;
    
    const message = input.trim() || "Copy the style from this chart";
    const image = attachedImage;
    setInput("");
    setAttachedImage(null);
    setImagePreview(null);
    await onSendMessage(message, image || undefined);
  };

  const handleQuickAction = async (message: string) => {
    if (isLoading) return;
    await onSendMessage(message);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAttachedImage(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
    
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    setImagePreview(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5 text-primary" />
          Chat with AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.message)}
              disabled={isLoading}
              className="text-xs"
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="text-xs"
          >
            <ImageIcon className="h-3 w-3 mr-1" />
            Copy style
          </Button>
        </div>

        {/* Message History */}
        {messages.length > 0 && (
          <ScrollArea className="h-[200px] rounded-md border p-3">
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-sm rounded-lg px-3 py-2 max-w-[85%]",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted"
                  )}
                >
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="Attached chart" 
                      className="max-w-full h-auto rounded mb-2 max-h-32 object-contain"
                    />
                  )}
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-muted text-sm rounded-lg px-3 py-2 max-w-[85%] flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Attached" 
              className="h-16 w-auto rounded border"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
              onClick={removeAttachedImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={attachedImage ? "Describe the style to copy..." : "e.g., 'Add benzene limit' or 'Change to scatter plot'"}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !attachedImage)}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GraphChat;