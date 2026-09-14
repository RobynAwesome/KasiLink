---
name: kpgs-dns-accountability
description: "Governance, cryptographic verification, and Complex Event Processing (CEP) Heat Wave monitoring for DNS operations across kasilink.com."
version: 1.0.0
authors: ["Kopano Labs", "Antigravity"]
tags: ["dns", "kpgs", "security", "zero-trust", "thari", "cep"]
---

# KPGS DNS Accountability & Cutover Skill

Governs the DNS lifecycle, domain propagation, SSL/TLS certificates, and cryptographic verification for **`kasilink.com`**.

Governed by: **THARI (Seat 7) — Guardian AI / H.O.L.O & DNS Accountability Overseer**.

---

## 1. Core Invariants
- `REALITY_STATE > INDEX_STATE`: Physical name server resolution takes precedence over cached records.
- `RECEIPT OR HOLD`: Every DNS record change must produce an audit receipt before cutting over traffic.
- `I_AM_STATELESS_RENTER_NOT_LANDLORD`: Dynamic edge routing with zero persistent host hijacking.

---

## 2. Canonical DNS Architecture for kasilink.com

```
[Visitor / Edge Browser] ──> [Cloudflare Anycast Network]
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
      @ (Apex: kasilink.com)                    www (CNAME)
               │                                         │
               └────────────────────┬────────────────────┘
                                    ▼
                         [Full Strict TLS 1.3]
                                    ▼
                     [Vercel / Cloud Run Edge Origin]
```

### Required Zone Records:
| Type | Host | Value | Proxy Status | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | Origin IP / Cloudflare Anycast | Proxied (Orange Cloud) | Auto |
| **AAAA** | `@` | IPv6 Origin / Anycast | Proxied (Orange Cloud) | Auto |
| **CNAME**| `www` | `kasilink.com` | Proxied (Orange Cloud) | Auto |
| **CAA** | `@` | `0 issue "letsencrypt.org"` | DNS Only | Auto |

---

## 3. Automated Sentinel Monitoring (`kpgs_dns_sentinel_agent.py`)

Run the automated Sentinel agent to verify DNS health and CEP heat wave proofs:
```powershell
python kpgs_dns_sentinel_agent.py --zone kasilink.com --dry-run
```

Checks performed:
1. Apex resolution consistency across global recursive resolvers.
2. TLS 1.3 cipher suite and HSTS header enforcement.
3. Propagation delay & causal inversion detection.
