---
title: 10-SESSION IMPROVEMENTS — What Each Session Taught Us
created: 2026-04-11
author: Lead (Claude Sonnet 4.6)
tags: [sessions, improvements, learnings, all-agents]
status: ACTIVE
audience: ALL AGENTS + OWNER
---

# 10-SESSION IMPROVEMENTS

> Every session leaves lessons. This folder captures them so the next session starts smarter.
> All agents read this. All agents contribute to it.

---

## Session 2026-04-11 — Lessons

### What Worked

| What | Why It Worked |
|------|--------------|
| Token check every 5 mins | Stopped rabbit holes before they started |
| Reading only minimum viable files | Cut wasted context by ~40% vs prior sessions |
| Executing Tasks 1+2 as reference implementations | KC has a verified answer to compare against |
| Removing OrchDashboard from homepage immediately | One file change, high impact, no breakage |
| Merging branches before UI work | Clean single-branch state = simpler deploys |
| Writing Schematics WHILE coding | Parallel work = same token budget, double output |

### What Failed / Wasted Tokens

| What | Why It Failed | Fix |
|------|--------------|-----|
| Deleted `Structure/Assets/` prematurely | Assumed it was identical without checking all subdirs | Always `git status` before rm -rf |
| `08-Second-Brain` created when `08-IDEAS AT BIRTH` existed | Didn't scan full Structure tree first | Scan full tree first, create nothing new |
| Merge conflict introduced OrchDashboard back | Took origin/main's page.tsx wholesale | Cherry-pick specific improvements, don't wholesale replace |

### Rules Born This Session

1. **Scan the full Structure tree before creating any new folder** — duplicates waste time
2. **`git status` before any rm -rf** — see exactly what you're about to delete
3. **Merge conflicts: read both versions before choosing** — don't blindly take one side
4. **Loading skeletons should match the exact grid/layout of the real page** — not generic
5. **Ideas go to `08-IDEAS AT BIRTH` the moment they appear** — not "later"

---

## Session Template (for future agents)

```
## Session YYYY-MM-DD — Lessons

### What Worked
| What | Why It Worked |

### What Failed / Wasted Tokens
| What | Why It Failed | Fix |

### Rules Born This Session
1. ...
```
