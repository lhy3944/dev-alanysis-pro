import type { LucideIcon } from "lucide-react";
import {
  Box,
  CircleHelp,
  Package,
  SlidersHorizontal,
  UserCog,
} from "lucide-react";

export interface HeaderTab {
  href: string;
  label: string;
  icon: LucideIcon;
  /**
   * 활성 판정에 추가로 매칭할 path prefix 목록.
   * 예: My Projects 는 워크스페이스(/projects/[id]/...) 진입 시에도 활성으로 표시.
   */
  matchAlso?: string[];
}

export const headerTabsConfig: HeaderTab[] = [
  {
    href: "/my-projects",
    label: "My Projects",
    icon: Box,
    matchAlso: ["/projects/"],
  },
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
