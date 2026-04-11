---
title: App Store Metadata
created: 2026-04-11
author: Lead Dev
tags:
  - app-store
  - pwa
  - launch
priority: high
status: ready-for-owner
---

# KasiLink — App Store Metadata

## Google Play Store (TWA — Trusted Web Activity)

**App name:** KasiLink — Township Gigs

**Short description (80 chars max):**
Find local gigs and community services in your kasi. Township-first.

**Full description (4000 chars max):**
KasiLink connects unemployed youth and job seekers in South African townships with nearby gig work — car washes, tutoring, cleaning, deliveries, repairs, and more.

No CV required. No expensive commute. Just local work from people who live nearby.

**What you can do:**
- Browse gigs within walking or taxi distance
- Post urgent work and reach people in minutes
- Chat directly with providers and applicants
- Track water outages and load-shedding before you commit to a shift
- Find verified providers with community reviews
- Join the forum for safety alerts, hustle tips, and local job advice

**Built for township reality:**
- Works on entry-level Android phones
- Data-light design — every screen is lean
- USSD access on *120*KASILINK# for feature phones (coming soon)
- Offline-ready for load-shedding

**Category:** Productivity / Job Search
**Content rating:** Everyone (PEGI 3 / Everyone)
**Price:** Free

---

## Apple App Store (via Capacitor or PWABuilder)

**App name:** KasiLink — Township Gigs

**Subtitle (30 chars max):**
Local work. No CV needed.

**Promotional text (170 chars max):**
Find gig work in your neighbourhood. Car washes, tutoring, repairs, delivery — all within walking distance. SA township-first job platform.

**Description:**
KasiLink is South Africa's first township-first gig marketplace. Find work nearby without a CV, a car, or a city-centre commute.

Browse gigs by suburb, apply with one tap, and coordinate directly with providers via in-app chat. The marketplace shows load-shedding stage and water alerts so you know conditions before accepting a gig.

Community features: forum threads for safety alerts and local tips, verified provider profiles with ratings, and a community calendar for job fairs and events.

**Keywords (100 chars):**
township,gigs,south africa,jobs,kasi,informal economy,job search,car wash,tutoring,delivery

**Category:** Productivity
**Sub-category:** Business
**Age rating:** 4+
**Price:** Free

---

## Icon Requirements Checklist

| Platform | Size | Status |
|---|---|---|
| Android adaptive (foreground) | 108×108dp | ⚠️ TODO — need 432px PNG |
| Android adaptive (background) | 108×108dp | ⚠️ TODO — solid #0d1117 |
| Android notification | 24dp | ⚠️ TODO |
| iOS App Store | 1024×1024px | ⚠️ TODO |
| iOS home screen | 180×180px (3x) | ⚠️ TODO |
| PWA 192px | Done | ✅ /Icons/icon-192.png |
| PWA 512px | Placeholder | ⚠️ Replace with proper 512px art |

> **Owner action:** Commission or create a proper 512×512 master icon.
> The current icon-512.png is a copy of the 192px version (placeholder only).

---

## Google Play TWA Setup

### Prerequisites
- Google Play developer account ($25 one-time)
- `bubblewrap` CLI or PWABuilder web tool

### Steps
```bash
# Install bubblewrap
npm install -g @bubblewrap/cli

# Initialize TWA
bubblewrap init --manifest https://kasilink.com/manifest.json

# Build APK
bubblewrap build
```

### Signing
The owner must provide a keystore for signing. Bubblewrap generates one on first run.

### Digital Asset Links
Add to `public/.well-known/assetlinks.json` after getting the SHA-256 fingerprint from the Play Console:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.kasilink.app",
    "sha256_cert_fingerprints": ["YOUR_SHA256_HERE"]
  }
}]
```

---

## iOS Capacitor Setup

### Prerequisites
- Apple developer account ($99/year)
- Xcode on macOS

### Steps
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init KasiLink com.kasilink.app
npx cap add ios
npx cap sync
npx cap open ios
```

Then archive and submit via Xcode → Organizer → Distribute App.

---

## PWA Install Prompt Status

- `manifest.json` ✅ present, valid
- Service worker ✅ `public/sw.js`, cache v2
- HTTPS ✅ (Vercel)
- `start_url` ✅ `/`
- Icons 192+512 ✅ (512 needs art upgrade)
- `display: standalone` ✅

**PWA should be installable on Android Chrome today.**
iOS Safari requires "Add to Home Screen" manually — no automatic install prompt.

---

## Owner Actions Required

1. [ ] Create Google Play developer account at play.google.com/console
2. [ ] Create Apple developer account at developer.apple.com
3. [ ] Commission proper 1024×1024 master icon from designer
4. [ ] Take screenshots on phone for store listings (6 screens recommended)
5. [ ] Review and approve this store copy before submission
6. [ ] Run `bubblewrap init` after receiving SHA from Play Console
7. [ ] Add `assetlinks.json` to Vercel once SHA is known
