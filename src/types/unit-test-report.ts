import type { AgentScore } from "./agent";
import type { CommitRef } from "./commit";

export type TestCaseStatus = "passed" | "failed" | "skipped";

export interface UnitTestCase {
  id: string;
  name: string;
  status: TestCaseStatus;
  duration_ms: number | null;
}

export interface UnitTestReport extends CommitRef {
  project_id: string;
  coverage_pct: number;
  cases: UnitTestCase[];
  score: AgentScore;
}
