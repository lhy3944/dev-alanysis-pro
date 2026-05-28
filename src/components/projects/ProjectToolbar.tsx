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

type Size = "md" | "sm";

interface ProjectToolbarProps {
  size?: Size;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  /** 있으면 Enter/검색버튼으로 explicit submit, 없으면 onSearchInputChange 만으로 live 필터 */
  onSearch?: () => void;
  searchPlaceholder?: string;

  lifecycleStatusFilter?: ProjectLifecycleStatus | "all";
  onLifecycleStatusFilterChange?: (value: ProjectLifecycleStatus | "all") => void;

  analysisTypeFilter?: AnalysisType | "all";
  onAnalysisTypeFilterChange?: (value: AnalysisType | "all") => void;
  /** undefined 면 ANALYSIS_TYPE_LABELS 의 모든 키를 표시 */
  analysisTypes?: AnalysisType[];

  viewMode?: "card" | "list";
  onViewModeChange?: (mode: "card" | "list") => void;

  disabled?: boolean;
}

const STYLES: Record<
  Size,
  {
    container: string;
    rightGap: string;
    searchWrap: string;
    searchInput: string;
    selectTrigger: string;
    lifecycleSelectTrigger: string;
    viewModeBox: string;
    viewModeActive: string;
    viewModeInactive: string;
    viewModeDivider: string | null;
  }
> = {
  md: {
    container:
      "border-line-subtle mb-6 flex items-center justify-between gap-3 border-b pb-6",
    rightGap: "gap-3",
    searchWrap:
      "group/search border-line-primary focus-within:border-accent-primary flex w-80 rounded-xs border transition-colors",
    searchInput: "border-0 focus-visible:border-0 focus-visible:ring-0",
    selectTrigger: "border-line-primary h-9 w-[180px] rounded-xs text-sm",
    lifecycleSelectTrigger: "border-line-primary h-9 w-[180px] rounded-xs text-sm",
    viewModeBox:
      "border-line-primary flex h-9 items-center overflow-hidden rounded-xs border",
    viewModeActive:
      "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    viewModeInactive: "",
    viewModeDivider: null,
  },
  sm: {
    container: "flex items-center justify-between gap-3 pb-4",
    rightGap: "gap-2",
    searchWrap:
      "group/search focus-within:border-accent-primary flex w-60 rounded-xs border border-input bg-canvas-primary shadow-xs transition-colors",
    searchInput:
      "border-0 bg-transparent focus-visible:border-0 focus-visible:ring-0",
    selectTrigger: "h-8 w-[140px] rounded-xs text-xs",
    lifecycleSelectTrigger: "h-8 w-[120px] rounded-xs text-xs",
    viewModeBox:
      "flex h-8 items-center rounded-xs border border-input bg-canvas-primary shadow-xs overflow-hidden",
    viewModeActive:
      "bg-canvas-surface-2 text-icon-active hover:bg-canvas-surface-2",
    viewModeInactive:
      "text-icon-default hover:bg-canvas-surface hover:text-icon-active",
    viewModeDivider: "h-full w-px bg-line-subtle",
  },
};

export function ProjectToolbar({
  size = "md",
  searchInput,
  onSearchInputChange,
  onSearch,
  searchPlaceholder = "프로젝트 검색",
  lifecycleStatusFilter,
  onLifecycleStatusFilterChange,
  analysisTypeFilter,
  onAnalysisTypeFilterChange,
  analysisTypes,
  viewMode,
  onViewModeChange,
  disabled = false,
}: ProjectToolbarProps) {
  const s = STYLES[size];
  const showLifecycle =
    lifecycleStatusFilter !== undefined && !!onLifecycleStatusFilterChange;
  const showAnalysisType =
    analysisTypeFilter !== undefined && !!onAnalysisTypeFilterChange;
  const showViewMode = viewMode !== undefined && !!onViewModeChange;

  const analysisTypeEntries: Array<[string, string]> = analysisTypes
    ? analysisTypes.map((t) => [t, ANALYSIS_TYPE_LABELS[t]])
    : Object.entries(ANALYSIS_TYPE_LABELS);

  return (
    <div className={s.container}>
      <div className={s.searchWrap}>
        <Input
          placeholder={searchPlaceholder}
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (onSearch && e.key === "Enter") onSearch();
          }}
          disabled={disabled}
          className={s.searchInput}
        />
        {onSearch ? (
          <Button
            variant="outline"
            size="icon"
            onClick={onSearch}
            aria-label="검색"
            disabled={disabled}
            className="text-fg-muted shrink-0 rounded-l-none rounded-r-xs border-0 border-l"
          >
            <Search className="size-4" />
          </Button>
        ) : (
          <div className="text-fg-muted flex shrink-0 items-center border-l border-input px-2">
            <Search className="size-3.5" />
          </div>
        )}
      </div>

      <div className={cn("flex items-center", s.rightGap)}>
        {showLifecycle && (
          <Select
            value={lifecycleStatusFilter}
            onValueChange={(v) =>
              onLifecycleStatusFilterChange!(v as ProjectLifecycleStatus | "all")
            }
          >
            <SelectTrigger className={s.lifecycleSelectTrigger}>
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
        )}

        {showAnalysisType && (
          <Select
            value={analysisTypeFilter}
            onValueChange={(v) =>
              onAnalysisTypeFilterChange!(v as AnalysisType | "all")
            }
          >
            <SelectTrigger className={s.selectTrigger}>
              <SelectValue placeholder="Analysis Type" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" align="start">
              <SelectItem value="all">전체</SelectItem>
              {analysisTypeEntries.map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showViewMode && (
          <div className={s.viewModeBox}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onViewModeChange!("card")}
                  aria-label="카드 뷰"
                  className={cn(
                    "h-full rounded-none border-0 transition-colors",
                    viewMode === "card" ? s.viewModeActive : s.viewModeInactive,
                  )}
                >
                  <Grid2X2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>카드 보기</TooltipContent>
            </Tooltip>

            {s.viewModeDivider && (
              <div className={s.viewModeDivider} aria-hidden />
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onViewModeChange!("list")}
                  aria-label="리스트 뷰"
                  className={cn(
                    "h-full rounded-none border-0 transition-colors",
                    viewMode === "list" ? s.viewModeActive : s.viewModeInactive,
                  )}
                >
                  <TextAlignJustify />
                </Button>
              </TooltipTrigger>
              <TooltipContent>리스트 보기</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
