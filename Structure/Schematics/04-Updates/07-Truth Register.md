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
| Logger | Logger gap may be queued | [../../lib/logger.ts](../../lib/logger.ts) is currently empty and remains a real gap |
| Load-shedding API | Route shown as in progress in old alignment note | [../../app/api/load-shedding/route.ts](../../app/api/load-shedding/route.ts) exists now |
| Incidents pages | Old alignment note says DEV_2 in progress | [../../app/incidents/page.tsx](../../app/incidents/page.tsx) and [../../app/incidents/new/page.tsx](../../app/incidents/new/page.tsx) exist now |
| Community-status API | Listed in old alignment note | No `app/api/community-status/route.ts` exists in the current file tree |
| Community-events alias route | Listed as consolidated route | No `app/api/community-events/route.ts` exists in the current file tree |
| Business-spotlight alias route | Listed as consolidated route | No `app/api/business-spotlight/route.ts` exists in the current file tree |

## Rule

- When legacy notes and the file tree disagree, prefer verified current repo state.
- Keep legacy notes for history, but link back here or to the newer Schematics notes when truth matters.

## Canonical Sources

- Coordination hub: [[Coordination Hub]]
- Operating rules: [[Operating Rules]]
- Project audit snapshot: [[Project Audit Snapshot]]
