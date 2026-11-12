// lib/db.ts
// MongoDB Atlas connection — singleton pattern for Next.js serverless
// Run first: npm install mongoose

import mongoose from "mongoose";

// Strict type check for global cache
// Global cache to prevent multiple connections in dev hot-reload
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};
global._mongooseCache = cache;

export function classifyMongoConnectionError(error: unknown): Error & { code?: string } {
  const rawMessage = error instanceof Error ? error.message : String(error ?? "Unknown database error");
  // Redact any embedded credentials (including passwords containing '@')
  const sanitizedMessage = rawMessage.replace(/mongodb(\+srv)?:\/\/[^\s/]+@/gi, "mongodb$1://***:***@");
  const typedErr = error as { code?: unknown; cause?: { code?: unknown } } | null | undefined;
  const errCode = typeof typedErr?.code === "string"
    ? typedErr.code
    : typeof typedErr?.cause?.code === "string"
      ? typedErr.cause.code
      : "";
  const isSrvOrNetworkFailure =
    errCode === "ENOTFOUND" ||
    errCode === "ECONNREFUSED" ||
    errCode === "ETIMEDOUT" ||
    errCode === "EAI_AGAIN" ||
    sanitizedMessage.includes("querySrv") ||
    sanitizedMessage.includes("queryTxt") ||
    sanitizedMessage.includes("ENOTFOUND") ||
    sanitizedMessage.includes("ECONNREFUSED") ||
    sanitizedMessage.includes("ETIMEDOUT") ||
    sanitizedMessage.includes("EAI_AGAIN") ||
    sanitizedMessage.includes("Server selection timed out");

  const classified = new Error(
    isSrvOrNetworkFailure
      ? `MONGODB_SRV_UNAVAILABLE: ${sanitizedMessage}`
      : sanitizedMessage,
  ) as Error & { code?: string };
  classified.code = isSrvOrNetworkFailure ? "MONGODB_SRV_UNAVAILABLE" : errCode || "MONGODB_CONNECTION_ERROR";
  return classified;
}

export async function connectDB(): Promise<mongoose.Connection> {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri) {
    throw new Error(
      "Please define MONGODB_URI in your .env.local file.\n" +
        "Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kasilink?retryWrites=true&w=majority",
    );
  }

  if (cache.conn && cache.conn.readyState === 1) return cache.conn;
  if (cache.conn && cache.conn.readyState !== 1) {
    cache.conn = null;
  }

  if (!cache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cache.promise = mongoose
      .connect(mongoUri, opts)
      .then((m) => m.connection);
  }

  const pendingPromise = cache.promise;
  try {
    cache.conn = await pendingPromise;
    return cache.conn;
  } catch (err) {
    if (cache.promise === pendingPromise) {
      cache.promise = null;
    }
    cache.conn = null;
    throw classifyMongoConnectionError(err);
  }
}

export default connectDB;
