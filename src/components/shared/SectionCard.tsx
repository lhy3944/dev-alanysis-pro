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
          <h3 className="text-fg-primary text-sm font-semibold">{title}</h3>
        </div>
        {headerRight && (
          <div className="flex shrink-0 items-center gap-2">{headerRight}</div>
        )}
      </header>
      {subHeader && (
        <div className="border-line-subtle border-b px-4 py-2.5">
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
