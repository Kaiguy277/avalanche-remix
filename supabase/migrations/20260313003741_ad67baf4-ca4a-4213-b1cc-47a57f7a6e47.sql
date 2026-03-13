
CREATE TABLE public.avalanche_daily_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id VARCHAR NOT NULL,
  center_id VARCHAR NOT NULL,
  forecast_date DATE NOT NULL,
  published_time TIMESTAMPTZ,
  expires_time TIMESTAMPTZ,
  synthesized_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: one entry per zone per day
ALTER TABLE public.avalanche_daily_forecasts ADD CONSTRAINT uq_zone_forecast_date UNIQUE (zone_id, forecast_date);

-- Index for fast lookups
CREATE INDEX idx_daily_forecasts_zone_date ON public.avalanche_daily_forecasts (zone_id, forecast_date);

-- Enable RLS
ALTER TABLE public.avalanche_daily_forecasts ENABLE ROW LEVEL SECURITY;

-- Public read access (safety-critical data)
CREATE POLICY "Public read access" ON public.avalanche_daily_forecasts
  FOR SELECT USING (true);

-- Service role write access
CREATE POLICY "Service role insert" ON public.avalanche_daily_forecasts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role update" ON public.avalanche_daily_forecasts
  FOR UPDATE USING (true);

CREATE POLICY "Service role delete" ON public.avalanche_daily_forecasts
  FOR DELETE USING (true);
