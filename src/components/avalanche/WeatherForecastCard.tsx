import { Sun, Wind, Thermometer, Loader2, ExternalLink, Cloud, FileText, ChevronDown, ChevronRight } from "lucide-react";
import type { NacWeatherProduct, NwsForecast, NwsForecastPeriod, NacWeatherTable, AvgDiscussion, AvgLocation } from "@/lib/api/avalanche";
import { useState } from "react";

interface WeatherForecastCardProps {
  nacWeather?: NacWeatherProduct;
  nwsForecast?: NwsForecast;
  avgDiscussion?: AvgDiscussion;
  avgLocations?: AvgLocation[];
  isLoading?: boolean;
}

// ─── Utility Functions ───────────────────────────────────────────────────────

function extractHeadline(text: string | null | undefined, maxLength = 250): string | null {
  if (!text) return null;
  const sentences = text.split(/(?<=[.!?])\s+/);
  let headline = sentences[0] || '';
  if (sentences.length > 1 && (headline.length + sentences[1].length) < maxLength) {
    headline += ' ' + sentences[1];
  }
  return headline.trim() || null;
}

function buildNwsHeadline(periods: NwsForecastPeriod[]): string | null {
  if (!periods || periods.length === 0) return null;
  const today = periods[0];
  const tonight = periods.find(p => !p.isDaytime);
  const parts: string[] = [];
  if (today.temperature) {
    parts.push(`${today.name}: ${today.shortForecast}, ${today.temperature}°${today.temperatureUnit}.`);
  } else {
    parts.push(`${today.name}: ${today.shortForecast}`);
  }
  if (tonight) {
    if (tonight.temperature) {
      parts.push(`${tonight.name}: ${tonight.shortForecast}, ${tonight.temperature}°${tonight.temperatureUnit}.`);
    } else {
      parts.push(`${tonight.name}: ${tonight.shortForecast}`);
    }
  }
  return parts.join(' ');
}

// ─── NWS Period Row ──────────────────────────────────────────────────────────

