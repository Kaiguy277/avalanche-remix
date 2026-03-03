# Weather Station to Avalanche Zone Mapping
**Last Updated:** 2026-02-04
**Purpose:** Reference document for SNOTEL weather station assignments to avalanche forecast zones

## Philosophy

- **All stations equally important**: All assigned stations are marked as "primary" and displayed on zone cards
- **Multi-elevation coverage**: Stations at different elevations provide comprehensive data across all elevation bands
- **No cross-zone duplication**: Stations appear on multiple cards ONLY if they serve distinct climate zones (e.g., Valdez Maritime vs Continental)
- **"Very usable" criteria**: Station must have good data quality, appropriate elevation, and be within the zone's weather catchment area

---

## Current Zone-Station Mappings

### 1. Turnagain Pass / Girdwood (CNFAIC)
**Zone ID:** `turnagain-girdwood`
**NAC Zone:** 2815
**Forecast URL:** https://cnfaic.org/forecast/turnagain/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Turnagain Pass SNOTEL** | 954:AK:SNTL | 1,860 ft | 60.78°N, 149.18°W | ✅ Yes | Located at the pass itself, treeline elevation, highly representative |
| Mt. Alyeska SNOTEL | 1103:AK:SNTL | 1,500 ft | 60.96°N, 149.09°W | ✅ Yes | Girdwood side, provides ski area perspective |

**Coverage Assessment:** ✅ **Excellent**
- Turnagain Pass (1,860 ft) at treeline elevation, highly representative
- Mt. Alyeska (1,500 ft) provides ski area/lower elevation perspective
- Both stations well-maintained and reliable

---

### 2. Summit Lake (CNFAIC)
**Zone ID:** `summit`
**NAC Zone:** 2816
**Forecast URL:** https://cnfaic.org/forecast/summit/

#### Weather Stations (1)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Summit Creek SNOTEL** | 955:AK:SNTL | 1,340 ft | 60.62°N, 149.53°W | ✅ Yes | Only station in zone, mid-elevation, adequate coverage |

**Coverage Assessment:** 🟡 **Good (Single Station)**
- Only one station available for the zone
- Elevation appropriate for treeline/below treeline zones
- Would benefit from additional alpine station if available

---

### 3. Seward / Lost Lake (CNFAIC)
**Zone ID:** `seward`
**NAC Zone:** 2817
**Forecast URL:** https://cnfaic.org/forecast/seward/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Exit Glacier SNOTEL** | 1092:AK:SNTL | 360 ft | 60.19°N, 149.62°W | ✅ Yes | Low elevation but directly in zone, coastal maritime influence |
| Cooper Lake SNOTEL | 959:AK:SNTL | 1,150 ft | 60.39°N, 149.69°W | ✅ Yes | Higher elevation, better for alpine conditions |

**Coverage Assessment:** ✅ **Good (Multi-Elevation Coverage)**
- Exit Glacier (360 ft) provides coastal/maritime data
- Cooper Lake (1,150 ft) provides mid-elevation/alpine data
- Both stations together cover full elevation range of zone

---

### 4. Chugach State Park (CNFAIC)
**Zone ID:** `chugach-state-park`
**NAC Zone:** 2818
**Forecast URL:** https://cnfaic.org/forecast/chugach-state-park/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Indian Pass SNOTEL** | 946:AK:SNTL | 2,400 ft | 61.07°N, 149.49°W | ✅ Yes | High alpine elevation, excellent for upper elevation forecasting |
| Anchorage Hillside SNOTEL | 1070:AK:SNTL | 1,910 ft | 61.11°N, 149.68°W | ✅ Yes | Lower elevation, urban interface perspective |

**Coverage Assessment:** ✅ **Excellent**
- Indian Pass (2,400 ft) provides high alpine data
- Anchorage Hillside (1,910 ft) provides mid-elevation data
- Good coverage of elevation bands

---

### 5. Hatcher Pass (HPAC)
**Zone ID:** `hatcher-pass`
**NAC Zone:** 2152
**Forecast URL:** https://hpavalanche.org/forecast/

#### Weather Stations (1)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Independence Mine SNOTEL** | 1091:AK:SNTL | 3,450 ft | 61.78°N, 149.28°W | ✅ Yes | High alpine, perfect for zone's elevation profile |

