import { db } from "@/db";
import { referrals } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default async function AdminReferrals() {
  const counts = await db
    .select({
      from: referrals.tierFrom,
      to: referrals.tierTo,
      n: sql<number>`count(*)::int`,
    })
    .from(referrals)
    .groupBy(referrals.tierFrom, referrals.tierTo);

  const recent = await db.query.referrals.findMany({
    orderBy: desc(referrals.createdAt),
    limit: 20,
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">Referrals</h1>
        <p className="text-sm text-[var(--fg-muted)]">Tier escalation flow</p>
      </header>
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2">
          {["SC", "PHC", "CHC", "DH"].map((tier, i, arr) => {
            const incoming = counts
              .filter((c) => c.to === tier)
              .reduce((s, c) => s + c.n, 0);
            return (
              <div key={tier} className="flex items-center">
                <div className="text-center">
                  <div className="size-20 rounded-full bg-[var(--primary-50)] flex items-center justify-center text-2xl font-semibold text-[var(--primary)]">
                    {incoming}
                  </div>
                  <p className="text-xs mt-2 font-medium">{tier}</p>
                </div>
                {i < arr.length - 1 && <ArrowRight className="size-6 text-[var(--fg-muted)] mx-2" />}
              </div>
            );
          })}
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3">From → To</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Reason</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-3">
                  {r.tierFrom} → {r.tierTo}
                </td>
                <td className="p-3 text-xs text-[var(--fg-muted)]">
                  {r.subjectType} #{r.subjectId}
                </td>
                <td className="p-3 text-xs">{r.reason}</td>
                <td className="p-3 text-xs">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
