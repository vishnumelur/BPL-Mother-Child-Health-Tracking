import { OfflineToggle } from "@/components/offline-toggle";

export default function SyncPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Sync status</h1>
      <OfflineToggle />
      <p className="text-xs text-[var(--fg-muted)]">
        Items queued here drain automatically when you go back online. The KB
        figures are the actual JSON payload sizes — measured live, not estimated.
      </p>
    </div>
  );
}
