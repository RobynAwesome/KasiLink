# 4-Phase Execution Plan v5 (20 Tasks) — Lead + DEV_2 + DEV_3

Status date: 2026-04-06

## Ownership split
- Lead: 5 tasks (one full phase)
- DEV_2: 5 tasks
- DEV_3: 10 tasks

## Phase 1 — Lead-Owned UI/UX Phase (5/5)
- [x] Add home “Community Pulse” strip to improve above-the-fold context.
- [x] Add forum sorting controls (`newest`, `oldest`) and sorted rendering.
- [x] Add forum sort visibility badge in active filters area.
- [x] Improve spotlight business phone usability with `tel:` call actions.
- [x] Publish v5 tracker and wire it into repo docs.

## Phase 2 — DEV_2 Scoped Delivery (5/5 target)
- [ ] Chat page conversation search by gig title.
- [ ] Chat page conversation count + selected indicator badge.
- [ ] Default chat panel copy-to-clipboard action per message.
- [ ] Default chat panel failed-send inline error + retry guidance.
- [ ] Default chat panel empty-state quick action to marketplace.

## Phase 3 — DEV_3 Scoped Delivery (10/10 target)
- [ ] Community calendar clear filters.
- [ ] Community calendar active filter count badge.
- [ ] Community calendar active suburb/type badges.
- [ ] Community calendar `aria-live` loading/results.
- [ ] Community calendar empty-state reset when filtered.
- [ ] Water outages scheduled-alert clear suburb filter.
- [ ] Water outages scheduled-alert active filter badge.
- [ ] Water outages scheduled-alert `aria-live` loading/results.
- [ ] Water outages scheduled-alert empty-state reset when filtered.
- [ ] Water outage report form label/input id accessibility fixes.

## Phase 4 — Integration & Release
- [ ] Integrate DEV_2 + DEV_3 deliverables into mainline.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run test`.
- [ ] Deploy production and record inspector URL.
