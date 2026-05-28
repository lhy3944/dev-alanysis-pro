"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  REVIEW_STATUS_CLASSES,
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_ORDER,
  REVIEW_STATUS_TEXT,
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
 * 검토 상태(검토전/검토중/검토완료/오탐지) 인디케이터.
 * 텍스트 + chevron 의 미니멀 표현 — 리스트가 색으로 점멸하지 않도록 칩을 쓰지 않는다.
 * hover 시 underline 으로 인터랙션 가능성을 강조한다.
 *
 * 드롭다운 안에서는 한 화면에 4 상태를 동시에 보여주므로 soft chip 으로 표시,
 * 현재 선택된 항목은 좌측 check 아이콘으로 표기 (체크박스 패턴과 동일).
 */
export function ReviewStatusBadge({
  value,
  onChange,
  readOnly,
  className,
}: ReviewStatusBadgeProps) {
  const editable = !readOnly && !!onChange;

  const indicator = (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[12px] font-medium leading-none whitespace-nowrap transition-[filter,color]",
        REVIEW_STATUS_TEXT[value],
        // hover: 자기 색은 유지하되 더 짙어 보이도록 brightness 로 조정.
        // 라이트 테마(어두운 텍스트)는 더 어둡게, 다크 테마(밝은 텍스트)는 더 밝게.
        editable && "hover:brightness-75 dark:hover:brightness-125",
        className,
      )}
    >
      {REVIEW_STATUS_LABELS[value]}
      {editable && (
        <ChevronDown className="-mr-0.5 size-3 opacity-60" aria-hidden />
      )}
    </span>
  );

  if (!editable) return indicator;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="검토 상태 변경"
          className="focus-visible:ring-ring rounded-sm outline-hidden focus-visible:ring-2"
        >
          {indicator}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {REVIEW_STATUS_ORDER.map((s) => {
          const isSelected = s === value;
          return (
            <DropdownMenuItem
              key={s}
              onSelect={() => onChange?.(s)}
              className="relative gap-2 pl-8"
            >
              {isSelected && (
                <Check
                  className="text-fg-primary absolute left-2 size-3.5"
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none",
                  REVIEW_STATUS_CLASSES[s],
                )}
              >
                {REVIEW_STATUS_LABELS[s]}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
