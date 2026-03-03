# Avalanche Tool Architecture Analysis

## Overview

The Avalanche Summary tool displays real-time avalanche forecasts and weather data for Southcentral Alaska zones. It combines data from:
- National Avalanche Center (NAC) API
- Web scraping (fallback)
- SNOTEL weather stations
- AI synthesis (Gemini)

## Current Implementation

### 1. Data Sources

#### National Avalanche Center API
**Base URL:** `https://api.avalanche.org/v2/public`

**Key Endpoints:**
- `/products/map-layer` - Lists all avalanche centers and zones with current danger ratings
- `/product?type=forecast&center_id=X&zone_id=Y` - Individual zone forecast with detailed data

**Important:** Requires `User-Agent` header to avoid 500 errors

**Current Centers Used:**
- CNFAIC (Chugach National Forest Avalanche Information Center)
- HPAC (Hatcher Pass Avalanche Center)

#### Web Scraping Fallback
Uses Firecrawl (`firecrawl-scrape` Supabase function) to scrape official forecast pages when API data is incomplete. Extracts markdown content for AI parsing.

#### SNOTEL Weather Stations
**API:** USDA NRCS reportGenerator
**Base URL:** `https://wcc.sc.egov.usda.gov/reportGenerator`

**Data Elements Fetched:**
- `SNWD` - Snow depth (inches)
- `PREC` - Precipitation accumulation (inches)
- `WTEQ` - Snow water equivalent (inches)
- `TOBS` - Air temperature (°F)
- `WSPD/WSPDX/WDIR` - Wind data (if available)

**Time Windows:**
- Fetches last 168 hours (7 days) of hourly data
- Calculates 24hr, 48hr, 72hr, and 7-day changes
- 30-minute cache TTL

### 2. File Structure

```
src/
├── pages/
│   └── AvalancheSummary.tsx           # Main UI page
├── lib/
│   └── api/
│       └── avalanche.ts                # Frontend API client & types
└── components/
    └── avalanche/
        ├── WeatherStationCard.tsx      # SNOTEL data display
        ├── TempSparkline.tsx           # Temperature visualization
        └── RadioScriptGenerator.tsx    # Radio show script feature

supabase/functions/
├── avalanche-summary/
│   └── index.ts                        # Main backend function (960 lines)
└── _shared/
    ├── weather-station-config.ts       # SNOTEL station mappings
    └── snotel-api.ts                   # SNOTEL data fetcher
```

### 3. Zone Configuration

**Location:** `supabase/functions/avalanche-summary/index.ts` (lines 20-61)

**Structure:**
```typescript
const ZONE_CONFIG = [
  {
    id: 'turnagain-girdwood',          // Internal identifier (kebab-case)
    nacZoneId: '2815',                  // NAC API zone ID
    centerId: 'CNFAIC',                 // Avalanche center ID
    name: 'Turnagain Pass / Girdwood',  // Display name
    fallbackUrl: 'https://cnfaic.org/forecast/turnagain/',  // Scraping URL
    forecastUrl: 'https://cnfaic.org/forecast/turnagain/',  // User-facing URL
  },
  // ... more zones
];
```

**Current Zones:**
1. Turnagain Pass / Girdwood (CNFAIC zone 2815)
2. Summit Lake (CNFAIC zone 2816)
3. Seward / Lost Lake (CNFAIC zone 2817)
4. Chugach State Park (CNFAIC zone 2818)
5. Hatcher Pass (HPAC zone 2152)

### 4. SNOTEL Weather Station Configuration

**Location:** `supabase/functions/_shared/weather-station-config.ts`

**Structure:**
```typescript
export interface WeatherStation {
  triplet: string;      // Format: stationId:state:network (e.g., '954:AK:SNTL')
  name: string;         // Display name
  elevation: number;    // Feet
  latitude: number;
  longitude: number;
  primary: boolean;     // Primary station for zone
}

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
      // ... additional stations
    ]
  },
  // ... more zones
];
```

