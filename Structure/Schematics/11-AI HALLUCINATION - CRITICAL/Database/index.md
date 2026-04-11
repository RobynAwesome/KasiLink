---
title: Hallucination Database Index
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - hallucination
  - database
  - index
priority: critical
status: active
---

# Hallucination Database Index

> Master record of all hallucinations across all KasiLink agents.
> Every incident logged here feeds Orch's supervision training.

## Database Summary

| Date | Agent | Type | Severity | Session |
|------|-------|------|----------|---------|
| 2026-04-11 | Claude | Assumed Instruction | CRITICAL | 0057 |
| 2026-04-11 | Claude | Capability Drift | MID | 0057 |
| 2026-04-11 | Claude | False Attribution | CRITICAL | 0057 |

**Total incidents:** 3
**Full Breach sessions:** 1 (2026-04-11)
**Agents with recurring pattern:** Claude (3 incidents same session)

## Recurrence Rule

- Same hallucination type twice = recurring pattern flag
- Three incidents in one session = Full Breach
- Full Breach agent flagged for review before next assignment

## Full Incident Reports

- [[2026-04-11 Incidents Index]] — all incidents from 2026-04-11
- Anthropic vault: `11-AI HALLUCINATION - CRITICAL/Database/Hallucination Database Master.md`

## Connected Notes

- [[11-AI HALLUCINATION - CRITICAL Index]] — parent index
- [[Insubordination Register]] — breach cross-reference
- [[Orch Train Logs Index]] — training feed
