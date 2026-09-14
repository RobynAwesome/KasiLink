import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/load-shedding/schedule/route";

describe("GET /api/load-shedding/schedule", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.ESKOMSEPUSH_API_KEY;
  });

  it("returns generated schedule from national stage fallback when no API key configured", async () => {
    // Mock the internal national stage fetch
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/load-shedding")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ stage: 2 }),
        });
      }
      return Promise.reject(new Error("unexpected fetch"));
    });

    const req = new NextRequest("http://localhost:3000/api/load-shedding/schedule?zone=1&days=3");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.zone).toBe("1");
    expect(data.stage).toBe(2);
    expect(data.source).toBe("generated-from-national-stage");
    expect(Array.isArray(data.schedule)).toBe(true);
    expect(data.schedule.length).toBeGreaterThan(0);
    expect(data.schedule[0].stage).toBe(2);
    expect(data.schedule[0].start).toBeTruthy();
    expect(data.schedule[0].end).toBeTruthy();
  });

  it("handles empty stage gracefully (stage 0 = empty schedule)", async () => {
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/load-shedding")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ stage: 0 }),
        });
      }
      return Promise.reject(new Error("unexpected fetch"));
    });

    const req = new NextRequest("http://localhost:3000/api/load-shedding/schedule?zone=default");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.stage).toBe(0);
    expect(data.schedule).toEqual([]);
  });

  it("calls EskomSePush API when ESKOMSEPUSH_API_KEY is present", async () => {
    process.env.ESKOMSEPUSH_API_KEY = "test-token";

    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/business/2.0/area")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              events: [
                {
                  start: "2026-05-20T14:00:00+02:00",
                  end: "2026-05-20T16:30:00+02:00",
                  note: "Stage 2",
                },
              ],
            }),
        });
      }
      if (url.includes("/business/2.0/status")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              status: { eskom: { stage: "2" } },
            }),
        });
      }
      return Promise.reject(new Error("unexpected url"));
    });

    const req = new NextRequest("http://localhost:3000/api/load-shedding/schedule?zone=11");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.source).toBe("eskomsepush");
    expect(data.zone).toBe("11");
    expect(data.stage).toBe(2);
    expect(data.schedule.length).toBe(1);
    expect(data.schedule[0].stage).toBe(2);
  });

  it("falls back to empty schedule when all fetches fail", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network offline"));

    const req = new NextRequest("http://localhost:3000/api/load-shedding/schedule?zone=5");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.source).toBe("fallback");
    expect(data.schedule).toEqual([]);
    expect(data.stage).toBe(0);
  });
});
