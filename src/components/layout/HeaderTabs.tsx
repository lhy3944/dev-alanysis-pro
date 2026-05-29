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
        const isActive =
          pathname.startsWith(tab.href) ||
          (tab.matchAlso?.some((p) => pathname.startsWith(p)) ?? false);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "group rounded-sm p-4 text-sm whitespace-nowrap transition-colors",
              isActive
                ? "text-header-fg-active"
                : "text-header-fg-muted hover:text-header-fg-active",
            )}
          >
            <div className="flex items-center gap-1 transition-transform duration-150 group-hover:-translate-y-0.5">
              <span className="font-medium whitespace-nowrap">{tab.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
