"use client";

import { Badge } from "@/components/ui/badge";
import {
  ANALYSIS_TYPE_COLORS,
  ANALYSIS_TYPE_LABELS,
  LIFECYCLE_COLORS,
  LIFECYCLE_LABELS,
} from "@/constants/project";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import { Box, Clock, Users } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = memo(function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.project_id}`}
      className="group border-line-subtle bg-canvas-primary hover:border-accent-primary/50 block rounded-lg border p-5 transition-all hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className="bg-brand-primary-soft flex size-9 shrink-0 items-center justify-center rounded-md">
          <Box className="text-brand-primary size-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-fg-primary truncate text-sm font-semibold">
            {project.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-1">
            <Badge
              variant="ghost"
              className={cn(
                LIFECYCLE_COLORS[project.lifecycle_status],
                "px-3 py-0.5 text-[10px]",
              )}
            >
              {LIFECYCLE_LABELS[project.lifecycle_status]}
            </Badge>
            <Badge
              variant="ghost"
              className={cn(
                ANALYSIS_TYPE_COLORS[project.analysis_type],
                "px-3 py-0.5 text-[10px]",
              )}
            >
              {ANALYSIS_TYPE_LABELS[project.analysis_type]}
            </Badge>
          </div>
        </div>
      </div>

      <p className="text-fg-secondary mb-3 line-clamp-2 min-h-[2lh] text-sm">
        {project.description}
      </p>

      <div className="text-fg-muted border-line-primary flex items-center justify-end gap-3.5 border-t border-dotted pt-4 text-[12px]">
        <span className="flex items-center gap-1" title={`멤버 ${project.member_count}명`}>
          <Users className="size-4 text-fg-muted" />
          <span className="font-semibold text-fg-secondary">{project.member_count}</span>
        </span>
        <span className="flex items-center gap-1 border-l border-line-primary/50 pl-3.5" title="최근 업데이트">
          <Clock className="size-4 text-fg-muted" />
          <span className="font-semibold text-fg-secondary">{formatRelativeTime(project.updated_at)}</span>
        </span>
      </div>
    </Link>
  );
});
