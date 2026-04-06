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
| Missing API surfaces | Open | Legacy notes refer to `app/api/community-status/route.ts`, `app/api/community-events/route.ts`, and `app/api/business-spotlight/route.ts`, but those files do not exist in the current tree |

## Active Gaps Only

- Add meaningful API and route coverage around critical surfaces, not just isolated tests.
- Decide whether `community-status`, `community-events`, and `business-spotlight` need real API routes or whether the legacy references should be retired completely.

## Canonical Sources

- Coordination hub: [[Coordination Hub]]
- Truth register: [[Truth Register]]
- Operating rules: [[Operating Rules]]
