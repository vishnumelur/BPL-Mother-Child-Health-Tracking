import { notFound } from "next/navigation";
import { parseBeneficiaryRouteId, loadChild } from "@/lib/queries/beneficiary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markVaccineGiven } from "@/actions/immunization";
import { format } from "date-fns";
import { Check, Clock, AlertCircle } from "lucide-react";

export default async function ImmunizationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = parseBeneficiaryRouteId(id);
  if (!p || p.type !== "child") notFound();
  const child = await loadChild(p.id);
  if (!child) notFound();

  const sorted = [...child.immunizations].sort((a, b) =>
    a.scheduledDate.localeCompare(b.scheduledDate),
  );

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-semibold">Immunisations</h1>
      <p className="text-xs text-[var(--fg-muted)]">
        WHO/UIP schedule · 0–24 months
      </p>
      <div className="space-y-2">
        {sorted.map((imm) => (
          <Card key={imm.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{imm.vaccineCode}</div>
              <div className="text-xs text-[var(--fg-muted)]">
                Scheduled: {format(new Date(imm.scheduledDate), "d MMM yyyy")}
                {imm.givenDate && ` · Given: ${format(new Date(imm.givenDate), "d MMM yyyy")}`}
              </div>
            </div>
            {imm.status === "GIVEN" && (
              <Check className="size-5 text-[var(--risk-normal)]" />
            )}
            {imm.status === "DUE" && (
              <form action={markVaccineGiven.bind(null, imm.id, child.id)}>
                <Button size="sm">Mark given</Button>
              </form>
            )}
            {imm.status === "UPCOMING" && (
              <Clock className="size-5 text-[var(--fg-muted)]" />
            )}
            {imm.status === "MISSED" && (
              <AlertCircle className="size-5 text-[var(--risk-critical)]" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
