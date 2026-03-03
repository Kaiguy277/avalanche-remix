import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Loader2, Trash2, Sparkles, Upload, X, FileCheck, Scale } from "lucide-react";
import { extractTextFromPDF, PDFParseResult } from "@/lib/pdfParser";
import { toast } from "sonner";

interface TCComparisonFormProps {
  onSubmit: (textA: string, textB: string, labelA?: string, labelB?: string) => Promise<void>;
  isLoading: boolean;
}

interface DocumentState {
  text: string;
  label: string;
  uploadedFile: { name: string; pageCount: number } | null;
  isDragOver: boolean;
  isParsing: boolean;
}

const EXAMPLE_OLD_VS_NEW = {
  labelA: "Platform T&C (2020)",
  textA: `Your data is stored securely and not shared with third parties except as required by law.

We use cookies for essential functionality only. You can manage cookie preferences in settings.

Account deletion is available through settings. Upon deletion, your data is removed within 30 days.

We will notify you via email of any material changes to these terms at least 30 days in advance.`,
  labelB: "Platform T&C (2024)",
  textB: `Your data may be shared with our advertising partners and affiliated companies to provide personalized experiences.

We and our partners use cookies, pixels, and similar technologies to track your activity across the web.

Account deletion requests must be submitted in writing. We retain your data for up to 5 years for legal purposes.

We may modify these terms at any time. Continued use constitutes acceptance of changes.

You grant us a perpetual, irrevocable license to use your content for AI training purposes.`,
};

const EXAMPLE_FREE_VS_PAID = {
  labelA: "Free Tier Agreement",
  textA: `Free accounts include advertising. We share your data with ad partners to personalize ads.

Free accounts have limited support (community forums only).

We may terminate free accounts at any time for any reason.

Free accounts are subject to usage limits and rate throttling.`,
  labelB: "Premium Agreement",
  textB: `Premium accounts are ad-free. Your data is not shared with advertising partners.

Premium accounts include priority email and chat support with 24-hour response time.

Premium accounts may only be terminated for material breach with 30 days notice.

Premium accounts have no usage limits during the subscription term.`,
};

const maxCharsPerDoc = 35000;

