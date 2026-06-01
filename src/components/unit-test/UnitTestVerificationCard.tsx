"use client";

import { DataTable } from "@/components/shared/DataTable";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { detectLanguage } from "@/lib/monaco-language";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import type {
  UnitTestGroupKey,
  UnitTestKpiGroup,
  UnitTestStatusClass,
  UnitTestVerificationItem,
} from "@/types/unit-test";
import type { ColumnDef } from "@tanstack/react-table";
import { ListChecks, Search } from "lucide-react";
import { useMemo } from "react";

const ALL_VALUE = "all";

interface UnitTestVerificationCardProps {
  items: UnitTestVerificationItem[];
  totalItems: number;
  query: string;
  onQueryChange: (q: string) => void;
  groups: UnitTestKpiGroup[];
  activeKey: UnitTestGroupKey | null;
  onActiveKeyChange: (key: UnitTestGroupKey | null) => void;
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
  groups,
  activeKey,
  onActiveKeyChange,
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
        enableSorting: false,
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
          <span className="text-fg-primary leading-relaxed">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "slabel",
        header: "분류",
        size: 120,
        meta: { align: "center" },
        cell: ({ row }) => (
          <StatusBadge
            tone={SCLS_TONE[row.original.scls] ?? "neutral"}
            variant="outline"
            label={row.original.slabel}
            className="border-0 px-0"
          />
        ),
      },
      {
        accessorKey: "reason",
        header: "사유",
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="text-fg-muted leading-relaxed">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "file",
        header: "테스트 파일",
        size: 280,
        enableSorting: false,
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
                "text-info hover:text-info h-auto px-0 font-mono",
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
      title={`검증 항목 상세`}
      icon={ListChecks}
      headerRight={
        <span className="text-fg-muted text-[12px] tabular-nums">
          {items.length} / {totalItems}
        </span>
      }
      subHeader={
        <div className="flex items-center justify-between gap-2">
          <div className="relative w-full max-w-xs">
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
          <Select
            value={activeKey ?? ALL_VALUE}
            onValueChange={(v) =>
              onActiveKeyChange(v === ALL_VALUE ? null : (v as UnitTestGroupKey))
            }
          >
            <SelectTrigger className="h-9 w-[160px] shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>전체</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g.key} value={g.key}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      className={className}
      bodyClassName="p-0"
    >
      <DataTable
        columns={columns}
        data={items}
        enableSorting
        emptyMessage="조건에 맞는 항목이 없습니다"
      />
    </SectionCard>
  );
}
