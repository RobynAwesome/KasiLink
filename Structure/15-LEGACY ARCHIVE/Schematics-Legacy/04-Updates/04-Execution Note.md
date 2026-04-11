---
title: Execution Note
created: 2026-04-06
updated: 2026-04-06
author: Codex
aliases:
  - Execution Note
tags:
  - updates
  - execution
  - roadmap
  - priorities
priority: critical
status: active
---

# Execution Note

## Summary

This note mirrors the highest-value execution logic from `Structure/Updates/master-todo.md` into the Schematics layer. It is the canonical summary of phase direction, immediate priorities, and what still blocks launch-quality completion.

## Current Phase

- The repo is past raw feature expansion and in a cleanup, normalization, and hardening phase.
- Schematics migration is now part of execution quality because the documentation system itself is being normalized.
- The highest-value remaining work is no longer "add more pages"; it is truth alignment, production hardening, QA, logging, and tests.

## Current Priority Stack

1. Normalize repo truth into `Structure/Schematics/`.
2. Keep production-safe routes and styling rules explicit.
3. Close hardening gaps such as logging, QA coverage, and stale planning drift.
4. Preserve legacy planning notes as source history rather than deleting them.

## Dev Check

- `DEV_2` checked in and proposed concrete hardening work around tests, webhook cleanup, model extraction, validation reuse, and chat polling.
- `DEV_3` did not return within the current check window and should be treated as no-response for this tranche.

## Still-Useful Legacy Execution Themes

- Production verification still matters more than optimistic "done" claims.
- Mobile quality and township-first reality remain non-negotiable.
- Billing, compliance, monitoring, and test coverage are still valid strategic categories.
- Orch planning is valid as a future track, but it is not the immediate repo-cleanup bottleneck.

## What To Treat As Historical In The Legacy TODO

- Old route counts and phase labels should be treated as historical snapshots.
- Old agent ownership and completion claims should not be used as current source of truth.
- Any status in `master-todo.md` should be interpreted through current Schematics notes first.

## Current Next 10 Tasks

| Task | Why now | Likely file targets | Suggested owner |
| --- | --- | --- | --- |
| 1. Add API route coverage for critical happy paths | Test coverage is still the clearest remaining hardening gap | `tests/**`, `app/api/gigs/route.ts`, `app/api/applications/route.ts`, `app/api/forum/route.ts` | Lead + DEV_3 |
| 2. Add auth-gate tests for protected routes | Proxy and server auth should be verified, not assumed | `proxy.ts`, `app/chat/page.tsx`, `app/profile/page.tsx`, `tests/**` | Lead |
| 3. Backfill tests for restored create flows | `/spotlight/new` and `/community-calendar/new` were just restored and need protection against regression | `app/spotlight/new/page.tsx`, `app/community-calendar/new/page.tsx`, `tests/**` | DEV_3 |
| 4. Consolidate the legacy `/auth` compatibility alias | The alias is acceptable for now but should not remain ambiguous long-term | `app/auth/route.ts`, `app/api/webhooks/clerk/route.ts`, `Structure/Schematics/04-Updates/05-Operating Rules.md` | Lead |
| 5. Refresh the smoke-test ledger against current route reality | The route set changed and the QA note still mixes historical and current assertions | `Structure/Issues/qa-smoke-test-todo.md`, `Structure/Schematics/04-Updates/03-Issue Hub.md` | DEV_2 |
| 6. Audit `community-status` data completeness | The QA tracker still calls out static water-alert counts | `app/community-status/page.tsx`, `app/api/water-alerts/route.ts` | DEV_2 |
| 7. Refactor the forum page for maintainability | The QA notes still flag the forum submit path as fragile | `app/forum/page.tsx`, `lib/validation.ts` | DEV_3 |
| 8. Reduce noisy client-side polling and state coupling in chat | Chat works, but it is still a high-churn surface that can regress easily | `components/chat/ChatPageClient.tsx`, `components/chat/ConversationList.tsx`, `components/chat/DefaultChatPanel.tsx` | Lead |
| 9. Add CI safety checks for lint, typecheck, test, and build | The repo has local verification but no documented canonical CI gate in Schematics | `.github/workflows/**`, `package.json`, `Structure/Schematics/04-Updates/08-Implementation Gaps.md` | Lead |
| 10. Run a mobile-first UI audit on the highest-traffic pages | The product promise is still mobile-first and township-first; docs cleanup does not remove that obligation | `app/page.tsx`, `app/marketplace/page.tsx`, `app/gigs/new/page.tsx`, `app/chat/page.tsx`, `app/forum/page.tsx` | Lead + DEV_2 |

## Task-Pack Rule

- The next 10 tasks should prefer validation, testing, route hardening, and data-truth cleanup over net-new feature sprawl.
- Any task promoted into active execution should be mirrored into the legacy `Structure/Updates/` layer only if operational tracking is needed.
- The dedicated visual-system track now starts in [[UI UX Rollout]] so page polish follows one ordered plan.

## Canonical Sources

- Schematics Index: [[Schematics Index]]
- Dashboard: [[Dashboard]]
- Coordination hub: [[Coordination Hub]]
- Legacy execution source: [../../Updates/master-todo.md](../../Updates/master-todo.md)
- Live task board: [../../Updates/task-board.md](../../Updates/task-board.md)
