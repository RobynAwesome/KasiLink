import { describe, it, expect } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders, withCors, handleCorsPreflight } from "@/lib/cors";

describe("lib/cors", () => {
  it("generates default CORS headers with fallback origin", () => {
    const headers = getCorsHeaders();
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://kasilink.com");
    expect(headers["Access-Control-Allow-Methods"]).toContain("GET");
    expect(headers["Access-Control-Allow-Methods"]).toContain("POST");
    expect(headers["Access-Control-Allow-Headers"]).toContain("Content-Type");
    expect(headers["Access-Control-Max-Age"]).toBe("86400");
  });

  it("reflects allowed origin from request", () => {
    const req = new NextRequest("http://localhost:3000/api/test", {
      headers: { origin: "http://localhost:3000" },
    });
    const headers = getCorsHeaders(req);
    expect(headers["Access-Control-Allow-Origin"]).toBe("http://localhost:3000");
    expect(headers["Access-Control-Allow-Credentials"]).toBe("true");
  });

  it("handles wildcard origin without credentials", () => {
    const req = new NextRequest("http://localhost:3000/api/public", {
      headers: { origin: "https://some-client.com" },
    });
    const headers = getCorsHeaders(req, { allowedOrigins: ["*"] });
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://some-client.com");
  });

  it("attaches headers to an existing response using withCors", () => {
    const res = NextResponse.json({ ok: true });
    const req = new NextRequest("http://localhost:3000/api/test", {
      headers: { origin: "https://kasilink.com" },
    });
    const corsRes = withCors(res, req);
    expect(corsRes.headers.get("Access-Control-Allow-Origin")).toBe("https://kasilink.com");
  });

  it("returns 204 response for handleCorsPreflight", () => {
    const req = new NextRequest("http://localhost:3000/api/test", {
      method: "OPTIONS",
      headers: { origin: "http://localhost:3000" },
    });
    const preflightRes = handleCorsPreflight(req);
    expect(preflightRes.status).toBe(204);
    expect(preflightRes.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:3000");
    expect(preflightRes.headers.get("Access-Control-Allow-Methods")).toBeTruthy();
  });
});
