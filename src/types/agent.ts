/**
 * 워크스페이스 에이전트 도메인 공통 타입.
 * 각 에이전트(code-impact / requirement / unit-test / system-test)는
 * 자신의 결과 리포트에 동일한 형태의 score 를 포함한다 — Dashboard 가 이를
 * 모아서 "AI 코드 리뷰 결과 요약" 카드를 구성한다.
 */

export type AgentDomain =
  | "code-impact"
  | "requirement"
  | "unit-test"
  | "system-test";

export type AgentScoreTone = "ok" | "warn" | "danger" | "info";

export interface AgentScore {
  domain: AgentDomain;
  label: string;
  /** "85%" / "2 Issues" 같이 카드에 크게 표시되는 값 */
  display: string;
  /** 0~100. 0 이면 progress bar 를 그리지 않음 */
  percent: number;
  tone: AgentScoreTone;
  foot: string;
}