**Coverage Assessment:** ✅ **Excellent (High Alpine)**
- Highest elevation station in current config (3,450 ft)
- Perfectly suited for Hatcher Pass alpine terrain
- Single station but excellent quality and placement

---

### 6. Valdez - Maritime (VAC)
**Zone ID:** `valdez-maritime`
**NAC Zone:** 1609 (not in NAC API - web scraped)
**Forecast URL:** https://alaskasnow.org/valdez/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Sugarloaf Mtn** | 1095:AK:SNTL | 530 ft | 61.08°N, 146.30°W | ✅ Yes | Low elevation, maritime/coastal influence, near Valdez |
| Upper Tsaina River | 1055:AK:SNTL | 1,730 ft | 61.18°N, 145.65°W | ✅ Yes | Higher elevation, transitional climate |

**Coverage Assessment:** ✅ **Good (Maritime Focus)**
- Sugarloaf Mtn (530 ft) captures maritime/coastal influence
- Upper Tsaina River (1,730 ft) provides higher elevation perspective
- Same 2 stations as other Valdez zones, both displayed

---

### 7. Valdez - Intermountain (VAC)
**Zone ID:** `valdez-intermountain`
**NAC Zone:** 1610 (not in NAC API - web scraped)
**Forecast URL:** https://alaskasnow.org/valdez/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Upper Tsaina River** | 1055:AK:SNTL | 1,730 ft | 61.18°N, 145.65°W | ✅ Yes | Mid-elevation, transitional/intermountain climate |
| Sugarloaf Mtn | 1095:AK:SNTL | 530 ft | 61.08°N, 146.30°W | ✅ Yes | Lower elevation, maritime influence |

**Coverage Assessment:** ✅ **Good (Transitional Focus)**
- Upper Tsaina River (1,730 ft) more relevant for intermountain climate
- Sugarloaf Mtn (530 ft) provides maritime influence context
- Good elevation band coverage (530 ft to 1,730 ft)

---

### 8. Valdez - Continental (VAC)
**Zone ID:** `valdez-continental`
**NAC Zone:** 1611 (not in NAC API - web scraped)
**Forecast URL:** https://alaskasnow.org/valdez/

#### Weather Stations (1)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Upper Tsaina River** | 1055:AK:SNTL | 1,730 ft | 61.18°N, 145.65°W | ✅ Yes | Highest available elevation for continental interior climate |

**Coverage Assessment:** 🟡 **Good (Single Station, Limited Elevation)**
- Only station assigned to this zone
- 1,730 ft may be low for continental/interior alpine conditions
- **Potential improvement:** Research if higher elevation SNOTEL exists inland from Valdez

**Note:** Sugarloaf Mtn (530 ft) is NOT included here - too maritime/coastal for continental zone

---

### 9. Eastern Alaska Range - North (EARAC)
**Zone ID:** `earac-north`
**NAC Zone:** 3002
**Forecast URL:** https://alaskasnow.org/eastern-ak-range/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Look Eyrie** | 768:AK:SNTL | 5,040 ft | 63.32°N, 145.60°W | ✅ Yes | High alpine elevation, excellent for upper terrain forecasting |
| Fielding Lake | 1268:AK:SNTL | 3,000 ft | 63.20°N, 145.63°W | ✅ Yes | Treeline elevation, mid-mountain data |

**Coverage Assessment:** ✅ **Excellent (High-Quality Multi-Elevation)**
- Look Eyrie (5,040 ft) provides exceptional high alpine data
- Fielding Lake (3,000 ft) provides treeline/mid-elevation perspective
- Both stations relatively close geographically
- Excellent coverage for Interior Alaska avalanche terrain

---

### 10. Eastern Alaska Range - South (EARAC)
**Zone ID:** `earac-south`
**NAC Zone:** 3003
**Forecast URL:** https://alaskasnow.org/eastern-ak-range/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Look Eyrie** | 768:AK:SNTL | 5,040 ft | 63.32°N, 145.60°W | ✅ Yes | High alpine elevation, shared with North zone |
| Fielding Lake | 1268:AK:SNTL | 3,000 ft | 63.20°N, 145.63°W | ✅ Yes | Treeline elevation, shared with North zone |

