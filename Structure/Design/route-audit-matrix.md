---
title: Design Route Audit Matrix
created: 2026-04-11
updated: 2026-04-11
author: Codex
tags:
  - design
  - audit
  - routes
  - implementation
priority: critical
audience:
  - owner
  - lead
  - devs
status: active
---

# Design Route Audit Matrix

> This note tracks the current relationship between live routes and the canonical design assets in `Structure/Design/`.
> Status values are intentionally strict: `match`, `partial`, `not audited this phase`, or `diverges`.

| Route | Canonical Design Source | Status | Current Read |
|---|---|---|---|
| `/` | `light-Mode/stitch/kasilink_home_feed_ubuntu_pulse/` | partial | Hero hierarchy and signal framing improved, but the live page still does not fully mirror the stitch feed composition. |
| `/marketplace` | `light-Mode/stitch/kasilink_marketplace_ubuntu_pulse/` | partial | Search/filter shell and editorial framing now align better, but card treatment and full marketplace composition still need tighter matching. |
| `/forum` | `light-Mode/stitch/kasilink_forum_ubuntu_pulse/` | partial | Community heartbeat framing is in place, but the live route still needs stronger feed-style post presentation and feature-alert composition. |
| `/verified` | `features/stitch/verified_provider_search_results/` | partial | Trust framing and filter hierarchy improved, but the provider card and directory shell are not yet fully aligned to the reference screen. |
| `/water-outages` | `features/stitch/water_outage_alert_details/` | not audited this phase | Existing route was improved earlier, but this phase has not yet completed a design-to-route audit against the specific stitch asset. |
| `/community-status` | `sub-features/stitch/stitch/community_status/` | not audited this phase | Existing route was improved earlier, but no current-phase route audit has been recorded yet. |
| `/utility-schedule` | `sub-features/stitch/stitch/utility_schedule/` | not audited this phase | Existing route was improved earlier, but it has not yet been checked line-by-line against the design source in this phase. |
| `/community-calendar` | `features/stitch/community_calendar/` | not audited this phase | Design asset exists and the route exists, but the current-phase mapping is still pending. |
| `/spotlight` | `features/stitch/local_business_spotlight/` | not audited this phase | Design asset exists and the route exists, but the current-phase mapping is still pending. |
| `/tutoring` | `tutoring/` | not audited this phase | Design source exists, but the route has not yet been evaluated against it in the current execution cycle. |

## Route Audit Rule

- Do not upgrade a route from `partial` to `match` without checking layout, hierarchy, interaction priority, and trust/status framing against the design source.
- Do not leave a route in `not audited this phase` once it becomes active implementation work for the sprint.
