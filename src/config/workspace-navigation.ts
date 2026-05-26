import type { LucideIcon } from "lucide-react";
import {
  Activity,
  FileText,
  FlaskConical,
  GitCommit,
  LayoutDashboard,
  Monitor,
} from "lucide-react";

export interface WorkspaceMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

export const WORKSPACE_MENU_ITEMS: WorkspaceMenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "" },
  { id: "code-impact", label: "Code Impact Analysis", icon: Activity, href: "/code-impact" },
  { id: "requirement", label: "Requirement", icon: FileText, href: "/requirement" },
  { id: "unit-test", label: "Unit Test", icon: FlaskConical, href: "/unit-test" },
  { id: "system-test", label: "System Test", icon: Monitor, href: "/system-test" },
  { id: "commit-history", label: "Commit History", icon: GitCommit, href: "/commit-history" },
];
