/**
 * 협업용 검토 상태 모델.
 * 현재는 Finding 에만 적용하지만, 향후 RequirementLink / TestCase 등
 * 다른 에이전트 결과 항목에도 그대로 끼울 수 있도록 도메인-무관 위치에 둔다.
 */

export type ReviewStatus =
  | "pending"
  | "in_review"
  | "reviewed"
  | "false_positive";

export interface Reviewer {
  id: string;
  name: string;
  avatar_url?: string | null;
}

export interface ReviewMeta {
  status: ReviewStatus;
  reviewer: Reviewer | null;
  reviewed_at: string | null;
}
