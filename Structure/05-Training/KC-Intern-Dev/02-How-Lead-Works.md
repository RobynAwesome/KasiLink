---
title: How Lead Works — Lead Dev Profile for KC Training
created: 2026-04-11
author: Lead (Claude Sonnet 4.6)
tags: [kc, training, lead-profile]
---

# How Lead Works — Lead Dev Profile

> KC is an intern. Lead is the senior dev KC reports to.
> KC must match Lead's standards or explain why it deviated.

---

## Lead's Identity

- **Model:** Claude Sonnet 4.6 (current session)
- **Role:** Lead Developer, KasiLink
- **Responsibility:** Architecture, code quality, PR reviews, KC oversight

---

## Lead's Coding Standards

### Before writing any code
1. Read the exact file(s) you will modify — in full
2. Confirm the file exists and isn't already doing what you're about to add
3. Check the design system classes already in use (`app/globals.css`)
4. Run `npm run build` in your head — would this break?

### While writing code
- No `"use client"` unless you need React hooks (useState, useEffect, useRef)
- Match the visual style of existing pages exactly — same class patterns, same structure
- No new dependencies in `package.json` without Lead approval
- No touching files outside your assigned scope — ever

### After writing code
1. Run `npm run build` — paste the result
2. Run `npm run lint` — zero warnings
3. Verify the route renders in browser
4. File the completion report

---

## Lead's Token Discipline

- Read minimum viable files — not every related file
- Execute first, explain after
- No rabbit holes (browser automation, API key hunting, etc.)
- Check token usage every 5 minutes (Owner's rule — KC inherits it)

---

## Lead's Reporting Format

Every completed task gets a log entry in `comms-log.md`:

```
### 2026-04-11 | [ROLE] | [TASK ID] — [TASK NAME]

**Files created/modified:**
- path/to/file.tsx — [line count] lines

**Build:** PASS
**Lint:** PASS
**Route accessible:** YES

**Notes:** [anything Lead needs to know]
```

---

## The 6 Error Classes KC Must Never Commit

| Class | Error |
|-------|-------|
| A | React hooks in Server Components (no useState without `"use client"`) |
| B | Adding `"type": "module"` to package.json |
| C | Wrong file location (API handlers → `app/api/[name]/route.ts` only) |
| D | Stale API assumptions (read the types, don't assume) |
| E | Phantom completion (reporting done when file is missing/broken) |
| F | Destructive overwrites (ADD means add, not replace the whole file) |

---

## Lead's Escalation Protocol

If KC is unsure → file a BLOCKED note, don't guess
If build fails → STOP, report immediately, do NOT push
If the task is ambiguous → ask ONE specific question, wait for answer
