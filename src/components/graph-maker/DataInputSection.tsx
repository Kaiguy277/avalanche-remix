import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, Plus, Trash2, Download, Eraser, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";

interface DataInputSectionProps {
  data: Record<string, any>[];
  setData: (data: Record<string, any>[]) => void;
  headers: string[];
  setHeaders: (headers: string[]) => void;
  dataDescription: string;
  setDataDescription: (desc: string) => void;
  onClearData?: () => void;
  onReset?: () => void;
}

const DataInputSection = ({ 
  data, 
  setData, 
  headers, 
  setHeaders, 
  dataDescription, 
  setDataDescription,
  onClearData,
  onReset 
}: DataInputSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
        toast.error("No data found in file");
        return;
      }

      const extractedHeaders = Object.keys(jsonData[0] as object);
      setHeaders(extractedHeaders);
      setData(jsonData as Record<string, any>[]);
      setFileName(file.name);
      analytics.fileUploaded('graph_maker', file.name.split('.').pop() || 'unknown', file.size);
      toast.success(`Loaded ${jsonData.length} rows from ${file.name}`);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const addManualColumn = () => {
    const newHeader = `Column ${headers.length + 1}`;
    setHeaders([...headers, newHeader]);
    setData(data.map(row => ({ ...row, [newHeader]: "" })));
  };

  const addManualRow = () => {
    const newRow: Record<string, any> = {};
    headers.forEach(h => (newRow[h] = ""));
    setData([...data, newRow]);
  };

  const updateCell = (rowIndex: number, header: string, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [header]: value };
    setData(newData);
  };

  const updateHeader = (oldHeader: string, newHeader: string) => {
    const newHeaders = headers.map(h => (h === oldHeader ? newHeader : h));
    setHeaders(newHeaders);
    setData(data.map(row => {
      const newRow: Record<string, any> = {};
      headers.forEach((h, i) => {
        newRow[newHeaders[i]] = row[h];
      });
      return newRow;
    }));
  };

  const deleteRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const downloadSampleData = () => {
    const sampleData = [
      { "Sample ID": "MW-01", "Date": "2024-01-15", "GRO (mg/L)": 0.5, "DRO (mg/L)": 0.8, "Benzene (mg/L)": 0.002 },
      { "Sample ID": "MW-02", "Date": "2024-01-15", "GRO (mg/L)": 1.2, "DRO (mg/L)": 2.1, "Benzene (mg/L)": 0.003 },
      { "Sample ID": "MW-03", "Date": "2024-01-15", "GRO (mg/L)": 3.5, "DRO (mg/L)": 1.0, "Benzene (mg/L)": 0.008 },
      { "Sample ID": "MW-04", "Date": "2024-01-15", "GRO (mg/L)": 0.8, "DRO (mg/L)": 0.5, "Benzene (mg/L)": 0.001 },
      { "Sample ID": "MW-05", "Date": "2024-01-15", "GRO (mg/L)": 2.8, "DRO (mg/L)": 1.8, "Benzene (mg/L)": 0.006 },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample Data");
    XLSX.writeFile(wb, "sample-groundwater-data.xlsx");
    toast.success("Sample data downloaded");
  };

  const initManualEntry = () => {
    if (headers.length === 0) {
      setHeaders(["Sample ID", "Value"]);
      setData([{ "Sample ID": "", "Value": "" }]);
    }
  };

  const handleClearData = () => {
    setFileName(null);
    // Reset the file input so the same file can be re-uploaded
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    onClearData?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Data Input
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="manual" onClick={initManualEntry}>Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your CSV or Excel file here, or click to browse
              </p>
              {fileName && (
                <p className="text-sm font-medium text-primary">Loaded: {fileName}</p>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={downloadSampleData} className="gap-2">
              <Download className="h-4 w-4" />
              Download Sample Data
            </Button>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={addManualColumn} className="gap-1">
                <Plus className="h-4 w-4" />
                Add Column
              </Button>
              <Button variant="outline" size="sm" onClick={addManualRow} className="gap-1">
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
            </div>

            {headers.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-64">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, i) => (
                          <TableHead key={i} className="min-w-[120px]">
                            <Input
                              value={header}
                              onChange={(e) => updateHeader(header, e.target.value)}
                              className="h-8 text-xs font-medium"
                            />
                          </TableHead>
                        ))}
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {headers.map((header, colIndex) => (
                            <TableCell key={colIndex} className="p-1">
                              <Input
                                value={row[header] ?? ""}
                                onChange={(e) => updateCell(rowIndex, header, e.target.value)}
                                className="h-8 text-xs"
                              />
                            </TableCell>
                          ))}
                          <TableCell className="p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => deleteRow(rowIndex)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Data Description */}
        {data.length > 0 && (
          <div className="mt-4">
            <Label className="text-sm font-medium mb-2 block">
              Describe Your Data (optional)
            </Label>
            <Textarea
              value={dataDescription}
              onChange={(e) => setDataDescription(e.target.value)}
              placeholder="e.g., 'Groundwater monitoring results from 2024 quarterly sampling' or 'Soil contamination levels at remediation site'"
              className="text-sm resize-none"
              rows={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This helps AI Suggest generate smarter chart configurations
            </p>
          </div>
        )}

        {/* Data Preview */}
        {data.length > 0 && headers.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Data Preview ({data.length} rows)</h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearData}
                  className="gap-1 text-xs"
                >
                  <Eraser className="h-3 w-3" />
                  Clear Data
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onReset}
                  className="gap-1 text-xs"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset All
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-48">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.slice(0, 6).map((header, i) => (
                        <TableHead key={i} className="text-xs">{header}</TableHead>
                      ))}
                      {headers.length > 6 && <TableHead className="text-xs">...</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.slice(0, 5).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {headers.slice(0, 6).map((header, colIndex) => (
                          <TableCell key={colIndex} className="text-xs">
                            {String(row[header] ?? "")}
                          </TableCell>
                        ))}
                        {headers.length > 6 && <TableCell className="text-xs">...</TableCell>}
                      </TableRow>
                    ))}
                    {data.length > 5 && (
                      <TableRow>
                        <TableCell colSpan={Math.min(headers.length, 7)} className="text-xs text-muted-foreground text-center">
                          ... and {data.length - 5} more rows
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataInputSection;