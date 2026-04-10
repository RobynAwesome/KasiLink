import { describe, it, expect } from "vitest";
import {
  sanitize,
  validateApplication,
  validateGig,
  validateMessage,
  validateForumPost,
} from "@/lib/validation";

describe("sanitize", () => {
  it("strips HTML tags", () => {
    expect(sanitize("<b>Hello</b>")).toContain("Hello");
    expect(sanitize("<b>Hello</b>")).not.toContain("<b>");
  });

  it("truncates to 500 characters", () => {
    const long = "a".repeat(600);
    expect(sanitize(long).length).toBeLessThanOrEqual(500);
  });

  it("handles empty string", () => {
    expect(sanitize("")).toBe("");
  });
});

describe("validateApplication", () => {
  it("rejects empty gigId", () => {
    const result = validateApplication({ gigId: "", message: "I can do this work." });
    expect(result.valid).toBe(false);
    expect(result.errors.gigId).toBeTruthy();
  });

  it("rejects message shorter than 10 characters", () => {
    const result = validateApplication({ gigId: "abc123", message: "tooshort" });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeTruthy();
  });

  it("accepts a valid application", () => {
    const result = validateApplication({
      gigId: "abc123",
      message: "I have experience with this type of work.",
    });
    expect(result.valid).toBe(true);
  });
});

describe("validateGig", () => {
  it("accepts a minimal valid gig", () => {
    const result = validateGig({
      title: "Car wash helper",
      description: "Help wash cars in the morning shift in Soweto.",
      category: "car_wash",
      payDisplay: "R150/day",
      location: { coordinates: [28.0473, -26.2041] },
    });
    expect(result.valid).toBe(true);
  });

  it("rejects missing title", () => {
    const result = validateGig({
      title: "",
      description: "Some description here.",
      category: "cleaning",
      payDisplay: "R200/day",
      location: { coordinates: [28.0473, -26.2041] },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBeTruthy();
  });

  it("rejects empty title", () => {
    const result = validateGig({
      title: "  ",
      description: "Some longer description.",
      category: "cleaning",
      payDisplay: "R200/day",
      location: { coordinates: [28.0473, -26.2041] },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBeTruthy();
  });

  it("rejects missing payDisplay", () => {
    const result = validateGig({
      title: "Delivery driver needed",
      description: "Deliver parcels across Tembisa township area.",
      category: "delivery",
      payDisplay: "",
      location: { coordinates: [28.2267, -25.9975] },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.payDisplay).toBeTruthy();
  });
});

describe("validateMessage", () => {
  it("rejects blank message", () => {
    const result = validateMessage({ conversationId: "conv123", text: "   " });
    expect(result.valid).toBe(false);
  });

  it("rejects empty conversationId", () => {
    const result = validateMessage({ conversationId: "", text: "Hello there" });
    expect(result.valid).toBe(false);
  });

  it("accepts valid message", () => {
    const result = validateMessage({
      conversationId: "conv123",
      text: "I can be there by 7am.",
    });
    expect(result.valid).toBe(true);
  });
});

describe("validateForumPost", () => {
  it("rejects empty title and content", () => {
    const result = validateForumPost({ title: "", content: "", category: "general" });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBeTruthy();
    expect(result.errors.content).toBeTruthy();
  });

  it("rejects empty content", () => {
    const result = validateForumPost({
      title: "Valid title here",
      content: "   ",
      category: "safety",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.content).toBeTruthy();
  });

  it("accepts a full valid post", () => {
    const result = validateForumPost({
      title: "Load-shedding alert for Soweto tonight",
      content: "Stage 2 confirmed from 18:00 to 22:00. Plan your gigs around this.",
      category: "load-shedding", // hyphen — matches validCategories
    });
    expect(result.valid).toBe(true);
  });
});
