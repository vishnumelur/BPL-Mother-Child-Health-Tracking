"use client";
import { useOfflineQueue } from "@/hooks/use-offline-queue";
import { runActionByName } from "@/lib/run-action-by-name";
import { Wifi, WifiOff } from "lucide-react";

export function SyncStatusBadge() {
  const { queue, isOnline } = useOfflineQueue(runActionByName);
  const pending = queue.filter((q) => q.status === "PENDING").length;
  if (isOnline && pending === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--primary)] font-medium bg-[var(--primary-50)] px-2.5 py-1 rounded-full">
        <Wifi className="size-3" strokeWidth={2.4} />
        Synced
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--risk-high)] font-medium bg-[var(--risk-high)]/10 px-2.5 py-1 rounded-full">
      <WifiOff className="size-3" strokeWidth={2.4} />
      {pending} queued
    </span>
  );
}
