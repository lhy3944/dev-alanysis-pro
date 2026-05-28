import type { AgentScore } from "./agent";
import type { CommitRef } from "./commit";
import type { TestCaseStatus } from "./unit-test-report";

export interface SystemTestCase {
  id: string;
  code: string;
  title: string;
  sub: string;
  status: TestCaseStatus;
}

export interface SystemTestReport extends CommitRef {
  project_id: string;
  success_rate_pct: number;
  cases: SystemTestCase[];
  score: AgentScore;
}