function NwsPeriodRow({ period }: { period: NwsForecastPeriod }) {
  return (
    <div className={`p-3 rounded-lg ${period.isDaytime ? 'bg-sky-50/50 dark:bg-sky-950/20' : 'bg-slate-50/50 dark:bg-slate-950/20'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-foreground">{period.name}</span>
        <div className="flex items-center gap-3 text-sm">
          {period.temperature !== 0 && (
            <span className="flex items-center gap-1">
              <Thermometer className="h-3.5 w-3.5 text-red-400" />
              <span className="font-semibold">{period.temperature}°{period.temperatureUnit}</span>
            </span>
          )}
          {period.windDirection && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Wind className="h-3.5 w-3.5 text-teal-500" />
              {period.windDirection} {period.windSpeed}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        {period.isDaytime ? (
          <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        ) : (
          <Cloud className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        )}
        <span className="text-sm font-medium text-foreground">{period.shortForecast}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{period.detailedForecast}</p>
    </div>
  );
}

// ─── NAC Weather Data Table ──────────────────────────────────────────────────

function NacWeatherDataTable({ table }: { table: NacWeatherTable }) {
  if (!table.columns || !table.rows || !table.data) return null;
  if (table.data.length === 0) return null;

  return (
    <div className="space-y-2">
      {table.zone_name && (
        <div className="text-xs font-semibold text-foreground">{table.zone_name}</div>
      )}
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-xs min-w-[400px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1.5 px-2 font-medium text-muted-foreground w-32"></th>
              {table.columns.map((col, i) => (
                <th key={i} className="text-center py-1.5 px-2 font-semibold text-foreground">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIdx) => {
              const rowData = table.data[rowIdx] || [];
              const isHeader = row.field === 'header';

              if (isHeader) {
                return (
                  <tr key={rowIdx} className="bg-muted/30">
                    <td
                      colSpan={table.columns.length + 1}
                      className="py-1.5 px-2 font-semibold text-foreground text-xs"
                    >
                      {row.heading}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={rowIdx} className="border-b border-border/30">
                  <td className="py-1 px-2 text-muted-foreground whitespace-nowrap">
                    {row.heading}
                    {row.unit && <span className="text-muted-foreground/60"> ({row.unit})</span>}
                  </td>
                  {rowData.map((val, colIdx) => (
                    <td key={colIdx} className="py-1 px-2 text-center font-medium text-foreground">
                      {val ?? '—'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Expandable Section ──────────────────────────────────────────────────────

function ExpandableSection({
  title,
  icon,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/40 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/30 rounded-lg transition-colors"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
        {icon}
        {title}
        {badge && (
          <span className="text-[10px] text-muted-foreground/60 font-normal ml-auto">{badge}</span>
        )}
      </button>
      {open && (
        <div className="px-3 pb-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── AVG Location Table ──────────────────────────────────────────────────────

function AvgLocationTable({ location }: { location: AvgLocation }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-foreground">
        {location.name} {location.elevationBand}
      </div>
      <pre className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto">
        {location.tableText}
      </pre>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function WeatherForecastCard({
  nacWeather,
  nwsForecast,
  avgDiscussion,
  avgLocations,
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

  if (!nacWeather && !nwsForecast && !avgDiscussion && (!avgLocations || avgLocations.length === 0)) return null;

  const hasDiscussion = nacWeather?.discussion;
  const hasTables = nacWeather?.tables && nacWeather.tables.length > 0;
  const hasNwsPeriods = nwsForecast?.periods && nwsForecast.periods.length > 0;
  const hasAvgDiscussion = avgDiscussion?.discussion;
  const hasAvgLocations = avgLocations && avgLocations.length > 0;

  // ── Build the best headline ──
  // Priority: AVG forecaster discussion > NAC discussion > NWS first period
  const headline = hasAvgDiscussion
    ? extractHeadline(avgDiscussion!.discussion)
    : hasDiscussion
      ? extractHeadline(nacWeather!.discussion)
      : hasNwsPeriods
        ? buildNwsHeadline(nwsForecast!.periods)
        : null;

  // Split NWS periods: first 2 always visible, rest expandable
  const visiblePeriods = nwsForecast?.periods?.slice(0, 2) || [];
  const extraPeriods = nwsForecast?.periods?.slice(2) || [];

  return (
    <div className="space-y-3">
      {/* ── Summary Headline ── */}
      {headline && (
        <p className="text-sm text-foreground leading-relaxed">{headline}</p>
      )}

      {/* ── AVG Forecaster Discussion (most valuable narrative) ── */}
      {hasAvgDiscussion && (
        <div>
          <div className="text-xs font-semibold text-foreground border-b border-border pb-1 mb-2 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            Mountain Weather Discussion
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {avgDiscussion!.discussion}
          </div>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            NWS {avgDiscussion!.wfo} — {new Date(avgDiscussion!.issuedTime).toLocaleString()}
          </p>
        </div>
      )}

      {/* ── NAC Weather Discussion (if different from AVG) ── */}
      {hasDiscussion && !hasAvgDiscussion && (
        <div>
          <div className="text-xs font-semibold text-foreground border-b border-border pb-1 mb-2">
            Weather Discussion
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {nacWeather!.discussion}
          </div>
          {nacWeather!.publishedTime && (
            <p className="text-[10px] text-muted-foreground/60 mt-2">
              Published: {new Date(nacWeather!.publishedTime).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* ── NWS Zone Forecast (first 2 periods visible, rest expandable) ── */}
      {hasNwsPeriods && (
        <div>
          <div className="text-xs font-semibold text-foreground border-b border-border pb-1 mb-2">
            NWS Mountain Forecast
          </div>
          <div className="space-y-2">
            {visiblePeriods.map((period, idx) => (
              <NwsPeriodRow key={idx} period={period} />
            ))}
          </div>

          {/* Expandable extra periods */}
          {extraPeriods.length > 0 && (
            <ExpandableSection
              title={`${extraPeriods.length} more forecast periods`}
              defaultOpen={false}
            >
              <div className="space-y-2">
                {extraPeriods.map((period, idx) => (
                  <NwsPeriodRow key={idx} period={period} />
                ))}
              </div>
            </ExpandableSection>
          )}

          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-muted-foreground/60">
              NWS Zone: {nwsForecast!.gridpoint}
            </p>
            {nwsForecast!.forecastPageUrl && (
              <a
                href={nwsForecast!.forecastPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View on weather.gov <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── AVG Zone-Specific Location Data (progressive disclosure) ── */}
      {hasAvgLocations && (
        <ExpandableSection
          title={`Detailed AVG Forecast — ${avgLocations!.length} elevation bands`}
          icon={<FileText className="h-3.5 w-3.5 text-blue-500" />}
          badge={avgDiscussion ? `WFO: ${avgDiscussion.wfo}` : undefined}
          defaultOpen={false}
        >
          <div className="space-y-4">
            {avgLocations!.map((loc, idx) => (
              <AvgLocationTable key={idx} location={loc} />
            ))}
          </div>
        </ExpandableSection>
      )}

      {/* ── NAC Discussion (when AVG discussion is also present) ── */}
      {hasDiscussion && hasAvgDiscussion && (
        <ExpandableSection
          title="Avalanche Center Weather Discussion"
          defaultOpen={false}
        >
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {nacWeather!.discussion}
          </div>
          {nacWeather!.publishedTime && (
            <p className="text-[10px] text-muted-foreground/60 mt-2">
              Published: {new Date(nacWeather!.publishedTime).toLocaleString()}
            </p>
          )}
        </ExpandableSection>
      )}

      {/* ── Station Forecast Data Table (NAC) ── */}
      {hasTables && (
        <ExpandableSection
          title="Station Forecast Data"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {nacWeather!.tables.map((table, idx) => (
              <NacWeatherDataTable key={idx} table={table} />
            ))}
          </div>
        </ExpandableSection>
      )}
    </div>
  );
}
