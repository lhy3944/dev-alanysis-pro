"use client";

import { ReviewStatusBadge } from "@/components/shared/ReviewStatusBadge";
import { StatusBadge } from "@/components/ui/status-badge";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Finding, FindingPriority } from "@/types/code-impact-report";
import type { ReviewStatus } from "@/types/review";

interface FindingItemProps {
  finding: Finding;
  onChangeStatus: (id: string, next: ReviewStatus) => void;
  className?: string;
}

const PRIORITY_STYLE: Record<
  FindingPriority,
  { tone: "red" | "amber" | "neutral"; label: string }
> = {
  p1: { tone: "red", label: "P1 HIGH" },
  p2: { tone: "amber", label: "P2 MID" },
  p3: { tone: "neutral", label: "P3 LOW" },
};

const PRIORITY_BAR: Record<FindingPriority, string> = {
  p1: "bg-status-red-fg",
  p2: "bg-status-amber-fg",
  p3: "bg-border-strong",
};

export function FindingItem({
  finding,
  onChangeStatus,
  className,
}: FindingItemProps) {
  const p = PRIORITY_STYLE[finding.priority];
  return (
    <article
      className={cn(
        "border-line-subtle flex gap-3 border-b py-3 last:border-b-0",
        className,
      )}
    >
      <span
        className={cn("w-0.5 shrink-0 rounded-full", PRIORITY_BAR[finding.priority])}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-fg-primary text-[13px] leading-tight font-semibold">
            {finding.title}
          </h4>
          <p className="text-fg-muted mt-1 text-[12px] leading-relaxed">
            {finding.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <StatusBadge variant="outline" tone={p.tone} label={p.label} />
            <StatusBadge
              variant="outline"
              tone="neutral"
              label={finding.category}
            />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <ReviewStatusBadge
            value={finding.review.status}
            onChange={(next) => onChangeStatus(finding.id, next)}
          />
          {/* TODO: 검토자 표기는 협업 규칙 확정 후 노출 여부 결정. 일단 비공개.
          {finding.review.reviewer && finding.review.reviewed_at && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-fg-tertiary cursor-help text-[10px] whitespace-nowrap">
                  {finding.review.reviewer.name}
                </span>
              </TooltipTrigger>
              <TooltipContent side="left">
                {finding.review.reviewer.name} ·{" "}
                {new Date(finding.review.reviewed_at).toLocaleString()}
              </TooltipContent>
            </Tooltip>
          )}
          */}
        </div>
      </div>
    </article>
  );
}
