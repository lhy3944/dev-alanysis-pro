import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * StatusBadge — pill badge primitive driven by --status-* tokens.
 *
 * Design system spec: always `rounded-full`, tinted soft bg + 600-weight fg,
 * 11px font, optional 6px leading dot in the fg color.
 *
 * Three semantic palettes wrap the same primitive:
 * - <StatusBadge tone="emerald" label="Published" />
 * - <AnalysisTypeBadge type="Java" />
 * - <RoleBadge role="Super Admin" />
 */

type StatusTone =
  | "amber"
  | "emerald"
  | "red"
  | "blue"
  | "cyan"
  | "indigo"
  | "orange"
  | "purple"
  | "teal"
  | "neutral";

type StatusVariant = "soft" | "outline";

const SOFT_TONE_CLASSES: Record<StatusTone, string> = {
  amber: "bg-status-amber-bg text-status-amber-fg",
  emerald: "bg-status-emerald-bg text-status-emerald-fg",
  red: "bg-status-red-bg text-status-red-fg",
  blue: "bg-status-blue-bg text-status-blue-fg",
  cyan: "bg-status-cyan-bg text-status-cyan-fg",
  indigo: "bg-status-indigo-bg text-status-indigo-fg",
  orange: "bg-status-orange-bg text-status-orange-fg",
  purple: "bg-status-purple-bg text-status-purple-fg",
  teal: "bg-status-teal-bg text-status-teal-fg",
  neutral: "bg-canvas-surface-2 text-fg-secondary",
};

const OUTLINE_TONE_CLASSES: Record<StatusTone, string> = {
  amber: "border text-status-amber-fg",
  emerald: "border text-status-emerald-fg",
  red: "border text-status-red-fg",
  blue: "border text-status-blue-fg",
  cyan: "border text-status-cyan-fg",
  indigo: "border text-status-indigo-fg",
  orange: "border text-status-orange-fg",
  purple: "border text-status-purple-fg",
  teal: "border text-status-teal-fg",
  neutral: "border text-fg-secondary",
};

interface StatusBadgeProps extends React.ComponentProps<"span"> {
  tone?: StatusTone;
  /**
   * - `soft` (default): 색조 soft bg + fg
   * - `outline`: 투명 bg + 색조 border + fg — 화면이 색조 카드와 경쟁할 때
   */
  variant?: StatusVariant;
  /** Show a 6px leading dot in the fg color. */
  dot?: boolean;
  label: React.ReactNode;
}

export function StatusBadge({
  tone = "neutral",
  variant = "soft",
  dot = false,
  label,
  className,
  ...rest
}: StatusBadgeProps) {
  const toneClass =
    variant === "outline"
      ? OUTLINE_TONE_CLASSES[tone]
      : SOFT_TONE_CLASSES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none whitespace-nowrap",
        toneClass,
        className,
      )}
      {...rest}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      )}
      {label}
    </span>
  );
}

/* ============================================================
   Semantic mappings — keep wire-format strings here so a status
   key from the API resolves to a tone without per-call switch.
   ============================================================ */

const LIFECYCLE_TONE: Record<string, StatusTone> = {
  draft: "amber",
  pending: "amber",
  published: "emerald",
  merged: "emerald",
  passed: "emerald",
  approved: "emerald",
  deleted: "red",
  failed: "red",
  error: "red",
  rejected: "red",
  running: "blue",
  active: "purple",
  info: "blue",
  skipped: "neutral",
  queued: "neutral",
  archived: "neutral",
};

interface LifecycleBadgeProps {
  status: string;
  /** Override the display label; defaults to capitalized status. */
  label?: string;
  dot?: boolean;
  className?: string;
}

export function LifecycleBadge({
  status,
  label,
  dot,
  className,
}: LifecycleBadgeProps) {
  const tone = LIFECYCLE_TONE[status.toLowerCase()] ?? "neutral";
  const display =
    label ?? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return (
    <StatusBadge tone={tone} dot={dot} label={display} className={className} />
  );
}

const ANALYSIS_TYPE_TONE: Record<string, StatusTone> = {
  Java: "blue",
  "C/C++": "cyan",
  "Objective-C/C++": "indigo",
  Swift: "orange",
  webOS: "purple",
  Python: "amber",
  "JavaScript/TypeScript": "amber",
  Dart: "teal",
};

interface AnalysisTypeBadgeProps {
  type: string;
  className?: string;
}

export function AnalysisTypeBadge({ type, className }: AnalysisTypeBadgeProps) {
  const tone = ANALYSIS_TYPE_TONE[type] ?? "neutral";
  return <StatusBadge tone={tone} label={type} className={className} />;
}

const ROLE_TONE: Record<string, StatusTone> = {
  "Super Admin": "purple",
  "Data Analyst": "blue",
  "Security Officer": "emerald",
  Auditor: "red",
};

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const tone = ROLE_TONE[role] ?? "neutral";
  return <StatusBadge tone={tone} label={role} className={className} />;
}
