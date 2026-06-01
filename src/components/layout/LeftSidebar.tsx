"use client";

import { useState } from "react";
import { ThreadList } from "@/components/chat/ThreadList";
import { SettingsDialog } from "@/components/overlay/SettingsDialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatStore } from "@/stores/chat-store";
import { usePanelStore } from "@/stores/panel-store";
import { SIDEBAR_ACTIONS } from "@/config/navigation";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from "lucide-react";

interface LeftSidebarProps {
  /**
   * 렌더 상태를 지정. ResponsiveLeftPanelHost 가 결정해 넘긴다.
   * 콘텐츠는 부모 컨테이너 폭을 채우고, width 트랜지션은 호스트가 소유한다.
   * - "expanded": 펼침 콘텐츠
   * - "rail": 레일 콘텐츠
   * - undefined: store 의 leftSidebarOpen 따라 자체 결정 (방어적 fallback)
   */
  state?: "expanded" | "rail";
}

export function LeftSidebar({ state }: LeftSidebarProps = {}) {
  const createThread = useChatStore((s) => s.createThread);
  const storeOpen = usePanelStore((s) => s.leftSidebarOpen);
  const leftSidebarOpen =
    state === undefined ? storeOpen : state === "expanded";
  const toggleLeftSidebar = usePanelStore((s) => s.toggleLeftSidebar);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const actionHandlers: Record<string, () => void> = {
    settings: () => setSettingsOpen(true),
  };

  const BOTTOM_ICONS = SIDEBAR_ACTIONS.map((action) => ({
    ...action,
    onClick: actionHandlers[action.id] ?? (() => {}),
  }));

  const expandedContent = (
    <div className="flex h-full w-full flex-col gap-2 pl-3 py-1.5">
      <div className="flex items-center justify-between">
        <Button
          onClick={createThread}
          className="flex items-center gap-1.5 text-fg-primary"
          variant="ghost"
        >
          <Plus className="h-5 w-5" />
          <span className="text-[13px] font-medium">새 대화</span>
        </Button>
        <Button
          onClick={toggleLeftSidebar}
          variant="ghost"
          size="icon"
          className="text-icon-default hover:text-icon-active"
        >
          <PanelLeftClose className="h-5 w-5" />
        </Button>
      </div>

      <ThreadList />

      <div className="mt-auto flex items-center justify-center gap-4 border-t border-line-primary pt-3">
        {BOTTOM_ICONS.map(({ icon: Icon, label, onClick }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-icon-default hover:text-icon-active"
                onClick={onClick}
              >
                <Icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );

  const railContent = (
    <div className="flex h-full w-full flex-col items-center justify-between border-r py-4">
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={toggleLeftSidebar}
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-icon-default hover:text-icon-active"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={createThread}
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-icon-default hover:text-icon-active"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">새 대화</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-col items-center gap-2">
        {BOTTOM_ICONS.map(({ icon: Icon, label, onClick }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-icon-default hover:text-icon-active"
                onClick={onClick}
              >
                <Icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );

  // width 트랜지션은 호스트(ResponsiveLeftPanelHost)가 단독으로 소유한다.
  // 패널은 펼침/레일 콘텐츠만 즉시 렌더한다.
  return (
    <>
      <div className="h-full w-full overflow-hidden">
        {leftSidebarOpen ? expandedContent : railContent}
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
