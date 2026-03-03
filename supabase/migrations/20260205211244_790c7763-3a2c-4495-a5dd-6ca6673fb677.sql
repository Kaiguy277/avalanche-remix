-- Create avalanche forecast cache table
CREATE TABLE public.avalanche_forecast_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id VARCHAR NOT NULL,
  nac_zone_id VARCHAR NOT NULL,
  center_id VARCHAR NOT NULL,
  published_time TIMESTAMPTZ NOT NULL,
  expires_time TIMESTAMPTZ,
  forecast_data JSONB NOT NULL,
  scraped_content TEXT,
  data_source VARCHAR NOT NULL DEFAULT 'api',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: one cache entry per forecast version per zone
ALTER TABLE public.avalanche_forecast_cache 
  ADD CONSTRAINT avalanche_forecast_cache_zone_published_unique 
  UNIQUE (zone_id, published_time);

-- Index for fast lookups by zone_id
CREATE INDEX idx_avalanche_forecast_cache_zone_id 
  ON public.avalanche_forecast_cache (zone_id);

-- Index for cleanup queries (finding old entries)
CREATE INDEX idx_avalanche_forecast_cache_created_at 
  ON public.avalanche_forecast_cache (created_at);

-- Enable Row Level Security
ALTER TABLE public.avalanche_forecast_cache ENABLE ROW LEVEL SECURITY;

-- Public read access (avalanche data is safety-critical)
CREATE POLICY "Public read access" 
  ON public.avalanche_forecast_cache 
  FOR SELECT 
  USING (true);

-- Service role can insert (edge functions)
CREATE POLICY "Service role insert" 
  ON public.avalanche_forecast_cache 
  FOR INSERT 
  WITH CHECK (true);

-- Service role can update (edge functions)
CREATE POLICY "Service role update" 
  ON public.avalanche_forecast_cache 
  FOR UPDATE 
  USING (true);

-- Service role can delete for cleanup
CREATE POLICY "Service role delete" 
  ON public.avalanche_forecast_cache 
  FOR DELETE 
  USING (true);

-- Add comment for documentation
COMMENT ON TABLE public.avalanche_forecast_cache IS 'Caches raw NAC avalanche forecast data to reduce API calls and scraping. Keyed by zone_id + published_time.';