import { delayed, nowISO } from "@/lib/mock-utils";
import { CURRENT_USER } from "@/constants/review";
import type { CodeImpactReport, Finding } from "@/types/code-impact-report";
import type { ReviewMeta, ReviewStatus } from "@/types/review";

const VIEW_BOX: [number, number, number, number] = [0, 0, 480, 280];

const BASE_FINDINGS: Finding[] = [
  {
    id: "f-01",
    title: "토큰 만료 로직 예외 처리",
    description:
      "JWT 리프레시 토큰 만료 처리 과정에서 레이스 컨디션 발생 가능성 검증 필요",
    priority: "p1",
    category: "Auth-Server",
    module_id: "core_auth",
    review: {
      status: "in_review",
      reviewer: { id: "u-002", name: "Lee Engineer", avatar_url: null },
      reviewed_at: "2026-05-26T10:12:00Z",
    },
  },
  {
    id: "f-02",
    title: "DB 커넥션 풀 누수 검사",
    description: "사용자 프로필 업데이트시 모듈의 비동기 호출 시 커넥션 릴리스 확인",
    priority: "p2",
    category: "Database",
    module_id: "user_profile",
    review: { status: "pending", reviewer: null, reviewed_at: null },
  },
  {
    id: "f-03",
    title: "입력 데이터 밸리데이션",
    description: "특수문자 필터링 우회 가능성 점검 (Regex 패턴 확인)",
    priority: "p3",
    category: "Security",
    module_id: "api_gateway",
    review: { status: "pending", reviewer: null, reviewed_at: null },
  },
  {
    id: "f-04",
    title: "세션 토큰 만료 시간 검증",
    description: "Refresh window 가 RFC 권장값보다 짧음. 재인증 횟수 증가 우려",
    priority: "p1",
    category: "Auth-Server",
    module_id: "core_auth",
    review: {
      status: "reviewed",
      reviewer: CURRENT_USER,
      reviewed_at: "2026-05-25T16:40:00Z",
    },
  },
  {
    id: "f-05",
    title: "CSRF 토큰 검증 누락",
    description: "/api/profile PATCH 핸들러에서 CSRF 헤더 검증 미적용",
    priority: "p1",
    category: "Security",
    module_id: "api_gateway",
    review: { status: "pending", reviewer: null, reviewed_at: null },
  },
  {
    id: "f-06",
    title: "비밀번호 해싱 알고리즘 강도",
    description: "bcrypt cost 12 — 환경 정책상 적정 수준, 조정 불필요",
    priority: "p2",
    category: "Security",
    module_id: "core_auth",
    review: {
      status: "false_positive",
      reviewer: CURRENT_USER,
      reviewed_at: "2026-05-25T18:02:00Z",
    },
  },
  {
    id: "f-07",
    title: "캐시 무효화 로직",
    description: "권한 변경 시 토큰 캐시가 즉시 갱신되지 않을 수 있음",
    priority: "p2",
    category: "Performance",
    module_id: "core_auth",
    review: { status: "pending", reviewer: null, reviewed_at: null },
  },
  {
    id: "f-08",
    title: "로깅 레벨 일관성",
    description: "info / debug 혼용 — 운영 환경 노이즈 증가",
    priority: "p3",
    category: "Observability",
    module_id: "audit_log",
    review: {
      status: "reviewed",
      reviewer: { id: "u-003", name: "Park QA", avatar_url: null },
      reviewed_at: "2026-05-24T09:15:00Z",
    },
  },
  {
    id: "f-09",
    title: "트랜잭션 롤백 처리",
    description: "다중 테이블 쓰기 실패 시 부분 커밋 가능성",
    priority: "p2",
    category: "Database",
    module_id: "user_profile",
    review: {
      status: "in_review",
      reviewer: CURRENT_USER,
      reviewed_at: "2026-05-27T11:00:00Z",
    },
  },
  {
    id: "f-10",
    title: "API 응답 시간 초과",
    description: "/api/auth/refresh p95 > 800ms — SLO 도달 임계",
    priority: "p3",
    category: "Performance",
    module_id: "api_gateway",
    review: { status: "pending", reviewer: null, reviewed_at: null },
  },
  {
    id: "f-11",
    title: "인증 미들웨어 순서",
    description: "rate-limit 후 auth — 익명 요청도 인증 비용 발생",
    priority: "p1",
    category: "Auth-Server",
    module_id: "api_gateway",
    review: { status: "pending", reviewer: null, reviewed_at: null },
  },
  {
    id: "f-12",
    title: "메모리 누수 가능성",
    description: "프로필 캐시 LRU 정책 미설정 — 장기 실행 시 점유율 상승",
    priority: "p2",
    category: "Performance",
    module_id: "user_profile",
    review: { status: "pending", reviewer: null, reviewed_at: null },
  },
];

function buildReport(
  projectId: string,
  commitId: string,
  findings: Finding[],
): CodeImpactReport {
  return {
    project_id: projectId,
    commit_id: commitId,
    revision_id: null,
    topology: {
      view_box: VIEW_BOX,
      nodes: [
        { id: "api_gateway", label: "API_Gateway", role: "neutral", x: 120, y: 80 },
        { id: "core_auth", label: "Core_Auth", role: "source", x: 240, y: 140 },
        { id: "audit_log", label: "Audit_Log", role: "affected", x: 360, y: 160 },
        { id: "user_profile", label: "User_Profile", role: "neutral", x: 120, y: 220 },
      ],
      edges: [
        { id: "e1", from: "api_gateway", to: "core_auth", kind: "impact" },
        { id: "e2", from: "core_auth", to: "audit_log", kind: "impact" },
        { id: "e3", from: "user_profile", to: "core_auth", kind: "dependency" },
      ],
      critical_path_module_ids: ["core_auth", "audit_log"],
    },
    findings,
    advisory:
      "현재 변경사항은 인증 모듈의 결합도를 12% 증가시킵니다. auth.service.ts 의 인터페이스를 분리하여 의존성을 완화할 것을 권장합니다.",
    score: {
      domain: "code-impact",
      label: "성능 최적화",
      display: "85%",
      percent: 85,
      tone: "ok",
      foot: "주요 최적화 3건 제안됨",
    },
  };
}

const inMemoryStore: Map<string, CodeImpactReport> = new Map();

function getOrInit(projectId: string, commitId: string): CodeImpactReport {
  const key = `${projectId}:${commitId}`;
  const existing = inMemoryStore.get(key);
  if (existing) return existing;
  const cloned = BASE_FINDINGS.map((f) => ({
    ...f,
    review: { ...f.review },
  }));
  const report = buildReport(projectId, commitId, cloned);
  inMemoryStore.set(key, report);
  return report;
}

export const codeImpactService = {
  get: (projectId: string, commitId: string): Promise<CodeImpactReport> =>
    delayed(getOrInit(projectId, commitId)),

  updateReview: (
    projectId: string,
    commitId: string,
    findingId: string,
    status: ReviewStatus,
  ): Promise<ReviewMeta> => {
    const report = getOrInit(projectId, commitId);
    const target = report.findings.find((f) => f.id === findingId);
    if (!target) {
      return Promise.reject(new Error(`Finding not found: ${findingId}`));
    }
    const next: ReviewMeta = {
      status,
      reviewer: status === "pending" ? null : CURRENT_USER,
      reviewed_at: status === "pending" ? null : nowISO(),
    };
    target.review = next;
    return delayed(next, 200);
  },
};
