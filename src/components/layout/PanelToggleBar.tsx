"use client";

import { cn } from "@/lib/utils";
import { LayoutMode, usePanelStore } from "@/stores/panel-store";
import { Columns2, PanelLeft, PanelRight } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const MODES = [
  { mode: LayoutMode.WIDE, icon: PanelLeft, label: "최대" },
  { mode: LayoutMode.SPLIT, icon: Columns2, label: "분할" },
  { mode: LayoutMode.CLOSED, icon: PanelRight, label: "닫기" },
] as const;

export function PanelToggleBar() {
  const layoutMode = usePanelStore((s) => s.layoutMode);
  const setRightPanelPreset = usePanelStore((s) => s.setRightPanelPreset);

  return (
    <div className="hidden lg:flex items-center">
      {MODES.map(({ mode, icon: Icon, label }) => {
        const isActive = layoutMode === mode;
        return (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-8 h-8 dark:text-neutral-400",
                  isActive &&
                    "bg-neutral-700 text-white hover:bg-neutral-600/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200",
                )}
                onClick={() => setRightPanelPreset(mode)}
              >
                <Icon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
