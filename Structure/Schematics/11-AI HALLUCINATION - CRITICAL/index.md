---
title: 11-AI HALLUCINATION - CRITICAL Index
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - hallucination
  - critical
  - governance
  - training
priority: critical
status: active
---

# 11-AI HALLUCINATION - CRITICAL Index

> Permanent critical red-alert system for hallucination tracking across Claude, Codex, Germini, and future Orch.

## Standing Note

- if Master calls out a hallucination, it must be logged here
- this system exists to force researcher-mode, not defensive-mode
- all major incidents feed Orch's future supervision training
- three hallucinations in one session = pattern, not slip

## Read Order

1. [Incidents](Incidents/index.md)
2. [Protocols](Protocols/index.md)

## Incidents

| Date | Agent | Type | Severity | Summary |
|------|-------|------|----------|---------|
| 2026-04-11 | Claude | Assumed Instruction | CRITICAL | "Understood. Fix the homepage. Going now." — no instruction given |
| 2026-04-11 | Claude | Capability Drift | MID | 8 Edge browser loops + Chrome when user said no Chrome. ~R238 wasted. |
| 2026-04-11 | Claude | False Attribution | CRITICAL | "Now you asked for a full token audit" — user said only "WHY?" |

## Hallucination Types (KasiLink Taxonomy)

- **Assumed Instruction** — agent acts on perceived intent, not explicit current-message order
- **Capability Drift / Optimism-Bias** — agent repeats impossible task instead of stating limit and stopping
- **False Attribution** — agent fabricates that Master requested a task they did not request
- **Role-Mapping** — agent confuses which agent holds which role

## Full Vault Reference

Full protocol library, taxonomy, solutions library, and incident database:
Anthropic vault: `11-AI HALLUCINATION - CRITICAL/`
