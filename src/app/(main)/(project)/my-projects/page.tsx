"use client";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectListError } from "@/components/projects/ProjectListError";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { ProjectListSkeleton } from "@/components/projects/ProjectListSkeleton";
import { ProjectToolbar } from "@/components/projects/ProjectToolbar";
import { layoutMaxW } from "@/config/layout";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { projectService } from "@/services/project-service";
import { usePanelStore } from "@/stores/panel-store";
import { useProjectStore } from "@/stores/project-store";
import type { AnalysisType } from "@/types/project";
import { Box, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const LIFECYCLE_ORDER: Record<string, number> = {
  published: 0,
  draft: 1,
  deleted: 2,
};

export default function MyProjectsPage() {
  const { projects, setProjects, isLoading, error, setLoading, setError } =
    useProjectStore();
  const viewMode = useProjectStore((s) => s.viewMode);
  const setViewMode = useProjectStore((s) => s.setViewMode);
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [analysisTypeFilter, setAnalysisTypeFilter] = useState<
    AnalysisType | "all"
  >("all");

  const filteredProjects = useMemo(() => {
    const filtered = projects
      .filter((p) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        return (
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
        );
      })
      .filter((p) => {
        if (analysisTypeFilter === "all") return true;
        return p.analysis_type === analysisTypeFilter;
      });

    return [...filtered].sort((a, b) => {
      const orderDiff =
        LIFECYCLE_ORDER[a.lifecycle_status] -
        LIFECYCLE_ORDER[b.lifecycle_status];
      if (orderDiff !== 0) return orderDiff;
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
  }, [projects, search, analysisTypeFilter]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.list();
      setProjects(data.projects);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "프로젝트 목록을 불러올 수 없습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [setProjects, setLoading, setError]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className={cn(
          "mx-auto p-6 transition-[max-width] duration-300 ease-in-out",
          layoutMaxW(fullWidthMode),
        )}
      >
        <ProjectToolbar
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearch={() => setSearch(searchInput)}
          analysisTypeFilter={analysisTypeFilter}
          onAnalysisTypeFilterChange={setAnalysisTypeFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          disabled={projects.length === 0}
        />

        {isLoading ? (
          <ProjectListSkeleton />
        ) : error ? (
          <ProjectListError message={error} onRetry={fetchProjects} />
        ) : filteredProjects.length === 0 ? (
          search ? (
            <div className="animate-in fade-in flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center text-center duration-300">
              <div className="bg-canvas-surface mb-4 flex size-16 items-center justify-center rounded-full">
                <Search className="text-fg-muted size-6" />
              </div>
              <h2 className="text-fg-primary text-base font-medium">
                검색 결과가 없습니다
              </h2>
              <p className="text-fg-secondary text-sm">
                다른 검색어로 시도해 보세요.
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center text-center duration-300">
              <div className="bg-canvas-surface mb-4 flex size-16 items-center justify-center rounded-full">
                <Box className="text-fg-muted size-6" />
              </div>
              <h2 className="text-fg-primary text-base font-medium">
                프로젝트가 없습니다
              </h2>
              <p className="text-fg-secondary text-sm">
                아직 등록된 프로젝트가 없습니다.
              </p>
            </div>
          )
        ) : viewMode === "card" ? (
          <div
            className={cn(
              "animate-in fade-in grid gap-4 duration-300 sm:grid-cols-2",
              fullWidthMode
                ? "xl:grid-cols-4 lg:grid-cols-3"
                : "lg:grid-cols-3",
            )}
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in flex flex-col gap-2 duration-300">
            {filteredProjects.map((project) => (
              <ProjectListItem key={project.project_id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
