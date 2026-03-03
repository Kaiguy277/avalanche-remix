import { useState } from "react";
import { BarChart3, LineChart, ScatterChart, AreaChart, Sparkles, Plus, X, Loader2, Layers, PieChart, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { regulatoryLimits, RegulatoryLimit } from "./regulatoryLimits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DEFAULT_COLORS = [
  "hsl(168, 50%, 35%)",
  "hsl(195, 70%, 45%)",
  "hsl(156, 40%, 28%)",
  "hsl(30, 25%, 35%)",
  "hsl(280, 60%, 50%)",
  "hsl(340, 60%, 50%)",
];

const DEFAULT_RIGHT_AXIS_COLORS = [
  "hsl(340, 60%, 50%)",
  "hsl(280, 60%, 50%)",
  "hsl(30, 60%, 50%)",
];

// Convert HSL string to hex for color input
const hslToHex = (hsl: string): string => {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hsl.startsWith('#') ? hsl : '#3b82f6';
  
  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export type ChartType = "line" | "bar" | "scatter" | "area" | "composed" | "stacked-bar" | "stacked-area" | "pie";

export interface CustomLimit {
  id: string;
  name: string;
  value: number;
  color: string;
}

export type LineStyle = "monotone" | "linear" | "step";

export type LegendPosition = "top" | "bottom";
export type LegendAlign = "left" | "center" | "right";
export type LegendLayout = "horizontal" | "vertical";
export type LegendIconType = "line" | "square" | "circle" | "diamond";

export type SeriesType = "line" | "bar" | "area";

export interface SeriesConfig {
  column: string;
  seriesType: SeriesType;
  yAxisId: "left" | "right";
  color?: string;
}

export interface ChartConfig {
  chartType: ChartType;
  xAxis: string;
  yAxes: string[];
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  yAxisMin?: number;
  yAxisMax?: number;
  showLegend: boolean;
  showDataLabels: boolean;
  showGrid: boolean;
  lineStyle: LineStyle;
  strokeWidth: number;
  dotSize: number;
  selectedLimits: string[];
  customLimits: CustomLimit[];
  // Legend customization
  legendPosition: LegendPosition;
  legendAlign: LegendAlign;
  legendLayout: LegendLayout;
  legendIconType: LegendIconType;
  // Dual Y-Axis support
  enableDualYAxis: boolean;
  rightYAxes: string[];
  rightYAxisLabel: string;
  rightYAxisMin?: number;
  rightYAxisMax?: number;
  // Series-level configuration for composed charts
  seriesConfigs: SeriesConfig[];
  // Visual style properties (extracted from reference images)
  colorPalette: string[];
  rightAxisColorPalette: string[];
  fontFamily: string;
  axisFontSize: number;
  labelFontSize: number;
  titleFontSize: number;
  axisColor: string;
  gridColor: string;
  backgroundColor: string;
}

interface ChartConfigSectionProps {
  headers: string[];
  data: Record<string, any>[];
  config: ChartConfig;
  setConfig: (config: ChartConfig) => void;
  dataDescription?: string;
}

const chartTypes: { type: ChartType; icon: typeof LineChart; label: string }[] = [
  { type: "line", icon: LineChart, label: "Line" },
  { type: "bar", icon: BarChart3, label: "Bar" },
  { type: "scatter", icon: ScatterChart, label: "Scatter" },
  { type: "area", icon: AreaChart, label: "Area" },
  { type: "composed", icon: Layers, label: "Mixed" },
  { type: "stacked-bar", icon: BarChart3, label: "Stacked Bar" },
  { type: "stacked-area", icon: AreaChart, label: "Stacked Area" },
  { type: "pie", icon: PieChart, label: "Pie" },
];

const ChartConfigSection = ({ headers, data, config, setConfig, dataDescription }: ChartConfigSectionProps) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [newCustomLimit, setNewCustomLimit] = useState({ name: "", value: "", color: "#ef4444" });

  const updateConfig = (updates: Partial<ChartConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const toggleYAxis = (header: string) => {
    const yAxes = config.yAxes.includes(header)
      ? config.yAxes.filter(y => y !== header)
      : [...config.yAxes, header];
    updateConfig({ yAxes });
  };

  const toggleLimit = (limitId: string) => {
    const selectedLimits = config.selectedLimits.includes(limitId)
      ? config.selectedLimits.filter(id => id !== limitId)
      : [...config.selectedLimits, limitId];
    updateConfig({ selectedLimits });
  };

  const addCustomLimit = () => {
    if (!newCustomLimit.name || !newCustomLimit.value) {
      toast.error("Please enter name and value for custom limit");
      return;
    }
    const customLimit: CustomLimit = {
      id: `custom_${Date.now()}`,
      name: newCustomLimit.name,
      value: parseFloat(newCustomLimit.value),
      color: newCustomLimit.color,
    };
    updateConfig({ customLimits: [...config.customLimits, customLimit] });
    setNewCustomLimit({ name: "", value: "", color: "#ef4444" });
  };

  const removeCustomLimit = (id: string) => {
    updateConfig({ customLimits: config.customLimits.filter(l => l.id !== id) });
  };

  const handleAiSuggest = async () => {
    if (data.length === 0 || headers.length === 0) {
      toast.error("Please upload data first");
      return;
    }

    setIsAiLoading(true);
    try {
      const sampleData = data.slice(0, 10);
      const { data: result, error } = await supabase.functions.invoke("graph-suggest", {
        body: { headers, sampleData, dataDescription },
      });

      if (error) throw error;

      if (result) {
        const updates: Partial<ChartConfig> = {};
        if (result.chartType) updates.chartType = result.chartType;
        if (result.xAxis && headers.includes(result.xAxis)) updates.xAxis = result.xAxis;
        if (result.yAxis && Array.isArray(result.yAxis)) {
          updates.yAxes = result.yAxis.filter((y: string) => headers.includes(y));
        }
        if (result.suggestedLimits && Array.isArray(result.suggestedLimits)) {
          updates.selectedLimits = result.suggestedLimits;
        }
        if (result.titleSuggestion) updates.title = result.titleSuggestion;
        if (result.xAxisLabel) updates.xAxisLabel = result.xAxisLabel;
        if (result.yAxisLabel) updates.yAxisLabel = result.yAxisLabel;
        
        // Dual Y-axis support from AI
        if (result.enableDualYAxis !== undefined) updates.enableDualYAxis = result.enableDualYAxis;
        if (result.rightYAxes && Array.isArray(result.rightYAxes)) {
          updates.rightYAxes = result.rightYAxes.filter((y: string) => headers.includes(y));
        }
        if (result.rightYAxisLabel) updates.rightYAxisLabel = result.rightYAxisLabel;

        updateConfig(updates);
        toast.success("AI suggestions applied!");
      }
    } catch (error) {
      console.error("AI suggest error:", error);
      toast.error("Failed to get AI suggestions");
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleRightYAxis = (header: string) => {
    const rightYAxes = config.rightYAxes.includes(header)
      ? config.rightYAxes.filter(y => y !== header)
      : [...config.rightYAxes, header];
    // Remove from left yAxes if adding to right
    const yAxes = config.yAxes.filter(y => !rightYAxes.includes(y));
    updateConfig({ rightYAxes, yAxes });
  };

  const moveToLeftAxis = (header: string) => {
    const rightYAxes = config.rightYAxes.filter(y => y !== header);
    const yAxes = [...config.yAxes, header];
    updateConfig({ rightYAxes, yAxes });
  };

  // Get the color for a left Y-axis series
  const getSeriesColor = (index: number): string => {
    const palette = config.colorPalette?.length > 0 ? config.colorPalette : DEFAULT_COLORS;
    return hslToHex(palette[index % palette.length]);
  };

  // Get the color for a right Y-axis series
  const getRightSeriesColor = (index: number): string => {
    const palette = config.rightAxisColorPalette?.length > 0 ? config.rightAxisColorPalette : DEFAULT_RIGHT_AXIS_COLORS;
    return hslToHex(palette[index % palette.length]);
  };

  // Update color for a left Y-axis series
  const updateSeriesColor = (index: number, color: string) => {
    const currentPalette = config.colorPalette?.length > 0 ? [...config.colorPalette] : [...DEFAULT_COLORS];
    // Ensure array is long enough
    while (currentPalette.length <= index) {
      currentPalette.push(DEFAULT_COLORS[currentPalette.length % DEFAULT_COLORS.length]);
    }
    currentPalette[index] = color;
    updateConfig({ colorPalette: currentPalette });
  };

  // Update color for a right Y-axis series
  const updateRightSeriesColor = (index: number, color: string) => {
    const currentPalette = config.rightAxisColorPalette?.length > 0 ? [...config.rightAxisColorPalette] : [...DEFAULT_RIGHT_AXIS_COLORS];
    // Ensure array is long enough
    while (currentPalette.length <= index) {
      currentPalette.push(DEFAULT_RIGHT_AXIS_COLORS[currentPalette.length % DEFAULT_RIGHT_AXIS_COLORS.length]);
    }
    currentPalette[index] = color;
    updateConfig({ rightAxisColorPalette: currentPalette });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Chart Configuration
          </CardTitle>
          <Button
            onClick={handleAiSuggest}
            disabled={isAiLoading || data.length === 0}
            size="sm"
            className="gap-2"
          >
            {isAiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            AI Suggest
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Type */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Chart Type</Label>
          <div className="flex gap-2">
            {chartTypes.map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant={config.chartType === type ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig({ chartType: type })}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Axis Configuration */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-medium mb-2 block">X-Axis</Label>
            <Select value={config.xAxis} onValueChange={(v) => updateConfig({ xAxis: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select X-Axis column" />
              </SelectTrigger>
              <SelectContent>
                {headers.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              {config.enableDualYAxis ? "Left Y-Axis" : "Y-Axis"} (select multiple)
            </Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md max-h-24 overflow-y-auto">
              {headers.filter(h => h !== config.xAxis && !config.rightYAxes.includes(h)).map(header => (
                <Badge
                  key={header}
                  variant={config.yAxes.includes(header) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleYAxis(header)}
                >
                  {header}
                </Badge>
              ))}
            </div>
            {/* Left Y-Axis Series Colors */}
            {config.yAxes.length > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-dashed">
                <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Series Colors ({config.yAxes.length})
                </Label>
                <div className="space-y-2">
                  {config.yAxes.map((yAxis, index) => (
                    <div key={yAxis} className="flex items-center gap-3 p-2 bg-secondary/20 rounded">
                      <Input
                        type="color"
                        value={getSeriesColor(index)}
                        onChange={(e) => updateSeriesColor(index, e.target.value)}
                        className="w-10 h-10 p-1 cursor-pointer border-2 rounded"
                      />
                      <span className="text-sm font-medium">{yAxis}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dual Y-Axis Toggle */}
        <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
          <Switch
            id="dualYAxis"
            checked={config.enableDualYAxis}
            onCheckedChange={(v) => updateConfig({ enableDualYAxis: v, rightYAxes: v ? config.rightYAxes : [] })}
          />
          <Label htmlFor="dualYAxis" className="text-sm font-medium">
            Enable Dual Y-Axis
          </Label>
          <span className="text-xs text-muted-foreground ml-2">
            (Plot data with different scales on left and right axes)
          </span>
        </div>

        {/* Right Y-Axis Configuration (when dual axis is enabled) */}
        {config.enableDualYAxis && (
          <div className="p-4 border border-dashed rounded-lg space-y-4 bg-secondary/10">
            <Label className="text-sm font-medium block">Right Y-Axis Columns</Label>
            <div className="flex flex-wrap gap-2">
              {headers.filter(h => h !== config.xAxis && !config.yAxes.includes(h)).map(header => (
                <Badge
                  key={header}
                  variant={config.rightYAxes.includes(header) ? "secondary" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleRightYAxis(header)}
                >
                  {header}
                </Badge>
              ))}
            </div>
            {/* Right Y-Axis Series Colors */}
            {config.rightYAxes.length > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-dashed">
                <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Right Axis Series Colors ({config.rightYAxes.length})
                </Label>
                <div className="space-y-2">
                  {config.rightYAxes.map((yAxis, index) => (
                    <div key={yAxis} className="flex items-center gap-3 p-2 bg-secondary/20 rounded">
                      <Input
                        type="color"
                        value={getRightSeriesColor(index)}
                        onChange={(e) => updateRightSeriesColor(index, e.target.value)}
                        className="w-10 h-10 p-1 cursor-pointer border-2 rounded"
                      />
                      <span className="text-sm font-medium">{yAxis}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label className="text-sm font-medium mb-2 block">Right Y-Axis Label</Label>
                <Input
                  value={config.rightYAxisLabel}
                  onChange={(e) => updateConfig({ rightYAxisLabel: e.target.value })}
                  placeholder="e.g., Stage (ft)"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Right Y Min</Label>
                <Input
                  type="number"
                  value={config.rightYAxisMin ?? ""}
                  onChange={(e) => updateConfig({ rightYAxisMin: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="Auto"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Right Y Max</Label>
                <Input
                  type="number"
                  value={config.rightYAxisMax ?? ""}
                  onChange={(e) => updateConfig({ rightYAxisMax: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="Auto"
                />
              </div>
            </div>
          </div>
        )}

        {/* Chart Title */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Chart Title</Label>
          <Input
            value={config.title}
            onChange={(e) => updateConfig({ title: e.target.value })}
            placeholder="Enter chart title"
          />
        </div>

        {/* Axis Labels */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-medium mb-2 block">X-Axis Label</Label>
            <Input
              value={config.xAxisLabel}
              onChange={(e) => updateConfig({ xAxisLabel: e.target.value })}
              placeholder="e.g., Sample Date"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {config.enableDualYAxis ? "Left " : ""}Y-Axis Label
            </Label>
            <Input
              value={config.yAxisLabel}
              onChange={(e) => updateConfig({ yAxisLabel: e.target.value })}
              placeholder="e.g., Concentration (mg/L)"
            />
          </div>
        </div>

        {/* Y-Axis Range */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {config.enableDualYAxis ? "Left " : ""}Y-Axis Min (optional)
            </Label>
            <Input
              type="number"
              value={config.yAxisMin ?? ""}
              onChange={(e) => updateConfig({ yAxisMin: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="Auto"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {config.enableDualYAxis ? "Left " : ""}Y-Axis Max (optional)
            </Label>
            <Input
              type="number"
              value={config.yAxisMax ?? ""}
              onChange={(e) => updateConfig({ yAxisMax: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="Auto"
            />
          </div>
        </div>

        {/* Line Style (for line/area charts) */}
        {(config.chartType === "line" || config.chartType === "area") && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-sm font-medium mb-2 block">Line Style</Label>
              <Select value={config.lineStyle} onValueChange={(v: LineStyle) => updateConfig({ lineStyle: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monotone">Smooth</SelectItem>
                  <SelectItem value="linear">Straight</SelectItem>
                  <SelectItem value="step">Step</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Line Width</Label>
              <Select value={String(config.strokeWidth)} onValueChange={(v) => updateConfig({ strokeWidth: parseInt(v) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Thin (1px)</SelectItem>
                  <SelectItem value="2">Normal (2px)</SelectItem>
                  <SelectItem value="3">Medium (3px)</SelectItem>
                  <SelectItem value="4">Thick (4px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Dot Size</Label>
              <Select value={String(config.dotSize)} onValueChange={(v) => updateConfig({ dotSize: parseInt(v) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Hidden</SelectItem>
                  <SelectItem value="3">Small</SelectItem>
                  <SelectItem value="4">Normal</SelectItem>
                  <SelectItem value="6">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Display Options */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="legend"
              checked={config.showLegend}
              onCheckedChange={(v) => updateConfig({ showLegend: v })}
            />
            <Label htmlFor="legend" className="text-sm">Show Legend</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="labels"
              checked={config.showDataLabels}
              onCheckedChange={(v) => updateConfig({ showDataLabels: v })}
            />
            <Label htmlFor="labels" className="text-sm">Show Data Labels</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="grid"
              checked={config.showGrid}
              onCheckedChange={(v) => updateConfig({ showGrid: v })}
            />
            <Label htmlFor="grid" className="text-sm">Show Grid</Label>
          </div>
        </div>

        {/* Legend Options (only shown when legend is enabled) */}
        {config.showLegend && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Legend Position</Label>
              <Select value={config.legendPosition} onValueChange={(v: LegendPosition) => updateConfig({ legendPosition: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Legend Alignment</Label>
              <Select value={config.legendAlign} onValueChange={(v: LegendAlign) => updateConfig({ legendAlign: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Legend Layout</Label>
              <Select value={config.legendLayout} onValueChange={(v: LegendLayout) => updateConfig({ legendLayout: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Legend Icon</Label>
              <Select value={config.legendIconType} onValueChange={(v: LegendIconType) => updateConfig({ legendIconType: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="circle">Circle</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Chart Colors */}
        <div className="p-4 border rounded-lg space-y-4 bg-secondary/10">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Chart Colors</Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Axis Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={hslToHex(config.axisColor || "hsl(215, 16%, 47%)")}
                  onChange={(e) => updateConfig({ axisColor: e.target.value })}
                  className="w-10 h-8 p-1 cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">Lines & ticks</span>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Grid Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={hslToHex(config.gridColor || "hsl(214, 32%, 91%)")}
                  onChange={(e) => updateConfig({ gridColor: e.target.value })}
                  className="w-10 h-8 p-1 cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">Grid lines</span>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Background</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={config.backgroundColor && config.backgroundColor !== "transparent" ? hslToHex(config.backgroundColor) : "#ffffff"}
                  onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                  className="w-10 h-8 p-1 cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">Chart area</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Limits */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Regulatory Reference Lines</Label>
          <Accordion type="multiple" className="w-full">
            {regulatoryLimits.map(category => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="text-sm">{category.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {category.limits.map(limit => (
                      <div key={limit.id} className="flex items-center gap-2">
                        <Checkbox
                          id={limit.id}
                          checked={config.selectedLimits.includes(limit.id)}
                          onCheckedChange={() => toggleLimit(limit.id)}
                        />
                        <label
                          htmlFor={limit.id}
                          className="text-sm flex items-center gap-2 cursor-pointer"
                        >
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: limit.color }}
                          />
                          {limit.name}: {limit.value} {limit.unit}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Custom Limits */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Custom Reference Lines</Label>
          <div className="space-y-3">
            {config.customLimits.map(limit => (
              <div key={limit.id} className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: limit.color }} />
                <span className="text-sm flex-1">{limit.name}: {limit.value}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeCustomLimit(limit.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="flex gap-2">
              <Input
                placeholder="Name"
                value={newCustomLimit.name}
                onChange={(e) => setNewCustomLimit({ ...newCustomLimit, name: e.target.value })}
                className="flex-1"
              />
              <Input
                placeholder="Value"
                type="number"
                value={newCustomLimit.value}
                onChange={(e) => setNewCustomLimit({ ...newCustomLimit, value: e.target.value })}
                className="w-24"
              />
              <Input
                type="color"
                value={newCustomLimit.color}
                onChange={(e) => setNewCustomLimit({ ...newCustomLimit, color: e.target.value })}
                className="w-12 p-1 h-10"
              />
              <Button variant="outline" size="icon" onClick={addCustomLimit}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartConfigSection;
