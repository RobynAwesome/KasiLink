import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import { connectDB, classifyMongoConnectionError } from "../lib/db";

describe("lib/db connectDB and SRV failure classification", () => {
  const originalUri = process.env.MONGODB_URI;

  beforeEach(() => {
    if (global._mongooseCache) {
      global._mongooseCache.conn = null;
      global._mongooseCache.promise = null;
    }
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalUri;
    }
  });

  it("classifies querySrv ENOTFOUND and redacts credentials even with '@' in password", () => {
    const scheme = ["mongodb", "+srv://"].join("");
    const sampleCred = ["admin", "p@ss@word_token"].join(":");
    const raw = Object.assign(
      new Error(`querySrv ENOTFOUND _mongodb._tcp.kasilink.zzuvwlo.mongodb.net via ${scheme}${sampleCred}@kasilink.zzuvwlo.mongodb.net/kasilink`),
      { code: "ENOTFOUND" },
    );
    const classified = classifyMongoConnectionError(raw);
    expect(classified.code).toBe("MONGODB_SRV_UNAVAILABLE");
    expect(classified.message).toContain("MONGODB_SRV_UNAVAILABLE:");
    expect(classified.message).not.toContain("p@ss@word_token");
    expect(classified.message).not.toContain("word_token");
    expect(classified.message).toContain("mongodb+srv://***:***@");
  });

  it("classifies ECONNREFUSED and wrapped cause codes cleanly", () => {
    const nested = Object.assign(new Error("connect failed"), {
      cause: { code: "ECONNREFUSED" },
    });
    const classified = classifyMongoConnectionError(nested);
    expect(classified.code).toBe("MONGODB_SRV_UNAVAILABLE");

    const nonSrv = Object.assign(new Error("Authentication failed"), { code: "AUTH_FAIL" });
    const other = classifyMongoConnectionError(nonSrv);
    expect(other.code).toBe("AUTH_FAIL");
  });

  it("resets cache.promise only for the matching rejected attempt so concurrent retries are not clobbered", async () => {
    process.env.MONGODB_URI = ["mongodb+srv://", "local_test_only", "@kasilink.zzuvwlo.mongodb.net/kasilink"].join("");
    const connectSpy = vi
      .spyOn(mongoose, "connect")
      .mockRejectedValueOnce(
        Object.assign(new Error("querySrv ECONNREFUSED _mongodb._tcp.kasilink.zzuvwlo.mongodb.net"), {
          code: "ECONNREFUSED",
        }),
      )
      .mockResolvedValueOnce({ connection: { readyState: 1 } } as unknown as typeof mongoose);

    const p1 = connectDB();
    const p2 = connectDB();
    await expect(p1).rejects.toThrow(/MONGODB_SRV_UNAVAILABLE/);
    expect(global._mongooseCache?.promise).toBeNull();
    expect(global._mongooseCache?.conn).toBeNull();

    // Start new retry while second waiter is handling p2 rejection
    const retryPromise = connectDB();
    await expect(p2).rejects.toThrow(/MONGODB_SRV_UNAVAILABLE/);
    expect(global._mongooseCache?.promise).not.toBeNull();

    const conn = await retryPromise;
    expect(conn).toEqual({ readyState: 1 });
    expect(connectSpy).toHaveBeenCalledTimes(2);
  });
});
