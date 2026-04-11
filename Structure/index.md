---
title: KasiLink Structure Map
created: 2026-04-05
updated: 2026-04-11
author: Codex
tags:
  - structure
  - navigation
  - mission
  - planning
  - design
  - information
  - issues
priority: critical
audience:
  - owner
  - lead
  - devs
  - reviewers
status: active
---

# KasiLink Structure Map

> Start here when you need to understand how the project is organized.
> This folder is the control plane for product intent, planning, reference material, and design evidence.

## Primary Entry Point

The canonical navigation layer now starts in `Structure/Schematics/`, following the same numbered vault pattern used in `Introduction to MCP`.

- [Schematics/index.md](Schematics/index.md) - Schematics root index and stable entrypoint.
- [Schematics/00-Home/Dashboard.md](Schematics/00-Home/Dashboard.md) - standard home dashboard for mission, strategy, architecture, updates, training, and reference.
- [Schematics/dashboard.md](Schematics/dashboard.md) - Obsidian-safe alias that redirects to the canonical dashboard.

## Read Flow

`Structure/index.md` -> `Structure/Schematics/index.md` -> `Structure/Schematics/00-Home/Dashboard.md` -> `Structure/Updates/2026-04-11-structure-audit-and-execution-plan.md` -> `Structure/technical-Specifications.md` -> `Structure/Updates/index.md` -> `Structure/Information/index.md` -> `Structure/Design/index.md` -> `Structure/Details/index.md` -> `Structure/Issues/index.md`

## Current Phase Focus

This phase is not a generic cleanup. The control scope is:

1. `Structure/Design/` as the visual source of truth for route implementation.
2. `Structure/Information/` as the factual source of truth for township, service, and trust content.
3. `Structure/Details/` as the clarification layer for diagrams, technical companion notes, and evidence that explains decisions.

## April 11 Audit Summary

- `Design/` is rich in real assets but weakly indexed. The files exist; the route-to-design mapping is the missing layer.
- `Information/` has strong raw sources and partial extracted notes, but the extraction discipline is not complete enough for copy, metadata, and trust claims.
- `Details/` is underbuilt. It does not yet function as a real clarification layer, and one note contained duplicated frontmatter before this pass.
- `Updates/project-audit.md` and `Updates/master-todo.md` contain useful history, but parts of them are stale and should not be treated as the current operating plan without cross-checking newer notes.
- GitHub `main` has been realigned to the recovery branch history, with `main-backup-2026-04-11` preserved as the old remote main snapshot.

## Non-Negotiable Security Rule

1. Never commit raw secrets, tokens, API keys, service-account files, `.env*` values, or copied credentials.
2. Never commit vendored dependency directories such as `node_modules/`.
3. Never paste real credentials into `Structure/` notes, screenshots, or comms updates.
4. If a secret is exposed or suspected exposed, treat it as compromised: stop normal work, tell Lead, rotate or revoke it outside git, remove the tracked exposure, then document the incident without repeating the secret.
5. Protecting the Owner's trust and safety overrides convenience, speed, and feature delivery.

## Folder Map

- [Schematics/index.md](Schematics/index.md) - root index for the Schematics navigation layer.
- [Schematics/00-Home/Dashboard.md](Schematics/00-Home/Dashboard.md) - canonical dashboard modeled on the Anthropic vault standard.
- [Schematics/01-Mission/KasiLink Blueprint.md](Schematics/01-Mission/KasiLink%20Blueprint.md) - mission synthesis note linked to the full technical specification.
- [Schematics/02-Strategy/Execution Map.md](Schematics/02-Strategy/Execution%20Map.md) - strategy and execution path.
- [Schematics/03-Architecture/System Map.md](Schematics/03-Architecture/System%20Map.md) - architecture and styling guardrails.
- [Schematics/04-Updates/Coordination Hub.md](Schematics/04-Updates/Coordination%20Hub.md) - entry into the live execution layer.
- [Schematics/05-Training/AI Editor Rules.md](Schematics/05-Training/AI%20Editor%20Rules.md) - editor and orch guardrails.
- [Schematics/06-Reference/Reference Map.md](Schematics/06-Reference/Reference%20Map.md) - canonical cross-links into the reference archives.
- [Schematics/Templates/Note Template.md](Schematics/Templates/Note%20Template.md) - standard frontmatter template for new notes.
- [technical-Specifications.md](technical-Specifications.md) - mission, product intent, and feature vision.
- [Updates/index.md](Updates/index.md) - active planning, coordination, billing, and execution control.
- [Updates/2026-04-11-structure-audit-and-execution-plan.md](Updates/2026-04-11-structure-audit-and-execution-plan.md) - current audit and execution sequence for the Structure-driven phase.
- [Information/index.md](Information/index.md) - source-backed facts, FAQs, services, and archive references.
- [Design/index.md](Design/index.md) - mockups, screenshots, and design references for implementation.
- [Details/index.md](Details/index.md) - supporting reference material and clarifications.
- [Issues/index.md](Issues/index.md) - smoke tests, QA issues, and follow-up tracking.
- [Obsidian/index.md](Obsidian/index.md) - second-brain vault layout and templates.

## Color Filters

- <span style="color:#dc2626">Critical</span> - blocks core product flow, launch, or trust.
- <span style="color:#ea580c">High</span> - important for the core experience and user adoption.
- <span style="color:#ca8a04">Medium</span> - differentiates the product or fills a major gap.
- <span style="color:#16a34a">Low</span> - polish, optional expansion, or post-launch work.

## Extra Filters

Use these tags when deciding where a file belongs:

- `Mission` - directly supports the product vision.
- `Execution` - active build or coordination work.
- `Reference` - factual material or source content.
- `Design` - mockups, visual specs, or UI direction.
- `QA` - tests, regressions, or verification notes.
- `Archive` - useful history that should stay readable but not drive current work.
- `Billing` - pricing, plans, plan gating, payment architecture.
- `Compliance` - POPIA, privacy, legal, or policy material.
- `Operations` - logging, monitoring, deployment, or system processes.
- `Obsidian` - local second-brain sync and note templates.

## Operating Rule For This Phase

- Do not invent new UI directions when a matching design asset already exists in `Structure/Design/`.
- Do not invent township or service claims when `Structure/Information/` has not yet been distilled into an extracted markdown note.
- Do not leave diagrams and screenshots unindexed when they are required to explain implementation decisions.
