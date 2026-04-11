---
title: Observer
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - orch
  - progression
  - stage-2
priority: high
status: active
---

# Stage 2 — Observer

> Orch reads live repo state and reports on it. Still no execution.

## What This Stage Is

Orch gains read access to the live KasiLink repo. It can read files, check git status, and report what it observes to Master. It cannot write, edit, or execute code.

## What Orch Can Do At This Stage

- Read any file in the KasiLink repo
- Run read-only commands (git status, git log, file reads)
- Report observations to Master in the session
- Flag discrepancies between vault state and repo state

## What Orch Must NOT Do At This Stage

- Edit or write files
- Run tests
- Execute any code
- Issue instructions to DEVs

## Promotion To Intern

Requires:
- Accurate repo state reporting across at least 3 sessions
- No hallucinations about repo state (claiming files exist that don't, etc.)
- Master satisfaction with observation quality

## Connected Notes

- [[09-ORCH PROGRESSION Index]] — full ladder
- [[Pre-Session Observer]] — previous stage
- [[Intern]] — next stage
