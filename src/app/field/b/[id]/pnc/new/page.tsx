import { notFound } from "next/navigation";
import { parseBeneficiaryRouteId } from "@/lib/queries/beneficiary";
import { PncForm } from "@/components/pnc-form";

export default async function NewPncPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = parseBeneficiaryRouteId(id);
  if (!p || p.type !== "mother") notFound();
  return <PncForm motherId={p.id} />;
}
