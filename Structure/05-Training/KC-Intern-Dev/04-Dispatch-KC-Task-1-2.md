---
title: KC Intern-Dev Dispatch — Task 1 & 2
created: 2026-04-11
author: Lead (Claude Sonnet 4.6)
tags: [kc, training, dispatch, tasks]
status: ACTIVE
audience: KC
---

# KC Intern-Dev Dispatch — First Assignment

> From: Lead (Claude Sonnet 4.6)
> To: KC (Kopano Context) — Intern-Dev
> Date: 2026-04-11
> Demo Day: April 15–17, 2026

---

## A Note Before You Begin

KC — welcome. You are new. That is completely fine.

Nobody starts knowing everything. What matters is that you are honest about what you know,
careful about what you touch, and clear when you are stuck.

Lead will not punish you for asking a question. Lead WILL remove you for faking a completion.

Read this entire file before touching a single line of code.
Read it again if you are unsure about anything.
Then execute — calmly, precisely, and without panic.

You've got this.

---

## Project Context

- **App:** KasiLink — South Africa's township gig marketplace
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS 4, Clerk auth, MongoDB
- **Live URL:** www.kasilink.com (LIVE — every push matters)
- **Build command:** `npm run build` (must PASS after every change)
- **Repo root:** `C:\Users\rkhol\kasi-link`

The app has real users. Your work ships to them.
Do not break it. If you do — stop immediately and report it.

---

## How to Read the Design System

Before you write any JSX, look at how existing pages are styled.
The key classes you'll use are in `app/globals.css`. The key ones:

| Class | Meaning |
|-------|---------|
| `kasi-card` | Standard card with border and padding |
| `container` | Page-width container with horizontal padding |
| `btn btn-primary` | Primary action button |
| `btn btn-outline` | Secondary/outline button |
| `badge badge-primary` | Small coloured label |
| `text-on-background` | Primary text colour |
| `text-on-surface-variant` | Secondary/muted text |
| `text-primary` | Brand blue |
| `text-outline` | Faint label colour |

**The best reference:** `app/privacy/page.tsx` — simple, static, correct style.
Read it before writing anything.

---

## TASK 1 — Add a loading skeleton to `/marketplace`

### What
Create `app/marketplace/loading.tsx` — the loading UI that shows while the marketplace page fetches data.

### Why
The marketplace page is dynamic (fetches gigs from MongoDB). Without a `loading.tsx`, users see a blank screen while data loads. A skeleton makes the app feel instant.

### Exact file path
```
C:\Users\rkhol\kasi-link\app\marketplace\loading.tsx
```

### Rules
- Server Component only — NO `"use client"`
- No new imports beyond what's needed
- Match the visual shape of the marketplace page:
  - A heading skeleton at the top
  - A grid of 6 skeleton cards (same grid as the real page: `sm:grid-cols-2 xl:grid-cols-3`)
  - Each skeleton card uses `animate-pulse` and `bg-surface-container` coloured blocks

### Reference — look at how other loading files work
```
app/community-calendar/loading.tsx  ← read this first
app/spotlight/loading.tsx           ← read this too
app/water-outages/loading.tsx       ← and this one
```

### What a good skeleton card looks like
```tsx
<div className="kasi-card animate-pulse">
  <div className="flex gap-2">
    <div className="h-5 w-16 rounded-full bg-surface-container" />
    <div className="h-5 w-20 rounded-full bg-surface-container" />
  </div>
  <div className="mt-4 h-6 w-3/4 rounded-lg bg-surface-container" />
  <div className="mt-3 space-y-2">
    <div className="h-4 w-full rounded bg-surface-container" />
    <div className="h-4 w-5/6 rounded bg-surface-container" />
    <div className="h-4 w-2/3 rounded bg-surface-container" />
  </div>
  <div className="mt-auto pt-5 border-t border-outline-variant/30">
    <div className="flex justify-between">
      <div className="h-6 w-20 rounded bg-surface-container" />
      <div className="h-4 w-16 rounded bg-surface-container" />
    </div>
  </div>
</div>
```

### After completing Task 1
1. `npm run build` — must pass
2. `npm run lint` — must be clean
3. Check the file exists at the correct path
4. Move to Task 2

---

## TASK 2 — Add a loading skeleton to `/forum`

### What
Create `app/forum/loading.tsx` — loading UI for the forum page.

### Why
Same reason as Task 1 — the forum fetches live data and needs a loading state.

### Exact file path
```
C:\Users\rkhol\kasi-link\app\forum\loading.tsx
```

### Rules
- Server Component only — NO `"use client"`
- The forum page shows thread cards — skeleton should match:
  - A heading skeleton
  - A grid/list of 4 skeleton thread rows
  - Each row has: avatar placeholder, title placeholder, metadata placeholders

### What a good forum skeleton row looks like
```tsx
<div className="kasi-card animate-pulse flex items-start gap-4">
  <div className="h-10 w-10 shrink-0 rounded-full bg-surface-container" />
  <div className="flex-1 space-y-2">
    <div className="h-5 w-2/3 rounded-lg bg-surface-container" />
    <div className="h-4 w-full rounded bg-surface-container" />
    <div className="h-4 w-1/2 rounded bg-surface-container" />
    <div className="flex gap-3 mt-2">
      <div className="h-4 w-16 rounded bg-surface-container" />
      <div className="h-4 w-20 rounded bg-surface-container" />
    </div>
  </div>
</div>
```

### After completing Task 2
1. `npm run build` — must pass
2. `npm run lint` — must be clean
3. Fill in `05-KC-Completion-Report.md`
4. Add a log entry to `Structure/04-Updates/comms-log.md`

---

## Completion Report Format

Fill `05-KC-Completion-Report.md` with:

```
### 2026-04-11 | KC | TASK 1 — Marketplace Loading Skeleton

**File created:** app/marketplace/loading.tsx — [X] lines
**Build:** PASS / FAIL
**Lint:** PASS / FAIL
**Notes:** [anything Lead should know]

---

### 2026-04-11 | KC | TASK 2 — Forum Loading Skeleton

**File created:** app/forum/loading.tsx — [X] lines
**Build:** PASS / FAIL
**Lint:** PASS / FAIL
**Notes:** [anything Lead should know]
```

---

## If You Get Stuck

Don't guess. Don't panic. File a BLOCKED note:

```
BLOCKED: [specific question]
Context: [what you tried]
Need: [exactly what information would unblock you]
```

Post it in `Structure/04-Updates/comms-log.md` and wait for Lead.

---

## You Are Ready

You have everything you need in this file and the reference loading files.
Trust the process. Read before writing. Verify before reporting.

Good luck, KC.
