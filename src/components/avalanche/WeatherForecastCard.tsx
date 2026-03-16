import { Loader2, ExternalLink } from "lucide-react";
import type { NacWeatherProduct, NwsForecast, AvgDiscussion, AvgLocation } from "@/lib/api/avalanche";

interface WeatherForecastCardProps {
  nacWeather?: NacWeatherProduct;
  nwsForecast?: NwsForecast;
  avgDiscussion?: AvgDiscussion;
  avgLocations?: AvgLocation[];
  isLoading?: boolean;
}

export default function WeatherForecastCard({
  nacWeather,
  nwsForecast,
  avgDiscussion,
  isLoading,
}: WeatherForecastCardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading weather forecast...
      </div>
    );
  }

  const hasAvgDiscussion = avgDiscussion?.discussion;
  const hasNacDiscussion = nacWeather?.discussion;
  const hasNwsPeriods = nwsForecast?.periods && nwsForecast.periods.length > 0;

  // Pick the best discussion text: AVG > NAC > NWS first period summary
  const discussion = hasAvgDiscussion
    ? avgDiscussion!.discussion
    : hasNacDiscussion
      ? nacWeather!.discussion
      : hasNwsPeriods
        ? nwsForecast!.periods.slice(0, 2).map(p => `${p.name}: ${p.detailedForecast}`).join('\n\n')
        : null;

  if (!discussion) return null;

  // Determine source label and link
  let sourceLabel: string;
  let sourceTime: string | null = null;
  let sourceUrl: string | null = null;

  if (hasAvgDiscussion) {
    sourceLabel = `NWS Avalanche Weather Guidance (${avgDiscussion!.wfo})`;
    sourceTime = avgDiscussion!.issuedTime;
    // Link to the AVG product page on weather.gov
    sourceUrl = `https://forecast.weather.gov/product.php?site=${avgDiscussion!.wfo}&issuedby=${avgDiscussion!.wfo}&product=AVG&format=CI&version=1`;
  } else if (hasNacDiscussion) {
    sourceLabel = 'Avalanche Center Weather Discussion';
    sourceTime = nacWeather!.publishedTime;
  } else {
    sourceLabel = `NWS Mountain Forecast (${nwsForecast!.gridpoint})`;
    sourceUrl = nwsForecast!.forecastPageUrl;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
        {discussion}
      </div>
      <div className="flex items-center justify-between pt-1">
        <p className="text-[10px] text-muted-foreground/60">
          {sourceLabel}
          {sourceTime && ` — ${new Date(sourceTime).toLocaleString()}`}
        </p>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View full forecast <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
