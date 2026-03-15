import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getStationsForZone } from '../_shared/weather-station-config.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NAC_API_BASE = 'https://api.avalanche.org/v2/public';
const NWS_API_BASE = 'https://api.weather.gov';

const nacHeaders = {
  'User-Agent': '(kaiconsulting.lovable.app, kaimyers@alaskapacific.edu)',
  'Accept': 'application/json',
};

const nwsHeaders = {
  'User-Agent': '(AvalancheComparison/1.0, kaimyers@alaskapacific.edu)',
  'Accept': 'application/geo+json',
};

// Zone ID → Center ID mapping
const ZONE_CENTER_MAP: Record<string, string> = {
  // BAC
  'bridgeport': 'BAC',
  // BTAC
  'salt-river-wyoming-ranges': 'BTAC',
  'snake-river-range': 'BTAC',
  'tetons': 'BTAC',
  'togwotee-pass': 'BTAC',
  // CAC
  'cordova': 'CAC',
  // CAIC
  'caic-northern-san-juan': 'CAIC',
  'caic-sangre-de-cristo': 'CAIC',
  'caic-southern-san-juan': 'CAIC',
  'caic-park-range': 'CAIC',
  'caic-front-range-north': 'CAIC',
  'caic-vail-summit-county': 'CAIC',
  'caic-front-range-boulder': 'CAIC',
  'caic-grand-mesa-west-elk': 'CAIC',
  'caic-elk-mountains': 'CAIC',
  'caic-sawatch-range': 'CAIC',
  'caic-front-range-south': 'CAIC',
  // CAAC
  'douglas-island': 'CAAC',
  'juneau-mainland': 'CAAC',
  // CNFAIC
  'turnagain-girdwood': 'CNFAIC',
  'summit': 'CNFAIC',
  'seward': 'CNFAIC',
  'chugach-state-park': 'CNFAIC',
  // COAA
  'central-cascades': 'COAA',
  'newberry': 'COAA',
  // EARAC
  'earac-north': 'EARAC',
  'earac-south': 'EARAC',
  // ESAC
  'eastside-region': 'ESAC',
  // EWYAIX
  'big-horns': 'EWYAIX',
  'sierra-madre': 'EWYAIX',
  'snowy-range': 'EWYAIX',
  // FAC
  'flathead-range-glacier-np': 'FAC',
  'swan-range': 'FAC',
  'whitefish-range': 'FAC',
  // GNFAC
  'bridger-range': 'GNFAC',
  'cooke-city': 'GNFAC',
  'island-park': 'GNFAC',
  'lionhead-area': 'GNFAC',
  'northern-gallatin-range': 'GNFAC',
  'northern-madison-range': 'GNFAC',
  'southern-gallatin-range': 'GNFAC',
  'southern-madison-range': 'GNFAC',
  // HAC
  'haines-lutak': 'HAC',
  'haines-transitional': 'HAC',
  'haines-chilkat-pass': 'HAC',
  // HPAC
  'hatcher-pass': 'HPAC',
  // IPAC
  'east-cabinet-mountains': 'IPAC',
  'purcell-mountains': 'IPAC',
  'selkirk-mountains': 'IPAC',
  'silver-valley-bitterroot-mountains': 'IPAC',
  'west-cabinet-mountains': 'IPAC',
  // KPAC
  'san-francisco-peaks': 'KPAC',
  // MSAC
  'mount-shasta': 'MSAC',
  // MWAC
  'presidential-range': 'MWAC',
  // NWAC
  'east-slopes-central': 'NWAC',
  'east-slopes-north': 'NWAC',
  'east-slopes-south': 'NWAC',
  'mt-hood': 'NWAC',
  'olympics': 'NWAC',
  'snoqualmie-pass': 'NWAC',
  'stevens-pass': 'NWAC',
  'west-slopes-central': 'NWAC',
  'west-slopes-north': 'NWAC',
  'west-slopes-south': 'NWAC',
  // PAC
  'salmon-river-mountains': 'PAC',
  'west-mountains': 'PAC',
  // SAC
  'central-sierra-nevada': 'SAC',
  // SNFAC
  'banner-summit': 'SNFAC',
  'galena-summit-eastern-mtns': 'SNFAC',
  'sawtooth-western-smoky-mtns': 'SNFAC',
  'soldier-wood-river-valley-mtns': 'SNFAC',
  // SOAIX
  'southern-oregon': 'SOAIX',
  // TAC
  'northern-new-mexico': 'TAC',
  // UAC
  'abajos': 'UAC',
  'logan': 'UAC',
  'moab': 'UAC',
  'ogden': 'UAC',
  'provo': 'UAC',
  'salt-lake': 'UAC',
  'skyline': 'UAC',
  'southwest': 'UAC',
  'uintas': 'UAC',
  // VAC
  'valdez-maritime': 'VAC',
  'valdez-intermountain': 'VAC',
  'valdez-continental': 'VAC',
  // WAC
  'blues': 'WAC',
  'elkhorns': 'WAC',
  'northern-wallowas': 'WAC',
  'southern-wallowas': 'WAC',
  // WCMAC
  'bitterroot': 'WCMAC',
  'rattlesnake': 'WCMAC',
  'seeley-lake': 'WCMAC',
};

