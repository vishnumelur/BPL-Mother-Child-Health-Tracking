import { db } from "@/db";
import { SosModal } from "@/components/sos-modal";

export default async function SosPage() {
  const mothers = await db.query.mothers.findMany({
    columns: { id: true, name: true },
    limit: 20,
  });
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Emergency</h1>
      <SosModal mothers={mothers} />
    </div>
  );
}
