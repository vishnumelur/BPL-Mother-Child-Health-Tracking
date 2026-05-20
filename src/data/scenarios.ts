export type ScenarioCheckpoint =
  | "pre-anc"
  | "post-anc"
  | "post-sos"
  | "post-delivery"
  | "post-sam";

export interface ScenarioStep {
  description: string;
  apply: () => Promise<void>;
}

// Each checkpoint runs db ops to put state in a known position.
// Implementations live in src/db/scenarios.ts (Phase 11).
