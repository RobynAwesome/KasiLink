---
title: Operating Rules
created: 2026-04-06
updated: 2026-04-06
author: Codex
tags:
  - updates
  - alignment
  - rules
  - structure
priority: critical
status: active
---

# Operating Rules

## Summary

This note mirrors the enduring file-placement, styling, and mission-alignment rules from `Structure/Updates/current-alignment-notes.md` while separating current truth from stale historical status claims.

## Current Canonical Rules

### File Placement

1. App UI belongs under `app/`.
2. Route handlers belong under `app/api/**/route.ts`.
3. `page.tsx` files inside `app/api/**` are always wrong.
4. Do not place UI or route handlers under `lib/` or `lib/models/`.
5. New canonical documentation should start in `Structure/Schematics/` and then link to legacy source notes as needed.

### Styling

1. `app/globals.css` is the only canonical global stylesheet.
2. `app/layout.tsx` must import `./globals.css`.
3. Tailwind CSS 4 entry syntax is `@import "tailwindcss";`.
4. Utility-generating theme tokens belong in `@theme` inside `app/globals.css`.
5. `tailwind.config.ts` is not the current source of truth for generated color utilities.

### Documentation System

1. `Structure/Updates/` is the execution-history layer.
2. `Structure/Schematics/` is the canonical navigation and synthesis layer.
3. If legacy notes and Schematics differ, Schematics should state the current normalized truth explicitly.

## Current Truth Corrections

- `app/api/load-shedding/route.ts` exists in the repo and should not be treated as "in progress".
- `app/incidents/page.tsx` and `app/incidents/new/page.tsx` exist in the repo and should not be treated as "in progress" placeholders.
- `app/auth/route.ts` exists, but it should be treated as a legacy compatibility alias rather than the canonical route-handler placement.
- `app/api/community-status/route.ts` does not exist in the current file tree and should not remain listed as a canonical route owner until created.
- `app/api/community-events/route.ts` and `app/api/business-spotlight/route.ts` do not exist in the current file tree and should be treated as historical consolidation notes, not active route files.

## Interpretation Rule For Legacy Alignment Notes

- Keep `current-alignment-notes.md` as a source record.
- Treat its route status tables as mixed historical/current content.
- Use this note plus [[System Map]] as the cleaner truth layer going forward.

## Canonical Sources

- Dashboard: [[Dashboard]]
- System map: [[System Map]]
- Coordination hub: [[Coordination Hub]]
- Legacy alignment source: [../../Updates/current-alignment-notes.md](../../Updates/current-alignment-notes.md)
