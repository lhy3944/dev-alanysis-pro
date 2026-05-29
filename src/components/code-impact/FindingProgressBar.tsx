import { cn } from "@/lib/utils";

interface FindingProgressBarProps {
  total: number;
  reviewedCount: number;
  className?: string;
}

export function FindingProgressBar({
  total,
  reviewedCount,
  className,
}: FindingProgressBarProps) {
  const pct = total > 0 ? (reviewedCount / total) * 100 : 0;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-fg-muted text-[11px] font-medium whitespace-nowrap">
        검토 {reviewedCount}/{total}
      </span>
      <div className="bg-canvas-surface-2 h-1 w-16 overflow-hidden rounded-full">
        <div
          className="bg-success-fg h-full rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
