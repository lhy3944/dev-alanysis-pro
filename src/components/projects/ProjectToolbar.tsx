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
import { ANALYSIS_TYPE_LABELS } from "@/constants/project";
import type { AnalysisType } from "@/types/project";
import { Grid2X2, Search, TextAlignJustify } from "lucide-react";

interface ProjectToolbarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  analysisTypeFilter: AnalysisType | "all";
  onAnalysisTypeFilterChange: (value: AnalysisType | "all") => void;
  viewMode: "card" | "list";
  onViewModeChange: (mode: "card" | "list") => void;
  disabled: boolean;
}

export function ProjectToolbar({
  searchInput,
  onSearchInputChange,
  onSearch,
  analysisTypeFilter,
  onAnalysisTypeFilterChange,
  viewMode,
  onViewModeChange,
  disabled,
}: ProjectToolbarProps) {
  return (
    <div className="border-line-subtle mb-6 flex items-center justify-between gap-3 border-b pb-6">
      <div className="group/search border-line-primary focus-within:border-accent-primary flex w-80 rounded-xs border transition-colors">
        <Input
          placeholder="프로젝트 검색"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          disabled={disabled}
          className="border-0 focus-visible:border-0 focus-visible:ring-0"
        />
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
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={analysisTypeFilter}
          onValueChange={(v) =>
            onAnalysisTypeFilterChange(v as AnalysisType | "all")
          }
        >
          <SelectTrigger className="border-line-primary h-9 w-[180px] rounded-xs text-sm">
            <SelectValue placeholder="Analysis Type" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start">
            <SelectItem value="all">전체</SelectItem>
            {Object.entries(ANALYSIS_TYPE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="border-line-primary flex h-9 items-center rounded-xs border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "card" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => onViewModeChange("card")}
                aria-label="카드 뷰"
                className="h-full rounded-l-xs rounded-r-none border-0"
              >
                <Grid2X2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>카드 보기</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => onViewModeChange("list")}
                aria-label="리스트 뷰"
                className="h-full rounded-l-none rounded-r-xs border-0"
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
