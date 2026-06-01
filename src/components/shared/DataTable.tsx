"use client";
"use no memo";

// `useReactTable` 가 매 호출마다 새 함수를 반환하므로 React Compiler 가
// 안전하게 memoize 할 수 없어 자동 skip 한다. 그 동작을 명시적으로 선언해
// `react-hooks/incompatible-library` 경고를 제거.

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// 컬럼 정렬(텍스트 우/좌 배치)을 ColumnDef.meta 로 선언할 수 있도록 타입 확장.
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue = unknown> {
    align?: "left" | "right" | "center";
  }
}

const ALIGN_CELL: Record<NonNullable<ColumnAlign>, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

const ALIGN_HEADER: Record<NonNullable<ColumnAlign>, string> = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center",
};

type ColumnAlign = "left" | "right" | "center" | undefined;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  className?: string;
  /** 행 클릭 핸들러 (선택) */
  onRowClick?: (row: TData) => void;
  /** 헤더 클릭 정렬 활성화 (선택). 개별 컬럼은 `enableSorting: false` 로 제외 가능 */
  enableSorting?: boolean;
  /** 페이지당 행 수 (선택). 지정하면 페이지네이션 활성화 */
  pageSize?: number;
}

/**
 * TanStack Table 기반 공유 테이블.
 * columns / data 만 받아 헤더-바디 구조를 일관되게 그린다.
 *
 * 도메인 카드(UnitTestListCard 등) 는 자신만의 ColumnDef 를 정의해 넘긴다.
 * 정렬/필터/페이지네이션 등의 확장은 필요 시 props 와 row model 을
 * 점진적으로 추가 가능.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "데이터가 없습니다",
  className,
  onRowClick,
  enableSorting = false,
  pageSize,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const paginated = pageSize != null && pageSize > 0;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting,
    ...(enableSorting
      ? {
          state: { sorting },
          onSortingChange: setSorting,
          getSortedRowModel: getSortedRowModel(),
        }
      : {}),
    ...(paginated
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageSize } },
        }
      : {}),
  });

  const rows = table.getRowModel().rows;
  const showPagination = paginated && table.getPageCount() > 1;
  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <>
      <table className={cn("w-full text-left text-sm", className)}>
        <thead className="bg-canvas-surface">
          {table.getHeaderGroups().map((hg) => (
            <tr
              key={hg.id}
              className="text-fg-muted border-line-subtle border-b text-[10px] font-bold tracking-wide uppercase"
            >
              {hg.headers.map((h) => {
                const align = h.column.columnDef.meta?.align;
                const canSort = h.column.getCanSort();
                const sorted = h.column.getIsSorted();
                const headerContent = h.isPlaceholder
                  ? null
                  : flexRender(h.column.columnDef.header, h.getContext());
                return (
                  <th
                    key={h.id}
                    className={cn(
                      "px-4 py-2.5 font-bold",
                      align && ALIGN_CELL[align],
                    )}
                    style={
                      h.column.columnDef.size != null
                        ? { width: h.column.columnDef.size }
                        : undefined
                    }
                  >
                    {canSort ? (
                      <button
                        type="button"
                        onClick={h.column.getToggleSortingHandler()}
                        className={cn(
                          "hover:text-fg-secondary inline-flex items-center gap-1 select-none",
                          ALIGN_HEADER[align ?? "left"],
                          sorted && "text-fg-secondary",
                        )}
                      >
                        {headerContent}
                        {sorted === "asc" ? (
                          <ArrowUp className="size-3" aria-hidden />
                        ) : sorted === "desc" ? (
                          <ArrowDown className="size-3" aria-hidden />
                        ) : (
                          <ChevronsUpDown
                            className="text-fg-tertiary size-3"
                            aria-hidden
                          />
                        )}
                      </button>
                    ) : (
                      headerContent
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-fg-muted py-8 text-center"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "border-line-subtle hover:bg-canvas-surface-2 border-b last:border-b-0",
                  onRowClick && "cursor-pointer",
                )}
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
              >
                {row.getVisibleCells().map((cell) => {
                  const align = cell.column.columnDef.meta?.align;
                  return (
                    <td
                      key={cell.id}
                      className={cn("px-4 py-2", align && ALIGN_CELL[align])}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showPagination && (
        <div className="text-fg-muted border-line-subtle flex items-center justify-end gap-3 border-t px-4 py-2 text-[11px] tabular-nums">
          <span>
            {pageIndex + 1} / {table.getPageCount()}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="이전 페이지"
              className="hover:text-fg-secondary disabled:text-fg-tertiary inline-flex size-6 items-center justify-center rounded disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="다음 페이지"
              className="hover:text-fg-secondary disabled:text-fg-tertiary inline-flex size-6 items-center justify-center rounded disabled:cursor-not-allowed"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
