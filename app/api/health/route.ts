import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

/**
 * GET /api/health
 * ───────────────────────────────────────────────────────────
 * Health check endpoint with database connectivity check.
 * KC Apprenticeship Phase 2, Task 20
 * ───────────────────────────────────────────────────────────
 */
export async function GET() {
  const start = Date.now();
  let dbStatus = "disconnected";
  let dbLatencyMs = -1;

  if (process.env.MONGODB_URI) {
    try {
      const conn = await connectDB();
      const readyState = conn.readyState;
      const states = ["disconnected", "connected", "connecting", "disconnecting"];
      dbStatus = states[readyState] || "unknown";

      if (readyState === 1 && conn.db) {
        const pingStart = Date.now();
        await conn.db.admin().ping();
        dbLatencyMs = Date.now() - pingStart;
      }
    } catch {
      dbStatus = "error";
    }
  } else {
    dbStatus = "unconfigured";
  }

  const isHealthy = dbStatus === "connected" || dbStatus === "unconfigured";
  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      durationMs: Date.now() - start,
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs >= 0 ? dbLatencyMs : undefined,
      },
      system: {
        nodeVersion: process.version,
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
    },
    { status: statusCode },
  );
}
