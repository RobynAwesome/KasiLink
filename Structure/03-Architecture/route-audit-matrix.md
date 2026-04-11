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
| `/` | `light-Mode/stitch/kasilink_home_feed_ubuntu_pulse/` | partial | Homepage now reads more like a township signal board with stronger local-first and trust framing, but it remains a practical hybrid rather than a direct mobile-feed clone. |
| `/marketplace` | `light-Mode/stitch/kasilink_marketplace_ubuntu_pulse/` | partial | Results now carry stronger local-distance, urgency, and trust-first hierarchy, but the live marketplace still keeps a denser utility filter system than the pure stitch composition. |
| `/forum` | `light-Mode/stitch/kasilink_forum_ubuntu_pulse/` | partial | Community heartbeat and thread-feed presentation are stronger now, but the route still blends practical posting tools with the more editorial stitch reference. |
| `/verified` | `features/stitch/verified_provider_search_results/` | partial | Verified search now behaves more like a local trust directory with stronger cards and trust cues, but the live shell still differs from the exact search-bar-first mobile reference. |
| `/water-outages` | `features/stitch/water_outage_alert_details/` | partial | Route now carries stronger high-alert framing, response context, and community-impact layout, but it still does not reproduce the full dark incident-detail composition of the stitch source. |
| `/community-status` | `sub-features/stitch/stitch/community_status/` | partial | Route now reads more like a status dashboard with stronger utility and safety cards, but still stops short of the exact bento composition of the stitch source. |
| `/utility-schedule` | `sub-features/stitch/stitch/utility_schedule/` | partial | Next-outage emphasis and provider framing improved, but the route still uses a simpler live-data schedule grid than the more stylized stitch mockup. |
| `/community-calendar` | `features/stitch/community_calendar/` | partial | Route now includes a calendar-shell highlight and stronger event emphasis, but the live implementation remains a practical hybrid of calendar and event feed. |
| `/spotlight` | `features/stitch/local_business_spotlight/` | partial | Featured business framing and stronger cards are now present, but the route is still a directory view rather than a full single-business editorial surface. |
| `/tutoring` | `tutoring/` | partial | Skills-pathway framing and richer session presentation improved, but the live list route still differs from the darker, detail-oriented tutoring stitch reference. |

## Route Audit Rule

- Do not upgrade a route from `partial` to `match` without checking layout, hierarchy, interaction priority, and trust/status framing against the design source.
- Do not leave a route in `not audited this phase` once it becomes active implementation work for the sprint.
