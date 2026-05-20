"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import { useOfflineQueue } from "@/hooks/use-offline-queue";
import { runActionByName } from "@/lib/run-action-by-name";

export function OfflineToggle() {
  const { queue, forcedOffline, setForced, isOnline } = useOfflineQueue(runActionByName);
  const pending = queue.filter((q) => q.status === "PENDING").length;
  const syncing = queue.filter((q) => q.status === "SYNCING").length;

  function toggle() {
    const next = !forcedOffline;
    document.cookie = `mch_offline=${next ? 1 : 0}; path=/; max-age=86400`;
    setForced(next);
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="size-4 text-[var(--risk-normal)]" />
          ) : (
            <WifiOff className="size-4 text-[var(--risk-high)]" />
          )}
          <span className="font-medium text-sm">
            {isOnline ? "Online" : "Offline — queueing"}
          </span>
        </div>
        <Button size="sm" variant="outline" onClick={toggle}>
          {forcedOffline ? "Go online" : "Simulate offline"}
        </Button>
      </div>
      {(pending > 0 || syncing > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs"
        >
          <p className="text-[var(--fg-muted)]">
            {syncing > 0
              ? `Syncing ${syncing} of ${pending + syncing}…`
              : `${pending} item${pending !== 1 ? "s" : ""} queued`}
          </p>
          <ul className="mt-2 space-y-1">
            {queue.map((q) => (
              <li
                key={q.id}
                className="flex items-center justify-between text-xs py-1 border-t"
              >
                <span>{q.actionName}</span>
                <span className="font-mono-num text-[var(--fg-muted)]">
                  {q.payloadKb} KB · {q.status.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </Card>
  );
}
