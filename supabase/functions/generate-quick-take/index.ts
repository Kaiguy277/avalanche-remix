import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getStationsForZone } from '../_shared/weather-station-config.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NAC_API_BASE = 'https://api.avalanche.org/v2/public';
const nacHeaders = {
  'User-Agent': '(kaiconsulting.lovable.app, kaimyers@alaskapacific.edu)',
  'Accept': 'application/json',
};

// Strip HTML preserving paragraph breaks
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&rdquo;|&ldquo;/g, '"').replace(/&rsquo;|&lsquo;/g, "'").replace(/&deg;/g, '°')
    .replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ')
    .split('\n').map(l => l.trim()).join('\n').trim();
}

// Fetch NAC weather product for a center
async function fetchNacWeather(centerId: string): Promise<string | null> {
  try {
    const resp = await fetch(`${NAC_API_BASE}/product?type=weather&center_id=${centerId}`, { headers: nacHeaders });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.weather_discussion) return null;
    return stripHtml(data.weather_discussion);
  } catch { return null; }
}

// Fetch NOAA NWS forecast for a lat/lon
async function fetchNoaaForecast(lat: number, lon: number): Promise<string | null> {
  try {
    const nwsHeaders = { 'User-Agent': '(AvalancheComparison/1.0, kaimyers@alaskapacific.edu)', 'Accept': 'application/geo+json' };
    const pointsResp = await fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`, { headers: nwsHeaders });
    if (!pointsResp.ok) return null;
    const { properties: { gridId, gridX, gridY } } = await pointsResp.json();
    const forecastResp = await fetch(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast?units=us`, { headers: nwsHeaders });
    if (!forecastResp.ok) return null;
    const forecastData = await forecastResp.json();
    const periods = (forecastData.properties?.periods || []).slice(0, 6);
    return periods.length > 0
      ? '[NWS Mountain Forecast]\n' + periods.map((p: any) => `${p.name}: ${p.detailedForecast}`).join('\n')
      : null;
  } catch { return null; }
}

