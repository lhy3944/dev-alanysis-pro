import type { AgentScore } from "./agent";
import type { CommitRef } from "./commit";
import type { ReviewMeta } from "./review";

export type FindingPriority = "p1" | "p2" | "p3";
export type ModuleRole = "source" | "affected" | "neutral";
export type EdgeKind = "dependency" | "impact";

export interface ModuleNode {
  id: string;
  label: string;
  role: ModuleRole;
  x: number;
  y: number;
}

export interface ModuleEdge {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
}

export interface ModuleTopology {
  nodes: ModuleNode[];
  edges: ModuleEdge[];
  asset_url?: string | null;
  critical_path_module_ids: string[];
  /** 다이어그램 viewBox (xMin yMin width height) */
  view_box: [number, number, number, number];
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  priority: FindingPriority;
  category: string;
  module_id: string;
  review: ReviewMeta;
}

export interface CodeImpactReport extends CommitRef {
  project_id: string;
  topology: ModuleTopology;
  findings: Finding[];
  advisory: string | null;
  score: AgentScore;
}
