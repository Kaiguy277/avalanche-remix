# Avalanche Forecast Cache Cleanup Job

Deletes old avalanche forecast cache entries to prevent unbounded database growth.

## Purpose

The `avalanche_forecast_cache` table stores parsed NAC forecast data to improve performance. Without cleanup, this table grows indefinitely as new forecasts are published daily.

**Growth estimate without cleanup:**
- 15 zones × 1 forecast/day × 365 days = 5,475 entries/year
- ~200 MB/year with scraped content

## Configuration

### Retention Period
```typescript
const CACHE_RETENTION_DAYS = 7; // Keep entries for 7 days
```

**Rationale:**
- Avalanche forecasts are updated daily
- Cache entries older than 7 days are never used (newer forecast = different `published_time` = cache miss)
- 7 days provides buffer for debugging recent issues

### Dry Run Mode
```typescript
const DRY_RUN = false; // Set to true to preview deletions without executing
```

Set to `true` to see what would be deleted without actually deleting anything.

## Usage

### Manual Execution (Testing)

#### 1. Test locally with Supabase CLI
```bash
# Start Supabase locally
supabase start

# Deploy function locally
supabase functions deploy cleanup-avalanche-cache --no-verify-jwt

# Run cleanup
curl -X POST http://localhost:54321/functions/v1/cleanup-avalanche-cache \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

#### 2. Run in production
```bash
# Deploy to production
supabase functions deploy cleanup-avalanche-cache --project-ref YOUR_PROJECT_REF

# Trigger manually
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-avalanche-cache \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

**⚠️ Important:** Use service role key for production execution (cleanup requires DELETE permission).

### Response Format

#### Success Response
```json
{
  "success": true,
  "dryRun": false,
  "message": "Successfully deleted 127 old cache entries",
  "stats": {
    "totalEntriesBefore": 450,
    "deletedEntries": 127,
    "remainingEntries": 323,
    "cutoffDate": "2026-01-29T12:00:00.000Z",
    "retentionDays": 7
  }
}
```

#### Dry Run Response
```json
{
  "success": true,
  "dryRun": true,
  "message": "Dry run completed. Would delete 127 entries.",
  "stats": {
    "totalEntries": 450,
    "oldEntries": 127,
    "entriesKept": 323,
    "cutoffDate": "2026-01-29T12:00:00.000Z",
    "retentionDays": 7
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Failed to delete old entries: permission denied",
  "timestamp": "2026-02-05T12:00:00.000Z"
}
```

## Automated Scheduling

### Option 1: Supabase pg_cron (Recommended)

Enable pg_cron extension and schedule daily cleanup:

```sql
-- Enable pg_cron extension (run once)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cleanup job to run daily at 2 AM UTC
SELECT cron.schedule(
  'cleanup-avalanche-cache',           -- Job name
  '0 2 * * *',                          -- Cron schedule (2 AM daily)
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-avalanche-cache',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    )
  );
  $$
);

-- View scheduled jobs
SELECT * FROM cron.job;

-- Unschedule (if needed)
SELECT cron.unschedule('cleanup-avalanche-cache');
```

**⚠️ Security Note:** Store service role key in Supabase Vault, not in plain text:

```sql
-- Store key in vault (run once)
INSERT INTO vault.secrets (name, secret)
VALUES ('service_role_key', 'YOUR_SERVICE_ROLE_KEY');

-- Updated cron job using vault
SELECT cron.schedule(
  'cleanup-avalanche-cache',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-avalanche-cache',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key')
    )
  );
  $$
);
```

### Option 2: External Cron Service

Use a service like:
- **GitHub Actions** (free for public repos)
- **Vercel Cron Jobs**
- **Render Cron Jobs**
- **EasyCron** or **cron-job.org**

#### Example: GitHub Actions

Create `.github/workflows/cleanup-cache.yml`:

```yaml
name: Cleanup Avalanche Cache

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Run cleanup job
        run: |
          curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-avalanche-cache \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json"
```

