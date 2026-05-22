# Lacan.js — Agent Guide

## Stack

- **React 19** + **TypeScript 5.9** (strict mode) + **Vite 7**
- **Tailwind CSS 4** via `@tailwindcss/vite` (no `tailwind.config`, use `@import "tailwindcss"` in CSS)
- **Framer Motion 12** for all animations
- **No React Router** — single-page app with custom state-driven view switching (gallery ↔ focus)

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build  (typecheck first, then build)
npm run lint         # eslint .
npm run preview      # vite preview — e2e tests use port 4173
npm run test:e2e     # playwright test (headless, 1 worker, via preview server)
npm run test:e2e:headed  # headed mode
npm run test:e2e:ui      # Playwright UI mode
```

**Order matters**: `tsc -b` runs **before** `vite build`. Type errors block the build.

## Architecture

### Entry and State Ownership

- `main.tsx` → `<App />` in `StrictMode`
- `App.tsx` owns **all application state** via `useState`:
  - `selectedId` (panel id or null)
  - `selectedNodeState` (panelId + nodeIds for interactive schemas)
  - `pageGroup` (pagination index)
  - `isAppLoaded` / `isExitingFocus` (animation timing)
- No state management library. Pure React hooks.

### Panel / Schema System

- **8 panels** defined in `src/components/app/panels.ts`
- **4 schemas**: Schema L (Mirror Stage), Schema R (The Symbolic), Schema I (The Imaginary), Schema D (Graph of Desire)
- Panel→Schema mapping via `panelSchemaRegistry.ts` — looks up `schemaKey` + `interactive` flag
- All schemas are **lazy-loaded** via `React.lazy()` in `App.tsx` (passed as props, not imported directly by children)
- 3/4 schemas are interactive (L, I, D); Schema R is intentionally non-interactive

### Interactive Schema Shared Abstraction

- `InteractiveSchemaFrame` — generic SVG overlay that renders hit-target circles over a schema image
- `useSchemaInteraction` — shared hook: max 2 nodes selected, click toggles/deselects
- Each interactive schema (L/I/D) configures node positions relative to its SVG `viewBox`
- `viewBox` differs per schema — must match the SVG source

### View Modes

| Mode | Component | Description |
|------|-----------|-------------|
| Gallery | `PanelGallery` | 4-column grid (desktop) / 2-column (mobile). Wheel navigation. Progress bar. |
| Focus | `FocusView` | Selected panel expands. Interactive: right panel appears when 2 nodes selected. |
| Exiting | `FocusView` + `App.tsx` | `FOCUS_EXIT_MS` (600ms) controls animation + state reset timing. |

### Asset Loading

- **Gallery (thumbnail)**: PNG imports from `src/pngs/`
- **Focus (expanded)**: SVG imports with **`?url` suffix** from `src/svgs/` (Vite asset import)
- SVG type declaration in `src/vite-env.d.ts` for `*.svg?raw` imports
- All schema images rendered with `filter: invert(1) opacity(0.8)` for dark theme

### Responsive System

- CSS custom properties set inline on `.app-container` via `useMemo` — values from `uiConstants.ts`
- `data-mobile-layout="true"` toggles all responsive CSS in `App.css`
- Breakpoint: **960px** (defined as `MOBILE_BREAKPOINT_PX` in `uiConstants.ts`)
- `useMobileViewport` hook uses `window.matchMedia()` with `addEventListener('change')` fallback

### CSS Architecture

- `index.css`: Tailwind import, CSS reset, dark theme, `overflow: hidden` on body/root
- `App.css` (NOT Tailwind utility classes): Layout rules using CSS custom properties (`--app-shell-*`, `--app-header-*`, etc.)
- All positioning uses absolute/relative with z-index layering
- `100dvh` fallback via `@supports`

### GlassPanel Component

- Reusable glassmorphism panel with parallax, glare, and noise texture
- Parallax: Framer Motion `useMotionValue` + `useSpring` + `useTransform` for rotation
- `deferVisualEnhancement` flag reduces blur/noise during entry animation (performance)
- `disableParallax` for focus mode

## Notable Quirks

1. **No `vite-plugin-svgr`** despite README listing it. SVGs imported as URL strings via `?url`, not as components.
2. **Borromean knot components** (`BorromeanKnot2D.tsx`, `borromean/`) are all empty stubs — not integrated yet.
3. **E2E test** (`tests/borromean.spec.ts`) is empty — not runnable.
4. **Commit convention**: Chinese messages, conventional-commit-style prefixes (`feat:`, `fix:`, `refactor:`, `chore:`).
5. **CI**: GitHub Pages deploy on push to `main`. Build uses `npm ci`.
6. **`vite.config.ts`** has `base: '/Lacan.js/'` — critical for Pages deployment.
7. **TypeScript**: `verbatimModuleSyntax: true` means use `import type` for type-only imports. `erasableSyntaxOnly: true` prohibits enums/namespaces.
8. **`tsc -b` uses project references** (`tsconfig.json` references `tsconfig.app.json` + `tsconfig.node.json`).
9. **Safe area** CSS custom properties (`--safe-area-*`) used in `App.css` for mobile notch support.

## Testing

- Playwright e2e only. No unit tests.
- Web server config starts `vite preview` on port 4173. Server restarts every test run.
- `fullyParallel: false`, `workers: 1` — sequential execution.
- `data-testid` attributes used: `app-header`, `panel-gallery`, `panel-card-{id}`, `focus-view`, `focus-secondary`, `progress-indicator`.

## Visual Style

- Dark theme (`background-color: #242424`, text `rgba(255,255,255,0.87)`)
- Apple visionOS-inspired glassmorphism (`backdropFilter: blur(28px) saturate(150%)`)
- Deep environment: layered SVG wireframe room with `requestAnimationFrame` staggered mount + CSS blur/radial-gradient masks
- Entry animation sequence: header (2s) → cards (staggered, 950ms after header) → progress bar
