import { CheckCircle2, ServerCog, XCircle, MinusCircle } from "lucide-react";
import { AgentDeepLinkButton } from "@/components/dashboard/AgentDeepLinkButton";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type {
  SystemTestCase,
  SystemTestReport,
} from "@/types/system-test-report";
import type { TestCaseStatus } from "@/types/unit-test-report";

interface SystemTestListCardProps {
  data: SystemTestReport;
  projectId: string;
  commitId: string | undefined;
  className?: string;
}

const STATUS_ICON = {
  passed: { Icon: CheckCircle2, className: "text-status-emerald-fg" },
  failed: { Icon: XCircle, className: "text-status-red-fg" },
  skipped: { Icon: MinusCircle, className: "text-fg-muted" },
} satisfies Record<
  TestCaseStatus,
  { Icon: typeof CheckCircle2; className: string }
>;

export function SystemTestListCard({
  data,
  projectId,
  commitId,
  className,
}: SystemTestListCardProps) {
  return (
    <SectionCard
      title={`System Test Case 목록 (${data.cases.length}건)`}
      icon={ServerCog}
      headerRight={
        <>
          <StatusBadge tone="neutral" label={`${data.success_rate_pct}%`} />
          <AgentDeepLinkButton
            projectId={projectId}
            commitId={commitId}
            domain="system-test"
          />
        </>
      }
      className={className}
      bodyClassName="p-0"
    >
      <ul className="flex flex-col">
        {data.cases.map((c) => (
          <SystemTestRow key={c.id} testCase={c} />
        ))}
      </ul>
    </SectionCard>
  );
}

function SystemTestRow({ testCase }: { testCase: SystemTestCase }) {
  const { Icon, className } = STATUS_ICON[testCase.status];
  const isFailed = testCase.status === "failed";
  return (
    <li
      className={cn(
        "border-line-subtle flex items-center gap-3 border-b px-4 py-3 last:border-b-0",
        isFailed && "bg-status-red-bg/30",
      )}
    >
      <span
        className={cn(
          "text-fg-muted shrink-0 rounded-md border px-2 py-1 font-mono text-[11px] font-bold",
          isFailed
            ? "border-status-red-fg/40 text-status-red-fg"
            : "border-line-subtle",
        )}
      >
        {testCase.code}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-fg-primary truncate text-[13px] font-semibold">
          {testCase.title}
        </p>
        <p
          className={cn(
            "mt-0.5 truncate text-[11px]",
            isFailed ? "text-status-red-fg" : "text-fg-muted",
          )}
        >
          {testCase.sub}
        </p>
      </div>
      <Icon className={cn("size-4 shrink-0", className)} />
    </li>
  );
}
