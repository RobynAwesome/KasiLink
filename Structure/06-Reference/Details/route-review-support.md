---
title: route-review-support
created: 2026-04-11
updated: 2026-04-11
author: Codex
tags:
  - details
  - review
  - routes
  - clarification
priority: medium
audience:
  - owner
  - lead
  - devs
status: active
---

# Route Review Support

Use this note when reviewing whether a route is truly ready.

## Review order

1. Check the route against `Structure/Design/route-audit-matrix.md`.
2. Open the matching stitch asset in `Structure/Design/`.
3. Confirm whether route copy uses only claims already distilled in `Structure/Information/source-to-copy-map.md`.
4. Use the diagrams in `clarifying-pictures/` only when architecture or testing context is needed to explain a decision.

## Current route-reference pairs

- `/water-outages` -> `features/stitch/water_outage_alert_details/`
- `/community-status` -> `sub-features/stitch/stitch/community_status/`
- `/utility-schedule` -> `sub-features/stitch/stitch/utility_schedule/`
- `/community-calendar` -> `features/stitch/community_calendar/`
- `/spotlight` -> `features/stitch/local_business_spotlight/`
- `/tutoring` -> `tutoring/`

## Review standard

A route is not a `match` unless:

- the visual hierarchy reads like the design source
- the CTA order is intentional
- empty, loading, and fallback states are present
- trust or status framing is visible where the route needs it
- factual copy can be traced back to a distilled Information note
