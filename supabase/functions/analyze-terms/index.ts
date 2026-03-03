import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";
import { validateString, createValidationError } from "../_shared/validation.ts";

const comparisonSystemPrompt = `You are a consumer advocate comparing two Terms & Conditions documents.

COMPARISON FRAMEWORK:

## ⏰ TIME-SENSITIVE ALERTS (DISPLAY FIRST!)
Before any other comparison, scan BOTH documents for deadlines and action windows:

**Look for:**
- Opt-out windows (e.g., "You have 30 days to opt out of arbitration")
- Trial period expirations and auto-conversion dates
- Cancellation notice requirements (e.g., "60 days before renewal")
- Dispute/claim filing deadlines
- Refund request windows
- Price change notification periods
- Account inactivity deletion policies

**Format each as:**
### ⏰ ACTION REQUIRED: [Brief Title]
**Found in:** Document A / Document B / Both
**Deadline:** [X days/specific timeframe]
**What to do:** [Specific action the user should take]
**Relevant clause:** "[Quote]"
**Consequence of missing it:** [What happens if they don't act]

If no time-sensitive items are found in either document, display:
### ⏰ Time-Sensitive Items
No specific opt-out windows or action deadlines were identified in either document.

---

## Document Identification
Briefly identify what each document appears to be (e.g., "Document A: Social media platform T&C", "Document B: Updated version of same platform")

## Category-by-Category Comparison
For each relevant category, compare both documents:

### Data & Privacy
| Aspect | Document A | Document B | Winner |
|--------|------------|------------|--------|
| Data sharing | ... | ... | A/B/Tie |

### Legal Rights
(Similar table format)

### Money & Billing
(Similar table format)

### Content & Ownership
(Similar table format)

## Key Differences
List the most significant differences between the documents:

### 🔴 Document A is WORSE in:
- [Clause] - Why it's more concerning

### 🟢 Document A is BETTER in:
- [Clause] - Why it's more consumer-friendly

### ⚖️ Roughly Equal:
- [Clause] - Present in both, similar impact

## Overall Verdict
- **More Consumer-Friendly:** Document A / Document B / Roughly Equal
- **Recommendation:** [One paragraph summary of which to prefer and why]
- **Key Takeaway:** [The single most important difference users should know]

Use plain English throughout. Be specific about which document says what.`;

const systemPrompt = `You are a consumer advocate and legal analyst specializing in identifying concerning clauses in Terms & Conditions, Privacy Policies, and user agreements.

ANALYSIS FRAMEWORK:

## ⏰ TIME-SENSITIVE ALERTS (DISPLAY FIRST!)
Before any other analysis, scan for and highlight clauses with deadlines:

**Look for:**
- Opt-out windows (e.g., "You have 30 days to opt out of arbitration")
- Trial period expirations and auto-conversion dates
- Cancellation notice requirements (e.g., "60 days before renewal")
- Dispute/claim filing deadlines
- Refund request windows
- Price change notification periods
- Free trial to paid conversion timelines
- Account inactivity deletion policies

**Format each as:**
### ⏰ ACTION REQUIRED: [Brief Title]
**Deadline:** [X days/specific timeframe]
**What to do:** [Specific action the user should take]
**Where to find it:** "[Quote the relevant clause]"
**Consequence of missing it:** [What happens if they don't act]

If no time-sensitive items are found, display:
### ⏰ Time-Sensitive Items
No specific opt-out windows or action deadlines were identified in this document.

---

## CHECKLIST SCAN (Common Red Flags)
Check for these specific categories and flag if present:

**DATA & PRIVACY**
- Third-party data sharing/selling
- Indefinite data retention
- Location tracking
- Access to contacts/photos/microphone
- Cross-device tracking

**LEGAL RIGHTS**
- Forced arbitration clauses
- Class action waivers
- Jurisdiction in inconvenient locations
- Right to modify terms without notice
- Liability waivers for negligence

**MONEY & BILLING**
- Auto-renewal with difficult cancellation
- Price increase without notice
- Non-refundable prepayments
- Hidden fees or surcharges
- Cancellation penalties

**CONTENT & OWNERSHIP**
- Perpetual license to user content
- Right to use your name/likeness
- IP assignment clauses
- Termination without refund

**UNUSUAL/AGGRESSIVE**
- Mandatory binding arbitration
- Non-disparagement clauses
- Monitoring of external activities
- Consent to contact employers

## WTF DETECTION (Novel Concerns)
Beyond the checklist, identify:
- Clauses that seem unusually aggressive for this type of service
- Terms that contradict reasonable user expectations
- Rights you're giving up that most people wouldn't expect
- Anything that made YOU pause while reading

## OUTPUT FORMAT

Start with a summary:
## Summary
- **Overall Risk Level:** [Low/Medium/High/Very High]
- **Total Findings:** X (Y high, Z medium, W low)
- **Verdict:** [One-sentence recommendation]

Then for each finding, use this format:

### 🔴 HIGH: [Category] - [Brief Title]
**What it says:** "[Quote or paraphrase the clause]"
**Plain English:** [What this actually means for you]
**Why it matters:** [Real-world impact]
**Comparison:** [Is this standard or unusual?]

Use these severity indicators:
- 🔴 HIGH: Immediate concern, unusual/aggressive
- 🟠 MEDIUM: Worth knowing, fairly common but impactful  
- 🟡 LOW: Standard but good to be aware of

Group findings by category (Data & Privacy, Legal Rights, Money & Billing, Content & Ownership, Other Concerns).

If no significant concerns are found, still provide a summary explaining why the terms appear reasonable.`;

