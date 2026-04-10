/**
 * Tests for community API routes: water-alerts, incidents.
 * No live DB or Clerk — all deps mocked.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────
vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/logger", () => ({ log: vi.fn() }));

const mockDoc = { _id: "doc_1" };

vi.mock("mongoose", async (importOriginal) => {
  const actual = await importOriginal<typeof import("mongoose")>();
  const lean = () => Promise.resolve([]);
  const limit = () => ({ lean });
  const skip = () => ({ limit });
  const sort = () => ({ skip, limit }); // some routes skip `.skip()`
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

// ── POST /api/water-alerts ────────────────────────────────────────────────────
describe("POST /api/water-alerts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { POST } = await import("@/app/api/water-alerts/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/water-alerts", {
      title: "Pipe burst in Soweto",
      description: "No water since 06:00 across 3 blocks.",
      suburb: "Soweto",
      type: "water_outage",
    }));
    expect(res.status).toBe(401);
  });

  it("returns 422 on missing title", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/water-alerts/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/water-alerts", {
      title: "hi",
      description: "No water since 06:00 across 3 blocks.",
      suburb: "Soweto",
      type: "water_outage",
    }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.title).toBeTruthy();
  });

  it("returns 422 on missing suburb", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/water-alerts/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/water-alerts", {
      title: "Pipe burst in Soweto",
      description: "No water since 06:00 across 3 blocks.",
      suburb: "",
      type: "water_outage",
    }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.suburb).toBeTruthy();
  });

  it("returns 422 on invalid type", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/water-alerts/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/water-alerts", {
      title: "Pipe burst in Soweto",
      description: "No water since 06:00 across 3 blocks.",
      suburb: "Soweto",
      type: "earthquake",
    }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.type).toBeTruthy();
  });

  it("returns 201 on valid alert", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/water-alerts/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/water-alerts", {
      title: "Pipe burst in Soweto near Moroka",
      description: "No running water since 06:00 across at least 3 blocks on Khumalo Street.",
      suburb: "Soweto",
      type: "water_outage",
    }));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.alert).toBeDefined();
  });
});

// ── GET /api/water-alerts ─────────────────────────────────────────────────────
describe("GET /api/water-alerts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with alerts array (no auth required)", async () => {
    const { GET } = await import("@/app/api/water-alerts/route");
    const res = await GET(makeRequest("GET", "http://localhost/api/water-alerts"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.alerts)).toBe(true);
    expect(typeof json.total).toBe("number");
  });

  it("returns 401 when ?mine=true without auth", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { GET } = await import("@/app/api/water-alerts/route");
    const res = await GET(makeRequest("GET", "http://localhost/api/water-alerts?mine=true"));
    expect(res.status).toBe(401);
  });
});

// ── POST /api/incidents ───────────────────────────────────────────────────────
describe("POST /api/incidents", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when unauthenticated", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const { POST } = await import("@/app/api/incidents/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/incidents", {
      title: "Streetlight out near Naledi",
      description: "Dark since last night, safety risk for pedestrians walking to work.",
      suburb: "Soweto",
      type: "safety",
      reporterName: "Sipho M",
    }));
    expect(res.status).toBe(401);
  });

  it("returns 422 on title shorter than 5 chars", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/incidents/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/incidents", {
      title: "Hi",
      description: "Dark since last night, safety risk for pedestrians walking to work.",
      suburb: "Soweto",
      type: "safety",
      reporterName: "Sipho M",
    }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.title).toBeTruthy();
  });

  it("returns 422 on invalid incident type", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/incidents/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/incidents", {
      title: "Streetlight out near Naledi",
      description: "Dark since last night, safety risk for pedestrians walking to work.",
      suburb: "Soweto",
      type: "earthquake",
      reporterName: "Sipho M",
    }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.type).toBeTruthy();
  });

  it("returns 422 on missing reporterName", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/incidents/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/incidents", {
      title: "Streetlight out near Naledi",
      description: "Dark since last night, safety risk for pedestrians walking to work.",
      suburb: "Soweto",
      type: "safety",
      reporterName: "",
    }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.reporterName).toBeTruthy();
  });

  it("returns 201 on valid incident", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: "user_abc" } as never);

    const { POST } = await import("@/app/api/incidents/route");
    const res = await POST(makeRequest("POST", "http://localhost/api/incidents", {
      title: "Streetlight out near Naledi station",
      description: "Dark since last night — safety risk for pedestrians walking to work or school.",
      suburb: "Soweto",
      type: "safety",
      severity: "medium",
      reporterName: "Sipho Mthembu",
    }));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.incident).toBeDefined();
  });
});

// ── GET /api/incidents ────────────────────────────────────────────────────────
describe("GET /api/incidents", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with incidents array (public)", async () => {
    const { GET } = await import("@/app/api/incidents/route");
    const res = await GET(makeRequest("GET", "http://localhost/api/incidents"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.incidents)).toBe(true);
    expect(typeof json.total).toBe("number");
    expect(json.page).toBe(1);
  });
});
