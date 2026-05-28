import { delayed } from "@/lib/mock-utils";
import type { CommitOption } from "@/types/commit";

const MOCK_COMMITS: CommitOption[] = [
  {
    commit_id: "9f6ed7b",
    revision_id: "rev-9f6ed7b",
    label: "9f6ed7b - Merge branch 'filtering-vali...",
    branch: "feature/auth-refactor",
    author: "Kim Dev",
    created_at: "2023-11-24T14:30:00Z",
  },
  {
    commit_id: "a3b521d",
    revision_id: "rev-a3b521d",
    label: "a3b521d - feat: 유저 인증 로직 고도화 및 JWT 만료 처리 추가",
    branch: "feature/auth-refactor",
    author: "Kim Dev",
    created_at: "2023-11-20T14:30:00Z",
  },
  {
    commit_id: "f5e4d3c",
    revision_id: "rev-f5e4d3c",
    label: "f5e4d3c - fix: 대시보드 그래프 렌더링 성능 최적화 (Canvas 기반)",
    branch: "feature/dashboard-perf",
    author: "Lee Engineer",
    created_at: "2023-11-20T11:15:00Z",
  },
  {
    commit_id: "9a8b7c6",
    revision_id: "rev-9a8b7c6",
    label: "9a8b7c6 - docs: README API 엔드포인트 설명 업데이트",
    branch: "main",
    author: "Kim Dev",
    created_at: "2023-11-19T17:45:00Z",
  },
];

export const commitService = {
  list: (projectId: string): Promise<CommitOption[]> => {
    // MOCK 단계에선 projectId 무관하게 동일 목록을 반환. 추후 fetch 로 교체 시 필터링.
    void projectId;
    return delayed(MOCK_COMMITS);
  },
};
