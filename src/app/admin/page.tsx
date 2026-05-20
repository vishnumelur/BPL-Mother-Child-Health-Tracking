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
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">
          Overview · Palakkad District
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Live monitoring · auto-refreshes every 8 seconds
        </p>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Mothers tracked" value={kpis.mothersTracked} />
        <KpiCard label="High-risk pregnancies" value={kpis.highRiskPregnancies} />
        <KpiCard label="Active SOS today" value={kpis.activeSosToday} tone={kpis.activeSosToday > 0 ? "alert" : "default"} />
        <KpiCard label="Immunisation compliance" value={kpis.immunizationCompliance} suffix="%" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <PalakkadMap data={blocks} />
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <SchemeComplianceChart data={schemes} />
      </div>
    </div>
  );
}
