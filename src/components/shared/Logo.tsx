"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  /** "inverse" — use on brand chrome (header). "default" — neutral canvas. */
  variant?: "default" | "inverse";
  size?: "md" | "lg";
}

const SIZES = {
  md: { mark: 26, radius: 6, icon: 14, word: 15, gap: 8 },
  lg: { mark: 36, radius: 8, icon: 20, word: 22, gap: 8 },
} as const;

/**
 * DevAnalysis<Pro> wordmark — locked design "option B · code-bracket mark + wordmark".
 * Source: docs/reference/devanalysis-pro-design-system/project/assets/Logo.jsx
 *         + preview/brand-logo.html
 *
 * Mark = rounded square with `< >` code brackets.
 * Brand colors are surface-aware:
 *   default (light canvas)  → brand-primary-soft bg, brand-primary fg
 *   inverse (header chrome) → white 18% bg, white fg
 *   dark canvas (auto)      → brand-primary-soft bg, brand-primary fg
 */
export function Logo({ variant = "default", size = "md" }: LogoProps) {
  const s = SIZES[size];
  const isInverse = variant === "inverse";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex select-none items-center font-bold tracking-tight",
        isInverse ? "text-header-fg" : "text-fg-primary",
      )}
      style={{ fontSize: s.word, gap: s.gap, letterSpacing: "-0.02em" }}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center transition duration-300 ease-out",
          isInverse
            ? "bg-header-divider text-header-fg group-hover:bg-white/25"
            : "bg-brand-primary-soft text-brand-primary group-hover:bg-brand-primary/20 group-hover:text-brand-primary-hover",
        )}
        style={{
          width: s.mark,
          height: s.mark,
          borderRadius: s.radius,
        }}
        aria-hidden
      >
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="8 6 3 12 8 18" />
          <polyline points="16 6 21 12 16 18" />
        </svg>
      </span>
      <span className="inline-flex items-baseline" style={{ gap: 6 }}>
        <span>DevAnalysis</span>
        <span
          className={cn(
            "font-medium transition duration-300 ease-out",
            isInverse
              ? "opacity-70 group-hover:opacity-100"
              : "text-fg-muted group-hover:text-fg-primary",
          )}
        >
          Pro
        </span>
      </span>
    </Link>
  );
}