const systemPrompt = `<role>You are an expert avalanche safety analyst. Generate a Quick Take summary synthesizing avalanche conditions across the provided zones.</role>

<instructions>
Scale your quickTake based on the number of zones:

For 1-2 zones: Write 3-5 sentences for someone planning a specific trip. Name the zone(s). State danger ratings and primary avalanche problem(s). Describe the 2-3 day weather forecast (storms, wind, temps). Reference station observations when they confirm or contradict the forecast.

For 3-6 zones: Write 3-5 sentences comparing conditions. Identify whether danger is uniform or varies. Name the dominant problem type(s). Summarize the 2-3 day weather outlook. Call out any zone that stands out.

For 7+ zones: Write 5-8 sentences synthesizing the region. Be specific about WHERE danger is highest and lowest — name the areas/centers, not just a range. Explain WHY danger varies (e.g., more snow on the west slopes, wind loading on specific aspects). Name the dominant problem types and where they matter most. Describe the 2-3 day weather pattern with specifics: storm timing, expected amounts, wind speeds, temperature trends. Flag areas with expired or missing forecasts. Use sub-region names (e.g., "the west slopes of the Cascades", "Southcentral Alaska", "the Tetons") rather than individual zone names.

For ALL zone counts: Lead with the most critical safety information. Focus on the next 2-3 days. Use the WEATHER FORECAST data — incoming storms, wind events, and temperature changes are the most actionable information. Be specific with numbers when the data supports it (snow amounts, wind speeds, temperatures).
</instructions>

<examples>
EXAMPLE — 1 zone (Turnagain Pass):
"Turnagain Pass is rated Moderate at all elevations today, increasing to Considerable in the Alpine tomorrow. Wind Slab is the primary concern on north-through-east aspects above treeline, with recent skier-triggered activity confirming reactivity. A storm system moves in tonight bringing 8-14 inches of snow with SW ridgeline winds gusting to 55 mph, significantly increasing wind slab potential. Stations at Turnagain recorded +6 inches and 0.8 inches SWE in the last 24 hours with temperatures holding in the mid-20s."

EXAMPLE — 4 zones (CNFAIC center):
"Danger across the Chugach National Forest zones is mostly Low today, rising to Moderate in Alpine terrain tomorrow as winds increase. Persistent Slab on buried facets remains an isolated concern at upper elevations, while Loose Dry sluffs require sluff management on steep terrain. An incoming front tonight brings 6-12 inches with strengthening SW winds — expect fresh wind slabs forming on north-facing alpine terrain by tomorrow morning. The Chugach State Park forecast is expired; check cnfaic.org for updates."

EXAMPLE — 14 zones (Pacific Northwest):
"Considerable to High danger exists across the west slopes of the Washington Cascades today, where 12-18 inches of new snow and strong SW winds have built reactive Storm Slab and Wind Slab problems — natural avalanches are likely and human-triggered avalanches are very likely above treeline. The east slopes are seeing Moderate danger with less new snow but developing wind slabs on leeward aspects. Mt Hood and the central Oregon Cascades are at Moderate, with Storm Slab the primary concern as the current system wraps up. A second wave arrives Monday night bringing another 8-14 inches to the Washington Cascades with freezing levels dropping to 3,000 feet; expect danger to remain Considerable through midweek on the west side. Southern Oregon's forecast is currently unavailable — check official sources before traveling there."

EXAMPLE — 20 zones (all Alaska):
"The highest avalanche danger in Alaska right now is in Valdez, where Moderate conditions at all elevations reflect active Wind Slab and lingering Persistent Slab concerns — the Continental zone in particular warrants caution for deep persistent layers. Southcentral areas (Turnagain, Summit Lake) are mostly Low today but rising to Moderate tomorrow as winds pick up; buried facets remain a lurking concern and recent skier-triggered slides confirm the persistent weak layer is still reactive. Southeast Alaska (Juneau, Douglas Island) is seeing Moderate to Considerable danger with active wind loading on north and west aspects, and tomorrow's forecast calls for significant snowfall that will increase the problem. A Pacific front moves through tonight bringing 6-12 inches to Southcentral and heavier amounts in Southeast, with ridgeline winds 40-60 mph — expect fresh wind slabs across most areas by tomorrow morning. Several zones (Haines, Eastern Alaska Range, Cordova) have expired or missing forecasts; travelers in those areas should assume elevated danger and check official sources."
</examples>

<output_format>
Return valid JSON:
{
  "quickTake": "See instructions and examples above",
  "weatherHighlights": "2-3 day weather outlook: recent precipitation, forecast snow/wind/temps, and how weather is affecting the snowpack."
}
</output_format>

<constraints>
- Base every claim on the provided data. If data is missing, say so.
- Focus on the NEXT 2-3 DAYS using the weather forecast sections.
- For expired forecasts, flag them briefly.
- For 7+ zones, do NOT walk through zones one by one. Synthesize into regional patterns.
</constraints>`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const zones: any[] = body?.zones || [];

    if (zones.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No zones provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating Quick Take for ${zones.length} zones`);

    // Determine unique centers
    const centerIds = [...new Set(zones.map((z: any) => z.centerId).filter(Boolean))];

    // Fetch weather forecasts per center (NAC + NOAA fallback) in parallel
    const weatherForecasts = new Map<string, string>();
    const nacResults = await Promise.all(
      centerIds.map(async (centerId: string) => {
        const discussion = await fetchNacWeather(centerId);
        return { centerId, discussion };
      })
    );

    const centersWithNac = new Set<string>();
    for (const { centerId, discussion } of nacResults) {
      if (discussion) {
        weatherForecasts.set(centerId, discussion);
        centersWithNac.add(centerId);
      }
    }

    // NOAA fallback for centers without NAC weather
    const centersNeedingNoaa = centerIds.filter((c: string) => !centersWithNac.has(c));
    if (centersNeedingNoaa.length > 0) {
      await Promise.all(centersNeedingNoaa.map(async (centerId: string) => {
        const zone = zones.find((z: any) => z.centerId === centerId);
        if (!zone) return;
        const stations = getStationsForZone(zone.id);
        if (stations.length === 0) return;
        const forecast = await fetchNoaaForecast(stations[0].latitude, stations[0].longitude);
        if (forecast) weatherForecasts.set(centerId, forecast);
      }));
    }

    console.log(`Weather forecasts available for: ${[...weatherForecasts.keys()].join(', ') || 'none'}`);

    // Build concise AI context
    const zoneContexts = zones.map((zone: any) => {
      const today = zone.forecast?.[0]?.danger || {};
      const tomorrow = zone.forecast?.[1]?.danger || {};
      const centerId = zone.centerId || 'unknown';

      let ctx = `=== ${zone.name} (${centerId}) [${zone.id}] ===`;
      ctx += `\nFreshness: ${zone.freshness?.status || 'unknown'}`;
      ctx += `\nToday: Alpine=${today.alpine || 'NO_RATING'}, Treeline=${today.treeline || 'NO_RATING'}, BTL=${today.belowTreeline || 'NO_RATING'}`;
      ctx += `\nTomorrow: Alpine=${tomorrow.alpine || 'NO_RATING'}, Treeline=${tomorrow.treeline || 'NO_RATING'}, BTL=${tomorrow.belowTreeline || 'NO_RATING'}`;

      // Problems
      if (zone.problems?.length > 0) {
        ctx += `\nProblems: ${zone.problems.map((p: any) => {
          let s = p.name;
          if (p.likelihood) s += ` (${p.likelihood})`;
          if (p.size) s += ` D${p.size.min}-D${p.size.max}`;
          return s;
        }).join('; ')}`;
      }

      // Key message
      if (zone.keyMessage) ctx += `\nKey: ${zone.keyMessage.slice(0, 300)}`;

      // Weather snapshot
      if (zone.weather) {
        const w = zone.weather;
        if (w.snow !== 'N/A' || w.wind !== 'N/A' || w.temps !== 'N/A') {
          ctx += `\nWeather: Snow=${w.snow}, Wind=${w.wind}, Temps=${w.temps}`;
        }
      }

      // Station observations (summary)
      if (zone.weatherObservations?.length > 0) {
        const obs = zone.weatherObservations;
        const snowChanges = obs.map((o: any) => o.snow?.depth24hrChange).filter((v: any) => v !== null && v !== undefined);
        const temps = obs.map((o: any) => o.temperature?.current).filter((v: any) => v !== null && v !== undefined);
        const winds = obs.map((o: any) => o.wind?.speedMax24hr).filter((v: any) => v !== null && v !== undefined);
        if (snowChanges.length > 0) ctx += `\nStations 24hr snow: ${snowChanges.map((v: number) => `${v > 0 ? '+' : ''}${v}"`).join(', ')}`;
        if (temps.length > 0) ctx += `\nStation temps: ${temps.map((v: number) => `${v}°F`).join(', ')}`;
        if (winds.length > 0) ctx += `\nStation max wind 24hr: ${winds.map((v: number) => `${v} mph`).join(', ')}`;
      }

      return ctx;
    }).join('\n\n');

    // Add weather forecasts by center
    let weatherContext = '';
    for (const [centerId, forecast] of weatherForecasts) {
      weatherContext += `\n\n=== WEATHER FORECAST (${centerId}, next 2-3 days) ===\n${forecast.slice(0, 1500)}`;
    }

    // Build scope description
    const numZones = zones.length;
    const numCenters = centerIds.length;
    let scopeNote: string;
    if (numZones <= 2) {
      scopeNote = `${numZones} zone(s) — use the focused quickTake style from the examples.`;
    } else if (numZones <= 6) {
      scopeNote = `${numZones} zones across ${numCenters} center(s) — use the center/sub-regional quickTake style.`;
    } else {
      scopeNote = `${numZones} zones across ${numCenters} centers — use the regional quickTake style. Write at most 6 synthesized sentences. Do NOT walk through zones individually.`;
    }

    const userPrompt = `${scopeNote}

${zoneContexts}
${weatherContext}

Generate the quickTake and weatherHighlights based on the instructions and examples.`;

    console.log(`Calling AI for Quick Take synthesis (${numZones} zones, ${numCenters} centers)...`);

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI synthesis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: 'Empty AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parsed = JSON.parse(content);
    console.log(`Quick Take generated: ${parsed.quickTake?.length || 0} chars`);

    return new Response(
      JSON.stringify({
        success: true,
        quickTake: parsed.quickTake || '',
        weatherHighlights: parsed.weatherHighlights || '',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-quick-take:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
