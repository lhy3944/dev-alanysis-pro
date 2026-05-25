"use client";

import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProjectGroup } from "@/types/project";
import { ChevronDown, ChevronUp, Package, Users, UserCog, Clock } from "lucide-react";
import { memo, useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";

interface ProjectGroupCardProps {
  group: ProjectGroup;
  initialExpanded?: boolean;
}

const LIFECYCLE_ORDER: Record<string, number> = {
  published: 0,
  draft: 1,
  deleted: 2,
};

export const ProjectGroupCard = memo(function ProjectGroupCard({
  group,
  initialExpanded = false,
}: ProjectGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setIsExpanded(initialExpanded);
    if (!initialExpanded) {
      setShowAll(false);
    }
  }, [initialExpanded]);

  // 1. Sort projects inside the group to match 'My Projects' ordering
  const sortedProjects = useMemo(() => {
    if (!group.projects) return [];
    return [...group.projects].sort((a, b) => {
      const orderDiff =
        LIFECYCLE_ORDER[a.lifecycle_status] -
        LIFECYCLE_ORDER[b.lifecycle_status];
      if (orderDiff !== 0) return orderDiff;
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
  }, [group.projects]);

  // 1.5 Limit visible projects based on 'showAll' state for progressive disclosure (up to 6 projects by default)
  const visibleProjects = useMemo(() => {
    if (showAll) return sortedProjects;
    return sortedProjects.slice(0, 6);
  }, [sortedProjects, showAll]);

  return (
    <div
      className={cn(
        "border-line-primary bg-canvas-surface rounded-lg border transition-all duration-300",
        isExpanded
          ? "shadow-md ring-1 ring-accent-primary/10 border-accent-primary/30"
          : "hover:border-accent-primary/25 hover:shadow-xs"
      )}
    >
      {/* Header - Clickable for toggle */}
      <button
        onClick={() => {
          const nextExpanded = !isExpanded;
          setIsExpanded(nextExpanded);
          if (!nextExpanded) {
            setShowAll(false);
          }
        }}
        aria-expanded={isExpanded}
        className="flex w-full flex-col text-left p-6 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 rounded-lg group"
      >
        <div className="mb-3 flex items-start justify-between gap-4 w-full">
          <div className="flex items-center gap-3 min-w-0">
            {/* 2. Dynamic Package Icon style for active state (subtle highlight, no harsh solid color) */}
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
                isExpanded
                  ? "bg-accent-primary/20 text-accent-primary shadow-sm shadow-accent-primary/15 scale-105 ring-1 ring-accent-primary/20"
                  : "bg-accent-primary/10 text-accent-primary group-hover:scale-105"
              )}
            >
              <Package
                className={cn(
                  "size-5 transition-all duration-300",
                  isExpanded
                    ? "fill-accent-primary/25 stroke-current"
                    : "fill-accent-primary/10 stroke-current"
                )}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h3 className="text-fg-primary truncate text-base font-semibold">
                  {group.name}
                </h3>
                {/* 4. Padding of Chip label increased */}
                <Badge
                  variant="secondary"
                  className="bg-accent-primary/10 text-accent-primary border-none text-[11px] font-semibold px-2.5 py-1 shrink-0 rounded-full"
                >
                  {group.project_count}개 프로젝트
                </Badge>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="text-fg-muted hover:text-fg-primary flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-canvas-elevated transition-colors"
          >
            <ChevronDown className="size-5" />
          </motion.div>
        </div>

        {group.description && (
          <p
            className={cn(
              "text-fg-secondary mb-4 text-sm transition-all duration-300 leading-relaxed",
              isExpanded ? "" : "line-clamp-2"
            )}
          >
            {group.description}
          </p>
        )}

        {/* 3. Footer layout refined: Right-aligned, ordered: Manager -> Member -> Update, icons-only */}
        <div className="text-fg-muted border-line-primary flex items-center justify-end gap-3.5 border-t border-dotted w-full pt-4 text-[12px]">
          {/* Manager count */}
          <div className="flex items-center gap-1" title={`관리자 ${group.manager_count}명`}>
            <UserCog className="size-4 text-fg-muted" />
            <span className="font-semibold text-fg-secondary">{group.manager_count}</span>
          </div>
          {/* Member count */}
          <div className="flex items-center gap-1 border-l border-line-primary/50 pl-3.5">
            <Users className="size-4 text-fg-muted" />
            <span className="font-semibold text-fg-secondary">{group.member_count}</span>
          </div>
          {/* Last updated */}
          <div className="flex items-center gap-1 border-l border-line-primary/50 pl-3.5">
            <Clock className="size-4 text-fg-muted" />
            <span className="font-semibold text-fg-secondary">{formatRelativeTime(group.updated_at)}</span>
          </div>
        </div>
      </button>

      {/* Expanded Nested Projects Grid */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.2, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.25, ease: "easeIn" },
                opacity: { duration: 0.15 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="border-line-primary border-t border-dotted px-6 pb-6 pt-5 bg-canvas-elevated/40 rounded-b-lg">
              {/* 5. Removed "소속 프로젝트 목록" title for a cleaner layout */}
              {visibleProjects && visibleProjects.length > 0 ? (
                <div className="flex flex-col">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleProjects.map((project) => (
                      <div
                        key={project.project_id}
                        className="transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>

                  {sortedProjects.length > 6 && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-full border border-line-primary bg-canvas-surface hover:bg-canvas-elevated hover:border-accent-primary/30 text-fg-secondary hover:text-fg-primary transition-all duration-300 shadow-xs active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40"
                      >
                        {showAll ? (
                          <>
                            접기 <ChevronUp className="size-3.5" />
                          </>
                        ) : (
                          <>
                            {sortedProjects.length - 6}개 프로젝트 더보기 <ChevronDown className="size-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-fg-muted py-8 text-center text-sm">
                  이 그룹에 포함된 프로젝트가 없습니다.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
