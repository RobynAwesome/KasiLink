import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// In-memory mock for IndexedDB
class MockStore {
  name: string;
  keyPath: string;
  data: Map<string, unknown> = new Map();

  constructor(name: string, keyPath: string = "id") {
    this.name = name;
    this.keyPath = keyPath;
  }

  createIndex() {
    return {};
  }

  put(value: Record<string, unknown>) {
    const key = (value[this.keyPath] as string) || "key";
    this.data.set(key, value);
    const req: { onsuccess?: () => void; onerror?: () => void; result?: unknown } = {};
    setTimeout(() => {
      req.result = key;
      req.onsuccess?.();
    }, 0);
    return req;
  }

  get(key: string) {
    const req: { onsuccess?: () => void; onerror?: () => void; result?: unknown } = {};
    setTimeout(() => {
      req.result = this.data.get(key);
      req.onsuccess?.();
    }, 0);
    return req;
  }

  getAll() {
    const req: { onsuccess?: () => void; onerror?: () => void; result?: unknown } = {};
    setTimeout(() => {
      req.result = Array.from(this.data.values());
      req.onsuccess?.();
    }, 0);
    return req;
  }

  delete(key: string) {
    this.data.delete(key);
    const req: { onsuccess?: () => void; onerror?: () => void; result?: unknown } = {};
    setTimeout(() => {
      req.onsuccess?.();
    }, 0);
    return req;
  }
}

class MockDB {
  stores: Map<string, MockStore> = new Map();

  get objectStoreNames() {
    const names = Array.from(this.stores.keys());
    return {
      contains: (n: string) => this.stores.has(n),
      [Symbol.iterator]: () => names[Symbol.iterator](),
      length: names.length,
    } as unknown as DOMStringList;
  }

  createObjectStore(name: string, options?: { keyPath?: string }) {
    const store = new MockStore(name, options?.keyPath || "id");
    this.stores.set(name, store);
    return store;
  }

  transaction(storeNames: string | string[]) {
    const name = Array.isArray(storeNames) ? storeNames[0] : storeNames;
    const store = this.stores.get(name);
    return {
      objectStore: () => store,
    };
  }
}

describe("lib/kopano-vault", () => {
  let mockDB: MockDB;

  beforeEach(() => {
    mockDB = new MockDB();
    (globalThis as unknown as Record<string, unknown>).indexedDB = {
      open: vi.fn().mockImplementation(() => {
        const req: {
          result?: MockDB;
          onsuccess?: () => void;
          onupgradeneeded?: (ev: { target: { result: MockDB } }) => void;
          onerror?: () => void;
        } = {};
        setTimeout(() => {
          req.result = mockDB;
          req.onupgradeneeded?.({ target: { result: mockDB } });
          req.onsuccess?.();
        }, 0);
        return req;
      }),
    };
  });

  afterEach(() => {
    delete (globalThis as unknown as Record<string, unknown>).indexedDB;
    vi.resetModules();
  });

  it("stores and retrieves infrastructure cache entries", async () => {
    const { cacheInfrastructure, getInfrastructure, isInfraExpired } = await import(
      "@/lib/kopano-vault"
    );

    const testEntry = {
      id: "loadshedding:zone-11",
      type: "loadshedding" as const,
      zone: "11",
      schedule: [{ start: "14:00", end: "16:30", stage: 2, date: "2026-05-20" }],
      stage: 2,
      updatedAt: new Date().toISOString(),
      source: "eskomsepush",
    };

    await cacheInfrastructure(testEntry);
    const retrieved = await getInfrastructure("loadshedding:zone-11");

    expect(retrieved).toBeDefined();
    expect(retrieved?.zone).toBe("11");
    expect(retrieved?.stage).toBe(2);
    expect(retrieved?.expiresAt).toBeGreaterThan(Date.now());
    expect(isInfraExpired(retrieved!)).toBe(false);
  });

  it("handles feedback deltas in sovereign personal vault", async () => {
    const { saveFeedback, getUnsyncedFeedback, markFeedbackSynced } = await import(
      "@/lib/kopano-vault"
    );

    const id = await saveFeedback({
      gigId: "gig-123",
      userId: "user-456",
      feedback: "Cannot travel due to outage",
      language: "en",
      declineReason: "infrastructure",
      moralAffirmation: true,
    });

    expect(typeof id).toBe("string");

    const unsynced = await getUnsyncedFeedback();
    expect(unsynced.length).toBeGreaterThanOrEqual(1);
    const found = unsynced.find((d) => d.id === id);
    expect(found?.declineReason).toBe("infrastructure");
    expect(found?.synced).toBe(false);

    await markFeedbackSynced(id);
    const unsyncedAfter = await getUnsyncedFeedback();
    expect(unsyncedAfter.find((d) => d.id === id)).toBeUndefined();
  });

  it("enqueues and drains offline sync operations", async () => {
    const { enqueueSync, drainSyncQueue, removeSyncItem } = await import(
      "@/lib/kopano-vault"
    );

    const syncId = await enqueueSync("POST", "/api/applications", { gigId: "g1" });
    expect(typeof syncId).toBe("string");

    const queue = await drainSyncQueue();
    expect(queue.some((item) => item.id === syncId)).toBe(true);

    await removeSyncItem(syncId);
    const queueAfter = await drainSyncQueue();
    expect(queueAfter.some((item) => item.id === syncId)).toBe(false);
  });

  it("persists and reads user preferences", async () => {
    const { setPreference, getPreference } = await import("@/lib/kopano-vault");

    await setPreference("theme", "light");
    await setPreference("preferredZone", "Khayelitsha");

    const theme = await getPreference<string>("theme");
    const zone = await getPreference<string>("preferredZone");

    expect(theme).toBe("light");
    expect(zone).toBe("Khayelitsha");
  });

  it("caches gig snapshots for zero-connectivity viewing", async () => {
    const { cacheGig, getCachedGigs } = await import("@/lib/kopano-vault");

    const sampleGig = { _id: "gig-999", title: "Handyman needed", payDisplay: "R200" };
    await cacheGig(sampleGig);

    const cached = await getCachedGigs();
    expect(cached.some((g) => g._id === "gig-999")).toBe(true);
  });

  it("reports vault health status", async () => {
    const { vaultHealthCheck } = await import("@/lib/kopano-vault");

    const health = await vaultHealthCheck();
    expect(health.ok).toBe(true);
    expect(health.stores.length).toBeGreaterThanOrEqual(5);
    expect(typeof health.infraCount).toBe("number");
    expect(typeof health.unsyncedFeedback).toBe("number");
  });
});