**Coverage Assessment:** ✅ **Excellent (Shared High-Quality Stations)**
- Same two stations as North zone (appropriate for adjacent zones in same mountain range)
- Look Eyrie (5,040 ft) provides high alpine data for summit areas
- Fielding Lake (3,000 ft) provides mid-elevation data
- Both zones cover similar terrain in Eastern Alaska Range

**Note:** Both EARAC zones share the same SNOTEL stations as they're geographically close and experience similar weather patterns. This is appropriate given the stations' locations in the Eastern Alaska Range.

---

### 11. Douglas Island (CAAC)
**Zone ID:** `douglas-island`
**NAC Zone:** 2165
**Forecast URL:** https://www.coastalakavalanche.org/forecast/#/douglas-island/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Heen Latinee** | 1270:AK:SNTL | 2,100 ft | 58.70°N, 134.87°W | ✅ Yes | Higher elevation, provides alpine perspective (37 mi north) |
| Long Lake | 1001:AK:SNTL | 840 ft | 58.18°N, 133.83°W | ✅ Yes | Lower elevation, in-zone maritime data |

**Coverage Assessment:** ✅ **Good (Multi-Elevation Coverage)**
- Heen Latinee (2,100 ft) provides mid-to-upper elevation data despite being out of zone
- Long Lake (840 ft) provides low-elevation/maritime data
- Multi-elevation coverage compensates for limited station density in Southeast Alaska

---

### 12. Juneau Mainland (CAAC)
**Zone ID:** `juneau-mainland`
**NAC Zone:** 2164
**Forecast URL:** https://www.coastalakavalanche.org/forecast/#/juneau-mainland/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Heen Latinee** | 1270:AK:SNTL | 2,100 ft | 58.70°N, 134.87°W | ✅ Yes | Higher elevation, provides alpine perspective |
| Long Lake | 1001:AK:SNTL | 840 ft | 58.18°N, 133.83°W | ✅ Yes | Lower elevation, maritime data |

**Coverage Assessment:** ✅ **Good (Multi-Elevation Coverage)**
- Heen Latinee (2,100 ft) provides mid-to-upper elevation data
- Long Lake (840 ft) provides low-elevation/maritime data
- Both zones share stations as they're in the same geographic region with similar weather patterns
- Forecasts may be intermittent or unavailable (center in development phase)

---

## Station Sharing Analysis

### Stations Used by Multiple Zones

#### Upper Tsaina River (1055:AK:SNTL) - 1,730 ft
**Used by:**
- Valdez Maritime
- Valdez Intermountain
- Valdez Continental

**Rationale:** ✅ **Appropriate**
All three Valdez zones represent different climate bands of the same geographic region. The station's mid-elevation (1,730 ft) is relevant across all zones, particularly for transitional/continental conditions.

#### Sugarloaf Mtn (1095:AK:SNTL) - 530 ft
**Used by:**
- Valdez Maritime
- Valdez Intermountain

**Rationale:** ✅ **Appropriate**
Low elevation (530 ft) provides maritime/coastal data. More relevant for Maritime and Intermountain zones; appropriately excluded from Continental zone which focuses on higher elevations.

#### Look Eyrie (768:AK:SNTL) - 5,040 ft
**Used by:**
- EARAC North (Castner-Canwell)
- EARAC South (Summit)

**Rationale:** ✅ **Appropriate**
Both zones are adjacent areas in the Eastern Alaska Range with similar high-alpine terrain. The 5,040 ft elevation is ideal for upper elevation forecasting in both zones. Stations are geographically centered for both forecast areas.

#### Fielding Lake (1268:AK:SNTL) - 3,000 ft
**Used by:**
- EARAC North (Castner-Canwell)
- EARAC South (Summit)

**Rationale:** ✅ **Appropriate**
Treeline elevation (3,000 ft) provides mid-mountain data relevant to both Eastern Alaska Range zones. Same geographic region with similar weather patterns justifies sharing.

#### Heen Latinee (1270:AK:SNTL) - 2,100 ft
**Used by:**
- Douglas Island (CAAC)
- Juneau Mainland (CAAC)

