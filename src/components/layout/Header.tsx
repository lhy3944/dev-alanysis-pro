"use client";

import { HeaderActions } from "@/components/layout/HeaderActions";
import { HeaderTabs } from "@/components/layout/HeaderTabs";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Logo } from "@/components/shared/Logo";
import { Separator } from "@/components/ui/separator";
import { layoutMaxW } from "@/config/layout";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";

interface HeaderProps {
  showLayoutToggle?: boolean;
}

export function Header({ showLayoutToggle = false }: HeaderProps) {
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);

  return (
    <header
      className={cn(
        "bg-sidebar-bg border-line-primary sticky top-0 z-50 flex h-15 shrink-0 items-center border-b backdrop-blur-xl",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-full w-full items-center justify-between px-2 transition-[max-width] duration-300 ease-in-out sm:px-6",
          layoutMaxW(fullWidthMode),
        )}
      >
        <div className="flex flex-1 items-center">
          <MobileMenu />
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-end gap-1">
          <HeaderTabs />
          <Separator
            orientation="vertical"
            className="mx-3 hidden data-[orientation=vertical]:h-6 md:block"
          />
          <HeaderActions showLayoutToggle={showLayoutToggle} />
        </div>
      </div>
    </header>
  );
}
