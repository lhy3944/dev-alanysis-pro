"use client";

import { AdminLeftPanel } from "@/components/admin/AdminLeftPanel";
import { RightPanel } from "@/components/layout/RightPanel";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";

// TODO: Add route guard - check user role/permission before rendering
// e.g., if (!hasAdminRole) redirect('/my-projects');

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const leftSidebarOpen = usePanelStore((s) => s.leftSidebarOpen);
  const rightPanelOpen = usePanelStore((s) => s.rightPanelOpen);
  const rightPanelWidth = usePanelStore((s) => s.rightPanelWidth);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div
        className={cn(
          "shrink-0 overflow-hidden border-r border-line-primary bg-canvas-secondary transition-[width] duration-300 ease-in-out",
          leftSidebarOpen ? "w-[220px]" : "w-[60px]",
        )}
      >
        <AdminLeftPanel />
      </div>
      <main className="min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
      <div
        className={cn(
          "hidden shrink-0 lg:block",
          rightPanelOpen
            ? "transition-[width] duration-300"
            : "transition-none",
        )}
        style={{
          width: rightPanelOpen ? `${rightPanelWidth}%` : "0%",
        }}
      >
        {rightPanelOpen && <RightPanel />}
      </div>
    </div>
  );
}