**Rationale:** ✅ **Appropriate**
Both zones are adjacent areas in the Juneau region with similar maritime climate. The 2,100 ft elevation provides mid-elevation alpine data for both forecast areas. Stations are the only viable SNOTEL options in Southeast Alaska.

#### Long Lake (1001:AK:SNTL) - 840 ft
**Used by:**
- Douglas Island (CAAC)
- Juneau Mainland (CAAC)

**Rationale:** ✅ **Appropriate**
Low elevation (840 ft) provides maritime/coastal data relevant to both Juneau-area zones. Both zones share similar weather patterns and limited station availability in Southeast Alaska justifies sharing.

#### Moore Creek Bridge (1176:AK:SNTL) - 2,250 ft
**Used by:**
- Haines Lutak (HAC)
- Haines Transitional (HAC)
- Haines Chilkat Pass (HAC)

**Rationale:** ✅ **Appropriate**
All three Haines zones represent different terrain aspects of the same geographic area around Haines. Mid-alpine elevation (2,250 ft) provides relevant data for avalanche terrain across all zones. Closest SNOTEL station to Haines region.

#### Flower Mountain (1285:AK:SNTL) - 2,540 ft
**Used by:**
- Haines Lutak (HAC)
- Haines Transitional (HAC)
- Haines Chilkat Pass (HAC)

**Rationale:** ✅ **Appropriate**
Upper elevation (2,540 ft) provides alpine perspective for all Haines zones. Shared by all three zones as they're in the same geographic region with similar weather patterns. Provides higher elevation data to complement Moore Creek Bridge.

### Stations Used by Single Zones Only
- Turnagain Pass SNOTEL (954) → Turnagain-Girdwood only ✅
- Mt. Alyeska SNOTEL (1103) → Turnagain-Girdwood only ✅
- Summit Creek SNOTEL (955) → Summit only ✅
- Exit Glacier SNOTEL (1092) → Seward only ✅
- Cooper Lake SNOTEL (959) → Seward only ✅
- Indian Pass SNOTEL (946) → Chugach State Park only ✅
- Anchorage Hillside SNOTEL (1070) → Chugach State Park only ✅
- Independence Mine SNOTEL (1091) → Hatcher Pass only ✅

**Assessment:** ✅ **No inappropriate sharing**
All single-zone assignments are geographically correct.

---

## Geographic Distribution Map

```
SOUTHCENTRAL ALASKA (CNFAIC)
┌─────────────────────────────────────────────┐
│                                             │
│  Chugach State Park (2 stations)           │
│    • Indian Pass (2400 ft)                 │
│    • Anchorage Hillside (1910 ft)          │
│                                             │
│  Turnagain/Girdwood (2 stations)           │
│    • Turnagain Pass (1860 ft)              │
│    • Mt. Alyeska (1500 ft)                 │
│                                             │
│  Summit Lake (1 station)                    │
│    • Summit Creek (1340 ft)                │
│                                             │
│  Seward/Lost Lake (2 stations)             │
│    • Exit Glacier (360 ft)                 │
│    • Cooper Lake (1150 ft)                 │
└─────────────────────────────────────────────┘

HATCHER PASS (HPAC)
┌─────────────────────────────────────────────┐
│  Hatcher Pass (1 station)                   │
│    • Independence Mine (3450 ft)           │
└─────────────────────────────────────────────┘

VALDEZ REGION (VAC)
┌─────────────────────────────────────────────┐
│  Shared Pool: 2 stations                    │
│    • Sugarloaf Mtn (530 ft)                │
│    • Upper Tsaina River (1730 ft)          │
│                                             │
│  Maritime: Both stations                    │
│  Intermountain: Both stations               │
│  Continental: Upper Tsaina only            │
└─────────────────────────────────────────────┘

EASTERN ALASKA RANGE (EARAC)
┌─────────────────────────────────────────────┐
│  Shared Pool: 2 stations                    │
│    • Look Eyrie (5040 ft)                  │
│    • Fielding Lake (3000 ft)               │
│                                             │
│  North (Castner-Canwell): Both stations    │
│  South (Summit): Both stations              │
└─────────────────────────────────────────────┘

SOUTHEAST ALASKA (CAAC)
┌─────────────────────────────────────────────┐
│  Shared Pool: 2 stations                    │
│    • Heen Latinee (2100 ft)                │
│    • Long Lake (840 ft)                    │
│                                             │
│  Douglas Island: Both stations              │
│  Juneau Mainland: Both stations             │
└─────────────────────────────────────────────┘

HAINES REGION (HAC)
┌─────────────────────────────────────────────┐
│  Shared Pool: 2 stations                    │
│    • Moore Creek Bridge (2250 ft)          │
│    • Flower Mountain (2540 ft)             │
│                                             │
│  Lutak: Both stations                       │
│  Transitional: Both stations                │
│  Chilkat Pass: Both stations                │
└─────────────────────────────────────────────┘

All stations shown are displayed on their zone cards
```

