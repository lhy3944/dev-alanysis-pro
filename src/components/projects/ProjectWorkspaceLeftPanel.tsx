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
  ArrowLeft,
  ChevronLeft,
  FileText,
  FlaskConical,
  GitCommit,
  LayoutDashboard,
  Monitor,
  PanelLeft,
  Settings,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ProjectWorkspaceSettingsDialog } from "./ProjectWorkspaceSettingsDialog";

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
            className="h-full shrink-0 overflow-hidden border-r border-line-primary bg-canvas-secondary"
          >
            <div className="flex h-full flex-col">
              {/* Header: back + collapse */}
              <div className="flex items-center gap-1 px-2 py-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="뒤로가기"
                      asChild
                    >
                      <Link href="/my-projects">
                        <ArrowLeft className="size-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>프로젝트 목록</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={toggleLeftSidebar}
                      aria-label="패널 접기"
                    >
                      <PanelLeft className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>패널 접기</TooltipContent>
                </Tooltip>
              </div>

              {/* Project info */}
              {currentProject && (
                <div className="border-b border-line-subtle px-4 pb-3">
                  <h2 className="text-fg-primary truncate text-sm font-semibold">
                    {currentProject.name}
                  </h2>
                  <div className="mt-1.5">
                    <Badge
                      variant="ghost"
                      className={cn(
                        ANALYSIS_TYPE_COLORS[currentProject.analysis_type],
                        "px-2 py-0.5 text-[10px]",
                      )}
                    >
                      {ANALYSIS_TYPE_LABELS[currentProject.analysis_type]}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Menu */}
              <nav className="flex-1 space-y-0.5 px-2 py-2">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={active ? "secondary" : "ghost"}
                          size="sm"
                          className={cn(
                            "w-full justify-start gap-2.5 rounded-md text-sm font-normal",
                            active
                              ? "text-fg-primary"
                              : "text-fg-secondary hover:text-fg-primary",
                          )}
                          asChild
                        >
                          <Link href={`${basePath}${item.href}`}>
                            <Icon
                              className={cn(
                                "size-4",
                                active
                                  ? "text-icon-active"
                                  : "text-icon-default",
                              )}
                            />
                            {item.label}
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </nav>

              {/* Footer: Settings */}
              <div className="border-t border-line-subtle px-2 py-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-fg-secondary hover:text-fg-primary w-full justify-start gap-2.5 rounded-md text-sm font-normal"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <Settings className="text-icon-default size-4" />
                      Settings
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
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
            className="h-full shrink-0 overflow-hidden border-r border-line-primary bg-canvas-secondary"
          >
            <div className="flex h-full flex-col items-center gap-1 px-1.5 py-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="뒤로가기"
                    asChild
                  >
                    <Link href="/my-projects">
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">프로젝트 목록</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggleLeftSidebar}
                    aria-label="패널 펼치기"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">패널 펼치기</TooltipContent>
              </Tooltip>

              <div className="border-line-subtle my-1 w-8 border-t" />

              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={active ? "secondary" : "ghost"}
                        size="icon-sm"
                        className={cn(active && "text-fg-primary")}
                        aria-label={item.label}
                        asChild
                      >
                        <Link href={`${basePath}${item.href}`}>
                          <Icon
                            className={cn(
                              "size-4",
                              active ? "text-icon-active" : "text-icon-default",
                            )}
                          />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              })}

              <div className="mt-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Settings"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <Settings className="text-icon-default size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectWorkspaceSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </>
  );
}
