
# Proactive Forecast Caching - IMPLEMENTED

## Architecture

```text
Morning cron (16:30 UTC / 7:30 AM AKST) → fetch-all-forecasts → avalanche_daily_forecasts table

User visit → get-cached-forecasts (~1s) → Show forecasts immediately
          → get-snotel-observations (~2-3s) → Append weather stations progressively
          → Falls back to avalanche-summary if no cache
```

## Components

| Component | Status | Description |
|-----------|--------|-------------|
| `avalanche_daily_forecasts` table | ✅ | Stores synthesized zone data per day |
| `get-cached-forecasts` edge function | ✅ | Fast DB read for today's forecasts |
| `get-snotel-observations` edge function | ✅ | Standalone SNOTEL fetcher |
| `fetch-all-forecasts` edge function | ✅ | Cron job that calls avalanche-summary per center |
| Frontend two-phase loading | ✅ | Phase 1 cached, Phase 2 SNOTEL progressive |
| Cron schedule (pg_cron) | ✅ | Daily at 16:30 UTC |

## Notes
- RLS: Public read, service role write (intentional for safety-critical data)
- The `avalanche_forecast_cache` table (raw NAC data) still exists for the cron job's underlying calls
- Summary-level data (quickTake, bottomLine) stored under `_summary_{centerId}` zone entries
