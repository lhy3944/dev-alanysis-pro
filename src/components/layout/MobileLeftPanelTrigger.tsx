"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import { PanelLeftOpen } from "lucide-react";

interface MobileLeftPanelTriggerProps {
  className?: string;
}

/**
 * 모바일에서만 노출되는 좌측 패널 토글 버튼.
 * 현재 라우트의 레이아웃이 `useRegisterLeftSidebar` 로 등록했을 때만 보인다.
 * 페이지 내 toolbar 등 canvas-primary 위에 배치되는 것을 가정한 중립 스타일.
 */
export function MobileLeftPanelTrigger({
  className,
}: MobileLeftPanelTriggerProps) {
  const hasLeftSidebar = usePanelStore((s) => s.hasLeftSidebar);
  const leftSidebarLabel = usePanelStore((s) => s.leftSidebarLabel);
  const isMobile = usePanelStore((s) => s.isMobile);
  const toggleLeftSidebar = usePanelStore((s) => s.toggleLeftSidebar);

  if (!isMobile || !hasLeftSidebar) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={toggleLeftSidebar}
      aria-label={`${leftSidebarLabel} 열기`}
      className={cn(
        "text-icon-default hover:text-icon-active",
        className,
      )}
    >
      <PanelLeftOpen className="size-4" />
    </Button>
  );
}
