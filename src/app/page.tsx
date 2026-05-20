import Link from "next/link";
import { ArrowRight, Sparkles, Activity, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[var(--surface)]">
      {/* Ambient mesh backdrop */}
      <div
        className="absolute inset-0 bg-gradient-mesh pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 size-[600px] sm:size-[900px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--gradient-primary)" }}
        aria-hidden
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-28 space-y-12 sm:space-y-16">
        {/* Hero */}
        <section className="space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-[var(--border)] text-[11px] font-medium text-[var(--fg-muted)] shadow-card">
            <Sparkles className="size-3 text-[var(--primary)]" strokeWidth={2.4} />
            <span>Demonstration · NHM</span>
          </div>

          <div className="space-y-5 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--fg)] tracking-tight leading-[1.05]">
              Last-mile mother &amp; child health,{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                tracked end-to-end.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--fg-muted)] max-w-2xl leading-relaxed">
              A purpose-built tracking and decision-support platform for BPL
              populations · Kerala, Attappadi pilot. Offline-first, vernacular,
              ABHA-aligned.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              href="/field"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-white text-sm font-semibold shadow-primary hover:shadow-elevated transition-all active:scale-[0.98]"
              style={{ background: "var(--gradient-primary)" }}
            >
              Open ASHA app
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/admin"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-[var(--border)] text-[var(--fg)] text-sm font-semibold hover:border-[var(--primary)]/40 hover:shadow-card transition-all active:scale-[0.98]"
            >
              District dashboard
              <ArrowRight className="size-4 text-[var(--fg-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card space-y-3">
            <div
              className="size-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Users className="size-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-2xl font-semibold font-mono-num text-[var(--fg)] tracking-tight">
                61
              </div>
              <div className="text-xs text-[var(--fg-muted)]">
                mothers tracked in pilot
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card space-y-3">
            <div className="size-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
              <Activity className="size-5 text-[var(--primary)]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-2xl font-semibold font-mono-num text-[var(--fg)] tracking-tight">
                &lt;50 KB
              </div>
              <div className="text-xs text-[var(--fg-muted)]">
                per visit · 2G ready
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card space-y-3">
            <div className="size-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
              <Sparkles className="size-5 text-[var(--primary)]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-2xl font-semibold text-[var(--fg)] tracking-tight">
                ABHA &amp; HMIS
              </div>
              <div className="text-xs text-[var(--fg-muted)]">
                integration-ready
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[var(--fg-subtle)] border-t border-[var(--border)] pt-6">
          <span>Demonstration data · no real patient information</span>
          <span>
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] text-[10px] font-mono-num bg-white">
              Ctrl+Shift+D
            </kbd>{" "}
            for narrator
          </span>
        </footer>
      </div>
    </main>
  );
}
