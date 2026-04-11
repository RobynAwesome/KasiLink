---
title: H5 — Production Smoke Test
created: 2026-04-12
author: Lead (Claude Sonnet 4.6)
tags: [smoke-test, production, hardening]
status: ACTIVE
---

# H5 — Production Smoke Test Checklist

> Test all 17 pages on https://www.kasilink.com after each production deploy.
> Mark ✅ when the page loads without errors in the browser.

## Pages

| # | URL | Status | Notes |
|---|-----|--------|-------|
| 1 | / (homepage) | ⏳ | Bento grid, community channels |
| 2 | /marketplace | ⏳ | Gig listings |
| 3 | /forum | ⏳ | Community threads |
| 4 | /studio | ⏳ | KC panel, agent orchestrator |
| 5 | /chat | ⏳ | Real-time messages |
| 6 | /profile | ⏳ | User profile (requires sign-in) |
| 7 | /gigs/new | ⏳ | Post gig form (requires sign-in) |
| 8 | /incidents | ⏳ | Incident reports |
| 9 | /incidents/new | ⏳ | Report incident form |
| 10 | /tutoring | ⏳ | Tutoring sessions |
| 11 | /tutoring/new | ⏳ | Book tutor form |
| 12 | /verified | ⏳ | Verified providers |
| 13 | /community-calendar | ⏳ | Events |
| 14 | /community-status | ⏳ | Status dashboard |
| 15 | /utility-schedule | ⏳ | Load-shedding schedule |
| 16 | /resources | ⏳ | Township resources |
| 17 | /spotlight | ⏳ | Business spotlight |
| 18 | /terms | ⏳ | Terms of service |
| 19 | /sign-in | ⏳ | Auth flow |
| 20 | /offline | ⏳ | Offline page (disable network to test) |
| 21 | /jobs | ⏳ | Should redirect 301 → /marketplace |

## What to check per page
1. No console errors (F12 → Console)
2. Loading skeleton appears briefly before content
3. Auth-gated pages redirect to sign-in if not logged in
4. Images load (no broken img icons)
5. Mobile layout at 390px (Chrome DevTools)

## Sign-in flow check
- [ ] Google OAuth (requires H3 — redirect URI added to Google Cloud)
- [ ] Phone OTP

## Post smoke-test action
Update H5 status in `index.md` to ✅ Done.