**Current Station Mappings:**
- Turnagain/Girdwood: 2 stations (Turnagain Pass, Mt. Alyeska)
- Summit: 1 station (Summit Creek)
- Seward: 2 stations (Exit Glacier, Cooper Lake)
- Chugach State Park: 2 stations (Indian Pass, Anchorage Hillside)
- Hatcher Pass: 1 station (Independence Mine)

### 5. Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend (AvalancheSummary.tsx)                                 │
│  - User clicks "Get Current Conditions"                         │
│  - Calls avalancheApi.getSummary()                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Supabase Function (avalanche-summary)                           │
│                                                                  │
│ 1. Fetch map-layer (all zones, timestamps)                      │
│    GET /products/map-layer                                      │
│                                                                  │
│ 2. Fetch individual zone forecasts (parallel)                   │
│    For each zone in ZONE_CONFIG:                                │
│      GET /product?type=forecast&center_id=X&zone_id=Y           │
│      - Extract danger ratings (alpine/treeline/below)           │
│      - Extract avalanche problems (name, size, aspects)         │
│      - Extract weather discussion                               │
│      - Calculate freshness (expired, expiring, current, etc.)   │
│                                                                  │
│    Fallback if API fails:                                       │
│      - Call firecrawl-scrape with fallbackUrl                   │
│      - Extract markdown content                                 │
│      - Use map-layer danger ratings                             │
│                                                                  │
│ 3. Fetch SNOTEL observations (parallel)                         │
│    For each zone's stations:                                    │
│      - Fetch 168hrs of hourly data (SNWD, PREC, TOBS, WTEQ)    │
│      - Calculate 24hr/72hr/7day changes                         │
│      - Calculate trends (warming/cooling/stable)                │
│      - Determine data quality (good/partial/poor)               │
│                                                                  │
│ 4. AI Synthesis                                                 │
│    - Build context string with all zone data + SNOTEL obs       │
│    - Call Gemini 2.5 Flash via Lovable AI Gateway               │
│    - Request JSON with:                                         │
│      * quickTake (regional overview)                            │
│      * zones[] (detailed per-zone analysis)                     │
│      * weatherHighlights (weather synopsis)                     │
│      * bottomLine (final summary)                               │
│      * weatherValidation (confirmed/partial/discrepancy)        │
│                                                                  │
│ 5. Merge and return                                             │
│    - Attach freshness metadata                                  │
│    - Attach SNOTEL observations to zones                        │
│    - Return complete summary                                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Frontend Display                                                 │
│  - Quick Take card                                               │
│  - Zone Comparison Matrix (elevation pyramids)                  │
│  - Individual Zone Cards:                                        │
│    * Danger ratings (today/tomorrow)                             │
│    * Key message & travel advice                                 │
│    * Avalanche problems (with size, aspects, discussion)        │
│    * Weather station observations (if available)                 │
│  - Bottom Line card                                              │
│  - Data sources accordion                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 6. Key Data Structures

#### Danger Ratings
```typescript
type DangerRating = 'LOW' | 'MODERATE' | 'CONSIDERABLE' | 'HIGH' | 'EXTREME' | 'NO_RATING';

interface ElevationDanger {
  alpine: DangerRating;      // Above treeline
  treeline: DangerRating;    // At treeline
  belowTreeline: DangerRating; // Below treeline
}
```

#### Avalanche Problems
```typescript
interface AvalancheProblem {
  name: string;              // "Persistent Slab", "Wind Slab", etc.
  likelihood: string | null; // "Unlikely" to "Certain"
  size: {
    min: number;             // D-scale: 1-5 (D1=Small, D5=Historic)
    max: number;
  } | null;
  aspects: Array<{
    elevation: string;       // "Alpine", "Treeline", "Below Treeline"
    aspects: string[];       // ["N", "NE", "E", ...] compass directions
  }>;
  discussion: string | null; // Brief explanation
}
```

