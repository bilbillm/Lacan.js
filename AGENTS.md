# Lacan.js — Agent Guide

## Stack

- React 19 + TypeScript 5.9 strict mode + Vite 7
- Tailwind CSS 4 via `@tailwindcss/vite`; page layout lives in `App.css`
- Framer Motion 12 for all motion; no GSAP or Three.js
- Lucide React for interface icons
- Fontsource variable Archivo, Noto Sans SC, and Noto Serif SC
- No React Router; one semantic scrolling document with anchors and a state-driven dossier dialog

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run test:e2e
npm run perf:sample
```

`npm run build` runs `tsc -b` before Vite. Playwright preview uses port 4373; performance sampling uses 4473.

## State And Page Flow

`App.tsx` owns only:

- `theme`: `day | night`, persisted as `lacan-theme`
- `language`: `zh | en`, persisted as `lacan-language`
- `selectedPanelId`: full-screen dossier state
- `activeSection`: nav state derived from natural scroll position

Page order is Hero → Theory Atlas → Timeline → Borromean Knot → Footer. Do not add wheel interception, full-page snapping, a blocking splash, or duplicate desktop/mobile trees.

## Theory System

- 8 definitions live in `src/components/app/panels.ts`.
- Groups are `core` and `extended`; visualization keys are a strict union.
- `visualizationRegistry.ts` lazy-loads every visualization behind `TheoryVisualizationProps`.
- Preview mode must remain non-interactive because it renders inside the index button.
- Detail mode may report an insight id to `TheoryDossier`; the matching localized explanation comes from panel metadata.
- Schema L, I, and Graph of Desire select up to two nodes. Schema R uses single annotations.
- Extended interactions are discourse selection, formula selection, observer range, and topology selection.

## Dialog And Accessibility Rules

- `TheoryDossier` and timeline archives use semantic `role="dialog"` with `aria-modal`.
- Opening focuses Close, Escape closes, Tab stays inside, and closing restores the original trigger.
- All controls require a minimum 44px target and visible `:focus-visible` treatment.
- Reduced Motion must remove parallax, smooth scrolling, continuous motion, and SVG draw-in while leaving the final state complete.

## Styling

- Light defaults: paper `#F3EDDF`, ink `#12110F`, vermilion `#C03A2C`, cobalt `#214FBC`.
- Dark defaults: paper `#11110F`, ink `#F3EDDF`, vermilion `#FF6855`, cobalt `#7894FF`.
- Use semantic CSS variables; do not hard-code per-component theme colors.
- Typography uses discrete breakpoint sizes. Do not use viewport-scaled type or negative letter spacing.
- Maximum card radius is 4px; current design intentionally uses square editorial blocks.
- Do not reintroduce GlassPanel, DeepEnvironment, gradient orbs, nested cards, or a wireframe-room background.

## Assets And Loading

- Existing Schema previews are PNG; dossier diagrams are SVG URLs.
- Timeline reuses the ten WebP archive images with CSS duotone treatment.
- Vite base must remain `/Lacan.js/` for GitHub Pages.
- Timeline, Borromean, and all theory visualizations stay lazy-loaded.
- Initial JavaScript gzip budget is 140 kB.

## Verification

- E2E covers all 8 panels, extended interactions, navigation, persistence, timeline, Borromean selection, mobile, and Reduced Motion.
- Visual QA targets 1440×900, 1024×768, 390×844, 375×667, and phone landscape.
- Reject any horizontal overflow, fixed-nav overlap, blank visual stage, nested interactive element, or unreadable dual-theme state.
- Performance budget: p95 frame interval ≤34ms and no more than 2 frames over 50ms per sample.

## Git

- Commit messages use Chinese conventional-commit prefixes.
- GitHub HTTPS is unreliable on this machine; use the authenticated SSH URL per push/fetch command without rewriting `origin`.
