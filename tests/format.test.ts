import { describe, it, expect } from "vitest";
import { formatRelativeTime } from "@/lib/format";

describe("formatRelativeTime", () => {
  it("returns 'just now' for timestamps less than 1 minute ago", () => {
    const recent = new Date(Date.now() - 30 * 1000).toISOString();
    expect(formatRelativeTime(recent)).toBe("just now");
  });

  it("returns minutes for timestamps 1–59 minutes ago", () => {
    const fiveMin = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMin)).toBe("5m ago");
  });

  it("returns hours for timestamps 1–23 hours ago", () => {
    const twoHours = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoHours)).toBe("2h ago");
  });

  it("returns days for timestamps 1–6 days ago", () => {
    const threeDays = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(threeDays)).toBe("3d ago");
  });

  it("returns formatted date for timestamps older than 7 days", () => {
    const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    const result = formatRelativeTime(oldDate);
    // Should contain a month abbreviation like Jan, Feb, Mar etc.
    expect(result).toMatch(/\d{2}\s\w{3}\s\d{4}/);
  });

  it("accepts a Date object", () => {
    const d = new Date(Date.now() - 45 * 1000);
    expect(formatRelativeTime(d)).toBe("just now");
  });
});
