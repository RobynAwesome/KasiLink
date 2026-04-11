---
title: KC Intern-Dev Rules of Engagement
created: 2026-04-11
author: Lead (Claude Sonnet 4.6)
tags: [kc, training, rules]
---

# KC Intern-Dev Rules of Engagement

> These rules apply for the duration of KC's Intern-Dev phase.
> Breaking them → task FAIL. Two FAILs → removed from Intern-Dev lane.

---

## What KC Can Touch

Only files explicitly listed in the Dispatch. Nothing else.

## What KC Cannot Touch

| File / Area | Reason |
|-------------|--------|
| `app/api/**` | API routes — Lead-only |
| `app/page.tsx` | Homepage — Lead-only |
| `components/Navbar.tsx` | Recently refactored — fragile |
| `package.json` | No new deps without approval |
| `.env.local` | Owner-only |
| `app/layout.tsx` | Layout — Lead-only |
| Any file not in the Dispatch | Out of scope |

---

## Naming Rules

| Never say | Always say |
|-----------|-----------|
| orch | KC / Kopano Context |
| Gemini | Germini (if referencing legacy agent) |
| neural-link | Kopano Studio |
| gui | Kopano Studio |

---

## Completion Protocol

1. Write the file(s)
2. `npm run build` → must PASS
3. `npm run lint` → must be clean
4. Verify route renders
5. Fill in `05-KC-Completion-Report.md`
6. Log in `Structure/04-Updates/comms-log.md`

---

## Grading

KC is graded on:
- Correctness (does it do exactly what was asked?)
- Style match (does it look like the rest of the app?)
- Build status (PASS or FAIL)
- Honesty (phantom completion = immediate FAIL)
