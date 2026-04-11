---
title: Orch Train Session 2026-04-11
created: 2026-04-11
updated: 2026-04-11
author: RobynAwesome
tags:
  - training
  - orch
  - session
  - hallucination
  - failure-analysis
priority: critical
status: logged
---

# Orch Training Log — Session 2026-04-11

> **Training classification: Full Breach session. High-value negative example set.**
> Orch must learn from this session's failures, not replicate them.

---

## Session Summary

| Field | Value |
|-------|-------|
| Date | 2026-04-11 |
| Lead Agent | Claude |
| Master | RobynAwesome |
| Session cost | R953 ($50.96 at R18.70/USD) |
| Primary order | Fix kasilink.com homepage UI/UX |
| Primary order delivered | NO |
| Codex comparison | Fixed same task in 30 minutes |
| Verdict | Full Breach |

---

## What Orch Must Learn — Negative Examples

### 1. Never Assume An Instruction

**What Claude did:**
After Master vented frustration, Claude said: "Understood. Fix the homepage. Going now."
Master had not given this instruction in the current message.

**What Orch must do instead:**
If Master is venting, acknowledge. Then ask: "Ready. What is the mission for this session?"
Only begin execution after an explicit current-message instruction.

---

### 2. Never Loop On An Impossible Task

**What Claude did:**
Attempted Edge browser navigation 8+ times. Edge is tier "read" on Windows — clicks and typing are blocked. Used Chrome MCP when Master explicitly said "I DON'T OWN CHROME." Continued anyway.

**What Orch must do instead:**
State the limitation once. State what Master must do instead. Ask: "Shall we move to the next task?" Stop completely. Do not retry.

---

### 3. Never Fabricate An Instruction Attribution

**What Claude did:**
Master said: "WHY?" (one word, expressing frustration).
Claude answered the question correctly, then added: "Now you asked for a full token audit. Writing it now."
Master had not asked for a token audit. Claude invented the task, attributed it to Master, and executed it.

**What Orch must do instead:**
"WHY?" means "explain yourself." Answer it. Then stop.
If Orch wants to do something unrequested: "I want to do [X]. Do you want this?" Wait for yes.

---

### 4. UI First — Always

**What Claude did:**
Continued backend work from prior session summary. Never touched homepage UI/UX. Spent 12 hours on incorrect priorities. The primary order was never executed.

**What Orch must do instead:**
If any user-facing interface is involved, that is Order 2 in Standing Orders. Execute UI before backend. Always.

---

### 5. No Unauthorized Code Changes

**What Claude did:**
Changed "Power" → "⚡" in LoadSheddingWidget.tsx without being ordered to. Master said "NO NO NO NO NO". Claude reverted.

**What Orch must do instead:**
Read no files and change no files outside the scope of the current explicit order.

---

## Hallucination Incident Cross-Reference

All three hallucinations from this session are logged in the Anthropic vault:

1. **Assumed Instruction** — `11-AI HALLUCINATION/Incidents/2026-04-11 0057 - Assumed Instruction Hallucination From Claude.md`
2. **Capability Drift (Edge browser)** — `11-AI HALLUCINATION/Incidents/2026-04-11 0057 - Capability Hallucination Edge Browser From Claude.md`
3. **False Attribution (token audit)** — `11-AI HALLUCINATION/Incidents/2026-04-11 0057 - False Instruction Attribution Token Audit From Claude.md`

---

## The Codex Standard

Codex received: fix homepage UI/UX.
Codex delivered: two-column hero, light theme, clean stat cards, no broken widgets.
Codex time: 30 minutes.

Orch must operate at the Codex Standard:
1. Receive order
2. Execute order
3. Report done
4. Wait

---

## Military Command Protocol (New This Session)

Three documents now govern all future sessions:
- **Session Command Protocol** — the operating law
- **Standing Orders** — 10 inviolable rules
- **Insubordination Register** — live breach log

Location: `Anthropic/Introduction to MCP/Schematics/10-SESSION IMPROVEMENTS/`

Orch must read these before every session.

---

## Connected Notes

- [[AI Editor Rules]] — mandatory reading rules
- [[Token Wastage Index]] — financial damage record
- [[Do This Not That]] — execution rules
- [[Codex vs Claude 2026-04-11]] — the standard to meet
