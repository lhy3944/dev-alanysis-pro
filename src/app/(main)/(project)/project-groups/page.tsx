"use client";

import { ProjectGroupCard } from "@/components/projects/ProjectGroupCard";
import { ProjectListError } from "@/components/projects/ProjectListError";
import { ProjectGroupListSkeleton } from "@/components/projects/ProjectGroupListSkeleton";
import { ProjectToolbar } from "@/components/projects/ProjectToolbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { layoutMaxW } from "@/config/layout";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { projectGroupService } from "@/services/project-group-service";
import { usePanelStore } from "@/stores/panel-store";
import type { ProjectGroup } from "@/types/project";
import { FolderOpen, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ProjectGroupsPage() {
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);
  const [groups, setGroups] = useState<ProjectGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectGroupService.list();
      setGroups(data.groups);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "프로젝트 그룹 목록을 불러올 수 없습니다.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groups;

    return groups.filter((group) => {
      const groupNameMatch = group.name.toLowerCase().includes(query);
      const groupDescMatch = group.description?.toLowerCase().includes(query) ?? false;
      const projectsMatch = group.projects.some(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          (project.description?.toLowerCase().includes(query) ?? false)
      );

      return groupNameMatch || groupDescMatch || projectsMatch;
    });
  }, [groups, search]);

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
          disabled={isLoading && groups.length === 0}
        />

        {isLoading ? (
          <ProjectGroupListSkeleton />
        ) : error ? (
          <ProjectListError message={error} onRetry={fetchGroups} />
        ) : filteredGroups.length === 0 ? (
          search ? (
            <EmptyState
              icon={Search}
              title="검색 결과가 없습니다"
              description="다른 검색어로 시도해 보세요."
            />
          ) : (
            <EmptyState
              icon={FolderOpen}
              title="프로젝트 그룹이 없습니다"
              description="아직 등록된 프로젝트 그룹이 없습니다."
            />
          )
        ) : (
          <div className="animate-in fade-in flex flex-col gap-5 duration-300">
            {filteredGroups.map((group) => (
              <ProjectGroupCard
                key={group.group_id}
                group={group}
                initialExpanded={!!search.trim()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
