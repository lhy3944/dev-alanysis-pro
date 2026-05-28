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

/**
 * Tailwind 클래스 짝 (bg + text). StatusBadge 와 동일한 soft chip 표현.
 *
 * 색 위계: 진행 중(in_review) 과 완료(reviewed) 만 색으로 강조하고,
 * 미처리(pending)·종결(false_positive) 은 무채색으로 둔다.
 * 사용자의 시선이 "지금 봐야 할 것" 에 정확히 가도록 한다.
 *
 * 드롭다운 목록처럼 "한 곳에 모든 상태를 보여주는" 컨텍스트에서 사용.
 * 인라인 행 표시는 [[REVIEW_STATUS_TEXT]] 의 text-only 변형을 권장.
 */
export const REVIEW_STATUS_CLASSES: Record<ReviewStatus, string> = {
  pending: "bg-canvas-surface-2 text-fg-muted",
  in_review: "bg-status-amber-bg text-status-amber-fg",
  reviewed: "bg-status-emerald-bg text-status-emerald-fg",
  false_positive: "bg-canvas-surface-2 text-fg-muted",
};

/**
 * 행 단위로 사용할 text-only 색. 배경/테두리 없이 텍스트 색만 칠한다.
 * Finding 리스트 한 카드 안에 12행이 쌓여도 색 노이즈를 만들지 않기 위함.
 */
export const REVIEW_STATUS_TEXT: Record<ReviewStatus, string> = {
  pending: "text-fg-muted",
  in_review: "text-status-amber-fg",
  reviewed: "text-status-emerald-fg",
  false_positive: "text-fg-muted",
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
