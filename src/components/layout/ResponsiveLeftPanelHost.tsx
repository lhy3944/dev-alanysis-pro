"use client";

import { useRegisterLeftSidebar } from "@/hooks/useRegisterLeftSidebar";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { type ReactNode } from "react";

export type LeftPanelState = "expanded" | "rail";

interface ResponsiveLeftPanelHostProps {
  /**
   * 모바일 드로어의 헤더/aria 라벨. panel-store 에도 등록되어 Header 트리거의
   * aria-label 로도 사용된다. (예: "프로젝트 워크스페이스 메뉴")
   */
  label: string;
  /**
   * 패널 컴포넌트를 렌더링하는 함수.
   * - `state === undefined` 면 패널이 자체 store 상태를 사용 (데스크탑 push 모드).
   * - `state === "rail"` 이면 60px 아이콘 레일 강제 렌더 (태블릿 inline).
   * - `state === "expanded"` 이면 220px 펼침 강제 렌더 (태블릿 overlay / 모바일 sheet).
   */
  render: (state?: LeftPanelState) => ReactNode;
  /** inline 영역(레일/펼침 push)의 컨테이너 className 보정용 */
  className?: string;
}

/**
 * 뷰포트 카테고리에 따라 좌측 사이드바 패턴을 전환:
 * - Desktop (≥1024px): 220 ↔ 60 push (기존 동작)
 * - Tablet (768–1023px): 60px 레일 항상 inline, 펼침은 본문 위 overlay (push 없음)
 * - Mobile (<768px): inline 영역 없음. Header 트리거가 Sheet drawer 를 연다.
 *
 * 부모 컨테이너는 반드시 `relative` 여야 한다 — 태블릿 overlay 가 그 안에서 absolute 로 배치된다.
 */
export function ResponsiveLeftPanelHost({
  label,
  render,
  className,
}: ResponsiveLeftPanelHostProps) {
  useRegisterLeftSidebar(label);

  const isMobile = usePanelStore((s) => s.isMobile);
  const isTablet = usePanelStore((s) => s.isTablet);
  const leftSidebarOpen = usePanelStore((s) => s.leftSidebarOpen);
  const setLeftSidebarOpen = usePanelStore((s) => s.setLeftSidebarOpen);

  // 모바일: inline 영역은 폭 0, 실제 콘텐츠는 Sheet 안에서 표시
  if (isMobile) {
    return (
      <Sheet
        open={leftSidebarOpen}
        onOpenChange={setLeftSidebarOpen}
      >
        <SheetContent
          side="left"
          showCloseButton={false}
          className="!w-screen !max-w-none gap-0 overflow-hidden border-line-primary bg-canvas-primary p-0"
        >
          <SheetTitle className="sr-only">{label}</SheetTitle>
          <div className="flex h-full w-full flex-col overflow-hidden">
            {render("expanded")}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // 태블릿: 60 레일 inline + 펼침은 overlay
  if (isTablet) {
    return (
      <>
        <div
          className={cn(
            "w-[60px] shrink-0 overflow-hidden border-r border-line-primary bg-canvas-surface",
            className,
          )}
        >
          {render("rail")}
        </div>
        {leftSidebarOpen && (
          <>
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setLeftSidebarOpen(false)}
              className="absolute inset-0 z-20 cursor-default bg-black/30"
            />
            <div
              className={cn(
                "absolute inset-y-0 left-0 z-30 w-[220px] overflow-hidden border-r border-line-primary bg-canvas-surface shadow-lg",
                className,
              )}
            >
              {render("expanded")}
            </div>
          </>
        )}
      </>
    );
  }

  // 데스크탑: 기존 push 동작 — 패널이 store 를 직접 구독해 220/60 애니메이트
  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden border-r border-line-primary bg-canvas-surface transition-[width] duration-300 ease-in-out",
        leftSidebarOpen ? "w-[220px]" : "w-[60px]",
        className,
      )}
    >
      {render()}
    </div>
  );
}
