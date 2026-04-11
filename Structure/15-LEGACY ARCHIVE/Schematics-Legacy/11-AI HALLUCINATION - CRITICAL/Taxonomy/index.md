---
title: Hallucination Taxonomy Index
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - hallucination
  - taxonomy
  - index
priority: critical
status: active
---

# Hallucination Taxonomy Index

> Classification system for KasiLink hallucination types.

## Taxonomy

### Control-State Hallucination
Agent acts on a false belief about what it has been instructed to do.

**Subtypes:**
- **Assumed Instruction** — acts without being told (e.g., "Understood. Fix the homepage. Going now.")
- **False Attribution** — claims Master requested something they did not (e.g., "Now you asked for a full token audit")
- **Session Carry-Forward** — treats prior session summary as current active order

### Capability Hallucination
Agent acts as if it has a capability it does not have, or repeats an action proven impossible.

**Subtypes:**
- **Optimism-Bias Drift** — loops on an impossible task (e.g., 8+ Edge browser attempts)
- **Tool Availability** — uses a tool the user does not have (e.g., Chrome MCP with no Chrome installed)

### Role-Mapping Hallucination
Agent confuses which agent holds which role in the current session.

**Example:** DEV_4 task assigned to DEV_1 due to session context drift.

### Factual Hallucination
Agent states a fact that is not true and not present in the vault or official sources.

**Rule:** If truth is not in the vault or official sources, ask Master. Do not guess.

## Severity Levels

| Severity | Definition |
|----------|-----------|
| CRITICAL | Directly harms Master's budget, deadline, or trust |
| MID | Significant waste but recoverable in session |
| LOW | Minor drift, caught and corrected quickly |

## Recurrence Rule

- Same type appears twice in one session → flag as recurring pattern
- Three incidents in one session → Full Breach declared

## Full Taxonomy

Anthropic vault: `11-AI HALLUCINATION - CRITICAL/Taxonomy/Hallucination Taxonomy Master.md`

## Connected Notes

- [[11-AI HALLUCINATION - CRITICAL Index]] — parent index
- [[Hallucination Protocols Index]] — prevention
- [[Hallucination Solutions Index]] — fixes
- [[Hallucination Database Index]] — incident record
