/**
 * lib/sync-worker.ts
 * ───────────────────────────────────────────────────────────
 * Offline Queue & Feedback Synchronization Worker
 *
 * KC Apprenticeship Phase 3, Task 25
 * Governance: Commandment 9 (Offline-First Mandate)
 *             Identic AI Flows Doctrine
 *
 * Drains the outbound sync queue and pushes unsynced
 * feedback deltas whenever network connectivity is restored.
 * ───────────────────────────────────────────────────────────
 */

import {
  drainSyncQueue,
  removeSyncItem,
  getUnsyncedFeedback,
  markFeedbackSynced,
  type SyncQueueItem,
  type FeedbackDelta,
} from "./kopano-vault";
import { trackVaultSync } from "./analytics";

export interface SyncReport {
  processedQueueItems: number;
  failedQueueItems: number;
  syncedFeedbackCount: number;
  timestamp: number;
}

let isSyncing = false;

/**
 * Execute an individual queued operation against the remote API.
 */
async function executeQueueItem(item: SyncQueueItem): Promise<boolean> {
  try {
    const res = await fetch(item.endpoint, {
      method: item.operation,
      headers: {
        "Content-Type": "application/json",
        "X-Kopano-Sync-Id": item.id,
      },
      body: item.payload,
    });

    // 2xx success -> item completed
    if (res.ok) {
      await removeSyncItem(item.id);
      return true;
    }

    // 4xx client errors (e.g. 400, 404, 422) will not succeed on retry -> drop
    if (res.status >= 400 && res.status < 500) {
      console.warn(`[SyncWorker] Dropping invalid queue item ${item.id}: status ${res.status}`);
      await removeSyncItem(item.id);
      return false;
    }

    // 5xx server error -> retry later
    return false;
  } catch {
    // Network failure -> leave in queue for next sync cycle
    return false;
  }
}

/**
 * Push unsynced feedback deltas to the remote server.
 */
async function syncFeedback(deltas: FeedbackDelta[]): Promise<number> {
  if (deltas.length === 0) return 0;

  let syncedCount = 0;
  for (const delta of deltas) {
    try {
      // In KasiLink, feedback is sent to the feedback or applications review API
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId: delta.gigId,
          feedback: delta.feedback,
          language: delta.language,
          declineReason: delta.declineReason,
          moralAffirmation: delta.moralAffirmation,
        }),
      });

      if (res.ok || res.status === 404) {
        // If 404 endpoint not yet active or 200, mark locally as synced
        await markFeedbackSynced(delta.id);
        syncedCount++;
      }
    } catch {
      // Network drop, keep for next round
      break;
    }
  }

  return syncedCount;
}

/**
 * Drain the sync queue and flush pending feedback.
 */
export async function drainPendingSync(): Promise<SyncReport> {
  if (isSyncing) {
    return {
      processedQueueItems: 0,
      failedQueueItems: 0,
      syncedFeedbackCount: 0,
      timestamp: Date.now(),
    };
  }

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      processedQueueItems: 0,
      failedQueueItems: 0,
      syncedFeedbackCount: 0,
      timestamp: Date.now(),
    };
  }

  isSyncing = true;
  let processed = 0;
  let failed = 0;

  try {
    const queue = await drainSyncQueue();
    for (const item of queue) {
      const success = await executeQueueItem(item);
      if (success) {
        processed++;
      } else {
        failed++;
      }
    }

    const unsyncedDeltas = await getUnsyncedFeedback();
    const syncedFeedback = await syncFeedback(unsyncedDeltas);

    const totalSynced = processed + syncedFeedback;
    if (totalSynced > 0) {
      trackVaultSync(totalSynced);
    }

    return {
      processedQueueItems: processed,
      failedQueueItems: failed,
      syncedFeedbackCount: syncedFeedback,
      timestamp: Date.now(),
    };
  } finally {
    isSyncing = false;
  }
}

/**
 * Initialize auto-sync listener on window 'online' event.
 */
export function initSyncWorker(): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleOnline = () => {
    drainPendingSync().catch((err) => {
      console.warn("[SyncWorker] Error during automatic drain on reconnect:", err);
    });
  };

  window.addEventListener("online", handleOnline);

  // Attempt initial drain if online
  if (navigator.onLine) {
    setTimeout(() => {
      drainPendingSync().catch(() => {});
    }, 1500);
  }

  return () => {
    window.removeEventListener("online", handleOnline);
  };
}
