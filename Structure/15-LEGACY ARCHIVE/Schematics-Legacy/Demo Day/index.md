---
title: Demo Day Index
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - demo
  - demo-day
  - sa-startup-week
  - critical
priority: critical
status: active
---

# Demo Day

> SA Startup Week Hack Day — April 15-17, 2026
> Demo target: KasiLink live product + Orch AI integration story
> Platform: https://kasilink.com

---

## The Demo Story

KasiLink is a township gig marketplace powered by AI. We connect township workers with local buyers — using Orch as the AI brain for matching, routing, and automation.

**Demo flow (draft):**
1. Open kasilink.com — show the live, working homepage
2. Show township worker creating a gig profile
3. Show buyer searching and finding a worker
4. Show Orch matching AI in action (if integrated by then) OR show Orch demo from Anthropic vault
5. Show USSD fallback — no smartphone needed, Africa's Talking integration
6. Show load shedding awareness — EskomSePush widget (if API key obtained)

---

## Demo Readiness Checklist

| Item | Status | Owner |
|------|--------|-------|
| Homepage UI/UX live | PASS | Fixed by Codex 2026-04-11 |
| kasilink.com accessible | PASS | Vercel deploy live |
| Clerk auth working | PASS | Live keys configured |
| Africa's Talking USSD | PASS | Implemented |
| EskomSePush widget | BLOCKED | Needs API key |
| Orch integration | NOT STARTED | Post-demo milestone |
| App Store listing | IN PROGRESS | Metadata written |
| Demo script finalized | NOT DONE | Needed before April 15 |
| Rehearsal run | NOT DONE | Needed before April 15 |
| Fallback plan | NOT DONE | Needed if live demo fails |

---

## Blockers — Owner Must Handle

| Blocker | Action | Priority |
|---------|--------|----------|
| EskomSePush API key | Email business@sepush.co.za | HIGH |
| recovery-local-2026-04-06 not merged | Merge to main before demo | CRITICAL |
| Demo script not finalized | Write and rehearse | CRITICAL |
| Orch not integrated | Decide: show Orch separately or skip for demo | HIGH |

---

## Demo Script (Draft)

**Opening line:**
> "KasiLink is a township gig marketplace — we're giving township workers a digital storefront and connecting them with local buyers. No laptop required. Works on any phone."

**Key beats:**
- Homepage — clean, light, professional
- Worker profile — easy to create, works on mobile
- Buyer search — AI-powered matching (Orch)
- USSD — works without data
- Load shedding — aware of South Africa's reality

---

## Dates

| Date | Event |
|------|-------|
| 2026-04-15 | SA Startup Week Hack Day begins |
| 2026-04-17 | SA Startup Week Hack Day ends |
| 2026-04-30 | KasiLink MVP target |

---

## Connected Notes

- [[Now]] — current project state
- [[Implementation Gaps]] — what is not yet built
- [[System Map]] — architecture reference
- [[KasiLink Blueprint]] — mission and identity
- [[Orch Blueprint]] — Orch's role in the story (Anthropic vault)
