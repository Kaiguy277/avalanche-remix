import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet, X, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParsedData } from "@/pages/ErpimsFormatter";
import * as XLSX from "xlsx";
import InfoTooltip from "./InfoTooltip";
import { analytics } from "@/lib/analytics";

interface FileUploadStepProps {
  parsedData: ParsedData | null;
  onDataParsed: (data: ParsedData | null) => void;
}

const FileUploadStep = ({ parsedData, onDataParsed }: FileUploadStepProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback(async (file: File) => {
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
        defval: "",
      }) as (string | number | null)[][];
      
      if (jsonData.length < 2) {
        throw new Error("File must contain at least a header row and one data row");
      }
      
      // First row is headers
      const headers = jsonData[0].map((h) => String(h || "").trim());
      
      // Rest are data rows
      const rows = jsonData.slice(1).map((row) => {
        const rowData: Record<string, string> = {};
        headers.forEach((header, index) => {
          rowData[header] = String(row[index] || "").trim();
        });
        return rowData;
      }).filter((row) => {
        // Filter out completely empty rows
        return Object.values(row).some((v) => v !== "");
      });
      
      analytics.fileUploaded('erpims_formatter', file.name.split('.').pop() || 'unknown', file.size);
      
      onDataParsed({
        headers,
        rows,
        fileName: file.name,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to parse file";
      setError(message);
      onDataParsed(null);
    }
  }, [onDataParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      parseFile(file);
    }
  }, [parseFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseFile(file);
    }
  }, [parseFile]);

  const handleClear = () => {
    onDataParsed(null);
    setError(null);
  };

  if (parsedData) {
    return (
      <div className="space-y-4">
        {/* File info */}
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">{parsedData.fileName}</p>
              <p className="text-sm text-muted-foreground">
                {parsedData.headers.length} columns • {parsedData.rows.length} rows
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Data preview */}
        <div className="border rounded-lg">
          <div className="p-3 border-b bg-muted/50">
            <h4 className="font-medium text-sm">Data Preview (first 10 rows)</h4>
          </div>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  {parsedData.headers.map((header, index) => (
                    <TableHead key={index} className="whitespace-nowrap font-mono text-xs">
                      {header || `Column ${index + 1}`}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedData.rows.slice(0, 10).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {parsedData.headers.map((header, colIndex) => (
                      <TableCell key={colIndex} className="font-mono text-xs whitespace-nowrap">
                        {row[header] || "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium mb-1">
              Drop your lab data file here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse
            </p>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Select File
            </label>
          </Button>
          <p className="text-xs text-muted-foreground">
            Supported formats: Excel (.xlsx, .xls) and CSV
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Need test data?</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
              <a href="/sample-erpims-data.csv" download>
                <Download className="h-3 w-3 mr-1" />
                Download Sample CSV
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-secondary/50 rounded-lg">
        <h4 className="font-medium mb-2 inline-flex items-center">
          Expected Lab Data Format
          <InfoTooltip 
            content="Lab data should include Sample ID, Collection Date, Matrix, Analyte, Result, Units, and detection limits. One row per analytical result."
          />
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• First row should contain column headers</li>
          <li>• Include columns for: Sample ID, Collection Date, Matrix, Analyte, Result, Units, MDL, RL</li>
          <li>• Multiple analytes per sample are expected (one row per result)</li>
          <li>• Qualifiers (ND, J, etc.) can be in the result or a separate column</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploadStep;
