import { notFound } from "next/navigation";
import { parseBeneficiaryRouteId } from "@/lib/queries/beneficiary";
import { GrowthForm } from "@/components/growth-form";

export default async function NewGrowthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = parseBeneficiaryRouteId(id);
  if (!p || p.type !== "child") notFound();
  return <GrowthForm childId={p.id} />;
}
