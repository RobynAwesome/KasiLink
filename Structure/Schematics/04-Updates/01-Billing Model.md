---
title: Billing Model
created: 2026-04-06
updated: 2026-04-06
author: Codex
tags:
  - updates
  - billing
  - pricing
  - subscriptions
priority: critical
status: active
---

# Billing Model

## Summary

This note mirrors the highest-value billing decisions from the legacy updates layer into the Schematics system. It is the canonical Schematics entry for plan structure, provider direction, and implementation boundaries.

## Current Billing Shape

| Plan | Key | Trial | Monthly | Annual | Notes |
| --- | --- | --- | --- | --- | --- |
| Kasi Link Free | `free` | None | Free | Free | Useful default tier for seekers |
| Kasi Link Plus | `kasi_link_plus` | 3 days | $4.65 | $36.00 | Priority seeker tooling |
| Retailer Pro | `retailer_pro` | 7 days | $7.00 | $72.00 | Employer and retailer posting tier |
| Retailer Premium | `retailer_premium` | 14 days | $14.66 | $156.00 | Featured hiring and analytics tier |

## Product Rules

- Phone OTP stays free.
- The free tier must remain genuinely useful.
- Paid plans should improve posting, alerts, and employer tooling rather than locking basic access.
- Pricing must stay South Africa-aware rather than following generic SaaS pricing patterns.

## Technical Rules

- Keep billing provider-agnostic behind `lib/payments/`.
- Use server-side entitlement checks only.
- Sync plan state into Clerk metadata from verified webhooks, not from client actions.
- Prefer hosted checkout and hosted portal flows.
- Treat cancellation, retries, refunds, and payment failures as first-class flows.

## Provider Direction

- Do not assume Stripe is the default rail for South Africa.
- Paystack and Yoco remain the strongest local-fit references in the current planning record.
- Confirm live provider support, business eligibility, and ZAR pricing before implementation or launch.

## Planned Surfaces

- `app/api/billing/create-checkout/route.ts`
- `app/api/billing/create-portal/route.ts`
- `app/api/billing/webhook/route.ts`

## Canonical Sources

- Schematics Index: [[Schematics Index]]
- Dashboard: [[Dashboard]]
- Coordination hub: [[Coordination Hub]]
- Legacy billing source: [../../Updates/billing-plan.md](../../Updates/billing-plan.md)
- Alignment rules: [../../Updates/current-alignment-notes.md](../../Updates/current-alignment-notes.md)
