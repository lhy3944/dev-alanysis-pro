/**
 * 분석 결과는 commit_id / revision_id 단위로 산출된다.
 * 모든 에이전트 service 의 get() 이 이 식별자를 받는다.
 */

export interface CommitRef {
  commit_id: string;
  revision_id?: string | null;
}

export interface CommitOption extends CommitRef {
  label: string;
  branch: string;
  author?: string;
  created_at: string;
}