---

## Recommendations

### ✅ Current Configuration is Good
Your current station assignments follow best practices:
- No unnecessary duplication across independent zones
- Valdez zones appropriately share stations across climate bands
- Elevation bands well-represented with all stations displayed

### 🟡 Potential Future Improvements

#### 1. Valdez Continental - Additional Coverage
**Current:** Only Upper Tsaina River (1,730 ft)
**Consideration:** 1,730 ft may be too low for true continental/alpine conditions
**Action:** Research if higher elevation SNOTEL exists east/inland of Valdez (e.g., along Richardson Highway)

---

## Future Expansion Planning

### ✅ Completed Expansions

#### 1. Eastern Alaska Range (EARAC) - ✅ ADDED 2026-02-04
**Zones Added:**
- North (Castner-Canwell) - Zone ID: `earac-north`
- South (Summit) - Zone ID: `earac-south`

**SNOTEL Stations Used:**
- Look Eyrie (768:AK:SNTL) - 5,040 ft - Shared by both zones
- Fielding Lake (1268:AK:SNTL) - 3,000 ft - Shared by both zones

**Note:** Gulkana Glacier station (6,300 ft) is a custom AAIC station (AGW01), not part of SNOTEL network, so cannot be integrated via standard API.

**Status:** ✅ Excellent high-alpine SNOTEL coverage, both zones operational

---

#### 2. Juneau / Douglas Island (CAAC) - ✅ ADDED 2026-02-05
**Zones Added:**
- Douglas Island - Zone ID: `douglas-island` - NAC Zone: 2165
- Juneau Mainland - Zone ID: `juneau-mainland` - NAC Zone: 2164

**SNOTEL Stations Used:**
- Heen Latinee (1270:AK:SNTL) - 2,100 ft - Shared by both zones
- Long Lake (1001:AK:SNTL) - 840 ft - Shared by both zones

**Notes:**
- Forecasts may be intermittent or unavailable (center in development phase)
- System configured to fail gracefully with no forecasts and display SNOTEL weather data
- Heen Latinee station located 37 miles north of Juneau but provides best alpine data for region

**Status:** ✅ Good multi-elevation SNOTEL coverage, weather data available even when forecasts are not

---

### 13. Haines - Lutak (HAC)
**Zone ID:** `haines-lutak`
**NAC Zone:** 2863
**Forecast URL:** https://alaskasnow.org/haines-forecast/#/lutak/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Moore Creek Bridge** | 1176:AK:SNTL | 2,250 ft | 59.59°N, 135.19°W | ✅ Yes | Closest SNOTEL to Haines, mid-alpine elevation (25 mi north) |
| Flower Mountain | 1285:AK:SNTL | 2,540 ft | 59.40°N, 136.28°W | ✅ Yes | Higher elevation alpine data (40 mi northwest) |

**Coverage Assessment:** ✅ **Good (Multi-Elevation Coverage)**
- Moore Creek Bridge (2,250 ft) provides mid-alpine data
- Flower Mountain (2,540 ft) provides upper elevation perspective
- Both stations ~25-40 miles from Haines but best available options for region
- Multi-elevation coverage compensates for station distance

**Notes:**
- Forecasts may be qualitative analysis only (no numerical danger ratings)
- System configured to display SNOTEL weather data even without danger ratings
- New weather station installed at Lutak in 2024 but not yet in SNOTEL network

---

