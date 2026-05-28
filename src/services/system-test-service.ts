import { delayed } from "@/lib/mock-utils";
import type { AgentScore, AgentScoreTone } from "@/types/agent";
import type { SystemTestReport } from "@/types/system-test-report";

/**
 * 보안 취약점은 "값이 클수록 나쁨" 이므로 막대는 (max-issues)/max 로 역산.
 * 0건 = ok, 3건 미만 = warn, 3건 이상 = danger.
 *
 * max(=10) 는 잠정. 향후 백엔드가 자체 기준을 반환하면 그 값을 그대로 쓰면 됨.
 */
const SECURITY_ISSUE_MAX = 10;

function buildSecurityScore(issues: number): AgentScore {
  const safe = Math.max(0, Math.min(issues, SECURITY_ISSUE_MAX));
  const tone: AgentScoreTone =
    safe === 0 ? "ok" : safe < 3 ? "warn" : "danger";
  const percent = ((SECURITY_ISSUE_MAX - safe) / SECURITY_ISSUE_MAX) * 100;
  return {
    domain: "system-test",
    label: "보안 취약점",
    display: safe === 0 ? "안전" : `${safe} Issues`,
    percent,
    tone,
    foot:
      safe === 0
        ? "현재 발견된 이슈 없음"
        : safe < 3
          ? "CSRF 영역 보강 권장"
          : "긴급 점검 필요",
  };
}

function buildReport(projectId: string, commitId: string): SystemTestReport {
  return {
    project_id: projectId,
    commit_id: commitId,
    revision_id: null,
    success_rate_pct: 80,
    cases: [
      {
        id: "s-1", code: "TC01",
        title: "End-to-End User Login Flow",
        sub: "UI-to-Auth-to-DB Integration check",
        status: "passed",
      },
      {
        id: "s-2", code: "TC02",
        title: "Multi-Factor Auth Bypass Attempt",
        sub: "Security robustness system test",
        status: "passed",
      },
      {
        id: "s-3", code: "TC03",
        title: "Session Persistence on Network Loss",
        sub: "Failed at reconnection hook",
        status: "failed",
      },
      {
        id: "s-4", code: "TC04",
        title: "Concurrent Login Throttling",
        sub: "Rate-limit policy validation",
        status: "passed",
      },
      {
        id: "s-5", code: "TC05",
        title: "Token Rotation Lifecycle",
        sub: "Cross-region replication consistency",
        status: "passed",
      },
    ],
    score: buildSecurityScore(2),
  };
}

export const systemTestService = {
  get: (projectId: string, commitId: string): Promise<SystemTestReport> =>
    delayed(buildReport(projectId, commitId)),
};
