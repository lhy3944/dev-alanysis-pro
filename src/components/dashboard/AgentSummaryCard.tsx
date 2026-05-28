import { Activity } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { cn } from "@/lib/utils";
import type { AgentScore, AgentScoreTone } from "@/types/agent";
import { AdvisoryNote } from "./AdvisoryNote";

interface AgentSummaryCardProps {
  metrics: AgentScore[];
  /** advisory 코멘트가 있으면 카드 하단에 함께 표시 */
  advisory?: string | null;
  /** 헤더 우측에 "분석 모델: claude-…" 같은 메타가 필요할 때 */
  modelName?: string;
  className?: string;
}

/**
 * 메트릭 색 전략
 * - ok / info: 무채색 — "정상" 은 강조하지 않는다.
 * - warn / danger: 강조색. 사용자 시선이 문제 메트릭에만 가도록.
 * - progress bar 도 같은 규칙을 따른다.
 */
const TONE_VALUE_TEXT: Record<AgentScoreTone, string> = {
  ok: "text-fg-primary",
  warn: "text-warning-fg",
  danger: "text-destructive-fg",
  info: "text-fg-primary",
};

const TONE_FILL: Record<AgentScoreTone, string> = {
  ok: "bg-fg-primary",
  warn: "bg-warning-fg",
  danger: "bg-destructive-fg",
  info: "bg-fg-primary",
};

export function AgentSummaryCard({
  metrics,
  advisory,
  modelName,
  className,
}: AgentSummaryCardProps) {
  return (
    <SectionCard
      title="AI 코드 리뷰 결과 요약"
      icon={Activity}
      headerRight={
        modelName ? (
          <span className="text-fg-muted text-[12px]">
            분석 모델:{" "}
            <span className="text-fg-secondary font-mono font-medium">
              {modelName}
            </span>
          </span>
        ) : undefined
      }
      className={className}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m) => (
          <MetricCell key={m.domain} metric={m} />
        ))}
      </div>
      {advisory && <AdvisoryNote className="mt-3">{advisory}</AdvisoryNote>}
    </SectionCard>
  );
}

function MetricCell({ metric }: { metric: AgentScore }) {
  return (
    <div className="border-line-subtle flex flex-col gap-3 rounded-lg border p-4">
      <span className="text-fg-muted text-[12px] font-medium">
        {metric.label}
      </span>
      <span
        className={cn(
          "text-2xl leading-none font-bold tracking-tight",
          TONE_VALUE_TEXT[metric.tone],
        )}
      >
        {metric.display}
      </span>
      <div className="bg-canvas-surface-2 h-[3px] w-full overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full transition-all", TONE_FILL[metric.tone])}
          style={{ width: `${Math.max(0, Math.min(metric.percent, 100))}%` }}
        />
      </div>
      <p className="text-fg-muted text-[11px] leading-snug">{metric.foot}</p>
    </div>
  );
}
