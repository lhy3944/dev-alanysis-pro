"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ANALYSIS_TYPE_LABELS, LIFECYCLE_LABELS } from "@/constants/project";
import { cn } from "@/lib/utils";
import type { AnalysisType, ProjectLifecycleStatus } from "@/types/project";
import { Grid2X2, Search, TextAlignJustify } from "lucide-react";

interface ProjectGroupFilterToolbarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  lifecycleStatusFilter: ProjectLifecycleStatus | "all";
  onLifecycleStatusFilterChange: (value: ProjectLifecycleStatus | "all") => void;
  analysisTypeFilter: AnalysisType | "all";
  onAnalysisTypeFilterChange: (value: AnalysisType | "all") => void;
  analysisTypes: AnalysisType[];
  viewMode: "card" | "list";
  onViewModeChange: (mode: "card" | "list") => void;
}

export function ProjectGroupFilterToolbar({
  searchInput,
  onSearchInputChange,
  lifecycleStatusFilter,
  onLifecycleStatusFilterChange,
  analysisTypeFilter,
  onAnalysisTypeFilterChange,
  analysisTypes,
  viewMode,
  onViewModeChange,
}: ProjectGroupFilterToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 pb-4">
      <div className="group/search focus-within:border-accent-primary flex w-60 rounded-xs border border-input bg-canvas-primary shadow-xs transition-colors">
        <Input
          placeholder="그룹 내 프로젝트 검색"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          className="border-0 bg-transparent focus-visible:border-0 focus-visible:ring-0"
        />
        <div className="text-fg-muted flex shrink-0 items-center border-l border-input px-2">
          <Search className="size-3.5" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={lifecycleStatusFilter}
          onValueChange={(v) =>
            onLifecycleStatusFilterChange(v as ProjectLifecycleStatus | "all")
          }
        >
          <SelectTrigger className="h-8 w-[120px] rounded-xs text-xs">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start">
            <SelectItem value="all">전체 상태</SelectItem>
            {Object.entries(LIFECYCLE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={analysisTypeFilter}
          onValueChange={(v) =>
            onAnalysisTypeFilterChange(v as AnalysisType | "all")
          }
        >
          <SelectTrigger className="h-8 w-[140px] rounded-xs text-xs">
            <SelectValue placeholder="분석 타입" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start">
            <SelectItem value="all">전체 타입</SelectItem>
            {analysisTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {ANALYSIS_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex h-8 items-center rounded-xs border border-input bg-canvas-primary shadow-xs overflow-hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onViewModeChange("card")}
                aria-label="카드 뷰"
                className={cn(
                  "h-full rounded-none border-0 transition-colors",
                  viewMode === "card"
                    ? "bg-canvas-surface-2 text-icon-active hover:bg-canvas-surface-2"
                    : "text-icon-default hover:bg-canvas-surface hover:text-icon-active",
                )}
              >
                <Grid2X2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>카드 보기</TooltipContent>
          </Tooltip>

          <div className="h-full w-px bg-line-subtle" aria-hidden />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onViewModeChange("list")}
                aria-label="리스트 뷰"
                className={cn(
                  "h-full rounded-none border-0 transition-colors",
                  viewMode === "list"
                    ? "bg-canvas-surface-2 text-icon-active hover:bg-canvas-surface-2"
                    : "text-icon-default hover:bg-canvas-surface hover:text-icon-active",
                )}
              >
                <TextAlignJustify />
              </Button>
            </TooltipTrigger>
            <TooltipContent>리스트 보기</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
