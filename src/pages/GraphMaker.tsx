import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import DataInputSection from "@/components/graph-maker/DataInputSection";
import ChartConfigSection, { ChartConfig } from "@/components/graph-maker/ChartConfigSection";
import ChartPreview from "@/components/graph-maker/ChartPreview";
import GraphChat from "@/components/graph-maker/GraphChat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

const initialConfig: ChartConfig = {
  chartType: "line",
  xAxis: "",
  yAxes: [],
  title: "",
  xAxisLabel: "",
  yAxisLabel: "",
  yAxisMin: undefined,
  yAxisMax: undefined,
  showLegend: true,
  showDataLabels: false,
  showGrid: true,
  lineStyle: "monotone",
  strokeWidth: 2,
  dotSize: 4,
  selectedLimits: [],
  customLimits: [],
  legendPosition: "bottom",
  legendAlign: "center",
  legendLayout: "horizontal",
  legendIconType: "line",
  // Dual Y-Axis
  enableDualYAxis: false,
  rightYAxes: [],
  rightYAxisLabel: "",
  rightYAxisMin: undefined,
  rightYAxisMax: undefined,
  // Series configs for composed charts
  seriesConfigs: [],
  // Visual style properties
  colorPalette: [],
  rightAxisColorPalette: [],
  fontFamily: "",
  axisFontSize: 11,
  labelFontSize: 12,
  titleFontSize: 18,
  axisColor: "",
  gridColor: "",
  backgroundColor: "",
};

