export interface MilestoneSpec {
  code: string;
  name: string;
  expectedAgeMonths: number;
}

export const MILESTONES_0_TO_24M: MilestoneSpec[] = [
  { code: "SOCIAL_SMILE", name: "Social smile", expectedAgeMonths: 2 },
  { code: "HEAD_HOLD", name: "Holds head steady", expectedAgeMonths: 3 },
  { code: "ROLL_OVER", name: "Rolls over", expectedAgeMonths: 5 },
  { code: "SITS", name: "Sits without support", expectedAgeMonths: 7 },
  { code: "CRAWLS", name: "Crawls", expectedAgeMonths: 9 },
  { code: "STANDS", name: "Stands with support", expectedAgeMonths: 10 },
  { code: "FIRST_WORDS", name: "First words", expectedAgeMonths: 12 },
  { code: "WALKS", name: "Walks independently", expectedAgeMonths: 13 },
  { code: "TWO_WORD_PHRASES", name: "Two-word phrases", expectedAgeMonths: 18 },
  { code: "RUNS", name: "Runs", expectedAgeMonths: 21 },
];
