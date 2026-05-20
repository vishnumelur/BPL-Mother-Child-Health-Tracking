import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-[var(--fg-muted)] uppercase tracking-widest">
          Government of Kerala · Health &amp; Family Welfare Dept
        </p>
        <h1 className="text-3xl font-semibold text-[var(--primary)]">
          BPL Mother &amp; Child Health Tracker
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Demonstration — no real patient information
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/field"
          className="px-6 py-3 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90"
        >
          ASHA mobile view (/field)
        </Link>
        <Link
          href="/admin"
          className="px-6 py-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] font-medium hover:bg-[var(--primary-50)]"
        >
          District dashboard (/admin)
        </Link>
      </div>
    </main>
  );
}
