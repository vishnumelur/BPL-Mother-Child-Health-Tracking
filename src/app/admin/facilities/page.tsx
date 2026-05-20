import { db } from "@/db";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";

export default async function AdminFacilities() {
  const rows = await db.query.facilities.findMany();
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          Facilities
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          {rows.length} facilities · SC / PHC / CHC / DH
        </p>
      </header>
      <DataTable minWidth={640}>
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
          </tr>
        </DataTableHead>
        <tbody>
          {rows.map((f) => (
            <DataTableRow key={f.id}>
              <td className="px-4 py-3 font-medium">{f.name}</td>
              <td className="px-4 py-3">
                <span className="inline-flex px-2 py-0.5 rounded-full bg-[var(--surface-alt)] text-[var(--fg)] font-medium text-xs">
                  {f.type}
                </span>
              </td>
              <td className="px-4 py-3 text-[var(--fg-muted)] hidden sm:table-cell">
                {f.block}
              </td>
              <td className="px-4 py-3 font-mono-num text-xs text-[var(--fg-muted)] hidden sm:table-cell">
                {f.lat?.toFixed(2)}, {f.lng?.toFixed(2)}
              </td>
            </DataTableRow>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
              >
                No facilities listed.
              </td>
            </tr>
          )}
        </tbody>
      </DataTable>
    </div>
  );
}
