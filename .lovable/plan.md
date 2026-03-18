

# Fix: Catch Late-Published Forecasts

## Problem
The cron job runs once at 7:30 AM AKST (16:30 UTC). Many avalanche centers publish forecasts later in the morning or update them throughout the day. Any forecast published after the cron run is missed until the next day.

## Solution: Add a Second Cron Run

Add a second daily cron job in the afternoon — around **1:00 PM AKST (22:00 UTC)**. This catches:
- Centers that publish forecasts mid-morning or early afternoon
- Updated/revised forecasts issued after the initial morning run

The existing `fetch-all-forecasts` function already uses `upsert` with `onConflict: 'zone_id,forecast_date'`, so a second run will simply overwrite any stale data with fresher forecasts — no code changes needed to the edge function itself.

## Implementation

1. **Add a second pg_cron schedule** via SQL query:
   - Schedule: `0 22 * * *` (10:00 PM UTC = 1:00 PM AKST)
   - Same function call as the existing job
   - Job name: `fetch-afternoon-avalanche-forecasts`

That's it — one SQL insert. No edge function or frontend changes required.

## Why Not More Runs?
- Each full run processes 28 centers × scraping + AI synthesis = significant API cost (Firecrawl, Perplexity)
- Two runs covers the realistic publishing window (early morning + late morning/midday)
- A third run could be added later if needed

