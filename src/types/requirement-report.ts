import type { AgentScore } from "./agent";
import type { CommitRef } from "./commit";

export type RequirementLinkType = "PRM" | "FEATURE" | "SRS";

export interface RequirementLink {
  id: string;
  code: string;
  title: string;
  type: RequirementLinkType;
}

export interface RequirementReport extends CommitRef {
  project_id: string;
  links: RequirementLink[];
  score: AgentScore;
}
