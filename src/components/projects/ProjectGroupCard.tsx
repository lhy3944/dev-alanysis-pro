"use client";

import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectGroupPagination } from "@/components/projects/ProjectGroupPagination";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { ProjectToolbar } from "@/components/projects/ProjectToolbar";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AnalysisType, ProjectGroup, ProjectLifecycleStatus } from "@/types/project";
import { ChevronDown, Package, Users, UserCog, Clock } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
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

const ITEMS_PER_PAGE = 12;

export const ProjectGroupCard = memo(function ProjectGroupCard({
  group,
  initialExpanded = false,
}: ProjectGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [lifecycleStatusFilter, setLifecycleStatusFilter] =
    useState<ProjectLifecycleStatus | "all">("all");
  const [analysisTypeFilter, setAnalysisTypeFilter] =
    useState<AnalysisType | "all">("all");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsExpanded(initialExpanded);
    if (!initialExpanded) {
      setSearchKeyword("");
      setLifecycleStatusFilter("all");
      setAnalysisTypeFilter("all");
      setCurrentPage(1);
    }
  }, [initialExpanded]);

  const derivedAnalysisTypes = useMemo(() => {
    if (!group.projects) return [];
    const types = new Set(group.projects.map((p) => p.analysis_type));
    return Array.from(types);
  }, [group.projects]);

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

  const filteredProjects = useMemo(() => {
    return sortedProjects.filter((p) => {
      const query = searchKeyword.trim().toLowerCase();
      if (
        query &&
        !p.name.toLowerCase().includes(query) &&
        !(p.description?.toLowerCase().includes(query) ?? false)
      ) {
        return false;
      }
      if (
        lifecycleStatusFilter !== "all" &&
        p.lifecycle_status !== lifecycleStatusFilter
      ) {
        return false;
      }
      if (
        analysisTypeFilter !== "all" &&
        p.analysis_type !== analysisTypeFilter
      ) {
        return false;
      }
      return true;
    });
  }, [sortedProjects, searchKeyword, lifecycleStatusFilter, analysisTypeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handleFilterChange = useCallback(
    <T,>(setter: (value: T) => void, value: T) => {
      setter(value);
      setCurrentPage(1);
    },
    [],
  );

  return (
    <div
      className={cn(
        "bg-canvas-primary rounded-lg border transition-all duration-300",
        isExpanded
          ? "shadow-md border-accent-primary/30"
          : "border-line-subtle hover:border-accent-primary/25 hover:shadow-xs",
      )}
    >
      <button
        onClick={() => {
          const nextExpanded = !isExpanded;
          setIsExpanded(nextExpanded);
          if (!nextExpanded) {
            setSearchKeyword("");
            setLifecycleStatusFilter("all");
            setAnalysisTypeFilter("all");
            setCurrentPage(1);
          }
        }}
        aria-expanded={isExpanded}
        className="flex w-full flex-col text-left p-6 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 rounded-lg group"
      >
        <div className="mb-3 flex items-start justify-between gap-4 w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
                isExpanded
                  ? "bg-accent-primary/20 text-accent-primary shadow-sm shadow-accent-primary/15 scale-105 ring-1 ring-accent-primary/20"
                  : "bg-accent-primary/10 text-accent-primary group-hover:scale-105",
              )}
            >
              <Package
                className={cn(
                  "size-5 transition-all duration-300",
                  isExpanded
                    ? "fill-accent-primary/25 stroke-current"
                    : "fill-accent-primary/10 stroke-current",
                )}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h3 className="text-fg-primary truncate text-base font-semibold">
                  {group.name}
                </h3>
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
              isExpanded ? "" : "line-clamp-2",
            )}
          >
            {group.description}
          </p>
        )}

        <div className="text-fg-muted border-line-primary flex items-center justify-end gap-3.5 border-t border-dotted w-full pt-4 text-[12px]">
          <div className="flex items-center gap-1" title={`관리자 ${group.manager_count}명`}>
            <UserCog className="size-4 text-fg-muted" />
            <span className="font-semibold text-fg-secondary">{group.manager_count}</span>
          </div>
          <div className="flex items-center gap-1 border-l border-line-primary/50 pl-3.5">
            <Users className="size-4 text-fg-muted" />
            <span className="font-semibold text-fg-secondary">{group.member_count}</span>
          </div>
          <div className="flex items-center gap-1 border-l border-line-primary/50 pl-3.5">
            <Clock className="size-4 text-fg-muted" />
            <span className="font-semibold text-fg-secondary">{formatRelativeTime(group.updated_at)}</span>
          </div>
        </div>
      </button>

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
            <div className="border-line-subtle border-t bg-canvas-secondary px-6 pb-6 pt-5 rounded-b-lg">
              {sortedProjects.length > 0 ? (
                <div className="flex flex-col">
                  <ProjectToolbar
                    size="sm"
                    searchPlaceholder="그룹 내 프로젝트 검색"
                    searchInput={searchKeyword}
                    onSearchInputChange={(v) =>
                      handleFilterChange(setSearchKeyword, v)
                    }
                    lifecycleStatusFilter={lifecycleStatusFilter}
                    onLifecycleStatusFilterChange={(v) =>
                      handleFilterChange(setLifecycleStatusFilter, v)
                    }
                    analysisTypeFilter={analysisTypeFilter}
                    onAnalysisTypeFilterChange={(v) =>
                      handleFilterChange(setAnalysisTypeFilter, v)
                    }
                    analysisTypes={derivedAnalysisTypes}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />

                  {filteredProjects.length === 0 ? (
                    <div className="text-fg-muted py-8 text-center text-sm">
                      조건에 맞는 프로젝트가 없습니다.
                    </div>
                  ) : viewMode === "card" ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {paginatedProjects.map((project) => (
                        <div
                          key={project.project_id}
                          className="transition-transform duration-200 hover:-translate-y-0.5"
                        >
                          <ProjectCard project={project} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {paginatedProjects.map((project) => (
                        <ProjectListItem
                          key={project.project_id}
                          project={project}
                        />
                      ))}
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                      <ProjectGroupPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredProjects.length}
                        pageSize={ITEMS_PER_PAGE}
                      />
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
