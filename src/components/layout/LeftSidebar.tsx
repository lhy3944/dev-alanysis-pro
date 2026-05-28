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
import { AnimatePresence, motion } from "motion/react";

interface LeftSidebarProps {
  /**
   * 외부에서 강제로 렌더 상태를 지정. ResponsiveLeftPanelHost 가 태블릿/모바일에서 사용.
   * - "expanded": 220 펼침 강제 (콘텐츠는 부모 컨테이너 폭을 채움)
   * - "rail": 60 레일 강제 (콘텐츠는 부모 컨테이너 폭을 채움)
   * - undefined: store 의 leftSidebarOpen 따라 자체 결정 + 애니메이션 (데스크탑 기본)
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

  // Forced state: 부모 컨테이너가 폭을 결정하므로 motion.div width 애니메이션 우회.
  if (state !== undefined) {
    return (
      <>
        <div className="h-full w-full overflow-hidden">
          {leftSidebarOpen ? expandedContent : railContent}
        </div>
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </>
    );
  }

  return (
    <>
      <AnimatePresence mode="popLayout">
        {leftSidebarOpen ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: 220,
              opacity: 1,
              transition: { type: "spring", stiffness: 400, damping: 30 },
            }}
            exit={{
              width: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            className="h-full shrink-0 overflow-hidden"
          >
            {expandedContent}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: 60,
              opacity: 1,
              transition: { type: "spring", stiffness: 400, damping: 30 },
            }}
            exit={{
              width: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            className="h-full shrink-0 overflow-hidden"
          >
            {railContent}
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
