"use client";
"use no memo";

// `useReactTable` 가 매 호출마다 새 함수를 반환하므로 React Compiler 가
// 안전하게 memoize 할 수 없어 자동 skip 한다. 그 동작을 명시적으로 선언해
// `react-hooks/incompatible-library` 경고를 제거.

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  className?: string;
  /** 행 클릭 핸들러 (선택) */
  onRowClick?: (row: TData) => void;
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
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <table className={cn("w-full text-left text-[12px]", className)}>
      <thead className="bg-canvas-surface">
        {table.getHeaderGroups().map((hg) => (
          <tr
            key={hg.id}
            className="text-fg-muted border-line-subtle border-b text-[10px] font-bold tracking-wide uppercase"
          >
            {hg.headers.map((h) => (
              <th
                key={h.id}
                className="px-4 py-2.5 font-bold"
                style={
                  h.column.columnDef.size != null
                    ? { width: h.column.columnDef.size }
                    : undefined
                }
              >
                {h.isPlaceholder
                  ? null
                  : flexRender(h.column.columnDef.header, h.getContext())}
              </th>
            ))}
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
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
