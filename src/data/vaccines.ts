export interface VaccineSpec {
  code: string;
  name: string;
  ageMonths: number;
}

export const VACCINES_0_TO_24M: VaccineSpec[] = [
  { code: "BCG", name: "BCG", ageMonths: 0 },
  { code: "HEPB-0", name: "Hepatitis B (birth)", ageMonths: 0 },
  { code: "OPV-0", name: "OPV-0", ageMonths: 0 },
  { code: "PENTA-1", name: "Pentavalent-1", ageMonths: 1.5 },
  { code: "OPV-1", name: "OPV-1", ageMonths: 1.5 },
  { code: "ROTA-1", name: "Rotavirus-1", ageMonths: 1.5 },
  { code: "PENTA-2", name: "Pentavalent-2", ageMonths: 2.5 },
  { code: "OPV-2", name: "OPV-2", ageMonths: 2.5 },
  { code: "ROTA-2", name: "Rotavirus-2", ageMonths: 2.5 },
  { code: "PENTA-3", name: "Pentavalent-3", ageMonths: 3.5 },
  { code: "OPV-3", name: "OPV-3", ageMonths: 3.5 },
  { code: "ROTA-3", name: "Rotavirus-3", ageMonths: 3.5 },
  { code: "MR-1", name: "Measles-Rubella-1", ageMonths: 9 },
  { code: "JE-1", name: "Japanese Encephalitis-1", ageMonths: 9 },
  { code: "VITA-1", name: "Vitamin A-1", ageMonths: 9 },
  { code: "DPT-B1", name: "DPT booster-1", ageMonths: 16 },
  { code: "OPV-B", name: "OPV booster", ageMonths: 16 },
  { code: "MR-2", name: "Measles-Rubella-2", ageMonths: 16 },
];
