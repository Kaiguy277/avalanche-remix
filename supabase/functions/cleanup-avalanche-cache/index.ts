import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration
const CACHE_RETENTION_DAYS = 7; // Keep cache entries for 7 days
const DRY_RUN = false; // Set to true to preview what would be deleted without actually deleting

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate cutoff date (entries older than this will be deleted)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - CACHE_RETENTION_DAYS);
    const cutoffISO = cutoffDate.toISOString();

    console.log(`Starting avalanche forecast cache cleanup...`);
    console.log(`Cutoff date: ${cutoffISO} (${CACHE_RETENTION_DAYS} days ago)`);
    console.log(`Dry run: ${DRY_RUN}`);

    // First, count how many entries would be deleted
    const { count: totalCount, error: countError } = await supabase
      .from('avalanche_forecast_cache')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(`Failed to count total entries: ${countError.message}`);
    }

    const { count: oldCount, error: oldCountError } = await supabase
      .from('avalanche_forecast_cache')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', cutoffISO);

    if (oldCountError) {
      throw new Error(`Failed to count old entries: ${oldCountError.message}`);
    }

    console.log(`Total cache entries: ${totalCount}`);
    console.log(`Old entries (to be deleted): ${oldCount}`);
    console.log(`Entries to keep: ${(totalCount || 0) - (oldCount || 0)}`);

    // Get details of entries to be deleted (for logging)
    const { data: oldEntries, error: fetchError } = await supabase
      .from('avalanche_forecast_cache')
      .select('zone_id, center_id, published_time, created_at, data_source')
      .lt('created_at', cutoffISO)
      .order('created_at', { ascending: true })
      .limit(100); // Limit to first 100 for logging

    if (fetchError) {
      console.warn(`Warning: Could not fetch old entries for logging: ${fetchError.message}`);
    } else if (oldEntries && oldEntries.length > 0) {
      console.log(`Sample of entries to be deleted (up to 100):`);
      oldEntries.forEach(entry => {
        const age = Math.floor(
          (Date.now() - new Date(entry.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        console.log(
          `  - ${entry.zone_id} (${entry.center_id}) | ` +
          `published: ${entry.published_time} | ` +
          `age: ${age} days | ` +
          `source: ${entry.data_source}`
        );
      });
      if ((oldCount || 0) > 100) {
        console.log(`  ... and ${(oldCount || 0) - 100} more entries`);
      }
    }

    let result;

    if (DRY_RUN) {
      console.log(`DRY RUN: Would delete ${oldCount} entries, but skipping actual deletion.`);
      result = {
        success: true,
        dryRun: true,
        message: `Dry run completed. Would delete ${oldCount} entries.`,
        stats: {
          totalEntries: totalCount,
          oldEntries: oldCount,
          entriesKept: (totalCount || 0) - (oldCount || 0),
          cutoffDate: cutoffISO,
          retentionDays: CACHE_RETENTION_DAYS,
        }
      };
    } else {
      // Perform the actual deletion
      console.log(`Deleting ${oldCount} old cache entries...`);

      const { error: deleteError, count: deletedCount } = await supabase
        .from('avalanche_forecast_cache')
        .delete({ count: 'exact' })
        .lt('created_at', cutoffISO);

      if (deleteError) {
        throw new Error(`Failed to delete old entries: ${deleteError.message}`);
      }

      console.log(`Successfully deleted ${deletedCount} cache entries`);

      result = {
        success: true,
        dryRun: false,
        message: `Successfully deleted ${deletedCount} old cache entries`,
        stats: {
          totalEntriesBefore: totalCount,
          deletedEntries: deletedCount,
          remainingEntries: (totalCount || 0) - (deletedCount || 0),
          cutoffDate: cutoffISO,
          retentionDays: CACHE_RETENTION_DAYS,
        }
      };
    }

    // Log final stats
    console.log('Cleanup completed successfully');
    console.log('Final stats:', JSON.stringify(result.stats, null, 2));

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Cleanup job failed:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
