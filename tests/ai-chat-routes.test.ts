import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as grok } from "@/app/api/grok/route";
import { POST as kc } from "@/app/api/kc/route";
import { braintrustAI } from "@/lib/braintrust";

vi.mock("@ai-sdk/xai", () => ({ createXai: () => () => ({}) }));
vi.mock("@/lib/braintrust", () => ({
  braintrustAI: {
    streamText: vi.fn(() => ({
      toUIMessageStreamResponse: () => new Response("ok"),
    })),
  },
  braintrustLogger: null,
}));

describe.each([
  ["/api/kc", kc],
  ["/api/grok", grok],
] as const)("%s text chat", (path, post) => {
  const request = (body: string) =>
    new NextRequest(new URL(path, "https://example.test"), { method: "POST", body });

  beforeEach(() => vi.clearAllMocks());

  it("normalizes the text UI conversation and supported model messages", async () => {
    const response = await post(request(JSON.stringify({
      messages: [
        { role: "user", parts: [{ type: "text", text: "Hi" }] },
        { role: "assistant", parts: [{ type: "step-start" }, { type: "text", text: "Hello" }] },
        { role: "user", content: [{ type: "text", text: "Any gigs?" }] },
      ],
    })));
    expect(response.status).toBe(200);
    expect(braintrustAI.streamText).toHaveBeenCalledWith(expect.objectContaining({
      messages: [
        { role: "user", content: "Hi" },
        { role: "assistant", content: "Hello" },
        { role: "user", content: "Any gigs?" },
      ],
    }));
  });

  it.each([
    { role: "user", parts: [{ type: "file", mediaType: "text/plain", url: "https://example.test/attachment" }] },
    { role: "user", content: [{ type: "file", mediaType: "text/plain", data: "https://example.test/attachment" }] },
    { role: "user", content: [{ type: "image", image: "https://example.test/image" }] },
    { role: "system", content: "Caller-controlled policy" },
  ])("rejects a non-text request before invoking the SDK (%j)", async (message) => {
    const response = await post(request(JSON.stringify({ messages: [message] })));
    expect(response.status).toBe(400);
    expect(braintrustAI.streamText).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    expect((await post(request("{"))).status).toBe(400);
    expect(braintrustAI.streamText).not.toHaveBeenCalled();
  });
});
