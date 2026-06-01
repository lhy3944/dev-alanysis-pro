"use client";

import { DataTable } from "@/components/shared/DataTable";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { detectLanguage } from "@/lib/monaco-language";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import type { UnitTestBestOfNRow } from "@/types/unit-test";
import type { ColumnDef } from "@tanstack/react-table";
import { Award } from "lucide-react";
import { useMemo } from "react";

interface BestOfNCardProps {
  rows: UnitTestBestOfNRow[];
  files: Record<string, string>;
  className?: string;
}

export function BestOfNCard({ rows, files, className }: BestOfNCardProps) {
  const openCodeFile = usePanelStore((s) => s.openCodeFile);

  const columns = useMemo<ColumnDef<UnitTestBestOfNRow>[]>(
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
        accessorKey: "file",
        header: "후보 테스트 파일",
        cell: ({ getValue }) => {
          const file = getValue<string>();
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
      {
        accessorKey: "label",
        header: "라벨",
        size: 160,
        meta: { align: "center" },
        cell: ({ getValue }) => {
          const label = getValue<string>();
          const isBest = label.includes("BEST") || label === "SELECTED";
          return (
            <StatusBadge
              tone={isBest ? "blue" : "neutral"}
              variant="soft"
              label={label}
            />
          );
        },
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
    ],
    [files, openCodeFile],
  );

  return (
    <SectionCard
      title={`Best-of-N 채택 결과 (${rows.length}건)`}
      icon={Award}
      className={className}
      bodyClassName="p-0"
    >
      <DataTable columns={columns} data={rows} />
    </SectionCard>
  );
}
