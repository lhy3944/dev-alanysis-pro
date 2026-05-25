"use client";

import { headerTabsConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderTabs() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center space-x-1 flex-nowrap">
      {headerTabsConfig.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "group rounded-sm p-4 text-sm hover:bg-canvas-surface-2 whitespace-nowrap",
              isActive && "bg-canvas-surface-2",
            )}
          >
            <div className="flex items-center gap-1 transition-transform duration-150 group-hover:-translate-y-0.5">
              {/* <tab.icon
                className={cn("h-4 w-4", isActive && "text-accent-primary")}
              /> */}
              <span className="font-medium whitespace-nowrap">{tab.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
