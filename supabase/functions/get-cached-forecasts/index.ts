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

    const cachedZones = (data || []).map((row: any) => ({
      ...row.synthesized_data,
      _cachedAt: row.created_at,
      _forecastDate: row.forecast_date,
    }));

    const cachedZoneIds = new Set((data || []).map((row: any) => row.zone_id));
    const missingZoneIds = zoneIds.filter(id => !cachedZoneIds.has(id));

    console.log(`Found ${cachedZones.length} cached, ${missingZoneIds.length} missing`);

    return new Response(
      JSON.stringify({
        success: true,
        zones: cachedZones,
        missingZoneIds,
        forecastDate,
        cached: true,
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
