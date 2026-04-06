---
title: Implementation Gaps
created: 2026-04-06
updated: 2026-04-06
author: Codex
tags:
  - updates
  - gaps
  - implementation
  - tests
  - logging
priority: high
status: active
---

# Implementation Gaps

## Summary

This note tracks the current implementation gaps that still matter after the Schematics truth pass.

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Logger | Resolved this pass | [../../lib/logger.ts](../../lib/logger.ts) now exists and is wired into community-calendar, water-alerts, and spotlight API routes |
| Test coverage | Open | `tests/jobs.test.ts` exists, but there is no broad route/API safety net yet |
| Missing API surfaces | Historical only | Legacy notes refer to `app/api/community-status/route.ts`, `app/api/community-events/route.ts`, and `app/api/business-spotlight/route.ts`, but those names are consolidation history rather than current route owners |
| Missing create flows | Resolved this pass | [../../app/spotlight/new/page.tsx](../../app/spotlight/new/page.tsx) and [../../app/community-calendar/new/page.tsx](../../app/community-calendar/new/page.tsx) now back the live CTAs |
| Route placement cleanup | Open | `app/auth/route.ts` should remain documented as a compatibility alias until the webhook surface is fully consolidated under `app/api/**/route.ts` |

## Active Gaps Only

- Add meaningful API and route coverage around critical surfaces, not just isolated tests.
- Backfill route coverage for the restored `spotlight/new` and `community-calendar/new` flows.
- Retire or rewrite any legacy notes that still imply `community-status`, `community-events`, or `business-spotlight` are active route owners.

## Canonical Sources

- Schematics Index: [[Schematics Index]]
- Dashboard: [[Dashboard]]
- Coordination hub: [[Coordination Hub]]
- Truth register: [[Truth Register]]
- Operating rules: [[Operating Rules]]
