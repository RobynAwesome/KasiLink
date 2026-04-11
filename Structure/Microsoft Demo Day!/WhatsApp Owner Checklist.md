---
title: WhatsApp Owner Checklist
created: 2026-04-11
updated: 2026-04-11
author: Antigravity (Lead)
tags:
  - demo-day
  - whatsapp
  - owner-tasks
priority: critical
status: active
---

# WhatsApp Owner Checklist

> **Owner:** RobynAwesome  
> **Mission:** Establish the live WhatsApp device link for the Microsoft Demo Day.  
> **Status:** 🔴 Pending Owner Action

The WhatsApp integration uses the `whin2` endpoint via RapidAPI and requires a live device registration that I (the AI) cannot perform on your behalf.

## 🛠️ Required Steps

1.  **Device Preparation**:
    *   Ensure you have a WhatsApp or WhatsApp Business account active on a +27 (South Africa) mobile number.
    *   This device must remain online during the demo.

2.  **whin2 Registration**:
    *   Go to the [whin2 RapidAPI Dashboard](https://rapidapi.com/manuhorta/api/whin2).
    *   Subscribe to the free tier (if not already done).
    *   Follow their instructions to "Link Device" (this usually involves scanning a QR code with your WhatsApp app, similar to WhatsApp Web).

3.  **Webhook Configuration**:
    *   The `whin2` system will provide you with a unique token or API key.
    *   Ensure the `KasiLinkAI_WHIN_API_KEY` (or equivalent) in your root `.env` or Vercel Environment Variables matches this token.

4.  **Verification Test**:
    *   I will create a small test script `scripts/test-whatsapp.ts`.
    *   Run `npx tsx scripts/test-whatsapp.ts` to send a "Demo Ready" message to your own number.

## 🚦 Go/No-Go Criteria
- [ ] Device Linked to whin2.
- [ ] API Key verified in `.env`.
- [ ] Test message received on a South African handset.

---

> [!TIP]
> Complete this before **April 13th** to allow for a "Dry Run" visual QA pass.
