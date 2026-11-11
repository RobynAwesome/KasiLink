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
  // Redact any embedded credentials if present in error messages
  const sanitizedMessage = rawMessage.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, "mongodb$1://***:***@");
  const errCode = (error as { code?: string })?.code ?? "";
  const isSrvOrNetworkFailure =
    errCode === "ENOTFOUND" ||
    errCode === "ECONNREFUSED" ||
    sanitizedMessage.includes("querySrv") ||
    sanitizedMessage.includes("ENOTFOUND") ||
    sanitizedMessage.includes("ECONNREFUSED") ||
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
  const mongoUri = process.env.MONGODB_URI as string;
  if (!mongoUri) {
    throw new Error(
      "Please define MONGODB_URI in your .env.local file.\n" +
        "Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kasilink?retryWrites=true&w=majority",
    );
  }

  if (cache.conn) return cache.conn;

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

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    cache.promise = null;
    cache.conn = null;
    throw classifyMongoConnectionError(err);
  }
}

export default connectDB;
