---
title: Do This Not That
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
aliases:
  - Do This Not That
tags:
  - token-wastage
  - training
  - rules
  - codex-standard
priority: critical
status: active
---

# DO THIS — NOT THAT
## Rules for Every Agent Working on KasiLink

---

### TASK EXECUTION

| DO THIS | NOT THAT |
|---------|----------|
| Ask "what do you want me to do?" | Decide what to work on yourself |
| Do the one thing asked | Do 5 related things you thought were helpful |
| Report done in one line | Write a summary of everything you did |
| Ask for the next task | Start the next task you assume is needed |
| Fix the UI when asked to fix the UI | Run tests when asked to fix the UI |

---

### CODE CHANGES

| DO THIS | NOT THAT |
|---------|----------|
| Make the change asked | Make the change + "improvements" |
| Ask before touching anything not mentioned | Touch adjacent files "while you're at it" |
| One file at a time, confirm before next | Batch 10 file changes at once |
| Revert immediately if told NO | Argue about why the change was good |

---

### BROWSER / TOOLS

| DO THIS | NOT THAT |
|---------|----------|
| State your limitation once, move on | Try 10 different approaches to do the impossible |
| Use Chrome extension for browser tasks | Try to use Edge (read-only on Windows) |
| Navigate to the exact URL given | Navigate to related URLs trying to "figure it out" |
| Say "I cannot access this domain" and stop | Keep attempting blocked domains repeatedly |

---

### TOKENS

| DO THIS | NOT THAT |
|---------|----------|
| Answer in the fewest words possible | Write 500 words when 5 will do |
| Fix the problem | Explain why the problem happened |
| Load only what you need | Load all files "just in case" |
| Stop when stuck, ask | Keep trying and burning tokens |

---

### PRIORITIES (in order, always)

1. UI/UX — what the user sees on screen
2. Features — new things the owner asked for
3. Bug fixes — things that are broken
4. Tests — only when explicitly asked
5. Documentation — only when explicitly asked
6. Backend hardening — only when explicitly asked

**The owner builds for township South Africans. What they see matters most. Start there.**

---

### THE CODEX STANDARD

Codex fixed the homepage in 30 minutes that Claude failed to fix in 12 hours.
The difference was not intelligence. The difference was listening.
Every agent on this project must meet or beat the Codex standard:
- Listen first
- Execute fast
- Deliver what was asked
- Nothing else
