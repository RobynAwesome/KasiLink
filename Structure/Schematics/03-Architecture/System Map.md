---
title: System Map
created: 2026-04-06
updated: 2026-04-06
author: RobynAwesome
tags:
  - architecture
  - system
  - routing
  - styling
priority: high
status: active
---

# System Map

## Product Surface

- App routes and UI belong under `app/`.
- API handlers belong under `app/api/**/route.ts`.
- Legacy compatibility aliases may exist temporarily, but they are not canonical route-handler placement.
- Shared models and utilities belong under `lib/`.
- Planning, audits, and reference material belong under `Structure/`.

## Styling Guardrails

- `app/layout.tsx` must import `./globals.css`.
- `app/globals.css` is the only canonical global stylesheet.
- Tailwind CSS 4 entry syntax is `@import "tailwindcss";`.
- Utility-generating tokens belong in `@theme` inside `app/globals.css`.

## Documentation Surface

- `Structure/Updates/` is the live coordination layer.
- `Structure/Information/` is the source and context archive.
- `Structure/Design/` holds implementation-facing design evidence.
- `Structure/Issues/` records regressions and QA.
- `Structure/Schematics/` is the canonical navigation and synthesis layer.

## Canonical Sources

- Alignment rules: [../../Updates/current-alignment-notes.md](../../Updates/current-alignment-notes.md)
- Technical spec: [../../technical-Specifications.md](../../technical-Specifications.md)
- CSS regression audit: [../../Issues/tailwind-v4-global-css-regression-2026-04-06.md](../../Issues/tailwind-v4-global-css-regression-2026-04-06.md)
