

# Proactive Forecast Caching with Progressive Loading

## Problem
Every request hits NAC API + map-layer + potentially Firecrawl + SNOTEL + AI synthesis sequentially, taking 10-25 seconds. Forecasts only publish once per morning but are re-fetched on every user visit.

## Proposed Architecture

```text
Current Flow (every request):
  User click → [NAC API + Map Layer + Firecrawl + SNOTEL + AI] → 10-25s → Results

New Flow:
  Morning cron → [NAC API + Map Layer + Firecrawl + AI] → Store in DB
  
  User visit → Read cached forecasts from DB → ~1s → Show forecasts immediately
            → Fetch SNOTEL in parallel → ~2-3s → Append weather stations
```

## Changes

### 1. New Edge Function: `fetch-all-forecasts` (cron job)
- Runs daily at ~7:30 AM AKST (16:30 UTC) — after centers typically publish
- Fetches all 15 zones via NAC API + map-layer
- Runs AI synthesis per-center (group zones by center to reduce AI calls from 15 to ~6)
- Stores complete synthesized results in a new `avalanche_daily_forecasts` table
- Falls back to Firecrawl if API fails for a zone

### 2. New DB Table: `avalanche_daily_forecasts`
Stores the fully synthesized, ready-to-display forecast data:
- `id`, `zone_id`, `center_id`, `forecast_date` (date only), `published_time`
- `synthesized_data` (JSONB) — the complete zone object matching the `AvalancheZone` type (danger ratings, problems, key message, travel advice, weather narrative)
- `created_at`
- Unique on `(zone_id, forecast_date)`

### 3. New Edge Function: `get-cached-forecasts`
- Simple, fast endpoint: queries `avalanche_daily_forecasts` for today's date + requested zone IDs
- Returns pre-synthesized zone data immediately
- No AI calls, no NAC API calls, no Firecrawl

### 4. Separate SNOTEL Endpoint: `get-snotel-observations`
- Extract the existing SNOTEL fetching logic into its own edge function
- Takes zone IDs, returns weather station observations
- Called independently from the frontend

### 5. Frontend Changes (`AvalancheSummary.tsx` + `avalanche.ts`)
- **Phase 1 (instant)**: Call `get-cached-forecasts` → display forecast cards, comparison matrix, quick take immediately
- **Phase 2 (progressive)**: Call `get-snotel-observations` → append weather station cards to each zone as they load
- Show a small loading indicator on the weather station section while Phase 2 loads
- If no cached data exists for today (before cron runs, or new zone), fall back to existing `avalanche-summary` endpoint

### 6. Cron Job Setup
- Use `pg_cron` + `pg_net` to invoke `fetch-all-forecasts` daily at 16:30 UTC
- Keep the existing `avalanche-summary` endpoint as a manual fallback / refresh option

## What Stays the Same
- Existing `avalanche-summary` edge function remains as fallback
- Zone configuration, UI components, zone selector
- The `avalanche_forecast_cache` table (raw NAC data cache, still useful for the cron job)

## Performance Expectations

| Scenario | Current | After |
|----------|---------|-------|
| Typical visit (after cron) | 10-25s | ~1s forecasts + ~2-3s SNOTEL |
| First visit before cron | 10-25s | 10-25s (fallback) |
| SNOTEL data | Blocks everything | Loads progressively |

## Implementation Order
1. Create `avalanche_daily_forecasts` table
2. Build `get-cached-forecasts` edge function
3. Build `get-snotel-observations` edge function  
4. Build `fetch-all-forecasts` cron edge function
5. Update frontend for two-phase loading
6. Set up cron schedule