#### Weather Observations
```typescript
interface WeatherObservation {
  stationTriplet: string;
  stationName: string;
  elevation: number;
  timestamp: string;
  snow: {
    depth: number | null;              // Current depth (inches)
    depth24hrChange: number | null;    // 24hr change
    depth72hrChange: number | null;    // 72hr change
    depth7dayChange: number | null;    // 7-day change
    precip24hr: number | null;         // 24hr precipitation
    precip72hr: number | null;         // 72hr precipitation
    swe: number | null;                // Snow water equivalent
    snowPercentage24hr: number | null; // Density indicator
  };
  temperature: {
    current: number | null;
    high24hr: number | null;
    low24hr: number | null;
    avg24hr: number | null;
    trend: 'warming' | 'cooling' | 'stable' | null;
    hourly24hr: TempDataPoint[];       // For sparklines
  };
  wind: {
    speedAvg24hr: number | null;
    speedMax24hr: number | null;
    direction: string | null;
  } | null;
  dataQuality: 'good' | 'partial' | 'poor';
}
```

### 7. AI Synthesis Process

The AI (Gemini 2.5 Flash) receives:

**Input:**
- Structured forecast data for all zones
- Avalanche problems with aspects/elevations
- Weather discussions from forecasters
- Scraped content (if API data incomplete)
- SNOTEL observations with actual measurements

**Instructions:**
- Extract weather info from discussion text (snow amounts, wind, temps)
- Compare forecast predictions with actual SNOTEL measurements
- Set `weatherValidation` field (confirmed/partial/discrepancy/no_data)
- Note forecast freshness (expired warnings)
- Provide actionable travel advice
- Maintain exact zone IDs and danger ratings

**Output:**
JSON-structured summary with human-readable text for each zone

### 8. Frontend Features

#### Elevation Pyramid Visualization
Shows danger at three elevation bands:
```
    ┌──┐        Alpine
   ┌────┐       Treeline
  ┌──────┐      Below Treeline
```
Color-coded by danger rating.

#### Zone Comparison Matrix
Side-by-side table showing:
- Issue/expiration times
- Today's danger pyramids
- Tomorrow's danger pyramids
- Quick links to official forecasts

#### Weather Station Cards
Display SNOTEL observations with:
- Current conditions
- 24hr/72hr changes
- Temperature sparklines (hourly data)
- Data quality indicators
- Comparison with forecast

### 9. Caching Strategy

**SNOTEL Cache:**
- 30-minute TTL (stations update hourly)
- In-memory cache per function instance
- Key: station triplet

**No caching for:**
- NAC API calls (want fresh data)
- AI synthesis (unique each time)

### 10. Error Handling

**Graceful Degradation:**
1. NAC API fails → Try web scraping
2. Web scraping fails → Use map-layer only
3. SNOTEL fails → Continue without weather data
4. AI synthesis fails → Return structured data without summary

**Freshness Indicators:**
- `current` - Less than 24hrs old, expires in 6+ hours
- `recent` - 24+ hours old
- `expiring` - Expires within 6 hours
- `expired` - Past expiration time
- `unknown` - No timestamp data

## How to Add New Regions

### Step 1: Research the Region

Use the `/add-avalanche-region` skill:
```bash
/add-avalanche-region "Northwest Avalanche Center"
```

The skill will:
1. Find the avalanche center and verify NAC API support
2. Discover all forecast zones with IDs
3. Identify nearby SNOTEL stations
4. Generate configuration code

### Step 2: Add Zone Configuration

