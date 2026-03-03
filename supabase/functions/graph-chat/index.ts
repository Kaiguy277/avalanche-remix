import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";
import { validateString, validateArray, validateObject, createValidationError } from "../_shared/validation.ts";

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const body = await req.json();
    const { message, currentConfig, headers, sampleData } = body;

    // Validate inputs
    const messageValidation = validateString(message, 'message', { minLength: 1, maxLength: 2000 });
    if (!messageValidation.success) {
      return createValidationError(messageValidation.error!, corsHeaders);
    }

    const configValidation = validateObject(currentConfig, 'currentConfig', { required: false });
    if (!configValidation.success) {
      return createValidationError(configValidation.error!, corsHeaders);
    }

    const headersValidation = validateArray<string>(headers, 'headers', { 
      maxLength: 100, 
      required: false,
      itemValidator: (item) => typeof item === 'string' && item.length <= 200
    });
    if (!headersValidation.success) {
      return createValidationError(headersValidation.error!, corsHeaders);
    }

    const sampleValidation = validateArray<Record<string, unknown>>(sampleData, 'sampleData', { 
      maxLength: 100, 
      required: false 
    });
    if (!sampleValidation.success) {
      return createValidationError(sampleValidation.error!, corsHeaders);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const config = configValidation.data || {};
    const validHeaders = headersValidation.data || [];
    const validSampleData = sampleValidation.data || [];

    const systemPrompt = `You are a creative and capable chart configuration assistant. You can create ANY type of visualization the user needs, including changing colors, fonts, and visual styling.

Current chart configuration:
- Chart type: ${config.chartType || 'not set'} (options: line, bar, scatter, area, composed, stacked-bar, stacked-area, pie)
- X-Axis column: ${config.xAxis || "not set"}
- Left Y-Axes columns: ${(config.yAxes as string[])?.join(", ") || "none selected"}
- Dual Y-Axis enabled: ${config.enableDualYAxis || false}
- Right Y-Axes columns: ${(config.rightYAxes as string[])?.join(", ") || "none"}
- Right Y-Axis label: ${config.rightYAxisLabel || "not set"}
- Title: ${config.title || "no title"}
- X-Axis label: ${config.xAxisLabel || "not set"}
- Y-Axis label: ${config.yAxisLabel || "not set"}
- Y-Axis min: ${config.yAxisMin !== undefined ? config.yAxisMin : "auto"}
- Y-Axis max: ${config.yAxisMax !== undefined ? config.yAxisMax : "auto"}
- Show legend: ${config.showLegend}
- Legend position: ${config.legendPosition || "bottom"}
- Legend alignment: ${config.legendAlign || "center"}
- Legend layout: ${config.legendLayout || "horizontal"}
- Legend icon type: ${config.legendIconType || "line"}
- Show data labels: ${config.showDataLabels}
- Show grid: ${config.showGrid}
- Line style: ${config.lineStyle || "monotone"} (options: monotone=smooth, linear=straight, step)
- Line width: ${config.strokeWidth || 2}px
- Dot size: ${config.dotSize !== undefined ? (config.dotSize === 0 ? "hidden" : config.dotSize) : 4}
- Selected regulatory limits: ${(config.selectedLimits as string[])?.join(", ") || "none"}
- Custom limits: ${JSON.stringify(config.customLimits || [])}

VISUAL STYLING (current):
- Color palette: ${(config.colorPalette as string[])?.length > 0 ? (config.colorPalette as string[]).join(", ") : "default colors"}
- Right axis color palette: ${(config.rightAxisColorPalette as string[])?.length > 0 ? (config.rightAxisColorPalette as string[]).join(", ") : "default colors"}
- Font family: ${config.fontFamily || "Inter"}
- Axis font size: ${config.axisFontSize || 11}px
- Label font size: ${config.labelFontSize || 12}px
- Title font size: ${config.titleFontSize || 18}px
- Axis color: ${config.axisColor || "default"}
- Grid color: ${config.gridColor || "default"}
- Background color: ${config.backgroundColor || "default"}

Available data columns: ${validHeaders.join(", ")}

Sample data (first 3 rows): ${JSON.stringify(validSampleData.slice(0, 3) || [])}

CHART TYPES EXPLAINED:
- line: Standard line chart
- bar: Grouped bar chart
- scatter: Scatter plot
- area: Filled area chart
- composed: Mixed chart - bars on left Y-axis, lines on right Y-axis (great for comparing different data types)
- stacked-bar: Stacked bars showing parts of a whole
- stacked-area: Stacked areas for cumulative visualization
- pie: Pie chart for proportions

DUAL Y-AXIS FEATURE:
When data has very different scales (e.g., Flow in thousands vs Stage Height in single digits), enable dual Y-axis mode:
- enableDualYAxis: true
- Put large-scale data in yAxes (left axis)
- Put small-scale data in rightYAxes (right axis)
- Set appropriate labels for each axis

For "composed" chart type:
- Left Y-axis columns (yAxes) are rendered as bars
- Right Y-axis columns (rightYAxes) are rendered as lines
- Perfect for mixing bars and lines in one chart

VISUAL STYLING:
You CAN change colors, fonts, and visual styling! When users ask to change colors or match a style:
- Use colorPalette to set data series colors as hex codes (e.g., ["#1f77b4", "#ff7f0e", "#2ca02c"])
- Use rightAxisColorPalette for right Y-axis series colors
- Use fontFamily to change fonts (options: Inter, Arial, Helvetica, Times New Roman, Georgia, system-ui)
- Use axisFontSize, labelFontSize, titleFontSize to adjust font sizes
- Use axisColor and gridColor to customize axis and grid appearance (hex codes)
- Use backgroundColor for the chart area background

Available regulatory limits (use these IDs):
- Groundwater: arsenic_gw, lead_gw, benzene_gw, gro_gw, dro_gw, rro_gw
- Soil: arsenic_soil, lead_soil, benzene_soil, dro_soil
- Surface Water: tah_sw, taqh_sw, arsenic_sw

When the user asks to modify the chart, use the update_chart_config tool. When answering questions or providing explanations, use the respond_to_user tool.

Be creative! If the user asks for something like "can you make a chart with two scales" or "put flow on the left and stage on the right", enable dual Y-axis mode. If they want to mix bars and lines, use the composed chart type. If they want to change colors or match a style, use the visual styling parameters.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: messageValidation.data },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "update_chart_config",
              description: "Update the chart configuration based on user request. Supports dual Y-axis, mixed chart types, and creative visualizations.",
              parameters: {
                type: "object",
                properties: {
                  chartType: {
                    type: "string",
                    enum: ["line", "bar", "scatter", "area", "composed", "stacked-bar", "stacked-area", "pie"],
                    description: "The type of chart to display",
                  },
                  xAxis: {
                    type: "string",
                    description: "Column name to use for X-axis",
                  },
                  yAxes: {
                    type: "array",
                    items: { type: "string" },
                    description: "Column names for the left Y-axis",
                  },
                  enableDualYAxis: {
                    type: "boolean",
                    description: "Enable dual Y-axis mode for data with different scales",
                  },
                  rightYAxes: {
                    type: "array",
                    items: { type: "string" },
                    description: "Column names for the right Y-axis (when dual axis is enabled)",
                  },
                  rightYAxisLabel: {
                    type: "string",
                    description: "Label for the right Y-axis",
                  },
                  rightYAxisMin: {
                    type: "number",
                    description: "Minimum value for right Y-axis scale",
                  },
                  rightYAxisMax: {
                    type: "number",
                    description: "Maximum value for right Y-axis scale",
                  },
                  title: {
                    type: "string",
                    description: "Chart title",
                  },
                  showLegend: {
                    type: "boolean",
                    description: "Whether to show the legend",
                  },
                  showDataLabels: {
                    type: "boolean",
                    description: "Whether to show data labels on the chart",
                  },
                  showGrid: {
                    type: "boolean",
                    description: "Whether to show the grid lines",
                  },
                  xAxisLabel: {
                    type: "string",
                    description: "Custom label for the X-axis",
                  },
                  yAxisLabel: {
                    type: "string",
                    description: "Custom label for the left Y-axis",
                  },
                  yAxisMin: {
                    type: "number",
                    description: "Minimum value for left Y-axis scale",
                  },
                  yAxisMax: {
                    type: "number",
                    description: "Maximum value for left Y-axis scale",
                  },
                  lineStyle: {
                    type: "string",
                    enum: ["monotone", "linear", "step"],
                    description: "Line curve style: monotone (smooth), linear (straight), step",
                  },
                  strokeWidth: {
                    type: "number",
                    description: "Line thickness in pixels (1-4)",
                  },
                  dotSize: {
                    type: "number",
                    description: "Size of data points (0 to hide, 3-6 for visible)",
                  },
                  legendPosition: {
                    type: "string",
                    enum: ["top", "bottom"],
                    description: "Position of the legend",
                  },
                  legendAlign: {
                    type: "string",
                    enum: ["left", "center", "right"],
                    description: "Horizontal alignment of the legend",
                  },
                  legendLayout: {
                    type: "string",
                    enum: ["horizontal", "vertical"],
                    description: "Layout direction of the legend",
                  },
                  legendIconType: {
                    type: "string",
                    enum: ["line", "square", "circle", "diamond"],
                    description: "Shape of legend icons",
                  },
                  selectedLimits: {
                    type: "array",
                    items: { type: "string" },
                    description: "IDs of regulatory limits to display",
                  },
                  addCustomLimit: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      value: { type: "number" },
                      color: { type: "string" },
                    },
                    description: "A custom limit to add",
                  },
                  removeCustomLimit: {
                    type: "string",
                    description: "Name of custom limit to remove",
                  },
                  colorPalette: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of hex color codes for left Y-axis data series (e.g., ['#1f77b4', '#ff7f0e', '#2ca02c'])",
                  },
                  rightAxisColorPalette: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of hex color codes for right Y-axis data series",
                  },
                  fontFamily: {
                    type: "string",
                    enum: ["Inter", "Arial", "Helvetica", "Times New Roman", "Georgia", "system-ui"],
                    description: "Font family for the chart text",
                  },
                  axisFontSize: {
                    type: "number",
                    description: "Font size for axis tick labels in pixels (10-14)",
                  },
                  labelFontSize: {
                    type: "number",
                    description: "Font size for axis labels in pixels (12-16)",
                  },
                  titleFontSize: {
                    type: "number",
                    description: "Font size for chart title in pixels (16-24)",
                  },
                  axisColor: {
                    type: "string",
                    description: "Color for axis lines as hex code (e.g., '#666666')",
                  },
                  gridColor: {
                    type: "string",
                    description: "Color for grid lines as hex code (e.g., '#e0e0e0')",
                  },
                  backgroundColor: {
                    type: "string",
                    description: "Background color for chart area as hex code (e.g., '#ffffff')",
                  },
                  message: {
                    type: "string",
                    description: "Confirmation message to show the user",
                  },
                },
                required: ["message"],
              },
            },
          },
          {
            type: "function",
            function: {
              name: "respond_to_user",
              description: "Respond to the user with a message (for questions, clarifications, or explanations)",
              parameters: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "The response message to show",
                  },
                },
                required: ["message"],
              },
            },
          },
        ],
        tool_choice: "auto",
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const choice = data.choices?.[0];
    
    if (choice?.message?.tool_calls?.length > 0) {
      const toolCall = choice.message.tool_calls[0];
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      if (functionName === "update_chart_config") {
        return new Response(
          JSON.stringify({
            type: "config_update",
            updates: args,
            message: args.message || "Chart updated!",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else if (functionName === "respond_to_user") {
        return new Response(
          JSON.stringify({
            type: "message",
            message: args.message,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Fallback to content if no tool call
    const content = choice?.message?.content || "I'm not sure how to help with that. Try asking me to change the chart type, add limits, or modify the axes.";
    return new Response(
      JSON.stringify({ type: "message", message: content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in graph-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
