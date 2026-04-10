/**
 * Tests for load-shedding and tutoring API routes.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({ default: vi.fn().mockResolvedValue(undefined) }));

const mockDoc = { _id: "sess_1", reference: "KL-12345" };

vi.mock("mongoose", async (importOriginal) => {
  const actual = await importOriginal<typeof import("mongoose")>();
  const lean = () => Promise.resolve([]);
  const limit = () => ({ lean });
  const skip = () => ({ limit });
  const sort = () => ({ skip, limit });
  const modelInstance = {
    find: vi.fn(() => ({ sort })),
    countDocuments: vi.fn().mockResolvedValue(0),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeRequest(method: string, url: string, body?: unknown): NextRequest {
  const init: any = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { "content-type": "application/json" };
  }
  return new NextRequest(url, init);
}

// ── GET /api/load-shedding ────────────────────────────────────────────────────
describe("GET /api/load-shedding", () => {
  it("returns 200 with stage=0 when no API key configured", async () => {
    // Ensure key is absent
    delete process.env.ESKOMSEPUSH_API_KEY;

    const { GET } = await import("@/app/api/load-shedding/route");
    const res = await GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.stage).toBe(0);
    expect(json.status).toBe("Status unavailable");
    expect(typeof json.updatedAt).toBe("string");
  });

  it("falls back gracefully when upstream fetch fails", async () => {
    process.env.ESKOMSEPUSH_API_KEY = "test-key";
    // Mock global fetch to reject
    const orig = global.fetch;
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

    const { GET } = (await vi.importActual("@/app/api/load-shedding/route")) as { GET: () => Promise<Response> };
    const res = await GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.stage).toBe(0);

    global.fetch = orig;
    delete process.env.ESKOMSEPUSH_API_KEY;
  });
});

// ── POST /api/tutoring ────────────────────────────────────────────────────────
describe("POST /api/tutoring", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { POST } = await import("@/app/api/tutoring/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/tutoring", {
      subject: "Mathematics",
      grade: "Grade 12",
      suburb: "Soweto",
      tutorName: "Thandi Dlamini",
      duration: 60,
      date: new Date(Date.now() + 86400000).toISOString(),
      location: "online",
    }));
    expect(res.status).toBe(401);
  });

  it("returns 422 on missing subject", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/tutoring/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/tutoring", {
      subject: "",
      grade: "Grade 12",
      suburb: "Soweto",
      tutorName: "Thandi Dlamini",
      duration: 60,
      date: new Date(Date.now() + 86400000).toISOString(),
      location: "online",
    }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.subject).toBeTruthy();
  });

  it("returns 422 on duration out of range", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/tutoring/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/tutoring", {
      subject: "Mathematics",
      grade: "Grade 12",
      suburb: "Soweto",
      tutorName: "Thandi Dlamini",
      duration: 10, // below 30 min minimum
      date: new Date(Date.now() + 86400000).toISOString(),
      location: "online",
    }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.duration).toBeTruthy();
  });

  it("returns 422 on invalid location", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/tutoring/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/tutoring", {
      subject: "Mathematics",
      grade: "Grade 12",
      suburb: "Soweto",
      tutorName: "Thandi Dlamini",
      duration: 60,
      date: new Date(Date.now() + 86400000).toISOString(),
      location: "hybrid", // invalid
    }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.location).toBeTruthy();
  });

  it("returns 201 on valid tutoring session", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/tutoring/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/tutoring", {
      subject: "Mathematics",
      grade: "Grade 12",
      suburb: "Orange Farm",
      tutorName: "Thandi Dlamini",
      duration: 90,
      date: new Date(Date.now() + 86400000).toISOString(),
      location: "online",
      notes: "Focusing on calculus and trigonometry for matric prep.",
    }));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.session).toBeDefined();
  });
});

// ── GET /api/tutoring ─────────────────────────────────────────────────────────
describe("GET /api/tutoring", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with sessions array (public browse)", async () => {
    const { GET } = await import("@/app/api/tutoring/route");
    const res = await GET(makeRequest("GET", "http://localhost/api/tutoring"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.sessions)).toBe(true);
    expect(json.page).toBe(1);
  });

  it("returns 401 when ?mine=true without auth", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { GET } = await import("@/app/api/tutoring/route");
    const res = await GET(makeRequest("GET", "http://localhost/api/tutoring?mine=true"));
    expect(res.status).toBe(401);
  });
});
