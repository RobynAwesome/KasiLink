---
title: Structure Audit And Execution Plan - 2026-04-11
created: 2026-04-11
updated: 2026-04-11
author: Codex
tags:
  - audit
  - structure
  - execution
  - design
  - information
  - details
priority: critical
audience:
  - owner
  - lead
  - devs
  - reviewers
status: active
---

# Structure Audit And Execution Plan - 2026-04-11

> This note supersedes older broad cleanup plans for the current phase.
> The focus is narrower and stricter: `Structure/Design`, `Structure/Information`, and `Structure/Details` are the control inputs for the next implementation cycle.

## Executive Summary

The project does not lack source material. It lacks disciplined conversion of that material into implementation control.

- `Design/` already contains the route-level visual intent for most important surfaces.
- `Information/` already contains factual and civic reference material that should shape copy, trust messaging, and feature framing.
- `Details/` is not yet functioning as the clarification layer it is supposed to be.

The execution mistake to avoid is treating these folders as archives. For this phase they are operating inputs.

## Audited Facts

### Design

- 33 HTML design files exist.
- 28 PNG screenshots exist.
- 10 markdown notes exist.
- The strongest route-driving assets are the light-mode Ubuntu Pulse screens plus selected feature and sub-feature screens.
- The largest gap is indexing and route mapping, not asset volume.

### Information

- 21 PDFs exist, mainly under `About Government/` and `Blogs/`.
- 9 markdown files exist across `About SA/`, `FAQ/`, `Issues/`, `Service/`, and the archive index.
- Extracted notes now exist, but the folder still does not explicitly map sources to route copy or metadata.

### Details

- 3 image files exist in `clarifying-pictures/`.
- 2 markdown files exist, but the index was effectively empty before this pass.
- `technical-Specifications.md` had duplicated frontmatter and was not clean enough to serve as a reliable companion note.

## Ranked Findings

### Critical

1. There was no single current note telling the team that these three folders are the active control scope for this phase.
2. `Details/` was too weak to support review or clarification work.
3. Older planning files remained easy to misread as current truth without a newer execution note overriding them.

### High

1. `Design/` did not declare which route each priority stitch asset governs.
2. `Information/` did not explicitly state the rule that PDFs are source material and markdown notes are the app-ready layer.
3. The main Structure read path did not direct contributors into a current audit note first.

### Medium

1. The relationship between design evidence, factual evidence, and implementation work was implied rather than stated.
2. Clarifying pictures existed without a stronger indexing standard.

## Improved Execution Plan

### Phase A - Control Layer Cleanup

- Make the Structure read order explicit.
- Mark the three focus folders as the active phase scope.
- Clean companion notes that are malformed or too thin to be useful.

### Phase B - Design-To-Route Mapping

- Treat the following as priority route references:
  - home
  - marketplace
  - forum
  - verified
  - water outages
  - community status
  - utility schedule
  - community calendar
  - spotlight
  - tutoring
- For each route, record one of:
  - matches structure
  - partially matches structure
  - diverges from structure

### Phase C - Information Distillation

- Convert high-value PDFs and notes into route-ready facts before they become product copy.
- Prioritize facts that support:
  - township problem framing
  - transport and proximity rationale
  - utility-awareness rationale
  - trust and safety framing
  - youth employment and skills framing

### Phase D - Details Clarification

- Keep `Details/` small but useful.
- Only retain files that clarify architecture, execution, or review decisions.
- Index diagrams and pictures by purpose, not just by filename.

### Phase E - Implementation Loop

- Use `Design/` to drive UI work.
- Use `Information/` to drive factual wording and trust content.
- Use `Details/` when a reviewer needs the “why” behind the route or system shape.

## Changes Carried Out In This Pass

- Updated `Structure/index.md` to point to this note and define the phase scope.
- Updated `Structure/Design/index.md` with an audit summary and priority screen map.
- Updated `Structure/Information/index.md` with source-handling rules and current audit notes.
- Built out `Structure/Details/index.md` so it functions as an actual index.
- Cleaned duplicated frontmatter from `Structure/Details/technical-Specifications.md`.
- Realigned GitHub `main` to the recovery branch history and preserved the old remote `main` as `main-backup-2026-04-11`.

## Next Execution Moves

1. Audit every high-priority route against its matching design asset and record pass/partial/fail.
2. Distill the highest-value Information sources into short route-ready facts and trust statements.
3. Update the live app route copy and metadata from those audited inputs, not from memory.
4. Re-run verification after each route cluster, not only at the end.
