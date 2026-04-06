# 4-Phase Execution Plan (20 Tasks)

Status date: 2026-04-06

## Phase 1 — More UI/UX (5/5)

- [x] Add production-ready default chat panel with real message history and send flow.
- [x] Improve marketplace filtering UX with explicit `Clear` action.
- [x] Surface active filters (including category) as visible badges.
- [x] Improve nav active-state styling and interaction consistency.
- [x] Tighten footer copy and action consistency.

## Phase 2 — Accessibility & Navigation (5/5)

- [x] Add skip-to-content link in root layout.
- [x] Add semantic main landmark target (`#main-content`).
- [x] Add `aria-current` for active nav links.
- [x] Add notification button ARIA wiring (`aria-expanded`, `aria-controls`).
- [x] Add live status region for marketplace loading results.

## Phase 3 — Interaction Quality (5/5)

- [x] Add outside-click and `Escape` behavior for notification tray.
- [x] Add relative-time formatting for conversation list and messages.
- [x] Pause chat polling work when tab is not visible.
- [x] Add reduced-motion CSS path for animations/transitions.
- [x] Add explicit input accessibility labeling in default chat composer.

## Phase 4 — Structure & Guardrails (5/5)

- [x] Keep route/page entrypoints thin with `features/*` boundaries.
- [x] Add canonical architecture docs in `docs/`.
- [x] Normalize style ownership to `app/globals.css`.
- [x] Keep lint/typecheck/test scripts wired and passing.
- [x] Deploy validated production build after UX updates.
