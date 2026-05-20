export type RiskLevel = "NORMAL" | "HIGH" | "CRITICAL";

export interface AncVitals {
  bpSystolic?: number | null;
  bpDiastolic?: number | null;
  hbValue?: number | null;
  weightKg?: number | null;
}

export interface RiskAssessment {
  level: RiskLevel;
  triggers: string[];
}

export function scoreAncRisk(v: AncVitals): RiskAssessment {
  const triggers: string[] = [];
  let level: RiskLevel = "NORMAL";

  // Severe anaemia
  if (v.hbValue != null && v.hbValue < 7) {
    triggers.push("Severe anaemia (Hb<7)");
    level = "CRITICAL";
  } else if (v.hbValue != null && v.hbValue < 9) {
    triggers.push("Moderate anaemia (Hb<9)");
    if (level === "NORMAL") level = "HIGH";
  }

  // Hypertension
  if (
    (v.bpSystolic != null && v.bpSystolic >= 160) ||
    (v.bpDiastolic != null && v.bpDiastolic >= 110)
  ) {
    triggers.push("Severe hypertension (BP ≥ 160/110)");
    level = "CRITICAL";
  } else if (
    (v.bpSystolic != null && v.bpSystolic >= 140) ||
    (v.bpDiastolic != null && v.bpDiastolic >= 90)
  ) {
    triggers.push("Hypertension (BP ≥ 140/90)");
    if (level === "NORMAL") level = "HIGH";
  }

  return { level, triggers };
}

export function recommendedAction(level: RiskLevel): string {
  switch (level) {
    case "CRITICAL":
      return "Immediate referral to PHC/CHC. Notify MO.";
    case "HIGH":
      return "Schedule follow-up within 48 hours. Counsel on warning signs.";
    case "NORMAL":
      return "Continue routine ANC schedule.";
  }
}
