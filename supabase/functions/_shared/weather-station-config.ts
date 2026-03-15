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

  // ===================================================================
  // NWAC - Northwest Avalanche Center (WA/OR)
  // ===================================================================
  {
    zoneId: 'olympics',
    stations: [
      {
        triplet: '1107:WA:SNTL',
        name: 'Buckinghorse',
        elevation: 4850,
        latitude: 47.7086,
        longitude: -123.45747,
        primary: true,
      },
      {
        triplet: '974:WA:SNTL',
        name: 'Waterhole',
        elevation: 5010,
        latitude: 47.94485,
        longitude: -123.42594,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'west-slopes-north',
    stations: [
      {
        triplet: '1319:WA:SNTL',
        name: 'Decline Creek',
        elevation: 4480,
        latitude: 48.23594,
        longitude: -121.455,
        primary: true,
      },
      {
        triplet: '999:WA:SNTL',
        name: 'Marten Ridge',
        elevation: 3520,
        latitude: 48.76292,
        longitude: -121.69823,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'west-slopes-central',
    stations: [
      {
        triplet: '672:WA:SNTL',
        name: 'Olallie Meadows',
        elevation: 4010,
        latitude: 47.37406,
        longitude: -121.44213,
        primary: true,
      },
      {
        triplet: '898:WA:SNTL',
        name: 'Mount Gardner',
        elevation: 2930,
        latitude: 47.35768,
        longitude: -121.56812,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'west-slopes-south',
    stations: [
      {
        triplet: '692:WA:SNTL',
        name: 'Pigtail Peak',
        elevation: 5800,
        latitude: 46.62153,
        longitude: -121.38643,
        primary: true,
      },
      {
        triplet: '863:WA:SNTL',
        name: 'White Pass E.S.',
        elevation: 4440,
        latitude: 46.64142,
        longitude: -121.38153,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'stevens-pass',
    stations: [
      {
        triplet: '791:WA:SNTL',
        name: 'Stevens Pass',
        elevation: 3940,
        latitude: 47.74607,
        longitude: -121.09288,
        primary: true,
      },
      {
        triplet: '478:WA:SNTL',
        name: 'Fish Lake',
        elevation: 3440,
        latitude: 47.53565,
        longitude: -121.08553,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'snoqualmie-pass',
    stations: [
      {
        triplet: '672:WA:SNTL',
        name: 'Olallie Meadows',
        elevation: 4010,
        latitude: 47.37406,
        longitude: -121.44213,
        primary: true,
      },
      {
        triplet: '788:WA:SNTL',
        name: 'Stampede Pass',
        elevation: 3850,
        latitude: 47.27427,
        longitude: -121.34162,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'east-slopes-north',
    stations: [
      {
        triplet: '711:WA:SNTL',
        name: 'Rainy Pass',
        elevation: 4880,
        latitude: 48.51865,
        longitude: -120.7358,
        primary: true,
      },
      {
        triplet: '515:WA:SNTL',
        name: 'Harts Pass',
        elevation: 6490,
        latitude: 48.72047,
        longitude: -120.6586,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'east-slopes-central',
    stations: [
      {
        triplet: '352:WA:SNTL',
        name: 'Blewett Pass',
        elevation: 4240,
        latitude: 47.35037,
        longitude: -120.6796,
        primary: true,
      },
      {
        triplet: '507:WA:SNTL',
        name: 'Grouse Camp',
        elevation: 5390,
        latitude: 47.28107,
        longitude: -120.48771,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'east-slopes-south',
    stations: [
      {
        triplet: '502:WA:SNTL',
        name: 'Green Lake',
        elevation: 5920,
        latitude: 46.54741,
        longitude: -121.17093,
        primary: true,
      },
      {
        triplet: '599:WA:SNTL',
        name: 'Lost Horse',
        elevation: 5100,
        latitude: 46.35754,
        longitude: -121.0809,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'mt-hood',
    stations: [
      {
        triplet: '651:OR:SNTL',
        name: 'Mt Hood Test Site',
        elevation: 5380,
        latitude: 45.32097,
        longitude: -121.7158,
        primary: true,
      },
      {
        triplet: '712:OR:SNTL',
        name: 'Red Hill',
        elevation: 4410,
        latitude: 45.4643,
        longitude: -121.70428,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // COAA - Central Oregon Avalanche Association (OR)
  // ===================================================================
  {
    zoneId: 'central-cascades',
    stations: [
      {
        triplet: '815:OR:SNTL',
        name: 'Three Creeks Meadow',
        elevation: 5680,
        latitude: 44.14425,
        longitude: -121.64095,
        primary: true,
      },
      {
        triplet: '619:OR:SNTL',
        name: 'Mckenzie',
        elevation: 4770,
        latitude: 44.2103,
        longitude: -121.87292,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'newberry',
    stations: [
      {
        triplet: '815:OR:SNTL',
        name: 'Three Creeks Meadow',
        elevation: 5680,
        latitude: 44.14425,
        longitude: -121.64095,
        primary: true,
      },
      {
        triplet: '545:OR:SNTL',
        name: 'Irish Taylor',
        elevation: 5540,
        latitude: 43.80368,
        longitude: -121.94793,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // WAC - Wallowa Avalanche Center (OR)
  // ===================================================================
  {
    zoneId: 'northern-wallowas',
    stations: [
      {
        triplet: '653:OR:SNTL',
        name: 'Mt. Howard',
        elevation: 7840,
        latitude: 45.26514,
        longitude: -117.17377,
        primary: true,
      },
      {
        triplet: '302:OR:SNTL',
        name: 'Aneroid Lake #2',
        elevation: 7430,
        latitude: 45.21332,
        longitude: -117.19255,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'southern-wallowas',
    stations: [
      {
        triplet: '736:OR:SNTL',
        name: 'Schneider Meadows',
        elevation: 5400,
        latitude: 45.00107,
        longitude: -117.16522,
        primary: true,
      },
      {
        triplet: '812:OR:SNTL',
        name: 'Taylor Green',
        elevation: 5730,
        latitude: 45.07707,
        longitude: -117.55067,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'elkhorns',
    stations: [
      {
        triplet: '494:OR:SNTL',
        name: 'Gold Center',
        elevation: 5400,
        latitude: 44.7638,
        longitude: -118.3117,
        primary: true,
      },
      {
        triplet: '361:OR:SNTL',
        name: 'Bourne',
        elevation: 5850,
        latitude: 44.83052,
        longitude: -118.18787,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'blues',
    stations: [
      {
        triplet: '821:OR:SNTL',
        name: 'Tipton',
        elevation: 5150,
        latitude: 44.65567,
        longitude: -118.42617,
        primary: true,
      },
      {
        triplet: '357:OR:SNTL',
        name: 'Blue Mountain Spring',
        elevation: 5880,
        latitude: 44.24767,
        longitude: -118.51722,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // SOAIX - Southern Oregon Avalanche Information Exchange (OR)
  // ===================================================================
  {
    zoneId: 'southern-oregon',
    stations: [
      {
        triplet: '406:OR:SNTL',
        name: 'Cold Springs Camp',
        elevation: 5940,
        latitude: 42.53305,
        longitude: -122.17683,
        primary: true,
      },
      {
        triplet: '483:OR:SNTL',
        name: 'Fourmile Lake',
        elevation: 5970,
        latitude: 42.43933,
        longitude: -122.2288,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // SAC - Sierra Avalanche Center (CA)
  // ===================================================================
  {
    zoneId: 'central-sierra-nevada',
    stations: [
      {
        triplet: '428:CA:SNTL',
        name: 'Css Lab',
        elevation: 6890,
        latitude: 39.32565,
        longitude: -120.36807,
        primary: true,
      },
      {
        triplet: '784:CA:SNTL',
        name: 'Palisades Tahoe',
        elevation: 8010,
        latitude: 39.18986,
        longitude: -120.26576,
        primary: true,
      },
      {
        triplet: '541:CA:SNTL',
        name: 'Independence Lake',
        elevation: 8340,
        latitude: 39.42752,
        longitude: -120.31342,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // ESAC - Eastern Sierra Avalanche Center (CA)
  // ===================================================================
  {
    zoneId: 'eastside-region',
    stations: [
      {
        triplet: '846:CA:SNTL',
        name: 'Virginia Lakes Ridge',
        elevation: 9400,
        latitude: 38.07298,
        longitude: -119.23433,
        primary: true,
      },
      {
        triplet: '1317:CA:SNTL',
        name: 'Willow Flat CA',
        elevation: 8220,
        latitude: 38.27203,
        longitude: -119.45124,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // BAC - Bridgeport Avalanche Center (CA)
  // ===================================================================
  {
    zoneId: 'bridgeport',
    stations: [
      {
        triplet: '587:CA:SNTL',
        name: 'Lobdell Lake',
        elevation: 9260,
        latitude: 38.43745,
        longitude: -119.36572,
        primary: true,
      },
      {
        triplet: '846:CA:SNTL',
        name: 'Virginia Lakes Ridge',
        elevation: 9400,
        latitude: 38.07298,
        longitude: -119.23433,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // MSAC - Mount Shasta Avalanche Center (CA)
  // Note: No SNTL stations on Mt Shasta itself; using nearest OR stations
  // ===================================================================
  {
    zoneId: 'mount-shasta',
    stations: [
      {
        triplet: '341:OR:SNTL',
        name: 'Big Red Mountain',
        elevation: 6060,
        latitude: 42.05257,
        longitude: -122.85487,
        primary: true,
      },
      {
        triplet: '1158:OR:SNTL',
        name: 'Howard Prairie',
        elevation: 4580,
        latitude: 42.215,
        longitude: -122.3713,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // SNFAC - Sawtooth National Forest Avalanche Center (ID)
  // ===================================================================
  {
    zoneId: 'banner-summit',
    stations: [
      {
        triplet: '312:ID:SNTL',
        name: 'Banner Summit',
        elevation: 7040,
        latitude: 44.30342,
        longitude: -115.23447,
        primary: true,
      },
      {
        triplet: '550:ID:SNTL',
        name: 'Jackson Peak',
        elevation: 7060,
        latitude: 44.05092,
        longitude: -115.44322,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'galena-summit-eastern-mtns',
    stations: [
      {
        triplet: '490:ID:SNTL',
        name: 'Galena Summit',
        elevation: 8790,
        latitude: 43.87497,
        longitude: -114.71363,
        primary: true,
      },
      {
        triplet: '489:ID:SNTL',
        name: 'Galena',
        elevation: 7470,
        latitude: 43.87722,
        longitude: -114.6725,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'sawtooth-western-smoky-mtns',
    stations: [
      {
        triplet: '845:ID:SNTL',
        name: 'Vienna Mine',
        elevation: 8930,
        latitude: 43.79942,
        longitude: -114.85273,
        primary: true,
      },
      {
        triplet: '306:ID:SNTL',
        name: 'Atlanta Summit',
        elevation: 7570,
        latitude: 43.7569,
        longitude: -115.23907,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'soldier-wood-river-valley-mtns',
    stations: [
      {
        triplet: '450:ID:SNTL',
        name: 'Dollarhide Summit',
        elevation: 8390,
        latitude: 43.6025,
        longitude: -114.67417,
        primary: true,
      },
      {
        triplet: '769:ID:SNTL',
        name: 'Soldier R.S.',
        elevation: 5780,
        latitude: 43.48407,
        longitude: -114.82692,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // PAC - Payette Avalanche Center (ID)
  // ===================================================================
  {
    zoneId: 'salmon-river-mountains',
    stations: [
      {
        triplet: '439:ID:SNTL',
        name: 'Deadwood Summit',
        elevation: 6990,
        latitude: 44.54492,
        longitude: -115.56386,
        primary: true,
      },
      {
        triplet: '338:ID:SNTL',
        name: 'Big Creek Summit',
        elevation: 6550,
        latitude: 44.62621,
        longitude: -115.79561,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'west-mountains',
    stations: [
      {
        triplet: '338:ID:SNTL',
        name: 'Big Creek Summit',
        elevation: 6550,
        latitude: 44.62621,
        longitude: -115.79561,
        primary: true,
      },
      {
        triplet: '979:ID:SNTL',
        name: 'Van Wyck',
        elevation: 4960,
        latitude: 44.37665,
        longitude: -116.3366,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // IPAC - Idaho Panhandle Avalanche Center (ID/MT)
  // ===================================================================
  {
    zoneId: 'selkirk-mountains',
    stations: [
      {
        triplet: '738:ID:SNTL',
        name: 'Schweitzer Basin',
        elevation: 6090,
        latitude: 48.37428,
        longitude: -116.63917,
        primary: true,
      },
      {
        triplet: '1053:ID:SNTL',
        name: 'Myrtle Creek',
        elevation: 3540,
        latitude: 48.72263,
        longitude: -116.46312,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'west-cabinet-mountains',
    stations: [
      {
        triplet: '932:MT:SNTL',
        name: 'Poorman Creek',
        elevation: 5050,
        latitude: 48.12632,
        longitude: -115.6234,
        primary: true,
      },
      {
        triplet: '1312:MT:SNTL',
        name: 'Chicago Ridge',
        elevation: 5700,
        latitude: 48.06224,
        longitude: -115.69748,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'east-cabinet-mountains',
    stations: [
      {
        triplet: '1312:MT:SNTL',
        name: 'Chicago Ridge',
        elevation: 5700,
        latitude: 48.06224,
        longitude: -115.69748,
        primary: true,
      },
      {
        triplet: '932:MT:SNTL',
        name: 'Poorman Creek',
        elevation: 5050,
        latitude: 48.12632,
        longitude: -115.6234,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'silver-valley-bitterroot-mountains',
    stations: [
      {
        triplet: '803:ID:SNTL',
        name: 'Sunset',
        elevation: 5570,
        latitude: 47.55545,
        longitude: -115.82422,
        primary: true,
      },
      {
        triplet: '594:ID:SNTL',
        name: 'Lookout',
        elevation: 5180,
        latitude: 47.45749,
        longitude: -115.70457,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'purcell-mountains',
    stations: [
      {
        triplet: '311:MT:SNTL',
        name: 'Banfield Mountain',
        elevation: 5580,
        latitude: 48.5712,
        longitude: -115.44573,
        primary: true,
      },
      {
        triplet: '932:MT:SNTL',
        name: 'Poorman Creek',
        elevation: 5050,
        latitude: 48.12632,
        longitude: -115.6234,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // GNFAC - Gallatin National Forest Avalanche Center (MT)
  // ===================================================================
  {
    zoneId: 'bridger-range',
    stations: [
      {
        triplet: '929:MT:SNTL',
        name: 'Sacajawea',
        elevation: 6610,
        latitude: 45.87395,
        longitude: -110.92783,
        primary: true,
      },
      {
        triplet: '365:MT:SNTL',
        name: 'Brackett Creek',
        elevation: 7370,
        latitude: 45.89107,
        longitude: -110.93851,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'northern-gallatin-range',
    stations: [
      {
        triplet: '578:MT:SNTL',
        name: 'Lick Creek',
        elevation: 6880,
        latitude: 45.5041,
        longitude: -110.96625,
        primary: true,
      },
      {
        triplet: '754:MT:SNTL',
        name: 'Shower Falls',
        elevation: 8060,
        latitude: 45.40125,
        longitude: -110.95758,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'southern-gallatin-range',
    stations: [
      {
        triplet: '590:MT:SNTL',
        name: 'Lone Mountain',
        elevation: 8820,
        latitude: 45.27412,
        longitude: -111.42692,
        primary: true,
      },
      {
        triplet: '754:MT:SNTL',
        name: 'Shower Falls',
        elevation: 8060,
        latitude: 45.40125,
        longitude: -110.95758,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'northern-madison-range',
    stations: [
      {
        triplet: '590:MT:SNTL',
        name: 'Lone Mountain',
        elevation: 8820,
        latitude: 45.27412,
        longitude: -111.42692,
        primary: true,
      },
      {
        triplet: '328:MT:SNTL',
        name: 'Beaver Creek',
        elevation: 7820,
        latitude: 44.94966,
        longitude: -111.35852,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'southern-madison-range',
    stations: [
      {
        triplet: '328:MT:SNTL',
        name: 'Beaver Creek',
        elevation: 7820,
        latitude: 44.94966,
        longitude: -111.35852,
        primary: true,
      },
      {
        triplet: '385:MT:SNTL',
        name: 'Carrot Basin',
        elevation: 9200,
        latitude: 44.96192,
        longitude: -111.29403,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'lionhead-area',
    stations: [
      {
        triplet: '858:MT:SNTL',
        name: 'Whiskey Creek',
        elevation: 6790,
        latitude: 44.61088,
        longitude: -111.14998,
        primary: true,
      },
      {
        triplet: '924:MT:SNTL',
        name: 'West Yellowstone',
        elevation: 6680,
        latitude: 44.65866,
        longitude: -111.09199,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'island-park',
    stations: [
      {
        triplet: '546:ID:SNTL',
        name: 'Island Park',
        elevation: 6300,
        latitude: 44.4203,
        longitude: -111.38512,
        primary: true,
      },
      {
        triplet: '860:ID:SNTL',
        name: 'White Elephant',
        elevation: 7670,
        latitude: 44.53267,
        longitude: -111.41085,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'cooke-city',
    stations: [
      {
        triplet: '862:MT:SNTL',
        name: 'White Mill',
        elevation: 8730,
        latitude: 45.04575,
        longitude: -109.90987,
        primary: true,
      },
      {
        triplet: '480:MT:SNTL',
        name: 'Fisher Creek',
        elevation: 9110,
        latitude: 45.06235,
        longitude: -109.94488,
        primary: true,
      },
      {
        triplet: '670:MT:SNTL',
        name: 'Northeast Entrance',
        elevation: 7420,
        latitude: 45.00568,
        longitude: -110.01411,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // FAC - Flathead Avalanche Center (MT)
  // ===================================================================
  {
    zoneId: 'whitefish-range',
    stations: [
      {
        triplet: '1311:MT:SNTL',
        name: 'Stryker Basin',
        elevation: 6200,
        latitude: 48.68005,
        longitude: -114.66365,
        primary: true,
      },
      {
        triplet: '469:MT:SNTL',
        name: 'Emery Creek',
        elevation: 4340,
        latitude: 48.43412,
        longitude: -113.93725,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'swan-range',
    stations: [
      {
        triplet: '562:MT:SNTL',
        name: 'Kraft Creek',
        elevation: 4770,
        latitude: 47.42749,
        longitude: -113.77515,
        primary: true,
      },
      {
        triplet: '646:MT:SNTL',
        name: 'Moss Peak',
        elevation: 6760,
        latitude: 47.68497,
        longitude: -113.96239,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'flathead-range-glacier-np',
    stations: [
      {
        triplet: '693:MT:SNTL',
        name: 'Pike Creek',
        elevation: 5930,
        latitude: 48.30305,
        longitude: -113.32868,
        primary: true,
      },
      {
        triplet: '613:MT:SNTL',
        name: 'Many Glacier',
        elevation: 4930,
        latitude: 48.79698,
        longitude: -113.6705,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // WCMAC - West Central Montana Avalanche Center (MT)
  // ===================================================================
  {
    zoneId: 'seeley-lake',
    stations: [
      {
        triplet: '667:MT:SNTL',
        name: 'North Fork Jocko',
        elevation: 6110,
        latitude: 47.27258,
        longitude: -113.75631,
        primary: true,
      },
      {
        triplet: '562:MT:SNTL',
        name: 'Kraft Creek',
        elevation: 4770,
        latitude: 47.42749,
        longitude: -113.77515,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'rattlesnake',
    stations: [
      {
        triplet: '901:MT:SNTL',
        name: 'Stuart Mountain',
        elevation: 7270,
        latitude: 46.99521,
        longitude: -113.92667,
        primary: true,
      },
      {
        triplet: '667:MT:SNTL',
        name: 'North Fork Jocko',
        elevation: 6110,
        latitude: 47.27258,
        longitude: -113.75631,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'bitterroot',
    stations: [
      {
        triplet: '588:ID:SNTL',
        name: 'Lolo Pass',
        elevation: 5280,
        latitude: 46.63448,
        longitude: -114.58072,
        primary: true,
      },
      {
        triplet: '735:ID:SNTL',
        name: 'Savage Pass',
        elevation: 6170,
        latitude: 46.46633,
        longitude: -114.63333,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // BTAC - Bridger-Teton Avalanche Center (WY)
  // ===================================================================
  {
    zoneId: 'tetons',
    stations: [
      {
        triplet: '1082:WY:SNTL',
        name: 'Grand Targhee',
        elevation: 9260,
        latitude: 43.77933,
        longitude: -110.92783,
        primary: true,
      },
      {
        triplet: '689:WY:SNTL',
        name: 'Phillips Bench',
        elevation: 8170,
        latitude: 43.51687,
        longitude: -110.91258,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'togwotee-pass',
    stations: [
      {
        triplet: '822:WY:SNTL',
        name: 'Togwotee Pass',
        elevation: 9590,
        latitude: 43.74902,
        longitude: -110.0578,
        primary: true,
      },
      {
        triplet: '878:WY:SNTL',
        name: 'Younts Peak',
        elevation: 8340,
        latitude: 43.93225,
        longitude: -109.81775,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'snake-river-range',
    stations: [
      {
        triplet: '689:WY:SNTL',
        name: 'Phillips Bench',
        elevation: 8170,
        latitude: 43.51687,
        longitude: -110.91258,
        primary: true,
      },
      {
        triplet: '695:ID:SNTL',
        name: 'Pine Creek Pass',
        elevation: 6710,
        latitude: 43.56998,
        longitude: -111.21157,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'salt-river-wyoming-ranges',
    stations: [
      {
        triplet: '868:WY:SNTL',
        name: 'Willow Creek',
        elevation: 8060,
        latitude: 42.81513,
        longitude: -110.83515,
        primary: true,
      },
      {
        triplet: '831:WY:SNTL',
        name: 'Triple Peak',
        elevation: 8520,
        latitude: 42.76393,
        longitude: -110.5914,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // EWYAIX - Eastern Wyoming Avalanche Info Exchange (WY)
  // ===================================================================
  {
    zoneId: 'big-horns',
    stations: [
      {
        triplet: '402:WY:SNTL',
        name: 'Cloud Peak Reservoir',
        elevation: 9830,
        latitude: 44.40328,
        longitude: -107.06074,
        primary: true,
      },
      {
        triplet: '1131:WY:SNTL',
        name: 'Little Goose',
        elevation: 8560,
        latitude: 44.54315,
        longitude: -107.17865,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'snowy-range',
    stations: [
      {
        triplet: '668:WY:SNTL',
        name: 'North French Creek',
        elevation: 10150,
        latitude: 41.33087,
        longitude: -106.37558,
        primary: true,
      },
      {
        triplet: '367:WY:SNTL',
        name: 'Brooklyn Lake',
        elevation: 10250,
        latitude: 41.36038,
        longitude: -106.23038,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'sierra-madre',
    stations: [
      {
        triplet: '859:WY:SNTL',
        name: 'Whiskey Park',
        elevation: 8950,
        latitude: 41.00368,
        longitude: -106.90795,
        primary: true,
      },
      {
        triplet: '1119:WY:SNTL',
        name: 'Blackhall Mtn',
        elevation: 9830,
        latitude: 41.05623,
        longitude: -106.714,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // UAC - Utah Avalanche Center (UT)
  // ===================================================================
  {
    zoneId: 'logan',
    stations: [
      {
        triplet: '1098:UT:SNTL',
        name: 'Usu Doc Daniel',
        elevation: 8610,
        latitude: 41.86425,
        longitude: -111.50603,
        primary: true,
      },
      {
        triplet: '823:UT:SNTL',
        name: 'Tony Grove Lake',
        elevation: 8450,
        latitude: 41.89833,
        longitude: -111.62957,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'ogden',
    stations: [
      {
        triplet: '1300:UT:SNTL',
        name: 'Powder Mountain',
        elevation: 8490,
        latitude: 41.37428,
        longitude: -111.76673,
        primary: true,
      },
      {
        triplet: '533:UT:SNTL',
        name: 'Horse Ridge',
        elevation: 8210,
        latitude: 41.31372,
        longitude: -111.44624,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'salt-lake',
    stations: [
      {
        triplet: '366:UT:SNTL',
        name: 'Brighton',
        elevation: 8790,
        latitude: 40.59936,
        longitude: -111.58167,
        primary: true,
      },
      {
        triplet: '1308:UT:SNTL',
        name: 'Atwater',
        elevation: 8750,
        latitude: 40.59124,
        longitude: -111.63775,
        primary: true,
      },
      {
        triplet: '766:UT:SNTL',
        name: 'Snowbird',
        elevation: 9170,
        latitude: 40.56914,
        longitude: -111.65852,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'provo',
    stations: [
      {
        triplet: '820:UT:SNTL',
        name: 'Timpanogos Divide',
        elevation: 8180,
        latitude: 40.42817,
        longitude: -111.61633,
        primary: true,
      },
      {
        triplet: '1039:UT:SNTL',
        name: 'Cascade Mountain',
        elevation: 7750,
        latitude: 40.283,
        longitude: -111.60992,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'uintas',
    stations: [
      {
        triplet: '481:UT:SNTL',
        name: 'Five Points Lake',
        elevation: 10920,
        latitude: 40.71785,
        longitude: -110.46721,
        primary: true,
      },
      {
        triplet: '513:UT:SNTL',
        name: 'Lakefork Basin',
        elevation: 10890,
        latitude: 40.73785,
        longitude: -110.62121,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'skyline',
    stations: [
      {
        triplet: '714:UT:SNTL',
        name: 'Red Pine Ridge',
        elevation: 8990,
        latitude: 39.45197,
        longitude: -111.27221,
        primary: true,
      },
      {
        triplet: '1227:UT:SNTL',
        name: 'Upper Joes Valley',
        elevation: 8600,
        latitude: 39.4155,
        longitude: -111.2491,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'moab',
    stations: [
      {
        triplet: '572:UT:SNTL',
        name: 'Lasal Mountain',
        elevation: 9580,
        latitude: 38.48226,
        longitude: -109.27198,
        primary: true,
      },
      {
        triplet: '1304:UT:SNTL',
        name: 'Gold Basin',
        elevation: 10070,
        latitude: 38.46516,
        longitude: -109.26332,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'abajos',
    stations: [
      {
        triplet: '383:UT:SNTL',
        name: 'Camp Jackson',
        elevation: 8840,
        latitude: 37.81333,
        longitude: -109.48723,
        primary: true,
      },
      {
        triplet: '1153:UT:SNTL',
        name: 'Buckboard Flat',
        elevation: 8920,
        latitude: 37.86943,
        longitude: -109.44717,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'southwest',
    stations: [
      {
        triplet: '593:UT:SNTL',
        name: 'Long Valley Jct',
        elevation: 7460,
        latitude: 37.48756,
        longitude: -112.51458,
        primary: true,
      },
      {
        triplet: '907:UT:SNTL',
        name: 'Agua Canyon',
        elevation: 8890,
        latitude: 37.52217,
        longitude: -112.27118,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // CAIC - Colorado Avalanche Information Center (CO)
  // ===================================================================
  {
    zoneId: 'caic-front-range-north',
    stations: [
      {
        triplet: '322:CO:SNTL',
        name: 'Bear Lake',
        elevation: 9490,
        latitude: 40.31176,
        longitude: -105.6467,
        primary: true,
      },
      {
        triplet: '870:CO:SNTL',
        name: 'Willow Park',
        elevation: 10710,
        latitude: 40.43397,
        longitude: -105.73588,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'caic-front-range-boulder',
    stations: [
      {
        triplet: '838:CO:SNTL',
        name: 'University Camp',
        elevation: 10330,
        latitude: 40.03307,
        longitude: -105.57562,
        primary: true,
      },
      {
        triplet: '663:CO:SNTL',
        name: 'Niwot',
        elevation: 9940,
        latitude: 40.03581,
        longitude: -105.5452,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'caic-front-range-south',
    stations: [
      {
        triplet: '1057:CO:SNTL',
        name: 'Glen Cove',
        elevation: 11410,
        latitude: 38.87602,
        longitude: -105.07605,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'caic-vail-summit-county',
    stations: [
      {
        triplet: '415:CO:SNTL',
        name: 'Copper Mountain',
        elevation: 10500,
        latitude: 39.48917,
        longitude: -106.17154,
        primary: true,
      },
      {
        triplet: '802:CO:SNTL',
        name: 'Summit Ranch',
        elevation: 9350,
        latitude: 39.71803,
        longitude: -106.1577,
        primary: true,
      },
      {
        triplet: '602:CO:SNTL',
        name: 'Loveland Basin',
        elevation: 11410,
        latitude: 39.67428,
        longitude: -105.90264,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'caic-elk-mountains',
    stations: [
      {
        triplet: '1326:CO:SNTL',
        name: 'Castle Peak',
        elevation: 11510,
        latitude: 39.00074,
        longitude: -106.83912,
        primary: true,
      },
      {
        triplet: '542:CO:SNTL',
        name: 'Independence Pass',
        elevation: 10570,
        latitude: 39.07543,
        longitude: -106.61154,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'caic-sawatch-range',
    stations: [
      {
        triplet: '1100:CO:SNTL',
        name: 'Saint Elmo',
        elevation: 10420,
        latitude: 38.69985,
        longitude: -106.36805,
        primary: true,
      },
      {
        triplet: '680:CO:SNTL',
        name: 'Park Cone',
        elevation: 9600,
        latitude: 38.81982,
        longitude: -106.58962,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'caic-grand-mesa-west-elk',
    stations: [
      {
        triplet: '675:CO:SNTL',
        name: 'Overland Res.',
        elevation: 9890,
        latitude: 39.09035,
        longitude: -107.63583,
        primary: true,
      },
      {
        triplet: '618:CO:SNTL',
        name: 'Mc Clure Pass',
        elevation: 8760,
        latitude: 39.12899,
        longitude: -107.28834,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'caic-park-range',
    stations: [
      {
        triplet: '825:CO:SNTL',
        name: 'Tower',
        elevation: 10610,
        latitude: 40.5374,
        longitude: -106.67655,
        primary: true,
      },
      {
        triplet: '457:CO:SNTL',
        name: 'Dry Lake',
        elevation: 8240,
        latitude: 40.5337,
        longitude: -106.7814,
        primary: true,
      },
      {
        triplet: '709:CO:SNTL',
        name: 'Rabbit Ears',
        elevation: 9390,
        latitude: 40.36735,
        longitude: -106.74118,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'caic-northern-san-juan',
    stations: [
      {
        triplet: '713:CO:SNTL',
        name: 'Red Mountain Pass',
        elevation: 11060,
        latitude: 37.89168,
        longitude: -107.71389,
        primary: true,
      },
      {
        triplet: '632:CO:SNTL',
        name: 'Molas Lake',
        elevation: 10610,
        latitude: 37.74929,
        longitude: -107.68933,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'caic-southern-san-juan',
    stations: [
      {
        triplet: '874:CO:SNTL',
        name: 'Wolf Creek Summit',
        elevation: 10930,
        latitude: 37.47903,
        longitude: -106.80234,
        primary: true,
      },
      {
        triplet: '840:CO:SNTL',
        name: 'Upper San Juan',
        elevation: 10140,
        latitude: 37.48563,
        longitude: -106.83528,
        primary: true,
      },
    ]
  },
  {
    zoneId: 'caic-sangre-de-cristo',
    stations: [
      {
        triplet: '914:CO:SNTL',
        name: 'Medano Pass',
        elevation: 9650,
        latitude: 37.85192,
        longitude: -105.43666,
        primary: true,
      },
      {
        triplet: '773:CO:SNTL',
        name: 'South Colony',
        elevation: 10790,
        latitude: 37.96647,
        longitude: -105.53671,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // TAC - Taos Avalanche Center (NM)
  // ===================================================================
  {
    zoneId: 'northern-new-mexico',
    stations: [
      {
        triplet: '1168:NM:SNTL',
        name: 'Taos Powderhorn',
        elevation: 11020,
        latitude: 36.58195,
        longitude: -105.45617,
        primary: true,
      },
      {
        triplet: '1307:NM:SNTL',
        name: 'Taos Pueblo',
        elevation: 10990,
        latitude: 36.54099,
        longitude: -105.35944,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // KPAC - Kachina Peaks Avalanche Center (AZ)
  // ===================================================================
  {
    zoneId: 'san-francisco-peaks',
    stations: [
      {
        triplet: '927:AZ:SNTL',
        name: 'Snowslide Canyon',
        elevation: 9720,
        latitude: 35.34179,
        longitude: -111.65084,
        primary: true,
      },
      {
        triplet: '1121:AZ:SNTL',
        name: 'Fort Valley',
        elevation: 7360,
        latitude: 35.26773,
        longitude: -111.74479,
        primary: true,
      },
    ]
  },

  // ===================================================================
  // MWAC - Mount Washington Avalanche Center (NH)
  // Note: No SNTL stations exist in New England. Nearest SNTL is in
  // South Dakota (~1600mi). This zone has no SNOTEL coverage.
  // ===================================================================
  {
    zoneId: 'presidential-range',
    stations: []
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
