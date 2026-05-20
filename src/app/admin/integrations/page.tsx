import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const INTEGRATIONS = [
  {
    name: "ABHA / Ayushman Bharat Health Account",
    code: "ABHA",
    status: "Connected (sandbox)",
    description:
      "14-digit ABHA ID provisioning, consent-based health record sharing. Current build uses 12-digit alignment.",
  },
  {
    name: "HMIS — Health Management Information System",
    code: "HMIS",
    status: "Mapped",
    description:
      "Monthly aggregate reports auto-pushed to HMIS portal. Maternal and child health KPIs aligned with NHM dashboard schema.",
  },
  {
    name: "ICDS-CAS",
    code: "ICDS",
    status: "Linked",
    description:
      "Anganwadi-level growth records and nutrition data exchanged. SAM/MAM cases visible to AWWs and CDPOs.",
  },
  {
    name: "e-Sanjeevani",
    code: "ES",
    status: "Linked",
    description:
      "MO referrals to specialist tele-consultation. CRITICAL ANC cases auto-eligible for tele-OPD slot booking.",
  },
];

export default function AdminIntegrations() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">Integrations</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Connection status with national health systems
        </p>
      </header>
      <div className="grid grid-cols-2 gap-4">
        {INTEGRATIONS.map((i) => (
          <Card key={i.code} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{i.name}</h3>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--risk-normal)]/10 text-[var(--risk-normal)]">
                <Check className="size-3" /> {i.status}
              </span>
            </div>
            <p className="text-sm text-[var(--fg-muted)]">{i.description}</p>
          </Card>
        ))}
      </div>
      <Card className="p-4 text-xs text-[var(--fg-muted)]">
        Note: this demo simulates each integration&apos;s status. Production builds
        will use the official sandbox endpoints with NHA / NHSRC accreditation.
      </Card>
    </div>
  );
}
