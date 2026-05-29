import type { AgentScore } from "./agent";
import type { CommitRef } from "./commit";

// --- Dashboard Summary (UnitTestReport) ---
//
// 대시보드의 "관련 Unit Test 목록" 카드용 요약 모델.
// 4 에이전트 결과를 한 화면에 보여줄 때만 사용.

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

// --- Agent Report (UnitTestAgentReport) ---
//
// Unit Test 에이전트 결과 리포트 페이지가 사용하는 풀 모델.
// 합의된 인터페이스는 docs/reference/agent_outputs/unittest.html 의 DATA 상수.

export type UnitTestVerificationCode =
  | "PASS"
  | "DEFECT"
  | "FAIL"
  | "BUILD-FAIL"
  | "SKIP-NOMATCH"
  | "SKIP-GEN"
  | "SKIP-GATE"
  | "SKIP-TIER"
  | "PENDING";

export type UnitTestStatusClass =
  | "s-pass"
  | "s-defect"
  | "s-fail"
  | "s-nomatch"
  | "s-tier"
  | "s-gate"
  | "s-gen"
  | "s-covered"
  | "s-pending";

export type UnitTestGroupKey =
  | "PASS"
  | "DEFECT"
  | "FAILED"
  | "UNVERIFIED"
  | "NONTARGET";

export type UnitTestGroupColor = "green" | "red" | "amber" | "gray" | "blue";

export interface UnitTestAgentMeta {
  project: string;
  repo: string;
  commit: string;
  branch: string;
  branch_url: string;
  updated: string;
}

export interface UnitTestKpiGroup {
  key: UnitTestGroupKey;
  label: string;
  codes: UnitTestVerificationCode[];
  color: UnitTestGroupColor;
  count: number;
}

export interface UnitTestVerificationItem {
  id: number;
  code: UnitTestVerificationCode;
  text: string;
  reason: string;
  slabel: string;
  scls: UnitTestStatusClass;
  file: string | null;
}

export interface UnitTestBestOfNRow {
  id: number;
  file: string;
  label: string;
  reason: string;
}

export interface UnitTestAgentReport {
  meta: UnitTestAgentMeta;
  total: number;
  groups: UnitTestKpiGroup[];
  vis: UnitTestVerificationItem[];
  files: Record<string, string>;
  bestofn: UnitTestBestOfNRow[];
  test_log: string;
  test_log_name: string;
  markdown: string;
}
