# 4-Phase Execution Plan v4 (20 Tasks) — Lead + DEV_2 + DEV_3

Status date: 2026-04-06

## Ownership split
- Lead: 5 tasks
- DEV_2: 5 tasks
- DEV_3: 10 tasks

## Phase 1 — MORE UI/UX (5/5)
- [x] (Lead) Add marketplace sort control (`newest`, `nearest`, `pay-high`).
- [x] (Lead) Add sorting badge in active filter chips.
- [x] (Lead) Keep sorting reflected in URL filter state.
- [x] (Lead) Apply client-side sorted render without API schema changes.
- [x] (Lead) Record v4 plan and ownership map.

## Phase 2 — DEV_2 Scoped Delivery (5/5)
- [x] (DEV_2) Skin selector Home/End keyboard support.
- [x] (DEV_2) Skin selector keyboard focus-visible ring polish.
- [x] (DEV_2) Conversation list ArrowUp/ArrowDown + Enter/Space select.
- [x] (DEV_2) Notification dropdown retry action on load error.
- [x] (DEV_2) Notification dropdown manual refresh action.

## Phase 3 — DEV_3 Scoped Delivery (10/10)
- [x] (DEV_3) Incidents clear filters action.
- [x] (DEV_3) Incidents active filter count badge.
- [x] (DEV_3) Incidents active filter chips.
- [x] (DEV_3) Incidents `aria-live` loading/results.
- [x] (DEV_3) Incidents empty-state reset action.
- [x] (DEV_3) Tutoring clear filters action.
- [x] (DEV_3) Tutoring active filter count badge.
- [x] (DEV_3) Tutoring active filter chips.
- [x] (DEV_3) Tutoring `aria-live` loading/results.
- [x] (DEV_3) Tutoring empty-state reset action.

## Phase 4 — Integration & Release (0/0)
- [x] Integrated DEV_2 and DEV_3 changes with Lead-owned phase work.
- [x] Validation gates to run: `lint`, `typecheck`, `test`.
- [x] Release deploy completed to production.
