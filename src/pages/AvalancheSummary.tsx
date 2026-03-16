import { useState, useCallback, useRef } from "react";
import { Mountain, RefreshCw, AlertTriangle, Clock, Snowflake, ExternalLink, Info, CloudSnow, Compass, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { avalancheApi, type AvalancheSummary as AvalancheSummaryType, type AvalancheZone, type ScrapedZoneInfo, type DangerRating, type AvalancheProblem, type WeatherObservation, type NacWeatherProduct, type NwsForecast, type ZoneWeatherForecast } from "@/lib/api/avalanche";
import { analytics } from "@/lib/analytics";
import WeatherStationCard from "@/components/avalanche/WeatherStationCard";
import WeatherForecastCard from "@/components/avalanche/WeatherForecastCard";
import LoadingCard from "@/components/avalanche/LoadingCard";

// Hierarchical zone structure: Region → Avalanche Center → Zone
interface ForecastZone {
  id: string;
  name: string;
}
interface AvalancheCenter {
  id: string;
  name: string;
  zones: ForecastZone[];
}
interface Region {
  id: string;
  name: string;
  centers: AvalancheCenter[];
}
const REGION_STRUCTURE: Region[] = [
  {
    id: 'alaska',
    name: 'Alaska',
    centers: [
      {
        id: 'CNFAIC',
        name: 'Chugach National Forest Avalanche Center',
        zones: [
          { id: 'turnagain-girdwood', name: 'Turnagain Pass / Girdwood' },
          { id: 'summit', name: 'Summit Lake' },
          { id: 'seward', name: 'Seward / Lost Lake' },
          { id: 'chugach-state-park', name: 'Chugach State Park' },
        ],
      },
      {
        id: 'HPAC',
        name: 'Hatcher Pass Avalanche Center',
        zones: [{ id: 'hatcher-pass', name: 'Hatcher Pass' }],
      },
      {
        id: 'VAC',
        name: 'Valdez Avalanche Center',
        zones: [
          { id: 'valdez-maritime', name: 'Maritime' },
          { id: 'valdez-intermountain', name: 'Intermountain' },
          { id: 'valdez-continental', name: 'Continental' },
        ],
      },
      {
        id: 'CAC',
        name: 'Cordova Avalanche Center',
        zones: [{ id: 'cordova', name: 'Cordova' }],
      },
      {
        id: 'EARAC',
        name: 'Eastern Alaska Range Avalanche Center',
        zones: [
          { id: 'earac-north', name: 'North (Castner-Canwell)' },
          { id: 'earac-south', name: 'South (Summit)' },
        ],
      },
      {
        id: 'CAAC',
        name: 'Coastal Alaska Avalanche Center',
        zones: [
          { id: 'douglas-island', name: 'Douglas Island' },
          { id: 'juneau-mainland', name: 'Juneau Mainland' },
        ],
      },
      {
        id: 'HAC',
        name: 'Haines Avalanche Center',
        zones: [
          { id: 'haines-lutak', name: 'Lutak' },
          { id: 'haines-transitional', name: 'Transitional' },
          { id: 'haines-chilkat-pass', name: 'Chilkat Pass' },
        ],
      },
    ],
  },
  {
    id: 'pacific-northwest',
    name: 'Pacific Northwest',
    centers: [
      {
        id: 'NWAC',
        name: 'Northwest Avalanche Center',
        zones: [
          { id: 'olympics', name: 'Olympics' },
          { id: 'west-slopes-north', name: 'West Slopes North' },
          { id: 'west-slopes-central', name: 'West Slopes Central' },
          { id: 'west-slopes-south', name: 'West Slopes South' },
          { id: 'stevens-pass', name: 'Stevens Pass' },
          { id: 'snoqualmie-pass', name: 'Snoqualmie Pass' },
          { id: 'east-slopes-north', name: 'East Slopes North' },
          { id: 'east-slopes-central', name: 'East Slopes Central' },
          { id: 'east-slopes-south', name: 'East Slopes South' },
          { id: 'mt-hood', name: 'Mt Hood' },
        ],
      },
      {
        id: 'COAA',
        name: 'Central Oregon Avalanche Center',
        zones: [
          { id: 'central-cascades', name: 'Central Cascades' },
          { id: 'newberry', name: 'Newberry' },
        ],
      },
      {
        id: 'WAC',
        name: 'Wallowa Avalanche Center',
        zones: [
          { id: 'northern-wallowas', name: 'Northern Wallowas' },
          { id: 'southern-wallowas', name: 'Southern Wallowas' },
          { id: 'elkhorns', name: 'Elkhorns' },
          { id: 'blues', name: 'Blues' },
        ],
      },
      {
        id: 'SOAIX',
        name: 'Southern Oregon Avalanche Info Exchange',
        zones: [{ id: 'southern-oregon', name: 'Southern Oregon' }],
      },
    ],
  },
  {
    id: 'california-nevada',
    name: 'California & Nevada',
    centers: [
      {
        id: 'SAC',
        name: 'Sierra Avalanche Center',
        zones: [{ id: 'central-sierra-nevada', name: 'Central Sierra Nevada' }],
      },
      {
        id: 'ESAC',
        name: 'Eastern Sierra Avalanche Center',
        zones: [{ id: 'eastside-region', name: 'Eastside Region' }],
      },
      {
        id: 'BAC',
        name: 'Bridgeport Avalanche Center',
        zones: [{ id: 'bridgeport', name: 'Bridgeport' }],
      },
      {
        id: 'MSAC',
        name: 'Mount Shasta Avalanche Center',
        zones: [{ id: 'mount-shasta', name: 'Mount Shasta' }],
      },
    ],
  },
  {
    id: 'idaho',
    name: 'Idaho',
    centers: [
      {
        id: 'SNFAC',
        name: 'Sawtooth Avalanche Center',
        zones: [
          { id: 'banner-summit', name: 'Banner Summit' },
          { id: 'galena-summit-eastern-mtns', name: 'Galena Summit & Eastern Mtns' },
          { id: 'sawtooth-western-smoky-mtns', name: 'Sawtooth & Western Smoky Mtns' },
          { id: 'soldier-wood-river-valley-mtns', name: 'Soldier & Wood River Valley Mtns' },
        ],
      },
      {
        id: 'PAC',
        name: 'Payette Avalanche Center',
        zones: [
          { id: 'salmon-river-mountains', name: 'Salmon River Mountains' },
          { id: 'west-mountains', name: 'West Mountains' },
        ],
      },
      {
        id: 'IPAC',
        name: 'Idaho Panhandle Avalanche Center',
        zones: [
          { id: 'selkirk-mountains', name: 'Selkirk Mountains' },
          { id: 'west-cabinet-mountains', name: 'West Cabinet Mountains' },
          { id: 'east-cabinet-mountains', name: 'East Cabinet Mountains' },
          { id: 'silver-valley-bitterroot-mountains', name: 'Silver Valley & Bitterroot Mountains' },
          { id: 'purcell-mountains', name: 'Purcell Mountains' },
        ],
      },
    ],
  },
  {
    id: 'montana',
    name: 'Montana',
    centers: [
      {
        id: 'GNFAC',
        name: 'Gallatin NF Avalanche Center',
        zones: [
          { id: 'bridger-range', name: 'Bridger Range' },
          { id: 'northern-gallatin-range', name: 'Northern Gallatin Range' },
          { id: 'southern-gallatin-range', name: 'Southern Gallatin Range' },
          { id: 'northern-madison-range', name: 'Northern Madison Range' },
          { id: 'southern-madison-range', name: 'Southern Madison Range' },
          { id: 'lionhead-area', name: 'Lionhead Area' },
          { id: 'island-park', name: 'Island Park' },
          { id: 'cooke-city', name: 'Cooke City' },
        ],
      },
      {
        id: 'FAC',
        name: 'Flathead Avalanche Center',
        zones: [
          { id: 'whitefish-range', name: 'Whitefish Range' },
          { id: 'swan-range', name: 'Swan Range' },
          { id: 'flathead-range-glacier-np', name: 'Flathead Range & Glacier NP' },
        ],
      },
      {
        id: 'WCMAC',
        name: 'West Central Montana Avalanche Center',
        zones: [
          { id: 'seeley-lake', name: 'Seeley Lake' },
          { id: 'rattlesnake', name: 'Rattlesnake' },
          { id: 'bitterroot', name: 'Bitterroot' },
        ],
      },
    ],
  },
  {
    id: 'wyoming',
    name: 'Wyoming',
    centers: [
      {
        id: 'BTAC',
        name: 'Bridger-Teton Avalanche Center',
        zones: [
          { id: 'tetons', name: 'Tetons' },
          { id: 'togwotee-pass', name: 'Togwotee Pass' },
          { id: 'snake-river-range', name: 'Snake River Range' },
          { id: 'salt-river-wyoming-ranges', name: 'Salt River and Wyoming Ranges' },
        ],
      },
      {
        id: 'EWYAIX',
        name: 'Eastern Wyoming Avalanche Info Exchange',
        zones: [
          { id: 'big-horns', name: 'Big Horns' },
          { id: 'snowy-range', name: 'Snowy Range' },
          { id: 'sierra-madre', name: 'Sierra Madre' },
        ],
      },
    ],
  },
  {
    id: 'utah',
    name: 'Utah',
    centers: [
      {
        id: 'UAC',
        name: 'Utah Avalanche Center',
        zones: [
          { id: 'logan', name: 'Logan' },
          { id: 'ogden', name: 'Ogden' },
          { id: 'salt-lake', name: 'Salt Lake' },
          { id: 'provo', name: 'Provo' },
          { id: 'uintas', name: 'Uintas' },
          { id: 'skyline', name: 'Skyline' },
          { id: 'moab', name: 'Moab' },
          { id: 'abajos', name: 'Abajos' },
          { id: 'southwest', name: 'Southwest' },
        ],
      },
    ],
  },
  {
    id: 'colorado',
    name: 'Colorado',
    centers: [
      {
        id: 'CAIC',
        name: 'Colorado Avalanche Information Center',
        zones: [
          { id: 'caic-front-range-north', name: 'Front Range & Never Summer Mountains' },
          { id: 'caic-front-range-boulder', name: 'Front Range (Boulder)' },
          { id: 'caic-front-range-south', name: 'Front Range South & Pikes Peak' },
          { id: 'caic-vail-summit-county', name: 'Vail & Summit County' },
          { id: 'caic-elk-mountains', name: 'Elk Mountains (Aspen)' },
          { id: 'caic-sawatch-range', name: 'Sawatch Range' },
          { id: 'caic-grand-mesa-west-elk', name: 'Grand Mesa & Flat Tops' },
          { id: 'caic-park-range', name: 'Park Range (Steamboat)' },
          { id: 'caic-northern-san-juan', name: 'Northern San Juan Mountains' },
          { id: 'caic-southern-san-juan', name: 'Southern San Juan Mountains' },
          { id: 'caic-sangre-de-cristo', name: 'Sangre de Cristo Mountains' },
        ],
      },
    ],
  },
  {
    id: 'new-mexico-arizona',
    name: 'New Mexico & Arizona',
    centers: [
      {
        id: 'TAC',
        name: 'Taos Avalanche Center',
        zones: [{ id: 'northern-new-mexico', name: 'Northern New Mexico' }],
      },
      {
        id: 'KPAC',
        name: 'Kachina Peaks Avalanche Center',
        zones: [{ id: 'san-francisco-peaks', name: 'San Francisco Peaks' }],
      },
    ],
  },
  {
    id: 'northeast',
    name: 'Northeast',
    centers: [
      {
        id: 'MWAC',
        name: 'Mount Washington Avalanche Center',
        zones: [{ id: 'presidential-range', name: 'Presidential Range' }],
      },
    ],
  },
];

// Flatten structure for backward compatibility
const AVAILABLE_ZONES = REGION_STRUCTURE.flatMap(region => region.centers.flatMap(center => center.zones.map(zone => ({
  id: zone.id,
  name: zone.name,
  center: center.id
}))));
// Zone ID → Center ID lookup (built from REGION_STRUCTURE)
const ZONE_TO_CENTER: Record<string, string> = {};
for (const region of REGION_STRUCTURE) {
  for (const center of region.centers) {
    for (const zone of center.zones) {
      ZONE_TO_CENTER[zone.id] = center.id;
    }
  }
}

const ZONE_PREFS_KEY = 'avalanche-zone-selection';

// Hierarchical Zone Selector Component
interface HierarchicalZoneSelectorProps {
  selectedZoneIds: string[];
  onSelectionChange: (zoneIds: string[]) => void;
}
function HierarchicalZoneSelector({
  selectedZoneIds,
  onSelectionChange
}: HierarchicalZoneSelectorProps) {
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [expandedCenters, setExpandedCenters] = useState<Set<string>>(new Set(REGION_STRUCTURE.flatMap(r => r.centers.map(c => `${r.id}-${c.id}`))));
  const toggleRegion = (regionId: string) => {
    setExpandedRegions(prev => {
      const next = new Set(prev);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  };
  const toggleCenter = (regionId: string, centerId: string) => {
    const key = `${regionId}-${centerId}`;
    setExpandedCenters(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };
  const getRegionZones = (region: Region): string[] => {
    return region.centers.flatMap(center => center.zones.map(zone => zone.id));
  };
  const getCenterZones = (center: AvalancheCenter): string[] => {
    return center.zones.map(zone => zone.id);
  };
  const isRegionSelected = (region: Region): boolean | 'indeterminate' => {
    const regionZones = getRegionZones(region);
    const selectedCount = regionZones.filter(id => selectedZoneIds.includes(id)).length;
    if (selectedCount === 0) return false;
    if (selectedCount === regionZones.length) return true;
    return 'indeterminate';
  };
  const isCenterSelected = (center: AvalancheCenter): boolean | 'indeterminate' => {
    const centerZones = getCenterZones(center);
    const selectedCount = centerZones.filter(id => selectedZoneIds.includes(id)).length;
    if (selectedCount === 0) return false;
    if (selectedCount === centerZones.length) return true;
    return 'indeterminate';
  };
  const handleRegionToggle = (region: Region) => {
    const regionZones = getRegionZones(region);
    const isSelected = isRegionSelected(region);
    if (isSelected === true) {
      // Deselect all zones in region (only if other zones remain)
      const newSelection = selectedZoneIds.filter(id => !regionZones.includes(id));
      if (newSelection.length > 0) {
        onSelectionChange(newSelection);
      }
    } else {
      // Select all zones in region
      const newSelection = [...new Set([...selectedZoneIds, ...regionZones])];
      onSelectionChange(newSelection);
    }
  };
  const handleCenterToggle = (center: AvalancheCenter) => {
    const centerZones = getCenterZones(center);
    const isSelected = isCenterSelected(center);
    if (isSelected === true) {
      // Deselect all zones in center (only if other zones remain)
      const newSelection = selectedZoneIds.filter(id => !centerZones.includes(id));
      if (newSelection.length > 0) {
        onSelectionChange(newSelection);
      }
    } else {
      // Select all zones in center
      const newSelection = [...new Set([...selectedZoneIds, ...centerZones])];
      onSelectionChange(newSelection);
    }
  };
  const handleZoneToggle = (zoneId: string) => {
    if (selectedZoneIds.includes(zoneId)) {
      // Only deselect if other zones remain
      const newSelection = selectedZoneIds.filter(id => id !== zoneId);
      if (newSelection.length > 0) {
        onSelectionChange(newSelection);
      }
    } else {
      onSelectionChange([...selectedZoneIds, zoneId]);
    }
  };
  return <div className="space-y-3">
      {REGION_STRUCTURE.map(region => {
      const isExpanded = expandedRegions.has(region.id);
      const regionSelection = isRegionSelected(region);
      return <div key={region.id} className="border rounded-lg overflow-hidden">
            {/* Region Header */}
            <div className="bg-muted/50 p-3 flex items-center gap-2">
              <button onClick={() => toggleRegion(region.id)} className="p-1 hover:bg-background rounded transition-colors">
                {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>
              <Checkbox checked={regionSelection} onCheckedChange={() => handleRegionToggle(region)} className="data-[state=indeterminate]:bg-primary/50" />
              <button onClick={() => handleRegionToggle(region)} className="flex-1 text-left font-medium text-sm hover:underline">
                {region.name}
              </button>
              <Badge variant="outline" className="text-xs">
                {getRegionZones(region).filter(id => selectedZoneIds.includes(id)).length} / {getRegionZones(region).length}
              </Badge>
            </div>

            {/* Region Content */}
            {isExpanded && <div className="p-3 space-y-2">
                {region.centers.map(center => {
            const centerKey = `${region.id}-${center.id}`;
            const isCenterExpanded = expandedCenters.has(centerKey);
            const centerSelection = isCenterSelected(center);
            return <div key={center.id} className="border rounded-md overflow-hidden">
                      {/* Center Header */}
                      <div className="bg-background p-2 flex items-center gap-2">
                        <button onClick={() => toggleCenter(region.id, center.id)} className="p-1 hover:bg-muted rounded transition-colors">
                          {isCenterExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>
                        <Checkbox checked={centerSelection} onCheckedChange={() => handleCenterToggle(center)} className="data-[state=indeterminate]:bg-primary/50" />
                        <button onClick={() => handleCenterToggle(center)} className="flex-1 text-left text-sm font-medium hover:underline">
                          {center.name}
                        </button>
                        <Badge variant="secondary" className="text-xs">
                          {getCenterZones(center).filter(id => selectedZoneIds.includes(id)).length} / {center.zones.length}
                        </Badge>
                      </div>

                      {/* Center Zones */}
                      {isCenterExpanded && <div className="p-2 pl-10 space-y-1.5 bg-muted/20">
                          {center.zones.map(zone => <div key={zone.id} className="flex items-center gap-2">
                              <Checkbox checked={selectedZoneIds.includes(zone.id)} onCheckedChange={() => handleZoneToggle(zone.id)} id={zone.id} />
                              <label htmlFor={zone.id} className="text-sm cursor-pointer hover:underline flex-1">
                                {zone.name}
                              </label>
                            </div>)}
                        </div>}
                    </div>;
          })}
              </div>}
          </div>;
    })}
    </div>;
}
const dangerColors: Record<DangerRating, {
  bg: string;
  text: string;
  border: string;
}> = {
  LOW: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-500"
  },
  MODERATE: {
    bg: "bg-yellow-400",
    text: "text-black",
    border: "border-yellow-400"
  },
  CONSIDERABLE: {
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-500"
  },
  HIGH: {
    bg: "bg-red-600",
    text: "text-white",
    border: "border-red-600"
  },
  EXTREME: {
    bg: "bg-black",
    text: "text-white",
    border: "border-black"
  },
  NO_RATING: {
    bg: "bg-gray-300",
    text: "text-gray-700",
    border: "border-gray-300"
  }
};
const freshnessConfig = {
  current: {
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Current"
  },
  recent: {
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    label: "Recent"
  },
  expiring: {
    color: "text-orange-600",
    bg: "bg-orange-100",
    label: "Expiring Soon"
  },
  expired: {
    color: "text-red-600",
    bg: "bg-red-100",
    label: "Expired"
  },
  unknown: {
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "Unknown"
  }
};

// Size labels for D-scale - helper to format size values (shows exact decimal values)
function formatSize(value: number): string {
  // Show exact D-scale value
  return `D${value}`;
}
const sizeLabels: Record<number, string> = {
  1: "D1 (Small)",
  2: "D2 (Large)",
  3: "D3 (Very Large)",
  4: "D4 (Historic)",
  5: "D5 (Historic)"
};
function ElevationPyramid({
  danger,
  size = "normal"
}: {
  danger: {
    alpine: DangerRating;
    treeline: DangerRating;
    belowTreeline: DangerRating;
  };
  size?: "small" | "normal";
}) {
  const isSmall = size === "small";
  const alpineWidth = isSmall ? "w-6" : "w-8";
  const treelineWidth = isSmall ? "w-9" : "w-12";
  const belowWidth = isSmall ? "w-12" : "w-16";
  const height = isSmall ? "h-3" : "h-4";
  const fontSize = isSmall ? "text-[7px]" : "text-[9px]";
  return <div className="flex flex-col items-center gap-0.5">
      <div className={`${alpineWidth} ${height} ${dangerColors[danger.alpine]?.bg || "bg-gray-300"} rounded-t-md flex items-center justify-center`}>
        <span className={`${fontSize} font-bold ${dangerColors[danger.alpine]?.text || "text-gray-700"}`}>A</span>
      </div>
      <div className={`${treelineWidth} ${height} ${dangerColors[danger.treeline]?.bg || "bg-gray-300"} flex items-center justify-center`}>
        <span className={`${fontSize} font-bold ${dangerColors[danger.treeline]?.text || "text-gray-700"}`}>TL</span>
      </div>
      <div className={`${belowWidth} ${height} ${dangerColors[danger.belowTreeline]?.bg || "bg-gray-300"} rounded-b-md flex items-center justify-center`}>
        <span className={`${fontSize} font-bold ${dangerColors[danger.belowTreeline]?.text || "text-gray-700"}`}>
          BTL
        </span>
      </div>
    </div>;
}

// Component to display detailed avalanche problem info
function AvalancheProblemCard({
  problem
}: {
  problem: AvalancheProblem;
}) {
  const hasAspects = problem.aspects && problem.aspects.length > 0;
  return <div className="p-3 bg-muted/50 rounded-lg space-y-2 border border-border/50">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-sm text-foreground">{problem.name}</span>
        {problem.likelihood && <Badge variant="outline" className="text-xs shrink-0">
            {problem.likelihood}
          </Badge>}
      </div>

      {/* Size Range */}
      {problem.size && <div className="text-xs text-muted-foreground">
          <span className="font-medium">Size:</span>{" "}
          {problem.size.min === problem.size.max ? formatSize(problem.size.min) : `${formatSize(problem.size.min)} to ${formatSize(problem.size.max)}`}
        </div>}

      {/* Elevation/Aspect Summary */}
      {hasAspects && <div className="text-xs space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground font-medium">
            <Compass className="h-3 w-3" />
            <span>Elevation & Aspect</span>
          </div>
          <div className="pl-4 space-y-0.5">
            {problem.aspects.map((a, i) => <div key={i} className="text-muted-foreground">
                <span className="font-medium text-foreground/80">{a.elevation}:</span>{" "}
                {a.aspects.length === 8 ? "All aspects" : a.aspects.join(", ")}
              </div>)}
          </div>
        </div>}

      {/* Discussion */}
      {problem.discussion && <p className="text-xs text-muted-foreground pt-1 border-t border-border/30">{problem.discussion}</p>}
    </div>;
}
function ZoneCard({
  zone,
  isSnotelLoading = false,
  isWeatherForecastLoading = false,
  weatherForecast
}: {
  zone: AvalancheZone;
  isSnotelLoading?: boolean;
  isWeatherForecastLoading?: boolean;
  weatherForecast?: ZoneWeatherForecast;
}) {
  const freshness = freshnessConfig[zone.freshness.status];
  const todayForecast = zone.forecast?.[0];
  const tomorrowForecast = zone.forecast?.[1];
  return <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-display">{zone.name}</CardTitle>
            <CardDescription className="mt-1 space-y-1">
              <div className="text-xs text-muted-foreground">
                {zone.freshness.issueDate && <span>Issued: {zone.freshness.issueDate}</span>}
              </div>
              <div className="text-xs text-muted-foreground">
                {zone.freshness.expiresDate && <span className={zone.freshness.status === "expired" ? "text-red-600 font-medium" : zone.freshness.status === "expiring" ? "text-orange-600 font-medium" : ""}>
                    Expires: {zone.freshness.expiresDate}
                  </span>}
              </div>
            </CardDescription>
          </div>
          <Badge className={`${freshness.bg} ${freshness.color}`}>{freshness.label}</Badge>
        </div>

        {/* Forecast Link */}
        {zone.forecastUrl && <a href={zone.forecastUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
            View Official Forecast <ExternalLink className="h-3 w-3" />
          </a>}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Elevation Danger Display */}
        {todayForecast && <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 text-center">Today</p>
              <div className="flex justify-center">
                <ElevationPyramid danger={todayForecast.danger} />
              </div>
            </div>
            {tomorrowForecast && <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 text-center">Tomorrow</p>
                <div className="flex justify-center">
                  <ElevationPyramid danger={tomorrowForecast.danger} />
                </div>
              </div>}
          </div>}

        <div>
          <p className="text-sm font-medium text-foreground mb-1">Key Message</p>
          <p className="text-sm text-muted-foreground">{zone.keyMessage}</p>
        </div>

        {/* Collapsible detail sections */}
        <Accordion type="multiple" className="space-y-1">

          {/* Avalanche Problems */}
          {zone.problems && zone.problems.length > 0 && (
            <AccordionItem value="problems" className="border rounded-lg px-3">
              <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Avalanche Problems ({zone.problems.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pb-2">
                  {zone.problems.map((problem, i) => <AvalancheProblemCard key={i} problem={problem} />)}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Hazard Discussion — shown for centers that don't provide structured problem data */}
          {(!zone.problems || zone.problems.length === 0) && zone.hazardDiscussion && (
            <AccordionItem value="hazard-discussion" className="border rounded-lg px-3">
              <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Hazard Discussion
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line pb-2">{zone.hazardDiscussion}</p>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Travel Advice */}
          <AccordionItem value="travel-advice" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
              <span className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-blue-500" />
                Travel Advice
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground pb-2">{zone.travelAdvice}</p>
            </AccordionContent>
          </AccordionItem>

          {/* Weather Outlook (forecast/what's coming) */}
          {(weatherForecast?.nacWeather || weatherForecast?.nwsForecast || weatherForecast?.avgDiscussion || weatherForecast?.avgLocations || (isWeatherForecastLoading && !weatherForecast)) && (
            <AccordionItem value="weather-outlook" className="border rounded-lg border-sky-500/30 px-3">
              <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                <span className="flex items-center gap-2">
                  <CloudSnow className="h-4 w-4 text-sky-500" />
                  Weather Outlook
                  {weatherForecast?.nacWeather && <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">Avy Center</Badge>}
                  {weatherForecast?.nwsForecast && <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">NWS Mountain</Badge>}
                  {weatherForecast?.avgDiscussion && <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">AVG</Badge>}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pb-2">
                  <WeatherForecastCard
                    nacWeather={weatherForecast?.nacWeather}
                    nwsForecast={weatherForecast?.nwsForecast}
                    avgDiscussion={weatherForecast?.avgDiscussion}
                    avgLocations={weatherForecast?.avgLocations}
                    isLoading={isWeatherForecastLoading && !weatherForecast}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Weather Station Observations (what already happened) */}
          {zone.weatherObservations && zone.weatherObservations.length > 0 && (
            <AccordionItem value="station-obs" className="border rounded-lg border-blue-500/30 px-3">
              <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                <span className="flex items-center gap-2">
                  <Snowflake className="h-4 w-4 text-blue-500" />
                  Weather Station Observations ({zone.weatherObservations.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pb-2">
                  <WeatherStationCard
                    observations={zone.weatherObservations}
                    note={zone.id === 'douglas-island' ? 'Note: These stations are outside the forecast zone. Expect high spatial variability.' : undefined}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

        </Accordion>

        {!zone.weatherObservations && isSnotelLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading weather station data...
          </div>
        )}
      </CardContent>
    </Card>;
}
function ZoneComparisonMatrix({
  zones
}: {
  zones: AvalancheZone[];
}) {
  return <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Quick Comparison
        </CardTitle>
        <CardDescription>Side-by-side danger ratings with elevation pyramids</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-medium text-muted-foreground text-xs w-24">Zone</th>
                {zones.map(zone => {
                return <th key={zone.id} className="text-center py-2 px-2 font-medium">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-semibold">{zone.name}</span>
                        {zone.forecastUrl && <a href={zone.forecastUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                            Forecast <ExternalLink className="h-2.5 w-2.5" />
                          </a>}
                      </div>
                    </th>;
              })}
              </tr>
            </thead>
            <tbody>
              {/* Issued/Expires */}
              <tr className="border-b">
                <td className="py-2 px-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Issued
                  </div>
                </td>
                {zones.map(zone => <td key={zone.id} className="py-2 px-2 text-center text-xs">
                    {zone.freshness.issueDate || "N/A"}
                  </td>)}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-2 text-xs text-muted-foreground">Expires</td>
                {zones.map(zone => {
                const isExpired = zone.freshness.status === "expired";
                const isExpiring = zone.freshness.status === "expiring";
                return <td key={zone.id} className={`py-2 px-2 text-center text-xs ${isExpired ? "text-red-600 font-medium" : isExpiring ? "text-orange-600 font-medium" : ""}`}>
                      {zone.freshness.expiresDate || "N/A"}
                    </td>;
              })}
              </tr>

              {/* Today's Danger - Pyramids */}
              <tr className="border-b bg-muted/30">
                <td colSpan={zones.length + 1} className="py-1 px-2 text-xs font-semibold text-muted-foreground">
                  Today
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-2 text-xs text-muted-foreground">Danger</td>
                {zones.map(zone => <td key={zone.id} className="py-3 px-2">
                    <div className="flex justify-center">
                      <ElevationPyramid danger={zone.forecast?.[0]?.danger || {
                    alpine: "NO_RATING",
                    treeline: "NO_RATING",
                    belowTreeline: "NO_RATING"
                  }} size="small" />
                    </div>
                  </td>)}
              </tr>

              {/* Tomorrow's Danger - Pyramids */}
              <tr className="border-b bg-muted/30">
                <td colSpan={zones.length + 1} className="py-1 px-2 text-xs font-semibold text-muted-foreground">
                  Tomorrow
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-2 text-xs text-muted-foreground">Danger</td>
                {zones.map(zone => <td key={zone.id} className="py-3 px-2">
                    <div className="flex justify-center">
                      <ElevationPyramid danger={zone.forecast?.[1]?.danger || {
                    alpine: "NO_RATING",
                    treeline: "NO_RATING",
                    belowTreeline: "NO_RATING"
                  }} size="small" />
                    </div>
                  </td>)}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Danger Rating Legend:</p>
          <div className="flex flex-wrap gap-2">
            {(["LOW", "MODERATE", "CONSIDERABLE", "HIGH", "EXTREME"] as DangerRating[]).map(rating => <div key={rating} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded ${dangerColors[rating].bg}`} />
                <span className="text-xs text-muted-foreground">{rating}</span>
              </div>)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <strong>A</strong> = Alpine (above treeline) · <strong>TL</strong> = Treeline · <strong>BTL</strong> = Below
            Treeline
          </p>
        </div>
      </CardContent>
    </Card>;
}
export default function AvalancheSummaryPage() {
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const videoPlayedRef = useRef(false);
  const dataReadyRef = useRef(false);
  const [isSnotelLoading, setIsSnotelLoading] = useState(false);
  const [isQuickTakeLoading, setIsQuickTakeLoading] = useState(false);
  const [quickTakeEnabled, setQuickTakeEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('avalanche-quick-take-enabled');
      return saved !== null ? saved === 'true' : true; // default on
    } catch { return true; }
  });
  const [isWeatherForecastLoading, setIsWeatherForecastLoading] = useState(false);
  const [weatherForecastData, setWeatherForecastData] = useState<{
    centerWeather: Record<string, NacWeatherProduct>;
    zoneNwsForecasts: Record<string, NwsForecast>;
    centerAvgDiscussions: Record<string, import('@/lib/api/avalanche').AvgDiscussion>;
    zoneAvgLocations: Record<string, import('@/lib/api/avalanche').AvgLocation[]>;
  } | null>(null);
  const [summary, setSummary] = useState<AvalancheSummaryType | null>(null);
  const [scrapedAt, setScrapedAt] = useState<string | null>(null);
  const [zonesScraped, setZonesScraped] = useState<ScrapedZoneInfo[]>([]);
  const [loadSource, setLoadSource] = useState<'cached' | 'live' | null>(null);

  // Default to CNFAIC zones only
  const DEFAULT_ZONE_IDS = AVAILABLE_ZONES.filter(z => z.center === 'CNFAIC').map(z => z.id);
  
  // Zone selection state - load from localStorage or default to CNFAIC zones
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(ZONE_PREFS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validIds = parsed.filter((id: string) => AVAILABLE_ZONES.some(z => z.id === id));
        return validIds.length > 0 ? validIds : DEFAULT_ZONE_IDS;
      }
    } catch (error) {
      console.error('Failed to load zone preferences:', error);
    }
    return DEFAULT_ZONE_IDS;
  });

  // Reveal results once both data is loaded and video has played once
  const tryRevealResults = useCallback(() => {
    if (dataReadyRef.current && videoPlayedRef.current) {
      setShowVideo(false);
      setShowResults(true);
    }
  }, []);

  // Save zone selection to localStorage whenever it changes
  const updateSelectedZones = (zoneIds: string[]) => {
    setSelectedZoneIds(zoneIds);
    try {
      localStorage.setItem(ZONE_PREFS_KEY, JSON.stringify(zoneIds));
    } catch (error) {
      console.error('Failed to save zone preferences:', error);
    }
  };

  // Fetch weather station observations and merge into summary
  const fetchSnotel = useCallback(async (zoneIds: string[]) => {
    setIsSnotelLoading(true);
    try {
      const snotelResponse = await avalancheApi.getSnotelObservations(zoneIds);
      if (snotelResponse.success && snotelResponse.observations) {
        setSummary(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            zones: prev.zones.map(zone => ({
              ...zone,
              weatherObservations: snotelResponse.observations?.[zone.id] || zone.weatherObservations,
            })),
          };
        });
      }
    } catch (error) {
      console.error('SNOTEL fetch error:', error);
    } finally {
      setIsSnotelLoading(false);
    }
  }, []);

  // Fetch weather forecasts (NAC weather products + NOAA NWS)
  const fetchWeatherForecast = useCallback(async (zoneIds: string[]) => {
    setIsWeatherForecastLoading(true);
    try {
      const response = await avalancheApi.getWeatherForecast(zoneIds);
      if (response.success) {
        setWeatherForecastData({
          centerWeather: response.centerWeather || {},
          zoneNwsForecasts: response.zoneNwsForecasts || {},
          centerAvgDiscussions: response.centerAvgDiscussions || {},
          zoneAvgLocations: response.zoneAvgLocations || {},
        });
      }
    } catch (error) {
      console.error('Weather forecast fetch error:', error);
    } finally {
      setIsWeatherForecastLoading(false);
    }
  }, []);

  // Resolve weather forecast data for a specific zone
  const getZoneWeatherForecast = useCallback((zoneId: string): ZoneWeatherForecast | undefined => {
    if (!weatherForecastData) return undefined;
    const centerId = ZONE_TO_CENTER[zoneId];
    const nacWeather = centerId ? weatherForecastData.centerWeather[centerId] : undefined;
    const nwsForecast = weatherForecastData.zoneNwsForecasts[zoneId];
    const avgDiscussion = centerId ? weatherForecastData.centerAvgDiscussions[centerId] : undefined;
    const avgLocations = weatherForecastData.zoneAvgLocations[zoneId];
    if (!nacWeather && !nwsForecast && !avgDiscussion && !avgLocations) return undefined;
    return { nacWeather, nwsForecast, avgDiscussion, avgLocations };
  }, [weatherForecastData]);

  // Use a ref so generateQuickTake always reads the current value
  const quickTakeEnabledRef = useRef(quickTakeEnabled);
  quickTakeEnabledRef.current = quickTakeEnabled;

  // Generate Quick Take from the AI using the user's selected zones
  const generateQuickTake = useCallback(async (zones: AvalancheZone[]) => {
    if (!quickTakeEnabledRef.current || zones.length === 0) return;
    setIsQuickTakeLoading(true);
    try {
      // Enrich zones with centerId for the edge function
      const zonesWithCenter = zones.map(z => ({
        ...z,
        centerId: ZONE_TO_CENTER[z.id] || 'unknown',
      }));
      console.log('🤖 Generating Quick Take for', zonesWithCenter.length, 'zones');
      const response = await avalancheApi.generateQuickTake(zonesWithCenter);
      console.log('🤖 Quick Take response:', response.success, response.quickTake?.slice(0, 100));
      if (response.success && response.quickTake) {
        setSummary(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            quickTake: response.quickTake || prev.quickTake,
            weatherHighlights: response.weatherHighlights || prev.weatherHighlights,
          };
        });
      }
    } catch (error) {
      console.error('Quick Take generation error:', error);
    } finally {
      setIsQuickTakeLoading(false);
    }
  }, []);

  // Toggle Quick Take and persist preference
  const toggleQuickTake = useCallback((enabled: boolean) => {
    setQuickTakeEnabled(enabled);
    try { localStorage.setItem('avalanche-quick-take-enabled', String(enabled)); } catch {}
  }, []);

  const fetchSummary = async () => {
    if (selectedZoneIds.length === 0) {
      toast({
        title: "No zones selected",
        description: "Please select at least one zone to view forecasts",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    setShowVideo(true);
    setShowResults(false);
    videoPlayedRef.current = false;
    dataReadyRef.current = false;
    setLoadSource(null);
    console.log('🔍 Fetching forecasts for zones:', selectedZoneIds);
    analytics.toolUsed("Avalanche Summary", "fetch_started", {
      selectedZoneCount: selectedZoneIds.length
    });

    try {
      // Phase 1: Try cached forecasts first (fast path)
      const cachedResponse = await avalancheApi.getCachedForecasts(selectedZoneIds);
      
      const hasMissingZones = Boolean(cachedResponse.missingZoneIds?.length);
      const hasMissingSummaries = Boolean(cachedResponse.missingSummaryCenterIds?.length);

      if (cachedResponse.success && cachedResponse.zones && cachedResponse.zones.length > 0 && !hasMissingZones && !hasMissingSummaries) {
        // All zones are cached - show immediately!
        console.log('✅ All zones cached, showing instantly');
        
        // Build a summary-like object from cached zones
        // The cached data already has the synthesized zone data
        const cachedSummary: AvalancheSummaryType = {
          quickTake: '', // Will be generated fresh by AI
          zones: cachedResponse.zones,
          weatherHighlights: '',
          bottomLine: '',
        };

        setSummary(cachedSummary);
        setScrapedAt(new Date().toISOString());
        setLoadSource('cached');
        setIsLoading(false);
        dataReadyRef.current = true;
        tryRevealResults();

        // Phase 2, 3, & Quick Take: Fetch station observations, weather forecasts, and generate Quick Take in parallel
        fetchSnotel(selectedZoneIds);
        fetchWeatherForecast(selectedZoneIds);
        generateQuickTake(cachedResponse.zones);

        analytics.toolUsed("Avalanche Summary", "fetch_cached_success");
        return;
      }

      // Fallback: Batch by center to avoid overloading a single edge function call
      // Group missing zones by their center ID
      const missingZoneIds = cachedResponse.missingZoneIds && cachedResponse.missingZoneIds.length > 0
        ? cachedResponse.missingZoneIds
        : selectedZoneIds;
      const centerGroups = new Map<string, string[]>();
      for (const zoneId of missingZoneIds) {
        const zoneInfo = AVAILABLE_ZONES.find(z => z.id === zoneId);
        const centerId = zoneInfo?.center || 'UNKNOWN';
        if (!centerGroups.has(centerId)) centerGroups.set(centerId, []);
        centerGroups.get(centerId)!.push(zoneId);
      }

      console.log(`⚠️ Cache miss for ${missingZoneIds.length} zones across ${centerGroups.size} centers, fetching per-center`);

      // Fetch centers in throttled batches of 4 to avoid rate limits
      const BATCH_SIZE = 4;
      const centerEntries = Array.from(centerGroups.entries());
      const centerResults: Array<{ centerId: string; response: any }> = [];

      for (let i = 0; i < centerEntries.length; i += BATCH_SIZE) {
        const batch = centerEntries.slice(i, i + BATCH_SIZE);
        console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(centerEntries.length / BATCH_SIZE)}: ${batch.map(([c]) => c).join(', ')}`);
        const batchResults = await Promise.all(
          batch.map(([centerId, zoneIds]) =>
            avalancheApi.getSummary(zoneIds).then(response => ({
              centerId,
              response,
            }))
          )
        );
        centerResults.push(...batchResults);
      }

      // Merge all center results into a single summary
      const allZones: AvalancheZone[] = cachedResponse.zones || [];
      const allZonesScraped: ScrapedZoneInfo[] = [];
      const quickTakes: string[] = [];
      const weatherHighlightsList: string[] = [];
      const bottomLines: string[] = [];
      let hasAnySuccess = false;

      for (const { centerId, response } of centerResults) {
        if (response.success && response.summary) {
          allZones.push(...response.summary.zones);
          if (response.zonesScraped) allZonesScraped.push(...response.zonesScraped);
          if (response.summary.quickTake) quickTakes.push(response.summary.quickTake);
          if (response.summary.weatherHighlights) weatherHighlightsList.push(response.summary.weatherHighlights);
          if (response.summary.bottomLine) bottomLines.push(response.summary.bottomLine);
          hasAnySuccess = true;
        } else {
          console.error(`Failed to fetch ${centerId}:`, response.error);
        }
      }

      if (hasAnySuccess) {
        setSummary({
          quickTake: '', // Will be generated fresh by AI
          zones: allZones,
          weatherHighlights: '',
          bottomLine: '',
        });
        setScrapedAt(new Date().toISOString());
        setZonesScraped(allZonesScraped);
        setLoadSource('live');
        dataReadyRef.current = true;
        analytics.toolUsed("Avalanche Summary", "fetch_success");
        toast({
          title: "Conditions loaded",
          description: `Updated ${new Date().toLocaleTimeString()}`
        });

        // Fetch station observations, weather forecasts, and Quick Take in background
        fetchSnotel(selectedZoneIds);
        fetchWeatherForecast(selectedZoneIds);
        generateQuickTake(allZones);
      } else {
        analytics.toolUsed("Avalanche Summary", "fetch_error", {
          error: 'All center fetches failed'
        });
        toast({
          title: "Error",
          description: "Failed to fetch avalanche conditions",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      analytics.toolUsed("Avalanche Summary", "fetch_error", {
        error: String(error)
      });
      toast({
        title: "Error",
        description: "Failed to fetch avalanche conditions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      tryRevealResults();
    }
  };
  return <Layout>
      <SEO title="Avalanche Conditions Summary" description="Side-by-side avalanche forecasts, weather outlooks, and live weather station data from across the United States." url="https://kaiconsulting.ai/tools/avalanche" />
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-sky-50 via-background to-blue-50/50 dark:from-sky-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Mountain className="h-4 w-4" />
              United States
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Avalanche Conditions Summary
            </h1>
            <p className="text-muted-foreground text-lg mb-8">Avalanche forecasts, mountain weather outlooks, and live weather station observations side by side across the United States</p>

            {/* Zone Selection */}
            <Card className="mb-8 max-w-3xl mx-auto text-left">
              <CardHeader>
                <CardTitle className="text-base font-display">Select Forecast Zones</CardTitle>
                <CardDescription>
                  Choose regions, centers, and zones to include ({selectedZoneIds.length} of {AVAILABLE_ZONES.length} selected)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HierarchicalZoneSelector selectedZoneIds={selectedZoneIds} onSelectionChange={value => {
                if (value.length === 0) {
                  toast({
                    title: "At least one zone required",
                    description: "Please select at least one zone",
                    variant: "destructive"
                  });
                  return;
                }
                updateSelectedZones(value);
                analytics.toolUsed("Avalanche Summary", "zone_selection_changed", {
                  selectedCount: value.length
                });
              }} />
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => {
                  // Select only the first zone to maintain the "at least one" requirement
                  if (AVAILABLE_ZONES.length > 0) {
                    updateSelectedZones([AVAILABLE_ZONES[0].id]);
                    analytics.toolUsed("Avalanche Summary", "reset_to_one");
                  }
                }} disabled={selectedZoneIds.length === 1}>
                    Reset Selection
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col items-center gap-3">
              <Button size="lg" onClick={fetchSummary} disabled={isLoading} className="gap-2">
                {isLoading ? <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Fetching Conditions...
                  </> : <>
                    <Snowflake className="h-5 w-5" />
                    Get Current Conditions
                  </>}
              </Button>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="quick-take-toggle"
                  checked={quickTakeEnabled}
                  onCheckedChange={(checked) => toggleQuickTake(checked === true)}
                />
                <label htmlFor="quick-take-toggle" className="text-sm text-muted-foreground cursor-pointer">
                  Include AI Quick Take
                </label>
              </div>
            </div>

            {/* Loading card with timer and tips */}
            {(isLoading || showVideo) && <LoadingCard className="mt-8 max-w-5xl mx-auto" zoneCount={selectedZoneIds.length} onVideoComplete={() => { videoPlayedRef.current = true; tryRevealResults(); }} />}

            {scrapedAt && showResults && <div className="flex items-center justify-center gap-2 mt-4">
              <p className="text-sm text-muted-foreground">Last updated: {new Date(scrapedAt).toLocaleString()}</p>
              {loadSource === 'cached' && <Badge variant="outline" className="text-xs">Cached</Badge>}
              {isSnotelLoading && <Badge variant="secondary" className="text-xs flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />Loading Stations</Badge>}
              {isWeatherForecastLoading && <Badge variant="secondary" className="text-xs flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />Loading Weather</Badge>}
            </div>}
          </div>
        </div>
      </section>

      {/* Results Section — shown after video plays once and data is ready */}
      {summary && showResults && <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            {/* Quick Take */}
            {(quickTakeEnabled && (isQuickTakeLoading || summary.quickTake)) && (
              <Card className="mb-8 border-primary/30 bg-gradient-to-br from-background to-primary/5">
                <CardHeader>
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Quick Take
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">AI</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isQuickTakeLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Quick Take for {summary.zones.length} zone{summary.zones.length !== 1 ? 's' : ''}...
                    </div>
                  ) : (
                    <p className="text-foreground leading-relaxed">{summary.quickTake}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Zone Comparison Matrix */}
            {summary.zones.length > 0 && <div className="mb-8">
                <ZoneComparisonMatrix zones={summary.zones} />
              </div>}

            {/* Zone Details */}
            {summary.zones.length > 0 && <div className="mb-8">
                <h2 className="font-display text-xl font-bold mb-4">Zone Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {summary.zones.map(zone => <ZoneCard key={zone.id} zone={zone} isSnotelLoading={isSnotelLoading} isWeatherForecastLoading={isWeatherForecastLoading} weatherForecast={getZoneWeatherForecast(zone.id)} />)}
                </div>
              </div>}

            {/* Data Sources */}
            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem value="sources">
                <AccordionTrigger className="text-sm">Data Sources & Freshness</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    {zonesScraped.map(zone => {
                  const freshness = freshnessConfig[zone.freshness.status];
                  return <div key={zone.id} className="flex items-center justify-between py-1">
                          <span>
                            {zone.name} <span className="text-muted-foreground">({zone.center})</span>
                          </span>
                          <div className="flex items-center gap-2">
                            {zone.success ? <>
                                <span className="text-xs text-muted-foreground">
                                  {zone.freshness.expiresDate ? `Exp: ${zone.freshness.expiresDate}` : ""}
                                </span>
                                <Badge variant="outline" className={freshness.color}>
                                  {freshness.label}
                                </Badge>
                              </> : <Badge variant="destructive">Failed</Badge>}
                          </div>
                        </div>;
                })}
                    <div className="pt-4 border-t mt-4 space-y-3">
                      <p className="text-xs font-semibold text-foreground">Data Sources</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <a href="https://avalanche.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                            National Avalanche Center API <ExternalLink className="h-3 w-3" />
                          </a>
                          <span className="text-xs text-muted-foreground">Avalanche forecasts & danger ratings</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <a href="https://www.weather.gov/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                            NOAA National Weather Service <ExternalLink className="h-3 w-3" />
                          </a>
                          <span className="text-xs text-muted-foreground">Mountain weather forecasts</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <a href="https://synopticdata.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                            Synoptic Data (MesoWest) <ExternalLink className="h-3 w-3" />
                          </a>
                          <span className="text-xs text-muted-foreground">Weather station observations</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <a href="https://utahavalanchecenter.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                            Utah Avalanche Center <ExternalLink className="h-3 w-3" />
                          </a>
                          <span className="text-xs text-muted-foreground">UAC forecasts (direct API)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Disclaimer */}
            <div className="mt-8 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">Important Disclaimer</p>
                  <p>
                    This tool provides AI-generated summaries of publicly available avalanche forecasts. Always verify
                    conditions by reading the <strong>original forecasts</strong> from your local avalanche center before making
                    travel decisions. This tool is not a substitute for avalanche education, training, and good
                    judgment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>}

      {/* Empty State */}
      {!summary && !isLoading && <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Mountain className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Click "Get Current Conditions" to fetch the latest avalanche forecasts.
            </p>
          </div>
        </section>}
    </Layout>;
}