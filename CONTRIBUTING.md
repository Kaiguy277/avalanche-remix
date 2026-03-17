# Contributing to Avalanche Comparison

Thanks for your interest in contributing! This tool aggregates avalanche forecasts and weather data to help backcountry users make safer decisions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/avalanche-remix.git`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`

## Development

- **Frontend:** React + TypeScript + Vite + shadcn/ui + Tailwind CSS
- **Backend:** Supabase Edge Functions (Deno)
- **Database:** Supabase (PostgreSQL)

## How to Contribute

### Reporting Bugs
Open an issue describing the bug, steps to reproduce, and expected vs actual behavior.

### Suggesting Features
Open an issue with the `enhancement` label describing your idea and how it benefits backcountry users.

### Pull Requests
1. Create a feature branch from `main`
2. Make your changes
3. Test locally with `npm run build`
4. Submit a PR with a clear description of what changed and why

## Data Sources

This project relies on:
- [National Avalanche Center API](https://avalanche.org) — avalanche forecasts
- [Synoptic Data API](https://synopticdata.com) — weather station observations
- [NOAA National Weather Service](https://weather.gov) — extended forecasts

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Questions?

Open an issue or reach out to the maintainer.
