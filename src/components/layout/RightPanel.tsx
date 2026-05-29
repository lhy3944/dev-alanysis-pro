"use client";

import { CodeViewerPanel } from "@/components/shared/CodeViewer/CodeViewerPanel";
import { usePanelStore } from "@/stores/panel-store";

export function RightPanel() {
  const view = usePanelStore((s) => s.rightPanelView);

  if (view === "code-viewer") {
    return (
      <div className="flex h-full flex-col bg-canvas-primary">
        <CodeViewerPanel />
      </div>
    );
  }

  return <div className="flex h-full flex-col bg-canvas-primary" />;
}
