---
title: Dispatch — DEV_S — 2026-04-11
created: 2026-04-11
updated: 2026-04-11
author: Claude (Lead Coder)
tags:
  - dispatch
  - dev_s
  - kasilink
  - demo-day
priority: critical
status: ACTIVE
audience: DEV_S
---

# Dispatch — DEV_S — KasiLink Session 2026-04-11

> From: Claude (Lead Coder)
> To: DEV_S (all support developers — Codex, Germini, future agents)
> Demo Day: April 15–17, 2026 — 4 days away. Every change matters.

---

## READ BEFORE TOUCHING ANYTHING

You are operating on a LIVE production app at `www.kasilink.com`. Broken code ships to real users.

**Mandatory reading before writing a single line:**
1. This file — complete
2. `Structure/02-Strategy/delegation-2026-04-05-DEV_S.md` — all 6 error classes
3. The file(s) you are about to modify — in full
4. `AGENTS.md` at repo root — project rules

**If you skip any of the above and break the build, you are removed from the lane.**

---

## Project State

- **Repo:** `C:\Users\rkhol\kasi-link`
- **Stack:** Next.js 16, TypeScript, Tailwind CSS 4, Clerk auth, MongoDB Atlas, Vercel
- **Production:** `https://www.kasilink.com` — LIVE
- **Build command:** `npm run build` — must pass after every change
- **Lint command:** `npm run lint` — must be clean
- **Typecheck:** `npm run typecheck` — zero errors required

---

## Your Active Task — T4: Terms Page

### What
Create `/app/terms/page.tsx` — POPIA-compliant Terms of Service page.

### Why
Legal requirement. Cannot launch publicly without it. This was assigned previously and never delivered.

### Exact file location
```
C:\Users\rkhol\kasi-link\app\terms\page.tsx
```

### Rules for this file
- **NO** `"use client"` — this is a static Server Component (no hooks, no interactivity)
- Match the visual style of `app/privacy/page.tsx` EXACTLY — same layout classes, same heading structure
- Contact email: `kasilink.rsa@gmail.com`

### Required sections (in order)
1. Introduction — "These Terms of Service govern your use of KasiLink..."
2. Who Can Use KasiLink — 18+ years, SA resident, valid phone number
3. What KasiLink Is — marketplace platform, not an employer, not responsible for gig outcomes
4. Gig Poster Responsibilities — accurate listings, legal work only, pay what was promised
5. Gig Worker Responsibilities — only apply for work you can do, communicate professionally
6. Prohibited Content — no fake gigs, no harassment, no illegal services
7. Intellectual Property — content stays yours, you grant KasiLink a display licence
8. Data and Privacy — reference `/privacy` for full POPIA disclosure
9. Limitation of Liability — KasiLink not liable for disputes between users
10. Termination — accounts violating terms can be suspended
11. Contact — `kasilink.rsa@gmail.com`

### After creating the file
1. Run `npm run build` — paste the output in comms-log
2. Run `npm run lint` — paste the result
3. Verify the route renders: `http://localhost:3000/terms`
4. Add `/terms` link to the Footer component (find it in `components/Footer.tsx` — add alongside `/privacy`)
5. Log completion in `Structure/04-Updates/comms-log.md`

### Completion report format
```
### 2026-04-11 | DEV_S | T4 — TERMS PAGE

**Files created/modified:**
- app/terms/page.tsx — [line count] lines
- components/Footer.tsx — added /terms link

**Build:** PASS / FAIL
**Lint:** PASS / FAIL
**Route accessible:** YES / NO

**Notes:** [anything Lead needs to know]
```

---

## What You Must NOT Touch

| File / Area | Reason |
|-------------|--------|
| `app/api/**` | API routes — Lead-only |
| `app/page.tsx` | Home — Lead-only |
| `components/Navbar.tsx` or Navbar sub-components | Recently refactored — do not touch |
| `package.json` | No new dependencies without Lead approval |
| `.env.local` | Owner-only |
| Any file not listed in your task | Out of scope |

---

## The 6 Error Classes — Know These

Taken from `delegation-2026-04-05-DEV_S.md`. If you repeat any of these you are removed:

| Class | Error | Never do this |
|-------|-------|---------------|
| A | React hooks in Server Components | No useState/useEffect without `"use client"` |
| B | `"type": "module"` in package.json | Never add this |
| C | Wrong route file location | All API handlers → `app/api/[name]/route.ts` |
| D | Stale library API assumptions | Read node_modules types — don't assume |
| E | Phantom completion | Never report done if file is missing/empty/build fails |
| F | Destructive overwrites | Read full file before modifying. ADD means add, not replace. |

---

## Naming Rules (Critical — Do Not Surface Legacy Names)

| Legacy | Canonical |
|--------|-----------|
| `orch` | Kopano Context (KC) |
| `gui` | Kopano Studio |
| `neural-link` | Kopano Studio |
| `Gemini` (self-reference as agent) | Germini |

---

## Escalation

- Build fails after your change → STOP, post in comms-log immediately, do NOT push
- Unsure about a file → post question in comms-log, wait for Lead response
- Route returns 500 in production → STOP, escalate to Claude immediately
- Any owner-blocked item appears in your path → log it as BLOCKED, do not attempt to resolve
