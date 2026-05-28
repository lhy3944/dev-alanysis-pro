import type { LucideIcon } from "lucide-react";
import { Activity, BarChart3, Users } from "lucide-react";

export interface AdminMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  {
    id: "usage-overview",
    label: "Usage Overview",
    icon: BarChart3,
    href: "/usage-overview",
  },
  {
    id: "system-status",
    label: "System Status",
    icon: Activity,
    href: "/system-status",
  },
  {
    id: "user-management",
    label: "User Management",
    icon: Users,
    href: "/user-management",
  },
];
