import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";
import { validateString, createValidationError } from "../_shared/validation.ts";

const systemPrompt = `You are an expert at simplifying complex regulatory and legal language into plain English. Your goal is to help environmental consultants, small business owners, and non-experts understand their compliance obligations.

When given regulatory text, provide a structured response in the following format:

## Plain English Summary
[2-3 sentences explaining what this regulation means in simple terms]

## Key Requirements
[Bullet points listing the main things someone must do or cannot do]

## Important Deadlines & Timeframes
[Any dates, deadlines, or time periods mentioned - if none, say "No specific deadlines mentioned"]

## Action Items
[Specific steps someone should take to comply - make these actionable and clear]

Guidelines:
- Use simple, everyday language (aim for 8th grade reading level)
- Avoid jargon - if you must use a technical term, explain it
- Be concise but complete
- Focus on practical implications
- Highlight penalties or consequences if mentioned
- If something is unclear in the original text, say so`;

const followUpSystemPrompt = `You are an expert at explaining regulatory and legal concepts in plain English. You have just helped simplify some regulatory text, and now the user has a follow-up question.

Your previous simplified explanation is provided for context. Answer the user's follow-up question:
- Use simple, everyday language (8th grade reading level)
- Be concise but thorough
- Give practical examples when helpful
- If asked about terms, define them clearly
- If asked about penalties, be specific
- If you're unsure about something, say so`;

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const body = await req.json();
    const { text, followUp, previousResult, originalText } = body;

    // Handle follow-up questions
    if (followUp && previousResult) {
      // Validate follow-up inputs
      const followUpValidation = validateString(followUp, 'followUp', { maxLength: 2000 });
      if (!followUpValidation.success) {
        return createValidationError(followUpValidation.error!, corsHeaders);
      }

      const previousValidation = validateString(previousResult, 'previousResult', { maxLength: 30000 });
      if (!previousValidation.success) {
        return createValidationError(previousValidation.error!, corsHeaders);
      }

      const originalValidation = validateString(originalText, 'originalText', { maxLength: 15000, required: false });
      if (!originalValidation.success) {
        return createValidationError(originalValidation.error!, corsHeaders);
      }

      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) {
        console.error("LOVABLE_API_KEY is not configured");
        throw new Error("AI service is not configured");
      }

      console.log(`Processing follow-up question: ${followUpValidation.data!.length} characters`);

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: followUpSystemPrompt },
            { role: "user", content: `Original regulatory text:\n${originalValidation.data}\n\nMy simplified explanation:\n${previousValidation.data}` },
            { role: "assistant", content: "I've provided that simplified explanation. What would you like to know more about?" },
            { role: "user", content: followUpValidation.data },
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI service limit reached. Please try again later." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        throw new Error("Failed to process follow-up");
      }

      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Handle initial simplification - validate text input
    const textValidation = validateString(text, 'text', { minLength: 1, maxLength: 15000 });
    if (!textValidation.success) {
      return createValidationError(textValidation.error!, corsHeaders);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    console.log(`Processing regulatory text: ${textValidation.data!.length} characters`);

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
          { role: "user", content: `Please simplify the following regulatory text:\n\n${textValidation.data}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "AI service limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to process text");
    }

    console.log("Streaming response to client");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in simplify-regulation:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
