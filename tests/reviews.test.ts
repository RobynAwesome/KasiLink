/**
 * Reviews API route tests — validates auth, payload, and business rules.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({ default: vi.fn().mockResolvedValue(undefined) }));

const mockReview = { _id: "rev_1", rating: 4 };

vi.mock("@/lib/models/Review", () => ({
  default: {
    find: vi.fn(() => ({ sort: () => ({ lean: () => Promise.resolve([]) }) })),
    aggregate: vi.fn().mockResolvedValue([{ average: 4.5, count: 3 }]),
    create: vi.fn().mockResolvedValue(mockReview),
  },
}));

vi.mock("@/lib/models/User", () => ({
  default: {
    findOne: vi.fn().mockResolvedValue({ displayName: "Sipho M.", clerkId: "user_abc" }),
    updateOne: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("@/lib/models/Gig", () => ({
  default: {
    findById: vi.fn(() => ({
      lean: () => Promise.resolve({ _id: "gig_1", providerId: "provider_xyz" }),
    })),
  },
}));

vi.mock("@/lib/models/Application", () => ({
  default: {
    findOne: vi.fn(() => ({
      lean: () => Promise.resolve({ _id: "app_1", seekerId: "user_abc" }),
    })),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeRequest(method: string, url: string, body?: unknown): NextRequest {
  const init: any = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { "content-type": "application/json" };
  }
  return new NextRequest(url, init);
}

// ── GET /api/reviews ──────────────────────────────────────────────────────────
describe("GET /api/reviews", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 when providerId is missing", async () => {
    const { GET } = await import("@/app/api/reviews/route");
    const res = await GET(makeRequest("GET", "http://localhost/api/reviews"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/missing providerId/i);
  });

  it("returns 200 with reviews and summary when providerId provided", async () => {
    const { GET } = await import("@/app/api/reviews/route");
    const res = await GET(makeRequest("GET", "http://localhost/api/reviews?providerId=provider_xyz"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.reviews)).toBe(true);
    expect(json.summary).toBeDefined();
    expect(typeof json.summary.average).toBe("number");
  });
});

// ── POST /api/reviews ─────────────────────────────────────────────────────────
describe("POST /api/reviews", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { POST } = await import("@/app/api/reviews/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/reviews", {
      gigId: "gig_1",
      providerId: "provider_xyz",
      rating: 4,
      comment: "Great work, very reliable.",
    }));
    expect(res.status).toBe(401);
  });

  it("returns 400 on rating below 1", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/reviews/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/reviews", {
      gigId: "gig_1",
      providerId: "provider_xyz",
      rating: 0,
      comment: "Bad.",
    }));
    expect(res.status).toBe(400);
  });

  it("returns 400 on rating above 5", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/reviews/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/reviews", {
      gigId: "gig_1",
      providerId: "provider_xyz",
      rating: 6,
    }));
    expect(res.status).toBe(400);
  });

  it("returns 201 on valid review with application", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/reviews/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/reviews", {
      gigId: "gig_1",
      providerId: "provider_xyz",
      rating: 4,
      comment: "Great work, very reliable and on time.",
    }));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.review).toBeDefined();
  });

  it("returns 400 on comment longer than 500 chars", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/reviews/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/reviews", {
      gigId: "gig_1",
      providerId: "provider_xyz",
      rating: 3,
      comment: "a".repeat(501),
    }));
    expect(res.status).toBe(400);
  });
});
