/**
 * API route unit tests — validates request-handling logic without a live DB.
 * Mocks: Clerk auth, connectDB, and Mongoose models.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Clerk mock ────────────────────────────────────────────────────────────────
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// ── DB mock ───────────────────────────────────────────────────────────────────
vi.mock("@/lib/db", () => ({ default: vi.fn().mockResolvedValue(undefined) }));

// ── Model mocks ───────────────────────────────────────────────────────────────
const mockGigFind = vi.fn();
const mockGigCount = vi.fn();

vi.mock("@/lib/models/Gig", () => ({
  default: {
    find: vi.fn(() => ({ sort: () => ({ skip: () => ({ limit: () => ({ lean: mockGigFind }) }) }) })),
    countDocuments: mockGigCount,
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/models/User", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock("@/lib/models/ForumPost", () => ({
  default: {
    find: vi.fn(() => ({ sort: () => ({ skip: () => ({ limit: () => ({ lean: vi.fn().mockResolvedValue([]) }) }) }) })),
    countDocuments: vi.fn().mockResolvedValue(0),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/models/Application", () => ({
  default: {
    find: vi.fn(() => ({ sort: () => ({ limit: () => ({ lean: vi.fn().mockResolvedValue([]) }) }) })),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/models/Notification", () => ({
  default: { create: vi.fn() },
}));

// ── Gig service mock (used by /api/gigs route) ────────────────────────────────
vi.mock("@/features/gigs/service", () => ({
  RouteError: class RouteError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
  listGigs: vi.fn(),
  createGig: vi.fn(),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRequest(method: string, url: string, body?: unknown): NextRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const init: any = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { "content-type": "application/json" };
  }
  return new NextRequest(url, init);
}

// ── RouteError unit ───────────────────────────────────────────────────────────
describe("RouteError", () => {
  it("carries status and message", async () => {
    const { RouteError } = await import("@/features/gigs/service");
    const err = new RouteError(422, "Validation failed");
    expect(err.status).toBe(422);
    expect(err.message).toBe("Validation failed");
    expect(err).toBeInstanceOf(Error);
  });
});

// ── GET /api/gigs ─────────────────────────────────────────────────────────────
describe("GET /api/gigs", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with gig payload on success", async () => {
    const { listGigs } = await import("@/features/gigs/service");
    vi.mocked(listGigs).mockResolvedValueOnce({
      gigs: [{ _id: "abc", title: "Car wash helper" }],
      pagination: { page: 1, limit: 20, total: 1, pages: 1 },
    } as never);

    const { GET } = await import("@/app/api/gigs/route");
    const req = makeRequest("GET", "http://localhost/api/gigs");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.gigs).toHaveLength(1);
    expect(json.gigs[0].title).toBe("Car wash helper");
  });

  it("returns 500 when service throws unexpected error", async () => {
    const { listGigs } = await import("@/features/gigs/service");
    vi.mocked(listGigs).mockRejectedValueOnce(new Error("DB down"));

    const { GET } = await import("@/app/api/gigs/route");
    const req = makeRequest("GET", "http://localhost/api/gigs");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/failed/i);
  });

  it("propagates RouteError status", async () => {
    const { listGigs, RouteError } = await import("@/features/gigs/service");
    vi.mocked(listGigs).mockRejectedValueOnce(new RouteError(401, "Unauthorised"));

    const { GET } = await import("@/app/api/gigs/route");
    const req = makeRequest("GET", "http://localhost/api/gigs");
    const res = await GET(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorised");
  });
});

// ── POST /api/gigs ────────────────────────────────────────────────────────────
describe("POST /api/gigs", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { POST } = await import("@/app/api/gigs/route");
    const req = makeRequest("POST", "http://localhost/api/gigs", { title: "Test" });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it("returns 201 on successful gig creation", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { createGig } = await import("@/features/gigs/service");
    vi.mocked(createGig).mockResolvedValueOnce({ _id: "gig_1", title: "Car wash" } as never);

    const { POST } = await import("@/app/api/gigs/route");
    const req = makeRequest("POST", "http://localhost/api/gigs", {
      title: "Car wash helper",
      description: "Wash cars in Soweto morning shift.",
      category: "car_wash",
      payDisplay: "R150/day",
      location: { coordinates: [28.0473, -26.2041] },
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.gig.title).toBe("Car wash");
  });
});

// ── POST /api/applications ────────────────────────────────────────────────────
describe("POST /api/applications", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { POST } = await import("@/app/api/applications/route");
    const req = makeRequest("POST", "http://localhost/api/applications", {
      gigId: "507f1f77bcf86cd799439011",
      message: "I can do this work well.",
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it("returns 422 on invalid body (empty gigId)", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/applications/route");
    const req = makeRequest("POST", "http://localhost/api/applications", {
      gigId: "",
      message: "I can do this work well.",
    });
    const res = await POST(req);

    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.gigId).toBeTruthy();
  });

  it("returns 422 on invalid body (short message)", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/applications/route");
    const req = makeRequest("POST", "http://localhost/api/applications", {
      gigId: "507f1f77bcf86cd799439011",
      message: "short",
    });
    const res = await POST(req);

    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.message).toBeTruthy();
  });

  it("returns 400 on invalid MongoDB ObjectId", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/applications/route");
    const req = makeRequest("POST", "http://localhost/api/applications", {
      gigId: "not-a-valid-id",
      message: "I can do this work reliably and on time.",
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalid gig id/i);
  });
});

// ── GET /api/applications ─────────────────────────────────────────────────────
describe("GET /api/applications", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { GET } = await import("@/app/api/applications/route");
    const req = makeRequest("GET", "http://localhost/api/applications");
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  it("returns 200 with applications array", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { GET } = await import("@/app/api/applications/route");
    const req = makeRequest("GET", "http://localhost/api/applications?role=seeker");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.applications)).toBe(true);
  });
});

// ── GET /api/forum ────────────────────────────────────────────────────────────
describe("GET /api/forum", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with posts array", async () => {
    const { GET } = await import("@/app/api/forum/route");
    const req = makeRequest("GET", "http://localhost/api/forum");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.posts)).toBe(true);
    expect(typeof json.total).toBe("number");
    expect(typeof json.hasMore).toBe("boolean");
  });

  it("returns pagination defaults: page=1, limit=20", async () => {
    const { GET } = await import("@/app/api/forum/route");
    const req = makeRequest("GET", "http://localhost/api/forum");
    const res = await GET(req);
    const json = await res.json();

    expect(json.page).toBe(1);
    expect(json.limit).toBe(20);
  });
});

// ── POST /api/forum ───────────────────────────────────────────────────────────
describe("POST /api/forum", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { POST } = await import("@/app/api/forum/route");
    const req = makeRequest("POST", "http://localhost/api/forum", {
      title: "Load-shedding tonight",
      content: "Stage 2 from 18:00 to 22:00.",
      category: "load-shedding",
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it("returns 400 on empty title", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/forum/route");
    const req = makeRequest("POST", "http://localhost/api/forum", {
      title: "",
      content: "Some content here.",
      category: "general",
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.details?.title).toBeTruthy();
  });

  it("returns 400 on empty content", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/forum/route");
    const req = makeRequest("POST", "http://localhost/api/forum", {
      title: "Valid title for the post",
      content: "   ",
      category: "safety",
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("returns 201 on valid post", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const ForumPost = (await import("@/lib/models/ForumPost")).default;
    vi.mocked(ForumPost.create).mockResolvedValueOnce({
      _id: "post_1",
      title: "Load-shedding alert for Soweto tonight",
      content: "Stage 2 from 18:00.",
      category: "load-shedding",
      authorName: "Anonymous",
    } as never);

    const User = (await import("@/lib/models/User")).default;
    vi.mocked(User.findOne).mockResolvedValueOnce({ displayName: "Sipho M." } as never);

    const { POST } = await import("@/app/api/forum/route");
    const req = makeRequest("POST", "http://localhost/api/forum", {
      title: "Load-shedding alert for Soweto tonight",
      content: "Stage 2 confirmed from 18:00 to 22:00. Plan your gigs around this.",
      category: "load-shedding",
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.post).toBeDefined();
  });
});
