---
title: Implementation Gaps
created: 2026-04-06
updated: 2026-04-11
author: Codex
aliases:
  - Implementation Gaps
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

## Current Status (2026-04-11)

| Area | Status | Notes |
| --- | --- | --- |
| Logger | ✅ Resolved | `lib/logger.ts` wired into community-calendar, water-alerts, spotlight routes |
| Test coverage | ✅ Substantially resolved | 10 test files, 139 tests: validation, geo, format, auth, API routes (gigs, applications, forum, water-alerts, incidents, community-calendar, spotlight, load-shedding, tutoring), USSD, suburb utils |
| Missing API surfaces | ✅ Historical only | Legacy route names retired |
| Missing create flows | ✅ Resolved | spotlight/new + community-calendar/new restored and regression-tested |
| Route placement cleanup | ✅ Documented | `app/auth/route.ts` documented with removal TODO |
| Suburb/city extraction | ✅ Resolved | `lib/suburbs.ts` created, gigs/new uses it |
| PWA manifest | ✅ Fixed | theme-color, split any/maskable icons, cache v2, /Icons path corrected |
| Chat polling | ✅ Fixed | interval not restarted on conversation switch; URL sync loop guarded |
| Forum submit path | ✅ Fixed | dual-state removed, role="alert"/role="status" added |
| Touch targets | ✅ Fixed | .btn and .chip-toggle have min-height: 2.75rem (44px) |
| App Store metadata | ✅ Ready | `Structure/Schematics/08-AppStore/app-store-metadata.md` — owner action pending |
| Profile loading | ✅ Improved | skeleton cards replace text spinner |
| Sign-in phone hint | ✅ Added | +27/0xx format helper visible before Clerk form |

## Remaining Open Items

| Item | Blocker | Owner |
| --- | --- | --- |
| EskomSePush API key in Vercel | Requires API subscription + Vercel dashboard access | Owner |
| Clerk production keys (pk_live_/sk_live_) | Requires Clerk dashboard access | Owner |
| KasiLinkAI_XAI_API_KEY in Vercel | Requires xAI API key | Owner |
| App Store developer accounts | Google Play ($25) + Apple ($99/year) | Owner |
| 512×512 master icon art | Graphic design work needed | Owner/Designer |
| Africa's Talking USSD number | AT account + USSD short code registration | Owner |
| Production smoke test on kasilink.com | Manual device testing | Owner |

## Canonical Sources

- Schematics Index: [[Schematics Index]]
- Dashboard: [[Dashboard]]
- Coordination hub: [[Coordination Hub]]
- Truth register: [[Truth Register]]
- Operating rules: [[Operating Rules]]
