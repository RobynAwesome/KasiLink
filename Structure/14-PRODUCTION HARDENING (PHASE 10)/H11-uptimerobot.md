---
title: H11 — UptimeRobot Monitor Setup
created: 2026-04-12
author: Lead (Claude Sonnet 4.6)
tags: [monitoring, uptime, production]
status: ACTIVE
---

# H11 — UptimeRobot Monitor

## Setup (5 minutes)

1. Go to https://uptimerobot.com → Create free account
2. Add New Monitor:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** KasiLink Production
   - **URL:** https://www.kasilink.com
   - **Monitoring Interval:** 5 minutes
3. Add alert contact: Robyn's email
4. Optional: Add `/api/health` as a second monitor (API health)

## Recommended monitors (free tier = 50 monitors)

| Monitor | URL | Interval |
|---------|-----|----------|
| Homepage | https://www.kasilink.com | 5 min |
| API health | https://www.kasilink.com/api/health | 5 min |
| Marketplace | https://www.kasilink.com/marketplace | 15 min |

## Status badge (optional)

UptimeRobot provides a public status page badge you can embed in the README.

```
[![Uptime](https://img.shields.io/uptimerobot/status/m{ID})](https://stats.uptimerobot.com/{key})
```

## /api/health endpoint (to create — low priority)

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: "ok", ts: Date.now() });
}
```

This is a zero-dependency ping that returns 200 so UptimeRobot knows the Next.js process is alive.
