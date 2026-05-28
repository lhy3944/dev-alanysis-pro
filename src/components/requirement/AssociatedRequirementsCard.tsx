import { ClipboardList } from "lucide-react";
import { AgentDeepLinkButton } from "@/components/dashboard/AgentDeepLinkButton";
import { SectionCard } from "@/components/shared/SectionCard";
import type {
  RequirementLink,
  RequirementLinkType,
  RequirementReport,
} from "@/types/requirement-report";
import { cn } from "@/lib/utils";

interface AssociatedRequirementsCardProps {
  data: RequirementReport;
  projectId: string;
  commitId: string | undefined;
  className?: string;
}

const COLUMNS: { type: RequirementLinkType; label: string; toneBar: string }[] =
  [
    { type: "PRM", label: "PRM", toneBar: "bg-status-purple-fg" },
    { type: "FEATURE", label: "FEATURE", toneBar: "bg-status-blue-fg" },
    { type: "SRS", label: "SRS", toneBar: "bg-status-emerald-fg" },
  ];

export function AssociatedRequirementsCard({
  data,
  projectId,
  commitId,
  className,
}: AssociatedRequirementsCardProps) {
  const groups = COLUMNS.map((col) => ({
    ...col,
    items: data.links.filter((l) => l.type === col.type),
  }));

  return (
    <SectionCard
      title="연관 요구사항 (Associated Requirements)"
      icon={ClipboardList}
      headerRight={
        <AgentDeepLinkButton
          projectId={projectId}
          commitId={commitId}
          domain="requirement"
        />
      }
      className={className}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {groups.map((g) => (
          <div key={g.type} className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn("h-3 w-0.5 rounded-full", g.toneBar)}
                aria-hidden
              />
              <span className="text-fg-secondary text-sm font-bold uppercase">
                {g.label}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {g.items.length === 0 ? (
                <p className="text-fg-tertiary text-[12px]">없음</p>
              ) : (
                g.items.map((item) => <LinkRow key={item.id} link={item} />)
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function LinkRow({ link }: { link: RequirementLink }) {
  return (
    <div
      className="bg-canvas-surface-2 border-line-subtle hover:border-line-strong hover:bg-canvas-surface-3 group flex cursor-pointer flex-col gap-0.5 rounded-md border px-2.5 py-2 transition-colors"
      role="link"
      tabIndex={0}
    >
      <span className="text-fg-primary group-hover:text-fg-primary text-[11px] font-semibold">
        {link.code}
      </span>
      <span className="text-fg-secondary text-[12px] leading-snug">
        {link.title}
      </span>
    </div>
  );
}