const GraphMaker = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [dataDescription, setDataDescription] = useState("");
  const [config, setConfig] = useState<ChartConfig>(initialConfig);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Clear data only - preserves styling for reuse with new data
  const handleClearData = () => {
    setData([]);
    setHeaders([]);
    setDataDescription("");
    // Reset only data-specific config, keep styling
    setConfig(prev => ({
      ...prev,
      xAxis: "",
      yAxes: [],
      rightYAxes: [],
      title: "",
      xAxisLabel: "",
      yAxisLabel: "",
      rightYAxisLabel: "",
      yAxisMin: undefined,
      yAxisMax: undefined,
      rightYAxisMin: undefined,
      rightYAxisMax: undefined,
      selectedLimits: [],
      customLimits: [],
      seriesConfigs: [],
      // Styling preserved: chartType, showLegend, showDataLabels, showGrid,
      // lineStyle, strokeWidth, dotSize, legendPosition, enableDualYAxis, etc.
    }));
    toast.info("Data cleared. Chart styling preserved for reuse.");
  };

  // Full reset - returns everything to initial state
  const handleReset = () => {
    setData([]);
    setHeaders([]);
    setDataDescription("");
    setChatMessages([]);
    setConfig(initialConfig);
    toast.info("Everything reset to defaults.");
  };

  const applyConfigUpdates = (updates: any) => {
    console.log("applyConfigUpdates called with:", updates);
    console.log("colorPalette in updates:", updates.colorPalette);
    
    setConfig((prev) => {
      const newConfig = { ...prev };

      if (updates.chartType) newConfig.chartType = updates.chartType;
      if (updates.xAxis) newConfig.xAxis = updates.xAxis;
      if (updates.yAxes) newConfig.yAxes = updates.yAxes;
      if (updates.title !== undefined) newConfig.title = updates.title;
      if (updates.xAxisLabel !== undefined) newConfig.xAxisLabel = updates.xAxisLabel;
      if (updates.yAxisLabel !== undefined) newConfig.yAxisLabel = updates.yAxisLabel;
      if (updates.yAxisMin !== undefined) newConfig.yAxisMin = updates.yAxisMin;
      if (updates.yAxisMax !== undefined) newConfig.yAxisMax = updates.yAxisMax;
      if (updates.showLegend !== undefined) newConfig.showLegend = updates.showLegend;
      if (updates.showDataLabels !== undefined) newConfig.showDataLabels = updates.showDataLabels;
      if (updates.showGrid !== undefined) newConfig.showGrid = updates.showGrid;
      if (updates.lineStyle !== undefined) newConfig.lineStyle = updates.lineStyle;
      if (updates.strokeWidth !== undefined) newConfig.strokeWidth = updates.strokeWidth;
      if (updates.dotSize !== undefined) newConfig.dotSize = updates.dotSize;
      
      // Legend customization
      if (updates.legendPosition) newConfig.legendPosition = updates.legendPosition;
      if (updates.legendAlign) newConfig.legendAlign = updates.legendAlign;
      if (updates.legendLayout) newConfig.legendLayout = updates.legendLayout;
      if (updates.legendIconType) newConfig.legendIconType = updates.legendIconType;
      
      // Dual Y-axis updates
      if (updates.enableDualYAxis !== undefined) newConfig.enableDualYAxis = updates.enableDualYAxis;
      if (updates.rightYAxes) newConfig.rightYAxes = updates.rightYAxes;
      if (updates.rightYAxisLabel !== undefined) newConfig.rightYAxisLabel = updates.rightYAxisLabel;
      if (updates.rightYAxisMin !== undefined) newConfig.rightYAxisMin = updates.rightYAxisMin;
      if (updates.rightYAxisMax !== undefined) newConfig.rightYAxisMax = updates.rightYAxisMax;
      
      // Visual style updates
      if (updates.colorPalette && updates.colorPalette.length > 0) {
        console.log("Applying colorPalette:", updates.colorPalette);
        newConfig.colorPalette = updates.colorPalette;
      }
      if (updates.rightAxisColorPalette) newConfig.rightAxisColorPalette = updates.rightAxisColorPalette;
      if (updates.fontFamily) newConfig.fontFamily = updates.fontFamily;
      if (updates.axisFontSize !== undefined) newConfig.axisFontSize = updates.axisFontSize;
      if (updates.labelFontSize !== undefined) newConfig.labelFontSize = updates.labelFontSize;
      if (updates.titleFontSize !== undefined) newConfig.titleFontSize = updates.titleFontSize;
      if (updates.axisColor) newConfig.axisColor = updates.axisColor;
      if (updates.gridColor) newConfig.gridColor = updates.gridColor;
      if (updates.backgroundColor) newConfig.backgroundColor = updates.backgroundColor;
      
      console.log("Final newConfig.colorPalette:", newConfig.colorPalette);
      
      if (updates.selectedLimits) {
        newConfig.selectedLimits = updates.selectedLimits;
      }

      if (updates.addCustomLimit) {
        newConfig.customLimits = [
          ...prev.customLimits,
          updates.addCustomLimit,
        ];
      }

      if (updates.removeCustomLimit) {
        newConfig.customLimits = prev.customLimits.filter(
          (l) => l.name !== updates.removeCustomLimit
        );
      }

      return newConfig;
    });
  };

  const handleChatMessage = async (message: string, image?: string) => {
    setChatMessages((prev) => [...prev, { role: "user", content: message, image }]);
    setIsChatLoading(true);

    try {
      // If image is attached, use style extraction
      if (image) {
        const { data: response, error } = await supabase.functions.invoke("graph-style-extract", {
          body: { image, message },
        });

        if (error) throw error;

        if (response.error) {
          toast.error(response.error);
          setChatMessages((prev) => [
            ...prev,
            { role: "assistant", content: response.error },
          ]);
          return;
        }

        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.message },
        ]);

        if (response.type === "style_update" && response.updates) {
          applyConfigUpdates(response.updates);
          toast.success("Style applied from reference image!");
        }
      } else {
        // Regular chat without image
        const { data: response, error } = await supabase.functions.invoke("graph-chat", {
          body: {
            message,
            currentConfig: config,
            headers,
            sampleData: data.slice(0, 5),
          },
        });

        if (error) throw error;

        if (response.error) {
          toast.error(response.error);
          setChatMessages((prev) => [
            ...prev,
            { role: "assistant", content: response.error },
          ]);
          return;
        }

        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.message },
        ]);

        if (response.type === "config_update" && response.updates) {
          applyConfigUpdates(response.updates);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to process your request");
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="AI Graph Maker"
        description="Upload environmental data, get AI-powered chart suggestions, and overlay Alaska DEC regulatory limits with one click."
        url="https://kaiconsulting.ai/tools/graph-maker"
      />
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-secondary via-background to-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            AI-Powered{" "}
            <span className="text-primary">Graph Maker</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your data, let AI suggest the best visualization, and add Alaska DEC regulatory reference lines with one click.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column: Data Input & Configuration */}
            <div className="space-y-6">
              <DataInputSection
                data={data}
                setData={setData}
                headers={headers}
                setHeaders={setHeaders}
                dataDescription={dataDescription}
                setDataDescription={setDataDescription}
                onClearData={handleClearData}
                onReset={handleReset}
              />
              <ChartConfigSection
                headers={headers}
                data={data}
                config={config}
                setConfig={setConfig}
                dataDescription={dataDescription}
              />
            </div>

            {/* Right Column: Chart Preview & Chat */}
            <div className="lg:sticky lg:top-6 lg:self-start space-y-6">
              <ChartPreview data={data} config={config} />
              <GraphChat
                onSendMessage={handleChatMessage}
                messages={chatMessages}
                isLoading={isChatLoading}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GraphMaker;
