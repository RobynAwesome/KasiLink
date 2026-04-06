---
title: KasiLink Obsidian Vault Guide
created: 2026-04-05
updated: 2026-04-06
author: Codex
tags:
  - obsidian
  - vault
  - second-brain
  - structure
  - knowledge-base
priority: high
audience:
  - owner
  - lead
  - devs
status: active
---

# KasiLink Obsidian Vault Guide

> Use this note to mirror the repo into Obsidian as a second brain.

## Vault Goal

Keep the repo-backed knowledge base readable in Obsidian without duplicating content or losing the structure you already built in `Structure/`.
The default repo standard is now the `Structure/Schematics/` pattern, modeled on `Introduction to MCP`.

## Recommended Vault Layout

```text
KasiLink Vault/
├── 00-Home/
├── 01-Mission/
├── 02-Strategy/
├── 03-Architecture/
├── 04-Updates/
├── 05-Training/
├── 06-Reference/
├── 07-Information/
├── 08-Design/
├── 09-Issues/
├── 10-Details/
├── 99-Archive/
└── Templates/
```

## Folder Mapping

- `00-Home/` - mirror `Structure/Schematics/00-Home/Dashboard.md`.
- `01-Mission/` - mirror `Structure/Schematics/01-Mission/`.
- `02-Strategy/` - mirror `Structure/Schematics/02-Strategy/`.
- `03-Architecture/` - mirror `Structure/Schematics/03-Architecture/`.
- `04-Updates/` - mirror `Structure/Schematics/04-Updates/` plus the live repo updates layer.
- `05-Training/` - mirror orch and AI editor rules.
- `06-Reference/` - mirror cross-linked reference notes.
- `07-Information/` - mirror source-backed facts and archive indexes.
- `08-Design/` - mirror design references and mockups.
- `09-Issues/` - mirror QA and smoke-test records.
- `10-Details/` - mirror clarifications and supporting context.
- `99-Archive/` - old notes that are still useful but no longer active.
- `Templates/` - note templates and daily note formats.

## Read Flow

`00-Home` -> `01-Mission` -> `02-Strategy` -> `03-Architecture` -> `04-Updates` -> `05-Training` -> `06-Reference`

## What to Link

- Link the mission note to the roadmap note.
- Link roadmap items to the relevant information and design notes.
- Link each issue note back to the feature or file it affects.
- Link billing notes to the payment architecture and product rules.

## Priority Mirror Notes

- Mirror resolved high-impact regressions into `09-Issues/` even after the code fix lands.
- Current example: `Structure/Issues/tailwind-v4-global-css-regression-2026-04-06.md`.
- Mirror canonical implementation rules from `Structure/Updates/current-alignment-notes.md` when they prevent repeat failures.

## Tags to Use

- `#mission`
- `#roadmap`
- `#billing`
- `#design`
- `#qa`
- `#source`
- `#archive`
- `#owner-action`
- `#lead-action`
- `#dev-action`

## Suggested Note Types

- Mission note
- Daily log
- Feature spec
- Issue tracker
- Decision note
- Source note
- Design reference
- Archive note

## Sync Rule

If a note matters to the repo, the repo copy is canonical. Obsidian should mirror it, not replace it.
