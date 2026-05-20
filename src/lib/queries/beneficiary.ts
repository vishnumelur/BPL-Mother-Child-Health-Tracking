// src/lib/queries/beneficiary.ts
import { db } from "@/db";
import { mothers, children } from "@/db/schema";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

export function parseBeneficiaryRouteId(routeId: string): {
  type: "mother" | "child";
  id: number;
} | null {
  const m = /^([mc])-(\d+)$/.exec(routeId);
  if (!m) return null;
  return { type: m[1] === "m" ? "mother" : "child", id: parseInt(m[2]!, 10) };
}

export async function loadMother(id: number) {
  return db.query.mothers.findFirst({
    where: eq(mothers.id, id),
    with: {
      family: { with: { asha: true } },
      ancVisits: { orderBy: (v, { desc }) => desc(v.visitDate) },
      pncVisits: { orderBy: (v, { desc }) => desc(v.visitDate) },
    },
  });
}

export async function loadChild(id: number) {
  return db.query.children.findFirst({
    where: eq(children.id, id),
    with: {
      family: true,
      mother: true,
      growthRecords: { orderBy: (g, { desc }) => desc(g.recordedAt) },
      immunizations: true,
      milestones: true,
    },
  });
}
