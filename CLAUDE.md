# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server at http://localhost:5173

# Build
npm run build        # TypeScript check → Vite bundle → Puppeteer SSG prerender
npm run build:spa    # TypeScript check → Vite bundle only (no prerender)
npm run prerender    # Run SSG prerender step in isolation

# Preview
npm run preview      # Preview the dist/ build locally
```

There is no test runner configured. `@axe-core/react` is installed for accessibility auditing but is not wired to a test framework.

## Architecture

### Monolithic single-file app

All UI lives in `src/main.tsx` (~1,400 lines). There is no component library, no router package, and no separate component files. Page routing is handled manually via a `Page` union type and component state:

```ts
type Page = 'home' | 'services' | 'service-rates' | 'about' | 'areas' | 'careers' | 'contact' | 'privacy';
```

`pagePaths` maps each `Page` key to its URL slug. Navigation updates `window.history` and sets state — no React Router involved.

### Key data in main.tsx

- `CONTACT` — single source of truth for phone, email, address (top of file, update here first)
- `serviceAreas` — hardcoded list of 15 GTA locations
- `services` — service definitions with icons, descriptions, and links
- `pageTitles` / `pageDescriptions` — per-route SEO metadata fed into `react-helmet-async`

### Styling

All CSS lives in `src/styles.css` (one file, ~34 KB). No Tailwind, no CSS Modules, no CSS-in-JS. Design tokens (colours, spacing, typography) are CSS custom properties at the top of the file.

### Static site generation (SSG)

The production build is a hybrid: Vite bundles the SPA, then `scripts/prerender.mjs` launches Puppeteer to render each of the 8 routes and write static HTML into `dist/`. This gives crawlers real HTML while the client hydrates normally. On Vercel the script uses `@sparticuz/chromium`; locally it auto-detects an installed Chrome or Edge.

If the prerender step fails (common in CI without a display), use `npm run build:spa` to skip it.

### SEO / sitemap

`vite.config.ts` uses `vite-plugin-sitemap` to auto-generate `sitemap.xml` for the 7 non-home routes. `public/_headers` and `public/_redirects` carry Netlify/Vercel header and redirect rules.

## Content & Compliance Rules

- Services are **non-medical**. Do not add medical, clinical, or regulated health claims.
- The following data is **confirmed** and may be used in code: phone `(416) 293-3779`, email `hello@ashertouch-hc.com`, address `7030 Woodbine Ave, Suite 500, Markham ON L3R 6G2`.
- The following must stay as visible placeholders until the client confirms: testimonials, staff photos, licenses, certifications, insurance claims, business hours, founder story.
- Mark unconfirmed values as `[Placeholder — value needed]` so they cannot accidentally ship.
- Use Canadian spelling (e.g., "neighbourhood", "centre").
- Primary conversion goal: **book a free in-home assessment**.
