// Simplified WHO weight-for-age + weight-for-height Z-score.
// For an EOI demo we use a conservative lookup, not full LMS interpolation.
export type NutritionClass = "NORMAL" | "MAM" | "SAM";

interface Pt {
  ageMonths: number;
  median: number;
  sd: number;
}

const WEIGHT_FOR_AGE_BOYS: Pt[] = [
  { ageMonths: 0, median: 3.3, sd: 0.45 },
  { ageMonths: 3, median: 6.4, sd: 0.7 },
  { ageMonths: 6, median: 7.9, sd: 0.85 },
  { ageMonths: 12, median: 9.6, sd: 1.05 },
  { ageMonths: 18, median: 10.9, sd: 1.2 },
  { ageMonths: 24, median: 12.2, sd: 1.35 },
];

const WEIGHT_FOR_AGE_GIRLS: Pt[] = [
  { ageMonths: 0, median: 3.2, sd: 0.4 },
  { ageMonths: 3, median: 5.8, sd: 0.65 },
  { ageMonths: 6, median: 7.3, sd: 0.8 },
  { ageMonths: 12, median: 8.9, sd: 0.95 },
  { ageMonths: 18, median: 10.2, sd: 1.1 },
  { ageMonths: 24, median: 11.5, sd: 1.25 },
];

function interpolate(table: Pt[], ageMonths: number): Pt {
  if (ageMonths <= table[0].ageMonths) return table[0];
  if (ageMonths >= table[table.length - 1].ageMonths)
    return table[table.length - 1];
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (ageMonths >= a.ageMonths && ageMonths <= b.ageMonths) {
      const t = (ageMonths - a.ageMonths) / (b.ageMonths - a.ageMonths);
      return {
        ageMonths,
        median: a.median + (b.median - a.median) * t,
        sd: a.sd + (b.sd - a.sd) * t,
      };
    }
  }
  return table[table.length - 1];
}

export function weightForAgeZ(
  weightKg: number,
  ageMonths: number,
  sex: "M" | "F",
): number {
  const table = sex === "M" ? WEIGHT_FOR_AGE_BOYS : WEIGHT_FOR_AGE_GIRLS;
  const pt = interpolate(table, ageMonths);
  return (weightKg - pt.median) / pt.sd;
}

export function classifyNutrition(
  weightForHeightZ: number | null,
  muacCm: number | null,
): NutritionClass {
  // SAM: WHZ < -3 OR MUAC < 11.5
  if ((weightForHeightZ != null && weightForHeightZ < -3) || (muacCm != null && muacCm < 11.5)) {
    return "SAM";
  }
  // MAM: WHZ -3 to -2 OR MUAC 11.5–12.5
  if (
    (weightForHeightZ != null && weightForHeightZ < -2) ||
    (muacCm != null && muacCm < 12.5)
  ) {
    return "MAM";
  }
  return "NORMAL";
}

export function ageInMonths(dob: Date, on: Date = new Date()): number {
  const months =
    (on.getFullYear() - dob.getFullYear()) * 12 +
    (on.getMonth() - dob.getMonth());
  return Math.max(0, months);
}
