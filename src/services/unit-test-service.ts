import { delayed } from "@/lib/mock-utils";
import type { UnitTestReport } from "@/types/unit-test-report";

function buildReport(projectId: string, commitId: string): UnitTestReport {
  return {
    project_id: projectId,
    commit_id: commitId,
    revision_id: null,
    coverage_pct: 88,
    cases: [
      { id: "u-1", name: "AuthService.validateToken()", status: "passed", duration_ms: 12 },
      { id: "u-2", name: "AuthService.generateKey()", status: "passed", duration_ms: 8 },
      { id: "u-3", name: "AuthService.expiredToken()", status: "failed", duration_ms: 15 },
      { id: "u-4", name: "SessionHandler.init()", status: "skipped", duration_ms: null },
      { id: "u-5", name: "TokenStore.persist()", status: "passed", duration_ms: 6 },
      { id: "u-6", name: "TokenStore.evict()", status: "passed", duration_ms: 4 },
      { id: "u-7", name: "AuditLogger.write()", status: "passed", duration_ms: 9 },
      { id: "u-8", name: "AuditLogger.flush()", status: "passed", duration_ms: 11 },
    ],
    score: {
      domain: "unit-test",
      label: "테스트 용이성",
      display: "78%",
      percent: 78,
      tone: "info",
      foot: "의존성 주입 패턴 적용 필요",
    },
  };
}

export const unitTestService = {
  get: (projectId: string, commitId: string): Promise<UnitTestReport> =>
    delayed(buildReport(projectId, commitId)),
};
