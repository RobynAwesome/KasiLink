# 4-Phase Execution Plan v2 (20 Tasks)

Status date: 2026-04-06

## Phase 1 — MORE UI/UX (5/5)

- [x] Add home-page quick-actions block for faster route entry.
- [x] Add spotlight filter reset action for quicker recovery from over-filtering.
- [x] Add forum filter reset action for faster thread discovery.
- [x] Align `JobCard` with app visual language (`kasi-card`, theme colors).
- [x] Add spotlight “added” relative timestamp when data provides `createdAt`.

## Phase 2 — Accessibility & Semantics (5/5)

- [x] Add `aria-live` status for spotlight result updates.
- [x] Add `aria-live` status for forum result updates.
- [x] Add explicit form label associations (`htmlFor` / `id`) in forum thread composer.
- [x] Preserve screen-reader-only utility usage for async loading/result feedback.
- [x] Keep semantic article structure on reusable cards.

## Phase 3 — Interaction & Feedback Quality (5/5)

- [x] Standardize relative-time rendering in forum thread timestamps.
- [x] Standardize relative-time rendering in spotlight cards when available.
- [x] Keep filter interactions responsive by setting loading states from user actions.
- [x] Ensure forum and spotlight clear actions reset state predictably.
- [x] Reduce visual inconsistency from hardcoded color classes in `JobCard`.

## Phase 4 — Consistency, Docs, and Release (5/5)

- [x] Reuse shared formatting utility from `lib/format.ts` across updated views.
- [x] Update home route with additional fast-path UX without changing route semantics.
- [x] Document second 20-task cycle in `docs/`.
- [x] Run `lint`, `typecheck`, and `test` successfully.
- [x] Deploy production build with the v2 changes.
