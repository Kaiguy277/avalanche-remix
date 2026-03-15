import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json().catch(() => ({}));
    const zoneIds: string[] = body?.zoneIds || [];

    if (zoneIds.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No zone IDs provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get today's date in Alaska time (AKST = UTC-9, AKDT = UTC-8)
    const now = new Date();
    const akTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Anchorage' }));
    const forecastDate = akTime.toISOString().split('T')[0]; // YYYY-MM-DD

    console.log(`Fetching cached forecasts for ${zoneIds.length} zones, date: ${forecastDate}`);

    // Determine which center summary entries to fetch
    // We need _summary_* entries to get quickTake, bottomLine, weatherHighlights
    const centerIds = new Set<string>();
    // Map zone IDs to center IDs based on known prefixes
    const centerMapping: Record<string, string> = {
      'turnagain-girdwood': 'CNFAIC', 'summit': 'CNFAIC', 'seward': 'CNFAIC', 'chugach-state-park': 'CNFAIC',
      'hatcher-pass': 'HPAC',
      'valdez-maritime': 'VAC', 'valdez-intermountain': 'VAC', 'valdez-continental': 'VAC', 'cordova': 'VAC',
      'earac-north': 'EARAC', 'earac-south': 'EARAC',
      'douglas-island': 'JNFAC', 'juneau-mainland': 'JNFAC',
      'haines-lutak': 'HAFAC', 'haines-transitional': 'HAFAC', 'haines-chilkat-pass': 'HAFAC',
    };
    for (const zoneId of zoneIds) {
      const center = centerMapping[zoneId];
      if (center) centerIds.add(center);
    }
    const summaryZoneIds = Array.from(centerIds).map(c => `_summary_${c}`);
    const allRequestedIds = [...zoneIds, ...summaryZoneIds];

    const { data, error } = await supabase
      .from('avalanche_daily_forecasts')
      .select('*')
      .in('zone_id', allRequestedIds)
      .eq('forecast_date', forecastDate);

    if (error) {
      console.error('Database query error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch cached forecasts' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Separate summary entries from zone entries
    const summaryEntries: Record<string, any> = {};
    const zoneEntries: any[] = [];
    
    for (const row of (data || [])) {
      if (row.zone_id.startsWith('_summary_')) {
        summaryEntries[row.zone_id] = row.synthesized_data;
      } else {
        zoneEntries.push({
          ...row.synthesized_data,
          _cachedAt: row.created_at,
          _forecastDate: row.forecast_date,
        });
      }
    }

    // Merge summary data from all centers
    let quickTake = '';
    let weatherHighlights = '';
    let bottomLine = '';
    const quickTakes: string[] = [];
    const bottomLines: string[] = [];
    const weatherHighlightsList: string[] = [];
    
    for (const [_, summaryData] of Object.entries(summaryEntries)) {
      const sd = summaryData as any;
      if (sd.quickTake) quickTakes.push(sd.quickTake);
      if (sd.bottomLine) bottomLines.push(sd.bottomLine);
      if (sd.weatherHighlights) weatherHighlightsList.push(sd.weatherHighlights);
    }
    
    quickTake = quickTakes.join(' ');
    bottomLine = bottomLines.join(' ');
    weatherHighlights = weatherHighlightsList.join(' ');

    const cachedZoneIds = new Set(zoneEntries.map((z: any) => z.id));
    const missingZoneIds = zoneIds.filter(id => !cachedZoneIds.has(id));

    console.log(`Found ${zoneEntries.length} cached zones, ${Object.keys(summaryEntries).length} summaries, ${missingZoneIds.length} missing`);

    return new Response(
      JSON.stringify({
        success: true,
        zones: zoneEntries,
        missingZoneIds,
        forecastDate,
        cached: true,
        quickTake,
        weatherHighlights,
        bottomLine,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-cached-forecasts:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
