"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ListChecks, Search } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { detectLanguage } from "@/lib/monaco-language";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import type {
  UnitTestStatusClass,
  UnitTestVerificationItem,
} from "@/types/unit-test";

interface UnitTestVerificationCardProps {
  items: UnitTestVerificationItem[];
  totalItems: number;
  query: string;
  onQueryChange: (q: string) => void;
  files: Record<string, string>;
  className?: string;
}

type BadgeTone =
  | "emerald"
  | "red"
  | "amber"
  | "neutral"
  | "orange"
  | "blue";

const SCLS_TONE: Record<UnitTestStatusClass, BadgeTone> = {
  "s-pass": "emerald",
  "s-defect": "red",
  "s-fail": "red",
  "s-nomatch": "amber",
  "s-tier": "neutral",
  "s-gate": "orange",
  "s-gen": "red",
  "s-covered": "blue",
  "s-pending": "neutral",
};

export function UnitTestVerificationCard({
  items,
  totalItems,
  query,
  onQueryChange,
  files,
  className,
}: UnitTestVerificationCardProps) {
  const openCodeFile = usePanelStore((s) => s.openCodeFile);

  const columns = useMemo<ColumnDef<UnitTestVerificationItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: "VI",
        size: 56,
        cell: ({ getValue }) => (
          <span className="text-fg-muted font-mono tabular-nums">
            #{getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: "text",
        header: "검증 항목",
        cell: ({ getValue }) => (
          <span className="text-fg-primary text-[12px] leading-relaxed">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "slabel",
        header: "분류",
        size: 120,
        cell: ({ row }) => (
          <StatusBadge
            tone={SCLS_TONE[row.original.scls] ?? "neutral"}
            label={row.original.slabel}
          />
        ),
      },
      {
        accessorKey: "reason",
        header: "사유",
        cell: ({ getValue }) => (
          <span className="text-fg-muted text-[11px] leading-relaxed">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "file",
        header: "테스트 파일",
        size: 280,
        cell: ({ row }) => {
          const file = row.original.file;
          if (!file) return <span className="text-fg-tertiary">—</span>;
          const code = files[file];
          const disabled = code == null;
          return (
            <Button
              variant="link"
              size="sm"
              disabled={disabled}
              onClick={() =>
                code &&
                openCodeFile({
                  name: file,
                  code,
                  language: detectLanguage(file),
                })
              }
              className={cn(
                "text-info hover:text-info h-auto px-0 font-mono text-[11px]",
                disabled && "text-fg-tertiary cursor-not-allowed",
              )}
            >
              {file}
            </Button>
          );
        },
      },
    ],
    [files, openCodeFile],
  );

  return (
    <SectionCard
      title={`검증 항목 상세 (${items.length}건)`}
      icon={ListChecks}
      headerRight={
        <span className="text-fg-muted text-[12px] tabular-nums">
          표시 {items.length} / {totalItems}
        </span>
      }
      subHeader={
        <div className="relative">
          <Search
            className="text-fg-muted absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="검증 항목/사유/파일명에서 검색"
            className="h-9 pl-9"
          />
        </div>
      }
      className={className}
      bodyClassName="p-0"
    >
      <DataTable
        columns={columns}
        data={items}
        emptyMessage="조건에 맞는 항목이 없습니다"
      />
    </SectionCard>
  );
}
