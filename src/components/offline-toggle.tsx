"use client";
import { motion } from "motion/react";
import { Wifi, WifiOff, Loader2, Clock } from "lucide-react";
import { useOfflineQueue } from "@/hooks/use-offline-queue";
import { runActionByName } from "@/lib/run-action-by-name";

export function OfflineToggle() {
  const { queue, forcedOffline, setForced, isOnline } =
    useOfflineQueue(runActionByName);
  const pending = queue.filter((q) => q.status === "PENDING").length;
  const syncing = queue.filter((q) => q.status === "SYNCING").length;
  const totalQueued = pending + syncing;
  const totalKb = queue
    .filter((q) => q.status === "PENDING" || q.status === "SYNCING")
    .reduce((sum, q) => sum + (q.payloadKb ?? 0), 0);

  function toggle() {
    const next = !forcedOffline;
    document.cookie = `mch_offline=${next ? 1 : 0}; path=/; max-age=86400`;
    setForced(next);
  }

  return (
    <div className="space-y-4">
      {/* Gradient hero card with frosted icon tile + CTA */}
      <section
        className="relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white shadow-primary-sm"
        style={{
          background: isOnline
            ? "var(--gradient-primary)"
            : "linear-gradient(135deg, #4A5568 0%, #2D3748 50%, #1A202C 100%)",
        }}
      >
        <div
          className="absolute -right-8 -top-8 size-32 rounded-full bg-white/15 blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30 shrink-0">
              {isOnline ? (
                <Wifi className="size-5 text-white" strokeWidth={2.2} />
              ) : (
                <WifiOff className="size-5 text-white" strokeWidth={2.2} />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold leading-tight">
                {isOnline ? "Online · live" : "Offline · queueing"}
              </div>
              <div className="text-[11px] opacity-85 mt-0.5">
                {totalQueued > 0
                  ? `${totalQueued} items pending · ${totalKb} KB total`
                  : "Queue is clear"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-xs font-medium text-white hover:bg-white/25 transition-colors"
          >
            {forcedOffline ? "Go online" : "Simulate offline"}
          </button>
        </div>
      </section>

      {/* Pending queue rows */}
      {totalQueued > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2.5"
        >
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-[var(--fg)]">
              Pending sync
            </h2>
            <span className="text-[11px] text-[var(--fg-muted)] font-mono-num">
              {totalQueued} items
            </span>
          </div>
          <ul className="space-y-2">
            {queue
              .filter((q) => q.status === "PENDING" || q.status === "SYNCING")
              .map((q) => {
                const isSyncing = q.status === "SYNCING";
                return (
                  <li
                    key={q.id}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--border)] bg-white shadow-card"
                  >
                    <div className="size-9 rounded-xl bg-[var(--primary-50)] flex items-center justify-center shrink-0">
                      {isSyncing ? (
                        <Loader2 className="size-4 text-[var(--primary)] animate-spin" />
                      ) : (
                        <Clock className="size-4 text-[var(--fg-muted)]" strokeWidth={2.2} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[var(--fg)] truncate">
                        {q.actionName}
                      </div>
                      <div className="text-[11px] text-[var(--fg-muted)] font-mono-num">
                        {q.payloadKb} KB · {q.status.toLowerCase()}
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </motion.section>
      )}
    </div>
  );
}
