export const DISTRICT = "Palakkad";
export const STATE = "Kerala";

export const BLOCKS = [
  "Agali",
  "Sholayur",
  "Pudur",
  "Mannarkkad",
  "Attappadi",
] as const;

export const VILLAGES_BY_BLOCK: Record<string, string[]> = {
  Agali: ["Agali", "Kottathara", "Mukkali"],
  Sholayur: ["Sholayur", "Anavay", "Vattalakki"],
  Pudur: ["Pudur", "Tazhe Padavayal", "Kunjampetty"],
  Mannarkkad: ["Mannarkkad", "Karara", "Kanjirapuzha"],
  Attappadi: ["Bhoothivazhi", "Tachampara", "Padavayal"],
};

export interface FacilitySeed {
  name: string;
  type: "SC" | "PHC" | "CHC" | "DH";
  block: string;
  lat: number;
  lng: number;
}

export const FACILITIES: FacilitySeed[] = [
  { name: "Agali Sub-Centre", type: "SC", block: "Agali", lat: 11.18, lng: 76.72 },
  { name: "Sholayur Sub-Centre", type: "SC", block: "Sholayur", lat: 11.15, lng: 76.68 },
  { name: "Pudur Sub-Centre", type: "SC", block: "Pudur", lat: 11.12, lng: 76.74 },
  { name: "Agali PHC", type: "PHC", block: "Agali", lat: 11.18, lng: 76.72 },
  { name: "Kottathara PHC", type: "PHC", block: "Agali", lat: 11.17, lng: 76.73 },
  { name: "Mannarkkad CHC", type: "CHC", block: "Mannarkkad", lat: 10.99, lng: 76.46 },
  { name: "Palakkad District Hospital", type: "DH", block: "Palakkad", lat: 10.78, lng: 76.65 },
];
