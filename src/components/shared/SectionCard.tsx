import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
  iconClassName?: string;
  /** 헤더 우측 영역 — 뱃지, 진행률, 액션 버튼 등 */
  headerRight?: ReactNode;
  /** 헤더 아래 sub-row (필터 칩 등) */
  subHeader?: ReactNode;
  /** subHeader wrapper override — 탭처럼 자체 spacing 이 있는 자식에 padding 을 제거할 때 */
  subHeaderClassName?: string;
  /** 카드 하단 footer (deep link 버튼 등) */
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export function SectionCard({
  title,
  icon: Icon,
  iconClassName,
  headerRight,
  subHeader,
  subHeaderClassName,
  footer,
  className,
  bodyClassName,
  children,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "bg-canvas-primary border-line-subtle flex flex-col rounded-lg border",
        className,
      )}
    >
      <header className="border-line-subtle flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className={cn("text-icon-default size-4", iconClassName)} />
          )}
          <SectionCardTitle title={title} />
        </div>
        {headerRight && (
          <div className="flex shrink-0 items-center gap-2">{headerRight}</div>
        )}
      </header>
      {subHeader && (
        <div
          className={cn(
            "border-line-subtle border-b px-4 py-2.5",
            subHeaderClassName,
          )}
        >
          {subHeader}
        </div>
      )}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col px-4 py-4",
          bodyClassName,
        )}
      >
        {children}
      </div>
      {footer && (
        <footer className="border-line-subtle border-t px-4 py-2.5">
          {footer}
        </footer>
      )}
    </section>
  );
}

/**
 * "한글 타이틀 (English Subtitle)" 패턴을 본문(primary) + 영문(muted) 으로 분리.
 * 괄호 안이 알파벳으로 시작하는 경우에만 적용 — `(12건)` 처럼 데이터가 들어간
 * 케이스는 그대로 둔다.
 */
const SUBTITLE_PATTERN = /^(.+?)\s*\(([A-Za-z][^)]*)\)\s*$/;

function SectionCardTitle({ title }: { title: string }) {
  const match = SUBTITLE_PATTERN.exec(title);
  if (!match) {
    return <h3 className="text-fg-primary text-sm font-semibold">{title}</h3>;
  }
  const [, main, sub] = match;
  return (
    <h3 className="flex items-baseline gap-1.5">
      <span className="text-fg-primary text-sm font-semibold">{main}</span>
      <span className="text-fg-muted text-[12px] font-medium">{sub}</span>
    </h3>
  );
}