### 14. Haines - Transitional (HAC)
**Zone ID:** `haines-transitional`
**NAC Zone:** 2864
**Forecast URL:** https://alaskasnow.org/haines-forecast/#/transitional/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Moore Creek Bridge** | 1176:AK:SNTL | 2,250 ft | 59.59°N, 135.19°W | ✅ Yes | Mid-alpine elevation, shared with other Haines zones |
| Flower Mountain | 1285:AK:SNTL | 2,540 ft | 59.40°N, 136.28°W | ✅ Yes | Upper elevation data, shared with other Haines zones |

**Coverage Assessment:** ✅ **Good (Multi-Elevation Coverage)**
- Same stations as Lutak zone (appropriate for adjacent zones in same region)
- Moore Creek Bridge (2,250 ft) and Flower Mountain (2,540 ft) cover elevation bands
- Stations bracket Haines area from north and northwest

---

### 15. Haines - Chilkat Pass (HAC)
**Zone ID:** `haines-chilkat-pass`
**NAC Zone:** 2865
**Forecast URL:** https://alaskasnow.org/haines-forecast/#/chilkat-pass/

#### Weather Stations (2)
| Station | Triplet | Elevation | Coordinates | Primary | Rationale |
|---------|---------|-----------|-------------|---------|-----------|
| **Moore Creek Bridge** | 1176:AK:SNTL | 2,250 ft | 59.59°N, 135.19°W | ✅ Yes | Mid-alpine elevation, shared with other Haines zones |
| Flower Mountain | 1285:AK:SNTL | 2,540 ft | 59.40°N, 136.28°W | ✅ Yes | Upper elevation data, shared with other Haines zones |

**Coverage Assessment:** ✅ **Good (Multi-Elevation Coverage)**
- Same stations as other Haines zones (appropriate for same geographic region)
- Moore Creek Bridge (2,250 ft) provides mid-elevation data
- Flower Mountain (2,540 ft) provides alpine perspective
- Both zones share weather patterns in Haines region

---

## Future Expansion Planning

### ✅ Completed Expansions

#### 1. Eastern Alaska Range (EARAC) - ✅ ADDED 2026-02-04
**Zones Added:**
- North (Castner-Canwell) - Zone ID: `earac-north`
- South (Summit) - Zone ID: `earac-south`

**SNOTEL Stations Used:**
- Look Eyrie (768:AK:SNTL) - 5,040 ft - Shared by both zones
- Fielding Lake (1268:AK:SNTL) - 3,000 ft - Shared by both zones

**Note:** Gulkana Glacier station (6,300 ft) is a custom AAIC station (AGW01), not part of SNOTEL network, so cannot be integrated via standard API.

**Status:** ✅ Excellent high-alpine SNOTEL coverage, both zones operational

---

#### 2. Juneau / Douglas Island (CAAC) - ✅ ADDED 2026-02-05
**Zones Added:**
- Douglas Island - Zone ID: `douglas-island` - NAC Zone: 2165
- Juneau Mainland - Zone ID: `juneau-mainland` - NAC Zone: 2164

**SNOTEL Stations Used:**
- Heen Latinee (1270:AK:SNTL) - 2,100 ft - Shared by both zones
- Long Lake (1001:AK:SNTL) - 840 ft - Shared by both zones

**Notes:**
- Forecasts may be intermittent or unavailable (center in development phase)
- System configured to fail gracefully with no forecasts and display SNOTEL weather data
- Heen Latinee station located 37 miles north of Juneau but provides best alpine data for region

**Status:** ✅ Good multi-elevation SNOTEL coverage, weather data available even when forecasts are not

---

#### 3. Haines (HAC) - ✅ ADDED 2026-02-05
**Zones Added:**
- Lutak - Zone ID: `haines-lutak` - NAC Zone: 2863
- Transitional - Zone ID: `haines-transitional` - NAC Zone: 2864
- Chilkat Pass - Zone ID: `haines-chilkat-pass` - NAC Zone: 2865

**SNOTEL Stations Used:**
- Moore Creek Bridge (1176:AK:SNTL) - 2,250 ft - Shared by all three zones
- Flower Mountain (1285:AK:SNTL) - 2,540 ft - Shared by all three zones

**Notes:**
- Forecasts may be qualitative analysis only (no numerical danger ratings expected)
- System displays SNOTEL weather data even without danger ratings
- Stations located 25-40 miles from Haines but best available options
- New Lutak weather station (2024) not yet in SNOTEL network

