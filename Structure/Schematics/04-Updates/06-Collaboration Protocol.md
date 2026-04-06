---
title: Collaboration Protocol
created: 2026-04-06
updated: 2026-04-06
author: Codex
tags:
  - updates
  - collaboration
  - delegation
  - workflow
priority: high
status: active
---

# Collaboration Protocol

## Summary

This note mirrors the durable parts of `Structure/Updates/delegation-protocol.md` into Schematics. It preserves the rules that still matter while avoiding old role names and command structure details becoming mistaken for current truth.

## Durable Collaboration Rules

1. Scoped contributors should only edit explicitly assigned files.
2. Shared infrastructure changes need tighter review than isolated feature work.
3. Conflicts over the same file should be escalated before edits happen.
4. Task status, decisions, and blockers should be recorded in the project’s coordination notes rather than buried in ad hoc chat.
5. Legacy communication hierarchy rules are historical unless reaffirmed in the current workflow.

## What Still Matters From The Legacy Protocol

- Explicit file scope reduces merge collisions and hallucinated completion claims.
- Coordination records should be append-oriented and easy to audit.
- Shared infra, dependencies, and route signatures need stricter ownership.
- Verification after delegated work is mandatory.

## What To Treat As Historical

- Specific references to Claude, Gemini, DEV_1, and DEV_2 are session-era operating history.
- The old chain-of-command block should not be reused as a timeless operating model without a fresh owner decision.
- Any protocol text that assumes a specific staffing layout should be treated as historical context, not a standing truth note.

## Canonical Sources

- Schematics Index: [[Schematics Index]]
- Dashboard: [[Dashboard]]
- Coordination hub: [[Coordination Hub]]
- Legacy delegation source: [../../Updates/delegation-protocol.md](../../Updates/delegation-protocol.md)
- Live task board: [../../Updates/task-board.md](../../Updates/task-board.md)
