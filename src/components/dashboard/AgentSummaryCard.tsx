import { Activity } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { cn } from "@/lib/utils";
import type { AgentScore, AgentScoreTone } from "@/types/agent";
import { AdvisoryNote } from "./AdvisoryNote";

interface AgentSummaryCardProps {
  metrics: AgentScore[];
  /** advisory 코멘트가 있으면 카드 하단에 함께 표시 */
  advisory?: string | null;
  className?: string;
}

const TONE_TEXT: Record<AgentScoreTone, string> = {
  ok: "text-success-fg",
  warn: "text-warning",
  danger: "text-destructive",
  info: "text-fg-primary",
};

const TONE_FILL: Record<AgentScoreTone, string> = {
  ok: "bg-success-fg",
  warn: "bg-warning",
  danger: "bg-destructive",
  info: "bg-fg-primary",
};

export function AgentSummaryCard({
  metrics,
  advisory,
  className,
}: AgentSummaryCardProps) {
  return (
    <SectionCard
      title="AI 코드 리뷰 결과 요약"
      icon={Activity}
      className={className}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((m) => (
          <MetricCell key={m.domain} metric={m} />
        ))}
      </div>
      {advisory && <AdvisoryNote className="mt-4">{advisory}</AdvisoryNote>}
    </SectionCard>
  );
}

function MetricCell({ metric }: { metric: AgentScore }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-fg-muted text-[11px] font-medium">
          {metric.label}
        </span>
        <span
          className={cn(
            "text-lg font-bold leading-none",
            TONE_TEXT[metric.tone],
          )}
        >
          {metric.display}
        </span>
      </div>
      <div className="bg-canvas-surface-2 h-1 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            TONE_FILL[metric.tone],
          )}
          style={{ width: `${Math.max(0, Math.min(metric.percent, 100))}%` }}
        />
      </div>
      <p className="text-fg-muted text-[11px]">{metric.foot}</p>
    </div>
  );
}
