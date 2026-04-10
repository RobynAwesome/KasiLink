/**
 * Regression tests for spotlight/new and community-calendar/new create flows.
 * Validates API-level validation rules without a live DB or Clerk connection.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Clerk mock ────────────────────────────────────────────────────────────────
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// ── DB + model mocks ──────────────────────────────────────────────────────────
vi.mock("@/lib/db", () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/logger", () => ({ log: vi.fn() }));

vi.mock("@/lib/models/User", () => ({
  default: {
    findOne: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue({ displayName: "Test User" }),
    }),
  },
}));

// Spotlight inline schema model (defined inside route file using mongoose.models)
vi.mock("mongoose", async (importOriginal) => {
  const actual = await importOriginal<typeof import("mongoose")>();
  const mockDoc = { _id: "doc_1" };
  const modelInstance = {
    find: vi.fn(() => ({ sort: () => ({ limit: () => ({ lean: () => Promise.resolve([]) }) }) })),
    create: vi.fn().mockResolvedValue(mockDoc),
  };
  return {
    ...actual,
    default: {
      ...actual.default,
      Schema: actual.default.Schema,
      models: {},
      model: vi.fn().mockReturnValue(modelInstance),
    },
  };
});

function makeRequest(method: string, url: string, body?: unknown): NextRequest {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { "content-type": "application/json" };
  }
  return new NextRequest(url, init);
}

// ── POST /api/spotlight ───────────────────────────────────────────────────────
describe("POST /api/spotlight", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { POST } = await import("@/app/api/spotlight/route");
    const req = makeRequest("POST", "http://localhost/api/spotlight", {
      businessName: "Sipho Repairs",
      category: "services",
      description: "Mobile phone screen repairs in Soweto.",
      suburb: "Soweto",
      phone: "0821234567",
      ownerName: "Sipho Dlamini",
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 422 on missing businessName", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/spotlight/route");
    const req = makeRequest("POST", "http://localhost/api/spotlight", {
      businessName: "",
      category: "services",
      description: "Mobile phone screen repairs in Soweto.",
      suburb: "Soweto",
      phone: "0821234567",
      ownerName: "Sipho Dlamini",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.businessName).toBeTruthy();
  });

  it("returns 422 when description is shorter than 10 chars", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/spotlight/route");
    const req = makeRequest("POST", "http://localhost/api/spotlight", {
      businessName: "Sipho Repairs",
      category: "services",
      description: "short",
      suburb: "Soweto",
      phone: "0821234567",
      ownerName: "Sipho Dlamini",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.description).toBeTruthy();
  });

  it("returns 422 on missing phone", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/spotlight/route");
    const req = makeRequest("POST", "http://localhost/api/spotlight", {
      businessName: "Sipho Repairs",
      category: "services",
      description: "Screen repairs while you wait, seven days a week.",
      suburb: "Soweto",
      phone: "",
      ownerName: "Sipho Dlamini",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.phone).toBeTruthy();
  });

  it("returns 422 on invalid category", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/spotlight/route");
    const req = makeRequest("POST", "http://localhost/api/spotlight", {
      businessName: "Sipho Repairs",
      category: "invalid_cat",
      description: "Screen repairs while you wait, seven days a week.",
      suburb: "Soweto",
      phone: "0821234567",
      ownerName: "Sipho Dlamini",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.category).toBeTruthy();
  });

  it("returns 201 on valid spotlight business", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/spotlight/route");
    const req = makeRequest("POST", "http://localhost/api/spotlight", {
      businessName: "Sipho Mobile Repairs",
      category: "services",
      description: "We fix cracked screens, batteries, and charging ports while you wait.",
      suburb: "Soweto",
      phone: "0821234567",
      ownerName: "Sipho Dlamini",
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.business).toBeDefined();
  });
});

// ── POST /api/community-calendar ──────────────────────────────────────────────
describe("POST /api/community-calendar", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { POST } = await import("@/app/api/community-calendar/route");
    const req = makeRequest("POST", "http://localhost/api/community-calendar", {
      title: "Soweto Job Fair 2026",
      description: "Employers from across Gauteng will be present. Bring your CV.",
      suburb: "Soweto",
      type: "job_fair",
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "09:00 AM",
      organizerName: "Community Centre",
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 422 on missing title", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/community-calendar/route");
    const req = makeRequest("POST", "http://localhost/api/community-calendar", {
      title: "",
      description: "Employers from across Gauteng will be present. Bring your CV.",
      suburb: "Soweto",
      type: "job_fair",
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "09:00 AM",
      organizerName: "Community Centre",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.title).toBeTruthy();
  });

  it("returns 422 on title shorter than 5 chars", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/community-calendar/route");
    const req = makeRequest("POST", "http://localhost/api/community-calendar", {
      title: "Hi",
      description: "Employers from across Gauteng will be present. Bring your CV.",
      suburb: "Soweto",
      type: "job_fair",
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "09:00 AM",
      organizerName: "Community Centre",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.title).toBeTruthy();
  });

  it("returns 422 on missing suburb", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/community-calendar/route");
    const req = makeRequest("POST", "http://localhost/api/community-calendar", {
      title: "Soweto Job Fair 2026",
      description: "Employers from across Gauteng will be present. Bring your CV.",
      suburb: "",
      type: "job_fair",
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "09:00 AM",
      organizerName: "Community Centre",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.suburb).toBeTruthy();
  });

  it("returns 422 on invalid event type", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/community-calendar/route");
    const req = makeRequest("POST", "http://localhost/api/community-calendar", {
      title: "Soweto Job Fair 2026",
      description: "Employers from across Gauteng will be present. Bring your CV.",
      suburb: "Soweto",
      type: "concert",
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "09:00 AM",
      organizerName: "Community Centre",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.type).toBeTruthy();
  });

  it("returns 422 on missing date", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/community-calendar/route");
    const req = makeRequest("POST", "http://localhost/api/community-calendar", {
      title: "Soweto Job Fair 2026",
      description: "Employers from across Gauteng will be present. Bring your CV.",
      suburb: "Soweto",
      type: "job_fair",
      date: "",
      time: "09:00 AM",
      organizerName: "Community Centre",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.date).toBeTruthy();
  });

  it("returns 201 on valid event", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/community-calendar/route");
    const req = makeRequest("POST", "http://localhost/api/community-calendar", {
      title: "Soweto Community Job Fair 2026",
      description: "Employers from across Gauteng will be present. Bring your CV and dress to impress.",
      suburb: "Soweto",
      type: "job_fair",
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "09:00 AM",
      organizerName: "Community Centre",
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.event).toBeDefined();
  });
});
