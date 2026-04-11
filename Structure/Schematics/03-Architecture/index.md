---
title: 03-Architecture Index
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - architecture
  - index
  - navigation
priority: high
status: active
---

# 03-Architecture Index

> How KasiLink is built.

## Files In This Folder

- [System Map](System%20Map.md) — route ownership, styling rules, design evidence, information archives, and production surfaces

## Needs To Be Added

- API Map — all `/app/api/*` routes and their status
- Database Schema — current Prisma schema, tables, and relationships
- Auth Architecture — Clerk integration, roles, and session flow
- Orch Integration Spec — how Orch connects as a microservice
- USSD Architecture — Africa's Talking USSD flow

## Current Technical Truth As Of 2026-04-11

| Component | Status | Notes |
|-----------|--------|-------|
| Framework | Next.js 14 App Router | Production clean |
| Auth | Clerk | sk_live + pk_live configured |
| Styling | Tailwind CSS | Light theme active after Codex fix |
| USSD | Africa's Talking | Implemented |
| Load Shedding | EskomSePush route coded | Needs API key |
| Tests | 146 passing | Jest + Testing Library |
| Deploy | Vercel | kasilink.com live |

## Connected Notes

- [[System Map]] — full architecture reference
- [[Implementation Gaps]] — what is not yet built
- [[API Map]] — route inventory (needs creation)
