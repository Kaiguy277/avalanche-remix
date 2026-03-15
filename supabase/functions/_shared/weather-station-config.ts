/**
 * Weather Station Configuration for Avalanche Zones
 * Maps Synoptic weather stations to avalanche forecast zones
 */

export interface WeatherStation {
  triplet: string;      // Synoptic STID (station identifier)
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

// Synoptic station mappings for each avalanche zone
export const WEATHER_STATION_CONFIG: ZoneStationConfig[] = [
  {
    zoneId: 'turnagain-girdwood',
    stations: [
      {
        triplet: 'HILA2',
        name: 'ANCHORAGE HILLSIDE',
        elevation: 2080,
        latitude: 61.11312,
        longitude: -149.6835,
        primary: true,
      },
      {
        triplet: 'TUGA2',
        name: 'TURNAGAIN PASS',
        elevation: 1880,
        latitude: 60.78043,
        longitude: -149.18325,
        primary: true,
      },
      {
        triplet: 'SUUA2',
        name: 'SUMMIT CREEK',
        elevation: 1400,
        latitude: 60.61713,
        longitude: -149.53128,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'summit',
    stations: [
      {
        triplet: 'TUGA2',
        name: 'TURNAGAIN PASS',
        elevation: 1880,
        latitude: 60.78043,
        longitude: -149.18325,
        primary: true,
      },
      {
        triplet: 'SUUA2',
        name: 'SUMMIT CREEK',
        elevation: 1400,
        latitude: 60.61713,
        longitude: -149.53128,
        primary: true,
      },
      {
        triplet: 'SRPA2',
        name: 'Seward Highway @ Turnagain Pass MP 69.9',
        elevation: 1033,
        latitude: 60.8042,
        longitude: -149.18451,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'seward',
    stations: [
      {
        triplet: 'SUUA2',
        name: 'SUMMIT CREEK',
        elevation: 1400,
        latitude: 60.61713,
        longitude: -149.53128,
        primary: true,
      },
      {
        triplet: 'PEDA2',
        name: 'PEDERSEN LAGOON',
        elevation: 625,
        latitude: 59.8944,
        longitude: -149.7307,
        primary: true,
      },
      {
        triplet: 'EXGA2',
        name: 'EXIT GLACIER',
        elevation: 400,
        latitude: 60.19033,
        longitude: -149.62117,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'chugach-state-park',
    stations: [
      {
        triplet: 'MORA2',
        name: 'MORAINE',
        elevation: 2100,
        latitude: 61.37727,
        longitude: -148.99917,
        primary: true,
      },
      {
        triplet: 'HILA2',
        name: 'ANCHORAGE HILLSIDE',
        elevation: 2080,
        latitude: 61.11312,
        longitude: -149.6835,
        primary: true,
      },
      {
        triplet: 'TUGA2',
        name: 'TURNAGAIN PASS',
        elevation: 1880,
        latitude: 60.78043,
        longitude: -149.18325,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'hatcher-pass',
    stations: [
      {
        triplet: 'HATA2',
        name: 'INDEPENDENCE MINE',
        elevation: 3550,
        latitude: 61.79117,
        longitude: -149.27967,
        primary: true,
      },
      {
        triplet: 'FBBA2',
        name: 'FROSTBITE BOTTOM',
        elevation: 2700,
        latitude: 61.75,
        longitude: -149.27,
        primary: true,
      },
      {
        triplet: 'MORA2',
        name: 'MORAINE',
        elevation: 2100,
        latitude: 61.37727,
        longitude: -148.99917,
        primary: true,
      }
    ]
  },
  // Valdez Avalanche Center Zones
  {
    zoneId: 'valdez-maritime',
    stations: [
      {
        triplet: 'NVSA2',
        name: 'Nicks Valley',
        elevation: 4280,
        latitude: 61.16371,
        longitude: -145.64091,
        primary: true,
      },
      {
        triplet: 'UPPA2',
        name: 'UPPER TSAINA RIVER',
        elevation: 1750,
        latitude: 61.19112,
        longitude: -145.64807,
        primary: true,
      },
      {
        triplet: 'RSCA2',
        name: 'Richardson Highway @ Stuart Creek MP 45',
        elevation: 1217,
        latitude: 61.26066,
        longitude: -145.2838,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'valdez-intermountain',
    stations: [
      {
        triplet: 'NVSA2',
        name: 'Nicks Valley',
        elevation: 4280,
        latitude: 61.16371,
        longitude: -145.64091,
        primary: true,
      },
      {
        triplet: 'UPPA2',
        name: 'UPPER TSAINA RIVER',
        elevation: 1750,
        latitude: 61.19112,
        longitude: -145.64807,
        primary: true,
      },
      {
        triplet: 'RSCA2',
        name: 'Richardson Highway @ Stuart Creek MP 45',
        elevation: 1217,
        latitude: 61.26066,
        longitude: -145.2838,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'valdez-continental',
    stations: [
      {
        triplet: 'NVSA2',
        name: 'Nicks Valley',
        elevation: 4280,
        latitude: 61.16371,
        longitude: -145.64091,
        primary: true,
      },
      {
        triplet: 'UPPA2',
        name: 'UPPER TSAINA RIVER',
        elevation: 1750,
        latitude: 61.19112,
        longitude: -145.64807,
        primary: true,
      },
      {
        triplet: 'RSCA2',
        name: 'Richardson Highway @ Stuart Creek MP 45',
        elevation: 1217,
        latitude: 61.26066,
        longitude: -145.2838,
        primary: true,
      }
    ]
  },
  // Eastern Alaska Range Avalanche Center
  {
    zoneId: 'earac-north',
    stations: [
      {
        triplet: 'AGW01',
        name: 'Gulkana Glacier',
        elevation: 5906,
        latitude: 63.3,
        longitude: -145.4,
        primary: true,
      },
      {
        triplet: 'LESA2',
        name: 'LOOK EYRIE',
        elevation: 5040,
        latitude: 63.32192,
        longitude: -145.59656,
        primary: true,
      },
      {
        triplet: 'FLDA2',
        name: 'FIELDING LAKE',
        elevation: 3000,
        latitude: 63.20267,
        longitude: -145.6305,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'earac-south',
    stations: [
      {
        triplet: 'AGW01',
        name: 'Gulkana Glacier',
        elevation: 5906,
        latitude: 63.3,
        longitude: -145.4,
        primary: true,
      },
      {
        triplet: 'LESA2',
        name: 'LOOK EYRIE',
        elevation: 5040,
        latitude: 63.32192,
        longitude: -145.59656,
        primary: true,
      },
      {
        triplet: 'FLDA2',
        name: 'FIELDING LAKE',
        elevation: 3000,
        latitude: 63.20267,
        longitude: -145.6305,
        primary: true,
      }
    ]
  },
  // Coastal Alaska Avalanche Center
  {
    zoneId: 'douglas-island',
    stations: [
      {
        triplet: 'PPSA2',
        name: 'POWDER PATCH EAGLEREST',
        elevation: 2198,
        latitude: 58.262,
        longitude: -134.517,
        primary: true,
      },
      {
        triplet: 'DCSA2',
        name: 'DAVIES CREEK',
        elevation: 2065,
        latitude: 58.7,
        longitude: -134.86,
        primary: true,
      },
      {
        triplet: 'JTMA2',
        name: 'Mount Roberts Tram - Juneau',
        elevation: 1736,
        latitude: 58.2971,
        longitude: -134.386,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'juneau-mainland',
    stations: [
      {
        triplet: 'PPSA2',
        name: 'POWDER PATCH EAGLEREST',
        elevation: 2198,
        latitude: 58.262,
        longitude: -134.517,
        primary: true,
      },
      {
        triplet: 'DCSA2',
        name: 'DAVIES CREEK',
        elevation: 2065,
        latitude: 58.7,
        longitude: -134.86,
        primary: true,
      },
      {
        triplet: 'JTMA2',
        name: 'Mount Roberts Tram - Juneau',
        elevation: 1736,
        latitude: 58.2971,
        longitude: -134.386,
        primary: true,
      }
    ]
  },
  // Haines Avalanche Center
  {
    zoneId: 'haines-lutak',
    stations: [
      {
        triplet: 'TKHA2',
        name: 'Takshanuk Mountains',
        elevation: 4364,
        latitude: 59.3935,
        longitude: -135.80955,
        primary: true,
      },
      {
        triplet: 'RRWA2',
        name: 'RIPINSKI RIDGE WEATHER STATION',
        elevation: 2600,
        latitude: 59.2596,
        longitude: -135.4942,
        primary: true,
      },
      {
        triplet: 'FLOA2',
        name: 'FLOWER MOUNTAIN',
        elevation: 2500,
        latitude: 59.4,
        longitude: -136.2833,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'haines-transitional',
    stations: [
      {
        triplet: 'TKHA2',
        name: 'Takshanuk Mountains',
        elevation: 4364,
        latitude: 59.3935,
        longitude: -135.80955,
        primary: true,
      },
      {
        triplet: 'RRWA2',
        name: 'RIPINSKI RIDGE WEATHER STATION',
        elevation: 2600,
        latitude: 59.2596,
        longitude: -135.4942,
        primary: true,
      },
      {
        triplet: 'FLOA2',
        name: 'FLOWER MOUNTAIN',
        elevation: 2500,
        latitude: 59.4,
        longitude: -136.2833,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'haines-chilkat-pass',
    stations: [
      {
        triplet: 'TKHA2',
        name: 'Takshanuk Mountains',
        elevation: 4364,
        latitude: 59.3935,
        longitude: -135.80955,
        primary: true,
      },
      {
        triplet: 'RRWA2',
        name: 'RIPINSKI RIDGE WEATHER STATION',
        elevation: 2600,
        latitude: 59.2596,
        longitude: -135.4942,
        primary: true,
      },
      {
        triplet: 'FLOA2',
        name: 'FLOWER MOUNTAIN',
        elevation: 2500,
        latitude: 59.4,
        longitude: -136.2833,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // NWAC - Northwest Avalanche Center (WA/OR)
  // ===================================================================
  {
    zoneId: 'olympics',
    stations: [
      {
        triplet: 'HUR53',
        name: 'Hurricane Ridge',
        elevation: 5250,
        latitude: 47.9704,
        longitude: -123.49933,
        primary: true,
      },
      {
        triplet: 'WHSW1',
        name: 'WATERHOLE',
        elevation: 5010,
        latitude: 47.94485,
        longitude: -123.42594,
        primary: true,
      },
      {
        triplet: 'BKHW1',
        name: 'BUCKINGHORSE',
        elevation: 4870,
        latitude: 47.7086,
        longitude: -123.45747,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'west-slopes-north',
    stations: [
      {
        triplet: 'EPSW1',
        name: 'EASY PASS',
        elevation: 5270,
        latitude: 48.85933,
        longitude: -121.43895,
        primary: true,
      },
      {
        triplet: 'MNOW1',
        name: 'MF NOOKSACK',
        elevation: 4970,
        latitude: 48.82453,
        longitude: -121.92951,
        primary: true,
      },
      {
        triplet: 'WCSW1',
        name: 'WELLS CREEK',
        elevation: 4030,
        latitude: 48.8661,
        longitude: -121.78976,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'west-slopes-central',
    stations: [
      {
        triplet: 'MTNW1',
        name: 'QUARTZ MOUNTAIN - SNOW NEAR CLE ELUM 11SW',
        elevation: 5860,
        latitude: 47.06722,
        longitude: -121.07889,
        primary: true,
      },
      {
        triplet: 'SAWW1',
        name: 'SAWMILL RIDGE',
        elevation: 4640,
        latitude: 47.15992,
        longitude: -121.42172,
        primary: true,
      },
      {
        triplet: 'SASW1',
        name: 'SASSE RIDGE',
        elevation: 4340,
        latitude: 47.38485,
        longitude: -121.06323,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'west-slopes-south',
    stations: [
      {
        triplet: 'CAYW1',
        name: 'CAYUSE PASS',
        elevation: 5240,
        latitude: 46.86954,
        longitude: -121.5343,
        primary: true,
      },
      {
        triplet: 'LOHW1',
        name: 'LOST HORSE',
        elevation: 5120,
        latitude: 46.3575,
        longitude: -121.08095,
        primary: true,
      },
      {
        triplet: 'KCHW1',
        name: 'ASSGN20190819',
        elevation: 2326,
        latitude: 46.72944,
        longitude: -121.85639,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'stevens-pass',
    stations: [
      {
        triplet: 'SASW1',
        name: 'SASSE RIDGE',
        elevation: 4340,
        latitude: 47.38485,
        longitude: -121.06323,
        primary: true,
      },
      {
        triplet: 'KUSW1',
        name: 'SKOOKUM CREEK',
        elevation: 3310,
        latitude: 47.68433,
        longitude: -121.61007,
        primary: true,
      },
      {
        triplet: 'CPPW1',
        name: 'COOPER PASS NEAR CLE ELUM 20NW',
        elevation: 3278,
        latitude: 47.46306,
        longitude: -121.21083,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'snoqualmie-pass',
    stations: [
      {
        triplet: 'MTNW1',
        name: 'QUARTZ MOUNTAIN - SNOW NEAR CLE ELUM 11SW',
        elevation: 5860,
        latitude: 47.06722,
        longitude: -121.07889,
        primary: true,
      },
      {
        triplet: 'SAWW1',
        name: 'SAWMILL RIDGE',
        elevation: 4640,
        latitude: 47.15992,
        longitude: -121.42172,
        primary: true,
      },
      {
        triplet: 'SASW1',
        name: 'SASSE RIDGE',
        elevation: 4340,
        latitude: 47.38485,
        longitude: -121.06323,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'east-slopes-north',
    stations: [
      {
        triplet: 'HRPW1',
        name: 'HARTS PASS',
        elevation: 6490,
        latitude: 48.71047,
        longitude: -120.6586,
        primary: true,
      },
      {
        triplet: 'SWSW1',
        name: 'SWAMP CREEK',
        elevation: 3930,
        latitude: 48.57142,
        longitude: -120.78267,
        primary: true,
      },
      {
        triplet: 'NLM34',
        name: 'Newhalem',
        elevation: 3430,
        latitude: 48.68561,
        longitude: -121.25236,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'east-slopes-central',
    stations: [
      {
        triplet: 'MTNW1',
        name: 'QUARTZ MOUNTAIN - SNOW NEAR CLE ELUM 11SW',
        elevation: 5860,
        latitude: 47.06722,
        longitude: -121.07889,
        primary: true,
      },
      {
        triplet: 'TRGW1',
        name: 'TROUGH',
        elevation: 5480,
        latitude: 47.23328,
        longitude: -120.29412,
        primary: true,
      },
      {
        triplet: 'GRCW1',
        name: 'GROUSE CAMP',
        elevation: 5390,
        latitude: 47.28107,
        longitude: -120.48771,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'east-slopes-south',
    stations: [
      {
        triplet: 'WPS58',
        name: 'White Pass Upper',
        elevation: 5800,
        latitude: 46.62077,
        longitude: -121.38737,
        primary: true,
      },
      {
        triplet: 'LOHW1',
        name: 'LOST HORSE',
        elevation: 5120,
        latitude: 46.3575,
        longitude: -121.08095,
        primary: true,
      },
      {
        triplet: 'OHAW1',
        name: 'OHANAPECOSH',
        elevation: 1950,
        latitude: 46.73111,
        longitude: -121.57111,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'mt-hood',
    stations: [
      {
        triplet: 'TIM59',
        name: 'Timberline Lodge',
        elevation: 5800,
        latitude: 45.32997,
        longitude: -121.71133,
        primary: true,
      },
      {
        triplet: 'GVT50',
        name: 'Skibowl Summit',
        elevation: 5010,
        latitude: 45.28857,
        longitude: -121.78275,
        primary: true,
      },
      {
        triplet: 'FFMO3',
        name: 'FIFTEENMILE',
        elevation: 5970,
        latitude: 45.35,
        longitude: -121.53,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // COAA - Central Oregon Avalanche Association (OR)
  // ===================================================================
  {
    zoneId: 'central-cascades',
    stations: [
      {
        triplet: 'BEDO3',
        name: 'IRISH TAYLOR',
        elevation: 5540,
        latitude: 43.80368,
        longitude: -121.94793,
        primary: true,
      },
      {
        triplet: 'TCMO3',
        name: 'THREE CREEKS MEADOW',
        elevation: 5690,
        latitude: 44.14425,
        longitude: -121.64095,
        primary: true,
      },
      {
        triplet: 'RORO3',
        name: 'ROARING RIVER',
        elevation: 4950,
        latitude: 43.90098,
        longitude: -122.03063,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'newberry',
    stations: [
      {
        triplet: 'BEDO3',
        name: 'IRISH TAYLOR',
        elevation: 5540,
        latitude: 43.80368,
        longitude: -121.94793,
        primary: true,
      },
      {
        triplet: 'TCMO3',
        name: 'THREE CREEKS MEADOW',
        elevation: 5690,
        latitude: 44.14425,
        longitude: -121.64095,
        primary: true,
      },
      {
        triplet: 'CSTO3',
        name: 'CASCADE SUMMIT',
        elevation: 5100,
        latitude: 43.59042,
        longitude: -122.0601,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // WAC - Wallowa Avalanche Center (OR)
  // ===================================================================
  {
    zoneId: 'northern-wallowas',
    stations: [
      {
        triplet: 'TYLO3',
        name: 'TAYLOR GREEN',
        elevation: 5740,
        latitude: 45.07707,
        longitude: -117.55067,
        primary: true,
      },
      {
        triplet: 'MHWO3',
        name: 'MT. HOWARD',
        elevation: 7910,
        latitude: 45.26522,
        longitude: -117.17373,
        primary: true,
      },
      {
        triplet: 'ANRO3',
        name: 'ANEROID LAKE #2',
        elevation: 7400,
        latitude: 45.21328,
        longitude: -117.19258,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'southern-wallowas',
    stations: [
      {
        triplet: 'TYLO3',
        name: 'TAYLOR GREEN',
        elevation: 5740,
        latitude: 45.07707,
        longitude: -117.55067,
        primary: true,
      },
      {
        triplet: 'MHWO3',
        name: 'MT. HOWARD',
        elevation: 7910,
        latitude: 45.26522,
        longitude: -117.17373,
        primary: true,
      },
      {
        triplet: 'ANRO3',
        name: 'ANEROID LAKE #2',
        elevation: 7400,
        latitude: 45.21328,
        longitude: -117.19258,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'elkhorns',
    stations: [
      {
        triplet: 'BORO3',
        name: 'BOURNE',
        elevation: 5850,
        latitude: 44.83052,
        longitude: -118.18787,
        primary: true,
      },
      {
        triplet: 'WFCO3',
        name: 'WOLF CREEK',
        elevation: 5630,
        latitude: 45.06703,
        longitude: -118.15192,
        primary: true,
      },
      {
        triplet: 'EIMO3',
        name: 'EILERTSON MEADOWS',
        elevation: 5510,
        latitude: 44.86887,
        longitude: -118.11387,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'blues',
    stations: [
      {
        triplet: 'BLPO3',
        name: 'BLUE MOUNTAIN SPRING',
        elevation: 5870,
        latitude: 44.24767,
        longitude: -118.51722,
        primary: true,
      },
      {
        triplet: 'BORO3',
        name: 'BOURNE',
        elevation: 5850,
        latitude: 44.83052,
        longitude: -118.18787,
        primary: true,
      },
      {
        triplet: 'GLDO3',
        name: 'GOLD CENTER',
        elevation: 5410,
        latitude: 44.7638,
        longitude: -118.3117,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // SOAIX - Southern Oregon Avalanche Information Exchange (OR)
  // ===================================================================
  {
    zoneId: 'southern-oregon',
    stations: [
      {
        triplet: 'SWNO3',
        name: 'SWAN LAKE MTN',
        elevation: 6830,
        latitude: 42.41323,
        longitude: -121.68002,
        primary: true,
      },
      {
        triplet: 'SSSO3',
        name: 'SUN PASS',
        elevation: 5400,
        latitude: 42.78637,
        longitude: -121.97715,
        primary: true,
      },
      {
        triplet: 'BCDO3',
        name: 'BILLIE CREEK DIVIDE',
        elevation: 5280,
        latitude: 42.40717,
        longitude: -122.26617,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // SAC - Sierra Avalanche Center (CA)
  // ===================================================================
  {
    zoneId: 'central-sierra-nevada',
    stations: [
      {
        triplet: 'ILKC1',
        name: 'INDEPENDENCE LAKE',
        elevation: 8337,
        latitude: 39.42752,
        longitude: -120.31342,
        primary: true,
      },
      {
        triplet: 'LLSC1',
        name: 'LAKE LOIS NEAR SOUTH LAKE TAHOE 10W LOS',
        elevation: 8297,
        latitude: 38.925,
        longitude: -120.19694,
        primary: true,
      },
      {
        triplet: 'SQWC1',
        name: 'Palisades Tahoe',
        elevation: 8010,
        latitude: 39.18986,
        longitude: -120.26576,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // ESAC - Eastern Sierra Avalanche Center (CA)
  // ===================================================================
  {
    zoneId: 'eastside-region',
    stations: [
      {
        triplet: 'TIRC1',
        name: 'TIOGA PASS ENTRY STATION NEAR TUOLUMNE MEADOWS 7ENE TES',
        elevation: 10000,
        latitude: 37.91083,
        longitude: -119.25861,
        primary: true,
      },
      {
        triplet: 'XMPC1',
        name: 'MEAN PEAK',
        elevation: 9867,
        latitude: 38.39739,
        longitude: -119.52522,
        primary: true,
      },
      {
        triplet: 'TIOC1',
        name: 'TIOGA PASS-DANA MEADOWS NEAR LEE VINING 9SW DAN',
        elevation: 9816,
        latitude: 37.89611,
        longitude: -119.25722,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // BAC - Bridgeport Avalanche Center (CA)
  // ===================================================================
  {
    zoneId: 'bridgeport',
    stations: [
      {
        triplet: 'TIRC1',
        name: 'TIOGA PASS ENTRY STATION NEAR TUOLUMNE MEADOWS 7ENE TES',
        elevation: 10000,
        latitude: 37.91083,
        longitude: -119.25861,
        primary: true,
      },
      {
        triplet: 'XMPC1',
        name: 'MEAN PEAK',
        elevation: 9867,
        latitude: 38.39739,
        longitude: -119.52522,
        primary: true,
      },
      {
        triplet: 'TIOC1',
        name: 'TIOGA PASS-DANA MEADOWS NEAR LEE VINING 9SW DAN',
        elevation: 9816,
        latitude: 37.89611,
        longitude: -119.25722,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // MSAC - Mount Shasta Avalanche Center (CA/OR)
  // ===================================================================
  {
    zoneId: 'mount-shasta',
    stations: [
      {
        triplet: 'BCDO3',
        name: 'BILLIE CREEK DIVIDE',
        elevation: 5280,
        latitude: 42.40717,
        longitude: -122.26617,
        primary: true,
      },
      {
        triplet: 'BRMO3',
        name: 'BIG RED MOUNTAIN',
        elevation: 6050,
        latitude: 42.05257,
        longitude: -122.85487,
        primary: true,
      },
      {
        triplet: 'FRLO3',
        name: 'FOURMILE LAKE',
        elevation: 5970,
        latitude: 42.43933,
        longitude: -122.2288,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // SNFAC - Sawtooth National Forest Avalanche Center (ID)
  // ===================================================================
  {
    zoneId: 'banner-summit',
    stations: [
      {
        triplet: 'ATAI1',
        name: 'ATLANTA SUMMIT',
        elevation: 7580,
        latitude: 43.7569,
        longitude: -115.23907,
        primary: true,
      },
      {
        triplet: 'BNRI1',
        name: 'BANNER SUMMIT',
        elevation: 7100,
        latitude: 44.303333,
        longitude: -115.233333,
        primary: true,
      },
      {
        triplet: 'JKPI1',
        name: 'JACKSON PEAK',
        elevation: 7070,
        latitude: 44.05092,
        longitude: -115.44322,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'galena-summit-eastern-mtns',
    stations: [
      {
        triplet: 'VNNI1',
        name: 'VIENNA MINE',
        elevation: 8960,
        latitude: 43.79942,
        longitude: -114.85273,
        primary: true,
      },
      {
        triplet: 'ATAI1',
        name: 'ATLANTA SUMMIT',
        elevation: 7580,
        latitude: 43.7569,
        longitude: -115.23907,
        primary: true,
      },
      {
        triplet: 'ITD42',
        name: 'Smiley Creek Airport',
        elevation: 7237,
        latitude: 43.90958,
        longitude: -114.79518,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'sawtooth-western-smoky-mtns',
    stations: [
      {
        triplet: 'VNNI1',
        name: 'VIENNA MINE',
        elevation: 8960,
        latitude: 43.79942,
        longitude: -114.85273,
        primary: true,
      },
      {
        triplet: 'ATAI1',
        name: 'ATLANTA SUMMIT',
        elevation: 7580,
        latitude: 43.7569,
        longitude: -115.23907,
        primary: true,
      },
      {
        triplet: 'ITD42',
        name: 'Smiley Creek Airport',
        elevation: 7237,
        latitude: 43.90958,
        longitude: -114.79518,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'soldier-wood-river-valley-mtns',
    stations: [
      {
        triplet: 'VNNI1',
        name: 'VIENNA MINE',
        elevation: 8960,
        latitude: 43.79942,
        longitude: -114.85273,
        primary: true,
      },
      {
        triplet: 'ATAI1',
        name: 'ATLANTA SUMMIT',
        elevation: 7580,
        latitude: 43.7569,
        longitude: -115.23907,
        primary: true,
      },
      {
        triplet: 'ITD42',
        name: 'Smiley Creek Airport',
        elevation: 7237,
        latitude: 43.90958,
        longitude: -114.79518,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // PAC - Payette Avalanche Center (ID)
  // ===================================================================
  {
    zoneId: 'salmon-river-mountains',
    stations: [
      {
        triplet: 'BNRI1',
        name: 'BANNER SUMMIT',
        elevation: 7100,
        latitude: 44.303333,
        longitude: -115.233333,
        primary: true,
      },
      {
        triplet: 'BKSI1',
        name: 'BIG CREEK SUMMIT',
        elevation: 6580,
        latitude: 44.62642,
        longitude: -115.7937,
        primary: true,
      },
      {
        triplet: 'ITD68',
        name: 'Little Donner',
        elevation: 5239,
        latitude: 44.58028,
        longitude: -116.03924,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'west-mountains',
    stations: [
      {
        triplet: 'BKSI1',
        name: 'BIG CREEK SUMMIT',
        elevation: 6580,
        latitude: 44.62642,
        longitude: -115.7937,
        primary: true,
      },
      {
        triplet: 'ITD69',
        name: 'Goose Creek Grade',
        elevation: 5417,
        latitude: 44.92944,
        longitude: -116.1555,
        primary: true,
      },
      {
        triplet: 'ITD68',
        name: 'Little Donner',
        elevation: 5239,
        latitude: 44.58028,
        longitude: -116.03924,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // IPAC - Idaho Panhandle Avalanche Center (ID/MT)
  // ===================================================================
  {
    zoneId: 'selkirk-mountains',
    stations: [
      {
        triplet: 'STZI1',
        name: 'SCHWEITZER BASIN',
        elevation: 6090,
        latitude: 48.37428,
        longitude: -116.63917,
        primary: true,
      },
      {
        triplet: 'BRMI1',
        name: 'BEAR MOUNTAIN',
        elevation: 5400,
        latitude: 48.30577,
        longitude: -116.07448,
        primary: true,
      },
      {
        triplet: 'MYRI1',
        name: 'MYRTLE CREEK',
        elevation: 3520,
        latitude: 48.72263,
        longitude: -116.46312,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'west-cabinet-mountains',
    stations: [
      {
        triplet: 'CHIM8',
        name: 'CHICAGO RIDGE',
        elevation: 5800,
        latitude: 48.06,
        longitude: -115.7,
        primary: true,
      },
      {
        triplet: 'BRMI1',
        name: 'BEAR MOUNTAIN',
        elevation: 5400,
        latitude: 48.30577,
        longitude: -116.07448,
        primary: true,
      },
      {
        triplet: 'MOQI1',
        name: 'MOSQUITO RIDGE',
        elevation: 5200,
        latitude: 48.05737,
        longitude: -116.23052,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'east-cabinet-mountains',
    stations: [
      {
        triplet: 'CHIM8',
        name: 'CHICAGO RIDGE',
        elevation: 5800,
        latitude: 48.06,
        longitude: -115.7,
        primary: true,
      },
      {
        triplet: 'BRMI1',
        name: 'BEAR MOUNTAIN',
        elevation: 5400,
        latitude: 48.30577,
        longitude: -116.07448,
        primary: true,
      },
      {
        triplet: 'MOQI1',
        name: 'MOSQUITO RIDGE',
        elevation: 5200,
        latitude: 48.05737,
        longitude: -116.23052,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'silver-valley-bitterroot-mountains',
    stations: [
      {
        triplet: 'ITDA7',
        name: 'Lookout Pass',
        elevation: 4526,
        latitude: 47.4611,
        longitude: -115.6937,
        primary: true,
      },
      {
        triplet: 'ITD90',
        name: 'Wallace Viaduct',
        elevation: 2792,
        latitude: 47.47432,
        longitude: -115.90816,
        primary: true,
      },
      {
        triplet: 'ITDA6',
        name: 'Cataldo',
        elevation: 2175,
        latitude: 47.5469,
        longitude: -116.3307,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'purcell-mountains',
    stations: [
      {
        triplet: 'CHIM8',
        name: 'CHICAGO RIDGE',
        elevation: 5800,
        latitude: 48.06,
        longitude: -115.7,
        primary: true,
      },
      {
        triplet: 'BRMI1',
        name: 'BEAR MOUNTAIN',
        elevation: 5400,
        latitude: 48.30577,
        longitude: -116.07448,
        primary: true,
      },
      {
        triplet: 'BANM8',
        name: 'BANFIELD MOUNTAIN',
        elevation: 5600,
        latitude: 48.5712,
        longitude: -115.44573,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // GNFAC - Gallatin National Forest Avalanche Center (MT)
  // ===================================================================
  {
    zoneId: 'bridger-range',
    stations: [
      {
        triplet: 'BRCM8',
        name: 'BRACKETT CREEK',
        elevation: 7320,
        latitude: 45.89107,
        longitude: -110.93851,
        primary: true,
      },
      {
        triplet: 'BZNM8',
        name: 'Bozeman',
        elevation: 4905,
        latitude: 45.66341,
        longitude: -111.07218,
        primary: true,
      },
      {
        triplet: 'SFSM8',
        name: 'S FORK SHIELDS',
        elevation: 8100,
        latitude: 46.0896,
        longitude: -110.43363,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'northern-gallatin-range',
    stations: [
      {
        triplet: 'YCTIM',
        name: 'Yellowstone Club - Timber Station',
        elevation: 9400,
        latitude: 45.23114,
        longitude: -111.45119,
        primary: true,
      },
      {
        triplet: 'YCAND',
        name: 'Yellowstone Club - Andesite Mountain',
        elevation: 8850,
        latitude: 45.26281,
        longitude: -111.40789,
        primary: true,
      },
      {
        triplet: 'YCBAS',
        name: 'Yellowstone Club - Base Area',
        elevation: 7200,
        latitude: 45.23924,
        longitude: -111.41476,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'southern-gallatin-range',
    stations: [
      {
        triplet: 'YCTIM',
        name: 'Yellowstone Club - Timber Station',
        elevation: 9400,
        latitude: 45.23114,
        longitude: -111.45119,
        primary: true,
      },
      {
        triplet: 'YCAND',
        name: 'Yellowstone Club - Andesite Mountain',
        elevation: 8850,
        latitude: 45.26281,
        longitude: -111.40789,
        primary: true,
      },
      {
        triplet: 'YCBAS',
        name: 'Yellowstone Club - Base Area',
        elevation: 7200,
        latitude: 45.23924,
        longitude: -111.41476,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'northern-madison-range',
    stations: [
      {
        triplet: 'YCTIM',
        name: 'Yellowstone Club - Timber Station',
        elevation: 9400,
        latitude: 45.23114,
        longitude: -111.45119,
        primary: true,
      },
      {
        triplet: 'YCAND',
        name: 'Yellowstone Club - Andesite Mountain',
        elevation: 8850,
        latitude: 45.26281,
        longitude: -111.40789,
        primary: true,
      },
      {
        triplet: 'YCBAS',
        name: 'Yellowstone Club - Base Area',
        elevation: 7200,
        latitude: 45.23924,
        longitude: -111.41476,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'southern-madison-range',
    stations: [
      {
        triplet: 'YCTIM',
        name: 'Yellowstone Club - Timber Station',
        elevation: 9400,
        latitude: 45.23114,
        longitude: -111.45119,
        primary: true,
      },
      {
        triplet: 'YCAND',
        name: 'Yellowstone Club - Andesite Mountain',
        elevation: 8850,
        latitude: 45.26281,
        longitude: -111.40789,
        primary: true,
      },
      {
        triplet: 'WYSM8',
        name: 'WEST YELLOWSTONE',
        elevation: 6700,
        latitude: 44.65866,
        longitude: -111.09199,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'lionhead-area',
    stations: [
      {
        triplet: 'BLBM8',
        name: 'BLACK BEAR',
        elevation: 8170,
        latitude: 44.51389,
        longitude: -111.12803,
        primary: true,
      },
      {
        triplet: 'WYSM8',
        name: 'WEST YELLOWSTONE',
        elevation: 6700,
        latitude: 44.65866,
        longitude: -111.09199,
        primary: true,
      },
      {
        triplet: 'ITD55',
        name: 'Henry\'s Lake',
        elevation: 6617,
        latitude: 44.61831,
        longitude: -111.33548,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'island-park',
    stations: [
      {
        triplet: 'BLBM8',
        name: 'BLACK BEAR',
        elevation: 8170,
        latitude: 44.51389,
        longitude: -111.12803,
        primary: true,
      },
      {
        triplet: 'WYSM8',
        name: 'WEST YELLOWSTONE',
        elevation: 6700,
        latitude: 44.65866,
        longitude: -111.09199,
        primary: true,
      },
      {
        triplet: 'ITD55',
        name: 'Henry\'s Lake',
        elevation: 6617,
        latitude: 44.61831,
        longitude: -111.33548,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'cooke-city',
    stations: [
      {
        triplet: 'PRKW4',
        name: 'PARKER PEAK',
        elevation: 9400,
        latitude: 44.73396,
        longitude: -109.91484,
        primary: true,
      },
      {
        triplet: 'BLTW4',
        name: 'BEARTOOTH LAKE',
        elevation: 9360,
        latitude: 44.94307,
        longitude: -109.56743,
        primary: true,
      },
      {
        triplet: 'EVNW4',
        name: 'EVENING STAR',
        elevation: 9200,
        latitude: 44.65258,
        longitude: -109.78422,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // FAC - Flathead Avalanche Center (MT)
  // ===================================================================
  {
    zoneId: 'whitefish-range',
    stations: [
      {
        triplet: 'LKMMT',
        name: 'Link Mountain',
        elevation: 7228,
        latitude: 48.75989,
        longitude: -114.5753,
        primary: true,
      },
      {
        triplet: 'BIGMS',
        name: 'Big Mountain Summit, Whitefish Ski Resort',
        elevation: 6737,
        latitude: 48.502483,
        longitude: -114.342139,
        primary: true,
      },
      {
        triplet: 'FTMM8',
        name: 'FLATTOP MTN.',
        elevation: 6300,
        latitude: 48.80225,
        longitude: -113.85713,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'swan-range',
    stations: [
      {
        triplet: 'MTM94',
        name: 'CSKT Bison Range',
        elevation: 2667,
        latitude: 47.36645,
        longitude: -114.25775,
        primary: true,
      },
      {
        triplet: 'MSPM8',
        name: 'MOSS PEAK',
        elevation: 6780,
        latitude: 47.68493,
        longitude: -113.9623,
        primary: true,
      },
      {
        triplet: 'NFJM8',
        name: 'NORTH FORK JOCKO',
        elevation: 6330,
        latitude: 47.2726,
        longitude: -113.75617,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'flathead-range-glacier-np',
    stations: [
      {
        triplet: 'S11MT',
        name: 'BNSF Shed 11',
        elevation: 6416,
        latitude: 48.24667,
        longitude: -113.54285,
        primary: true,
      },
      {
        triplet: 'FTMM8',
        name: 'FLATTOP MTN.',
        elevation: 6300,
        latitude: 48.80225,
        longitude: -113.85713,
        primary: true,
      },
      {
        triplet: 'PICM8',
        name: 'PIKE CREEK',
        elevation: 5930,
        latitude: 48.30305,
        longitude: -113.32868,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // WCMAC - West Central Montana Avalanche Center (MT)
  // ===================================================================
  {
    zoneId: 'seeley-lake',
    stations: [
      {
        triplet: 'MTM94',
        name: 'CSKT Bison Range',
        elevation: 2667,
        latitude: 47.36645,
        longitude: -114.25775,
        primary: true,
      },
      {
        triplet: 'STTM8',
        name: 'STUART MOUNTAIN',
        elevation: 7400,
        latitude: 46.99523,
        longitude: -113.92664,
        primary: true,
      },
      {
        triplet: 'MSPM8',
        name: 'MOSS PEAK',
        elevation: 6780,
        latitude: 47.68493,
        longitude: -113.9623,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'rattlesnake',
    stations: [
      {
        triplet: 'MTM94',
        name: 'CSKT Bison Range',
        elevation: 2667,
        latitude: 47.36645,
        longitude: -114.25775,
        primary: true,
      },
      {
        triplet: 'STTM8',
        name: 'STUART MOUNTAIN',
        elevation: 7400,
        latitude: 46.99523,
        longitude: -113.92664,
        primary: true,
      },
      {
        triplet: 'NFJM8',
        name: 'NORTH FORK JOCKO',
        elevation: 6330,
        latitude: 47.2726,
        longitude: -113.75617,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'bitterroot',
    stations: [
      {
        triplet: 'ITD28',
        name: 'Lolo Pass',
        elevation: 5262,
        latitude: 46.63592,
        longitude: -114.58037,
        primary: true,
      },
      {
        triplet: 'LPSI1',
        name: 'LOLO PASS',
        elevation: 5240,
        latitude: 46.63448,
        longitude: -114.58072,
        primary: true,
      },
      {
        triplet: 'TWLM8',
        name: 'TWIN LAKES',
        elevation: 6400,
        latitude: 46.1438,
        longitude: -114.5056,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // BTAC - Bridger-Teton Avalanche Center (WY)
  // ===================================================================
  {
    zoneId: 'tetons',
    stations: [
      {
        triplet: 'JHR',
        name: 'JACKSON HOLE-RAYMER',
        elevation: 9657,
        latitude: 43.603815,
        longitude: -110.855884,
        primary: true,
      },
      {
        triplet: 'GTHW4',
        name: 'GRAND TARGHEE',
        elevation: 9260,
        latitude: 43.77933,
        longitude: -110.92783,
        primary: true,
      },
      {
        triplet: 'SNKWY',
        name: 'SNOW KING',
        elevation: 7808,
        latitude: 43.463064,
        longitude: -110.762552,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'togwotee-pass',
    stations: [
      {
        triplet: 'TOGW4',
        name: 'TOGWOTEE PASS',
        elevation: 9580,
        latitude: 43.74902,
        longitude: -110.0578,
        primary: true,
      },
      {
        triplet: 'LTWW4',
        name: 'LITTLE WARM',
        elevation: 9370,
        latitude: 43.50278,
        longitude: -109.752,
        primary: true,
      },
      {
        triplet: 'TOPW4',
        name: 'TWO OCEAN PLATEAU',
        elevation: 9240,
        latitude: 44.15178,
        longitude: -110.22122,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'snake-river-range',
    stations: [
      {
        triplet: 'JHR',
        name: 'JACKSON HOLE-RAYMER',
        elevation: 9657,
        latitude: 43.603815,
        longitude: -110.855884,
        primary: true,
      },
      {
        triplet: 'GTHW4',
        name: 'GRAND TARGHEE',
        elevation: 9260,
        latitude: 43.77933,
        longitude: -110.92783,
        primary: true,
      },
      {
        triplet: 'ITD56',
        name: 'Botts RWIS',
        elevation: 6005,
        latitude: 43.87822,
        longitude: -111.3622,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'salt-river-wyoming-ranges',
    stations: [
      {
        triplet: 'SCDW4',
        name: 'SPRING CREEK DIVIDE',
        elevation: 9000,
        latitude: 42.5254,
        longitude: -110.6615,
        primary: true,
      },
      {
        triplet: 'BBSW4',
        name: 'BLIND BULL SUM',
        elevation: 8650,
        latitude: 42.964,
        longitude: -110.60973,
        primary: true,
      },
      {
        triplet: 'TRPW4',
        name: 'TRIPLE PEAK',
        elevation: 8500,
        latitude: 42.76393,
        longitude: -110.5914,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // EWYAIX - Eastern Wyoming Avalanche Info Exchange (WY)
  // ===================================================================
  {
    zoneId: 'big-horns',
    stations: [
      {
        triplet: 'CPKW4',
        name: 'CLOUD PEAK RESERVOIR',
        elevation: 9860,
        latitude: 44.40343,
        longitude: -107.06057,
        primary: true,
      },
      {
        triplet: 'BGEW4',
        name: 'BIG GOOSE',
        elevation: 7990,
        latitude: 44.57924,
        longitude: -107.20068,
        primary: true,
      },
      {
        triplet: 'SCRW4',
        name: 'SHELL CREEK',
        elevation: 9580,
        latitude: 44.50012,
        longitude: -107.42947,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'snowy-range',
    stations: [
      {
        triplet: 'BKLW4',
        name: 'BROOKLYN LAKE',
        elevation: 10240,
        latitude: 41.35885,
        longitude: -106.23209,
        primary: true,
      },
      {
        triplet: 'BLHW4',
        name: 'BLACKHALL MTN',
        elevation: 9820,
        latitude: 41.05616,
        longitude: -106.71384,
        primary: true,
      },
      {
        triplet: 'MBSW4',
        name: 'MED BOW',
        elevation: 10500,
        latitude: 41.37833,
        longitude: -106.34681,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'sierra-madre',
    stations: [
      {
        triplet: 'BLHW4',
        name: 'BLACKHALL MTN',
        elevation: 9820,
        latitude: 41.05616,
        longitude: -106.71384,
        primary: true,
      },
      {
        triplet: 'C3RED',
        name: 'Red Creek',
        elevation: 8228,
        latitude: 40.77179,
        longitude: -106.98333,
        primary: true,
      },
      {
        triplet: 'OLDW4',
        name: 'OLD BATTLE',
        elevation: 10000,
        latitude: 41.15397,
        longitude: -106.96937,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // UAC - Utah Avalanche Center (UT)
  // ===================================================================
  {
    zoneId: 'logan',
    stations: [
      {
        triplet: 'CRDUT',
        name: 'Card Canyon',
        elevation: 8715,
        latitude: 41.73126,
        longitude: -111.6834,
        primary: true,
      },
      {
        triplet: 'PSINK',
        name: 'Peter Sinks',
        elevation: 8173,
        latitude: 41.91302,
        longitude: -111.51416,
        primary: true,
      },
      {
        triplet: 'WSUBC',
        name: 'WSU Bloomington Canyon Yurt',
        elevation: 7607,
        latitude: 42.17266,
        longitude: -111.55534,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'ogden',
    stations: [
      {
        triplet: 'UTPWD',
        name: 'Powder Mountain',
        elevation: 8897,
        latitude: 41.3699,
        longitude: -111.764,
        primary: true,
      },
      {
        triplet: 'UTPW2',
        name: 'Powder Mountain 2',
        elevation: 8460,
        latitude: 41.37428,
        longitude: -111.76684,
        primary: true,
      },
      {
        triplet: 'CKRU1',
        name: 'CHICKEN RIDGE',
        elevation: 7648,
        latitude: 41.33156,
        longitude: -111.30341,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'salt-lake',
    stations: [
      {
        triplet: 'IFF',
        name: 'CARDIFF PEAK',
        elevation: 10059,
        latitude: 40.595,
        longitude: -111.6519,
        primary: true,
      },
      {
        triplet: 'SOL',
        name: 'SOLITUDE POWDERHORN',
        elevation: 9888,
        latitude: 40.6083,
        longitude: -111.6044,
        primary: true,
      },
      {
        triplet: 'BUNUT',
        name: 'Bunnells Ridge',
        elevation: 8800,
        latitude: 40.314757,
        longitude: -111.563976,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'provo',
    stations: [
      {
        triplet: 'IFF',
        name: 'CARDIFF PEAK',
        elevation: 10059,
        latitude: 40.595,
        longitude: -111.6519,
        primary: true,
      },
      {
        triplet: 'SOL',
        name: 'SOLITUDE POWDERHORN',
        elevation: 9888,
        latitude: 40.6083,
        longitude: -111.6044,
        primary: true,
      },
      {
        triplet: 'BUNUT',
        name: 'Bunnells Ridge',
        elevation: 8800,
        latitude: 40.314757,
        longitude: -111.563976,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'uintas',
    stations: [
      {
        triplet: 'GSTPS',
        name: 'Upper Humpy Basin',
        elevation: 10023,
        latitude: 40.84855,
        longitude: -111.00183,
        primary: true,
      },
      {
        triplet: 'TRLU1',
        name: 'TRIAL LAKE',
        elevation: 9945,
        latitude: 40.67933,
        longitude: -110.94877,
        primary: true,
      },
      {
        triplet: 'TPRUT',
        name: 'Red Creek',
        elevation: 9369,
        latitude: 40.84404,
        longitude: -111.04269,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'skyline',
    stations: [
      {
        triplet: 'SEEU1',
        name: 'SEELEY CREEK',
        elevation: 9903,
        latitude: 39.31042,
        longitude: -111.43297,
        primary: true,
      },
      {
        triplet: 'SKY',
        name: 'Skyline',
        elevation: 9330,
        latitude: 39.6362,
        longitude: -111.3286,
        primary: true,
      },
      {
        triplet: 'ULAMB',
        name: 'Huntington Canyon Portable',
        elevation: 8731,
        latitude: 39.59591,
        longitude: -111.22164,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'moab',
    stations: [
      {
        triplet: 'GOLDB',
        name: 'Goldbasin',
        elevation: 10050,
        latitude: 38.465283,
        longitude: -109.264475,
        primary: true,
      },
      {
        triplet: 'UTLSD',
        name: 'SR-46 at MP 12.5 La Sal Divide',
        elevation: 7734,
        latitude: 38.3426,
        longitude: -109.20875,
        primary: true,
      },
      {
        triplet: 'GDBU1',
        name: 'GOLD BASIN',
        elevation: 10076,
        latitude: 38.47,
        longitude: -109.26,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'abajos',
    stations: [
      {
        triplet: 'UTMPO',
        name: 'US-491 at MP 2 Monticello POE',
        elevation: 6821,
        latitude: 37.873,
        longitude: -109.3061,
        primary: true,
      },
      {
        triplet: 'BUCU1',
        name: 'BUCKBOARD FLAT',
        elevation: 8923,
        latitude: 37.86943,
        longitude: -109.44717,
        primary: true,
      },
      {
        triplet: 'CJSU1',
        name: 'CAMP JACKSON',
        elevation: 8857,
        latitude: 37.81333,
        longitude: -109.48723,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'southwest',
    stations: [
      {
        triplet: 'BHCU1',
        name: 'Brian Head 2S',
        elevation: 10472,
        latitude: 37.66296,
        longitude: -112.8376,
        primary: true,
      },
      {
        triplet: 'UT14S',
        name: 'SR-14 Summit',
        elevation: 9909,
        latitude: 37.56805,
        longitude: -112.85013,
        primary: true,
      },
      {
        triplet: 'MDVU1',
        name: 'MIDWAY VALLEY',
        elevation: 9826,
        latitude: 37.56933,
        longitude: -112.83849,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // CAIC - Colorado Avalanche Information Center (CO)
  // ===================================================================
  {
    zoneId: 'caic-front-range-north',
    stations: [
      {
        triplet: 'LKIC2',
        name: 'LAKE IRENE',
        elevation: 10700,
        latitude: 40.41432,
        longitude: -105.8198,
        primary: true,
      },
      {
        triplet: 'WPRC2',
        name: 'WILLOW PARK',
        elevation: 10700,
        latitude: 40.43254,
        longitude: -105.73337,
        primary: true,
      },
      {
        triplet: 'CACMP',
        name: 'CAMERON PASS',
        elevation: 10574,
        latitude: 40.49371,
        longitude: -105.9083,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'caic-front-range-boulder',
    stations: [
      {
        triplet: 'BTSC2',
        name: 'BERTHOUD SUMMIT',
        elevation: 11300,
        latitude: 39.80392,
        longitude: -105.77789,
        primary: true,
      },
      {
        triplet: 'LKIC2',
        name: 'LAKE IRENE',
        elevation: 10700,
        latitude: 40.41432,
        longitude: -105.8198,
        primary: true,
      },
      {
        triplet: 'WPRC2',
        name: 'WILLOW PARK',
        elevation: 10700,
        latitude: 40.43254,
        longitude: -105.73337,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'caic-front-range-south',
    stations: [
      {
        triplet: 'KAFF',
        name: 'Air Force Academy',
        elevation: 6572,
        latitude: 38.96667,
        longitude: -104.81667,
        primary: true,
      },
      {
        triplet: 'KCOS',
        name: 'City of Colorado Springs Municipal Airport',
        elevation: 6186,
        latitude: 38.80949,
        longitude: -104.68873,
        primary: true,
      },
      {
        triplet: 'KFCS',
        name: 'Butts Army Airfield (Fort Carson)',
        elevation: 5842,
        latitude: 38.68312,
        longitude: -104.75977,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'caic-vail-summit-county',
    stations: [
      {
        triplet: 'HOOC2',
        name: 'HOOSIER PASS',
        elevation: 11611,
        latitude: 39.36055,
        longitude: -106.05994,
        primary: true,
      },
      {
        triplet: 'BTSC2',
        name: 'BERTHOUD SUMMIT',
        elevation: 11300,
        latitude: 39.80392,
        longitude: -105.77789,
        primary: true,
      },
      {
        triplet: 'MIHC2',
        name: 'MICHIGAN CREEK',
        elevation: 10600,
        latitude: 39.43577,
        longitude: -105.91078,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'caic-elk-mountains',
    stations: [
      {
        triplet: 'CAPC2',
        name: 'CASTLE PEAK',
        elevation: 11500,
        latitude: 39.0,
        longitude: -106.84,
        primary: true,
      },
      {
        triplet: 'ASEC2',
        name: 'CASTLE CREEK NEAR ASPEN',
        elevation: 11394,
        latitude: 39.00778,
        longitude: -106.79194,
        primary: true,
      },
      {
        triplet: 'SOSC2',
        name: 'SCHOFIELD PASS',
        elevation: 10700,
        latitude: 39.01522,
        longitude: -107.04877,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'caic-sawatch-range',
    stations: [
      {
        triplet: 'CAPC2',
        name: 'CASTLE PEAK',
        elevation: 11500,
        latitude: 39.0,
        longitude: -106.84,
        primary: true,
      },
      {
        triplet: 'ASEC2',
        name: 'CASTLE CREEK NEAR ASPEN',
        elevation: 11394,
        latitude: 39.00778,
        longitude: -106.79194,
        primary: true,
      },
      {
        triplet: 'PRPC2',
        name: 'PORPHYRY CREEK',
        elevation: 10760,
        latitude: 38.48884,
        longitude: -106.33965,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'caic-grand-mesa-west-elk',
    stations: [
      {
        triplet: 'CAELT',
        name: 'DAN K-ELKTON',
        elevation: 11147,
        latitude: 38.96973,
        longitude: -107.03999,
        primary: true,
      },
      {
        triplet: 'SOSC2',
        name: 'SCHOFIELD PASS',
        elevation: 10700,
        latitude: 39.01522,
        longitude: -107.04877,
        primary: true,
      },
      {
        triplet: 'CAIRW',
        name: 'IRWIN GUIDES STUDY PLOT',
        elevation: 10423,
        latitude: 38.88736,
        longitude: -107.1084,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'caic-park-range',
    stations: [
      {
        triplet: 'ARPC2',
        name: 'ARAPAHO RIDGE',
        elevation: 10960,
        latitude: 40.35098,
        longitude: -106.38142,
        primary: true,
      },
      {
        triplet: 'STORM',
        name: 'Storm Peak Laboratory',
        elevation: 10531,
        latitude: 40.455111,
        longitude: -106.74428,
        primary: true,
      },
      {
        triplet: 'TOWC2',
        name: 'TOWER',
        elevation: 10500,
        latitude: 40.53743,
        longitude: -106.6768,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'caic-northern-san-juan',
    stations: [
      {
        triplet: 'CATEL',
        name: 'TELLURIDE SKI RESORT',
        elevation: 12159,
        latitude: 37.89913,
        longitude: -107.82088,
        primary: true,
      },
      {
        triplet: 'SLMC2',
        name: 'SLUMGULLION',
        elevation: 11440,
        latitude: 37.9908,
        longitude: -107.20327,
        primary: true,
      },
      {
        triplet: 'RMPC2',
        name: 'RED MOUNTAIN PASS',
        elevation: 11200,
        latitude: 37.8918,
        longitude: -107.71342,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'caic-southern-san-juan',
    stations: [
      {
        triplet: 'WCSC2',
        name: 'WOLF CREEK SUMMIT',
        elevation: 11000,
        latitude: 37.47922,
        longitude: -106.8017,
        primary: true,
      },
      {
        triplet: 'URGC2',
        name: 'UPPER RIO GRANDE',
        elevation: 9400,
        latitude: 37.72194,
        longitude: -107.26015,
        primary: true,
      },
      {
        triplet: 'GYBC2',
        name: 'GRAYBACK',
        elevation: 11620,
        latitude: 37.47033,
        longitude: -106.53783,
        primary: true,
      }
    ]
  },
  {
    zoneId: 'caic-sangre-de-cristo',
    stations: [
      {
        triplet: 'SCYC2',
        name: 'SOUTH COLONY',
        elevation: 10800,
        latitude: 37.96811,
        longitude: -105.53787,
        primary: true,
      },
      {
        triplet: 'UTCC2',
        name: 'UTE CREEK',
        elevation: 10650,
        latitude: 37.61497,
        longitude: -105.37327,
        primary: true,
      },
      {
        triplet: 'CYNC2',
        name: 'PSF3 CANON CITY QD',
        elevation: 11569,
        latitude: 38.0415,
        longitude: -105.18589,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // TAC - Taos Avalanche Center (NM)
  // ===================================================================
  {
    zoneId: 'northern-new-mexico',
    stations: [
      {
        triplet: 'TABN5',
        name: 'TAOS POWDERHORN',
        elevation: 11057,
        latitude: 36.58203,
        longitude: -105.45611,
        primary: true,
      },
      {
        triplet: 'SHUN5',
        name: 'SHUREE',
        elevation: 10100,
        latitude: 36.78778,
        longitude: -105.23999,
        primary: true,
      },
      {
        triplet: 'RRPN5',
        name: 'RED RIVER PASS #2',
        elevation: 9850,
        latitude: 36.69925,
        longitude: -105.34125,
        primary: true,
      }
    ]
  },
  // ===================================================================
  // KPAC - Kachina Peaks Avalanche Center (AZ)
  // ===================================================================
  {
    zoneId: 'san-francisco-peaks',
    stations: [
      {
        triplet: 'XSCA3',
        name: 'SNOWSLIDE CANYON',
        elevation: 9730,
        latitude: 35.3416,
        longitude: -111.65058,
        primary: true,
      },
      {
        triplet: 'MMNA3',
        name: 'MORMON MTN SUMMIT',
        elevation: 8500,
        latitude: 34.96964,
        longitude: -111.50922,
        primary: true,
      },
      {
        triplet: 'MRMA3',
        name: 'MORMON MOUNTAIN',
        elevation: 7500,
        latitude: 34.94109,
        longitude: -111.51849,
        primary: true,
      }
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
