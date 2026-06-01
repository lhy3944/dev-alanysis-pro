"use client";

import { ProjectWorkspaceLeftPanel } from "@/components/projects/ProjectWorkspaceLeftPanel";
import { ResizeHandle } from "@/components/layout/ResizeHandle";
import { ResponsiveLeftPanelHost } from "@/components/layout/ResponsiveLeftPanelHost";
import { RightPanel } from "@/components/layout/RightPanel";
import { useResponsivePanel } from "@/hooks/useMediaQuery";
import { useResize } from "@/hooks/useResize";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { projectService } from "@/services/project-service";
import { usePanelStore } from "@/stores/panel-store";
import { useProjectStore } from "@/stores/project-store";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

export default function ProjectWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams<{ id: string }>();
  const setCurrentProject = useProjectStore((s) => s.setCurrentProject);
  const currentProject = useProjectStore((s) => s.currentProject);
  const setLoading = useProjectStore((s) => s.setLoading);
  const setError = useProjectStore((s) => s.setError);
  const rightPanelOpen = usePanelStore((s) => s.rightPanelOpen);
  const rightPanelWidth = usePanelStore((s) => s.rightPanelWidth);
  const fetchStartedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { onPointerDown, isResizing } = useResize(containerRef, panelRef, {
    maxPct: 50,
  });

  useResponsivePanel();

  const fetchProject = useCallback(async () => {
    if (fetchStartedRef.current) return;
    fetchStartedRef.current = true;

    if (currentProject?.project_id === id) return;

    setLoading(true);
    setError(null);
    try {
      const project = await projectService.get(id);
      setCurrentProject(project);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "프로젝트 정보를 불러올 수 없습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id, currentProject, setCurrentProject, setLoading, setError]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return (
    <div ref={containerRef} className="relative flex flex-1 overflow-hidden">
      <ResponsiveLeftPanelHost
        label="프로젝트 워크스페이스 메뉴"
        render={(state) => <ProjectWorkspaceLeftPanel state={state} />}
      />
      <main className="min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>

      {/* ResizeHandle — 패널 바깥에 독립 배치, 열려 있을 때만 노출 */}
      {rightPanelOpen && (
        <div className="relative hidden h-full w-0 shrink-0 lg:block">
          <ResizeHandle
            isOpen={rightPanelOpen}
            isResizing={isResizing}
            onPointerDown={onPointerDown}
          />
        </div>
      )}

      <div
        ref={panelRef}
        className={cn(
          "hidden h-full shrink-0 overflow-hidden lg:block",
          isResizing
            ? "transition-none"
            : "transition-[width] duration-300 ease-in-out",
        )}
        style={{
          width: rightPanelOpen ? `${rightPanelWidth}%` : "0%",
        }}
        aria-hidden={!rightPanelOpen}
      >
        <RightPanel />
      </div>
    </div>
  );
}
