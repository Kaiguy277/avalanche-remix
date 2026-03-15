import { Snowflake, Thermometer, Activity, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          return (
            <div key={idx} className="space-y-3">
              {/* Station Header */}
              <div className="flex items-baseline justify-between">
                <div className="text-xs font-medium text-foreground">{obs.stationName}</div>
                <div className="text-xs font-semibold text-muted-foreground">{obs.elevation.toLocaleString()}' Elevation</div>
              </div>


              {/* 24 Hour Data */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground border-b border-border pb-1">Last 24 Hours</div>
                <div className="grid grid-cols-2 gap-3">
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Thermometer className="h-3 w-3 text-red-400" />
                        Temp
                      </div>
                      {obs.temperature.current !== null && (
                        <div className="text-xs font-semibold">
                          Now: {obs.temperature.current}°F
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      <div>
                        {obs.temperature.high24hr !== null && obs.temperature.low24hr !== null ? (
                          <>
                            <div className="text-sm font-semibold">
                              H: {obs.temperature.high24hr}°
                            </div>
                            <div className="text-sm font-semibold">
                              L: {obs.temperature.low24hr}°
                            </div>
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
                </div>
              </div>

              {/* Wind 24hr */}
              {obs.wind && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Wind className="h-3 w-3 text-teal-500" />
                    Wind (24hr)
                  </div>
                  <div className="flex items-center gap-3">
                    {obs.wind.speedAvg24hr !== null && (
                      <div className="text-sm">
                        Avg: <span className="font-semibold">{obs.wind.speedAvg24hr} mph</span>
                      </div>
                    )}
                    {obs.wind.speedMax24hr !== null && (
                      <div className="text-sm">
                        Max: <span className="font-semibold">{obs.wind.speedMax24hr} mph</span>
                      </div>
                    )}
                    {obs.wind.direction24hr && (
                      <div className="text-sm">
                        Dir: <span className="font-semibold">{obs.wind.direction24hr}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 72 Hour Data */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground border-b border-border pb-1">Last 72 Hours</div>
                <div className="grid grid-cols-2 gap-3">
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
                            <div className="text-sm font-semibold">
                              H: {obs.temperature.high72hr}°
                            </div>
                            <div className="text-sm font-semibold">
                              L: {obs.temperature.low72hr}°
                            </div>
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
                </div>
              </div>

              {/* Wind 72hr */}
              {obs.wind && (obs.wind.speedAvg72hr !== null || obs.wind.speedMax72hr !== null) && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Wind className="h-3 w-3 text-teal-500" />
                    Wind (72hr)
                  </div>
                  <div className="flex items-center gap-3">
                    {obs.wind.speedAvg72hr !== null && (
                      <div className="text-sm">
                        Avg: <span className="font-semibold">{obs.wind.speedAvg72hr} mph</span>
                      </div>
                    )}
                    {obs.wind.speedMax72hr !== null && (
                      <div className="text-sm">
                        Max: <span className="font-semibold">{obs.wind.speedMax72hr} mph</span>
                      </div>
                    )}
                    {obs.wind.direction72hr && (
                      <div className="text-sm">
                        Dir: <span className="font-semibold">{obs.wind.direction72hr}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {idx < observations.length - 1 && <hr className="border-border/50" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}