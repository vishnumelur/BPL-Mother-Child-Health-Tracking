import { Sparkles } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { PalakkadMap } from "@/components/palakkad-map";
import { LiveAlertsPanel } from "@/components/live-alerts-panel";
import { SchemeComplianceChart } from "@/components/scheme-compliance-chart";
import {
  getOverviewKpis,
  getLiveAlerts,
  getSchemeCompliance,
  getBlockRiskCounts,
} from "@/lib/queries/admin-overview";

export default async function AdminOverview() {
  const [kpis, alerts, schemes, blocks] = await Promise.all([
    getOverviewKpis(),
    getLiveAlerts(),
    getSchemeCompliance(),
    getBlockRiskCounts(),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary-50)] text-[11px] font-medium text-[var(--primary)]">
            <span className="size-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            Live
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">
            Palakkad District · auto-refreshes every 8 seconds
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[11px] text-[var(--fg-muted)]">
          <Sparkles className="size-3 text-[var(--primary)]" />
          <span>61 mothers tracked in pilot</span>
        </div>
      </header>

      {/* KPI grid — one primary, rest default */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Mothers tracked" value={kpis.mothersTracked} variant="primary" />
        <KpiCard label="High-risk pregnancies" value={kpis.highRiskPregnancies} />
        <KpiCard
          label="Active SOS today"
          value={kpis.activeSosToday}
          tone={kpis.activeSosToday > 0 ? "alert" : "default"}
        />
        <KpiCard
          label="Immunisation compliance"
          value={kpis.immunizationCompliance}
          suffix="%"
        />
      </div>

      {/* Map + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 min-w-0">
          <PalakkadMap data={blocks} />
        </div>
        <div className="min-w-0">
          <LiveAlertsPanel
            alerts={alerts.map((a) => ({
              id: a.id,
              type: a.type,
              status: a.status,
              raisedAt: a.raisedAt,
              note: a.note,
              channels: a.channels,
            }))}
          />
        </div>
      </div>

      {/* Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SchemeComplianceChart data={schemes} />
      </div>
    </div>
  );
}
