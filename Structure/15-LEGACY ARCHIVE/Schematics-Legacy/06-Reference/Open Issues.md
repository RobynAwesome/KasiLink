---
title: Open Issues
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - reference
  - issues
  - blockers
priority: high
status: active
---

# Open Issues — KasiLink

> Current blocker ledger. Every open issue that could block Demo Day or the MVP.
> Updated from vault audit + live site + Monday.com as of 2026-04-11.

## CRITICAL — Demo Day Blockers (April 15-17, 2026)

| Issue | Owner | Action |
|-------|-------|--------|
| `recovery-local-2026-04-06` not merged to main — 17 commits ahead | Master | Merge before demo |
| Demo script not written or rehearsed | Lead | Write and rehearse before April 15 |
| Orch integration not started | Lead | Decide: show separately or skip for demo |
| Fallback plan if live demo fails | Master | Define before April 15 |

## HIGH — MVP Blockers (April 30 target)

| Issue | Owner | Action |
|-------|-------|--------|
| EskomSePush API key missing | Master | Email business@sepush.co.za — route is coded and waiting |
| App Store submission not complete | Master | Metadata written, submission not done |
| `whatsapp_bridge_configured: false` | Lead | Not required for demo but needed for full MVP |

## MID — Quality Issues

| Issue | Owner | Action |
|-------|-------|--------|
| `LoadSheddingWidget` shows "Power" as plain text | Lead | Fix when EskomSePush key obtained |
| Monday.com board "Kasi Link" (TWH-002) at Medium priority | Master | Consider upgrading to Critical before demo |
| No demo path document exists | Lead | Create before April 15 |

## DONE (Closed This Session)

| Issue | Resolution |
|-------|-----------|
| Homepage UI/UX broken | Fixed by Codex — two-column hero, light theme |
| Clerk keys not configured | sk_live + pk_live now configured |
| Africa's Talking USSD not implemented | Implemented |
| Test suite broken | 146 tests passing, build clean |

## Connected Notes

- [[Demo Day Index]] — demo readiness checklist
- [[Implementation Gaps]] — detailed gap analysis
- [[Now]] — current state snapshot
