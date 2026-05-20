import { AdminTopBar } from "@/components/admin-top-bar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminPoller } from "@/components/admin-poller";
import { format } from "date-fns";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      <AdminTopBar today={format(new Date(), "d MMM yyyy")} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <AdminPoller intervalMs={8000} />
      <footer className="border-t bg-[var(--card)] px-6 py-3 text-xs text-[var(--fg-muted)] flex items-center justify-between">
        <span>Built for the National Health Mission · ABHA-aligned · HMIS-ready</span>
        <span>Demonstration data — no real patient information</span>
      </footer>
    </div>
  );
}
