"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  REVIEW_STATUS_CLASSES,
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_ORDER,
} from "@/constants/review";
import { cn } from "@/lib/utils";
import type { ReviewStatus } from "@/types/review";

interface ReviewStatusBadgeProps {
  value: ReviewStatus;
  onChange?: (next: ReviewStatus) => void;
  readOnly?: boolean;
  className?: string;
}

/**
 * 검토 상태(검토전/검토중/검토완료/오탐지) 뱃지.
 * onChange 가 제공되면 클릭 시 dropdown 으로 상태 전환 가능.
 * Finding 외에도 향후 다른 항목(요구사항/테스트 케이스) 에 그대로 끼울 수 있도록
 * 도메인-무관 props 만 받는다.
 */
export function ReviewStatusBadge({
  value,
  onChange,
  readOnly,
  className,
}: ReviewStatusBadgeProps) {
  const editable = !readOnly && !!onChange;

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap",
        REVIEW_STATUS_CLASSES[value],
        editable && "cursor-pointer transition-opacity hover:opacity-90",
        className,
      )}
    >
      {REVIEW_STATUS_LABELS[value]}
      {editable && <ChevronDown className="-mr-0.5 size-3" />}
    </span>
  );

  if (!editable) return badge;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="검토 상태 변경"
          className="focus-visible:ring-ring rounded-full outline-hidden focus-visible:ring-2"
        >
          {badge}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange?.(v as ReviewStatus)}
        >
          {REVIEW_STATUS_ORDER.map((s) => (
            <DropdownMenuRadioItem key={s} value={s} className="gap-2 pl-8">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none",
                  REVIEW_STATUS_CLASSES[s],
                )}
              >
                {REVIEW_STATUS_LABELS[s]}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