Edit [supabase/functions/avalanche-summary/index.ts:20-61](supabase/functions/avalanche-summary/index.ts#L20-L61)

Add to `ZONE_CONFIG` array:
```typescript
{
  id: 'new-zone-slug',        // Unique identifier (kebab-case)
  nacZoneId: '####',          // From skill output
  centerId: 'CENTER_ID',      // From skill output
  name: 'Display Name',       // User-friendly name
  fallbackUrl: 'https://...',  // Official forecast page
  forecastUrl: 'https://...',  // Link for "View Forecast"
}
```

### Step 3: Add SNOTEL Configuration

Edit [supabase/functions/_shared/weather-station-config.ts:21-111](supabase/functions/_shared/weather-station-config.ts#L21-L111)

Add to `WEATHER_STATION_CONFIG` array:
```typescript
{
  zoneId: 'new-zone-slug',  // Must match zone id from Step 2
  stations: [
    {
      triplet: '###:ST:SNTL',  // From skill output
      name: 'Station Name',
      elevation: ####,
      latitude: ##.####,
      longitude: -##.####,
      primary: true,           // One primary per zone
    }
  ]
}
```

### Step 4: Test

1. Deploy functions:
   ```bash
   supabase functions deploy avalanche-summary
   ```

2. Visit `/tools/avalanche` and click "Get Current Conditions"

3. Verify:
   - New zones appear in the list
   - Danger ratings display correctly
   - Weather station data loads
   - Links work

### Step 5: Add User Selection (Future Enhancement)

To allow users to select which zones to display:

1. Add zone selection UI to frontend
2. Store user preferences (localStorage or database)
3. Filter zones in frontend before displaying
4. Consider pagination/tabs for many zones

## Architecture Strengths

✅ **Robust Fallbacks:** API → Scraping → Map-layer
✅ **Real-time Weather:** SNOTEL hourly data with minimal lag
✅ **AI Synthesis:** Makes technical forecasts accessible
✅ **Structured Data:** Strong TypeScript types throughout
✅ **Graceful Degradation:** Continues with partial data
✅ **Caching:** Reduces SNOTEL API load

## Architecture Limitations

⚠️ **Hardcoded Zones:** Must redeploy to add regions
⚠️ **Single Region:** Currently Alaska-only, but extensible
⚠️ **SNOTEL Geographic Limit:** Western US & Alaska only
⚠️ **AI Cost:** Gemini API call on every fetch
⚠️ **No Persistence:** Fresh API calls each time (no database)
⚠️ **Rate Limits:** NAC API and SNOTEL both rate-limit

## Recommended Improvements

### 1. User Zone Selection
**Add ability for users to:**
- Select which zones to display
- Reorder zones
- Set favorite zones
- Save preferences to localStorage or database

**Implementation:**
- Add checkbox UI in frontend
- Filter `summary.zones` array based on selection
- Persist selection across sessions

### 2. Database Caching
**Cache forecast data to:**
- Reduce API calls
- Improve load times
- Track historical data
- Reduce AI costs

**Implementation:**
- Create `avalanche_forecasts` table
- Store API responses with timestamps
- Serve cached data if < 1 hour old
- Background job to refresh every hour

### 3. Dynamic Zone Management
**Allow adding zones without deployment:**
- Admin UI to add/edit zone configs
- Store configs in Supabase database
- Load configs at runtime

### 4. Multi-Region Support
**Expand beyond Alaska:**
- Use `/add-avalanche-region` skill for new regions
- Add region grouping in UI
- Support international centers (Canada, Europe, etc.)

### 5. Historical Data & Trends
**Track changes over time:**
- Store daily snapshots
- Show danger rating trends (graph)
- Compare with previous years
- Forecast accuracy tracking

### 6. Mobile Optimization
**Improve mobile experience:**
- Swipeable zone cards
- Compact comparison view
- Push notifications for danger level changes
- Offline support

## Related Documentation

- [NAC API Documentation](https://api.avalanche.org/v2/public)
- [SNOTEL Element Codes](https://wcc.sc.egov.usda.gov/nwcc/rgrpt?report=elecodelist)
- [Avalanche Danger Scale](https://avalanche.org/avalanche-encyclopedia/danger-scale/)
- [D-Scale Size Classification](https://avalanche.org/avalanche-encyclopedia/avalanche-size/)

## Contact & Maintenance

**Current Maintainer:** Kai Myers
**User-Agent:** `(kaiconsulting.lovable.app, kaimyers@alaskapacific.edu)`
**Deployment:** Supabase Edge Functions + Lovable.dev frontend

**When API breaks:**
1. Check NAC API status: https://api.avalanche.org/v2/public/products/map-layer
2. Verify SNOTEL: https://wcc.sc.egov.usda.gov/reportGenerator
3. Review function logs: `supabase functions logs avalanche-summary`
4. Test scraping fallback manually
