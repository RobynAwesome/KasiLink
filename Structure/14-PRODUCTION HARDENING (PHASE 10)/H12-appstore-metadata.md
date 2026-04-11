---
title: H12 — App Store Metadata
created: 2026-04-12
author: Lead (Claude Sonnet 4.6)
tags: [app-store, google-play, pwa, metadata]
status: ACTIVE
---

# H12 — App Store Metadata

## App Store (Apple) — Required fields

| Field | Value |
|-------|-------|
| **App Name** | KasiLink |
| **Subtitle** | Township Gig Marketplace |
| **Bundle ID** | com.kopanolabs.kasilink |
| **Category** | Business |
| **Secondary Category** | Productivity |
| **Age Rating** | 4+ |
| **Price** | Free |
| **Privacy Policy URL** | https://www.kasilink.com/terms |

### Short Description (30 chars)
```
Find gigs in your kasi
```

### Full Description (4000 chars max)
```
KasiLink connects township workers with local gig opportunities — no CV needed, no transport required.

Find work nearby: electricians, tutors, cleaners, caregivers, handymen and more. Post a job in 60 seconds. Get hired today.

Built for South Africa's townships by people who understand township life.

FEATURES
• Browse gigs by suburb — see what's hiring near you
• Post a gig instantly — pay by cash, EFT or mobile money
• Load-shedding aware — we show schedule so you can plan work
• Community forum — report incidents, share tips, find help
• Verified providers — trusted workers with community ratings
• Water & utility alerts — stay informed about outages
• Tutoring marketplace — find Grade 1–12 help in your area
• Community calendar — job fairs, markets, awareness events

TOWNSHIP FIRST
We know load shedding disrupts everything. KasiLink shows live Eskom schedule next to every gig so workers and hirers can plan around blackouts.

SAFE & SECURE
• POPIA compliant
• Secure sign-in via phone OTP
• No personal data sold to third parties

KOPANO LABS
KasiLink is Product 1 from Kopano Labs — building technology that works for township communities.
```

### Keywords (100 chars max)
```
gig,work,jobs,kasi,township,south africa,hire,local,marketplace,SA
```

### Screenshots needed
- [ ] iPhone 6.7" (1290×2796): 3 screens minimum
  1. Homepage — bento grid with community pulse
  2. Marketplace — gig listings with load-shedding badge
  3. Forum — community threads
  4. Post Gig form
  5. Verified provider profile
- [ ] iPad 12.9" (2048×2732): optional but recommended

---

## Google Play Store — Required fields

| Field | Value |
|-------|-------|
| **App name** | KasiLink — Township Gig Marketplace |
| **Short description** | Find local gigs & workers in your kasi |
| **Category** | Business |
| **Content rating** | Everyone |
| **Price** | Free |
| **Package name** | com.kopanolabs.kasilink |

### Full description (4000 chars max)
*(Same as Apple above)*

### Feature graphic
- 1024×500 px banner image needed
- Use: KasiLink logo + tagline "Township-first work network"

### Screenshots (min 2, max 8)
- Same 5 screens as Apple, exported at Android resolution (1080×1920)

---

## PWA — Already complete ✅

- manifest.json: ✅ name, short_name, icons, shortcuts, lang=en-ZA
- Icons: ✅ 192×192 + 512×512 in `/public/Icons/`
- Theme color: ✅ #4595c0
- Background: ✅ #0d1117
- Display: ✅ standalone

## Icon sizes still needed for App Store

| Platform | Size | Status |
|----------|------|--------|
| iOS App Store | 1024×1024 | ⏳ Export from Logo.png |
| Android Play | 512×512 | ✅ icon-512.png exists |
| Android Feature | 1024×500 | ⏳ Design needed |

## Next action
Owner: Export `public/Icons/Logo.png` at 1024×1024 for App Store submission.
Lead: Can auto-generate feature graphic banner when Owner confirms brand colors are final.
