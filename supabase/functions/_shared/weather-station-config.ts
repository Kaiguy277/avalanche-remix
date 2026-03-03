/**
 * Weather Station Configuration for Avalanche Zones
 * Maps SNOTEL stations to avalanche forecast zones
 */

export interface WeatherStation {
  triplet: string;      // SNOTEL triplet format: stationId:state:network
  name: string;
  elevation: number;    // feet
  latitude: number;
  longitude: number;
  primary: boolean;     // all stations are primary (displayed on zone cards)
}

export interface ZoneStationConfig {
  zoneId: string;      // matches zone IDs in avalanche-summary
  stations: WeatherStation[];
}

// SNOTEL station mappings for each avalanche zone
export const WEATHER_STATION_CONFIG: ZoneStationConfig[] = [
  {
    zoneId: 'turnagain-girdwood',
    stations: [
      {
        triplet: '954:AK:SNTL',
        name: 'Turnagain Pass SNOTEL',
        elevation: 1860,
        latitude: 60.78043,
        longitude: -149.18325,
        primary: true,
      },
      {
        triplet: '1103:AK:SNTL',
        name: 'Mt. Alyeska SNOTEL',
        elevation: 1500,
        latitude: 60.95842,
        longitude: -149.08858,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'summit',
    stations: [
      {
        triplet: '955:AK:SNTL',
        name: 'Summit Creek SNOTEL',
        elevation: 1340,
        latitude: 60.62,
        longitude: -149.53,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'seward',
    stations: [
      {
        triplet: '1092:AK:SNTL',
        name: 'Exit Glacier SNOTEL',
        elevation: 360,
        latitude: 60.19,
        longitude: -149.62,
        primary: true,
      },
      {
        triplet: '959:AK:SNTL',
        name: 'Cooper Lake SNOTEL',
        elevation: 1150,
        latitude: 60.39,
        longitude: -149.69,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'chugach-state-park',
    stations: [
      {
        triplet: '946:AK:SNTL',
        name: 'Indian Pass SNOTEL',
        elevation: 2400,
        latitude: 61.07,
        longitude: -149.49,
        primary: true,
      },
      {
        triplet: '1070:AK:SNTL',
        name: 'Anchorage Hillside SNOTEL',
        elevation: 1910,
        latitude: 61.11,
        longitude: -149.68,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'hatcher-pass',
    stations: [
      {
        triplet: '1091:AK:SNTL',
        name: 'Independence Mine SNOTEL',
        elevation: 3450,
        latitude: 61.78,
        longitude: -149.28,
        primary: true,
      }
    ]
  },
  // Valdez Avalanche Center Zones
  {
    zoneId: 'valdez-maritime',
    stations: [
      {
        triplet: '1095:AK:SNTL',
        name: 'Sugarloaf Mtn',
        elevation: 530,
        latitude: 61.0833,
        longitude: -146.3,
        primary: true,
      },
      {
        triplet: '1055:AK:SNTL',
        name: 'Upper Tsaina River',
        elevation: 1730,
        latitude: 61.18333,
        longitude: -145.65,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'valdez-intermountain',
    stations: [
      {
        triplet: '1055:AK:SNTL',
        name: 'Upper Tsaina River',
        elevation: 1730,
        latitude: 61.18333,
        longitude: -145.65,
        primary: true,
      },
      {
        triplet: '1095:AK:SNTL',
        name: 'Sugarloaf Mtn',
        elevation: 530,
        latitude: 61.0833,
        longitude: -146.3,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'valdez-continental',
    stations: [
      {
        triplet: '1055:AK:SNTL',
        name: 'Upper Tsaina River',
        elevation: 1730,
        latitude: 61.18333,
        longitude: -145.65,
        primary: true,
      }
    ]
  },
  // Eastern Alaska Range - North Zone (Castner-Canwell)
  {
    zoneId: 'earac-north',
    stations: [
      {
        triplet: '768:AK:SNTL',
        name: 'Look Eyrie',
        elevation: 5040,
        latitude: 63.32,
        longitude: -145.60,
        primary: true,
      },
      {
        triplet: '1268:AK:SNTL',
        name: 'Fielding Lake',
        elevation: 3000,
        latitude: 63.20,
        longitude: -145.63,
        primary: true,
      },
    ]
  },
  // Eastern Alaska Range - South Zone (Summit)
  {
    zoneId: 'earac-south',
    stations: [
      {
        triplet: '768:AK:SNTL',
        name: 'Look Eyrie',
        elevation: 5040,
        latitude: 63.32,
        longitude: -145.60,
        primary: true,
      },
      {
        triplet: '1268:AK:SNTL',
        name: 'Fielding Lake',
        elevation: 3000,
        latitude: 63.20,
        longitude: -145.63,
        primary: true,
      },
    ]
  },
  // Coastal Alaska Avalanche Center - Douglas Island
  {
    zoneId: 'douglas-island',
    stations: [
      {
        triplet: '1270:AK:SNTL',
        name: 'Heen Latinee',
        elevation: 2100,
        latitude: 58.70,
        longitude: -134.867,
        primary: true,
      },
      {
        triplet: '1001:AK:SNTL',
        name: 'Long Lake',
        elevation: 840,
        latitude: 58.183,
        longitude: -133.833,
        primary: true,
      },
    ]
  },
  // Coastal Alaska Avalanche Center - Juneau Mainland
  {
    zoneId: 'juneau-mainland',
    stations: [
      {
        triplet: '1270:AK:SNTL',
        name: 'Heen Latinee',
        elevation: 2100,
        latitude: 58.70,
        longitude: -134.867,
        primary: true,
      },
      {
        triplet: '1001:AK:SNTL',
        name: 'Long Lake',
        elevation: 840,
        latitude: 58.183,
        longitude: -133.833,
        primary: true,
      },
    ]
  },
  // Haines Avalanche Center - Lutak
  {
    zoneId: 'haines-lutak',
    stations: [
      {
        triplet: '1176:AK:SNTL',
        name: 'Moore Creek Bridge',
        elevation: 2250,
        latitude: 59.59,
        longitude: -135.19,
        primary: true,
      },
      {
        triplet: '1285:AK:SNTL',
        name: 'Flower Mountain',
        elevation: 2540,
        latitude: 59.40,
        longitude: -136.28,
        primary: true,
      },
    ]
  },
  // Haines Avalanche Center - Transitional
  {
    zoneId: 'haines-transitional',
    stations: [
      {
        triplet: '1176:AK:SNTL',
        name: 'Moore Creek Bridge',
        elevation: 2250,
        latitude: 59.59,
        longitude: -135.19,
        primary: true,
      },
      {
        triplet: '1285:AK:SNTL',
        name: 'Flower Mountain',
        elevation: 2540,
        latitude: 59.40,
        longitude: -136.28,
        primary: true,
      },
    ]
  },
  // Haines Avalanche Center - Chilkat Pass
  {
    zoneId: 'haines-chilkat-pass',
    stations: [
      {
        triplet: '1176:AK:SNTL',
        name: 'Moore Creek Bridge',
        elevation: 2250,
        latitude: 59.59,
        longitude: -135.19,
        primary: true,
      },
      {
        triplet: '1285:AK:SNTL',
        name: 'Flower Mountain',
        elevation: 2540,
        latitude: 59.40,
        longitude: -136.28,
        primary: true,
      },
    ]
  },
];

/**
 * SNOTEL element codes to fetch
 * Ref: https://wcc.sc.egov.usda.gov/nwcc/rgrpt?report=elecodelist
 */
export const SNOTEL_ELEMENTS = {
  // Snow measurements
  SNWD: 'Snow depth (inches)',
  WTEQ: 'Snow water equivalent (inches)',
  PREC: 'Precipitation accumulation (inches)',

  // Temperature
  TOBS: 'Air temperature observed (°F)',
  TMAX: 'Air temperature maximum (°F)',
  TMIN: 'Air temperature minimum (°F)',

  // Wind (not available on all stations)
  WSPD: 'Wind speed average (mph)',
  WSPDX: 'Wind speed maximum (mph)',
  WDIR: 'Wind direction (degrees)',
} as const;

// Element codes as array for API requests
export const ELEMENT_CODES = Object.keys(SNOTEL_ELEMENTS);

/**
 * Get stations for a specific zone
 */
export function getStationsForZone(zoneId: string): WeatherStation[] {
  const config = WEATHER_STATION_CONFIG.find(z => z.zoneId === zoneId);
  return config?.stations || [];
}

/**
 * Get primary station for a zone
 */
export function getPrimaryStation(zoneId: string): WeatherStation | null {
  const stations = getStationsForZone(zoneId);
  return stations.find(s => s.primary) || stations[0] || null;
}

/**
 * Get all configured zones
 */
export function getConfiguredZones(): string[] {
  return WEATHER_STATION_CONFIG.map(z => z.zoneId);
}
