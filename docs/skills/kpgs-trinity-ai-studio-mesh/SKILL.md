---
name: kpgs-trinity-ai-studio-mesh
description: "Orchestration skill for integrating Google AI Studio models (Gemini 2.0 / 1.5) with the KasiLink Trinity agent mesh (Cassey, Yassie, Thari)."
version: 1.0.0
authors: ["Kopano Labs", "Antigravity"]
tags: ["ai-studio", "gemini", "trinity", "kasilink", "agents"]
---

# KPGS Trinity AI Studio Mesh Skill

Governs the integration between **Google AI Studio (`RobynAwesome/KasiLink-Google-ai-Studio`)** and the live Next.js backend at **`https://kasilink.com`**.

---

## 1. Trinity Persona Matrix

| Seat | Persona | Core Role | AI Studio Model Target | System Prompt Signature |
| :--- | :--- | :--- | :--- | :--- |
| **Seat 2** | **CASSEY** | Teacher / Women-in-Tech | `gemini-2.0-flash` / `gemini-1.5-pro` | Compassionate STEM mentor, step-by-step coding educator, community builder. |
| **Seat 5** | **YASSIE** | Cultural Intel / Anime Head | `gemini-2.0-flash-exp` | Kasi slang (Tsotsitaal), youth culture translator, anime/tech fusion. |
| **Seat 7** | **THARI** | Guardian AI / H.O.L.O | `gemini-1.5-pro` (High Reasoning) | Zero-trust validator, DLP scrubber, community sovereignty guardian. |

---

## 2. Server-Side Gateway Pattern (Zero-Trust)

In accordance with `I_AM_STATELESS_RENTER_NOT_LANDLORD`:
- Private AI Studio API keys are never bundled into client JavaScript.
- Client requests stream through `/api/chat` or `/api/kc`.

```typescript
// app/api/chat/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { seat, message } = await req.json();
  
  // 1. Thari DLP Pre-filter
  const sanitized = await scrubPII(message);
  
  // 2. Resolve Agent Persona
  const agentConfig = resolveTrinityAgent(seat);
  
  // 3. Invoke Google GenAI with Streaming
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const stream = await ai.models.generateContentStream({
    model: agentConfig.model,
    contents: sanitized,
    config: {
      systemInstruction: agentConfig.systemInstruction
    }
  });

  return new Response(stream.toReadableStream());
}
```

---

## 3. Sprint Execution Tasks
1. **Key Handshake**: Secure `GEMINI_API_KEY` injection into `.env.local` / production environment variables.
2. **Streaming Component**: Connect the council chat interface in `app/page.tsx` to the streaming response reader.
3. **Evaluation Loop**: Test model latency, rate limit handling, and graceful offline fallback.
