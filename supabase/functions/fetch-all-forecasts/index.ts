import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This function calls the existing avalanche-summary endpoint for each center grouping,
// then stores the synthesized results in avalanche_daily_forecasts.
// It's designed to be called by a daily cron job.

const ZONE_GROUPS: { centerId: string; zoneIds: string[] }[] = [
  { centerId: 'CNFAIC', zoneIds: ['turnagain-girdwood', 'summit', 'seward', 'chugach-state-park'] },
  { centerId: 'HPAC', zoneIds: ['hatcher-pass'] },
  { centerId: 'VAC', zoneIds: ['valdez-maritime', 'valdez-intermountain', 'valdez-continental'] },
  { centerId: 'EARAC', zoneIds: ['earac-north', 'earac-south'] },
  { centerId: 'CAAC', zoneIds: ['douglas-island', 'juneau-mainland'] },
  { centerId: 'HAC', zoneIds: ['haines-lutak', 'haines-transitional', 'haines-chilkat-pass'] },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get today's date in Alaska time
    const now = new Date();
    const akTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Anchorage' }));
    const forecastDate = akTime.toISOString().split('T')[0];

    console.log(`=== DAILY FORECAST FETCH: ${forecastDate} ===`);

    // Process each center group by calling the existing avalanche-summary endpoint
    // This reuses all existing logic (NAC API, Firecrawl fallback, AI synthesis)
    const results: { centerId: string; success: boolean; zonesStored: number; error?: string }[] = [];

    for (const group of ZONE_GROUPS) {
      console.log(`\nProcessing ${group.centerId}: ${group.zoneIds.length} zones...`);
      
      try {
        // Call the existing avalanche-summary function
        const response = await fetch(`${supabaseUrl}/functions/v1/avalanche-summary`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ zoneIds: group.zoneIds }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed for ${group.centerId}: ${response.status} ${errorText}`);
          results.push({ centerId: group.centerId, success: false, zonesStored: 0, error: `HTTP ${response.status}` });
          continue;
        }

        const data = await response.json();

        if (!data.success || !data.summary?.zones) {
          console.error(`No summary data for ${group.centerId}`);
          results.push({ centerId: group.centerId, success: false, zonesStored: 0, error: data.error || 'No summary' });
          continue;
        }

        // Store each zone's synthesized data
        let zonesStored = 0;
        for (const zone of data.summary.zones) {
          const zoneScrapedInfo = data.zonesScraped?.find((z: any) => z.id === zone.id);
          
          const { error: upsertError } = await supabase
            .from('avalanche_daily_forecasts')
            .upsert({
              zone_id: zone.id,
              center_id: group.centerId,
              forecast_date: forecastDate,
              published_time: zoneScrapedInfo?.freshness?.issueDate ? new Date(zoneScrapedInfo.freshness.issueDate).toISOString() : null,
              expires_time: zoneScrapedInfo?.freshness?.expiresDate ? new Date(zoneScrapedInfo.freshness.expiresDate).toISOString() : null,
              synthesized_data: {
                id: zone.id,
                name: zone.name,
                forecastUrl: zone.forecastUrl,
                forecast: zone.forecast,
                weather: zone.weather,
                problems: zone.problems,
                keyMessage: zone.keyMessage,
                travelAdvice: zone.travelAdvice,
                freshness: zone.freshness,
                weatherValidation: zone.weatherValidation,
              },
            }, {
              onConflict: 'zone_id,forecast_date',
            });

          if (upsertError) {
            console.error(`Failed to store ${zone.id}:`, upsertError);
          } else {
            zonesStored++;
            console.log(`Stored: ${zone.id}`);
          }
        }

        // Also store the summary-level data (quickTake, bottomLine, weatherHighlights) 
        // under a special "_summary" zone for this center
        const { error: summaryError } = await supabase
          .from('avalanche_daily_forecasts')
          .upsert({
            zone_id: `_summary_${group.centerId}`,
            center_id: group.centerId,
            forecast_date: forecastDate,
            synthesized_data: {
              quickTake: data.summary.quickTake,
              weatherHighlights: data.summary.weatherHighlights,
              bottomLine: data.summary.bottomLine,
            },
          }, {
            onConflict: 'zone_id,forecast_date',
          });

        if (summaryError) {
          console.error(`Failed to store summary for ${group.centerId}:`, summaryError);
        }

        results.push({ centerId: group.centerId, success: true, zonesStored });
        console.log(`${group.centerId}: stored ${zonesStored} zones`);

      } catch (error) {
        console.error(`Error processing ${group.centerId}:`, error);
        results.push({ centerId: group.centerId, success: false, zonesStored: 0, error: String(error) });
      }
    }

    const totalStored = results.reduce((sum, r) => sum + r.zonesStored, 0);
    const totalSuccess = results.filter(r => r.success).length;

    console.log(`\n=== COMPLETE: ${totalStored} zones stored from ${totalSuccess}/${ZONE_GROUPS.length} centers ===`);

    return new Response(
      JSON.stringify({
        success: true,
        forecastDate,
        results,
        totalZonesStored: totalStored,
        totalCentersProcessed: totalSuccess,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-all-forecasts:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
