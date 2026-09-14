/**
 * lib/cors.ts
 * ───────────────────────────────────────────────────────────
 * Cross-Origin Resource Sharing (CORS) helper for KasiLink APIs.
 *
 * KC Apprenticeship Phase 2, Task 13
 *
 * Provides utilities to attach CORS headers to responses
 * and handle OPTIONS preflight requests for public API endpoints.
 * ───────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";

export interface CorsOptions {
  allowedOrigins?: string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
}

const DEFAULT_ALLOWED_ORIGINS = [
  "https://kasilink.com",
  "https://www.kasilink.com",
  "https://kasi-link.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

const DEFAULT_ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
const DEFAULT_ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept",
  "Origin",
];

/**
 * Resolve the matching origin based on the request.
 */
function resolveOrigin(req: NextRequest | undefined, allowedOrigins: string[]): string {
  if (!req) return allowedOrigins[0] || "*";
  const origin = req.headers.get("origin");
  if (!origin) return allowedOrigins[0] || "*";

  if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
    return origin;
  }

  // Check wildcard subdomains or Vercel preview URLs
  if (origin.endsWith(".vercel.app") && allowedOrigins.some((o) => o.includes("vercel.app"))) {
    return origin;
  }

  return allowedOrigins[0] || "*";
}

/**
 * Generate standard CORS headers.
 */
export function getCorsHeaders(
  req?: NextRequest,
  options: CorsOptions = {},
): Record<string, string> {
  const allowedOrigins = options.allowedOrigins || DEFAULT_ALLOWED_ORIGINS;
  const methods = options.allowedMethods || DEFAULT_ALLOWED_METHODS;
  const headers = options.allowedHeaders || DEFAULT_ALLOWED_HEADERS;
  const maxAge = options.maxAge ?? 86400; // 24 hours
  const credentials = options.credentials ?? true;

  const origin = resolveOrigin(req, allowedOrigins);

  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": methods.join(", "),
    "Access-Control-Allow-Headers": headers.join(", "),
    "Access-Control-Max-Age": String(maxAge),
  };

  if (credentials && origin !== "*") {
    corsHeaders["Access-Control-Allow-Credentials"] = "true";
  }

  return corsHeaders;
}

/**
 * Attach CORS headers to an existing NextResponse.
 */
export function withCors(
  response: NextResponse,
  req?: NextRequest,
  options?: CorsOptions,
): NextResponse {
  const headers = getCorsHeaders(req, options);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

/**
 * Handle HTTP OPTIONS preflight request.
 */
export function handleCorsPreflight(
  req?: NextRequest,
  options?: CorsOptions,
): NextResponse {
  const headers = getCorsHeaders(req, options);
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}
