import { delayed } from "@/lib/mock-utils";
import type { RequirementReport } from "@/types/requirement-report";

function buildReport(projectId: string, commitId: string): RequirementReport {
  return {
    project_id: projectId,
    commit_id: commitId,
    revision_id: null,
    links: [
      { id: "r-1", code: "PRM-101", title: "User Authentication Enhancements", type: "PRM" },
      { id: "r-2", code: "PRM-084", title: "Audit Logging Architecture", type: "PRM" },
      { id: "r-3", code: "FEAT-202", title: "JWT Refresh Token Logic", type: "FEATURE" },
      { id: "r-4", code: "FEAT-115", title: "Distributed Session Store", type: "FEATURE" },
      { id: "r-5", code: "SRS-303", title: "Security Validation Rules", type: "SRS" },
      { id: "r-6", code: "SRS-102", title: "Error Handling Patterns", type: "SRS" },
    ],
    score: {
      domain: "requirement",
      label: "코드 가독성",
      display: "92%",
      percent: 92,
      tone: "ok",
      foot: "명명 규칙 우수",
    },
  };
}

export const requirementService = {
  get: (projectId: string, commitId: string): Promise<RequirementReport> =>
    delayed(buildReport(projectId, commitId)),
};
