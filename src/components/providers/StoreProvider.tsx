"use client";

import { useStoreHydration } from "@/hooks/useStoreHydration";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";

function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-canvas-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center">
          <span className="text-3xl font-bold text-fg-primary">
            DevAnalysis
          </span>
          <span className="ml-2 text-xl font-bold">
            <span
              className={cn(
                "font-medium transition duration-300 ease-out",
                "text-fg-muted group-hover:text-fg-primary"
              )}
            >
              Pro
            </span>
          </span>
        </div>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-line-primary">
          <div className="h-full w-1/2 animate-shimmer rounded-full bg-fg-muted" />
        </div>
      </div>
    </div>
  );
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useStoreHydration(usePanelStore);

  if (!hydrated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
