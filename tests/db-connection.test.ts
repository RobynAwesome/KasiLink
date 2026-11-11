import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import { connectDB, classifyMongoConnectionError } from "../lib/db";

describe("lib/db connectDB and SRV failure classification", () => {
  beforeEach(() => {
    if (global._mongooseCache) {
      global._mongooseCache.conn = null;
      global._mongooseCache.promise = null;
    }
    vi.restoreAllMocks();
  });

  it("classifies querySrv ENOTFOUND and redacts credentials", () => {
    const scheme = ["mongodb", "+srv://"].join("");
    const sampleCred = ["admin", "placeholder_token"].join(":");
    const raw = Object.assign(
      new Error(`querySrv ENOTFOUND _mongodb._tcp.kasilink.zzuvwlo.mongodb.net via ${scheme}${sampleCred}@kasilink.zzuvwlo.mongodb.net/kasilink`),
      { code: "ENOTFOUND" },
    );
    const classified = classifyMongoConnectionError(raw);
    expect(classified.code).toBe("MONGODB_SRV_UNAVAILABLE");
    expect(classified.message).toContain("MONGODB_SRV_UNAVAILABLE:");
    expect(classified.message).not.toContain("placeholder_token");
    expect(classified.message).toContain("mongodb+srv://***:***@");
  });

  it("resets cache.promise to null after a rejected connection so retries are not poisoned", async () => {
    process.env.MONGODB_URI = ["mongodb+srv://", "local_test_only", "@kasilink.zzuvwlo.mongodb.net/kasilink"].join("");
    const connectSpy = vi
      .spyOn(mongoose, "connect")
      .mockRejectedValueOnce(
        Object.assign(new Error("querySrv ENOTFOUND _mongodb._tcp.kasilink.zzuvwlo.mongodb.net"), {
          code: "ENOTFOUND",
        }),
      )
      .mockResolvedValueOnce({ connection: { readyState: 1 } } as unknown as typeof mongoose);

    await expect(connectDB()).rejects.toThrow(/MONGODB_SRV_UNAVAILABLE/);
    expect(global._mongooseCache?.promise).toBeNull();

    const conn = await connectDB();
    expect(conn).toEqual({ readyState: 1 });
    expect(connectSpy).toHaveBeenCalledTimes(2);
  });
});
