import type { ModelMessage } from "ai";
import { z } from "zod";

const textPart = z.object({ type: z.literal("text"), text: z.string() });
const textContent = z.union([z.string(), z.array(textPart).nonempty()]);
const uiPart = z.union([
  textPart,
  z.object({ type: z.literal("step-start") }),
  z.object({ type: z.literal("reasoning"), text: z.string() }),
]);
const chatBody = z.object({
  messages: z.array(
    z.union([
      z.object({ role: z.literal("user"), parts: z.array(textPart).nonempty() }),
      z.object({ role: z.literal("assistant"), parts: z.array(uiPart) }),
      z.object({ role: z.enum(["user", "assistant"]), content: textContent }),
    ]),
  ).nonempty(),
});

export async function readTextChatMessages(request: Request): Promise<ModelMessage[] | null> {
  const body: unknown = await request.json().catch(() => null);
  const result = chatBody.safeParse(body);
  if (!result.success) return null;

  // Only pass server-constructed text messages to the model. Attachments and
  // client-supplied provider options must never reach the SDK download path.
  return result.data.messages.map((message): ModelMessage => {
    const content = "parts" in message
      ? message.parts.flatMap((part) => part.type === "text" ? [part.text] : []).join("")
      : typeof message.content === "string"
        ? message.content
        : message.content.map((part) => part.text).join("");
    return { role: message.role, content };
  });
}
