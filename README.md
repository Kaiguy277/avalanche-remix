# Avalanche Comparison

A free, open source avalanche forecast aggregation dashboard that consolidates danger ratings, weather observations, and AI-powered analysis from 20+ US avalanche centers into a single interface.

## Why This Exists

Avalanche forecasts in the US are published by 20+ independent avalanche centers, each with their own website. Planning a backcountry trip that crosses forecast boundaries — or comparing conditions across regions — means checking multiple sites manually. This tool puts it all in one place.

## Features

- **Unified Forecasts** — Danger ratings at alpine, treeline, and below-treeline elevations for 60+ forecast zones
- **Real-Time Weather** — SNOTEL, RAWS, and ski area weather station observations via Synoptic Data API
- **AI Synthesis** — Quick-take summaries comparing forecast predictions against actual observed conditions
- **Avalanche Problems** — Size classifications, likelihood, and affected aspects for each zone
- **Progressive Loading** — Cached forecasts load instantly, live weather data fills in progressively

## Coverage

Alaska, Pacific Northwest, Colorado, Utah, Montana, Wyoming, Idaho, California/Nevada, New Mexico/Arizona, and the Northeast (Mount Washington).

## Tech Stack

- **Frontend:** React, TypeScript, Vite, shadcn/ui, Tailwind CSS, TanStack Query
- **Backend:** Supabase Edge Functions (Deno)
- **Database:** Supabase (PostgreSQL)
- **Data Sources:** [avalanche.org API](https://avalanche.org), [Synoptic Data API](https://synopticdata.com), [NOAA NWS](https://weather.gov)

## Development

```bash
npm install
npm run dev
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) — Kai Myers, 2025
