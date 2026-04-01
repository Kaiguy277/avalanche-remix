import { Snowflake, Thermometer, Activity, Wind, Info, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import TempSparkline from "./TempSparkline";
import type { WeatherObservation } from "@/lib/api/avalanche";

interface WeatherStationCardProps {
  observations: WeatherObservation[];
  note?: string;
}

export default function WeatherStationCard({ observations, note }: WeatherStationCardProps) {
  if (!observations || observations.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-500" />
          Weather Station Observations
        </CardTitle>
        {note && (
          <p className="text-xs text-muted-foreground italic mt-1">{note}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {observations.map((obs, idx) => {
          const snotelId = obs.stationTriplet.split(':')[0];
          const stationUrl = `https://wcc.sc.egov.usda.gov/nwcc/site?sitenum=${snotelId}`;
          const lastUpdated = obs.timestamp ? new Date(obs.timestamp).toLocaleString() : null;
          const hasWind = obs.wind !== null && obs.wind !== undefined;

          return (
            <div key={idx} className="space-y-3">
              {/* Station Header with Info Icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-foreground">{obs.stationName}</span>
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 text-xs space-y-2" side="top">
                      <div className="font-semibold text-sm">{obs.stationName}</div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>Station ID: <span className="font-medium text-foreground">{obs.stationTriplet}</span></div>
                        <div>Elevation: <span className="font-medium text-foreground">{obs.elevation.toLocaleString()}'</span></div>
                        <div>Data Quality: <span className="font-medium text-foreground capitalize">{obs.dataQuality}</span></div>
                        {lastUpdated && <div>Last Updated: <span className="font-medium text-foreground">{lastUpdated}</span></div>}
                      </div>
                      <a
                        href={stationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline mt-1"
                      >
                        View Station Data <ExternalLink className="h-3 w-3" />
                      </a>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="text-xs font-semibold text-muted-foreground">{obs.elevation.toLocaleString()}' Elev</div>
              </div>

              {/* Current conditions row */}
              <div className="flex items-center gap-4 text-sm">
                {obs.temperature.current !== null && (
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-red-400" />
                    <span className="font-semibold">{obs.temperature.current}°F</span>
                  </div>
                )}
                {obs.snow.depth !== null && (
                  <div className="flex items-center gap-1">
                    <Snowflake className="h-3 w-3 text-blue-500" />
                    <span className="font-semibold">{obs.snow.depth}" depth</span>
                  </div>
                )}
                {hasWind && (obs.wind!.speedCurrent !== null || obs.wind!.direction !== null) && (
                  <div className="flex items-center gap-1">
                    <Wind className="h-3 w-3 text-teal-500" />
                    <span className="font-semibold">
                      {obs.wind!.direction && `${obs.wind!.direction} `}
                      {obs.wind!.speedCurrent !== null ? `${obs.wind!.speedCurrent} mph` : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* 24 Hour Data */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground border-b border-border pb-1">Last 24 Hours</div>
                <div className={`grid ${hasWind ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                  {/* Snow 24hr */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Snowflake className="h-3 w-3 text-blue-500" />
                      Snow
                    </div>
                    {obs.snow.depth24hrChange !== null && (
                      <div className={`text-sm font-semibold ${obs.snow.depth24hrChange > 0 ? 'text-blue-600' : 'text-foreground'}`}>
                        {obs.snow.depth24hrChange > 0 ? '+' : ''}{obs.snow.depth24hrChange}"
                      </div>
                    )}
                    {obs.snow.precip24hr !== null && (
                      <div className="text-sm font-semibold">
                        {obs.snow.precip24hr.toFixed(1)}" SWE
                      </div>
                    )}
                    {obs.snow.depth24hrChange !== null && obs.snow.depth24hrChange > 0 && obs.snow.precip24hr !== null && obs.snow.precip24hr > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {Math.round((obs.snow.precip24hr / obs.snow.depth24hrChange) * 100)}% density
                      </div>
                    )}
                  </div>

                  {/* Temperature 24hr */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Thermometer className="h-3 w-3 text-red-400" />
                      Temp
                    </div>
                    <div className="flex items-start gap-2">
                      <div>
                        {obs.temperature.high24hr !== null && obs.temperature.low24hr !== null ? (
                          <>
                            <div className="text-sm font-semibold">H: {obs.temperature.high24hr}°</div>
                            <div className="text-sm font-semibold">L: {obs.temperature.low24hr}°</div>
                          </>
                        ) : (
                          <div className="text-sm text-muted-foreground">N/A</div>
                        )}
                      </div>
                      {obs.temperature.hourly24hr && obs.temperature.hourly24hr.length >= 2 && (
                        <TempSparkline
                          data={obs.temperature.hourly24hr}
                          high={obs.temperature.high24hr}
                          low={obs.temperature.low24hr}
                          hours={24}
                        />
                      )}
                    </div>
                  </div>

                  {/* Wind 24hr */}
                  {hasWind && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Wind className="h-3 w-3 text-teal-500" />
                        Wind
                      </div>
                      {obs.wind!.direction24hr && (
                        <div className="text-sm font-semibold">{obs.wind!.direction24hr}</div>
                      )}
                      {obs.wind!.speedAvg24hr !== null && (
                        <div className="text-sm">avg {obs.wind!.speedAvg24hr} mph</div>
                      )}
                      {obs.wind!.speedMax24hr !== null && (
                        <div className="text-sm">gusts <span className="font-semibold">{obs.wind!.speedMax24hr} mph</span></div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 72 Hour Data */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground border-b border-border pb-1">Last 72 Hours</div>
                <div className={`grid ${hasWind ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                  {/* Snow 72hr */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Snowflake className="h-3 w-3 text-blue-500" />
                      Snow
                    </div>
                    {obs.snow.depth72hrChange !== null && (
                      <div className={`text-sm font-semibold ${obs.snow.depth72hrChange > 0 ? 'text-blue-600' : 'text-foreground'}`}>
                        {obs.snow.depth72hrChange > 0 ? '+' : ''}{obs.snow.depth72hrChange}"
                      </div>
                    )}
                    {obs.snow.precip72hr !== null && (
                      <div className="text-sm font-semibold">
                        {obs.snow.precip72hr.toFixed(1)}" SWE
                      </div>
                    )}
                    {obs.snow.depth72hrChange !== null && obs.snow.depth72hrChange > 0 && obs.snow.precip72hr !== null && obs.snow.precip72hr > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {Math.round((obs.snow.precip72hr / obs.snow.depth72hrChange) * 100)}% density
                      </div>
                    )}
                  </div>

                  {/* Temperature 72hr */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Thermometer className="h-3 w-3 text-red-400" />
                      Temp
                    </div>
                    <div className="flex items-start gap-2">
                      <div>
                        {obs.temperature.high72hr !== null && obs.temperature.low72hr !== null ? (
                          <>
                            <div className="text-sm font-semibold">H: {obs.temperature.high72hr}°</div>
                            <div className="text-sm font-semibold">L: {obs.temperature.low72hr}°</div>
                          </>
                        ) : (
                          <div className="text-sm text-muted-foreground">N/A</div>
                        )}
                      </div>
                      {obs.temperature.hourly72hr && obs.temperature.hourly72hr.length >= 2 && (
                        <TempSparkline
                          data={obs.temperature.hourly72hr}
                          high={obs.temperature.high72hr}
                          low={obs.temperature.low72hr}
                          hours={72}
                        />
                      )}
                    </div>
                  </div>

                  {/* Wind 72hr */}
                  {hasWind && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Wind className="h-3 w-3 text-teal-500" />
                        Wind
                      </div>
                      {obs.wind!.direction72hr && (
                        <div className="text-sm font-semibold">{obs.wind!.direction72hr}</div>
                      )}
                      {obs.wind!.speedAvg72hr !== null && (
                        <div className="text-sm">avg {obs.wind!.speedAvg72hr} mph</div>
                      )}
                      {obs.wind!.speedMax72hr !== null && (
                        <div className="text-sm">gusts <span className="font-semibold">{obs.wind!.speedMax72hr} mph</span></div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {idx < observations.length - 1 && <hr className="border-border/50" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
