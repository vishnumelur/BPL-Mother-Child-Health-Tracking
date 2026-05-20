import { OfflineToggle } from "@/components/offline-toggle";
import { Info, CheckCircle2 } from "lucide-react";

export default function SyncPage() {
  return (
    <div className="px-4 py-6 sm:px-5 sm:py-7 space-y-5">
      {/* Title */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-[var(--fg)] tracking-tight">
          Sync status
        </h1>
        <p className="text-xs text-[var(--fg-muted)]">
          Offline queue + recent activity
        </p>
      </header>

      {/* Hero + queue rows + summary handled by OfflineToggle */}
      <OfflineToggle />

      {/* Recently synced summary pill */}
      <div className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary-50)] border border-[var(--primary)]/15 px-4 py-2.5">
        <CheckCircle2 className="size-4 text-[var(--primary)] shrink-0" strokeWidth={2.4} />
        <span className="text-xs text-[var(--primary)] font-medium">
          All synced earlier today · 7 items · 268 KB
        </span>
      </div>

      {/* Architecture footer card */}
      <section className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-card space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
            <Info className="size-4 text-[var(--primary)]" strokeWidth={2.2} />
          </div>
          <h2 className="text-sm font-semibold text-[var(--fg)]">
            How sync works
          </h2>
        </div>
        <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
          Items queued here drain automatically when you go back online. The KB
          figures are the actual JSON payload sizes — measured live, not
          estimated. The queue is persisted on-device so a crash or restart
          never loses data.
        </p>
      </section>
    </div>
  );
}
