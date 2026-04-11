---
title: Repo Documents Index
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - reference
  - repo
  - index
  - documents
priority: medium
status: active
---

# Repo Documents Index

> Map of documents that live outside Structure/Schematics but are part of the KasiLink knowledge system.
> These stay at their repo locations — they are indexed here, not moved.

## Root Level Documents

| File | Purpose | Status |
|------|---------|--------|
| `CLAUDE.md` → `AGENTS.md` | Claude Code project instructions | Active |
| `AGENTS.md` | Next.js doc-first rule for Claude | Active |
| `README.md` | Public-facing repo description | Needs update |
| `package.json` | Dependencies and scripts | Active |
| `next.config.ts` | Next.js configuration | Active |
| `tailwind.config.ts` | Tailwind CSS configuration | Active |
| `prisma/schema.prisma` | Database schema | Active |

## Structure/ Documents

| File | Purpose | Status |
|------|---------|--------|
| `Structure/index.md` | Structure folder root | Active |
| `Structure/technical-Specifications.md` | Full technical spec | Active |
| `Structure/Updates/index.md` | Updates hub | Active |
| `Structure/Updates/delegation-protocol.md` | Delegation rules | Active |
| `Structure/Updates/task-board.md` | Sprint task tracker | Active |
| `Structure/Updates/dev-tracker.md` | Dev assignment history | Active |
| `Structure/Updates/comms-log.md` | Agent communication log | Active |
| `Structure/Updates/orch-blueprint.md` | Orch role in KasiLink | Active |
| `Structure/Updates/master-todo.md` | Master's to-do list | Active |
| `Structure/Updates/orch-train-session-2026-04-11.md` | Session training log | Active |
| `Structure/Updates/token-audit-2026-04-11.md` | Token audit record | Active |

## Key App Directories

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router — all routes |
| `app/api/` | API routes |
| `app/api/load-shedding/route.ts` | EskomSePush integration (coded, needs key) |
| `components/` | React components |
| `components/LoadSheddingWidget.tsx` | Load shedding UI widget |
| `lib/` | Shared utilities |
| `lib/suburbs.ts` | Suburb/city detection logic |
| `public/Icons/` | App icons including USSD icon |
| `tests/` | Jest test suite (146 passing) |

## Rule

Keep app/runtime documents at repo root or their natural location.
Use this index to map them into Obsidian — do not move them.

## Connected Notes

- [[System Map]] — architecture reference
- [[06-Reference Index]] — parent index
- [[Implementation Gaps]] — what is not yet built
