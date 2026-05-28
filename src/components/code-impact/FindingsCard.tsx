"use client";

import { ListChecks } from "lucide-react";
import { useMemo, useState } from "react";
import { AgentDeepLinkButton } from "@/components/dashboard/AgentDeepLinkButton";
import { SectionCard } from "@/components/shared/SectionCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Finding } from "@/types/code-impact-report";
import type { ReviewStatus } from "@/types/review";
import {
  FindingFilterChips,
  type FindingFilterValue,
} from "./FindingFilterChips";
import { FindingItem } from "./FindingItem";
import { FindingProgressBar } from "./FindingProgressBar";

interface FindingsCardProps {
  findings: Finding[];
  projectId: string;
  commitId: string | undefined;
  onChangeStatus: (findingId: string, next: ReviewStatus) => void;
  className?: string;
}

export function FindingsCard({
  findings,
  projectId,
  commitId,
  onChangeStatus,
  className,
}: FindingsCardProps) {
  const [filter, setFilter] = useState<FindingFilterValue>("all");

  const counts = useMemo<Record<ReviewStatus, number>>(() => {
    const c: Record<ReviewStatus, number> = {
      pending: 0,
      in_review: 0,
      reviewed: 0,
      false_positive: 0,
    };
    findings.forEach((f) => {
      c[f.review.status]++;
    });
    return c;
  }, [findings]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? findings
        : findings.filter((f) => f.review.status === filter),
    [findings, filter],
  );

  const reviewedCount = counts.reviewed + counts.false_positive;

  return (
    <SectionCard
      title={`검증 필요 항목 (${findings.length}건)`}
      icon={ListChecks}
      headerRight={
        <>
          <FindingProgressBar
            total={findings.length}
            reviewedCount={reviewedCount}
          />
          <AgentDeepLinkButton
            projectId={projectId}
            commitId={commitId}
            domain="code-impact"
          />
        </>
      }
      subHeader={
        <FindingFilterChips
          value={filter}
          onChange={setFilter}
          counts={counts}
          total={findings.length}
        />
      }
      className={cn("h-[500px]", className)}
      bodyClassName="px-0 py-0"
    >
      <ScrollArea className="min-h-0 flex-1">
        {filtered.length === 0 ? (
          <p className="text-fg-muted py-12 text-center text-sm">
            표시할 항목이 없습니다
          </p>
        ) : (
          <div className="flex flex-col px-4 pb-3">
            {filtered.map((f) => (
              <FindingItem
                key={f.id}
                finding={f}
                onChangeStatus={onChangeStatus}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </SectionCard>
  );
}
