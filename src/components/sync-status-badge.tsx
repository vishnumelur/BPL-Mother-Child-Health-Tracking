"use client";
import { useOfflineQueue } from "@/hooks/use-offline-queue";
import { runActionByName } from "@/lib/run-action-by-name";
import { Wifi, WifiOff } from "lucide-react";

export function SyncStatusBadge() {
  const { queue, isOnline } = useOfflineQueue(runActionByName);
  const pending = queue.filter((q) => q.status === "PENDING").length;
  if (isOnline && pending === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[var(--risk-normal)]">
        <Wifi className="size-3" /> Synced
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[var(--risk-high)]">
      <WifiOff className="size-3" /> {pending} queued
    </span>
  );
}
