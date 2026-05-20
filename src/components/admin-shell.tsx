"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopBar } from "./admin-top-bar";
import { AdminPoller } from "./admin-poller";

export function AdminShell({
  today,
  children,
}: {
  today: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      <AdminTopBar today={today} onMenuClick={() => setOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block border-r border-[var(--border)] bg-[var(--surface)]">
          <AdminSidebar />
        </aside>

        {/* Mobile drawer */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0 w-[260px]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="h-14 border-b border-[var(--border)] flex items-center px-4">
              <span className="text-sm font-semibold text-[var(--primary)]">
                Kerala MCH Tracker
              </span>
            </div>
            <AdminSidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <AdminPoller intervalMs={8000} />

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 py-3 text-[11px] sm:text-xs text-[var(--fg-muted)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
        <span>
          Built for the National Health Mission · ABHA-aligned · HMIS-ready
        </span>
        <span>Demonstration data — no real patient information</span>
      </footer>
    </div>
  );
}
