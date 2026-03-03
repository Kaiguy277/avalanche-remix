import { useRef, useCallback } from "react";
import { Download, Copy, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Label,
  LabelList,
} from "recharts";
import { ChartConfig, CustomLimit } from "./ChartConfigSection";
import { getLimitById } from "./regulatoryLimits";
import { toast } from "sonner";

interface ChartPreviewProps {
  data: Record<string, any>[];
  config: ChartConfig;
}

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

const ChartPreview = ({ data, config }: ChartPreviewProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Use custom colors from config or fall back to defaults
  const COLORS = config.colorPalette?.length > 0 ? config.colorPalette : DEFAULT_COLORS;
  const RIGHT_AXIS_COLORS = config.rightAxisColorPalette?.length > 0 ? config.rightAxisColorPalette : DEFAULT_RIGHT_AXIS_COLORS;
  
  // Dynamic style values with fallbacks
  const fontFamily = config.fontFamily || "inherit";
  const axisFontSize = config.axisFontSize || 11;
  const labelFontSize = config.labelFontSize || 12;
  const titleFontSize = config.titleFontSize || 18;
  const axisColor = config.axisColor || "hsl(var(--muted-foreground))";
  const gridColor = config.gridColor || "hsl(var(--border))";
  const backgroundColor = config.backgroundColor || "transparent";

  const getAllReferenceLimits = (): (CustomLimit & { regulation?: string; unit?: string })[] => {
    const regulatoryLimits = config.selectedLimits
      .map(id => getLimitById(id))
      .filter(Boolean)
      .map(limit => ({
        id: limit!.id,
        name: limit!.name,
        value: limit!.value,
        color: limit!.color,
        regulation: limit!.regulation,
        unit: limit!.unit,
      }));

    return [...regulatoryLimits, ...config.customLimits];
  };

  const downloadAsPng = useCallback(async () => {
    if (!chartRef.current) return;

    try {
      const svg = chartRef.current.querySelector("svg");
      if (!svg) {
        toast.error("No chart to download");
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = svg.clientWidth * 2;
        canvas.height = svg.clientHeight * 2;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = `${config.title || "chart"}.png`;
          link.href = pngUrl;
          link.click();
          toast.success("Chart downloaded as PNG");
        }
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download chart");
    }
  }, [config.title]);

  const downloadAsSvg = useCallback(() => {
    if (!chartRef.current) return;

    const svg = chartRef.current.querySelector("svg");
    if (!svg) {
      toast.error("No chart to download");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.download = `${config.title || "chart"}.svg`;
    link.href = svgUrl;
    link.click();
    URL.revokeObjectURL(svgUrl);
    toast.success("Chart downloaded as SVG");
  }, [config.title]);

  const copyToClipboard = useCallback(async () => {
    if (!chartRef.current) return;

    try {
      const svg = chartRef.current.querySelector("svg");
      if (!svg) {
        toast.error("No chart to copy");
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new window.Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = svg.clientWidth * 2;
        canvas.height = svg.clientHeight * 2;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (blob) => {
            if (blob) {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);
              toast.success("Chart copied to clipboard");
            }
          });
        }
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy chart");
    }
  }, []);

  const referenceLimits = getAllReferenceLimits();

  const renderChart = () => {
    if (data.length === 0 || !config.xAxis || (config.yAxes.length === 0 && config.rightYAxes.length === 0 && config.chartType !== "pie")) {
      return (
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Configure your chart to see the preview</p>
            <p className="text-sm mt-2">Upload data and select X and Y axes</p>
          </div>
        </div>
      );
    }

    const rightMargin = config.enableDualYAxis && config.rightYAxes.length > 0 ? 60 : 30;
    const commonProps = {
      data,
      margin: { top: 20, right: rightMargin, left: config.yAxisLabel ? 50 : 20, bottom: config.xAxisLabel ? 50 : 30 },
    };

    const yDomain: [number | "auto", number | "auto"] = [
      config.yAxisMin !== undefined ? config.yAxisMin : "auto",
      config.yAxisMax !== undefined ? config.yAxisMax : "auto",
    ];

    const rightYDomain: [number | "auto", number | "auto"] = [
      config.rightYAxisMin !== undefined ? config.rightYAxisMin : "auto",
      config.rightYAxisMax !== undefined ? config.rightYAxisMax : "auto",
    ];

    const renderReferenceLines = (yAxisId?: string) =>
      referenceLimits.map(limit => (
        <ReferenceLine
          key={limit.id}
          y={limit.value}
          yAxisId={yAxisId}
          stroke={limit.color}
          strokeDasharray="5 5"
          strokeWidth={2}
        >
          <Label
            value={`${limit.name}: ${limit.value}`}
            position="right"
            fill={limit.color}
            fontSize={11}
          />
        </ReferenceLine>
      ));

    const renderXAxis = () => (
      <XAxis
        dataKey={config.xAxis}
        tick={{ fontSize: axisFontSize, fontFamily }}
        stroke={axisColor}
      >
        {config.xAxisLabel && (
          <Label value={config.xAxisLabel} position="bottom" offset={-5} style={{ fontSize: labelFontSize, fontFamily }} />
        )}
      </XAxis>
    );

    const renderYAxis = (yAxisId?: string) => (
      <YAxis
        yAxisId={yAxisId}
        tick={{ fontSize: axisFontSize, fontFamily }}
        stroke={axisColor}
        domain={yDomain}
      >
        {config.yAxisLabel && (
          <Label value={config.yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: labelFontSize, fontFamily }} />
        )}
      </YAxis>
    );

    const renderRightYAxis = () => (
      <YAxis
        yAxisId="right"
        orientation="right"
        tick={{ fontSize: axisFontSize, fontFamily }}
        stroke={RIGHT_AXIS_COLORS[0]}
        domain={rightYDomain}
      >
        {config.rightYAxisLabel && (
          <Label value={config.rightYAxisLabel} angle={90} position="insideRight" style={{ textAnchor: 'middle', fontSize: labelFontSize, fontFamily }} />
        )}
      </YAxis>
    );

    const renderTooltip = () => (
      <Tooltip
        contentStyle={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
        }}
      />
    );

    const renderLegend = () => config.showLegend ? (
      <Legend
        layout={config.legendLayout}
        align={config.legendAlign}
        verticalAlign={config.legendPosition}
        iconType={config.legendIconType}
      />
    ) : null;

    // Pie chart
    if (config.chartType === "pie") {
      const pieData = config.yAxes.length > 0
        ? data.map(row => ({ name: row[config.xAxis], value: Number(row[config.yAxes[0]]) || 0 }))
        : [];
      
      return (
        <PieChart {...commonProps}>
          {renderTooltip()}
          {renderLegend()}
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={config.showDataLabels}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    }

    // Composed chart (mixed types)
    if (config.chartType === "composed") {
      const hasDualAxis = config.enableDualYAxis && config.rightYAxes.length > 0;
      return (
        <ComposedChart {...commonProps}>
          {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          {renderXAxis()}
          {hasDualAxis ? renderYAxis("left") : renderYAxis(undefined)}
          {hasDualAxis && renderRightYAxis()}
          {renderTooltip()}
          {renderLegend()}
          {renderReferenceLines(hasDualAxis ? "left" : undefined)}
          {config.yAxes.map((yAxis, index) => (
            <Bar
              key={yAxis}
              yAxisId={hasDualAxis ? "left" : undefined}
              dataKey={yAxis}
              fill={COLORS[index % COLORS.length]}
            >
              {config.showDataLabels && <LabelList dataKey={yAxis} position="top" fontSize={10} />}
            </Bar>
          ))}
          {config.rightYAxes.map((yAxis, index) => (
            <Line
              key={yAxis}
              yAxisId="right"
              type={config.lineStyle}
              dataKey={yAxis}
              stroke={RIGHT_AXIS_COLORS[index % RIGHT_AXIS_COLORS.length]}
              strokeWidth={config.strokeWidth}
              dot={config.dotSize > 0 ? { r: config.dotSize } : false}
            >
              {config.showDataLabels && <LabelList dataKey={yAxis} position="top" fontSize={10} />}
            </Line>
          ))}
        </ComposedChart>
      );
    }

    // Stacked bar chart
    if (config.chartType === "stacked-bar") {
      return (
        <BarChart {...commonProps}>
          {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          {renderXAxis()}
          {renderYAxis(undefined)}
          {renderTooltip()}
          {renderLegend()}
          {renderReferenceLines()}
          {config.yAxes.map((yAxis, index) => (
            <Bar key={yAxis} dataKey={yAxis} stackId="stack" fill={COLORS[index % COLORS.length]}>
              {config.showDataLabels && <LabelList dataKey={yAxis} position="center" fontSize={10} />}
            </Bar>
          ))}
        </BarChart>
      );
    }

    // Stacked area chart
    if (config.chartType === "stacked-area") {
      return (
        <AreaChart {...commonProps}>
          {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          {renderXAxis()}
          {renderYAxis(undefined)}
          {renderTooltip()}
          {renderLegend()}
          {renderReferenceLines()}
          {config.yAxes.map((yAxis, index) => (
            <Area
              key={yAxis}
              type={config.lineStyle}
              dataKey={yAxis}
              stackId="stack"
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.6}
            >
              {config.showDataLabels && <LabelList dataKey={yAxis} position="top" fontSize={10} />}
            </Area>
          ))}
        </AreaChart>
      );
    }

    // Dual Y-axis support for line, bar, area, scatter
    const hasDualAxis = config.enableDualYAxis && config.rightYAxes.length > 0;

    switch (config.chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            {renderXAxis()}
            {hasDualAxis ? renderYAxis("left") : renderYAxis(undefined)}
            {hasDualAxis && renderRightYAxis()}
            {renderTooltip()}
            {renderLegend()}
            {renderReferenceLines(hasDualAxis ? "left" : undefined)}
            {config.yAxes.map((yAxis, index) => (
              <Line
                key={yAxis}
                yAxisId={hasDualAxis ? "left" : undefined}
                type={config.lineStyle}
                dataKey={yAxis}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={config.strokeWidth}
                dot={config.dotSize > 0 ? { r: config.dotSize } : false}
                activeDot={{ r: config.dotSize + 2 }}
              >
                {config.showDataLabels && <LabelList dataKey={yAxis} position="top" fontSize={10} />}
              </Line>
            ))}
            {config.rightYAxes.map((yAxis, index) => (
              <Line
                key={yAxis}
                yAxisId="right"
                type={config.lineStyle}
                dataKey={yAxis}
                stroke={RIGHT_AXIS_COLORS[index % RIGHT_AXIS_COLORS.length]}
                strokeWidth={config.strokeWidth}
                dot={config.dotSize > 0 ? { r: config.dotSize } : false}
                activeDot={{ r: config.dotSize + 2 }}
              >
                {config.showDataLabels && <LabelList dataKey={yAxis} position="top" fontSize={10} />}
              </Line>
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            {renderXAxis()}
            {hasDualAxis ? renderYAxis("left") : renderYAxis(undefined)}
            {hasDualAxis && renderRightYAxis()}
            {renderTooltip()}
            {renderLegend()}
            {renderReferenceLines(hasDualAxis ? "left" : undefined)}
            {config.yAxes.map((yAxis, index) => (
              <Bar key={yAxis} yAxisId={hasDualAxis ? "left" : undefined} dataKey={yAxis} fill={COLORS[index % COLORS.length]}>
                {config.showDataLabels && <LabelList dataKey={yAxis} position="top" fontSize={10} />}
              </Bar>
            ))}
            {config.rightYAxes.map((yAxis, index) => (
              <Bar key={yAxis} yAxisId="right" dataKey={yAxis} fill={RIGHT_AXIS_COLORS[index % RIGHT_AXIS_COLORS.length]}>
                {config.showDataLabels && <LabelList dataKey={yAxis} position="top" fontSize={10} />}
              </Bar>
            ))}
          </BarChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            <XAxis
              dataKey={config.xAxis}
              tick={{ fontSize: axisFontSize, fontFamily }}
              stroke={axisColor}
              type="category"
            >
              {config.xAxisLabel && (
                <Label value={config.xAxisLabel} position="bottom" offset={-5} style={{ fontSize: labelFontSize, fontFamily }} />
              )}
            </XAxis>
            {hasDualAxis ? renderYAxis("left") : renderYAxis(undefined)}
            {hasDualAxis && renderRightYAxis()}
            {renderTooltip()}
            {renderLegend()}
            {renderReferenceLines(hasDualAxis ? "left" : undefined)}
            {config.yAxes.map((yAxis, index) => (
              <Scatter
                key={yAxis}
                yAxisId={hasDualAxis ? "left" : undefined}
                name={yAxis}
                dataKey={yAxis}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            {config.rightYAxes.map((yAxis, index) => (
              <Scatter
                key={yAxis}
                yAxisId="right"
                name={yAxis}
                dataKey={yAxis}
                fill={RIGHT_AXIS_COLORS[index % RIGHT_AXIS_COLORS.length]}
              />
            ))}
          </ScatterChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            {renderXAxis()}
            {hasDualAxis ? renderYAxis("left") : renderYAxis(undefined)}
            {hasDualAxis && renderRightYAxis()}
            {renderTooltip()}
            {renderLegend()}
            {renderReferenceLines(hasDualAxis ? "left" : undefined)}
            {config.yAxes.map((yAxis, index) => (
              <Area
                key={yAxis}
                yAxisId={hasDualAxis ? "left" : undefined}
                type={config.lineStyle}
                dataKey={yAxis}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.3}
                strokeWidth={config.strokeWidth}
              >
                {config.showDataLabels && <LabelList dataKey={yAxis} position="top" fontSize={10} />}
              </Area>
            ))}
            {config.rightYAxes.map((yAxis, index) => (
              <Area
                key={yAxis}
                yAxisId="right"
                type={config.lineStyle}
                dataKey={yAxis}
                stroke={RIGHT_AXIS_COLORS[index % RIGHT_AXIS_COLORS.length]}
                fill={RIGHT_AXIS_COLORS[index % RIGHT_AXIS_COLORS.length]}
                fillOpacity={0.3}
                strokeWidth={config.strokeWidth}
              >
                {config.showDataLabels && <LabelList dataKey={yAxis} position="top" fontSize={10} />}
              </Area>
            ))}
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle 
            className="flex items-center gap-2"
            style={{ fontFamily, fontSize: titleFontSize }}
          >
            <Image className="h-5 w-5 text-primary" />
            {config.title || "Chart Preview"}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadAsPng} className="gap-1">
              <Download className="h-4 w-4" />
              PNG
            </Button>
            <Button variant="outline" size="sm" onClick={downloadAsSvg} className="gap-1">
              <Download className="h-4 w-4" />
              SVG
            </Button>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-1">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full" style={{ backgroundColor, fontFamily }}>
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Reference Lines Legend */}
        {referenceLimits.length > 0 && (
          <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">Reference Lines:</p>
            <div className="flex flex-wrap gap-3">
              {referenceLimits.map(limit => (
                <div key={limit.id} className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-0.5"
                    style={{ backgroundColor: limit.color, borderStyle: "dashed" }}
                  />
                  <span className="text-xs">
                    {limit.name}: {limit.value} {limit.unit || ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dual Axis Indicator */}
        {config.enableDualYAxis && config.rightYAxes.length > 0 && (
          <div className="mt-2 p-2 bg-secondary/20 rounded text-xs text-muted-foreground">
            <strong>Dual Y-Axis:</strong> Left axis ({config.yAxes.join(", ") || "none"}) | Right axis ({config.rightYAxes.join(", ")})
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartPreview;
