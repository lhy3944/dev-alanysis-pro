"use client";

import {
  REVIEW_STATUS_CLASSES,
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_ORDER,
} from "@/constants/review";
import { cn } from "@/lib/utils";
import type { ReviewStatus } from "@/types/review";

export type FindingFilterValue = ReviewStatus | "all";

interface FindingFilterChipsProps {
  value: FindingFilterValue;
  onChange: (next: FindingFilterValue) => void;
  counts: Record<ReviewStatus, number>;
  total: number;
}

export function FindingFilterChips({
  value,
  onChange,
  counts,
  total,
}: FindingFilterChipsProps) {
  return (
    <div className="grid grid-cols-5 gap-1">
      <Chip
        active={value === "all"}
        onClick={() => onChange("all")}
        label="전체"
        count={total}
        tone="neutral"
      />
      {REVIEW_STATUS_ORDER.map((s) => (
        <Chip
          key={s}
          active={value === s}
          onClick={() => onChange(s)}
          label={REVIEW_STATUS_LABELS[s]}
          count={counts[s]}
          tone={s}
        />
      ))}
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  tone: ReviewStatus | "neutral";
}

function Chip({ active, onClick, label, count, tone }: ChipProps) {
  const activeClass =
    tone === "neutral"
      ? "bg-fg-primary text-canvas-primary"
      : REVIEW_STATUS_CLASSES[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex w-full items-center justify-center gap-1 rounded-sm px-2 py-1.5 text-[11px] font-semibold leading-none whitespace-nowrap transition-colors",
        active
          ? activeClass
          : "bg-canvas-surface-2 text-fg-muted hover:bg-canvas-surface-3 hover:text-fg-primary",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "rounded-sm px-1 py-px text-[10px] font-bold",
          active ? "bg-canvas-primary/20" : "bg-canvas-primary/60",
        )}
      >
        {count}
      </span>
    </button>
  );
}
