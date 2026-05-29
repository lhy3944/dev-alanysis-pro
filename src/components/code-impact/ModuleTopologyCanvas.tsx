import { useId } from "react";
import type { ModuleRole, ModuleTopology } from "@/types/code-impact-report";
import { cn } from "@/lib/utils";

interface ModuleTopologyCanvasProps {
  topology: ModuleTopology;
  className?: string;
}

interface RoleStyle {
  fill: string;
  stroke: string;
  text: string;
  sub?: string;
}

const ROLE_STYLES: Record<ModuleRole, RoleStyle> = {
  source: {
    fill: "var(--status-blue-bg)",
    stroke: "var(--status-blue-fg)",
    text: "var(--status-blue-fg)",
    sub: "SOURCE",
  },
  affected: {
    fill: "var(--status-red-bg)",
    stroke: "var(--status-red-fg)",
    text: "var(--status-red-fg)",
    sub: "AFFECTED",
  },
  neutral: {
    fill: "var(--bg-surface)",
    stroke: "var(--border-strong)",
    text: "var(--text-secondary)",
  },
};

export function ModuleTopologyCanvas({
  topology,
  className,
}: ModuleTopologyCanvasProps) {
  const reactId = useId();
  const markerId = `dap-topology-arrow-${reactId.replace(/:/g, "")}`;
  return (
    <svg
      viewBox={topology.view_box.join(" ")}
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted)" />
        </marker>
      </defs>

      {topology.edges.map((edge) => {
        const from = topology.nodes.find((n) => n.id === edge.from);
        const to = topology.nodes.find((n) => n.id === edge.to);
        if (!from || !to) return null;
        return (
          <line
            key={edge.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="var(--border-strong)"
            strokeWidth={1.4}
            strokeDasharray="4 4"
            markerEnd={`url(#${markerId})`}
          />
        );
      })}

      {topology.nodes.map((node) => {
        const s = ROLE_STYLES[node.role];
        return (
          <g key={node.id}>
            <rect
              x={node.x - 60}
              y={node.y - 22}
              width={120}
              height={44}
              rx={6}
              fill={s.fill}
              stroke={s.stroke}
              strokeWidth={1.4}
            />
            <text
              x={node.x}
              y={s.sub ? node.y - 3 : node.y + 4}
              textAnchor="middle"
              fontSize={11.5}
              fontWeight={600}
              fill={s.text}
            >
              {node.label}
            </text>
            {s.sub && (
              <text
                x={node.x}
                y={node.y + 12}
                textAnchor="middle"
                fontSize={8.5}
                fontWeight={700}
                letterSpacing="0.12em"
                fill={s.text}
              >
                {s.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
