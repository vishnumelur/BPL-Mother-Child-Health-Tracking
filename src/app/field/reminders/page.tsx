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
    <div className="px-4 py-5 sm:px-5 sm:py-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
          Reminders
        </h1>
        <p className="text-xs text-[var(--fg-muted)]">
          {enriched.length} due · tap SMS to preview message
        </p>
      </header>
      {enriched.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-8 text-center">
          <p className="text-sm text-[var(--fg-muted)]">No reminders due.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {enriched.map((r) => (
            <ReminderRow key={r.id} r={r} />
          ))}
        </div>
      )}
    </div>
  );
}
