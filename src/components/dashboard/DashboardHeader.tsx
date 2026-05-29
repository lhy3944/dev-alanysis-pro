import { cn } from "@/lib/utils";

type AnalysisStatus = "complete" | "running" | "failed";

interface DashboardHeaderProps {
  status: AnalysisStatus;
  /** "2023.11.24 14:30" 같이 이미 포맷된 문자열 */
  analyzedAtLabel: string;
  branch: string;
  /** 헤더 타이틀. 미지정 시 "변경 영향 분석 결과" (대시보드 기본값). */
  title?: string;
  className?: string;
}

const STATUS_STYLE: Record<
  AnalysisStatus,
  { dot: string; label: string; text: string }
> = {
  complete: {
    dot: "bg-success-fg",
    label: "분석 완료",
    text: "text-fg-secondary",
  },
  running: {
    dot: "bg-info animate-pulse",
    label: "분석 중",
    text: "text-fg-secondary",
  },
  failed: {
    dot: "bg-destructive",
    label: "분석 실패",
    text: "text-fg-secondary",
  },
};

export function DashboardHeader({
  status,
  analyzedAtLabel,
  branch,
  title = "변경 영향 분석 결과",
  className,
}: DashboardHeaderProps) {
  const s = STATUS_STYLE[status];
  return (
    <header className={cn("mb-5 flex flex-col gap-1", className)}>
      <h1 className="h1">{title}</h1>
      <div className="flex items-center gap-2">
        <span
          className={cn("size-1.5 shrink-0 rounded-full", s.dot)}
          aria-hidden
        />
        <span className={cn("text-[12px] font-medium", s.text)}>{s.label}</span>
        <span className="text-fg-tertiary text-[12px]">·</span>
        <span className="text-fg-muted text-[12px]">
          {analyzedAtLabel}
          <span className="text-fg-tertiary"> ({branch})</span>
        </span>
      </div>
    </header>
  );
}
