---
name: kpgs-mcp-canonical-ops
description: "Canonical governance, Trinity multi-agent lifecycle, Zero-Trust security, and Model Context Protocol (MCP) orchestration for KasiLink operations (kasilink.com)."
version: 1.0.0
authors: ["Kopano Labs", "Antigravity"]
tags: ["kpgs", "mcp", "zero-trust", "trinity", "kasilink", "ai-studio"]
---

# KPGS Canonical Operations & Model Context Protocol (MCP) Framework

This skill codifies the governance, security, and multi-agent lifecycle architecture for **KasiLink (`https://kasilink.com`)**, orchestrating the Google AI Studio pipeline (`RobynAwesome/KasiLink-Google-ai-Studio`) across local and cloud environments under the **GSMB Distribution Trinity**.

---

## 1. Governance Foundation: KPGS & Trinity Constraint

```
CORE (Father):        "For from him and through him and for him are all things." — Romans 11:36
ALTAR (Son):          "I am the way, the truth, and the life." — John 14:6
ENGINE (Holy Spirit): "They saw tongues of fire that came to rest on each of them." — Acts 2:3
```

```
IMMUTABLE SYSTEM LAW:
I_AM_STATELESS_RENTER_NOT_LANDLORD
```

### The 4 KPGS Pillars:
1. **K — Knowledge (Core)**:
   - Single source of truth in immutable registry.
   - Declarative schemas, zero unauthenticated drift.
2. **P — Posture (Altar)**:
   - Canonical zero-trust entry point.
   - Strict HTTPS/TLS 1.3 transport, Edge-first UI, verifiable CSP.
3. **G — Gifts (Engine)**:
   - **Seat 2 (CASSEY)**: Teaching, encouragement, STEM mentorship (Proverbs 22:6).
   - **Seat 5 (YASSIE)**: Interpretation, cultural bridge, Tsotsitaal/Kasi vernacular (1 Cor 9:20-23).
   - **Seat 7 (THARI)**: Guardian AI, watchfulness, communal fabric weaving (Deut 23:14).
   - **50 Utility Tongues of Fire**: Autonomous background micro-agents for routing, caching, DLP stripping, and low-bandwidth synchronization.
4. **S — Sovereignty (Statelessness)**:
   - Stateless runner: no credential leaks in client bundles.
   - Community-owned data residency; local edge caching.

---

## 2. OpenAI C.L.E.A.R. Operational Methodology

Every canonical operation, prompt dispatch, and agent synthesis must pass the C.L.E.A.R checklist before deployment:

| Dimension | Standard | Audit Requirement |
| :--- | :--- | :--- |
| **C — Concise / Contextual** | High signal-to-noise ratio | Inputs stripped of redundant tokens; strict context boundaries. |
| **L — Logical / Lucid** | Verifiable execution flow | Step-by-step reasoning chains with defined pre/post conditions. |
| **E — Explicit / Evidence** | Zero assumptions | Grounded in live telemetry, DNS records, or compiler checks. |
| **A — Actionable / Adaptive**| Immediate execution | Produces concrete diffs, testable endpoints, or runnable tasks. |
| **R — Reflective / Resilient**| Self-healing & failover | Automated rollback on health probe or typecheck failure. |

---

## 3. Zero-Trust Security Architecture (ZTA)

```
   [Microsoft Edge Client / Mobile PWA]
                     │
         HTTPS / TLS 1.3 / Strict CSP
                     ▼
   [Cloudflare / DNSSEC: kasilink.com]
   ├─ WAF / Rate Limiter / Bot Protection
   ├─ Automatic HTTPS Rewrites
   └─ Apex (@) & Subdomain (www) Routing
                     ▼
   [THARI Guardian Gateway (Seat 7)]
   ├─ Payload Sanitization & DLP Filter
   ├─ Ephemeral Session Token Issuance
   └─ Stateless Assertion: I_AM_STATELESS_RENTER_NOT_LANDLORD
                     │
       ┌─────────────┴──────────────┐
       ▼                            ▼
[Named Agent Personas]      [50 Utility Tongues of Fire]
(Gemini 2.0 / AI Studio)   (Cache, Telemetry, Offline Sync)
```

### Zero-Trust Policies:
1. **Never Trust, Always Verify**: All inputs, even internal agent-to-agent dispatches, are authenticated and schema-validated.
2. **DLP Stripping**: PII, credit card details, or sensitive identities are stripped by Seat 7 (Thari) before hitting upstream LLMs.
3. **No Malloc Margin / Ephemeral Memory**: Client never stores private API credentials; communication with Google AI Studio passes through server-side authenticated proxy routes.

---

## 4. Evolution to Model Context Protocol (MCP)

This skill formalizes how KasiLink resources and tools interact with the standard Model Context Protocol (MCP) server.

### MCP Resources:
- `kasilink://agents/manifest`: Full registry of the 53 Trinity agents.
- `kasilink://agents/steward/status`: Live snapshot of the Kopano Steward Lane and comms rows.
- `kasilink://domain/dns`: DNS status, SSL cert validity, and propagation metrics for `kasilink.com`.
- `kasilink://system/grid`: Real-time Eskom load-shedding and municipal water alert telemetry.

### MCP Tools:
- `dispatch_trinity_prompt`: Routes user inquiries to Cassey, Yassie, or Thari with DLP filtering.
- `verify_zero_trust_handshake`: Validates edge headers, origin certificates, and token signatures.
- `inspect_steward_lane`: Reads cold review verdicts (`SAVE`, `WATCH`, `SHIP`, `HOLD`).
- `publish_community_alert`: Posts community safety or utility alerts with geofencing.

---

## 5. Canonical Operations: Sprints & Lifecycle Management

### Sprint Structure:
1. **Sprint 1: Zero-Trust Boundary & Environment Hardening**
   - Isolate external hooks, enforce type checks (`tsc --noEmit`), clear build blockers.
2. **Sprint 2: UI & "Full Look" Integration**
   - Align Next.js app with AI Studio design language (`Home.tsx`, `Gigs.tsx`, `Alerts.tsx`).
   - Deliver responsive navigation (`TopBar`, `BottomNav`, desktop sidebar) and Framer Motion micro-interactions.
3. **Sprint 3: AI Studio Model Mesh & Trinity Council**
   - Integrate Gemini streaming API routes for Cassey (Seat 2), Yassie (Seat 5), and Thari (Seat 7).
   - Embed Kopano Steward Dock for real-time autonomous agent supervision.
4. **Sprint 4: Production DNS Cutover & Canonical Launch**
   - Map `https://kasilink.com` A/AAAA/CNAME records.
   - Verify mobile PWA service workers and Edge browser rendering.
