---
name: add-avalanche-region
description: Research and configure a new avalanche forecast region. Analyzes avalanche centers, discovers API endpoints, identifies forecast zones, finds SNOTEL weather stations, and generates configuration needed to add regions to the dashboard.
argument-hint: <region or avalanche center>
---

# Add Avalanche Region Skill

## Usage
```
/add-avalanche-region <region or avalanche center>
```

**Examples:**
- `/add-avalanche-region Northwest Avalanche Center`
- `/add-avalanche-region Colorado Avalanche Information Center`
- `/add-avalanche-region Utah`
- `/add-avalanche-region British Columbia`
- `/add-avalanche-region Valdez`

## What This Skill Does

1. **Researches the Avalanche Center:**
   - Identifies the official avalanche center for the region
   - Finds their website and official forecast pages
   - Determines if they're part of the National Avalanche Center (NAC) network

2. **API Discovery:**
   - Checks if the center uses the NAC API (`https://api.avalanche.org/v2/public`)
   - Finds the center's `center_id` in the NAC database
   - Identifies all available forecast zones and their `zone_id`s
   - Tests API endpoints to verify data availability

3. **SNOTEL Station Research:**
   - Searches for SNOTEL weather stations near the forecast zones
   - Uses USDA NRCS station database
   - Finds station triplets, names, elevations, and coordinates
   - Recommends primary stations based on elevation and proximity to popular backcountry areas

4. **Configuration Generation:**
   - Generates zone configuration for `avalanche-summary/index.ts`
   - Generates weather station configuration for `weather-station-config.ts`
   - Provides sample danger ratings and data structure
   - Includes notes on data availability and limitations

## Output Format

The skill returns a structured markdown document with:

### 1. Region Overview
- Avalanche center name and website
- Geographic coverage area
- Number of forecast zones
- NAC API compatibility status

### 2. Zone Configuration
```typescript
// Add to ZONE_CONFIG array in supabase/functions/avalanche-summary/index.ts
{
  id: 'zone-slug',
  nacZoneId: '####',
  centerId: 'CENTER_ID',
  name: 'Zone Display Name',
  fallbackUrl: 'https://...',
  forecastUrl: 'https://...',
}
```

### 3. Weather Station Configuration
```typescript
// Add to WEATHER_STATION_CONFIG array in supabase/functions/_shared/weather-station-config.ts
{
  zoneId: 'zone-slug',
  stations: [
    {
      triplet: '###:ST:SNTL',
      name: 'Station Name',
      elevation: ####,
      latitude: ##.####,
      longitude: -##.####,
      primary: true,
    }
  ]
}
```

### 4. Implementation Notes
- Data source verification status
- Special considerations for the region
- Potential issues or limitations
- Testing recommendations

### 5. Next Steps
- Code changes needed
- Testing procedures
- Deployment considerations

## Technical Details

### NAC API Endpoints Used:
- `/products/map-layer` - List all centers and zones
- `/product?type=forecast&center_id=X&zone_id=Y` - Individual forecasts
- API requires User-Agent header to avoid 500 errors

### SNOTEL Data Sources:
- USDA NRCS reportGenerator: `https://wcc.sc.egov.usda.gov/reportGenerator`
- Station metadata: `https://wcc.sc.egov.usda.gov/nwcc/inventory`
- Data elements: SNWD (snow depth), PREC (precipitation), TOBS (temperature), WTEQ (SWE)

### Zone ID Discovery:
The skill searches multiple sources:
1. NAC API map-layer endpoint (most reliable)
2. Avalanche.org zone directory
3. Official center websites
4. Web scraping as fallback

### Station Selection Criteria:
- Elevation: Prioritize stations at treeline (4000-7000ft) or alpine elevations
- Proximity: Within 20 miles of forecast zone centroid
- Data quality: Active stations with recent data
- Relevance: Near popular backcountry areas when possible

## Example Workflow

