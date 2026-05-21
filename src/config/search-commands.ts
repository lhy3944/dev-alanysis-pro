import { headerTabsConfig } from "@/config/navigation";
import type { LucideIcon } from "lucide-react";
import { Moon } from "lucide-react";

export interface SearchNavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  keywords: string[];
}

export interface SearchActionItem {
  id: string;
  label: string;
  icon: LucideIcon;
  keywords: string[];
  href?: string;
  actionId?: string;
}

const KEYWORDS_MAP: Record<string, string[]> = {
  "/my-projects": ["프로젝트", "목록", "list", "my projects", "마이 프로젝트"],
  "/project-groups": ["프로젝트 그룹", "그룹", "project groups", "groups"],
  "/help": ["도움말", "help", "헬프", "지원"],
};

export const SEARCH_NAVIGATION_ITEMS: SearchNavigationItem[] =
  headerTabsConfig.map((tab) => {
    const pathName = tab.href.replace(/^\//, "");
    return {
      id: `nav-${pathName}`,
      label: tab.label,
      icon: tab.icon as LucideIcon,
      href: tab.href,
      keywords: KEYWORDS_MAP[tab.href] || [tab.label.toLowerCase()],
    };
  });

export const SEARCH_ACTION_ITEMS: SearchActionItem[] = [
  // {
  //   id: "action-new-project",
  //   label: "새 프로젝트 만들기",
  //   icon: Plus,
  //   href: "/projects",
  //   keywords: ["create", "new", "생성", "추가"],
  // },
  // {
  //   id: "action-new-chat",
  //   label: "새 채팅 시작",
  //   icon: MessageSquare,
  //   href: "/agent",
  //   keywords: ["chat", "대화", "새로운"],
  // },
  {
    id: "action-toggle-theme",
    label: "테마 변경",
    icon: Moon,
    actionId: "toggle-theme",
    keywords: ["dark", "light", "다크", "라이트", "모드", "theme"],
  },
];
