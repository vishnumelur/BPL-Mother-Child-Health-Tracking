"use client";
import { useEffect, useState, useCallback } from "react";
import { readQueue, type QueueItem, markStatus, clearSynced } from "@/lib/offline-queue";

type ActionRunner = (actionName: string, args: unknown) => Promise<unknown>;

export function useOfflineQueue(runActionByName: ActionRunner) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isOnline, setOnline] = useState(true);
  const [forcedOffline, setForced] = useState(false);

  useEffect(() => {
    setQueue(readQueue());
    const cookie = document.cookie.split("; ").find((c) => c.startsWith("mch_offline="));
    if (cookie?.endsWith("=1")) setForced(true);

    const updateOnline = () => setOnline(navigator.onLine);
    updateOnline();
    const refresh = () => setQueue(readQueue());
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    window.addEventListener("offline-queue-changed", refresh);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      window.removeEventListener("offline-queue-changed", refresh);
    };
  }, []);

  const effectiveOnline = isOnline && !forcedOffline;

  const drain = useCallback(async () => {
    const pending = readQueue().filter((q) => q.status === "PENDING");
    for (const item of pending) {
      markStatus(item.id, "SYNCING");
      try {
        await runActionByName(item.actionName, item.args);
        markStatus(item.id, "SYNCED");
      } catch {
        markStatus(item.id, "FAILED");
      }
    }
    setTimeout(() => clearSynced(), 1500);
  }, [runActionByName]);

  useEffect(() => {
    if (effectiveOnline && queue.some((q) => q.status === "PENDING")) {
      drain();
    }
  }, [effectiveOnline, queue, drain]);

  return { queue, isOnline: effectiveOnline, forcedOffline, setForced };
}
