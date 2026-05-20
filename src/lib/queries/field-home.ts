// src/lib/queries/field-home.ts
import { db } from "@/db";
import { mothers, children, ancVisits, reminders } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function getFieldHomeData(workerId: number) {
  // Mothers and children assigned via family → asha
  const assignedMothers = await db.query.mothers.findMany({
    with: {
      family: { with: { asha: true } },
      ancVisits: { orderBy: desc(ancVisits.visitDate), limit: 1 },
    },
  });
  const assignedChildren = await db.query.children.findMany({
    with: { family: true, growthRecords: true },
  });
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const dueReminders = await db
    .select()
    .from(reminders)
    .where(sql`${reminders.dueDate} <= ${todayStr}`)
    .orderBy(reminders.dueDate)
    .limit(5);
  return { mothers: assignedMothers, children: assignedChildren, dueReminders };
}
