import { createXai } from "@ai-sdk/xai";
import { NextRequest } from "next/server";
import { readTextChatMessages } from "@/lib/ai-chat-messages";
import { braintrustAI, braintrustLogger } from "@/lib/braintrust";

export const runtime = "nodejs";

const xaiProvider = createXai({
  apiKey: process.env.KasiLinkAI_XAI_API_KEY!,
});

const { streamText } = braintrustAI;

export async function POST(req: NextRequest) {
  const messages = await readTextChatMessages(req);
  if (!messages) {
    return Response.json({ error: "Expected text-only chat messages." }, { status: 400 });
  }
  const result = braintrustLogger
    ? braintrustLogger.traced(
        () =>
          streamText({
            model: xaiProvider("grok-4"),
            messages,
            temperature: 0.7,
          }),
        {
          name: "api.grok",
          type: "task",
          event: {
            input: {
              type: "chat",
              messages,
            },
            metadata: {
              route: "/api/grok",
              messageCount: messages.length,
            },
          },
        },
      )
    : streamText({
        model: xaiProvider("grok-4"),
        messages,
        temperature: 0.7,
      });

  return result.toUIMessageStreamResponse();
}
