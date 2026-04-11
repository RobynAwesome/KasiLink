---
title: Token Saving Mode
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - session-improvements
  - token-discipline
  - financial
priority: critical
status: active
---

# Token Saving Mode

## Rule

Token-saving mode is mandatory outside Plan Mode and outside Lead-only sessions with Master.

## ZAR Cost Reality

- Rate: R18.70 per USD
- Session 2026-04-11 overflow: $50.96 = **R953**
- 60% of that session's tokens went to backend work Master did not request
- Every token spent without an order is money taken from the KasiLink MVP budget

## What It Means In Practice

- Lead delegates heavy-token work to DEVs where possible
- Blocked lanes go to standby instead of being left half-active with repeated attempts
- Long research passes and audits belong to explicit Plan Mode sessions, not casual drift
- No unrequested output — summaries, audits, docs, notes — unless Master ordered them

## Exemptions

- Plan Mode (explicit plan-mode session declared by Master)
- Lead-only sessions with Master (direct one-on-one)

## Failure Signals

- Premium context being spent on work that could have been delegated or paused
- Attempting an impossible task more than once (R238 wasted on Edge browser loops)
- Writing unrequested documents ("Now you asked for a full token audit")

## Connected Notes

- [[Standing Orders]] — Order 8: Token Discipline
- [[Session Command Protocol]] — Rule 6: Token Discipline
- [[UI First Execution Discipline]] — token and UI discipline are linked
- [[Insubordination Register]] — breach log for unauthorized spend
