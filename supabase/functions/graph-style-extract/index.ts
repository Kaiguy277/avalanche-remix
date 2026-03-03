import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";
import { validateString, createValidationError } from "../_shared/validation.ts";

// Maximum size for base64 image data (5MB when decoded)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 * 1.37; // ~6.85MB base64 for 5MB binary

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const body = await req.json();
    const { image, message } = body;

    // Validate image input
    const imageValidation = validateString(image, 'image', { minLength: 1, maxLength: MAX_IMAGE_SIZE });
    if (!imageValidation.success) {
      return createValidationError(imageValidation.error!, corsHeaders);
    }

    // Validate optional message
    const messageValidation = validateString(message, 'message', { maxLength: 1000, required: false });
    if (!messageValidation.success) {
      return createValidationError(messageValidation.error!, corsHeaders);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a chart VISUAL STYLE analyzer. Extract visual presentation properties from the chart image to help users recreate the same visual style with their own data.

EXTRACT these visual style properties:

CHART STRUCTURE:
1. Chart Type: Is it a line chart, bar chart, scatter plot, or area chart?
2. Line Style: Are lines smooth/curved (monotone), straight (linear), or stepped?
3. Line Thickness: Estimate the stroke width (1=thin, 2=normal, 3=medium, 4=thick)
4. Dot/Point Size: Are data points visible? If so, estimate size (0=hidden, 3=small, 4=normal, 6=large)
5. Grid: Is there a grid visible?
6. Legend: Is there a legend? Where is it positioned (top/bottom)? Is it horizontal or vertical?
7. Data Labels: Are data values shown directly on the chart points/bars?

COLOR PALETTE (IMPORTANT - extract these carefully):
8. Look at each data series (line, bar, or area) and identify its exact color
9. Return colors as an array of hex codes in order: ["#hex1", "#hex2", "#hex3", ...]
10. Common chart colors to recognize:
    - Blues: #1f77b4, #2196F3, #0066cc
    - Oranges: #ff7f0e, #FF9800, #e65100
    - Greens: #2ca02c, #4CAF50, #388E3C
    - Reds: #d62728, #F44336, #c62828
    - Purples: #9467bd, #9C27B0, #7B1FA2

TYPOGRAPHY & AXES:
11. Font style: Does it look like a sans-serif (Arial, Helvetica) or serif (Times) font?
12. Estimate axis tick label font size (10-14)
13. Estimate axis label font size (12-16)  
14. Axis line/tick color (usually gray or black)
15. Grid line color (usually light gray)

DO NOT extract data-specific values (titles, axis ranges, specific numbers).

Use the extract_chart_style tool to return the visual style properties.`;

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
          {
            role: "user",
            content: [
              {
                type: "text",
                text: messageValidation.data || "Please analyze this chart and extract its visual style properties so I can apply them to my chart.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageValidation.data,
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_chart_style",
              description: "Extract visual style properties from the analyzed chart image",
              parameters: {
                type: "object",
                properties: {
                  chartType: {
                    type: "string",
                    enum: ["line", "bar", "scatter", "area"],
                    description: "The detected chart type",
                  },
                  lineStyle: {
                    type: "string",
                    enum: ["monotone", "linear", "step"],
                    description: "Line curve style: monotone (smooth/curved), linear (straight), step",
                  },
                  strokeWidth: {
                    type: "number",
                    description: "Estimated line thickness (1-4)",
                  },
                  dotSize: {
                    type: "number",
                    description: "Size of data points (0=hidden, 3=small, 4=normal, 6=large)",
                  },
                  showGrid: {
                    type: "boolean",
                    description: "Whether the chart has a visible grid",
                  },
                  showLegend: {
                    type: "boolean",
                    description: "Whether the chart has a visible legend",
                  },
                  legendPosition: {
                    type: "string",
                    enum: ["top", "bottom"],
                    description: "Position of the legend",
                  },
                  legendLayout: {
                    type: "string",
                    enum: ["horizontal", "vertical"],
                    description: "Layout direction of the legend",
                  },
                  legendAlign: {
                    type: "string",
                    enum: ["left", "center", "right"],
                    description: "Horizontal alignment of the legend",
                  },
                  showDataLabels: {
                    type: "boolean",
                    description: "Whether data values are labeled on the chart",
                  },
                  colorPalette: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of hex color codes extracted from data series (e.g., ['#1f77b4', '#ff7f0e', '#2ca02c'])",
                  },
                  fontFamily: {
                    type: "string",
                    enum: ["Inter", "Arial", "Helvetica", "Times New Roman", "Georgia", "system-ui"],
                    description: "Detected or closest matching font family (sans-serif = Arial/Helvetica, serif = Times/Georgia)",
                  },
                  axisFontSize: {
                    type: "number",
                    description: "Estimated tick label font size (10-14)",
                  },
                  labelFontSize: {
                    type: "number",
                    description: "Estimated axis label font size (12-16)",
                  },
                  titleFontSize: {
                    type: "number",
                    description: "Estimated title font size (16-24)",
                  },
                  axisColor: {
                    type: "string",
                    description: "Color of axis lines and ticks as hex code (e.g., '#666666')",
                  },
                  gridColor: {
                    type: "string",
                    description: "Color of grid lines as hex code (e.g., '#e0e0e0')",
                  },
                  message: {
                    type: "string",
                    description: "Brief description of the style analysis including colors and fonts detected",
                  },
                },
                required: ["message"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_chart_style" } },
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
      const args = JSON.parse(toolCall.function.arguments);

      return new Response(
        JSON.stringify({
          type: "style_update",
          updates: args,
          message: args.message || "Style extracted and applied!",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback
    return new Response(
      JSON.stringify({ 
        type: "message", 
        message: "I couldn't extract style properties from this image. Please try a clearer chart image." 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in graph-style-extract function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