Add `SUPABASE_SERVICE_ROLE_KEY` to GitHub repository secrets.

### Option 3: Supabase Dashboard Cron (UI)

1. Go to Supabase Dashboard → Database → Cron Jobs
2. Create new job:
   - **Name:** cleanup-avalanche-cache
   - **Schedule:** `0 2 * * *` (daily at 2 AM)
   - **Query:**
     ```sql
     SELECT net.http_post(
       url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-avalanche-cache',
       headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
     );
     ```

## Monitoring

### Check Cleanup Logs

View edge function logs in Supabase Dashboard:
1. Go to Edge Functions → cleanup-avalanche-cache → Logs
2. Look for cleanup execution logs:
   ```
   Starting avalanche forecast cache cleanup...
   Total cache entries: 450
   Old entries (to be deleted): 127
   Successfully deleted 127 cache entries
   ```

### Monitor Table Size

```sql
-- Check table size
SELECT
  pg_size_pretty(pg_total_relation_size('avalanche_forecast_cache')) as total_size,
  pg_size_pretty(pg_relation_size('avalanche_forecast_cache')) as table_size,
  pg_size_pretty(pg_indexes_size('avalanche_forecast_cache')) as indexes_size;

-- Count entries by age
SELECT
  CASE
    WHEN created_at > NOW() - INTERVAL '1 day' THEN '< 1 day'
    WHEN created_at > NOW() - INTERVAL '3 days' THEN '1-3 days'
    WHEN created_at > NOW() - INTERVAL '7 days' THEN '3-7 days'
    ELSE '> 7 days'
  END as age_bucket,
  COUNT(*) as entries,
  pg_size_pretty(SUM(pg_column_size(forecast_data))) as data_size
FROM avalanche_forecast_cache
GROUP BY age_bucket
ORDER BY
  CASE age_bucket
    WHEN '< 1 day' THEN 1
    WHEN '1-3 days' THEN 2
    WHEN '3-7 days' THEN 3
    ELSE 4
  END;
```

### Set Up Alerts

Create a monitoring query to alert if table grows too large:

```sql
-- Alert if table exceeds 500 MB
SELECT
  CASE
    WHEN pg_total_relation_size('avalanche_forecast_cache') > 500 * 1024 * 1024
    THEN 'ALERT: Table size exceeds 500 MB'
    ELSE 'OK'
  END as status,
  pg_size_pretty(pg_total_relation_size('avalanche_forecast_cache')) as current_size;
```

## Testing Checklist

Before enabling automated cleanup:

- [ ] Deploy function to production
- [ ] Test with `DRY_RUN = true` to verify what would be deleted
- [ ] Review sample entries that would be deleted
- [ ] Run actual cleanup manually (`DRY_RUN = false`)
- [ ] Verify cache still works after cleanup (check logs in avalanche-summary function)
- [ ] Set up automated scheduling (choose one method above)
- [ ] Monitor first few automated runs
- [ ] Set up table size monitoring

## Rollback

If cleanup deletes too much:

```sql
-- Restore from Supabase backups
-- Go to Database → Backups in Supabase Dashboard

-- Or adjust retention period and redeploy:
-- Change CACHE_RETENTION_DAYS to higher value (e.g., 30 days)
```

## Maintenance

### Adjust Retention Period

Edit `index.ts`:
```typescript
const CACHE_RETENTION_DAYS = 30; // Increase to 30 days if needed
```

Then redeploy:
```bash
supabase functions deploy cleanup-avalanche-cache
```

### Pause Cleanup

#### pg_cron method:
```sql
SELECT cron.unschedule('cleanup-avalanche-cache');
```

#### GitHub Actions method:
Disable the workflow in GitHub Actions UI

### Resume Cleanup

Re-enable the cron job using the scheduling method you chose above.

---

**Created:** 2026-02-05
**Retention Period:** 7 days
**Recommended Schedule:** Daily at 2 AM UTC
**Estimated Cleanup:** 100-200 entries/day after initial steady state
