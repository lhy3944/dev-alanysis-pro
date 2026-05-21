import type { LucideIcon } from "lucide-react";
import {
  Box,
  CircleHelp,
  Package,
  SlidersHorizontal,
  UserCog,
} from "lucide-react";

export const headerTabsConfig = [
  { href: "/my-projects", label: "My Projects", icon: Box },
  { href: "/project-groups", label: "Project Groups", icon: Package },
  { href: "/admin", label: "Admin", icon: UserCog },
  { href: "/help", label: "Help", icon: CircleHelp },
];

export interface SidebarAction {
  id: "settings" | "project" | "admin" | "help";
  label: string;
  icon: LucideIcon;
}

export const SIDEBAR_ACTIONS: SidebarAction[] = [
  { id: "settings", label: "앱 설정", icon: SlidersHorizontal },
  { id: "project", label: "프로젝트", icon: Box },
  { id: "admin", label: "Admin", icon: UserCog },
  { id: "help", label: "도움말", icon: CircleHelp },
];
