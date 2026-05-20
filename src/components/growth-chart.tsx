"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { format } from "date-fns";

export function GrowthChart({
  records,
}: {
  records: Array<{ recordedAt: Date; weightKg: number | null }>;
}) {
  const data = records
    .filter((r) => r.weightKg != null)
    .map((r) => ({
      date: format(r.recordedAt, "d MMM"),
      weight: r.weightKg!,
    }));
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" fontSize={10} />
          <YAxis fontSize={10} />
          <Tooltip />
          <Line type="monotone" dataKey="weight" stroke="#0F4C75" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
