"use client";

import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { MobileLeftPanelTrigger } from "@/components/layout/MobileLeftPanelTrigger";
import { MobileRightDrawer } from "@/components/layout/MobileRightDrawer";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { PanelToggleBar } from "@/components/layout/PanelToggleBar";
import { ResizeHandle } from "@/components/layout/ResizeHandle";
import { ResponsiveLeftPanelHost } from "@/components/layout/ResponsiveLeftPanelHost";
import { RightPanel } from "@/components/layout/RightPanel";
import { useResponsivePanel } from "@/hooks/useMediaQuery";
import { useResize } from "@/hooks/useResize";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import { useRef } from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { onPointerDown, isResizing } = useResize(containerRef, panelRef);

  const rightPanelOpen = usePanelStore((s) => s.rightPanelOpen);
  const rightPanelWidth = usePanelStore((s) => s.rightPanelWidth);

  useResponsivePanel();

  const showRightPanel = rightPanelOpen;

  return (
    <div className="flex flex-1 flex-col">
      <div
        ref={containerRef}
        className="relative flex flex-1 overflow-hidden"
      >
        <ResponsiveLeftPanelHost
          label="대화 목록"
          render={(state) => <LeftSidebar state={state} />}
          className="border-r-0"
        />

        {/* Content area */}
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-end px-2 py-1.5 sm:px-4">
            <MobileLeftPanelTrigger className="mr-auto" />
            <div className="flex items-center gap-1">
              <PanelToggleBar />
              <MobileRightDrawer />
            </div>
          </div>

          {children}
        </div>

        {/* ResizeHandle — 패널 바깥에 독립 배치 (잘림 방지) */}
        <div className="relative shrink-0 w-0 h-full hidden lg:block">
          <ResizeHandle
            isOpen={showRightPanel}
            isResizing={isResizing}
            onPointerDown={onPointerDown}
          />
        </div>

        {/* RightPanel (lg 이상에서만 표시) */}
        <div
          ref={panelRef}
          className={cn(
            "h-full shrink-0 overflow-hidden hidden lg:block",
            isResizing
              ? "transition-none"
              : "transition-[width] duration-300 ease-in-out",
          )}
          style={{ width: showRightPanel ? `${rightPanelWidth}%` : "0%" }}
          aria-hidden={!showRightPanel}
        >
          <RightPanel />
        </div>

        {/* NotificationPanel — Drawer overlay */}
        <NotificationPanel />
      </div>
    </div>
  );
}
