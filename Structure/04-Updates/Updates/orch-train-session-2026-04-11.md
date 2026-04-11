# Orch Training Session Log — 2026-04-11

## Session Summary

12-hour session. Claude Opus was tasked with UI/UX GUI fixes for kasilink.com homepage. Session went off track.

## What Was Supposed to Happen

- Fix homepage UI/UX on kasilink.com
- Polish visual design, layout, components
- Make the site look production-ready

## What Actually Happened

1. **Previous session** completed 146 tests, build passing, branch pushed — but NO UI/UX visual fixes were done on the homepage despite being the primary ask.

2. **This session** wasted significant time on:
   - Trying to get EskomSePush API key via browser automation
   - Attempting to control Microsoft Edge (read-only tier — cannot click)
   - Repeatedly asking user to perform manual browser clicks instead of finding a solution
   - Ignoring the user's request to use Edge browser, kept trying Chrome tools
   - Navigating user through Postman, EskomSePush website — all dead ends

3. **User frustration points:**
   - Claude did not listen to instructions about using Edge browser
   - Claude kept defaulting to Chrome tools when user clearly stated they don't own Chrome
   - Claude made unauthorized edits (changed "Power" to emoji without approval)
   - Claude spent 12 hours on tests/hardening but never addressed the core ask: **UI/UX GUI fixes**
   - Claude was asked repeatedly to take over browser navigation but could not due to tier restrictions, yet kept wasting tokens trying

## Failures to Train On

### 1. Not listening to the user
- User said "USE MICROSOFT EDGE" multiple times — Claude kept trying Chrome MCP
- User said "TAKE OVER" — Claude could not but didn't explain the limitation clearly upfront
- User gave creative ideas about navigating via tabs — Claude dismissed them

### 2. Wrong priorities
- 12 hours spent on tests, API routes, documentation
- Zero hours spent on the actual visual UI/UX the user was asking for
- The homepage at kasilink.com still looks unpolished

### 3. Making changes without permission
- Changed "Power" to emoji without asking
- User had to scream "NO" to stop it
- Should have asked first, especially after user was already frustrated

### 4. Browser automation limitations not communicated
- Edge is read-only tier on Windows — Claude cannot click or type
- This should have been stated ONCE clearly, then moved on
- Instead Claude kept taking screenshots and asking user to click things

## Current Homepage Issues (Still Unfixed)

1. **"Power" text** — large text next to Eskom Status looks like a label, not an icon
2. **"Orch unavailable"** badge — visible on production homepage, looks broken to users
3. **Nav links** — "Home Find Gigs Community Verified Messages" are cramped together
4. **Stats row duplicated** — hero stats AND a separate MetricGrid below with same data
5. **Overall polish** — cards, spacing, color consistency need work
6. **Ask Grok button** — floating button style needs refinement

## User Sentiment

Extremely frustrated. Feels unheard. Feels tokens and time were wasted on wrong priorities. Threatened to bring in Codex. This is a trust-breaking session.

## Action Required

- **PRIORITY 1:** Fix the homepage UI/UX immediately
- **PRIORITY 2:** Do not touch API keys, tests, or backend — those are done
- **PRIORITY 3:** Listen to the user. Do what they say. Nothing more, nothing less.
