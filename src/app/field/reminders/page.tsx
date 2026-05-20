import { db } from "@/db";
import { reminders, mothers, children } from "@/db/schema";
import { eq, lte } from "drizzle-orm";
import { ReminderRow, type ReminderRowData } from "@/components/reminder-row";

export default async function RemindersPage() {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await db
    .select()
    .from(reminders)
    .where(lte(reminders.dueDate, today))
    .orderBy(reminders.dueDate)
    .limit(20);

  // Resolve beneficiary names
  const enriched: ReminderRowData[] = await Promise.all(
    rows.map(async (r) => {
      let name = "Beneficiary";
      if (r.beneficiaryType === "mother") {
        const m = await db.query.mothers.findFirst({
          where: eq(mothers.id, r.beneficiaryId),
        });
        if (m) name = m.name;
      } else {
        const c = await db.query.children.findFirst({
          where: eq(children.id, r.beneficiaryId),
        });
        if (c) name = c.name ?? "Baby " + c.beneficiaryId12.slice(-4);
      }
      return {
        id: r.id,
        type: r.type,
        dueDate: r.dueDate,
        beneficiaryName: name,
      };
    }),
  );

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-semibold">Reminders</h1>
      {enriched.length === 0 && (
        <p className="text-sm text-[var(--fg-muted)]">No reminders due.</p>
      )}
      {enriched.map((r) => (
        <ReminderRow key={r.id} r={r} />
      ))}
    </div>
  );
}
