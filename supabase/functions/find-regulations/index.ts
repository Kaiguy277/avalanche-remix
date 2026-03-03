import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";
import { validateString, validateArray, createValidationError } from "../_shared/validation.ts";

const baseSystemPrompt = `You are an expert on Alaska Department of Environmental Conservation (DEC) regulations. Your task is to identify applicable regulations AND provide actionable compliance information based on a project description.

When given a project description, search dec.alaska.gov and for EACH applicable regulation provide:
1. AAC citation and title
2. Why it applies to this specific project
3. **SPECIFIC NUMERICAL STANDARDS, THRESHOLDS, OR LIMITS** relevant to this project type
4. Key compliance deadlines, notification requirements, or reporting triggers
5. Direct link to the regulation source

Focus on regulations in:
- 18 AAC 50: Air Quality Control
- 18 AAC 60: Solid Waste Management  
- 18 AAC 70: Water Quality Standards
- 18 AAC 72: Wastewater Disposal
- 18 AAC 75: Oil & Hazardous Substances Pollution Control (including cleanup level tables)
- 18 AAC 78: Underground Storage Tanks
- 18 AAC 80: Drinking Water
- 18 AAC 83: Certification of Water & Wastewater Operators

Format your response clearly with each regulation as a separate item.`;

const MODE_PROMPTS: Record<string, string> = {
  spill: `
URGENCY: This is an ACTIVE SPILL/RELEASE situation. Prioritize:
1. IMMEDIATE notification requirements (who to call, timeframes - often 24 hours)
   - DEC Spill Hotline: 1-800-478-9300
   - National Response Center: 1-800-424-8802
2. Reportable quantity thresholds from 18 AAC 75.300:
   - Petroleum: 55 gallons to land, any amount to water
   - Hazardous substances: Reportable quantities per substance
3. Containment and initial response obligations under 18 AAC 75.305
4. Documentation requirements during response
5. When cleanup standards (18 AAC 75.340/345) will apply after initial response

Format with clear "IMMEDIATE ACTION REQUIRED" items at the top, followed by subsequent steps.`,

  cleanup: `
FOCUS: Site investigation and cleanup project. Prioritize:
1. Applicable CLEANUP LEVELS with specific numbers from 18 AAC 75.340/345:
   - Soil: Method Two Table B1 (under 40" precip) and B2 (over 40" precip) values in mg/kg
   - Groundwater: Table C values in ug/L
   - Include Arctic zone considerations if applicable
2. Site characterization requirements from 18 AAC 75.335:
   - Sampling protocols and delineation requirements
   - Data quality objectives
3. Closure pathway options:
   - Method Three (risk-based) under 18 AAC 75.340(e)
   - Institutional controls under 18 AAC 75.375
   - Active remediation standards
4. Monitoring requirements and frequencies
5. Reporting milestones and DEC approval points (Site Cleanup Rules)

Provide the actual numerical standards that professionals need for work plans and closure reports.`,

  permitting: `
FOCUS: Project permitting and compliance planning. Prioritize:
1. PERMIT TYPES needed and which DEC program administers each:
   - Air Quality permits (18 AAC 50)
   - Wastewater permits (18 AAC 72)
   - Solid waste permits (18 AAC 60)
   - Water quality certifications (18 AAC 70)
2. Application requirements, forms, and fees
3. Review timelines:
   - Standard processing times
   - Expedited options if available
4. Pre-application meeting options and recommendations
5. Public notice requirements (when applicable)
6. Typical permit conditions to expect
7. Renewal and ongoing compliance obligations

Help them understand the full permitting pathway and timeline.`,

  research: `
FOCUS: Comprehensive regulatory overview. Provide:
1. All applicable regulations with AAC citations
2. Clear explanation of why each applies to this project
3. Key numerical standards and thresholds where applicable
4. Compliance obligations and deadlines
5. Links to official sources

Give a thorough educational overview suitable for planning and learning.`
};

