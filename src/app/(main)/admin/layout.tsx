"use client";

import { AdminLeftPanel } from "@/components/admin/AdminLeftPanel";
import { MobileLeftPanelTrigger } from "@/components/layout/MobileLeftPanelTrigger";
import { ResponsiveLeftPanelHost } from "@/components/layout/ResponsiveLeftPanelHost";
import { RightPanel } from "@/components/layout/RightPanel";
import { useResponsivePanel } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";

// TODO: Add route guard - check user role/permission before rendering
// e.g., if (!hasAdminRole) redirect('/my-projects');

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rightPanelOpen = usePanelStore((s) => s.rightPanelOpen);
  const rightPanelWidth = usePanelStore((s) => s.rightPanelWidth);

  useResponsivePanel();

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <ResponsiveLeftPanelHost
        label="Admin 메뉴"
        render={(state) => <AdminLeftPanel state={state} />}
      />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-start px-2 py-1.5 md:hidden">
          <MobileLeftPanelTrigger />
        </div>
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