```bash
# User runs the skill
/add-avalanche-region Northwest Avalanche Center

# Skill researches and returns:
# 1. Found NWAC with center_id='NWAC'
# 2. Identified 7 forecast zones (Olympics, West Slopes North, West Slopes Central, etc.)
# 3. Found 12 relevant SNOTEL stations
# 4. Generated configuration for all zones with recommended primary stations
# 5. Provided implementation checklist

# Developer reviews output and adds configuration to:
# - supabase/functions/avalanche-summary/index.ts (ZONE_CONFIG)
# - supabase/functions/_shared/weather-station-config.ts (WEATHER_STATION_CONFIG)

# Test the changes
npm run dev
# Visit /tools/avalanche and fetch conditions
```

## Limitations

- Only works for avalanche centers that use the NAC API or have parseable websites
- SNOTEL stations only available in western US, Alaska, and some Canadian locations
- Some centers may have restricted APIs or require authentication
- Web scraping fallback may break if website structures change

## Related Files

- `supabase/functions/avalanche-summary/index.ts` - Main backend logic
- `supabase/functions/_shared/weather-station-config.ts` - SNOTEL configuration
- `supabase/functions/_shared/snotel-api.ts` - SNOTEL data fetching
- `src/pages/AvalancheSummary.tsx` - Frontend display
- `src/lib/api/avalanche.ts` - Frontend API types and client

---

## Skill Implementation

When this skill is invoked, perform the following research and analysis:

### Step 1: Identify the Avalanche Center

Search for information about the specified region:
- Search for "[region] avalanche center" or "[region] avalanche forecast"
- Find the official website
- Verify it provides avalanche forecasts
- Check if listed on avalanche.org/centers

### Step 2: Query NAC API for Zone Data

Use the NAC API to find zones:
```bash
curl -H "User-Agent: research-tool" \
  "https://api.avalanche.org/v2/public/products/map-layer"
```

Parse the response to:
- Find the center_id for the region
- Extract all zones with zone_id, name, and coordinates
- Note current danger levels

### Step 3: Test Zone Forecast Data

For each zone found, test the forecast endpoint:
```bash
curl -H "User-Agent: research-tool" \
  "https://api.avalanche.org/v2/public/product?type=forecast&center_id=CENTER&zone_id=ZONE"
```

Verify:
- Forecast data structure is complete
- Danger ratings are available
- Avalanche problems are listed
- Weather data is present

### Step 4: Find SNOTEL Stations

Search for SNOTEL stations in the region:
- Query NRCS station inventory
- Filter by state/region matching the avalanche zones
- Find stations with appropriate elevations (2000-8000ft typically)
- Get station triplet format (ID:STATE:SNTL)
- Get coordinates and elevations
- Calculate proximity to zone centroids

### Step 5: Generate Configuration

Create ready-to-use configuration code:

**Zone Config:**
```typescript
{
  id: 'descriptive-zone-slug',
  nacZoneId: 'ZONE_ID_FROM_API',
  centerId: 'CENTER_ID',
  name: 'Official Zone Name',
  fallbackUrl: 'https://official-forecast-page',
  forecastUrl: 'https://official-forecast-page',
}
```

**Station Config:**
```typescript
{
  zoneId: 'matching-zone-slug',
  stations: [
    {
      triplet: 'STATION_ID:STATE:SNTL',
      name: 'Station Name',
      elevation: ELEVATION_IN_FEET,
      latitude: LAT,
      longitude: LONG,
      primary: true,
    }
  ]
}
```

### Step 6: Provide Implementation Guidance

Include:
- Summary of zones found
- Data availability notes
- Recommended primary stations per zone
- Special considerations
- Testing checklist

## Success Criteria

The skill output should enable a developer to:
1. Add the new region in under 30 minutes
2. Have all necessary IDs, URLs, and coordinates
3. Know which SNOTEL stations to use
4. Understand any data limitations or special cases
5. Successfully test the new region in the dashboard
