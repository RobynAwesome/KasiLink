---
title: Truth Register
created: 2026-04-06
updated: 2026-04-06
author: Codex
tags:
  - updates
  - truth
  - normalization
  - audit
priority: high
status: active
---

# Truth Register

## Summary

This note captures concrete corrections where legacy planning notes no longer match the current repo state.

## Verified Corrections

| Topic | Legacy claim | Current repo truth |
| --- | --- | --- |
| Conversation model | `Conversation.ts` is a 1-line stub | [../../lib/models/Conversation.ts](../../lib/models/Conversation.ts) is implemented with schema, indexes, and model export |
| Message model | `Message.ts` is a 1-line stub | [../../lib/models/Message.ts](../../lib/models/Message.ts) is implemented with schema, indexes, and model export |
| Logger | Logger was deferred/empty in legacy notes | [../../lib/logger.ts](../../lib/logger.ts) now exists and is wired into multiple API routes |
| Load-shedding API | Route shown as in progress in old alignment note | [../../app/api/load-shedding/route.ts](../../app/api/load-shedding/route.ts) exists now |
| Incidents pages | Old alignment note says DEV_2 in progress | [../../app/incidents/page.tsx](../../app/incidents/page.tsx) and [../../app/incidents/new/page.tsx](../../app/incidents/new/page.tsx) exist now |
| Community-status API | Listed in old alignment note | No `app/api/community-status/route.ts` exists in the current file tree |
| Community-events alias route | Listed as consolidated route | No `app/api/community-events/route.ts` exists in the current file tree |
| Business-spotlight alias route | Listed as consolidated route | No `app/api/business-spotlight/route.ts` exists in the current file tree |
| Community calendar route naming | Some legacy notes assign work to `app/api/community-events/route.ts` | The implemented route is [../../app/api/community-calendar/route.ts](../../app/api/community-calendar/route.ts) |
| Spotlight route naming | Some legacy notes assign work to `app/api/business-spotlight/route.ts` and `app/business-spotlight/page.tsx` | The implemented surfaces are [../../app/api/spotlight/route.ts](../../app/api/spotlight/route.ts) and [../../app/spotlight/page.tsx](../../app/spotlight/page.tsx) |
| Route counts | Legacy notes repeat `42 routes` and `45 routes` as if stable facts | Those are historical snapshots; current truth should come from fresh build output, not legacy counts |
| Comms/dev/task status | Legacy notes describe active DEV_1/DEV_2 ownership and in-progress states | Those should be read as historical operations records, not current canonical state |

## Rule

- When legacy notes and the file tree disagree, prefer verified current repo state.
- Keep legacy notes for history, but link back here or to the newer Schematics notes when truth matters.

## Canonical Sources

- Coordination hub: [[Coordination Hub]]
- Operating rules: [[Operating Rules]]
- Project audit snapshot: [[Project Audit Snapshot]]
- Implementation gaps: [[Implementation Gaps]]