const followUpSystemPrompt = `You are a consumer advocate helping someone understand a Terms & Conditions analysis. You've already identified concerning clauses in their document.

Answer follow-up questions with:
- Specific, actionable advice
- References to the original clauses when relevant
- Concrete steps they can take
- Comparisons to industry norms when asked
- Honesty if something can't be avoided or opted out of

Be practical and helpful. Use plain English.`;

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const body = await req.json();
    const { text, textA, textB, labelA, labelB, followUp, previousResult, originalText } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    // Handle comparison
    if (textA && textB) {
      // Validate comparison inputs
      const textAValidation = validateString(textA, 'textA', { minLength: 1, maxLength: 25000 });
      if (!textAValidation.success) {
        return createValidationError(textAValidation.error!, corsHeaders);
      }

      const textBValidation = validateString(textB, 'textB', { minLength: 1, maxLength: 25000 });
      if (!textBValidation.success) {
        return createValidationError(textBValidation.error!, corsHeaders);
      }

      const labelAValidation = validateString(labelA, 'labelA', { maxLength: 100, required: false });
      const labelBValidation = validateString(labelB, 'labelB', { maxLength: 100, required: false });

      const docALabel = labelAValidation.data || "Document A";
      const docBLabel = labelBValidation.data || "Document B";
      console.log(`Comparing documents: ${textAValidation.data!.length} chars vs ${textBValidation.data!.length} chars`);

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: comparisonSystemPrompt },
            { role: "user", content: `Compare these two Terms & Conditions documents:\n\n---${docALabel}---\n${textAValidation.data}\n\n---${docBLabel}---\n${textBValidation.data}` },
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
        throw new Error("Failed to compare documents");
      }

      console.log("Streaming comparison to client");
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Handle follow-up questions
    if (followUp && previousResult) {
      const followUpValidation = validateString(followUp, 'followUp', { maxLength: 2000 });
      if (!followUpValidation.success) {
        return createValidationError(followUpValidation.error!, corsHeaders);
      }

      const previousValidation = validateString(previousResult, 'previousResult', { maxLength: 100000 });
      if (!previousValidation.success) {
        return createValidationError(previousValidation.error!, corsHeaders);
      }

      const originalValidation = validateString(originalText, 'originalText', { maxLength: 50000, required: false });

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
            { role: "user", content: `Original Terms & Conditions:\n${originalValidation.data || ''}\n\nMy analysis:\n${previousValidation.data}` },
            { role: "assistant", content: "I've provided that analysis. What would you like to know more about?" },
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

    // Handle initial analysis - validate text input
    const textValidation = validateString(text, 'text', { minLength: 1, maxLength: 50000 });
    if (!textValidation.success) {
      return createValidationError(textValidation.error!, corsHeaders);
    }

    console.log(`Analyzing Terms & Conditions: ${textValidation.data!.length} characters`);

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
          { role: "user", content: `Please analyze the following Terms & Conditions and identify any concerning clauses:\n\n${textValidation.data}` },
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
      throw new Error("Failed to analyze terms");
    }

    console.log("Streaming analysis to client");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in analyze-terms:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
