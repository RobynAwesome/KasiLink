/**
 * Auth config tests — validates route protection patterns and SA phone helpers.
 * Pure unit tests: no network, no DB, no Clerk SDK calls.
 */

import { describe, it, expect } from "vitest";
import { formatSAPhone, isValidSAPhone, publicRoutes } from "@/lib/auth.config";

// ── Protected routes (mirrors proxy.ts isProtectedRoute patterns) ─────────────
const PROTECTED_PATTERNS = [
  /^\/profile(\/.*)?$/,
  /^\/gigs\/new(\/.*)?$/,
  /^\/chat(\/.*)?$/,
  /^\/incidents\/new(\/.*)?$/,
  /^\/tutoring\/new(\/.*)?$/,
  /^\/community-calendar\/new(\/.*)?$/,
  /^\/spotlight\/new(\/.*)?$/,
  /^\/my-water-reports(\/.*)?$/,
];

function isProtected(path: string): boolean {
  return PROTECTED_PATTERNS.some((re) => re.test(path));
}

describe("Route protection patterns", () => {
  it("protects /profile", () => expect(isProtected("/profile")).toBe(true));
  it("protects /profile/edit", () => expect(isProtected("/profile/edit")).toBe(true));
  it("protects /gigs/new", () => expect(isProtected("/gigs/new")).toBe(true));
  it("protects /chat", () => expect(isProtected("/chat")).toBe(true));
  it("protects /chat/conv123", () => expect(isProtected("/chat/conv123")).toBe(true));
  it("protects /incidents/new", () => expect(isProtected("/incidents/new")).toBe(true));
  it("protects /tutoring/new", () => expect(isProtected("/tutoring/new")).toBe(true));
  it("protects /community-calendar/new", () =>
    expect(isProtected("/community-calendar/new")).toBe(true));
  it("protects /spotlight/new", () => expect(isProtected("/spotlight/new")).toBe(true));
  it("protects /my-water-reports", () => expect(isProtected("/my-water-reports")).toBe(true));

  // Public routes must NOT be protected
  it("allows / publicly", () => expect(isProtected("/")).toBe(false));
  it("allows /marketplace publicly", () => expect(isProtected("/marketplace")).toBe(false));
  it("allows /forum publicly", () => expect(isProtected("/forum")).toBe(false));
  it("allows /sign-in publicly", () => expect(isProtected("/sign-in")).toBe(false));
  it("allows /sign-up publicly", () => expect(isProtected("/sign-up")).toBe(false));
  it("allows /gigs/[id] view publicly", () => expect(isProtected("/gigs/abc123")).toBe(false));
  it("allows /verified publicly", () => expect(isProtected("/verified")).toBe(false));
  it("allows /resources publicly", () => expect(isProtected("/resources")).toBe(false));
});

// ── publicRoutes list ─────────────────────────────────────────────────────────
describe("publicRoutes list", () => {
  it("includes root", () => expect(publicRoutes).toContain("/"));
  it("includes /marketplace", () => expect(publicRoutes).toContain("/marketplace"));
  it("includes /forum", () => expect(publicRoutes).toContain("/forum"));
  it("includes /sign-in", () => expect(publicRoutes).toContain("/sign-in"));
  it("includes /sign-up", () => expect(publicRoutes).toContain("/sign-up"));
});

// ── formatSAPhone ─────────────────────────────────────────────────────────────
describe("formatSAPhone", () => {
  it("converts 0xx number to +27 format", () => {
    expect(formatSAPhone("0821234567")).toBe("+27821234567");
  });

  it("converts 9-digit number to +27 format", () => {
    expect(formatSAPhone("821234567")).toBe("+27821234567");
  });

  it("passes through +27 prefix", () => {
    expect(formatSAPhone("+27821234567")).toBe("+27821234567");
  });

  it("handles 27-prefixed 11-digit number", () => {
    expect(formatSAPhone("27821234567")).toBe("+27821234567");
  });

  it("strips non-digit characters before formatting", () => {
    expect(formatSAPhone("082 123 4567")).toBe("+27821234567");
  });
});

// ── isValidSAPhone ────────────────────────────────────────────────────────────
describe("isValidSAPhone", () => {
  it("accepts valid mobile (08x)", () => {
    expect(isValidSAPhone("0821234567")).toBe(true);
  });

  it("accepts valid mobile (07x)", () => {
    expect(isValidSAPhone("0741234567")).toBe(true);
  });

  it("accepts valid mobile (06x)", () => {
    expect(isValidSAPhone("0611234567")).toBe(true);
  });

  it("accepts E.164 format directly", () => {
    expect(isValidSAPhone("+27821234567")).toBe(true);
  });

  it("rejects landline prefix (01x)", () => {
    expect(isValidSAPhone("0111234567")).toBe(false);
  });

  it("rejects too-short number", () => {
    expect(isValidSAPhone("082123")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidSAPhone("")).toBe(false);
  });

  it("rejects international non-SA number", () => {
    expect(isValidSAPhone("+14155550123")).toBe(false);
  });
});
