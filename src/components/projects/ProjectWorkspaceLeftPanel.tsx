"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ANALYSIS_TYPE_COLORS,
  ANALYSIS_TYPE_LABELS,
} from "@/constants/project";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import { useProjectStore } from "@/stores/project-store";
import {
  Activity,
  Box,
  ChevronLeft,
  CircleHelp,
  FileText,
  FlaskConical,
  GitCommit,
  LayoutDashboard,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SettingsDialog } from "@/components/overlay/SettingsDialog";

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "" },
  {
    id: "code-impact",
    label: "Code Impact Analysis",
    icon: Activity,
    href: "/code-impact",
  },
  {
    id: "requirement",
    label: "Requirement",
    icon: FileText,
    href: "/requirement",
  },
  {
    id: "unit-test",
    label: "Unit Test",
    icon: FlaskConical,
    href: "/unit-test",
  },
  {
    id: "system-test",
    label: "System Test",
    icon: Monitor,
    href: "/system-test",
  },
  {
    id: "commit-history",
    label: "Commit History",
    icon: GitCommit,
    href: "/commit-history",
  },
];

export function ProjectWorkspaceLeftPanel() {
  const leftSidebarOpen = usePanelStore((s) => s.leftSidebarOpen);
  const toggleLeftSidebar = usePanelStore((s) => s.toggleLeftSidebar);
  const currentProject = useProjectStore((s) => s.currentProject);
  const pathname = usePathname();
  const basePath = currentProject
    ? `/projects/${currentProject.project_id}`
    : "";
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(
          textRef.current.scrollWidth > textRef.current.clientWidth
        );
      }
    };

    checkTruncation();

    const timer = setTimeout(checkTruncation, 100);

    window.addEventListener("resize", checkTruncation);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkTruncation);
    };
  }, [currentProject?.name, leftSidebarOpen]);

  const isActive = (href: string) => {
    if (href === "") return pathname === basePath;
    return pathname.startsWith(`${basePath}${href}`);
  };

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
            <div className="flex h-full w-[220px] flex-col">
              {/* Header: back link + collapse button */}
              <div className="flex items-center justify-between px-3 py-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-fg-primary flex items-center gap-1.5"
                  asChild
                >
                  <Link href="/my-projects">
                    <ChevronLeft className="size-5" />
                    <span className="text-sm font-medium">WORKSPACE</span>
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

              {/* Project info wrapped in a border box */}
              {currentProject && (
                <div className="px-3 py-2">
                  <div className="border border-line-subtle rounded-lg p-3 bg-canvas-surface-2/20 flex flex-col gap-2.5">
                    {/* Row 1: Box icon + Project Name */}
                    <div className="flex items-center gap-2">
                      <Box className="size-4 text-icon-default shrink-0" />
                      {isTruncated ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h2
                              ref={textRef}
                              className="text-fg-primary truncate text-sm font-semibold leading-none cursor-help"
                            >
                              {currentProject.name}
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px] break-all">
                            {currentProject.name}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <h2
                          ref={textRef}
                          className="text-fg-primary truncate text-sm font-semibold leading-none"
                        >
                          {currentProject.name}
                        </h2>
                      )}
                    </div>
                    {/* Row 2: analysisType (w-full single line) */}
                    <div className="w-full">
                      <Badge
                        variant="ghost"
                        className={cn(
                          ANALYSIS_TYPE_COLORS[currentProject.analysis_type],
                          "w-full justify-center px-2 py-0.5 text-[10px] rounded-sm",
                        )}
                      >
                        {ANALYSIS_TYPE_LABELS[currentProject.analysis_type]}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 space-y-px pl-2 py-2">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.id}
                      href={`${basePath}${item.href}`}
                      className={cn(
                        "group relative flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-normal transition-colors rounded-none",
                        active
                          ? "bg-canvas-surface-2 text-fg-primary"
                          : "text-fg-secondary hover:bg-canvas-surface-2 hover:text-fg-primary",
                      )}
                    >
                      {active && (
                        <div className="absolute top-0 left-0 h-full w-[3px] bg-white" />
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
            <div className="flex h-full w-[60px] flex-col items-center gap-2 py-3">
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
                    aria-label="workspace 나가기"
                    className="size-8"
                    asChild
                  >
                    <Link href="/my-projects">
                      <ChevronLeft className="size-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">workspace 나가기</TooltipContent>
              </Tooltip>

              <div className="border-line-subtle my-1 w-8 border-t" />

              <nav className="w-full space-y-px px-2 py-2">
                {MENU_ITEMS.map((item) => {
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
                              ? "bg-canvas-surface-2 text-fg-primary"
                              : "text-fg-secondary hover:bg-canvas-surface-2 hover:text-fg-primary",
                          )}
                          aria-label={item.label}
                        >
                          {active && (
                            <div className="absolute top-0 left-0 h-full w-[3px] bg-white" />
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
