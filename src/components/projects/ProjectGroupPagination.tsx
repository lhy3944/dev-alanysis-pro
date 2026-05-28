"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGroupPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export function ProjectGroupPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: ProjectGroupPaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-fg-muted text-xs">
        {startItem}-{endItem} / {totalItems}
      </span>

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="이전 페이지"
          className="size-7"
        >
          <ChevronLeft className="size-3.5" />
        </Button>

        {pages.map((page, i) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="text-fg-muted flex size-7 items-center justify-center text-xs"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => onPageChange(page)}
              className={cn(
                "size-7 text-xs font-medium",
                page === currentPage && "bg-accent-primary/10 text-accent-primary",
              )}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="다음 페이지"
          className="size-7"
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
