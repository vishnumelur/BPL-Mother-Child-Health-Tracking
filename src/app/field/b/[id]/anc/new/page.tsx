import { notFound } from "next/navigation";
import { parseBeneficiaryRouteId } from "@/lib/queries/beneficiary";
import { AncForm } from "@/components/anc-form";

export default async function NewAncPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsed = parseBeneficiaryRouteId(id);
  if (!parsed || parsed.type !== "mother") notFound();
  return <AncForm motherId={parsed.id} />;
}
