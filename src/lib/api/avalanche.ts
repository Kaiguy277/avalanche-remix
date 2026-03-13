import { supabase } from '@/integrations/supabase/client';

export type DangerRating = 'LOW' | 'MODERATE' | 'CONSIDERABLE' | 'HIGH' | 'EXTREME' | 'NO_RATING';

export interface ZoneFreshness {
  issueDate: string | null;
  expiresDate: string | null;
  ageHours: number | null;
  hoursUntilExpiry: number | null;
  status: 'current' | 'recent' | 'expiring' | 'expired' | 'unknown';
}

export interface ElevationDanger {
  alpine: DangerRating;
  treeline: DangerRating;
  belowTreeline: DangerRating;
}

export interface DayForecast {
  date: string;
  danger: ElevationDanger;
}

export interface WeatherSnapshot {
  snow: string;
  wind: string;
  temps: string;
}

export interface TempDataPoint {
  timestamp: string;
  value: number;
}

export interface AspectElevation {
  elevation: string; // 'alpine' | 'treeline' | 'belowTreeline'
  aspects: string[]; // ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
}

export interface AvalancheProblem {
  name: string;
  likelihood: string | null;
  size: { min: number; max: number } | null;
  aspects: AspectElevation[];
  discussion: string | null;
}

export interface WeatherObservation {
  stationTriplet: string;
  stationName: string;
  elevation: number; // station elevation in feet
  timestamp: string; // ISO 8601 timestamp of most recent observation
  snow: {
    depth: number | null;              // current snow depth (inches)
    depth24hrChange: number | null;    // change in last 24hr (inches)
    depth72hrChange: number | null;    // change in last 72hr (inches)
    depth7dayChange: number | null;    // change in last 7 days (inches)
    precip24hr: number | null;         // precipitation in last 24hr (inches)
    precip72hr: number | null;         // precipitation in last 72hr (inches)
    precip48hr: number | null;         // precipitation in last 48hr (inches)
    precip7day: number | null;         // precipitation in last 7 days (inches)
    swe: number | null;                // snow water equivalent (inches)
    snowPercentage24hr: number | null; // snow percentage for 24hr (from SWE)
    snowPercentage72hr: number | null; // snow percentage for 72hr (from SWE)
  };
  temperature: {
    current: number | null;            // most recent temp (°F)
    high24hr: number | null;           // 24hr high (°F)
    low24hr: number | null;            // 24hr low (°F)
    high72hr: number | null;           // 72hr high (°F)
    low72hr: number | null;            // 72hr low (°F)
    avg24hr: number | null;            // 24hr average (°F)
    avg72hr: number | null;            // 72hr average (°F)
    trend: 'warming' | 'cooling' | 'stable' | null;
    hourly24hr?: TempDataPoint[];      // hourly temps for last 24hr (for sparkline)
    hourly72hr?: TempDataPoint[];      // hourly temps for last 72hr (for sparkline)
  };
  wind: {
    speedAvg24hr: number | null;       // 24hr average (mph)
    speedMax24hr: number | null;       // 24hr max (mph)
    speedAvg72hr: number | null;       // 72hr average (mph)
    speedMax72hr: number | null;       // 72hr max (mph)
    direction: string | null;          // predominant direction (most recent)
    direction24hr: string | null;      // predominant 24hr direction
    direction72hr: string | null;      // predominant 72hr direction
  } | null; // null if station doesn't have wind sensors
  dataQuality: 'good' | 'partial' | 'poor';
}

export interface AvalancheZone {
  id: string;
  name: string;
  forecastUrl: string;
  forecast: DayForecast[];
  weather: WeatherSnapshot;
  problems: AvalancheProblem[];
  keyMessage: string;
  travelAdvice: string;
  freshness: ZoneFreshness;
  weatherObservations?: WeatherObservation[];
  weatherValidation?: 'confirmed' | 'partial' | 'discrepancy' | 'no_data';
}

export interface AvalancheSummary {
  quickTake: string;
  zones: AvalancheZone[];
  weatherHighlights: string;
  bottomLine: string;
}

export interface ScrapedZoneInfo {
  id: string;
  name: string;
  center: string;
  success: boolean;
  freshness: ZoneFreshness;
}

export interface AvalancheResponse {
  success: boolean;
  error?: string;
  summary?: AvalancheSummary;
  scrapedAt?: string;
  zonesScraped?: ScrapedZoneInfo[];
}

export interface CachedForecastResponse {
  success: boolean;
  zones?: AvalancheZone[];
  missingZoneIds?: string[];
  forecastDate?: string;
  cached?: boolean;
  error?: string;
}

export interface SnotelResponse {
  success: boolean;
  observations?: Record<string, WeatherObservation[]>;
  error?: string;
}

export const avalancheApi = {
  // Original full endpoint (fallback)
  async getSummary(zoneIds?: string[]): Promise<AvalancheResponse> {
    const { data, error } = await supabase.functions.invoke('avalanche-summary', {
      body: { zoneIds },
    });

    if (error) {
      console.error('Error calling avalanche-summary:', error);
      return { success: false, error: error.message };
    }

    return data;
  },

  // Phase 1: Get cached forecasts (fast, ~1s)
  async getCachedForecasts(zoneIds: string[]): Promise<CachedForecastResponse> {
    const { data, error } = await supabase.functions.invoke('get-cached-forecasts', {
      body: { zoneIds },
    });

    if (error) {
      console.error('Error calling get-cached-forecasts:', error);
      return { success: false, error: error.message };
    }

    return data;
  },

  // Phase 2: Get SNOTEL observations (progressive, ~2-3s)
  async getSnotelObservations(zoneIds: string[]): Promise<SnotelResponse> {
    const { data, error } = await supabase.functions.invoke('get-snotel-observations', {
      body: { zoneIds },
    });

    if (error) {
      console.error('Error calling get-snotel-observations:', error);
      return { success: false, error: error.message };
    }

    return data;
  },
};