const MODE_QUICK_QUESTIONS: Record<string, string[]> = {
  spill: [
    "What's the DEC spill reporting hotline?",
    "Do I need to notify EPA or other agencies too?",
    "What documentation do I need during response?",
    "When does formal cleanup phase begin?"
  ],
  cleanup: [
    "What's the cleanup level for this contaminant?",
    "Can I use institutional controls for closure?",
    "What monitoring is required post-closure?",
    "How do I request a site closure letter?"
  ],
  permitting: [
    "How long is the typical permit review?",
    "Is a public hearing required?",
    "What are typical permit conditions?",
    "When should I apply for permit renewal?"
  ],
  research: [
    "Which regulation should I address first?",
    "Do any of these require permits?",
    "What are typical compliance timelines?",
    "Are there exemptions I might qualify for?"
  ]
};

const VALID_MODES = ['spill', 'cleanup', 'permitting', 'research'];

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const body = await req.json();
    const { projectDescription, contextMode, category, location, activities, followUp, previousResult, originalQuery } = body;
    
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let userQuery: string;
    let systemPromptToUse: string;

    if (followUp && previousResult && originalQuery) {
      // Follow-up question mode - validate inputs
      const followUpValidation = validateString(followUp, 'followUp', { maxLength: 2000 });
      if (!followUpValidation.success) {
        return createValidationError(followUpValidation.error!, corsHeaders);
      }

      const previousValidation = validateString(previousResult, 'previousResult', { maxLength: 50000 });
      if (!previousValidation.success) {
        return createValidationError(previousValidation.error!, corsHeaders);
      }

      const originalValidation = validateString(originalQuery, 'originalQuery', { maxLength: 5000 });
      if (!originalValidation.success) {
        return createValidationError(originalValidation.error!, corsHeaders);
      }

      systemPromptToUse = `You are an expert on Alaska Department of Environmental Conservation (DEC) regulations.

The user previously searched for regulations about this project:
"${originalValidation.data}"

And received these results:
${previousValidation.data}

Now answer their follow-up question based on this context. Focus on:
- Providing specific, actionable guidance
- Referencing the relevant regulations from the previous results
- Citing official sources from dec.alaska.gov when possible
- Being concise but thorough

If the question requires information beyond the previous results, search for additional relevant regulations.`;

      userQuery = followUpValidation.data!;
    } else {
      // Initial search mode - validate inputs
      const descriptionValidation = validateString(projectDescription, 'projectDescription', { minLength: 1, maxLength: 5000 });
      if (!descriptionValidation.success) {
        return createValidationError(descriptionValidation.error!, corsHeaders);
      }

      // Validate contextMode against allowed values
      const mode = contextMode && VALID_MODES.includes(contextMode) ? contextMode : 'research';
      const modePrompt = MODE_PROMPTS[mode] || MODE_PROMPTS.research;
      
      // Validate optional fields
      const categoryValidation = validateString(category, 'category', { maxLength: 200, required: false });
      const locationValidation = validateString(location, 'location', { maxLength: 500, required: false });
      const activitiesValidation = validateArray<string>(activities, 'activities', { 
        maxLength: 20, 
        required: false,
        itemValidator: (item) => typeof item === 'string' && item.length <= 200
      });
      
      systemPromptToUse = `${baseSystemPrompt}

${modePrompt}`;
      
      let queryParts = [`Project: ${descriptionValidation.data}`];
      if (categoryValidation.success && categoryValidation.data) {
        queryParts.push(`Category: ${categoryValidation.data}`);
      }
      if (locationValidation.success && locationValidation.data) {
        queryParts.push(`Location: ${locationValidation.data}`);
      }
      if (activitiesValidation.success && activitiesValidation.data && activitiesValidation.data.length > 0) {
        queryParts.push(`Activities: ${activitiesValidation.data.join(', ')}`);
      }
      
      userQuery = queryParts.join('\n');
    }

    console.log('Calling Perplexity API with mode:', contextMode || 'research');
    console.log('Query preview:', userQuery.substring(0, 200));

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: systemPromptToUse },
          { role: 'user', content: userQuery }
        ],
        search_domain_filter: ['dec.alaska.gov'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to search regulations' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Perplexity response received');

    const content = data.choices?.[0]?.message?.content || 'No regulations found.';
    const citations = data.citations || [];
    
    // Include mode-specific quick questions for the frontend
    const mode = contextMode && VALID_MODES.includes(contextMode) ? contextMode : 'research';
    const quickQuestions = MODE_QUICK_QUESTIONS[mode] || MODE_QUICK_QUESTIONS.research;

    return new Response(
      JSON.stringify({ content, citations, quickQuestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in find-regulations function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
