import { db } from "@/db";
import {
  DataTable,
  DataTableHead,
  DataTableRow,
} from "@/components/data-table";
import { Plus, Hospital, Building2 } from "lucide-react";

const TYPE_PILL: Record<string, string> = {
  SC: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  PHC: "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/20",
  CHC: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  DH: "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/20",
};

function loadPill(load: "Light" | "Moderate" | "Heavy"): string {
  if (load === "Light")
    return "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/15";
  if (load === "Moderate")
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)] ring-1 ring-[var(--risk-critical)]/15";
}

export default async function AdminFacilities() {
  const rows = await db.query.facilities.findMany();

  const counts = rows.reduce(
    (acc, f) => {
      const t = (f.type ?? "").toUpperCase();
      if (t in acc) acc[t as keyof typeof acc] += 1;
      return acc;
    },
    { SC: 0, PHC: 0, CHC: 0, DH: 0 },
  );

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
            Facilities
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">
            {rows.length} facilities · SC / PHC / CHC / DH
          </p>
        </div>
        <button
          type="button"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold text-white shadow-primary-sm hover:opacity-95 transition-opacity"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="size-3.5" strokeWidth={2.4} />
          Add facility
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <TypeTile label="Sub-Centres" code="SC" count={counts.SC} />
        <TypeTile label="PHCs" code="PHC" count={counts.PHC} />
        <TypeTile label="CHCs" code="CHC" count={counts.CHC} />
        <TypeTile label="District Hosp." code="DH" count={counts.DH} />
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
            All facilities
          </h2>
          <span className="text-[11px] font-mono-num text-[var(--fg-muted)]">
            {rows.length} rows
          </span>
        </div>
        <DataTable minWidth={680}>
          <DataTableHead>
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">Name</th>
              <th className="text-left px-4 py-2.5 font-medium">Type</th>
              <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">
                Block
              </th>
              <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">
                Coordinates
              </th>
              <th className="text-left px-4 py-2.5 font-medium">Load</th>
            </tr>
          </DataTableHead>
          <tbody>
            {rows.map((f, i) => {
              // Deterministic load classification based on id, since data has none
              const load: "Light" | "Moderate" | "Heavy" =
                f.id % 3 === 0
                  ? "Heavy"
                  : f.id % 3 === 1
                    ? "Moderate"
                    : "Light";
              const typeKey = (f.type ?? "").toUpperCase();
              const pillCls =
                TYPE_PILL[typeKey] ??
                "bg-[var(--surface-alt)] text-[var(--fg)]";
              return (
                <DataTableRow key={f.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-[var(--surface-alt)] flex items-center justify-center text-[var(--fg-muted)] shrink-0">
                        <Hospital className="size-4" strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[var(--fg)] truncate">
                          {f.name}
                        </div>
                        <div className="text-[11px] text-[var(--fg-muted)] sm:hidden truncate">
                          {f.block}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex px-2 py-0.5 rounded-full font-semibold text-[11px] " +
                        pillCls
                      }
                    >
                      {f.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-muted)] hidden sm:table-cell">
                    {f.block}
                  </td>
                  <td className="px-4 py-3 font-mono-num text-xs text-[var(--fg-muted)] hidden sm:table-cell">
                    {f.lat?.toFixed(2)}, {f.lng?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium " +
                        loadPill(load)
                      }
                    >
                      {load}
                    </span>
                  </td>
                </DataTableRow>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
                >
                  No facilities listed.
                </td>
              </tr>
            )}
          </tbody>
        </DataTable>
      </section>
    </div>
  );
}

function TypeTile({
  label,
  code,
  count,
}: {
  label: string;
  code: keyof typeof TYPE_PILL;
  count: number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 space-y-2 shadow-card">
      <div className="flex items-center justify-between">
        <span
          className={
            "inline-flex px-2 py-0.5 rounded-full font-semibold text-[11px] " +
            (TYPE_PILL[code] ?? "bg-[var(--surface-alt)] text-[var(--fg)]")
          }
        >
          {code}
        </span>
        <Building2
          className="size-4 text-[var(--fg-subtle)]"
          strokeWidth={2}
        />
      </div>
      <div className="text-2xl sm:text-3xl font-semibold font-mono-num tracking-tight text-[var(--fg)]">
        {count}
      </div>
      <div className="text-[11px] sm:text-xs text-[var(--fg-muted)] uppercase tracking-[0.08em] font-medium">
        {label}
      </div>
    </div>
  );
}
