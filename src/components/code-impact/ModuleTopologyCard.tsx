import { Network } from "lucide-react";
import { AgentDeepLinkButton } from "@/components/dashboard/AgentDeepLinkButton";
import { PanZoomViewer } from "@/components/shared/PanZoomViewer";
import { SectionCard } from "@/components/shared/SectionCard";
import { cn } from "@/lib/utils";
import { ModuleTopologyCanvas } from "./ModuleTopologyCanvas";
import type { ModuleTopology } from "@/types/code-impact-report";

interface ModuleTopologyCardProps {
  topology: ModuleTopology;
  projectId: string;
  commitId: string | undefined;
  className?: string;
}

export function ModuleTopologyCard({
  topology,
  projectId,
  commitId,
  className,
}: ModuleTopologyCardProps) {
  // const hasCriticalPath = topology.critical_path_module_ids.length > 0;
  return (
    <SectionCard
      title="영향받는 모듈 관계도 (Module Topology)"
      icon={Network}
      headerRight={
        <>
          {/* {hasCriticalPath && (
            <StatusBadge tone="purple" dot label="Critical Path" />
          )} */}
          <AgentDeepLinkButton
            projectId={projectId}
            commitId={commitId}
            domain="code-impact"
          />
        </>
      }
      className={cn("h-[500px]", className)}
      bodyClassName="p-3"
    >
      <div className="min-h-0 w-full flex-1">
        <PanZoomViewer
          ariaLabel="영향받는 모듈 관계도"
          expandedTitle="영향받는 모듈 관계도 (Module Topology)"
        >
          {topology.asset_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={topology.asset_url}
              alt="Module topology"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <ModuleTopologyCanvas topology={topology} />
          )}
        </PanZoomViewer>
      </div>
    </SectionCard>
  );
}
