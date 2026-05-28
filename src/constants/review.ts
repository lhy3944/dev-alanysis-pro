import type { ReviewStatus, Reviewer } from "@/types/review";

/**
 * 검토 상태 → 라벨 + 토큰 매핑.
 * 색은 globals.css 의 status-* 토큰만 사용한다 (직접 hex 금지).
 */
export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "검토전",
  in_review: "검토중",
  reviewed: "검토완료",
  false_positive: "오탐지",
};

/** Tailwind 클래스 짝 (bg + text). StatusBadge 와 동일한 표현. */
export const REVIEW_STATUS_CLASSES: Record<ReviewStatus, string> = {
  pending: "bg-status-amber-bg text-status-amber-fg",
  in_review: "bg-status-blue-bg text-status-blue-fg",
  reviewed: "bg-status-emerald-bg text-status-emerald-fg",
  false_positive: "bg-status-purple-bg text-status-purple-fg",
};

export const REVIEW_STATUS_ORDER: ReviewStatus[] = [
  "pending",
  "in_review",
  "reviewed",
  "false_positive",
];

/**
 * 현재 사용자 (mock). auth 도입 시 context/store 로 교체.
 */
export const CURRENT_USER: Reviewer = {
  id: "user-current",
  name: "이흥연",
  avatar_url: null,
};
