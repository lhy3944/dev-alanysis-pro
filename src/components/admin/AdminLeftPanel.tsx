"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ADMIN_MENU_ITEMS } from "@/config/admin-navigation";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import { SettingsDialog } from "@/components/overlay/SettingsDialog";
import {
  ChevronLeft,
  CircleHelp,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Shield,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminLeftPanelProps {
  /**
   * 외부에서 강제로 렌더 상태를 지정. ResponsiveLeftPanelHost 가 태블릿/모바일에서 사용.
   * - "expanded": 220 펼침 강제
   * - "rail": 60 레일 강제
   * - undefined: store 의 leftSidebarOpen 따라 자체 결정 (데스크탑 기본)
   */
  state?: "expanded" | "rail";
}

export function AdminLeftPanel({ state }: AdminLeftPanelProps = {}) {
  const storeOpen = usePanelStore((s) => s.leftSidebarOpen);
  const leftSidebarOpen =
    state === undefined ? storeOpen : state === "expanded";
  const toggleLeftSidebar = usePanelStore((s) => s.toggleLeftSidebar);
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/usage-overview" && pathname === "/admin") return true;
    return pathname.startsWith(`/admin${href}`);
  };

  // Forced state: 부모(Sheet/overlay) 가 폭을 결정하므로 motion.div 의 width 도 100% 로 따라간다.
  const expandedWidth = state === undefined ? 220 : "100%";
  const collapsedWidth = state === undefined ? 60 : "100%";

  return (
    <>
      <AnimatePresence mode="popLayout">
        {leftSidebarOpen ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: expandedWidth,
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
            <div className="flex h-full w-full flex-col">
              <div className="flex items-center justify-between px-3 py-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-fg-primary flex items-center gap-1.5"
                  asChild
                >
                  <Link href="/my-projects">
                    <ChevronLeft className="size-5" />
                    <span className="text-sm font-medium">ADMIN</span>
                  </Link>
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={toggleLeftSidebar}
                      aria-label="패널 닫기"
                      className="text-icon-default hover:text-icon-active size-8"
                    >
                      <PanelLeftClose className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">패널 닫기</TooltipContent>
                </Tooltip>
              </div>

              <div className="px-3 py-2">
                <div className="border border-line-subtle rounded-lg p-3 bg-canvas-primary flex items-center gap-2">
                  <Shield className="size-4 text-icon-default shrink-0" />
                  <span className="text-fg-primary text-sm font-semibold">Admin Console</span>
                </div>
              </div>

              <nav className="flex-1 space-y-px pl-2 py-2">
                {ADMIN_MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.id}
                      href={`/admin${item.href}`}
                      className={cn(
                        "group relative flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-normal transition-colors rounded-none",
                        active
                          ? "bg-canvas-surface-3 text-fg-primary"
                          : "text-fg-secondary hover:bg-canvas-surface-3 hover:text-fg-primary",
                      )}
                    >
                      {active && (
                        <div className="absolute top-0 left-0 h-full w-[3px] bg-brand-primary dark:bg-fg-primary" />
                      )}
                      <Icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          active
                            ? "text-blue-600 dark:text-blue-500"
                            : "text-icon-default group-hover:text-icon-active",
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-line-subtle mt-auto flex items-center justify-center gap-4 pt-3 pb-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Settings"
                  className="text-icon-default hover:text-icon-active size-8"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Help"
                  className="text-icon-default hover:text-icon-active size-8"
                >
                  <CircleHelp className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: collapsedWidth,
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
            <div className="flex h-full w-full flex-col items-center gap-2 py-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggleLeftSidebar}
                    aria-label="패널 열기"
                    className="text-icon-default hover:text-icon-active size-8"
                  >
                    <PanelLeftOpen className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">패널 열기</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="admin 나가기"
                    className="size-8"
                    asChild
                  >
                    <Link href="/my-projects">
                      <ChevronLeft className="size-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">admin 나가기</TooltipContent>
              </Tooltip>

              <div className="border-line-subtle my-1 w-8 border-t" />

              <nav className="w-full space-y-px px-2 py-2">
                {ADMIN_MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/admin${item.href}`}
                          className={cn(
                            "group relative flex w-full items-center justify-center py-2.5 transition-colors rounded-none",
                            active
                              ? "bg-canvas-surface-3 text-fg-primary"
                              : "text-fg-secondary hover:bg-canvas-surface-3 hover:text-fg-primary",
                          )}
                          aria-label={item.label}
                        >
                          {active && (
                            <div className="absolute top-0 left-0 h-full w-[3px] bg-brand-primary dark:bg-fg-primary" />
                          )}
                          <Icon
                            className={cn(
                              "size-4 shrink-0 transition-colors",
                              active
                                ? "text-blue-600 dark:text-blue-500"
                                : "text-icon-default group-hover:text-icon-active",
                            )}
                          />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </nav>

              <div className="mt-auto flex flex-col items-center gap-2 pb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Settings"
                      className="text-icon-default hover:text-icon-active size-8"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <Settings className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Help"
                      className="text-icon-default hover:text-icon-active size-8"
                    >
                      <CircleHelp className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Help</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
