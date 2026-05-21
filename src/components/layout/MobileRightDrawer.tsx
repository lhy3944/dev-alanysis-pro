"use client";

import { RightPanel } from "@/components/layout/RightPanel";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { PanelRightOpen, X } from "lucide-react";
import { useState } from "react";

export function MobileRightDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className="lg:hidden h-9 w-9 text-icon-default hover:text-icon-active"
      >
        <PanelRightOpen className="h-5 w-5" />
      </Button>

      <DrawerContent className="top-15! w-[85vw] sm:w-[380px] p-0 flex flex-col border-l border-line-primary bg-canvas-primary h-auto bottom-0!" overlayClassName="top-15!">
        <DrawerHeader className="flex flex-row items-center justify-between border-b border-line-primary p-3">
          <DrawerTitle className="text-base font-semibold text-fg-primary"></DrawerTitle>
          <DrawerDescription />
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-fg-secondary"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden">
          <RightPanel />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
