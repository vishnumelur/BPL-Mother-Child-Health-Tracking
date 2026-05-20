import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[var(--surface)]">
      <div className="w-full max-w-md sm:max-w-lg space-y-10">
        <div className="space-y-4">
          <div className="size-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center">
            <ShieldCheck className="size-6 text-white" strokeWidth={2.2} />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] sm:text-xs text-[var(--fg-muted)] uppercase tracking-[0.12em] font-medium">
              Government of Kerala · Health Department
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--fg)] tracking-tight leading-tight">
              BPL Mother &amp; Child Health Tracker
            </h1>
            <p className="text-sm sm:text-base text-[var(--fg-muted)] max-w-md">
              Last-mile MCH monitoring for the National Health Mission ·
              Attappadi pilot
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/field"
            className="group flex items-center justify-between w-full rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-5 py-4 transition-colors"
          >
            <div className="text-left">
              <div className="text-sm font-semibold">ASHA mobile view</div>
              <div className="text-xs opacity-80">Field worker app · /field</div>
            </div>
            <ArrowRight className="size-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin"
            className="group flex items-center justify-between w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 hover:bg-[var(--surface-alt)] text-[var(--fg)] px-5 py-4 transition-all"
          >
            <div className="text-left">
              <div className="text-sm font-semibold">District dashboard</div>
              <div className="text-xs text-[var(--fg-muted)]">
                Admin view · /admin
              </div>
            </div>
            <ArrowRight className="size-5 text-[var(--fg-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        <p className="text-[11px] text-[var(--fg-subtle)] pt-2 border-t border-[var(--border)]">
          Demonstration only · no real patient information ·{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] text-[10px] font-mono-num">
            Ctrl+Shift+D
          </kbd>{" "}
          for narrator panel
        </p>
      </div>
    </main>
  );
}
