import Link from "next/link";
import { Check, ChevronRight, ArrowRight, Fingerprint, BarChart3, Baby, Video } from "lucide-react";

const INTEGRATIONS = [
  {
    monogram: "AB",
    icon: Fingerprint,
    name: "Ayushman Bharat Health Account",
    code: "ABHA",
    status: "Connected (sandbox)",
    description:
      "Provisioning of 14-digit ABHA IDs and consent-based health record sharing across the ABDM network. Current build uses 12-digit alignment.",
    meta: "ABDM onboarding · maternal beneficiaries",
  },
  {
    monogram: "HM",
    icon: BarChart3,
    name: "Health Management Information System",
    code: "HMIS",
    status: "Mapped",
    description:
      "Automated monthly aggregate reporting to the NHM dashboard, covering ANC, PNC, immunisation and high-risk KPIs aligned with the national schema.",
    meta: "Next sync · tomorrow, 04:00 AM",
  },
  {
    monogram: "IC",
    icon: Baby,
    name: "Integrated Child Development Services",
    code: "ICDS-CAS",
    status: "Linked",
    description:
      "Bi-directional sync of Anganwadi-level growth records and nutrition data. SAM/MAM cases visible to AWWs and CDPOs in real time.",
    meta: "LIVE FEED · Poshan Abhiyaan",
  },
  {
    monogram: "eS",
    icon: Video,
    name: "e-Sanjeevani · National Tele-consultation",
    code: "eSANJEEVANI",
    status: "Linked",
    description:
      "MO referrals to specialist tele-OPD. CRITICAL ANC cases auto-eligible for slot booking; appointment confirmations relayed to ASHA.",
    meta: "84 referrals this week",
  },
];

export default function AdminIntegrations() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)]"
      >
        <Link href="/admin" className="hover:text-[var(--fg)]">
          Admin
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-[var(--fg)] font-medium">Integrations</span>
      </nav>

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          Integrations
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Connection status with national health systems · all four active in sandbox.
        </p>
      </header>

      {/* Tile grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {INTEGRATIONS.map((i) => {
          const Icon = i.icon;
          return (
            <article
              key={i.code}
              className="group relative rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 shadow-card hover:shadow-elevated transition-shadow flex flex-col"
            >
              {/* Top: monogram + name/code + status chip */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className="size-12 rounded-2xl flex items-center justify-center text-white shadow-primary-sm shrink-0"
                    style={{ background: "var(--gradient-primary)" }}
                    aria-hidden
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="font-semibold text-[var(--fg)] tracking-tight text-base sm:text-[15px] leading-snug">
                      {i.name}
                    </h3>
                    <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)] font-medium font-mono-num">
                      {i.code}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary)] font-semibold border border-[var(--primary)]/15">
                  <Check className="size-3 stroke-[2.5]" />
                  {i.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--fg-muted)] mt-4 leading-relaxed">
                {i.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-[var(--border)]">
                <span className="text-[11px] text-[var(--fg-subtle)] font-medium">
                  {i.meta}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:gap-1.5 transition-all"
                >
                  View configuration
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Disclosure banner */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4 sm:p-5 text-xs text-[var(--fg-muted)] leading-relaxed">
        <span className="font-semibold text-[var(--fg)]">Note · </span>
        this demo simulates each integration&apos;s status. Production builds
        will use the official sandbox endpoints with NHA / NHSRC accreditation.
      </div>
    </div>
  );
}
