import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2, Trash2, Sparkles, Upload, X, FileCheck } from "lucide-react";
import { extractTextFromPDF, PDFParseResult } from "@/lib/pdfParser";
import { toast } from "sonner";

interface TCAnalyzerFormProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading: boolean;
}

const EXAMPLE_SOCIAL_MEDIA = `By using our service, you grant us a non-exclusive, royalty-free, transferable, sub-licensable, worldwide license to use, copy, modify, create derivative works from, distribute, publicly display, publicly perform, and otherwise exploit your content in all media formats and distribution methods now known or later developed.

We may share your information with third-party advertising partners to deliver personalized advertisements. We retain your data indefinitely, even after account deletion.

Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive any right to participate in a class action lawsuit.

We may modify these terms at any time without prior notice. Your continued use constitutes acceptance of the modified terms.

We track your location, access your contacts, and may use your likeness in promotional materials without compensation.`;

const EXAMPLE_SAAS = `Subscription automatically renews at the then-current rate unless cancelled at least 30 days before the renewal date. Cancellation requests must be submitted in writing to our legal department.

All fees are non-refundable. We reserve the right to increase subscription fees at any time with 15 days notice.

Upon termination for any reason, we retain a perpetual license to any data, content, or materials you uploaded during your subscription.

We are not liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues.

Any disputes must be brought exclusively in the courts of Delaware.`;

const EXAMPLE_FREE_APP = `We collect and may sell anonymized usage data to third parties. "Anonymized" means we remove your name but may include your location, device identifiers, browsing history, and behavioral patterns.

We partner with data brokers who may combine your information with data from other sources to create detailed consumer profiles.

You consent to receiving promotional communications. You may opt out, but operational messages (which may include promotional content) cannot be disabled.

We may access your camera, microphone, and files at any time the app is running.

This free version is ad-supported. Ads may be targeted based on your personal data and conversations.`;

export function TCAnalyzerForm({ onSubmit, isLoading }: TCAnalyzerFormProps) {
  const [text, setText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; pageCount: number } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 70000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    await onSubmit(text.trim());
  };

  const loadExample = (example: string) => {
    setText(example);
    setUploadedFile(null);
  };

  const handlePDFUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be under 20MB");
      return;
    }

    setIsParsing(true);
    try {
      const result: PDFParseResult = await extractTextFromPDF(file);
      
      if (!result.text || result.text.length < 50) {
        toast.error("Could not extract text from PDF. It may be scanned or image-based.");
        return;
      }

      if (result.text.length > maxChars) {
        toast.warning(`PDF text (${result.text.length.toLocaleString()} chars) exceeds limit. Text was truncated.`);
        setText(result.text.slice(0, maxChars));
      } else {
        setText(result.text);
        toast.success(`Extracted ${result.text.length.toLocaleString()} characters from ${result.pageCount} pages`);
      }
      
      setUploadedFile({ name: file.name, pageCount: result.pageCount });
    } catch (error) {
      console.error("PDF parsing error:", error);
      toast.error("Failed to parse PDF. It may be encrypted or corrupted.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePDFUpload(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePDFUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const clearAll = () => {
    setText("");
    setUploadedFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Paste Terms & Conditions
          </label>
          <span className={`text-xs ${text.length > maxChars ? "text-destructive" : "text-muted-foreground"}`}>
            {text.length.toLocaleString()} / {maxChars.toLocaleString()}
          </span>
        </div>
        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (uploadedFile) setUploadedFile(null);
          }}
          placeholder="Paste the Terms & Conditions, Privacy Policy, or user agreement you want analyzed..."
          className="min-h-[200px] font-mono text-sm"
          disabled={isLoading || isParsing}
        />
      </div>

      {/* PDF Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer
          ${isDragOver 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }
          ${isParsing ? "pointer-events-none opacity-60" : ""}
        `}
        onClick={() => !isParsing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading || isParsing}
        />
        
        {isParsing ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Extracting text from PDF...</span>
          </div>
        ) : uploadedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <FileCheck className="h-5 w-5 text-green-600" />
              <span className="font-medium">{uploadedFile.name}</span>
              <span className="text-muted-foreground">({uploadedFile.pageCount} pages)</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground py-2">
            <Upload className="h-5 w-5" />
            <span className="text-sm">Drop PDF here or click to upload</span>
            <span className="text-xs">Supports .pdf files up to 20MB</span>
          </div>
        )}
      </div>

      {/* Example Buttons */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadExample(EXAMPLE_SOCIAL_MEDIA)}
            disabled={isLoading || isParsing}
            className="text-xs"
          >
            Social Media T&C
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadExample(EXAMPLE_SAAS)}
            disabled={isLoading || isParsing}
            className="text-xs"
          >
            SaaS Agreement
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadExample(EXAMPLE_FREE_APP)}
            disabled={isLoading || isParsing}
            className="text-xs"
          >
            Free App Privacy Policy
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clearAll}
          disabled={(!text && !uploadedFile) || isLoading || isParsing}
          className="shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button 
          type="submit" 
          disabled={!text.trim() || text.length > maxChars || isLoading || isParsing}
          className="flex-1 gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze for Red Flags
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
