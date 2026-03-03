-- Setup script for automated avalanche forecast cache cleanup
-- Run this in Supabase SQL Editor after deploying the cleanup-avalanche-cache function

-- ============================================================================
-- STEP 1: Enable required extensions
-- ============================================================================

-- Enable pg_cron for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable http extension for making HTTP requests
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Enable vault for secure secret storage (optional but recommended)
CREATE EXTENSION IF NOT EXISTS supabase_vault;

-- ============================================================================
-- STEP 2: Store service role key securely (RECOMMENDED)
-- ============================================================================

-- Replace 'YOUR_SERVICE_ROLE_KEY' with your actual service role key
-- Find it in: Supabase Dashboard → Settings → API → service_role key

-- IMPORTANT: Only run this once, then delete this line from the file
-- INSERT INTO vault.secrets (name, secret)
-- VALUES ('service_role_key', 'YOUR_SERVICE_ROLE_KEY')
-- ON CONFLICT (name) DO UPDATE SET secret = EXCLUDED.secret;

-- Verify key is stored (should return 1 row, secret is encrypted)
-- SELECT name, created_at FROM vault.secrets WHERE name = 'service_role_key';

-- ============================================================================
-- STEP 3: Get your Supabase project URL
-- ============================================================================

-- Your project URL format: https://YOUR_PROJECT_REF.supabase.co
-- Find it in: Supabase Dashboard → Settings → API → Project URL

-- Example: https://abcdefghijklmnop.supabase.co

-- ============================================================================
-- STEP 4: Schedule the cleanup job
-- ============================================================================

-- Option A: Using Vault (RECOMMENDED - more secure)
SELECT cron.schedule(
  'cleanup-avalanche-cache',                    -- Job name
  '0 2 * * *',                                   -- Schedule: Daily at 2 AM UTC
  $$
  SELECT extensions.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-avalanche-cache',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = 'service_role_key'
      )
    )
  );
  $$
);

-- Option B: Direct key (NOT RECOMMENDED - less secure)
-- Only use this if vault is not available
-- SELECT cron.schedule(
--   'cleanup-avalanche-cache',
--   '0 2 * * *',
--   $$
--   SELECT extensions.http_post(
--     url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-avalanche-cache',
--     headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
--   );
--   $$
-- );

-- ============================================================================
-- VERIFICATION & MONITORING QUERIES
-- ============================================================================

-- View all scheduled cron jobs
SELECT
  jobid,
  jobname,
  schedule,
  active,
  command
FROM cron.job
WHERE jobname = 'cleanup-avalanche-cache';

-- View cron job execution history (last 10 runs)
SELECT
  jobid,
  runid,
  job_pid,
  database,
  username,
  command,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'cleanup-avalanche-cache')
ORDER BY start_time DESC
LIMIT 10;

-- Check current cache table size and entry count
SELECT
  COUNT(*) as total_entries,
  pg_size_pretty(pg_total_relation_size('avalanche_forecast_cache')) as total_size,
  pg_size_pretty(pg_relation_size('avalanche_forecast_cache')) as table_size,
  pg_size_pretty(pg_indexes_size('avalanche_forecast_cache')) as indexes_size,
  MIN(created_at) as oldest_entry,
  MAX(created_at) as newest_entry
FROM avalanche_forecast_cache;

-- Preview what would be deleted (entries older than 7 days)
SELECT
  zone_id,
  center_id,
  published_time,
  created_at,
  EXTRACT(DAY FROM (NOW() - created_at)) as age_days,
  data_source,
  pg_size_pretty(pg_column_size(forecast_data)) as entry_size
FROM avalanche_forecast_cache
WHERE created_at < NOW() - INTERVAL '7 days'
ORDER BY created_at ASC
LIMIT 20;

-- ============================================================================
-- MANAGEMENT COMMANDS
-- ============================================================================

-- Manually trigger cleanup immediately (for testing)
-- SELECT extensions.http_post(
--   url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-avalanche-cache',
--   headers := jsonb_build_object(
--     'Content-Type', 'application/json',
--     'Authorization', 'Bearer ' || (
--       SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key'
--     )
--   )
-- );

-- Pause/disable the cron job
-- UPDATE cron.job
-- SET active = false
-- WHERE jobname = 'cleanup-avalanche-cache';

-- Resume/enable the cron job
-- UPDATE cron.job
-- SET active = true
-- WHERE jobname = 'cleanup-avalanche-cache';

-- Change schedule (example: run every 12 hours instead of daily)
-- UPDATE cron.job
-- SET schedule = '0 */12 * * *'
-- WHERE jobname = 'cleanup-avalanche-cache';

-- Delete/unschedule the cron job completely
-- SELECT cron.unschedule('cleanup-avalanche-cache');

-- ============================================================================
-- MONITORING ALERTS
-- ============================================================================

-- Create a view for cache health monitoring
CREATE OR REPLACE VIEW cache_health AS
SELECT
  COUNT(*) as total_entries,
  SUM(CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN 1 ELSE 0 END) as entries_last_24h,
  SUM(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) as entries_last_7d,
  SUM(CASE WHEN created_at <= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) as old_entries,
  pg_size_pretty(pg_total_relation_size('avalanche_forecast_cache')) as total_size,
  pg_total_relation_size('avalanche_forecast_cache') as total_size_bytes,
  CASE
    WHEN pg_total_relation_size('avalanche_forecast_cache') > 500 * 1024 * 1024 THEN 'WARNING: Size > 500 MB'
    WHEN SUM(CASE WHEN created_at <= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) > 100 THEN 'WARNING: Too many old entries'
    ELSE 'OK'
  END as health_status
FROM avalanche_forecast_cache;

-- Query the health view
SELECT * FROM cache_health;

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- If cleanup fails, check:

-- 1. Verify edge function is deployed
-- SELECT * FROM pg_catalog.pg_stat_activity WHERE query LIKE '%cleanup-avalanche-cache%';

-- 2. Check if http extension can make requests
-- SELECT extensions.http_get('https://httpbin.org/get');

-- 3. Test vault secret retrieval
-- SELECT name, created_at FROM vault.secrets WHERE name = 'service_role_key';
-- SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key';

-- 4. Check cron job permissions
-- SELECT current_user, session_user;

-- 5. View recent errors in cron job runs
-- SELECT * FROM cron.job_run_details
-- WHERE status != 'succeeded'
-- ORDER BY start_time DESC
-- LIMIT 5;

-- ============================================================================
-- NOTES
-- ============================================================================

/*
Cron Schedule Format: minute hour day month weekday

Examples:
  '0 2 * * *'      - Daily at 2 AM UTC
  '0 */6 * * *'    - Every 6 hours
  '0 0 * * 0'      - Weekly on Sunday at midnight
  '*/30 * * * *'   - Every 30 minutes

Timezone: All cron jobs run in UTC

Retention Period: Currently set to 7 days in the edge function
  - Edit supabase/functions/cleanup-avalanche-cache/index.ts to change
  - Redeploy after changing: supabase functions deploy cleanup-avalanche-cache

Expected Behavior:
  - First run: May delete many old entries (if cache has been running for weeks)
  - Steady state: Deletes ~100-200 entries per day (1 day of expired forecasts)

Safety:
  - Cleanup only deletes entries older than 7 days
  - Active forecasts are never deleted (they have recent created_at timestamps)
  - Cache misses after cleanup will refetch from NAC API (transparent to users)
*/