// Strip HTML but preserve paragraph structure
function stripHtmlPreserveBreaks(html: string | null | undefined): string | null {
  if (!html) return null;
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/th>/gi, ' | ')
    .replace(/<\/td>/gi, ' | ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&deg;/g, '°')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .split('\n').map(line => line.trim()).join('\n')
    .trim() || null;
}

// Fetch NAC weather product for a center
async function fetchNacWeather(centerId: string): Promise<{
  discussion: string | null;
  tables: any[];
  publishedTime: string | null;
} | null> {
  try {
    const url = `${NAC_API_BASE}/product?type=weather&center_id=${centerId}`;
    console.log(`Fetching NAC weather for ${centerId}`);
    const response = await fetch(url, { headers: nacHeaders });

    if (!response.ok) {
      console.log(`NAC weather returned ${response.status} for ${centerId}`);
      return null;
    }

    const data = await response.json();

    // Some centers return a valid response but with all null fields
    if (!data.weather_discussion && (!data.weather_data || data.weather_data.length === 0)) {
      console.log(`No weather data in response for ${centerId}`);
      return null;
    }

    return {
      discussion: stripHtmlPreserveBreaks(data.weather_discussion),
      tables: Array.isArray(data.weather_data) ? data.weather_data : [],
      publishedTime: data.published_time || null,
    };
  } catch (error) {
    console.error(`Error fetching NAC weather for ${centerId}:`, error);
    return null;
  }
}

