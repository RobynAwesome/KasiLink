/**
 * USSD route tests — validates CON/END protocol responses.
 * No live DB; Gig/Application/User mocked.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db", () => ({ default: vi.fn().mockResolvedValue(undefined) }));

vi.mock("@/lib/models/Gig", () => ({
  default: {
    find: vi.fn(() => ({
      sort: () => ({ limit: () => ({ lean: () => Promise.resolve([]) }) }),
    })),
    findById: vi.fn().mockResolvedValue(null),
    findByIdAndUpdate: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("@/lib/models/Application", () => ({
  default: {
    find: vi.fn(() => ({
      sort: () => ({ limit: () => ({ lean: () => Promise.resolve([]) }) }),
    })),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/models/User", () => ({
  default: {
    findOne: vi.fn().mockResolvedValue(null),
    find: vi.fn(() => ({
      sort: () => ({ limit: () => ({ lean: () => Promise.resolve([]) }) }),
    })),
  },
}));

vi.mock("@/lib/models/Notification", () => ({
  default: { create: vi.fn() },
}));

function makeUssdRequest(phoneNumber: string, text: string): NextRequest {
  const body = new URLSearchParams({ phoneNumber, text });
  return new NextRequest("http://localhost/api/ussd", {
    method: "POST",
    body,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  } as never);
}

async function getBody(res: Response): Promise<string> {
  return res.text();
}

// ── USSD Protocol ─────────────────────────────────────────────────────────────
describe("POST /api/ussd — protocol", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns CON welcome menu on empty text", async () => {
    const { POST } = await import("@/app/api/ussd/route");
    const res = await POST(makeUssdRequest("+27821234567", ""));
    const body = await getBody(res);
    expect(body).toMatch(/^CON /);
    expect(body).toContain("Welcome to KasiLink");
    expect(body).toContain("1. Find gigs near me");
  });

  it("returns END when phone number is missing", async () => {
    const { POST } = await import("@/app/api/ussd/route");
    const res = await POST(makeUssdRequest("", ""));
    const body = await getBody(res);
    expect(body).toMatch(/^END /);
    expect(body).toContain("Phone number missing");
  });

  it("returns CON suburb prompt on option 1", async () => {
    const { POST } = await import("@/app/api/ussd/route");
    const res = await POST(makeUssdRequest("+27821234567", "1"));
    const body = await getBody(res);
    expect(body).toMatch(/^CON /);
    expect(body).toContain("suburb");
  });

  it("returns END no gigs when none in suburb", async () => {
    const { POST } = await import("@/app/api/ussd/route");
    // Gig.find already mocked to return []
    const res = await POST(makeUssdRequest("+27821234567", "1*Soweto"));
    const body = await getBody(res);
    expect(body).toMatch(/^END /);
    expect(body).toContain("No open gigs found near Soweto");
  });

  it("returns END no profile for option 2 when user not found", async () => {
    const { POST } = await import("@/app/api/ussd/route");
    const res = await POST(makeUssdRequest("+27821234567", "2"));
    const body = await getBody(res);
    expect(body).toMatch(/^END /);
    expect(body).toContain("No KasiLink profile");
  });

  it("returns END help content for option 4", async () => {
    const { POST } = await import("@/app/api/ussd/route");
    const res = await POST(makeUssdRequest("+27821234567", "4"));
    const body = await getBody(res);
    expect(body).toMatch(/^END /);
    expect(body).toContain("KasiLink Help");
    expect(body).toContain("kasilink.com");
  });

  it("returns END invalid option for unknown selection", async () => {
    const { POST } = await import("@/app/api/ussd/route");
    const res = await POST(makeUssdRequest("+27821234567", "9"));
    const body = await getBody(res);
    expect(body).toMatch(/^END /);
    expect(body).toContain("Invalid option");
  });

  it("returns END no verified providers when list empty", async () => {
    const { POST } = await import("@/app/api/ussd/route");
    const res = await POST(makeUssdRequest("+27821234567", "3"));
    const body = await getBody(res);
    expect(body).toMatch(/^END /);
    expect(body).toContain("No verified providers");
  });
});

// ── normalizeSegments logic (via observable USSD flow) ────────────────────────
describe("POST /api/ussd — segment parsing", () => {
  beforeEach(() => vi.clearAllMocks());

  it("handles starred input with whitespace gracefully", async () => {
    const { POST } = await import("@/app/api/ussd/route");
    // "1 * Soweto" — AT can send whitespace around stars
    const res = await POST(makeUssdRequest("+27821234567", "1 * Soweto"));
    const body = await getBody(res);
    // Should parse suburb as "Soweto" and attempt gig search
    expect(body).toMatch(/^END /); // no gigs → END
    expect(body).toContain("Soweto");
  });
});
