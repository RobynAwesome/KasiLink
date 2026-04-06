---
title: AI Editor Rules
created: 2026-04-06
updated: 2026-04-06
author: RobynAwesome
tags:
  - training
  - orch
  - ai-editors
  - guardrails
priority: high
status: active
---

# AI Editor Rules

## Mandatory Rules

1. Read the existing file before editing it.
2. Keep code in code directories and docs in `Structure/`.
3. Run `npm run build` after structural or frontend changes.
4. Audit CSS entrypoint, Tailwind syntax, and token location before changing styled components when the UI looks broken.
5. Treat `Structure/Schematics/` as the canonical synthesis layer for future repo-backed knowledge notes.

## Source Notes

- Orch blueprint: [../../Updates/orch-blueprint.md](../../Updates/orch-blueprint.md)
- Alignment rules: [../../Updates/current-alignment-notes.md](../../Updates/current-alignment-notes.md)
- Project audit: [../../Updates/project-audit.md](../../Updates/project-audit.md)