**Status:** ✅ Good multi-elevation SNOTEL coverage, weather data available even when forecasts are not

---

### Zones to Add (In Priority Order)

---

#### 1. Cordova (CAC) - NAC API Available
**Available SNOTEL:**
- Mt. Eyak SNOTEL (elevation TBD)
- Prince William Sound network (8 stations, various elevations)

**Station Assignment:**
```typescript
{
  zoneId: 'cordova',
  stations: [
    { triplet: 'mt-eyak', primary: true },
    // Add PWS station if relevant
  ]
}
```

**Rationale:** ✅ Good coverage, shares weather patterns with Valdez

---

#### 2. Haines (HAC) - NAC API Available
**Available SNOTEL:**
- New Lutak weather station (2024) - may not be SNOTEL network
- Limited options

**Station Assignment:**
```typescript
{
  zoneId: 'haines-lutak',  // or combine zones
  stations: [
    { triplet: 'lutak-station-if-available', primary: true },
  ]
}
```

**Rationale:** 🔴 Very limited SNOTEL - may need alternative weather sources

---

## SNOTEL Data Elements

### Standard Elements Fetched (from config)
- `SNWD` - Snow depth (inches)
- `WTEQ` - Snow water equivalent (inches)
- `PREC` - Precipitation accumulation (inches)
- `TOBS` - Air temperature observed (°F)
- `TMAX` - Air temperature maximum (°F)
- `TMIN` - Air temperature minimum (°F)
- `WSPD` - Wind speed average (mph) - *not all stations*
- `WSPDX` - Wind speed maximum (mph) - *not all stations*
- `WDIR` - Wind direction (degrees) - *not all stations*

### Time Windows
- **Primary:** Last 168 hours (7 days) hourly data
- **Calculations:** 24hr, 48hr, 72hr, 7-day changes
- **Cache:** 30 minutes TTL

---

## References

### Official SNOTEL Resources
- NRCS Alaska SNOTEL Map: https://www.weather.gov/aprfc/nrcs_AK_SWE
- Station List: https://wcc.sc.egov.usda.gov/nwcc/sntlsites.jsp?state=AK
- Element Codes: https://wcc.sc.egov.usda.gov/nwcc/rgrpt?report=elecodelist

### Avalanche Center Websites
- CNFAIC: https://cnfaic.org/
- HPAC: https://hpavalanche.org/
- AAIC (Valdez, Haines, Cordova, EARAC): https://alaskasnow.org/

### Configuration Files
- Zone Config: `supabase/functions/avalanche-summary/index.ts` (lines 19-102)
- Station Config: `supabase/functions/_shared/weather-station-config.ts` (lines 21-214)
- SNOTEL API: `supabase/functions/_shared/snotel-api.ts`

---

## Maintenance Notes

### When Adding New Zones
1. Identify available SNOTEL stations in/near zone
2. Verify station data quality and reliability
3. Check elevations match zone's typical avalanche terrain
4. Add all stations that provide meaningful coverage (all marked as `primary: true`)
5. Include stations at different elevations to cover multiple terrain bands
6. Update this document with rationale

### Station Selection Criteria
- ✅ **Elevation**: Should represent zone's avalanche terrain (typically 1,500-4,000 ft for alpine)
- ✅ **Location**: Within zone OR in same weather catchment area
- ✅ **Data Quality**: Reliable, consistent reporting
- ✅ **Coverage**: Fills gaps in elevation bands or geographic coverage
- ❌ **Avoid**: Stations too low (<500 ft for alpine zones), too far from zone, unreliable data

### Station Display Priority
- **All stations are displayed**: Every assigned station is marked as "primary" and shown on zone forecast cards
- **Multiple elevations**: Stations at different elevations provide comprehensive coverage of all terrain bands
- **Elevation diversity**: Include stations spanning from maritime/coastal (500-1000 ft) to alpine (2000+ ft) where available
- **Data redundancy**: Multiple stations provide backup if one station fails or has data gaps

---

**Document maintained by:** Kai Myers
**Project:** kaiconsulting.ai Avalanche Dashboard
**Last reviewed:** 2026-02-04
