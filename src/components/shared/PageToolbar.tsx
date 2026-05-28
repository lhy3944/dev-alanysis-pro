import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageToolbarProps {
  left?: ReactNode;
  right?: ReactNode;
  /**
   * 내부 콘텐츠를 정렬할 max-width 클래스 (예: `max-w-6xl`).
   * 호출자가 페이지 본문 그리드와 동일한 너비 토큰을 전달.
   * 미지정 시 inner 가 전체 너비를 차지.
   */
  maxWidthClassName?: string;
  className?: string;
}

/**
 * 페이지 본문 위의 sticky 툴바.
 * 본문 전체 너비(사이드바 제외 영역)에 풀너비 배경 + bottom border 를 깔고,
 * 내부 콘텐츠만 `maxWidthClassName` 안에서 가운데 정렬한다.
 *
 * 사용 위치는 scroll container 의 직접 자식이어야 한다 — max-width 가 적용된
 * 본문 컨테이너 안에서 호출하면 컨테이너 너비로 잘린다.
 * 각 에이전트 메뉴 페이지의 공통 헤더-아래 컨트롤 영역에서 재사용.
 */
export function PageToolbar({
  left,
  right,
  maxWidthClassName,
  className,
}: PageToolbarProps) {
  return (
    <div
      className={cn(
        "bg-canvas-primary/90 border-line-subtle sticky top-0 z-10 mb-4 w-full backdrop-blur",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex flex-wrap items-end justify-between gap-3 px-6 py-3 transition-[max-width] duration-300 ease-in-out",
          maxWidthClassName,
        )}
      >
        <div className="flex flex-wrap items-end gap-2">{left}</div>
        <div className="flex flex-wrap items-center gap-2 self-end">
          {right}
        </div>
      </div>
    </div>
  );
}
