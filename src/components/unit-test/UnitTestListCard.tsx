"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { FlaskConical } from "lucide-react";
import { useMemo } from "react";
import { AgentDeepLinkButton } from "@/components/dashboard/AgentDeepLinkButton";
import { DataTable } from "@/components/shared/DataTable";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type {
  TestCaseStatus,
  UnitTestCase,
  UnitTestReport,
} from "@/types/unit-test-report";

interface UnitTestListCardProps {
  data: UnitTestReport;
  projectId: string;
  commitId: string | undefined;
  className?: string;
}

const STATUS_LABEL: Record<TestCaseStatus, string> = {
  passed: "PASSED",
  failed: "FAILED",
  skipped: "SKIPPED",
};

const STATUS_TEXT: Record<TestCaseStatus, string> = {
  passed: "text-status-emerald-fg",
  failed: "text-status-red-fg",
  skipped: "text-fg-muted",
};

export function UnitTestListCard({
  data,
  projectId,
  commitId,
  className,
}: UnitTestListCardProps) {
  const columns = useMemo<ColumnDef<UnitTestCase>[]>(
    () => [
      {
        accessorKey: "name",
        header: "TEST CASE",
        cell: ({ getValue }) => (
          <span className="text-fg-primary">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ getValue }) => {
          const s = getValue<TestCaseStatus>();
          return (
            <span className={cn("text-[11px] font-semibold", STATUS_TEXT[s])}>
              {STATUS_LABEL[s]}
            </span>
          );
        },
      },
      {
        accessorKey: "duration_ms",
        header: () => <div className="text-right">DURATION</div>,
        cell: ({ getValue }) => {
          const v = getValue<number | null>();
          return (
            <div className="text-fg-secondary text-right tabular-nums">
              {v != null ? `${v}ms` : "—"}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <SectionCard
      title={`관련 Unit Test 목록 (${data.cases.length}건)`}
      icon={FlaskConical}
      headerRight={
        <>
          <StatusBadge tone="neutral" label={`${data.coverage_pct}%`} />
          <AgentDeepLinkButton
            projectId={projectId}
            commitId={commitId}
            domain="unit-test"
          />
        </>
      }
      className={className}
      bodyClassName="p-0"
    >
      <DataTable columns={columns} data={data.cases} />
    </SectionCard>
  );
}
