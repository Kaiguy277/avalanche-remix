import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This function calls the existing avalanche-summary endpoint for each center grouping,
// then stores the synthesized results in avalanche_daily_forecasts.
// It's designed to be called by a daily cron job.
// Centers are processed in parallel batches of BATCH_SIZE to avoid timeouts.

const ZONE_GROUPS: { centerId: string; zoneIds: string[] }[] = [
  // Alaska
  { centerId: 'CNFAIC', zoneIds: ['turnagain-girdwood', 'summit', 'seward', 'chugach-state-park'] },
  { centerId: 'HPAC', zoneIds: ['hatcher-pass'] },
  { centerId: 'VAC', zoneIds: ['valdez-maritime', 'valdez-intermountain', 'valdez-continental'] },
  { centerId: 'CAC', zoneIds: ['cordova'] },
  { centerId: 'EARAC', zoneIds: ['earac-north', 'earac-south'] },
  { centerId: 'CAAC', zoneIds: ['douglas-island', 'juneau-mainland'] },
  { centerId: 'HAC', zoneIds: ['haines-lutak', 'haines-transitional', 'haines-chilkat-pass'] },
  // Pacific Northwest
  { centerId: 'NWAC', zoneIds: ['olympics', 'west-slopes-north', 'west-slopes-central', 'west-slopes-south', 'stevens-pass', 'snoqualmie-pass', 'east-slopes-north', 'east-slopes-central', 'east-slopes-south', 'mt-hood'] },
  { centerId: 'COAA', zoneIds: ['central-cascades', 'newberry'] },
  { centerId: 'WAC', zoneIds: ['northern-wallowas', 'southern-wallowas', 'elkhorns', 'blues'] },
  { centerId: 'SOAIX', zoneIds: ['southern-oregon'] },
  // Colorado
  { centerId: 'CAIC', zoneIds: ['caic-northern-san-juan', 'caic-sangre-de-cristo', 'caic-southern-san-juan', 'caic-park-range', 'caic-front-range-north', 'caic-vail-summit-county', 'caic-front-range-boulder', 'caic-grand-mesa-west-elk', 'caic-elk-mountains', 'caic-sawatch-range', 'caic-front-range-south'] },
  // California & Nevada
  { centerId: 'SAC', zoneIds: ['central-sierra-nevada'] },
  { centerId: 'ESAC', zoneIds: ['eastside-region'] },
  { centerId: 'BAC', zoneIds: ['bridgeport'] },
  { centerId: 'MSAC', zoneIds: ['mount-shasta'] },
  // Idaho
  { centerId: 'SNFAC', zoneIds: ['banner-summit', 'galena-summit-eastern-mtns', 'sawtooth-western-smoky-mtns', 'soldier-wood-river-valley-mtns'] },
  { centerId: 'PAC', zoneIds: ['salmon-river-mountains', 'west-mountains'] },
  { centerId: 'IPAC', zoneIds: ['selkirk-mountains', 'west-cabinet-mountains', 'east-cabinet-mountains', 'silver-valley-bitterroot-mountains', 'purcell-mountains'] },
  // Montana
  { centerId: 'GNFAC', zoneIds: ['bridger-range', 'northern-gallatin-range', 'southern-gallatin-range', 'northern-madison-range', 'southern-madison-range', 'lionhead-area', 'island-park', 'cooke-city'] },
  { centerId: 'FAC', zoneIds: ['whitefish-range', 'swan-range', 'flathead-range-glacier-np'] },
  { centerId: 'WCMAC', zoneIds: ['seeley-lake', 'rattlesnake', 'bitterroot'] },
  // Wyoming
  { centerId: 'BTAC', zoneIds: ['tetons', 'togwotee-pass', 'snake-river-range', 'salt-river-wyoming-ranges'] },
  { centerId: 'EWYAIX', zoneIds: ['big-horns', 'snowy-range', 'sierra-madre'] },
  // Utah
  { centerId: 'UAC', zoneIds: ['logan', 'ogden', 'salt-lake', 'provo', 'uintas', 'skyline', 'moab', 'abajos', 'southwest'] },
  // New Mexico & Arizona
  { centerId: 'TAC', zoneIds: ['northern-new-mexico'] },
  { centerId: 'KPAC', zoneIds: ['san-francisco-peaks'] },
  // Northeast
  { centerId: 'MWAC', zoneIds: ['presidential-range'] },
];

const BATCH_SIZE = 6; // Process 6 centers in parallel at a time

async function processCenter(
  group: { centerId: string; zoneIds: string[] },
  supabaseUrl: string,
  supabaseServiceKey: string,
  supabase: any,
  forecastDate: string,
): Promise<{ centerId: string; success: boolean; zonesStored: number; error?: string }> {
  try {
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
      return { centerId: group.centerId, success: false, zonesStored: 0, error: `HTTP ${response.status}` };
    }

    const data = await response.json();

    if (!data.success || !data.summary?.zones) {
      console.error(`No summary data for ${group.centerId}`);
      return { centerId: group.centerId, success: false, zonesStored: 0, error: data.error || 'No summary' };
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
      }
    }

    // Store summary-level data
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

    console.log(`✅ ${group.centerId}: stored ${zonesStored} zones`);
    return { centerId: group.centerId, success: true, zonesStored };

  } catch (error) {
    console.error(`Error processing ${group.centerId}:`, error);
    return { centerId: group.centerId, success: false, zonesStored: 0, error: String(error) };
  }
}

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

    console.log(`=== DAILY FORECAST FETCH: ${forecastDate} (${ZONE_GROUPS.length} centers, batch size ${BATCH_SIZE}) ===`);

    const results: { centerId: string; success: boolean; zonesStored: number; error?: string }[] = [];

    // Process centers in parallel batches
    for (let i = 0; i < ZONE_GROUPS.length; i += BATCH_SIZE) {
      const batch = ZONE_GROUPS.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(ZONE_GROUPS.length / BATCH_SIZE);
      console.log(`\n--- Batch ${batchNum}/${totalBatches}: ${batch.map(g => g.centerId).join(', ')} ---`);

      const batchResults = await Promise.all(
        batch.map(group => processCenter(group, supabaseUrl, supabaseServiceKey, supabase, forecastDate))
      );
      results.push(...batchResults);
    }

    const totalStored = results.reduce((sum, r) => sum + r.zonesStored, 0);
    const totalSuccess = results.filter(r => r.success).length;
    const failures = results.filter(r => !r.success);

    console.log(`\n=== COMPLETE: ${totalStored} zones stored from ${totalSuccess}/${ZONE_GROUPS.length} centers ===`);
    if (failures.length > 0) {
      console.log(`⚠️ Failed centers: ${failures.map(f => `${f.centerId} (${f.error})`).join(', ')}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        forecastDate,
        results,
        totalZonesStored: totalStored,
        totalCentersProcessed: totalSuccess,
        totalCentersFailed: failures.length,
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
