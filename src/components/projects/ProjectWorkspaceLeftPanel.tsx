"use client";

import { SettingsDialog } from "@/components/overlay/SettingsDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WORKSPACE_MENU_ITEMS } from "@/config/workspace-navigation";
import {
  ANALYSIS_TYPE_LABELS,
  ANALYSIS_TYPE_TEXT_COLORS,
} from "@/constants/project";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import { useProjectStore } from "@/stores/project-store";
import {
  Box,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  GitBranch,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MOCK_BRANCHES = [
  "main",
  "develop",
  "feature/auth",
  "release/v1.0",
  "hotfix/security",
] as const;

interface ProjectWorkspaceLeftPanelProps {
  /**
   * 렌더 상태를 지정. ResponsiveLeftPanelHost 가 결정해 넘긴다.
   * - "expanded": 펼침 콘텐츠
   * - "rail": 레일 콘텐츠
   * - undefined: store 의 leftSidebarOpen 따라 자체 결정 (방어적 fallback)
   */
  state?: "expanded" | "rail";
}

export function ProjectWorkspaceLeftPanel({
  state,
}: ProjectWorkspaceLeftPanelProps = {}) {
  const storeOpen = usePanelStore((s) => s.leftSidebarOpen);
  const leftSidebarOpen =
    state === undefined ? storeOpen : state === "expanded";
  const toggleLeftSidebar = usePanelStore((s) => s.toggleLeftSidebar);
  const currentProject = useProjectStore((s) => s.currentProject);
  const pathname = usePathname();
  const basePath = currentProject
    ? `/projects/${currentProject.project_id}`
    : "";
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>(
    currentProject?.branch ?? "main",
  );

  const isActive = (href: string) => {
    if (href === "") return pathname === basePath;
    return pathname.startsWith(`${basePath}${href}`);
  };

  // width 트랜지션은 호스트(ResponsiveLeftPanelHost)가 단독 소유한다.
  // 패널은 펼침/레일 콘텐츠만 즉시 렌더한다. (이중 애니메이션 제거)
  const expandedContent = (
    <div className="flex h-full w-full flex-col">
              {/* Header: back link + collapse button */}
              <div className="flex items-center justify-between px-3 py-2.5">
                <Link
                  href="/my-projects"
                  className="text-fg-secondary hover:text-fg-primary group inline-flex items-center gap-1 leading-none transition-colors"
                >
                  <ChevronLeft className="size-4 shrink-0 transition-colors group-hover:text-fg-primary" />
                  <span className="text-[12px] font-medium leading-none">
                    프로젝트 목록
                  </span>
                </Link>
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

              {/* Project info: 3행 stack (이름 / 분석 타입 / 브랜치) */}
              {!currentProject ? (
                <div className="border-line-subtle flex flex-col border-b px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="size-10 shrink-0 rounded-md" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-3/5" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-7 w-full rounded-md" />
                </div>
              ) : (
                <div className="border-line-subtle flex flex-col border-b px-3 py-2.5">
                  {/* 1행: 아이콘 + 이름 (2줄 line-clamp) — 아이콘 wrapper 높이가 2줄 텍스트와 매칭 */}
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="bg-brand-primary-soft flex size-8 shrink-0 items-center justify-center rounded-md">
                      <Box className="text-brand-primary size-4" />
                    </div>
                    <h2 className="text-fg-primary line-clamp-2 min-w-0 flex-1 text-sm font-semibold leading-snug">
                      {currentProject.name}
                    </h2>
                  </div>

                  {/* 2행: 분석 타입 — 배경 없는 텍스트 */}
                  <div
                    className={cn(
                      ANALYSIS_TYPE_TEXT_COLORS[currentProject.analysis_type],
                      "w-full truncate text-xs font-medium text-center",
                    )}
                  >
                    {ANALYSIS_TYPE_LABELS[currentProject.analysis_type]}
                  </div>

                  {/* 3행: 브랜치 셀렉터 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="border-line-default hover:bg-canvas-surface-2 text-fg-secondary focus-visible:ring-ring/40 flex w-full items-center gap-2.5 rounded-md border bg-transparent px-3 py-2 text-xs leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 mt-1.5"
                      >
                        <GitBranch className="size-3.5 shrink-0" />
                        <span className="text-fg-primary min-w-0 flex-1 truncate text-left">
                          {selectedBranch}
                        </span>
                        <ChevronDown className="size-3.5 shrink-0 opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[220px]">
                      <DropdownMenuLabel className="text-xs">
                        브랜치 전환
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {MOCK_BRANCHES.map((branch) => {
                        const isSelected = branch === selectedBranch;
                        return (
                          <DropdownMenuItem
                            key={branch}
                            onSelect={() => setSelectedBranch(branch)}
                            className="text-xs"
                          >
                            <GitBranch className="size-3 shrink-0" />
                            <span className="flex-1 truncate">{branch}</span>
                            {isSelected && (
                              <Check className="size-3.5 shrink-0" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {!currentProject ? (
                <nav className="flex-1 space-y-px pl-3 py-2">
                  {WORKSPACE_MENU_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5"
                    >
                      <Skeleton className="size-4 shrink-0 rounded-sm" />
                      <Skeleton className="h-3.5 w-24" />
                    </div>
                  ))}
                </nav>
              ) : (
                <nav className="flex-1 space-y-px pl-3 py-2">
                  {WORKSPACE_MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.id}
                        href={`${basePath}${item.href}`}
                        className={cn(
                          "group relative flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-normal transition-colors rounded-none",
                          active
                            ? "bg-canvas-surface-3 text-fg-primary"
                            : "text-fg-secondary hover:bg-canvas-surface-3 hover:text-fg-primary",
                        )}
                      >
                        {active && (
                          <div className="absolute top-0 left-0 h-full w-[3px] bg-brand-primary-hover dark:bg-fg-primary" />
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
              )}

              {/* Footer: Settings & Help */}
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
  );

  const railContent = (
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
                    aria-label="프로젝트 목록"
                    className="size-8"
                    asChild
                  >
                    <Link href="/my-projects">
                      <ChevronLeft className="size-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">프로젝트 목록</TooltipContent>
              </Tooltip>

              <div className="border-line-subtle my-1 w-8 border-t" />

              <nav className="w-full space-y-px px-2 py-2">
                {!currentProject
                  ? WORKSPACE_MENU_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        className="flex w-full items-center justify-center py-2.5"
                      >
                        <Skeleton className="size-4 rounded-sm" />
                      </div>
                    ))
                  : WORKSPACE_MENU_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            <Link
                              href={`${basePath}${item.href}`}
                              className={cn(
                                "group relative flex w-full items-center justify-center py-2.5 transition-colors rounded-none",
                                active
                                  ? "bg-canvas-surface-3 text-fg-primary"
                                  : "text-fg-secondary hover:bg-canvas-surface-3 hover:text-fg-primary",
                              )}
                              aria-label={item.label}
                            >
                              {active && (
                                <div className="absolute top-0 left-0 h-full w-[3px] bg-brand-primary-hover dark:bg-fg-primary" />
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
                          <TooltipContent side="right">
                            {item.label}
                          </TooltipContent>
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
  );

  return (
    <>
      <div className="h-full w-full overflow-hidden">
        {leftSidebarOpen ? expandedContent : railContent}
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
