import { describe, expect, it } from "vitest";
import {
  sanitize,
  validateApplication,
  validateGig,
  validateMessage,
  validateForumPost,
} from "@/lib/validation";

describe("jobs validation helpers", () => {
  it("sanitizes html and truncates long strings", () => {
    const value = sanitize("<b>Hello</b> &amp; welcome " + "a".repeat(600));
    expect(value.startsWith("Hello   welcome ")).toBe(true);
    expect(value.length).toBe(500);
  });

  it("rejects incomplete application payloads", () => {
    const result = validateApplication({ gigId: "", message: "short" });
    expect(result.valid).toBe(false);
    expect(result.errors.gigId).toBeTruthy();
    expect(result.errors.message).toBeTruthy();
  });

  it("accepts a minimal valid gig payload", () => {
    const result = validateGig({
      title: "Car wash helper",
      description: "Help wash cars in the morning shift.",
      category: "car_wash",
      payDisplay: "R150/day",
      location: { coordinates: [28.0473, -26.2041] },
    });
    expect(result.valid).toBe(true);
  });

  it("rejects empty message and forum payloads", () => {
    expect(validateMessage({ conversationId: "abc", text: " " }).valid).toBe(
      false,
    );
    expect(
      validateForumPost({ title: "", content: "", category: "general" }).valid,
    ).toBe(false);
  });
});
