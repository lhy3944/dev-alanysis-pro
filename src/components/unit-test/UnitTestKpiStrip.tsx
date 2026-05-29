"use client";

import { cn } from "@/lib/utils";
import type {
  UnitTestGroupColor,
  UnitTestGroupKey,
  UnitTestKpiGroup,
} from "@/types/unit-test";

interface UnitTestKpiStripProps {
  total: number;
  groups: UnitTestKpiGroup[];
  activeKey: UnitTestGroupKey | null;
  onChange: (key: UnitTestGroupKey | null) => void;
  className?: string;
}

const VALUE_COLOR: Record<UnitTestGroupColor, string> = {
  green: "text-status-emerald-fg",
  red: "text-status-red-fg",
  amber: "text-status-amber-fg",
  blue: "text-status-blue-fg",
  gray: "text-fg-muted",
};

export function UnitTestKpiStrip({
  total,
  groups,
  activeKey,
  onChange,
  className,
}: UnitTestKpiStripProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
        className,
      )}
    >
      <KpiCard
        label="전체"
        value={total}
        valueColor="text-fg-primary"
        active={activeKey === null}
        onClick={() => onChange(null)}
        clickable={total > 0}
      />
      {groups.map((g) => (
        <KpiCard
          key={g.key}
          label={g.label}
          value={g.count}
          valueColor={VALUE_COLOR[g.color]}
          active={activeKey === g.key}
          onClick={() => onChange(activeKey === g.key ? null : g.key)}
          clickable={g.count > 0}
        />
      ))}
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: number;
  valueColor: string;
  active: boolean;
  clickable: boolean;
  onClick: () => void;
}

function KpiCard({
  label,
  value,
  valueColor,
  active,
  clickable,
  onClick,
}: KpiCardProps) {
  const Comp = clickable ? "button" : "div";
  return (
    <Comp
      type={clickable ? "button" : undefined}
      onClick={clickable ? onClick : undefined}
      className={cn(
        "bg-canvas-primary border-line-subtle flex flex-col gap-2 rounded-lg border p-4 text-left transition-all",
        clickable && "hover:border-line-strong cursor-pointer",
        !clickable && "opacity-70",
        active && "ring-info border-line-strong ring-2",
      )}
    >
      <span className="text-fg-muted text-[12px] font-medium">{label}</span>
      <span
        className={cn(
          "text-2xl leading-none font-semibold tracking-tight tabular-nums",
          valueColor,
        )}
      >
        {value}
      </span>
    </Comp>
  );
}