// Fetch NOAA NWS text forecast for a geographic point
async function fetchNwsForecast(lat: number, lon: number): Promise<{
  periods: Array<{
    name: string;
    temperature: number;
    temperatureUnit: string;
    windSpeed: string;
    windDirection: string;
    shortForecast: string;
    detailedForecast: string;
    isDaytime: boolean;
  }>;
  gridpoint: string;
  forecastZone: string | null;
  forecastPageUrl: string;
} | null> {
  try {
    // Step 1: Look up NWS grid coordinates for this point
    const pointsUrl = `${NWS_API_BASE}/points/${lat.toFixed(4)},${lon.toFixed(4)}`;
    console.log(`Fetching NWS points: ${pointsUrl}`);
    const pointsResp = await fetch(pointsUrl, { headers: nwsHeaders });

    if (!pointsResp.ok) {
      console.log(`NWS /points returned ${pointsResp.status} for ${lat},${lon}`);
      return null;
    }

    const pointsData = await pointsResp.json();
    const props = pointsData.properties;
    const wfo = props.gridId;
    const gridX = props.gridX;
    const gridY = props.gridY;
    const forecastZoneUrl = props.forecastZone || null;
    const gridpoint = `${wfo}/${gridX},${gridY}`;

    // Step 2: Get human-readable forecast periods
    const forecastUrl = `${NWS_API_BASE}/gridpoints/${wfo}/${gridX},${gridY}/forecast?units=us`;
    console.log(`Fetching NWS forecast: ${forecastUrl}`);
    const forecastResp = await fetch(forecastUrl, { headers: nwsHeaders });

    if (!forecastResp.ok) {
      console.log(`NWS /forecast returned ${forecastResp.status} for ${gridpoint}`);
      return null;
    }

    const forecastData = await forecastResp.json();

    // Extract up to 8 periods (4 days of day/night)
    const periods = (forecastData.properties?.periods || []).slice(0, 8).map((p: any) => ({
      name: p.name,
      temperature: p.temperature,
      temperatureUnit: p.temperatureUnit,
      windSpeed: p.windSpeed,
      windDirection: p.windDirection,
      shortForecast: p.shortForecast,
      detailedForecast: p.detailedForecast,
      isDaytime: p.isDaytime,
    }));

    // Build human-readable forecast page URL
    const forecastPageUrl = `https://forecast.weather.gov/MapClick.php?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;

    return {
      periods,
      gridpoint,
      forecastZone: forecastZoneUrl ? forecastZoneUrl.split('/').pop() || null : null,
      forecastPageUrl,
    };
  } catch (error) {
    console.error(`Error fetching NWS forecast for ${lat},${lon}:`, error);
    return null;
  }
}

// Get a representative lat/lon for a center by checking its zones' weather stations
function getRepresentativePoint(zoneIds: string[]): { lat: number; lon: number } | null {
  for (const zoneId of zoneIds) {
    const stations = getStationsForZone(zoneId);
    if (stations.length > 0) {
      return { lat: stations[0].latitude, lon: stations[0].longitude };
    }
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const zoneIds: string[] = body?.zoneIds || [];

    if (zoneIds.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No zone IDs provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching weather forecasts for ${zoneIds.length} zones`);

    // Group zones by center
    const centerZones = new Map<string, string[]>();
    for (const zoneId of zoneIds) {
      const centerId = ZONE_CENTER_MAP[zoneId];
      if (centerId) {
        if (!centerZones.has(centerId)) centerZones.set(centerId, []);
        centerZones.get(centerId)!.push(zoneId);
      } else {
        console.log(`Unknown zone: ${zoneId}`);
      }
    }

    const centerIds = Array.from(centerZones.keys());
    console.log(`Unique centers: ${centerIds.join(', ')}`);

    // Phase 1: Fetch NAC weather products for all centers in parallel
    const nacResults = await Promise.all(
      centerIds.map(async (centerId) => {
        const data = await fetchNacWeather(centerId);
        return { centerId, data };
      })
    );

    // Build centerWeather response and identify centers without NAC data
    const centerWeather: Record<string, any> = {};
    const centersWithNacWeather = new Set<string>();

    for (const { centerId, data } of nacResults) {
      if (data) {
        centerWeather[centerId] = data;
        centersWithNacWeather.add(centerId);
      }
    }

    console.log(`NAC weather available for: ${Array.from(centersWithNacWeather).join(', ') || 'none'}`);

    // Phase 2: Fetch NOAA NWS forecasts for centers WITHOUT NAC weather
    const zoneNwsForecasts: Record<string, any> = {};
    const centersNeedingNoaa = centerIds.filter(id => !centersWithNacWeather.has(id));

    if (centersNeedingNoaa.length > 0) {
      console.log(`Fetching NOAA for centers without NAC weather: ${centersNeedingNoaa.join(', ')}`);

      const noaaPromises = centersNeedingNoaa.map(async (centerId) => {
        const zoneIdsForCenter = centerZones.get(centerId) || [];
        const point = getRepresentativePoint(zoneIdsForCenter);

        if (!point) {
          console.log(`No stations found for center ${centerId}, skipping NOAA`);
          return;
        }

        const nwsData = await fetchNwsForecast(point.lat, point.lon);
        if (nwsData) {
          // Apply the same NOAA forecast to all zones in this center
          for (const zoneId of zoneIdsForCenter) {
            zoneNwsForecasts[zoneId] = nwsData;
          }
          console.log(`NOAA forecast retrieved for ${centerId} (${nwsData.periods.length} periods)`);
        }
      });

      await Promise.all(noaaPromises);
    }

    console.log(`Weather fetch complete. NAC: ${centersWithNacWeather.size} centers, NOAA: ${Object.keys(zoneNwsForecasts).length} zones`);

    return new Response(
      JSON.stringify({
        success: true,
        centerWeather,
        zoneNwsForecasts,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-weather-forecast:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
