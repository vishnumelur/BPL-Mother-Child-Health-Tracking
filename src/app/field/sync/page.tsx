import { Card } from "@/components/ui/card";

export default function SyncPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Sync status</h1>
      <Card className="p-4 space-y-2">
        <p className="text-sm">All visits are up to date.</p>
        <p className="text-xs text-[var(--fg-muted)]">
          Offline queue: 0 items pending
        </p>
      </Card>
      <Card className="p-4 space-y-1 text-xs text-[var(--fg-muted)]">
        <p>This screen will show queued offline entries during the demo.</p>
        <p>Offline mode is toggled from the narrator panel (Ctrl+Shift+D).</p>
      </Card>
    </div>
  );
}