export function TCComparisonForm({ onSubmit, isLoading }: TCComparisonFormProps) {
  const [docA, setDocA] = useState<DocumentState>({
    text: "",
    label: "",
    uploadedFile: null,
    isDragOver: false,
    isParsing: false,
  });
  const [docB, setDocB] = useState<DocumentState>({
    text: "",
    label: "",
    uploadedFile: null,
    isDragOver: false,
    isParsing: false,
  });
  
  const fileInputRefA = useRef<HTMLInputElement>(null);
  const fileInputRefB = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docA.text.trim() || !docB.text.trim() || isLoading) return;
    await onSubmit(docA.text.trim(), docB.text.trim(), docA.label.trim() || undefined, docB.label.trim() || undefined);
  };

  const handlePDFUpload = async (file: File, setDoc: React.Dispatch<React.SetStateAction<DocumentState>>) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be under 20MB");
      return;
    }

    setDoc(prev => ({ ...prev, isParsing: true }));
    try {
      const result: PDFParseResult = await extractTextFromPDF(file);
      
      if (!result.text || result.text.length < 50) {
        toast.error("Could not extract text from PDF. It may be scanned or image-based.");
        return;
      }

      if (result.text.length > maxCharsPerDoc) {
        toast.warning(`PDF text (${result.text.length.toLocaleString()} chars) exceeds limit. Text was truncated.`);
        setDoc(prev => ({
          ...prev,
          text: result.text.slice(0, maxCharsPerDoc),
          uploadedFile: { name: file.name, pageCount: result.pageCount },
        }));
      } else {
        setDoc(prev => ({
          ...prev,
          text: result.text,
          uploadedFile: { name: file.name, pageCount: result.pageCount },
        }));
        toast.success(`Extracted ${result.text.length.toLocaleString()} characters from ${result.pageCount} pages`);
      }
    } catch (error) {
      console.error("PDF parsing error:", error);
      toast.error("Failed to parse PDF. It may be encrypted or corrupted.");
    } finally {
      setDoc(prev => ({ ...prev, isParsing: false }));
    }
  };

  const loadExample = (example: typeof EXAMPLE_OLD_VS_NEW) => {
    setDocA({
      text: example.textA,
      label: example.labelA,
      uploadedFile: null,
      isDragOver: false,
      isParsing: false,
    });
    setDocB({
      text: example.textB,
      label: example.labelB,
      uploadedFile: null,
      isDragOver: false,
      isParsing: false,
    });
  };

  const clearAll = () => {
    setDocA({ text: "", label: "", uploadedFile: null, isDragOver: false, isParsing: false });
    setDocB({ text: "", label: "", uploadedFile: null, isDragOver: false, isParsing: false });
  };

  const renderDocumentPanel = (
    doc: DocumentState,
    setDoc: React.Dispatch<React.SetStateAction<DocumentState>>,
    label: string,
    fileInputRef: React.RefObject<HTMLInputElement>
  ) => (
    <div className="space-y-3 flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {label}
        </label>
        <span className={`text-xs ${doc.text.length > maxCharsPerDoc ? "text-destructive" : "text-muted-foreground"}`}>
          {doc.text.length.toLocaleString()} / {maxCharsPerDoc.toLocaleString()}
        </span>
      </div>
      
      <Input
        value={doc.label}
        onChange={(e) => setDoc(prev => ({ ...prev, label: e.target.value }))}
        placeholder="Label (e.g., 'Facebook 2024')"
        className="text-sm"
        disabled={isLoading || doc.isParsing}
      />
      
      <Textarea
        value={doc.text}
        onChange={(e) => setDoc(prev => ({ ...prev, text: e.target.value, uploadedFile: null }))}
        placeholder="Paste Terms & Conditions here..."
        className="min-h-[180px] font-mono text-sm resize-none"
        disabled={isLoading || doc.isParsing}
      />

      {/* PDF Upload Zone */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          setDoc(prev => ({ ...prev, isDragOver: false }));
          const file = e.dataTransfer.files?.[0];
          if (file) handlePDFUpload(file, setDoc);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDoc(prev => ({ ...prev, isDragOver: true }));
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDoc(prev => ({ ...prev, isDragOver: false }));
        }}
        className={`
          relative border-2 border-dashed rounded-lg p-3 transition-colors cursor-pointer
          ${doc.isDragOver 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }
          ${doc.isParsing ? "pointer-events-none opacity-60" : ""}
        `}
        onClick={() => !doc.isParsing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePDFUpload(file, setDoc);
            e.target.value = '';
          }}
          className="hidden"
          disabled={isLoading || doc.isParsing}
        />
        
        {doc.isParsing ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Extracting text...</span>
          </div>
        ) : doc.uploadedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <FileCheck className="h-4 w-4 text-green-600" />
              <span className="font-medium truncate">{doc.uploadedFile.name}</span>
              <span className="text-muted-foreground">({doc.uploadedFile.pageCount}p)</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setDoc(prev => ({ ...prev, text: "", uploadedFile: null }));
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-1">
            <Upload className="h-4 w-4" />
            <span className="text-xs">Drop PDF or click</span>
          </div>
        )}
      </div>
    </div>
  );

  const isParsing = docA.isParsing || docB.isParsing;
  const hasContent = docA.text.trim() || docB.text.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Side-by-side document panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {renderDocumentPanel(docA, setDocA, "Document A", fileInputRefA)}
        {renderDocumentPanel(docB, setDocB, "Document B", fileInputRefB)}
      </div>

      {/* Example Buttons */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Try an example comparison:</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadExample(EXAMPLE_OLD_VS_NEW)}
            disabled={isLoading || isParsing}
            className="text-xs"
          >
            Old vs New Policy
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadExample(EXAMPLE_FREE_VS_PAID)}
            disabled={isLoading || isParsing}
            className="text-xs"
          >
            Free vs Paid Tier
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
          disabled={!hasContent || isLoading || isParsing}
          className="shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button 
          type="submit" 
          disabled={
            !docA.text.trim() || 
            !docB.text.trim() || 
            docA.text.length > maxCharsPerDoc || 
            docB.text.length > maxCharsPerDoc || 
            isLoading || 
            isParsing
          }
          className="flex-1 gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Comparing...
            </>
          ) : (
            <>
              <Scale className="h-4 w-4" />
              Compare Documents
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
