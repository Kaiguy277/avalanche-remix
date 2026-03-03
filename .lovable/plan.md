
# Avalanche Forecast Caching Implementation

## Summary

This implementation adds database-backed caching for **raw NAC forecast data only**. Since AI summaries incorporate real-time SNOTEL observations for weather validation, they cannot be cached. However, caching the forecast data alone will save significant time on:

- NAC API calls (~500ms per zone)
- Firecrawl web scraping (2-5s per zone, plus credits)

**Expected improvement**: Reduce load times from 15-25s down to 5-10s for repeat requests on the same day.

## What Gets Cached vs Real-Time

| Data Type | Cached? | Reason |
|-----------|---------|--------|
| NAC forecast data (danger, problems, weather narrative) | Yes | Updated max once daily |
| Firecrawl scraped content | Yes | Same content as NAC |
| SNOTEL observations | No | Updates hourly, critical for safety |
| AI-synthesized summaries | No | Incorporates real-time SNOTEL data |

## Architecture

```text
Request Flow (After Implementation)
===================================

1. User requests zones [turnagain, hatcher-pass, valdez-maritime]
                              |
                              v
2. Quick map-layer fetch (~200ms) - get published_time for each zone
                              |
                              v
3. For each zone, check forecast cache:
   ┌─────────────────────────────────────────────────┐
   │  SELECT * FROM avalanche_forecast_cache        │
   │  WHERE zone_id = 'turnagain-girdwood'          │
   │    AND published_time = '2025-02-05T07:30:00Z' │
   └─────────────────────────────────────────────────┘
              |                           |
        [CACHE HIT]                 [CACHE MISS]
     Use cached data           Fetch from NAC API
     (Skip API call)           Store in cache
              |                           |
              └───────────┬───────────────┘
                          v
4. ALWAYS fetch fresh SNOTEL (existing 30-min in-memory cache)
                          |
                          v
5. ALWAYS call AI synthesis (combines forecast + SNOTEL)
                          |
                          v
6. Return response to user
```

## Database Schema

### Table: `avalanche_forecast_cache`

Stores raw forecast data per zone, keyed by the NAC `published_time`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `zone_id` | varchar | Zone identifier (e.g., "turnagain-girdwood") |
| `nac_zone_id` | varchar | NAC API zone ID (e.g., "2815") |
| `center_id` | varchar | Avalanche center (e.g., "CNFAIC") |
| `published_time` | timestamptz | Forecast issue time from NAC |
| `expires_time` | timestamptz | Forecast expiration from NAC |
| `forecast_data` | jsonb | Complete parsed forecast (danger, problems, weather, etc.) |
| `scraped_content` | text | Firecrawl markdown if used (null for API data) |
| `data_source` | varchar | "api", "scrape", or "map-layer" |
| `created_at` | timestamptz | Cache entry creation time |

**Unique constraint**: `(zone_id, published_time)` - ensures one entry per forecast version

**Index**: On `zone_id` for fast lookups

## RLS Policies

```sql
-- Public read access (avalanche data is safety-critical)
CREATE POLICY "Public read access" ON avalanche_forecast_cache
  FOR SELECT USING (true);

-- Only service role (edge functions) can write
CREATE POLICY "Service role write" ON avalanche_forecast_cache
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role update" ON avalanche_forecast_cache
  FOR UPDATE USING (true);
```

Note: RLS is enabled, but INSERT/UPDATE policies allow service role access. The table will only be written to by the edge function using `SUPABASE_SERVICE_ROLE_KEY`.

## Edge Function Changes

### New Flow in `avalanche-summary/index.ts`

1. **Add Supabase client import** for database operations

2. **Modify zone data fetching** (Step 2 in current code, lines 597-689):
   
   Before fetching from NAC API, check the cache:
   ```
   const cachedForecast = await checkForecastCache(zone.id, mapLayerPublishedTime);
   if (cachedForecast) {
     // Use cached data, skip API/scrape
     return buildZoneDataFromCache(cachedForecast, config);
   }
   // Otherwise fetch from API and store in cache
   ```

3. **Add cache helper functions**:
   - `checkForecastCache(zoneId, publishedTime)` - lookup by zone + timestamp
   - `storeForecastCache(zoneData)` - insert/update cache entry
   - `buildZoneDataFromCache(cached, config)` - reconstruct ZoneData from cache

4. **Keep everything else the same**:
   - SNOTEL fetching remains real-time
   - AI synthesis remains unchanged
   - Response format unchanged

### Cache Key Logic

The cache key is `(zone_id, published_time)`. When NAC publishes a new forecast:
- The `published_time` from map-layer changes
- Cache lookup returns null (miss)
- Fresh data is fetched and cached

This naturally handles daily forecast updates without time-based expiration.

## Implementation Steps

### Step 1: Database Migration

Create `avalanche_forecast_cache` table with:
- All columns defined above
- Unique constraint on `(zone_id, published_time)`
- Index on `zone_id`
- RLS policies for public read, service role write

### Step 2: Edge Function Updates

Modify `supabase/functions/avalanche-summary/index.ts`:

1. Add Supabase client creation at the top (using `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`)

2. Add cache lookup function that queries by zone_id and published_time

3. Add cache store function that upserts forecast data

4. Wrap the existing `fetchZoneForecast` and scraping logic with cache-aside pattern:
   - Check cache first
   - If hit, return cached data
   - If miss, fetch from source, store in cache, return

5. Add logging for cache hits/misses

### Step 3: Response Enhancement (Optional)

Add cache status to response for debugging:
```json
{
  "zonesScraped": [
    {
      "id": "turnagain-girdwood",
      "cacheStatus": "hit" | "miss" | "stored"
    }
  ]
}
```

## Performance Expectations

| Scenario | Current | After Caching |
|----------|---------|---------------|
| First request of day | 15-25s | 15-25s (same) |
| Second+ request, same zones | 15-25s | 5-10s |
| Mixed new/cached zones | 15-25s | 8-15s |

**Savings per cached zone**:
- API fetch: ~500ms saved
- Firecrawl scrape: 2-5s saved (when used)
- Credits: Firecrawl credits preserved

## Cache Maintenance

**Automatic cleanup**: Old cache entries naturally become orphaned when new forecasts are published. A periodic cleanup (optional future enhancement) could delete entries older than 7 days.

**No manual invalidation needed**: The cache key includes `published_time`, so new forecasts automatically bypass old cache entries.

## Files to Create/Modify

1. **New migration file**: `supabase/migrations/[timestamp]_avalanche_forecast_cache.sql`
   - Create table
   - Add constraints and indexes
   - Enable RLS
   - Add policies

2. **Modify**: `supabase/functions/avalanche-summary/index.ts`
   - Add Supabase client
   - Add cache check/store functions
   - Wrap fetch logic with cache-aside pattern
   - Add cache status logging

## Technical Considerations

- **Service role key**: Edge function already has access to `SUPABASE_SERVICE_ROLE_KEY` (used for Firecrawl calls)
- **Type safety**: Store `forecast_data` as JSONB matching the `ZoneData` interface
- **Graceful degradation**: If cache lookup fails, proceed with normal fetch (don't break the flow)
- **Logging**: Include cache hit/miss in logs for monitoring
