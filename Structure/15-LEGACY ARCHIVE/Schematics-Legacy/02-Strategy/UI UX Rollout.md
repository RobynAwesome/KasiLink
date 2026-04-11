---
title: UI UX Rollout
created: 2026-04-10
updated: 2026-04-10
author: Codex
aliases:
  - UI UX Rollout
  - UI Phase
  - UX Phase
tags:
  - strategy
  - ui
  - ux
  - design-system
  - rollout
priority: critical
status: active
---

# UI UX Rollout

## Purpose

This note starts the dedicated UI and UX phase for KasiLink. The goal is to move the app from individually styled screens toward one mobile-first, township-aware visual system that feels consistent across the entire product.

## Phase 1 Status

Phase 1 starts now as a foundation-and-audit phase.

- Normalize the documentation and Obsidian layer first so design decisions have one reliable control plane.
- Audit the highest-traffic routes before broad visual changes land.
- Push shared shell, navigation, spacing, card, form, and state patterns ahead of page-specific polish.

## Product Rules For This Phase

1. Mobile-first is mandatory because the primary user context is low-end phones and constrained data.
2. Every page needs clear empty, loading, success, and error states.
3. Visual polish must improve trust and legibility before decorative effects.
4. UI decisions should reflect South African township reality instead of generic SaaS defaults.
5. Shared patterns should be built once and reused rather than restyled independently per route.

## Route Groups

### Group A: Core entry and discovery

- `app/page.tsx`
- `app/marketplace/page.tsx`
- `app/gigs/[id]/page.tsx`
- `app/gigs/new/page.tsx`

### Group B: Trust and account

- `app/sign-in/page.tsx`
- `app/profile/page.tsx`
- `app/verified/page.tsx`
- `app/verified/[id]/page.tsx`

### Group C: Community and communication

- `app/chat/page.tsx`
- `app/forum/page.tsx`
- `app/community-status/page.tsx`
- `app/community-calendar/page.tsx`
- `app/water-outages/page.tsx`

### Group D: Long-tail utility surfaces

- `app/incidents/page.tsx`
- `app/incidents/new/page.tsx`
- `app/tutoring/page.tsx`
- `app/spotlight/page.tsx`
- `app/utility-schedule/page.tsx`

## Phase 1 Deliverables

1. Global UI audit for the highest-traffic routes.
2. Shared design language for type scale, spacing rhythm, color roles, cards, forms, chips, and call-to-action hierarchy.
3. Standard page-shell rules for headers, section spacing, and bottom navigation behavior.
4. Route-level prioritization so implementation happens in a deliberate order.

## Suggested Implementation Order

1. `app/globals.css`, `app/layout.tsx`, `components/Navbar.tsx`, and `components/Footer.tsx`
2. Home and marketplace surfaces
3. Form-heavy surfaces such as gig creation and sign-in
4. Chat and forum interaction surfaces
5. Trust, profile, and utility pages

## Done Definition For Phase 1

- The shared shell and navigation feel consistent on mobile and desktop.
- Primary actions are visually obvious on every top-priority page.
- Forms, cards, and badges follow the same interaction and spacing language.
- The route audit has a clear next-up queue for implementation work.

## Canonical Sources

- Schematics Index: [[Schematics Index]]
- Dashboard: [[Dashboard]]
- Execution Map: [[Execution Map]]
- System Map: [[System Map]]
- Coordination hub: [[Coordination Hub]]
