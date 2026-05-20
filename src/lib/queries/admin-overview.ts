import { db } from "@/db";
import {
  mothers,
  children,
  alerts,
  ancVisits,
  immunizations,
  referrals,
  schemeEnrollments,
} from "@/db/schema";
import { eq, sql, desc, and, gte } from "drizzle-orm";

export async function getOverviewKpis() {
  const [mothersCount] = await db.select({ n: sql<number>`count(*)::int` }).from(mothers);
  const [highRisk] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(ancVisits)
    .where(sql`${ancVisits.riskLevel} IN ('HIGH', 'CRITICAL')`);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const [activeSos] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(alerts)
    .where(and(eq(alerts.type, "SOS"), gte(alerts.raisedAt, todayStart)));
  const [immStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      given: sql<number>`count(*) filter (where status='GIVEN')::int`,
    })
    .from(immunizations);
  const immComp =
    immStats.total > 0 ? Math.round((immStats.given / immStats.total) * 100) : 0;
  return {
    mothersTracked: mothersCount.n,
    highRiskPregnancies: highRisk.n,
    activeSosToday: activeSos.n,
    immunizationCompliance: immComp,
  };
}

export async function getLiveAlerts() {
  return db.query.alerts.findMany({
    orderBy: desc(alerts.raisedAt),
    limit: 8,
  });
}

export async function getSchemeCompliance() {
  const rows = await db
    .select({
      code: schemeEnrollments.schemeCode,
      total: sql<number>`count(*)::int`,
      disbursed: sql<number>`count(*) filter (where status='DISBURSED')::int`,
    })
    .from(schemeEnrollments)
    .groupBy(schemeEnrollments.schemeCode);
  return rows.map((r) => ({
    code: r.code,
    percent: r.total > 0 ? Math.round((r.disbursed / r.total) * 100) : 0,
  }));
}

export async function getBlockRiskCounts() {
  // Aggregate by block — simplified for demo
  const rows = await db.execute(sql`
    select f.block, count(*) filter (where av.risk_level='CRITICAL')::int as critical,
           count(*) filter (where av.risk_level='HIGH')::int as high,
           count(*) filter (where av.risk_level='NORMAL')::int as normal
    from families f
    left join mothers m on m.family_id = f.id
    left join lateral (
      select risk_level from anc_visits
      where mother_id = m.id order by visit_date desc limit 1
    ) av on true
    group by f.block
  `);
  return rows as unknown as Array<{
    block: string;
    critical: number;
    high: number;
    normal: number;
  }>;
}
