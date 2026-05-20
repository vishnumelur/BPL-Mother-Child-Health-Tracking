import { Sparkles, TrendingUp } from "lucide-react";
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
      {/* Header */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary-50)] text-[11px] font-semibold text-[var(--primary)]">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 size-1.5 rounded-full bg-[var(--primary)] animate-ping opacity-70" />
              <span className="relative size-1.5 rounded-full bg-[var(--primary)]" />
            </span>
            Live
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">
            Palakkad District · auto-refreshes every 8 seconds
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[11px] text-[var(--fg-muted)] rounded-full border border-[var(--border)] bg-white px-3 py-1.5 shadow-card">
          <Sparkles className="size-3 text-[var(--primary)]" />
          <span>{kpis.mothersTracked} mothers tracked in pilot</span>
        </div>
      </header>

      {/* KPI grid — first card is primary gradient; rest are default */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Mothers tracked" value={kpis.mothersTracked} variant="primary" />
        <div className="relative">
          <KpiCard label="High-risk pregnancies" value={kpis.highRiskPregnancies} />
          <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-0.5 text-[10px] font-mono-num font-semibold text-[var(--primary)] bg-[var(--primary-50)] px-1.5 py-0.5 rounded-full">
            <TrendingUp className="size-2.5" />
            +4%
          </span>
        </div>
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
      <div className="grid grid-cols-1">
        <SchemeComplianceChart data={schemes} />
      </div>
    </div>
  );
}
