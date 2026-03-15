import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { fetchMultipleStations, type StationObservation } from '../_shared/synoptic-api.ts';
import { getStationsForZone } from '../_shared/weather-station-config.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supabase client for cache operations
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// NAC API configuration
const NAC_API_BASE = 'https://api.avalanche.org/v2/public';

// Common headers for NAC API requests (User-Agent required to avoid 500s)
const nacHeaders = {
  'User-Agent': '(kaiconsulting.lovable.app, kaimyers@alaskapacific.edu)',
  'Accept': 'application/json',
};

// Zone configuration with NAC IDs, fallback URLs, and official forecast URLs
const ZONE_CONFIG = [
  // ── BAC - Bridgeport Avalanche Center ──
  {
    id: 'bridgeport',
    nacZoneId: '3004',
    centerId: 'BAC',
    name: 'Bridgeport Avalanche Center',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://bridgeportavalanchecenter.org/avalanche-forecast/',
    forecastUrl: 'https://bridgeportavalanchecenter.org/avalanche-forecast/',
  },
  // ── BTAC - Bridger-Teton Avalanche Center ──
  {
    id: 'salt-river-wyoming-ranges',
    nacZoneId: '2856',
    centerId: 'BTAC',
    name: 'Salt River and Wyoming Ranges',
    timezone: 'America/Denver',
    fallbackUrl: 'https://bridgertetonavalanchecenter.org/forecasts/#/salt-river-and-wyoming-ranges/',
    forecastUrl: 'https://bridgertetonavalanchecenter.org/forecasts/#/salt-river-and-wyoming-ranges/',
  },
  {
    id: 'snake-river-range',
    nacZoneId: '2860',
    centerId: 'BTAC',
    name: 'Snake River Range',
    timezone: 'America/Denver',
    fallbackUrl: 'https://bridgertetonavalanchecenter.org/forecasts/#/snake-river-range',
    forecastUrl: 'https://bridgertetonavalanchecenter.org/forecasts/#/snake-river-range',
  },
  {
    id: 'tetons',
    nacZoneId: '2855',
    centerId: 'BTAC',
    name: 'Tetons',
    timezone: 'America/Denver',
    fallbackUrl: 'https://bridgertetonavalanchecenter.org/forecasts/#/tetons',
    forecastUrl: 'https://bridgertetonavalanchecenter.org/forecasts/#/tetons',
  },
  {
    id: 'togwotee-pass',
    nacZoneId: '2852',
    centerId: 'BTAC',
    name: 'Togwotee Pass',
    timezone: 'America/Denver',
    fallbackUrl: 'https://bridgertetonavalanchecenter.org/forecasts/#/togwotee-pass',
    forecastUrl: 'https://bridgertetonavalanchecenter.org/forecasts/#/togwotee-pass',
  },
  // ── CAC - Cordova Avalanche Center ──
  {
    id: 'cordova',
    nacZoneId: '1421',
    centerId: 'CAC',
    name: 'Cordova',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://alaskasnow.org/cordova/',
    forecastUrl: 'https://alaskasnow.org/cordova/',
  },
  // ── CAIC - Colorado Avalanche Information Center ──
  {
    id: 'caic-northern-san-juan',
    nacZoneId: '2647',
    centerId: 'CAIC',
    name: 'Northern San Juan Mountains',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  {
    id: 'caic-sangre-de-cristo',
    nacZoneId: '2651',
    centerId: 'CAIC',
    name: 'Sangre de Cristo Mountains',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  {
    id: 'caic-southern-san-juan',
    nacZoneId: '2660',
    centerId: 'CAIC',
    name: 'Southern San Juan Mountains',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  {
    id: 'caic-park-range',
    nacZoneId: '2690',
    centerId: 'CAIC',
    name: 'Park Range (Steamboat)',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  {
    id: 'caic-front-range-north',
    nacZoneId: '2712',
    centerId: 'CAIC',
    name: 'Front Range & Never Summer Mountains',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  {
    id: 'caic-vail-summit-county',
    nacZoneId: '2730',
    centerId: 'CAIC',
    name: 'Vail & Summit County',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  {
    id: 'caic-front-range-boulder',
    nacZoneId: '2745',
    centerId: 'CAIC',
    name: 'Front Range (Boulder)',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  {
    id: 'caic-grand-mesa-west-elk',
    nacZoneId: '2747',
    centerId: 'CAIC',
    name: 'Grand Mesa & Flat Tops',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  {
    id: 'caic-elk-mountains',
    nacZoneId: '2751',
    centerId: 'CAIC',
    name: 'Elk Mountains (Aspen)',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  {
    id: 'caic-sawatch-range',
    nacZoneId: '2754',
    centerId: 'CAIC',
    name: 'Sawatch Range',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  {
    id: 'caic-front-range-south',
    nacZoneId: '2755',
    centerId: 'CAIC',
    name: 'Front Range South & Pikes Peak',
    timezone: 'America/Denver',
    fallbackUrl: 'https://avalanche.state.co.us/',
    forecastUrl: 'https://avalanche.state.co.us/',
  },
  // ── CAAC - Coastal Alaska Avalanche Center ──
  {
    id: 'douglas-island',
    nacZoneId: '2165',
    centerId: 'CAAC',
    name: 'Douglas Island',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://www.coastalakavalanche.org/forecast/#/douglas-island/',
    forecastUrl: 'https://www.coastalakavalanche.org/forecast/#/douglas-island/',
  },
  {
    id: 'juneau-mainland',
    nacZoneId: '2164',
    centerId: 'CAAC',
    name: 'Juneau Mainland',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://www.coastalakavalanche.org/forecast/#/juneau-mainland/',
    forecastUrl: 'https://www.coastalakavalanche.org/forecast/#/juneau-mainland/',
  },
  // ── CNFAIC - Chugach National Forest Avalanche Information Center ──
  {
    id: 'turnagain-girdwood',
    nacZoneId: '2815',
    centerId: 'CNFAIC',
    name: 'Turnagain Pass / Girdwood',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://cnfaic.org/forecast/turnagain/',
    forecastUrl: 'https://cnfaic.org/forecast/turnagain/',
  },
  {
    id: 'summit',
    nacZoneId: '2816',
    centerId: 'CNFAIC',
    name: 'Summit Lake',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://cnfaic.org/forecast/summit/',
    forecastUrl: 'https://cnfaic.org/forecast/summit/',
  },
  {
    id: 'seward',
    nacZoneId: '2817',
    centerId: 'CNFAIC',
    name: 'Seward / Lost Lake',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://cnfaic.org/forecast/seward/',
    forecastUrl: 'https://cnfaic.org/forecast/seward/',
  },
  {
    id: 'chugach-state-park',
    nacZoneId: '2818',
    centerId: 'CNFAIC',
    name: 'Chugach State Park',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://cnfaic.org/forecast/chugach-state-park/',
    forecastUrl: 'https://cnfaic.org/forecast/chugach-state-park/',
  },
  // ── COAA - Central Oregon Avalanche Center ──
  {
    id: 'central-cascades',
    nacZoneId: '2470',
    centerId: 'COAA',
    name: 'Central Cascades',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://coavalanche.org/pages/forecasts/#/central-cascades',
    forecastUrl: 'https://coavalanche.org/pages/forecasts/#/central-cascades',
  },
  {
    id: 'newberry',
    nacZoneId: '2471',
    centerId: 'COAA',
    name: 'Newberry',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://coavalanche.org/pages/forecasts/#/newberry',
    forecastUrl: 'https://coavalanche.org/pages/forecasts/#/newberry',
  },
  // ── EARAC - Eastern Alaska Range Avalanche Center ──
  {
    id: 'earac-north',
    nacZoneId: '3002',
    centerId: 'EARAC',
    name: 'Eastern Alaska Range - North (Castner-Canwell)',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://alaskasnow.org/eastern-ak-range/',
    forecastUrl: 'https://alaskasnow.org/eastern-ak-range/',
  },
  {
    id: 'earac-south',
    nacZoneId: '3003',
    centerId: 'EARAC',
    name: 'Eastern Alaska Range - South (Summit)',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://alaskasnow.org/eastern-ak-range/',
    forecastUrl: 'https://alaskasnow.org/eastern-ak-range/',
  },
  // ── ESAC - Eastern Sierra Avalanche Center ──
  {
    id: 'eastside-region',
    nacZoneId: '128',
    centerId: 'ESAC',
    name: 'Eastside Region',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.esavalanche.org/forecasts#/eastside-region',
    forecastUrl: 'https://www.esavalanche.org/forecasts#/eastside-region',
  },
  // ── EWYAIX - Eastern Wyoming Avalanche Info Exchange ──
  {
    id: 'big-horns',
    nacZoneId: '2841',
    centerId: 'EWYAIX',
    name: 'Big Horns',
    timezone: 'America/Denver',
    fallbackUrl: 'https://ewyoavalanche.org',
    forecastUrl: 'https://ewyoavalanche.org',
  },
  {
    id: 'sierra-madre',
    nacZoneId: '2843',
    centerId: 'EWYAIX',
    name: 'Sierra Madre',
    timezone: 'America/Denver',
    fallbackUrl: 'https://ewyoavalanche.org',
    forecastUrl: 'https://ewyoavalanche.org',
  },
  {
    id: 'snowy-range',
    nacZoneId: '2842',
    centerId: 'EWYAIX',
    name: 'Snowy Range',
    timezone: 'America/Denver',
    fallbackUrl: 'https://ewyoavalanche.org',
    forecastUrl: 'https://ewyoavalanche.org',
  },
  // ── FAC - Flathead Avalanche Center ──
  {
    id: 'flathead-range-glacier-np',
    nacZoneId: '1735',
    centerId: 'FAC',
    name: 'Flathead Range & Glacier NP',
    timezone: 'America/Denver',
    fallbackUrl: 'https://flatheadavalanche.com/avalanche-forecast#/flathead-range-&-glacier-np',
    forecastUrl: 'https://flatheadavalanche.com/avalanche-forecast#/flathead-range-&-glacier-np',
  },
  {
    id: 'swan-range',
    nacZoneId: '1734',
    centerId: 'FAC',
    name: 'Swan Range',
    timezone: 'America/Denver',
    fallbackUrl: 'https://flatheadavalanche.com/avalanche-forecast#/swan-range',
    forecastUrl: 'https://flatheadavalanche.com/avalanche-forecast#/swan-range',
  },
  {
    id: 'whitefish-range',
    nacZoneId: '1733',
    centerId: 'FAC',
    name: 'Whitefish Range',
    timezone: 'America/Denver',
    fallbackUrl: 'https://flatheadavalanche.com/avalanche-forecast#/whitefish-range',
    forecastUrl: 'https://flatheadavalanche.com/avalanche-forecast#/whitefish-range',
  },
  // ── GNFAC - Gallatin NF Avalanche Center ──
  {
    id: 'bridger-range',
    nacZoneId: '2819',
    centerId: 'GNFAC',
    name: 'Bridger Range',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.mtavalanche.com/avalanche-forecast#/bridger-range/',
    forecastUrl: 'https://www.mtavalanche.com/avalanche-forecast#/bridger-range/',
  },
  {
    id: 'cooke-city',
    nacZoneId: '2827',
    centerId: 'GNFAC',
    name: 'Cooke City',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.mtavalanche.com/avalanche-forecast#/cooke-city/',
    forecastUrl: 'https://www.mtavalanche.com/avalanche-forecast#/cooke-city/',
  },
  {
    id: 'island-park',
    nacZoneId: '2826',
    centerId: 'GNFAC',
    name: 'Island Park',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.mtavalanche.com/avalanche-forecast#/island-park/',
    forecastUrl: 'https://www.mtavalanche.com/avalanche-forecast#/island-park/',
  },
  {
    id: 'lionhead-area',
    nacZoneId: '2825',
    centerId: 'GNFAC',
    name: 'Lionhead Area',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.mtavalanche.com/avalanche-forecast#/lionhead-area/',
    forecastUrl: 'https://www.mtavalanche.com/avalanche-forecast#/lionhead-area/',
  },
  {
    id: 'northern-gallatin-range',
    nacZoneId: '2821',
    centerId: 'GNFAC',
    name: 'Northern Gallatin Range',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.mtavalanche.com/avalanche-forecast#/northern-gallatin-range/',
    forecastUrl: 'https://www.mtavalanche.com/avalanche-forecast#/northern-gallatin-range/',
  },
  {
    id: 'northern-madison-range',
    nacZoneId: '2822',
    centerId: 'GNFAC',
    name: 'Northern Madison Range',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.mtavalanche.com/avalanche-forecast#/northern-madison-range/',
    forecastUrl: 'https://www.mtavalanche.com/avalanche-forecast#/northern-madison-range/',
  },
  {
    id: 'southern-gallatin-range',
    nacZoneId: '2824',
    centerId: 'GNFAC',
    name: 'Southern Gallatin Range',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.mtavalanche.com/avalanche-forecast#/southern-gallatin-range/',
    forecastUrl: 'https://www.mtavalanche.com/avalanche-forecast#/southern-gallatin-range/',
  },
  {
    id: 'southern-madison-range',
    nacZoneId: '2823',
    centerId: 'GNFAC',
    name: 'Southern Madison Range',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.mtavalanche.com/avalanche-forecast#/southern-madison-range/',
    forecastUrl: 'https://www.mtavalanche.com/avalanche-forecast#/southern-madison-range/',
  },
  // ── HAC - Haines Avalanche Center ──
  {
    id: 'haines-lutak',
    nacZoneId: '3005',
    centerId: 'HAC',
    name: 'Haines - Lutak',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://alaskasnow.org/haines-forecast/#/lutak/',
    forecastUrl: 'https://alaskasnow.org/haines-forecast/#/lutak/',
  },
  {
    id: 'haines-transitional',
    nacZoneId: '3006',
    centerId: 'HAC',
    name: 'Haines - Transitional',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://alaskasnow.org/haines-forecast/#/transitional/',
    forecastUrl: 'https://alaskasnow.org/haines-forecast/#/transitional/',
  },
  {
    id: 'haines-chilkat-pass',
    nacZoneId: '3007',
    centerId: 'HAC',
    name: 'Haines - Chilkat Pass',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://alaskasnow.org/haines-forecast/#/chilkat-pass/',
    forecastUrl: 'https://alaskasnow.org/haines-forecast/#/chilkat-pass/',
  },
  // ── HPAC - Hatcher Pass Avalanche Center ──
  {
    id: 'hatcher-pass',
    nacZoneId: '2152',
    centerId: 'HPAC',
    name: 'Hatcher Pass',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://hpavalanche.org/forecast/',
    forecastUrl: 'https://hpavalanche.org/forecast/',
  },
  // ── IPAC - Idaho Panhandle Avalanche Center ──
  {
    id: 'east-cabinet-mountains',
    nacZoneId: '1901',
    centerId: 'IPAC',
    name: 'East Cabinet Mountains',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.idahopanhandleavalanche.org/forecasts/#/east-cabinet-mountains/',
    forecastUrl: 'https://www.idahopanhandleavalanche.org/forecasts/#/east-cabinet-mountains/',
  },
  {
    id: 'purcell-mountains',
    nacZoneId: '1903',
    centerId: 'IPAC',
    name: 'Purcell Mountains',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.idahopanhandleavalanche.org/forecasts/#/purcell-mountains/',
    forecastUrl: 'https://www.idahopanhandleavalanche.org/forecasts/#/purcell-mountains/',
  },
  {
    id: 'selkirk-mountains',
    nacZoneId: '1899',
    centerId: 'IPAC',
    name: 'Selkirk Mountains',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.idahopanhandleavalanche.org/forecasts/#/selkirk-mountains/',
    forecastUrl: 'https://www.idahopanhandleavalanche.org/forecasts/#/selkirk-mountains/',
  },
  {
    id: 'silver-valley-bitterroot-mountains',
    nacZoneId: '1902',
    centerId: 'IPAC',
    name: 'Silver Valley & Bitterroot Mountains',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.idahopanhandleavalanche.org/forecasts/#/silver-valley-&-bitterroot-mountains/',
    forecastUrl: 'https://www.idahopanhandleavalanche.org/forecasts/#/silver-valley-&-bitterroot-mountains/',
  },
  {
    id: 'west-cabinet-mountains',
    nacZoneId: '1900',
    centerId: 'IPAC',
    name: 'West Cabinet Mountains',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.idahopanhandleavalanche.org/forecasts/#/west-cabinet-mountains/',
    forecastUrl: 'https://www.idahopanhandleavalanche.org/forecasts/#/west-cabinet-mountains/',
  },
  // ── KPAC - Kachina Peaks Avalanche Center ──
  {
    id: 'san-francisco-peaks',
    nacZoneId: '2990',
    centerId: 'KPAC',
    name: 'San Francisco Peaks',
    timezone: 'America/Phoenix',
    fallbackUrl: 'https://kachinapeaks.org/Forecast/#/san-francisco-peaks-%2F-kachina-peaks-wilderness',
    forecastUrl: 'https://kachinapeaks.org/Forecast/#/san-francisco-peaks-%2F-kachina-peaks-wilderness',
  },
  // ── MSAC - Mount Shasta Avalanche Center ──
  {
    id: 'mount-shasta',
    nacZoneId: '1833',
    centerId: 'MSAC',
    name: 'Mount Shasta',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.shastaavalanche.org/advisories/avalanche-advisory/#/mount-shasta',
    forecastUrl: 'https://www.shastaavalanche.org/advisories/avalanche-advisory/#/mount-shasta',
  },
  // ── MWAC - Mount Washington Avalanche Center ──
  {
    id: 'presidential-range',
    nacZoneId: '2355',
    centerId: 'MWAC',
    name: 'Presidential Range',
    timezone: 'America/New_York',
    fallbackUrl: 'http://www.mountwashingtonavalanchecenter.org/',
    forecastUrl: 'http://www.mountwashingtonavalanchecenter.org/',
  },
  // ── NWAC - Northwest Avalanche Center ──
  {
    id: 'east-slopes-central',
    nacZoneId: '1655',
    centerId: 'NWAC',
    name: 'East Slopes Central',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'http://www.nwac.us/avalanche-forecast/#/east-slopes-central',
    forecastUrl: 'http://www.nwac.us/avalanche-forecast/#/east-slopes-central',
  },
  {
    id: 'east-slopes-north',
    nacZoneId: '1654',
    centerId: 'NWAC',
    name: 'East Slopes North',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'http://www.nwac.us/avalanche-forecast/#/east-slopes-north',
    forecastUrl: 'http://www.nwac.us/avalanche-forecast/#/east-slopes-north',
  },
  {
    id: 'east-slopes-south',
    nacZoneId: '1656',
    centerId: 'NWAC',
    name: 'East Slopes South',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'http://www.nwac.us/avalanche-forecast/#/east-slopes-south',
    forecastUrl: 'http://www.nwac.us/avalanche-forecast/#/east-slopes-south',
  },
  {
    id: 'mt-hood',
    nacZoneId: '1657',
    centerId: 'NWAC',
    name: 'Mt Hood',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'http://www.nwac.us/avalanche-forecast/#/mt-hood',
    forecastUrl: 'http://www.nwac.us/avalanche-forecast/#/mt-hood',
  },
  {
    id: 'olympics',
    nacZoneId: '1645',
    centerId: 'NWAC',
    name: 'Olympics',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'http://www.nwac.us/avalanche-forecast/#/olympics',
    forecastUrl: 'http://www.nwac.us/avalanche-forecast/#/olympics',
  },
  {
    id: 'snoqualmie-pass',
    nacZoneId: '1653',
    centerId: 'NWAC',
    name: 'Snoqualmie Pass',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'http://www.nwac.us/avalanche-forecast/#/snoqualmie-pass',
    forecastUrl: 'http://www.nwac.us/avalanche-forecast/#/snoqualmie-pass',
  },
  {
    id: 'stevens-pass',
    nacZoneId: '1649',
    centerId: 'NWAC',
    name: 'Stevens Pass',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'http://www.nwac.us/avalanche-forecast/#/stevens-pass',
    forecastUrl: 'http://www.nwac.us/avalanche-forecast/#/stevens-pass',
  },
  {
    id: 'west-slopes-central',
    nacZoneId: '1647',
    centerId: 'NWAC',
    name: 'West Slopes Central',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'http://www.nwac.us/avalanche-forecast/#/west-slopes-central',
    forecastUrl: 'http://www.nwac.us/avalanche-forecast/#/west-slopes-central',
  },
  {
    id: 'west-slopes-north',
    nacZoneId: '1646',
    centerId: 'NWAC',
    name: 'West Slopes North',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'http://www.nwac.us/avalanche-forecast/#/west-slopes-north',
    forecastUrl: 'http://www.nwac.us/avalanche-forecast/#/west-slopes-north',
  },
  {
    id: 'west-slopes-south',
    nacZoneId: '1648',
    centerId: 'NWAC',
    name: 'West Slopes South',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'http://www.nwac.us/avalanche-forecast/#/west-slopes-south',
    forecastUrl: 'http://www.nwac.us/avalanche-forecast/#/west-slopes-south',
  },
  // ── PAC - Payette Avalanche Center ──
  {
    id: 'salmon-river-mountains',
    nacZoneId: '2897',
    centerId: 'PAC',
    name: 'Salmon River Mountains',
    timezone: 'America/Denver',
    fallbackUrl: 'https://payetteavalanche.org/forecasts/#/salmon-river-mountains/',
    forecastUrl: 'https://payetteavalanche.org/forecasts/#/salmon-river-mountains/',
  },
  {
    id: 'west-mountains',
    nacZoneId: '2898',
    centerId: 'PAC',
    name: 'West Mountains',
    timezone: 'America/Denver',
    fallbackUrl: 'https://payetteavalanche.org/forecasts/#/west-mountains/',
    forecastUrl: 'https://payetteavalanche.org/forecasts/#/west-mountains/',
  },
  // ── SAC - Sierra Avalanche Center ──
  {
    id: 'central-sierra-nevada',
    nacZoneId: '2458',
    centerId: 'SAC',
    name: 'Central Sierra Nevada',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.sierraavalanchecenter.org/forecasts/avalanche/central-sierra-nevada#/central-sierra-nevada/',
    forecastUrl: 'https://www.sierraavalanchecenter.org/forecasts/avalanche/central-sierra-nevada#/central-sierra-nevada/',
  },
  // ── SNFAC - Sawtooth Avalanche Center ──
  {
    id: 'banner-summit',
    nacZoneId: '2907',
    centerId: 'SNFAC',
    name: 'Banner Summit',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.sawtoothavalanche.com/forecasts/avalanche/banner-summit',
    forecastUrl: 'https://www.sawtoothavalanche.com/forecasts/avalanche/banner-summit',
  },
  {
    id: 'galena-summit-eastern-mtns',
    nacZoneId: '2904',
    centerId: 'SNFAC',
    name: 'Galena Summit & Eastern Mtns',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.sawtoothavalanche.com/forecasts/avalanche/galena-summit-&-eastern-mtns',
    forecastUrl: 'https://www.sawtoothavalanche.com/forecasts/avalanche/galena-summit-&-eastern-mtns',
  },
  {
    id: 'sawtooth-western-smoky-mtns',
    nacZoneId: '2906',
    centerId: 'SNFAC',
    name: 'Sawtooth & Western Smoky Mtns',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.sawtoothavalanche.com/forecasts/avalanche/sawtooth-&-western-smoky-mtns',
    forecastUrl: 'https://www.sawtoothavalanche.com/forecasts/avalanche/sawtooth-&-western-smoky-mtns',
  },
  {
    id: 'soldier-wood-river-valley-mtns',
    nacZoneId: '2905',
    centerId: 'SNFAC',
    name: 'Soldier & Wood River Valley Mtns',
    timezone: 'America/Denver',
    fallbackUrl: 'https://www.sawtoothavalanche.com/forecasts/avalanche/soldier-&-wood-river-valley-mtns',
    forecastUrl: 'https://www.sawtoothavalanche.com/forecasts/avalanche/soldier-&-wood-river-valley-mtns',
  },
  // ── SOAIX - Southern Oregon Avalanche Info Exchange ──
  {
    id: 'southern-oregon',
    nacZoneId: '1369',
    centerId: 'SOAIX',
    name: 'Southern Oregon',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.oregonsnow.org/observations/#/view/observations',
    forecastUrl: 'https://www.oregonsnow.org/observations/#/view/observations',
  },
  // ── TAC - Taos Avalanche Center ──
  {
    id: 'northern-new-mexico',
    nacZoneId: '490',
    centerId: 'TAC',
    name: 'Northern New Mexico',
    timezone: 'America/Denver',
    fallbackUrl: 'https://taosavalanchecenter.org/forecasts/#/northern-new-mexico',
    forecastUrl: 'https://taosavalanchecenter.org/forecasts/#/northern-new-mexico',
  },
  // ── UAC - Utah Avalanche Center ──
  {
    id: 'abajos',
    nacZoneId: '1744',
    centerId: 'UAC',
    name: 'Abajos',
    timezone: 'America/Denver',
    fallbackUrl: 'https://utahavalanchecenter.org/forecast/abajos',
    forecastUrl: 'https://utahavalanchecenter.org/forecast/abajos',
  },
  {
    id: 'logan',
    nacZoneId: '1736',
    centerId: 'UAC',
    name: 'Logan',
    timezone: 'America/Denver',
    fallbackUrl: 'https://utahavalanchecenter.org/forecast/logan',
    forecastUrl: 'https://utahavalanchecenter.org/forecast/logan',
  },
  {
    id: 'moab',
    nacZoneId: '1742',
    centerId: 'UAC',
    name: 'Moab',
    timezone: 'America/Denver',
    fallbackUrl: 'https://utahavalanchecenter.org/forecast/moab',
    forecastUrl: 'https://utahavalanchecenter.org/forecast/moab',
  },
  {
    id: 'ogden',
    nacZoneId: '1737',
    centerId: 'UAC',
    name: 'Ogden',
    timezone: 'America/Denver',
    fallbackUrl: 'https://utahavalanchecenter.org/forecast/ogden',
    forecastUrl: 'https://utahavalanchecenter.org/forecast/ogden',
  },
  {
    id: 'provo',
    nacZoneId: '1739',
    centerId: 'UAC',
    name: 'Provo',
    timezone: 'America/Denver',
    fallbackUrl: 'https://utahavalanchecenter.org/forecast/provo',
    forecastUrl: 'https://utahavalanchecenter.org/forecast/provo',
  },
  {
    id: 'salt-lake',
    nacZoneId: '1738',
    centerId: 'UAC',
    name: 'Salt Lake',
    timezone: 'America/Denver',
    fallbackUrl: 'https://utahavalanchecenter.org/forecast/salt-lake',
    forecastUrl: 'https://utahavalanchecenter.org/forecast/salt-lake',
  },
  {
    id: 'skyline',
    nacZoneId: '1741',
    centerId: 'UAC',
    name: 'Skyline',
    timezone: 'America/Denver',
    fallbackUrl: 'https://utahavalanchecenter.org/forecast/skyline',
    forecastUrl: 'https://utahavalanchecenter.org/forecast/skyline',
  },
  {
    id: 'southwest',
    nacZoneId: '1743',
    centerId: 'UAC',
    name: 'Southwest',
    timezone: 'America/Denver',
    fallbackUrl: 'https://utahavalanchecenter.org/forecast/southwest',
    forecastUrl: 'https://utahavalanchecenter.org/forecast/southwest',
  },
  {
    id: 'uintas',
    nacZoneId: '1740',
    centerId: 'UAC',
    name: 'Uintas',
    timezone: 'America/Denver',
    fallbackUrl: 'https://utahavalanchecenter.org/forecast/uintas',
    forecastUrl: 'https://utahavalanchecenter.org/forecast/uintas',
  },
  // ── VAC - Valdez Avalanche Center ──
  {
    id: 'valdez-maritime',
    nacZoneId: '1609',
    centerId: 'VAC',
    name: 'Valdez - Maritime',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://alaskasnow.org/valdez/',
    forecastUrl: 'https://alaskasnow.org/valdez/',
  },
  {
    id: 'valdez-intermountain',
    nacZoneId: '1610',
    centerId: 'VAC',
    name: 'Valdez - Intermountain',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://alaskasnow.org/valdez/',
    forecastUrl: 'https://alaskasnow.org/valdez/',
  },
  {
    id: 'valdez-continental',
    nacZoneId: '1611',
    centerId: 'VAC',
    name: 'Valdez - Continental',
    timezone: 'America/Anchorage',
    fallbackUrl: 'https://alaskasnow.org/valdez/',
    forecastUrl: 'https://alaskasnow.org/valdez/',
  },
  // ── WAC - Wallowa Avalanche Center ──
  {
    id: 'blues',
    nacZoneId: '2985',
    centerId: 'WAC',
    name: 'Blues',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.wallowaavalanchecenter.org/forecasts/#/blues',
    forecastUrl: 'https://www.wallowaavalanchecenter.org/forecasts/#/blues',
  },
  {
    id: 'elkhorns',
    nacZoneId: '2984',
    centerId: 'WAC',
    name: 'Elkhorns',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.wallowaavalanchecenter.org/forecasts/#/elkhorns',
    forecastUrl: 'https://www.wallowaavalanchecenter.org/forecasts/#/elkhorns',
  },
  {
    id: 'northern-wallowas',
    nacZoneId: '2982',
    centerId: 'WAC',
    name: 'Northern Wallowas',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://wallowaavalanchecenter.org/forecasts/#/northern-wallowas',
    forecastUrl: 'https://wallowaavalanchecenter.org/forecasts/#/northern-wallowas',
  },
  {
    id: 'southern-wallowas',
    nacZoneId: '2983',
    centerId: 'WAC',
    name: 'Southern Wallowas',
    timezone: 'America/Los_Angeles',
    fallbackUrl: 'https://www.wallowaavalanchecenter.org/forecasts/#/southern-wallowas',
    forecastUrl: 'https://www.wallowaavalanchecenter.org/forecasts/#/southern-wallowas',
  },
  // ── WCMAC - West Central Montana Avalanche Center ──
  {
    id: 'bitterroot',
    nacZoneId: '1724',
    centerId: 'WCMAC',
    name: 'Bitterroot',
    timezone: 'America/Denver',
    fallbackUrl: 'https://missoulaavalanche.org/forecasts/#/Bitterroot',
    forecastUrl: 'https://missoulaavalanche.org/forecasts/#/Bitterroot',
  },
  {
    id: 'rattlesnake',
    nacZoneId: '1723',
    centerId: 'WCMAC',
    name: 'Rattlesnake',
    timezone: 'America/Denver',
    fallbackUrl: 'https://missoulaavalanche.org/forecasts/#/rattlesnake',
    forecastUrl: 'https://missoulaavalanche.org/forecasts/#/rattlesnake',
  },
  {
    id: 'seeley-lake',
    nacZoneId: '1722',
    centerId: 'WCMAC',
    name: 'Seeley Lake',
    timezone: 'America/Denver',
    fallbackUrl: 'http://www.missoulaavalanche.org/forecasts/#/seeley-lake',
    forecastUrl: 'http://www.missoulaavalanche.org/forecasts/#/seeley-lake',
  },
];

// Map NAC danger scale numbers to our rating strings
function mapDangerRating(level: number | null | undefined): string {
  const ratings: Record<number, string> = {
    0: 'NO_RATING',
    1: 'LOW',
    2: 'MODERATE',
    3: 'CONSIDERABLE',
    4: 'HIGH',
    5: 'EXTREME',
  };
  if (level === -1 || level === null || level === undefined) return 'NO_RATING';
  return ratings[level] || 'NO_RATING';
}

// Format date for display
function formatDate(isoDate: string | null, timezone: string = 'America/Anchorage'): string | null {
  if (!isoDate) return null;
  try {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    });
  } catch {
    return isoDate;
  }
}

// Calculate freshness status based on expiration
function calculateFreshness(startDate: string | null, endDate: string | null): {
  issueDate: string | null;
  expiresDate: string | null;
  ageHours: number | null;
  hoursUntilExpiry: number | null;
  status: 'current' | 'recent' | 'expiring' | 'expired' | 'unknown';
} {
  if (!startDate || !endDate) {
    return { issueDate: null, expiresDate: null, ageHours: null, hoursUntilExpiry: null, status: 'unknown' };
  }

  try {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate parsed dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error(`Invalid date parsing: startDate=${startDate}, endDate=${endDate}`);
      return { issueDate: null, expiresDate: null, ageHours: null, hoursUntilExpiry: null, status: 'unknown' };
    }

    const ageHours = Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60));
    const hoursUntilExpiry = Math.round((end.getTime() - now.getTime()) / (1000 * 60 * 60));

    // Debug logging to diagnose freshness calculation
    console.log(`Freshness calc: now=${now.toISOString()}, start=${start.toISOString()}, end=${end.toISOString()}`);
    console.log(`Freshness calc: ageHours=${ageHours}, hoursUntilExpiry=${hoursUntilExpiry}`);

    let status: 'current' | 'recent' | 'expiring' | 'expired' | 'unknown';
    if (hoursUntilExpiry < 0) {
      status = 'expired';
    } else if (hoursUntilExpiry <= 6) {
      status = 'expiring';
    } else if (ageHours < 24) {
      status = 'current';
    } else {
      status = 'recent';
    }

    console.log(`Freshness result: status=${status}`);

    return {
      issueDate: formatDate(startDate),
      expiresDate: formatDate(endDate),
      ageHours,
      hoursUntilExpiry,
      status,
    };
  } catch (error) {
    console.error(`Freshness calculation error:`, error);
    return { issueDate: null, expiresDate: null, ageHours: null, hoursUntilExpiry: null, status: 'unknown' };
  }
}

// Normalize zone name for fuzzy matching
function normalizeZoneName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+and\s+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .sort()
    .join(' ');
}

// Fetch individual zone forecast using /product endpoint
async function fetchZoneForecast(centerId: string, zoneId: string): Promise<any | null> {
  try {
    const url = `${NAC_API_BASE}/product?type=forecast&center_id=${centerId}&zone_id=${zoneId}`;
    console.log(`Fetching forecast: ${url}`);
    const response = await fetch(url, { headers: nacHeaders });
    
    if (!response.ok) {
      console.log(`Product endpoint returned ${response.status} for zone ${zoneId}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`Got forecast for zone ${zoneId}: published=${data.published_time}, expires=${data.expires_time}`);
    return data;
  } catch (error) {
    console.error(`Error fetching forecast for zone ${zoneId}:`, error);
    return null;
  }
}

// Scrape zone forecast using Firecrawl as fallback
async function scrapeZoneForecast(fallbackUrl: string, zoneName: string): Promise<{
  markdown: string | null;
  success: boolean;
}> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Supabase env vars not available for Firecrawl fallback');
      return { markdown: null, success: false };
    }
    
    console.log(`Scraping fallback URL for ${zoneName}: ${fallbackUrl}`);
    
    const response = await fetch(`${supabaseUrl}/functions/v1/firecrawl-scrape`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: fallbackUrl,
        options: {
          formats: ['markdown'],
          onlyMainContent: true,
        },
      }),
    });
    
    if (!response.ok) {
      console.log(`Firecrawl scrape failed for ${zoneName}: ${response.status}`);
      return { markdown: null, success: false };
    }
    
    const data = await response.json();
    if (data.success && data.data?.markdown) {
      console.log(`Firecrawl scrape successful for ${zoneName}, got ${data.data.markdown.length} chars`);
      return { markdown: data.data.markdown, success: true };
    }
    
    return { markdown: null, success: false };
  } catch (error) {
    console.error(`Error scraping ${zoneName}:`, error);
    return { markdown: null, success: false };
  }
}

// Fetch map-layer for overall danger levels and timestamps
// Only processes data for the specified centers to optimize for scale
async function fetchMapLayerData(selectedCenterIds: string[]): Promise<Map<string, {
  danger_level: number;
  start_date: string | null;
  end_date: string | null;
  name: string;
}>> {
  const zoneMap = new Map();
  try {
    console.log('Fetching NAC map-layer...');
    const response = await fetch(`${NAC_API_BASE}/products/map-layer`, {
      headers: nacHeaders,
    });

    if (!response.ok) {
      console.error('Map-layer fetch failed:', response.status);
      return zoneMap;
    }

    const data = await response.json();
    const features = data.features || [];

    // Create a Set for faster lookup
    const centerIdSet = new Set(selectedCenterIds);

    for (const feature of features) {
      const props = feature.properties || {};
      // Only process zones from selected centers
      if (props.center_id && centerIdSet.has(props.center_id)) {
        const id = String(feature.id);
        zoneMap.set(id, {
          danger_level: props.danger_level ?? -1,
          start_date: props.start_date || null,
          end_date: props.end_date || null,
          name: props.name || 'Unknown Zone',
        });
        console.log(`Map-layer: ${props.name} (ID: ${id}, center: ${props.center_id}), danger: ${props.danger_level}`);
      }
    }
    console.log(`Found ${zoneMap.size} zones from ${selectedCenterIds.length} selected centers in map-layer`);
  } catch (error) {
    console.error('Error fetching map-layer:', error);
  }
  return zoneMap;
}

// ── UAC (Utah Avalanche Center) custom API integration ──
// UAC doesn't populate the NAC API — they have their own JSON endpoint
const UAC_API_BASE = 'https://utahavalanchecenter.org/forecast';

// Parse UAC danger rose: 24 values = 3 elevation bands × 8 aspects
// Values are danger_level × 2 (0=none, 2=low, 4=moderate, 6=considerable, 8=high, 10=extreme)
function parseUacDangerRose(roseStr: string): { alpine: string; treeline: string; belowTreeline: string } {
  if (!roseStr) return { alpine: 'NO_RATING', treeline: 'NO_RATING', belowTreeline: 'NO_RATING' };
  const values = roseStr.split(',').map(v => Number(v.trim()));
  // 24 values: first 8 = upper (alpine), next 8 = middle (treeline), last 8 = lower (below treeline)
  const maxInRange = (start: number, end: number) => {
    let max = 0;
    for (let i = start; i < end && i < values.length; i++) {
      if (values[i] > max) max = values[i];
    }
    return max;
  };
  const roseToRating = (val: number): string => {
    const level = Math.round(val / 2);
    return mapDangerRating(level);
  };
  return {
    alpine: roseToRating(maxInRange(0, 8)),
    treeline: roseToRating(maxInRange(8, 16)),
    belowTreeline: roseToRating(maxInRange(16, 24)),
  };
}

// Parse UAC per-problem aspect rose: 14 = present, 16 = absent
function parseUacProblemRose(roseStr: string): Array<{ elevation: string; aspects: string[] }> {
  if (!roseStr) return [];
  const values = roseStr.split(',').map(v => Number(v.trim()));
  const aspectNames = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const elevBands = [
    { name: 'Alpine', start: 0 },
    { name: 'Treeline', start: 8 },
    { name: 'Below Treeline', start: 16 },
  ];
  const result: Array<{ elevation: string; aspects: string[] }> = [];
  for (const band of elevBands) {
    const aspects: string[] = [];
    for (let i = 0; i < 8 && (band.start + i) < values.length; i++) {
      if (values[band.start + i] === 14) {
        aspects.push(aspectNames[i]);
      }
    }
    if (aspects.length > 0) {
      result.push({ elevation: band.name, aspects });
    }
  }
  return result;
}

// Fetch and parse a UAC forecast into our ZoneData format
async function fetchUacForecast(regionSlug: string, config: typeof ZONE_CONFIG[0]): Promise<{
  success: boolean;
  zoneData?: {
    forecast: Array<{ date: string; danger: { alpine: string; treeline: string; belowTreeline: string } }>;
    problems: Array<{ name: string; likelihood: string | null; size: { min: number; max: number } | null; aspects: Array<{ elevation: string; aspects: string[] }>; discussion: string | null }>;
    bottomLine: string;
    hazardDiscussion: string;
    weather: { snow: string; wind: string; temps: string; discussion: string | null };
    publishedTime: string | null;
    expiresTime: string | null;
  };
}> {
  try {
    const url = `${UAC_API_BASE}/${regionSlug}/json`;
    console.log(`Fetching UAC API: ${url}`);
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) {
      console.error(`UAC API error for ${regionSlug}: ${resp.status}`);
      return { success: false };
    }
    const data = await resp.json();
    const advisory = data?.advisories?.[0]?.advisory;
    if (!advisory) {
      console.error(`No advisory data for UAC ${regionSlug}`);
      return { success: false };
    }

    // Parse danger ratings from the overall danger rose
    const todayDanger = parseUacDangerRose(advisory.overall_danger_rose);

    // Parse avalanche problems (up to 3)
    const problems: Array<{ name: string; likelihood: string | null; size: { min: number; max: number } | null; aspects: Array<{ elevation: string; aspects: string[] }>; discussion: string | null }> = [];
    for (let i = 1; i <= 3; i++) {
      const name = advisory[`avalanche_problem_${i}`];
      if (!name || name.trim() === '') continue;
      const description = advisory[`avalanche_problem_${i}_description`] || '';
      const roseStr = advisory[`danger_rose_${i}`] || '';
      problems.push({
        name,
        likelihood: null, // UAC doesn't provide likelihood separately — it's in the description
        size: null, // UAC doesn't provide structured size
        aspects: parseUacProblemRose(roseStr),
        discussion: stripHtml(description),
      });
    }

    // Parse published time
    let publishedTime: string | null = null;
    if (advisory.date_issued_timestamp) {
      publishedTime = new Date(Number(advisory.date_issued_timestamp) * 1000).toISOString();
    }

    // UAC forecasts typically expire ~24 hours after issue
    let expiresTime: string | null = null;
    if (publishedTime) {
      const expires = new Date(new Date(publishedTime).getTime() + 24 * 60 * 60 * 1000);
      expiresTime = expires.toISOString();
    }

    // Build weather from mountain_weather field
    const weatherText = stripHtml(advisory.mountain_weather) || '';

    console.log(`UAC ${regionSlug}: ${problems.length} problems, danger=${advisory.overall_danger_rating}`);

    return {
      success: true,
      zoneData: {
        forecast: [
          { date: 'Today', danger: todayDanger },
          { date: 'Tomorrow', danger: todayDanger }, // UAC only provides current day
        ],
        problems,
        bottomLine: stripHtml(advisory.bottom_line) || '',
        hazardDiscussion: stripHtml(advisory.current_conditions) || '',
        weather: {
          snow: 'N/A',
          wind: 'N/A',
          temps: 'N/A',
          discussion: weatherText,
        },
        publishedTime,
        expiresTime,
      },
    };
  } catch (error) {
    console.error(`Error fetching UAC ${regionSlug}:`, error);
    return { success: false };
  }
}

// Extract danger ratings from forecast
function extractDangerRatings(forecast: any): {
  today: { alpine: string; treeline: string; belowTreeline: string };
  tomorrow: { alpine: string; treeline: string; belowTreeline: string };
} | null {
  const dangerData = forecast?.danger || [];
  if (dangerData.length === 0) return null;
  
  const todayDanger = dangerData[0] || {};
  const tomorrowDanger = dangerData[1] || dangerData[0] || {};

  return {
    today: {
      alpine: mapDangerRating(todayDanger.upper),
      treeline: mapDangerRating(todayDanger.middle),
      belowTreeline: mapDangerRating(todayDanger.lower),
    },
    tomorrow: {
      alpine: mapDangerRating(tomorrowDanger.upper),
      treeline: mapDangerRating(tomorrowDanger.middle),
      belowTreeline: mapDangerRating(tomorrowDanger.lower),
    },
  };
}

// Map elevation band name to standardized form
function normalizeElevation(elevName: string): string {
  const lower = elevName.toLowerCase();
  if (lower.includes('alpine') || lower.includes('upper')) return 'Alpine';
  if (lower.includes('treeline') || lower.includes('middle')) return 'Treeline';
  if (lower.includes('below') || lower.includes('lower')) return 'Below Treeline';
  return elevName;
}

// Strip HTML tags from a string, returning plain text
function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim() || null;
}

// Map aspect abbreviation from NAC API location strings
const ASPECT_MAP: Record<string, string> = {
  'north': 'N', 'northeast': 'NE', 'east': 'E', 'southeast': 'SE',
  'south': 'S', 'southwest': 'SW', 'west': 'W', 'northwest': 'NW',
};

// Extract avalanche problems with detailed aspect/elevation data
function extractProblems(forecast: any): Array<{
  name: string;
  likelihood: string | null;
  size: { min: number; max: number } | null;
  aspects: Array<{ elevation: string; aspects: string[] }>;
  discussion: string | null;
}> {
  const problems = forecast?.forecast_avalanche_problems || [];
  return problems.slice(0, 4).map((p: any) => {
    // Extract aspect/elevation data from the API
    // NAC API returns location as an array of strings like "north upper", "southeast middle"
    const locationData: any[] = p.location || [];
    const elevAspectMap = new Map<string, Set<string>>();

    for (const loc of locationData) {
      if (typeof loc === 'string') {
        // String format: "north upper", "southeast middle", "west lower"
        const parts = loc.toLowerCase().split(' ');
        const aspectKey = parts[0]; // e.g. "north", "southeast"
        const elevKey = parts[1] || 'unknown'; // e.g. "upper", "middle", "lower"
        const aspect = ASPECT_MAP[aspectKey];
        if (aspect) {
          const elevation = normalizeElevation(elevKey);
          if (!elevAspectMap.has(elevation)) elevAspectMap.set(elevation, new Set());
          elevAspectMap.get(elevation)!.add(aspect);
        }
      } else if (typeof loc === 'object' && loc !== null) {
        // Object format (legacy): { north: true, east: true, elev_name: "upper" }
        const activeAspects: string[] = [];
        for (const [key, abbr] of Object.entries(ASPECT_MAP)) {
          if (loc[key]) activeAspects.push(abbr);
        }
        const elevation = normalizeElevation(loc.elev_name || loc.elevation || 'Unknown');
        if (activeAspects.length > 0) {
          if (!elevAspectMap.has(elevation)) elevAspectMap.set(elevation, new Set());
          activeAspects.forEach(a => elevAspectMap.get(elevation)!.add(a));
        }
      }
    }

    // Convert map to sorted array (Alpine first, then Treeline, then Below Treeline)
    const elevOrder = ['Alpine', 'Treeline', 'Below Treeline'];
    const aspects = Array.from(elevAspectMap.entries())
      .sort((a, b) => elevOrder.indexOf(a[0]) - elevOrder.indexOf(b[0]))
      .map(([elevation, aspectSet]) => ({
        elevation,
        aspects: Array.from(aspectSet),
      }));

    // Parse size - API returns as array of strings: ["1", "2.5"]
    let size: { min: number; max: number } | null = null;
    if (Array.isArray(p.size) && p.size.length >= 2) {
      size = { min: Number(p.size[0]), max: Number(p.size[1]) };
    } else if (p.size?.min !== undefined && p.size?.max !== undefined) {
      size = { min: Number(p.size.min), max: Number(p.size.max) };
    }

    return {
      name: p.name || p.avalanche_problem_id || 'Unknown Problem',
      likelihood: p.likelihood || null,
      size,
      aspects,
      discussion: stripHtml(p.discussion),
    };
  });
}

// Extract weather summary from forecast - checks multiple locations for weather info
function extractWeather(forecast: any): {
  snow: string;
  wind: string;
  temps: string;
  discussion: string | null;
} {
  // Check multiple locations for weather data
  const weather = forecast?.weather_data || forecast?.weather_summary || null;
  
  // Gather all possible weather-related text for AI extraction
  const weatherTexts: string[] = [];
  
  // Check weather_summary and weather_discussion
  if (forecast?.weather_summary?.weather_discussion) {
    weatherTexts.push(forecast.weather_summary.weather_discussion);
  }
  if (forecast?.weather_discussion) {
    weatherTexts.push(forecast.weather_discussion);
  }
  
  // Check bottom_line - often contains weather info
  if (forecast?.bottom_line) {
    weatherTexts.push(`BOTTOM LINE: ${forecast.bottom_line}`);
  }
  
  // Check hazard_discussion - sometimes mentions recent snow
  if (forecast?.hazard_discussion) {
    weatherTexts.push(`HAZARD DISCUSSION: ${forecast.hazard_discussion}`);
  }
  
  // Check forecast_zone for weather synopsis
  if (forecast?.forecast_zone?.weather_synopsis) {
    weatherTexts.push(forecast.forecast_zone.weather_synopsis);
  }
  
  // Combine all weather-related text
  const weatherDiscussion = weatherTexts.length > 0 ? weatherTexts.join('\n\n') : null;
  
  if (weatherDiscussion) {
    console.log(`Found weather text (${weatherDiscussion.length} chars)`);
  }
  
  // Try to extract structured fields if available
  let snow = 'N/A';
  let wind = 'N/A';
  let temps = 'N/A';
  
  if (weather) {
    // Try multiple field names for snow
    const snowVal = weather.new_snow_24hr || weather.snow_24hr || weather.recent_snow || 
                    weather.new_snow || weather.snowfall_24hr || null;
    if (snowVal !== null && snowVal !== undefined) {
      snow = typeof snowVal === 'number' ? `${snowVal}"` : snowVal;
    }
    
    // Try multiple field names for wind
    const windVal = weather.wind_summary || weather.ridgeline_winds || weather.wind || null;
    if (windVal) wind = windVal;
    
    // Try multiple field names for temps
    const tempsVal = weather.temperature_summary || weather.temps || weather.temperature || null;
    if (tempsVal) temps = tempsVal;
  }
  
  return {
    snow: snow,
    wind: wind,
    temps: temps,
    discussion: weatherDiscussion,
  };
}

// Build zone data from all sources
interface ZoneData {
  id: string;
  nacZoneId: string;
  name: string;
  center: string;
  forecastUrl: string;
  forecast: Array<{ date: string; danger: { alpine: string; treeline: string; belowTreeline: string } }>;
  problems: Array<{ 
    name: string; 
    likelihood: string | null; 
    size: { min: number; max: number } | null; 
    aspects: Array<{ elevation: string; aspects: string[] }>;
    discussion: string | null;
  }>;
  weather: { snow: string; wind: string; temps: string; discussion: string | null };
  bottomLine: string;
  hazardDiscussion: string;
  freshness: {
    issueDate: string | null;
    expiresDate: string | null;
    ageHours: number | null;
    hoursUntilExpiry: number | null;
    status: 'current' | 'recent' | 'expiring' | 'expired' | 'unknown';
  };
  dataSource: 'api' | 'scrape' | 'map-layer';
  scrapedContent: string | null;
  publishedTime: string | null; // ISO timestamp for cache key
  expiresTime: string | null;   // ISO timestamp for expiration (used for cache storage)
}

// Cache status for logging/debugging
type CacheStatus = 'hit' | 'miss' | 'stored' | 'error';

interface CacheEntry {
  zone_id: string;
  nac_zone_id: string;
  center_id: string;
  published_time: string;
  expires_time: string | null;
  forecast_data: any;
  scraped_content: string | null;
  data_source: string;
}

// Check forecast cache for a zone by published_time
async function checkForecastCache(
  zoneId: string,
  publishedTime: string | null
): Promise<{ data: CacheEntry | null; status: CacheStatus }> {
  if (!publishedTime) {
    console.log(`Cache SKIP for ${zoneId}: no published_time provided`);
    return { data: null, status: 'miss' };
  }

  try {
    const { data, error } = await supabase
      .from('avalanche_forecast_cache')
      .select('*')
      .eq('zone_id', zoneId)
      .eq('published_time', publishedTime)
      .single();

    if (error || !data) {
      console.log(`Cache MISS for ${zoneId} @ ${publishedTime}`);
      return { data: null, status: 'miss' };
    }

    console.log(`Cache HIT for ${zoneId} @ ${publishedTime}`);
    return { data: data as CacheEntry, status: 'hit' };
  } catch (error) {
    console.error(`Cache lookup error for ${zoneId}:`, error);
    return { data: null, status: 'error' };
  }
}

// Store forecast data in cache
async function storeForecastCache(
  zoneData: ZoneData,
  config: { nacZoneId: string; centerId: string }
): Promise<CacheStatus> {
  if (!zoneData.publishedTime) {
    console.log(`Skipping cache store for ${zoneData.id}: no published_time`);
    return 'miss';
  }

  try {
    // Build forecast_data object matching what we need to reconstruct ZoneData
    const forecastData = {
      forecast: zoneData.forecast,
      problems: zoneData.problems,
      weather: zoneData.weather,
      bottomLine: zoneData.bottomLine,
      hazardDiscussion: zoneData.hazardDiscussion,
      freshness: zoneData.freshness,
    };

    const { error } = await supabase
      .from('avalanche_forecast_cache')
      .upsert({
        zone_id: zoneData.id,
        nac_zone_id: config.nacZoneId,
        center_id: config.centerId,
        published_time: zoneData.publishedTime,
        expires_time: zoneData.expiresTime, // Use raw ISO timestamp, NOT formatted expiresDate
        forecast_data: forecastData,
        scraped_content: zoneData.scrapedContent,
        data_source: zoneData.dataSource,
      }, {
        onConflict: 'zone_id,published_time',
      });

    if (error) {
      console.error(`Cache store error for ${zoneData.id}:`, error);
      return 'error';
    }

    console.log(`Cache STORED for ${zoneData.id} @ ${zoneData.publishedTime}`);
    return 'stored';
  } catch (error) {
    console.error(`Cache store exception for ${zoneData.id}:`, error);
    return 'error';
  }
}

// Reconstruct ZoneData from cache entry
// IMPORTANT: Recalculates freshness status based on current time (not cached value)
function buildZoneDataFromCache(
  cached: CacheEntry,
  config: { id: string; name: string; forecastUrl: string }
): ZoneData {
  const fd = cached.forecast_data;
  
  // Recalculate freshness based on current time using the original timestamps
  // This ensures expired forecasts show correct "expired" status even on cache hits
  const freshness = calculateFreshness(cached.published_time, cached.expires_time);
  
  return {
    id: config.id,
    nacZoneId: cached.nac_zone_id,
    name: config.name,
    center: cached.center_id,
    forecastUrl: config.forecastUrl,
    forecast: fd.forecast || [],
    problems: fd.problems || [],
    weather: fd.weather || { snow: 'N/A', wind: 'N/A', temps: 'N/A', discussion: null },
    bottomLine: fd.bottomLine || '',
    hazardDiscussion: fd.hazardDiscussion || '',
    freshness,
    dataSource: cached.data_source as 'api' | 'scrape' | 'map-layer',
    scrapedContent: cached.scraped_content,
    publishedTime: cached.published_time,
    expiresTime: cached.expires_time,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body to get zone selection
    const body = await req.json().catch(() => ({}));
    const requestedZoneIds = body?.zoneIds;

    // Filter zones based on user selection (default to all zones if not specified)
    const zonesToProcess = requestedZoneIds && Array.isArray(requestedZoneIds) && requestedZoneIds.length > 0
      ? ZONE_CONFIG.filter(zone => requestedZoneIds.includes(zone.id))
      : ZONE_CONFIG;

    console.log(`Fetching avalanche forecasts for ${zonesToProcess.length} zone(s)...`);
    if (requestedZoneIds) {
      console.log(`Requested zones: ${requestedZoneIds.join(', ')}`);
    }

    // Step 1: Get map-layer data for timestamps and overall danger
    // Only fetch data for centers that are in the selected zones
    const selectedCenterIds = [...new Set(zonesToProcess.map(z => z.centerId))];
    console.log(`Selected centers: ${selectedCenterIds.join(', ')}`);
    const mapLayerData = await fetchMapLayerData(selectedCenterIds);

    // Step 2: Fetch individual zone forecasts with cache-aside pattern
    const cacheStatuses = new Map<string, CacheStatus>();
    
    const zoneDataPromises = zonesToProcess.map(async (config): Promise<ZoneData> => {
      const mapData = mapLayerData.get(config.nacZoneId);
      
      // Fetch from NAC API first to get published_time (this is always needed to check cache validity)
      const forecast = await fetchZoneForecast(config.centerId, config.nacZoneId);
      
      // Get published_time from API response (preferred) or map-layer (fallback)
      const publishedTime = forecast?.published_time || mapData?.start_date || null;
      const expiresTime = forecast?.expires_time || mapData?.end_date || null;
      
      // Check cache using the API's published_time
      if (publishedTime) {
        const cacheResult = await checkForecastCache(config.id, publishedTime);
        
        if (cacheResult.data) {
          // Cache HIT - use cached data (skip expensive parsing and Firecrawl)
          cacheStatuses.set(config.id, 'hit');
          const cachedData = buildZoneDataFromCache(cacheResult.data, {
            id: config.id,
            name: config.name,
            forecastUrl: config.forecastUrl,
          });
          console.log(`Using CACHED data for ${config.name} (published: ${publishedTime})`);
          return cachedData;
        }
      }
      
      // Cache MISS - process the API response we already have
      console.log(`Cache miss for ${config.name}, processing API response...`);
      const freshness = calculateFreshness(publishedTime, expiresTime);
      
      // If API returned good data
      if (forecast) {
        const dangerRatings = extractDangerRatings(forecast);
        const problems = extractProblems(forecast);
        const weather = extractWeather(forecast);
        const bottomLine = forecast.bottom_line || '';
        const hazardDiscussion = forecast.hazard_discussion || '';
        
        if (dangerRatings) {
          console.log(`API success for ${config.name}: ${problems.length} problems, freshness=${freshness.status}`);
          const zoneData: ZoneData = {
            id: config.id,
            nacZoneId: config.nacZoneId,
            name: config.name,
            center: config.centerId,
            forecastUrl: config.forecastUrl,
            forecast: [
              { date: 'Today', danger: dangerRatings.today },
              { date: 'Tomorrow', danger: dangerRatings.tomorrow },
            ],
            problems,
            weather,
            bottomLine,
            hazardDiscussion,
            freshness,
            dataSource: 'api',
            scrapedContent: null,
            publishedTime: publishedTime,
            expiresTime: expiresTime,
          };
          
          // Store in cache (async, don't await)
          storeForecastCache(zoneData, { nacZoneId: config.nacZoneId, centerId: config.centerId })
            .then(status => cacheStatuses.set(config.id, status))
            .catch(err => console.error(`Cache store failed for ${config.id}:`, err));
          
          return zoneData;
        }
      }
      
      // UAC-specific: Try UAC's own JSON API (they don't populate the NAC API)
      if (config.centerId === 'UAC') {
        const uacResult = await fetchUacForecast(config.id, config);
        if (uacResult.success && uacResult.zoneData) {
          const uacFreshness = calculateFreshness(uacResult.zoneData.publishedTime, uacResult.zoneData.expiresTime);
          const zoneData: ZoneData = {
            id: config.id,
            nacZoneId: config.nacZoneId,
            name: config.name,
            center: config.centerId,
            forecastUrl: config.forecastUrl,
            forecast: uacResult.zoneData.forecast,
            problems: uacResult.zoneData.problems,
            weather: uacResult.zoneData.weather,
            bottomLine: uacResult.zoneData.bottomLine,
            hazardDiscussion: uacResult.zoneData.hazardDiscussion,
            freshness: uacFreshness,
            dataSource: 'api',
            scrapedContent: null,
            publishedTime: uacResult.zoneData.publishedTime,
            expiresTime: uacResult.zoneData.expiresTime,
          };

          storeForecastCache(zoneData, { nacZoneId: config.nacZoneId, centerId: config.centerId })
            .then(status => cacheStatuses.set(config.id, status))
            .catch(err => console.error(`Cache store failed for ${config.id}:`, err));

          return zoneData;
        }
      }

      // Fallback: Try web scraping
      console.log(`API insufficient for ${config.name}, trying Firecrawl...`);
      const scrapeResult = await scrapeZoneForecast(config.fallbackUrl, config.name);
      
      if (scrapeResult.success && scrapeResult.markdown) {
        // Use map-layer for danger ratings, scrape for details
        const overallDanger = mapDangerRating(mapData?.danger_level ?? -1);
        console.log(`Scrape success for ${config.name}, using map-layer danger: ${overallDanger}`);
        
        const zoneData: ZoneData = {
          id: config.id,
          nacZoneId: config.nacZoneId,
          name: config.name,
          center: config.centerId,
          forecastUrl: config.forecastUrl,
          forecast: [
            { date: 'Today', danger: { alpine: overallDanger, treeline: overallDanger, belowTreeline: overallDanger } },
            { date: 'Tomorrow', danger: { alpine: overallDanger, treeline: overallDanger, belowTreeline: overallDanger } },
          ],
          problems: [],
          weather: { snow: 'N/A', wind: 'N/A', temps: 'N/A', discussion: null },
          bottomLine: '',
          hazardDiscussion: '',
          freshness,
          dataSource: 'scrape',
          scrapedContent: scrapeResult.markdown.slice(0, 8000), // Limit context size
          publishedTime: publishedTime,
          expiresTime: expiresTime,
        };
        
        // Store in cache (async, don't await)
        storeForecastCache(zoneData, { nacZoneId: config.nacZoneId, centerId: config.centerId })
          .then(status => cacheStatuses.set(config.id, status))
          .catch(err => console.error(`Cache store failed for ${config.id}:`, err));
        
        return zoneData;
      }
      
      // Last resort: Map-layer only
      console.log(`Falling back to map-layer only for ${config.name}`);
      const overallDanger = mapDangerRating(mapData?.danger_level ?? -1);
      
      const zoneData: ZoneData = {
        id: config.id,
        nacZoneId: config.nacZoneId,
        name: config.name,
        center: config.centerId,
        forecastUrl: config.forecastUrl,
        forecast: [
          { date: 'Today', danger: { alpine: overallDanger, treeline: overallDanger, belowTreeline: overallDanger } },
          { date: 'Tomorrow', danger: { alpine: overallDanger, treeline: overallDanger, belowTreeline: overallDanger } },
        ],
        problems: [],
        weather: { snow: 'N/A', wind: 'N/A', temps: 'N/A', discussion: null },
        bottomLine: '',
        hazardDiscussion: '',
        freshness,
        dataSource: 'map-layer',
        scrapedContent: null,
        publishedTime: publishedTime,
        expiresTime: expiresTime,
      };
      
      // Don't cache map-layer-only data (too sparse to be useful)
      cacheStatuses.set(config.id, 'miss');
      
      return zoneData;
    });

    const zonesData = await Promise.all(zoneDataPromises);
    console.log(`Built data for ${zonesData.length} zones`);

    // Log data sources and cache status
    zonesData.forEach(z => {
      const cacheStatus = cacheStatuses.get(z.id) || 'miss';
      console.log(`${z.name}: source=${z.dataSource}, cache=${cacheStatus}, freshness=${z.freshness.status}, problems=${z.problems.length}`);
    });

    // Step 2.5: Fetch SNOTEL weather station observations (in parallel)
    console.log('Fetching SNOTEL weather observations...');
    const weatherObservationsMap = new Map<string, StationObservation[]>();

    try {
      const weatherFetchPromises = zonesData.map(async (zone) => {
        const stations = getStationsForZone(zone.id);
        if (stations.length === 0) {
          console.log(`No weather stations configured for ${zone.name}`);
          return { zoneId: zone.id, observations: [] };
        }

        console.log(`Fetching ${stations.length} stations for ${zone.name}`);
        const observations = await fetchMultipleStations(
          stations.map(s => ({ triplet: s.triplet, name: s.name, elevation: s.elevation }))
        );

        return { zoneId: zone.id, observations };
      });

      const weatherResults = await Promise.all(weatherFetchPromises);
      weatherResults.forEach(result => {
        weatherObservationsMap.set(result.zoneId, result.observations);
        console.log(`${result.zoneId}: ${result.observations.length} station observations fetched`);
      });
    } catch (error) {
      console.error('Error fetching weather observations:', error);
      // Continue without weather data - graceful degradation
    }

    // Step 3: Build context for AI synthesis
    const forecastContext = zonesData.map(zone => {
      const todayDanger = zone.forecast[0].danger;
      const tomorrowDanger = zone.forecast[1].danger;
      
      let context = `
=== ZONE ID: "${zone.id}" | ${zone.name} (${zone.center}) ===
Data Source: ${zone.dataSource.toUpperCase()}
Issued: ${zone.freshness.issueDate || 'Unknown'} | Expires: ${zone.freshness.expiresDate || 'Unknown'} | Status: ${zone.freshness.status}

TODAY'S DANGER:
- Alpine: ${todayDanger.alpine}
- Treeline: ${todayDanger.treeline}  
- Below Treeline: ${todayDanger.belowTreeline}

TOMORROW'S DANGER:
- Alpine: ${tomorrowDanger.alpine}
- Treeline: ${tomorrowDanger.treeline}
- Below Treeline: ${tomorrowDanger.belowTreeline}

WEATHER:
- Snow: ${zone.weather.snow}
- Wind: ${zone.weather.wind}
- Temps: ${zone.weather.temps}
${zone.weather.discussion ? `- Discussion: ${zone.weather.discussion}` : ''}

AVALANCHE PROBLEMS:`;

      if (zone.problems.length > 0) {
        zone.problems.forEach(p => {
          context += `\n- ${p.name}`;
          if (p.likelihood) context += ` | Likelihood: ${p.likelihood}`;
          if (p.size) context += ` | Size: D${p.size.min}-D${p.size.max}`;
          if (p.aspects.length > 0) {
            context += `\n  Elevation/Aspect:`;
            p.aspects.forEach(a => {
              context += `\n    - ${a.elevation}: ${a.aspects.join(', ')}`;
            });
          }
          if (p.discussion) context += `\n  Discussion: ${p.discussion.slice(0, 400)}`;
        });
      } else {
        context += '\nNone listed';
      }

      if (zone.bottomLine) {
        context += `\n\nBOTTOM LINE:\n${zone.bottomLine.slice(0, 500)}`;
      }

      if (zone.hazardDiscussion) {
        context += `\n\nHAZARD DISCUSSION:\n${zone.hazardDiscussion.slice(0, 500)}`;
      }

      // Include scraped content for AI to parse
      if (zone.scrapedContent) {
        context += `\n\nSCRAPED FORECAST PAGE:\n${zone.scrapedContent}`;
      }

      // Include weather station observations
      const observations = weatherObservationsMap.get(zone.id) || [];
      if (observations.length > 0) {
        context += `\n\n=== WEATHER STATION OBSERVATIONS (ACTUAL MEASUREMENTS) ===`;
        observations.forEach(obs => {
          const obsDate = new Date(obs.timestamp);
          const hoursAgo = Math.round((Date.now() - obsDate.getTime()) / (1000 * 60 * 60));

          context += `\n\nStation: ${obs.stationName} (${obs.stationTriplet})`;
          context += `\nTimestamp: ${obs.timestamp} (${hoursAgo} hours ago)`;
          context += `\nData Quality: ${obs.dataQuality.toUpperCase()}`;

          // Snow observations
          context += `\n\nSNOW OBSERVATIONS:`;
          if (obs.snow.depth !== null) context += `\n  - Current depth: ${obs.snow.depth}"`;
          if (obs.snow.depth24hrChange !== null) {
            const change = obs.snow.depth24hrChange > 0 ? `+${obs.snow.depth24hrChange}` : obs.snow.depth24hrChange;
            context += `\n  - 24hr change: ${change}" `;
          }
          if (obs.snow.depth7dayChange !== null) {
            const change = obs.snow.depth7dayChange > 0 ? `+${obs.snow.depth7dayChange}` : obs.snow.depth7dayChange;
            context += `\n  - 7-day change: ${change}"`;
          }
          if (obs.snow.precip24hr !== null) context += `\n  - Precipitation 24hr: ${obs.snow.precip24hr}"`;
          if (obs.snow.precip48hr !== null) context += `\n  - Precipitation 48hr: ${obs.snow.precip48hr}"`;
          if (obs.snow.precip7day !== null) context += `\n  - Precipitation 7-day: ${obs.snow.precip7day}"`;
          if (obs.snow.swe !== null) context += `\n  - SWE: ${obs.snow.swe}"`;

          // Temperature observations
          context += `\n\nTEMPERATURE OBSERVATIONS:`;
          if (obs.temperature.current !== null) context += `\n  - Current: ${obs.temperature.current}°F`;
          if (obs.temperature.high24hr !== null) context += `\n  - 24hr high: ${obs.temperature.high24hr}°F`;
          if (obs.temperature.low24hr !== null) context += `\n  - 24hr low: ${obs.temperature.low24hr}°F`;
          if (obs.temperature.trend) context += `\n  - Trend: ${obs.temperature.trend.toUpperCase()}`;

          // Wind observations (if available)
          if (obs.wind) {
            context += `\n\nWIND OBSERVATIONS:`;
            if (obs.wind.speedAvg24hr !== null) context += `\n  - 24hr average: ${obs.wind.speedAvg24hr} mph`;
            if (obs.wind.speedMax24hr !== null) context += `\n  - 24hr max: ${obs.wind.speedMax24hr} mph`;
            if (obs.wind.direction) context += `\n  - Direction: ${obs.wind.direction}`;
          }
        });

        // Add comparison instructions for AI
        context += `\n\n**IMPORTANT**: Compare the WEATHER OBSERVATIONS above with the forecast WEATHER section.`;
        context += `\nNote any discrepancies or confirmations between predicted and actual measurements.`;
      }

      return context;
    }).join('\n\n---\n\n');

const systemPrompt = `You are an expert avalanche safety analyst. Synthesize the structured forecast data into actionable guidance for the avalanche center and zones provided.

OUTPUT FORMAT (JSON):
{
  "quickTake": "3-4 sentence overview for this avalanche center's zones. Summarize the current avalanche situation - dominant problems, danger levels, which elevations/aspects are most concerning, and overall trend. Keep it specific to the zones in the data, not a generic national summary.",
  "zones": [
    {
      "id": "EXACT_ZONE_ID_FROM_DATA",
      "name": "Zone Name",
      "forecastUrl": "URL from the zone config",
      "forecast": [
        { "date": "Today", "danger": { "alpine": "RATING", "treeline": "RATING", "belowTreeline": "RATING" } },
        { "date": "Tomorrow", "danger": { "alpine": "RATING", "treeline": "RATING", "belowTreeline": "RATING" } }
      ],
      "weather": { "snow": "Amount/discussion", "wind": "Description", "temps": "Range" },
      "problems": [
        {
          "name": "Problem name (e.g., Persistent Slab)",
          "likelihood": "Possible/Likely/Very Likely/Certain",
          "size": { "min": 1, "max": 3 },
          "aspects": [
            { "elevation": "Alpine", "aspects": ["N", "NE", "NW"] },
            { "elevation": "Treeline", "aspects": ["N", "NE"] }
          ],
          "discussion": "Brief 1-2 sentence explanation of the problem"
        }
      ],
      "keyMessage": "Most important thing about this zone",
      "travelAdvice": "Specific recommendations for terrain selection",
      "weatherValidation": "confirmed | partial | discrepancy | no_data"
    }
  ],
  "weatherHighlights": "Weather synopsis for these zones - recent precipitation, wind patterns, temperature trends, and how weather is affecting snowpack. If weather observations are available, integrate actual measurements.",
  "bottomLine": "Final summary of conditions for this center's zones"
}

CRITICAL RULES:
1. Use the EXACT zone IDs provided in the data. Do NOT modify or rename them.
2. Use the EXACT danger ratings from the data - don't infer different ones.
3. If data source is "SCRAPE", extract problems, weather, and key messages from the scraped content.
4. If forecast is EXPIRED, factor this into your analysis and mention it in keyMessage.
5. For zones with NO_RATING, note uncertainty and recommend checking the official source.

AVALANCHE PROBLEMS - Include detailed info:
- name: Full problem name (Wind Slab, Storm Slab, Persistent Slab, Deep Slab, Wet Avalanche, Loose Dry, Loose Wet, Cornice)
- likelihood: Extract from data (Unlikely, Possible, Likely, Very Likely, Certain)
- size: Extract min/max as numbers 1-5 (D1=Small, D2=Large, D3=Very Large, D4-5=Historic)
- aspects: Include elevation band and affected aspects from the data
- discussion: Brief explanation of the problem

WEATHER EXTRACTION - CRITICAL:
From the WEATHER DISCUSSION, BOTTOM LINE, and HAZARD DISCUSSION text, you MUST extract:
- snow: Summarize snowfall conditions - amounts like "6 inches", "1-2 inches overnight", storm totals, snow quality, recent activity
- wind: Look for ridge/ridgeline winds, speed ranges like "10-20 mph", direction like "SE winds"
- temps: Look for temperature ranges like "teens to 20s", freezing levels like "FL 2500ft", "warming trend"

If the structured weather shows "N/A" but the discussion text contains this info, EXTRACT IT.
Never return "N/A" for weather if the discussion text mentions snow amounts, wind, or temperatures.

**CRITICAL - DO NOT HALLUCINATE WEATHER DATA:**
- If BOTH the structured weather field shows "N/A" AND there is NO discussion text (null or empty), you MUST:
  - Set the weather field to "No forecast data available" or similar
  - DO NOT invent, guess, or assume weather conditions like "light winds" or "cool temperatures"
  - Only report weather information that is EXPLICITLY stated in the source data
- For zones with NO current forecast (expired or NO_RATING with no discussion), weather fields should indicate data is unavailable
- In quickTake and weatherHighlights, only include weather details that come from actual source data or SNOTEL measurements
- It is better to say "weather data unavailable" than to fabricate conditions

WEATHER OBSERVATIONS COMPARISON - WHEN AVAILABLE:
If a zone includes "WEATHER STATION OBSERVATIONS (ACTUAL MEASUREMENTS)":
1. COMPARE forecast weather narrative with actual measured data
2. SET weatherValidation field:
   - "confirmed": Observations match forecast within reasonable margins (±20% for snow, ±5°F for temps)
   - "partial": Some measurements match, others don't, or limited observation data available
   - "discrepancy": Significant differences between forecast and observations (e.g., forecast said 4-6" but station shows 10")
   - "no_data": No weather station observations available for this zone
3. In keyMessage or weatherHighlights, mention notable confirmations or discrepancies
   - Example: "Station confirms forecast with 6\" measured in 24hr"
   - Example: "Observations show significantly more snow than forecasted - station measured 10\" vs forecast 4-6\""
4. Use actual measurements to enhance weather summary when available
5. If observation data is >6 hours old, note this in your analysis
6. When forecast weather is unavailable but SNOTEL observations exist, use ONLY the measured data for weather summary

ALWAYS include weatherValidation field for every zone, even if "no_data".`;

    const userPrompt = `Analyze these avalanche forecasts and synthesize a comprehensive summary:

${forecastContext}

IMPORTANT INSTRUCTIONS:
1. Use the EXACT zone IDs and danger ratings from the data
2. Extract detailed avalanche problem info including likelihood, size, aspect/elevation, and discussion
3. Note data freshness - expired forecasts should be called out
4. Parse scraped content for zones where API data was unavailable
5. EXTRACT WEATHER DATA from discussion text - look for snowfall amounts, wind speeds/directions, and temperature info
6. COMPARE weather observations (actual measurements) with forecast narratives when available
7. Set weatherValidation field for EVERY zone based on comparison (or "no_data" if no observations)
8. Mention significant confirmations or discrepancies in keyMessage or weatherHighlights
9. Provide helpful travel advice that respects user autonomy in decision-making`;

    console.log('Calling AI for synthesis...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate summary' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const summaryText = aiData.choices?.[0]?.message?.content;

    if (!summaryText) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate summary' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let summary;
    try {
      summary = JSON.parse(summaryText);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', summaryText);
      summary = { quickTake: summaryText, zones: [], weatherHighlights: '', bottomLine: '' };
    }

    // Merge AI synthesis with our structured data (freshness, data source, forecastUrl)
    // IMPORTANT: Only include zones that were actually requested (filter out any AI hallucinations)
    const validZoneIds = new Set(zonesData.map(z => z.id));
    const filteredZones = (summary.zones || []).filter((zone: any) => validZoneIds.has(zone.id));

    if (filteredZones.length < summary.zones.length) {
      console.log(`⚠️ AI returned ${summary.zones.length} zones but only ${filteredZones.length} were requested. Filtering out extras.`);
    }

    const zonesWithMetadata = filteredZones.map((zone: any, index: number) => {
      // Match by exact ID first
      let sourceData = zonesData.find(z => z.id === zone.id);
      
      // Fallback matching
      if (!sourceData && zone.name) {
        sourceData = zonesData.find(z => 
          z.name.toLowerCase() === zone.name.toLowerCase() ||
          normalizeZoneName(z.name) === normalizeZoneName(zone.name)
        );
      }
      
      // Index-based fallback
      if (!sourceData && zonesData.length === summary.zones.length) {
        sourceData = zonesData[index];
        console.log(`Index fallback: ${zone.name} -> ${sourceData?.name}`);
      }
      
      if (sourceData) {
        console.log(`Matched: ${zone.name} -> ${sourceData.name} (${sourceData.id}), source=${sourceData.dataSource}, freshness=${sourceData.freshness.status}`);
      } else {
        console.log(`No match for: ${zone.name}`);
      }
      
      // Get weather observations for this zone
      const observations = sourceData ? weatherObservationsMap.get(sourceData.id) || [] : [];

      return {
        ...zone,
        // Override AI-generated structured fields with directly-extracted API data
        // AI should only generate: keyMessage, travelAdvice, weatherValidation, weather narrative
        forecast: sourceData?.forecast || zone.forecast,
        problems: sourceData?.problems || zone.problems,
        hazardDiscussion: stripHtml(sourceData?.hazardDiscussion) || undefined,
        forecastUrl: sourceData?.forecastUrl || zone.forecastUrl || '',
        freshness: sourceData?.freshness || {
          issueDate: null,
          expiresDate: null,
          ageHours: null,
          hoursUntilExpiry: null,
          status: 'unknown'
        },
        dataSource: sourceData?.dataSource || 'unknown',
        weatherObservations: observations.length > 0 ? observations : undefined,
      };
    });

    console.log('Summary generated successfully');

    // Cache the synthesized results in avalanche_daily_forecasts for future fast loads
    try {
      const now = new Date();

      const zoneCachePromises = zonesWithMetadata.map((zone: any) => {
        const sourceData = zonesData.find(z => z.id === zone.id);
        const zoneConfig = ZONE_CONFIG.find(z => z.id === zone.id);
        const zoneTz = zoneConfig?.timezone || 'America/Anchorage';
        const localTime = new Date(now.toLocaleString('en-US', { timeZone: zoneTz }));
        const forecastDate = localTime.toISOString().split('T')[0];

        return supabase
          .from('avalanche_daily_forecasts')
          .upsert({
            zone_id: zone.id,
            center_id: sourceData?.center || 'UNKNOWN',
            forecast_date: forecastDate,
            published_time: zone.freshness?.issueDate ? new Date(zone.freshness.issueDate).toISOString() : null,
            expires_time: zone.freshness?.expiresDate ? new Date(zone.freshness.expiresDate).toISOString() : null,
            synthesized_data: {
              id: zone.id,
              name: zone.name,
              forecastUrl: zone.forecastUrl,
              forecast: zone.forecast,
              weather: zone.weather,
              problems: zone.problems,
              keyMessage: zone.keyMessage,
              travelAdvice: zone.travelAdvice,
              freshness: zone.freshness,
              hazardDiscussion: zone.hazardDiscussion,
              weatherValidation: zone.weatherValidation,
            },
          }, {
            onConflict: 'zone_id,forecast_date',
          });
      });

      const summaryCenters = new Map<string, string>();
      for (const zone of zonesWithMetadata) {
        const sourceData = zonesData.find(z => z.id === zone.id);
        if (!sourceData?.center || summaryCenters.has(sourceData.center)) continue;

        const zoneConfig = ZONE_CONFIG.find(z => z.id === zone.id);
        const zoneTz = zoneConfig?.timezone || 'America/Anchorage';
        const localTime = new Date(now.toLocaleString('en-US', { timeZone: zoneTz }));
        const forecastDate = localTime.toISOString().split('T')[0];
        summaryCenters.set(sourceData.center, forecastDate);
      }

      const summaryCachePromises = Array.from(summaryCenters.entries()).map(([centerId, forecastDate]) =>
        supabase
          .from('avalanche_daily_forecasts')
          .upsert({
            zone_id: `_summary_${centerId}`,
            center_id: centerId,
            forecast_date: forecastDate,
            synthesized_data: {
              quickTake: summary.quickTake || '',
              weatherHighlights: summary.weatherHighlights || '',
              bottomLine: summary.bottomLine || '',
            },
          }, {
            onConflict: 'zone_id,forecast_date',
          })
      );

      const cacheResults = await Promise.all([...zoneCachePromises, ...summaryCachePromises]);
      const cacheErrors = cacheResults.filter(r => r.error);
      if (cacheErrors.length > 0) {
        console.error(`Failed to cache ${cacheErrors.length} forecast rows:`, cacheErrors.map(r => r.error));
      } else {
        console.log(`Cached ${zonesWithMetadata.length} zones and ${summaryCachePromises.length} summaries`);
      }
    } catch (cacheError) {
      // Don't fail the response if caching fails
      console.error('Error caching forecasts:', cacheError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          ...summary,
          zones: zonesWithMetadata,
        },
        scrapedAt: new Date().toISOString(),
        zonesScraped: zonesData.map(z => ({
          id: z.id,
          nacZoneId: z.nacZoneId,
          name: z.name,
          center: z.center,
          success: true,
          dataSource: z.dataSource,
          cacheStatus: cacheStatuses.get(z.id) || 'miss',
          freshness: z.freshness,
        })),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in avalanche-summary:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
