import { db } from "@/db";
import { SosModal } from "@/components/sos-modal";

export default async function SosPage() {
  const mothers = await db.query.mothers.findMany({
    columns: { id: true, name: true },
    limit: 20,
  });
  return (
    <div className="px-4 py-6 sm:px-5 sm:py-7 space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
          Emergency
        </h1>
        <p className="text-xs text-[var(--fg-muted)]">
          One-tap SOS · multi-channel dispatch
        </p>
      </header>
      <SosModal mothers={mothers} />
    </div>
  );
}
