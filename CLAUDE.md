# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server with Turbopack
npm run build        # Production build (compile mode)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run type-check   # TypeScript checking (tsc --noEmit)
npm run format       # Prettier
```

Scripts in `scripts/` run via `npx tsx scripts/<name>.ts`.

## Architecture

**Construction Capital** is a UK development finance brokerage website built with Next.js 16 (App Router) and deployed as a standalone output.

### Programmatic SEO at Scale

The site generates thousands of pages from static data arrays — no CMS, no database reads at render time for most content:

- **Location pages** (`/locations/[county]/[town]/[service]`): Generated from `src/lib/uk-locations-data.ts` which defines every county and town. Each town gets pages for each service type (development finance, bridging, mezzanine, etc.). Three nesting levels: county → town → town+service.
- **Calculators** (`/calculators/[slug]`): Defined in `src/lib/calculators.ts`. Each calculator has its own React component in `src/components/calculators/`.
- **Guides** (`/guides/[slug]`): Long-form content defined in `src/lib/guides/` — one file per topic area, aggregated via `src/lib/guides/index.ts`.
- **Market reports** (`/market-reports/[slug]`): Defined in `src/lib/market-reports/`.
- **Services** (`/services/[slug]`): From `src/lib/services.ts`.

### Data Pipeline

Real market data enriches location pages. Pipeline: scripts fetch → JSON files in `data/generated/` → read at build time by `src/lib/local-market-data.ts`.

- `data/generated/town-stats/` — pre-computed market snapshots (median price, transaction counts, planning approvals)
- `data/generated/sold-data/` — Land Registry transaction data
- `data/generated/planning/` — planning application data
- `src/lib/town-market-data.ts` — hand-written editorial commentary per town
- `src/lib/location-content.ts` — generates service-specific content (FAQs, deal examples, market commentary)

`local-market-data.ts` is server-only (uses `fs`). It returns `null` gracefully when data doesn't exist for a town.

### Convex Backend

Used for dynamic data: leads (deal room submissions), case studies, and location/county records. Schema in `convex/schema.ts`. The Convex tables mirror some static data for admin management but the static arrays in `src/lib/` are the source of truth for page generation.

### Image System

Unsplash CDN images using long-form photo IDs (e.g., `1554316783-385f1d58789c`). The `unsplashUrl()` helper prepends `photo-` to the ID. Location images are mapped in `src/lib/location-images.ts` keyed by `countySlug` or `countySlug/townSlug`. Only `images.unsplash.com` is allowed in `next.config.ts` remote patterns.

## Design Tokens

- **Primary (Navy)**: `oklch(0.25 0.06 255)` — used for headings, CTAs, hero backgrounds
- **Secondary (Gold)**: `oklch(0.75 0.12 85)` — accents, highlights, ring focus
- **Fonts**: Playfair Display (`font-heading`) for headings, Inter (`font-sans`) for body
- Custom CSS variables: `--navy`, `--navy-light`, `--navy-dark`, `--gold`, `--gold-light`, `--gold-dark`
- Components use shadcn/ui with the navy/gold theme applied via CSS custom properties in `globals.css`

## Key Conventions

- Path alias: `@/*` maps to `./src/*`
- ISR with 24-hour revalidation on location pages (`revalidate = 86400`)
- `generateStaticParams` exports on dynamic routes for build-time generation
- Site constants (name, URL, contact) live in `src/lib/constants.ts`
- Sitemap generated programmatically in `src/app/sitemap.ts` from all data arrays
- UK locale throughout (`en_GB`, GBP currency, British English spelling)
