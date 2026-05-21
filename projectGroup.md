프로젝트 그룹 페이지 구현 계획

     Context

     프로젝트를 N개씩 그룹화한 카드 형태의 목록 페이지. my-projects 페이지와 유사한 패턴을 재사용하되, 카드,리스트 뷰토글은 제거.

     UX 제안: 클릭 → 프로젝트 선택

     권장: 인라인 확장 (Accordion)

     그룹 카드 클릭 시 해당 카드가 아래로 확장되면서 포함된 프로젝트 카드들이 인라인으로 표시됨. 프로젝트 카드 클릭
      → /projects/{id} 워크스페이스로 이동.

     클릭 전:                     클릭 후:
     ┌─ Group A ─── [5] ┐       ┌─ Group A ─── [5] ─ ▲ ┐
     │ 설명...            │       │ 설명...               │
     │ ⏰  날짜 👤매니저 👥멤버│       │ ───────────────────── │
     └───────────────────┘       │ [Proj1] [Proj2] [Proj3]│
     ┌─ Group B ─── [3] ┐       │ [Proj4] [Proj5]        │
     │ ...                │       └───────────────────────┘
     └───────────────────┘       ┌─ Group B ─── [3] ┐
                                 │ ...                │
                                 └───────────────────┘

     장점:
     - 페이지 이동 없이 프로젝트 확인 가능 (컨텍스트 유지)
     - 한 번에 여러 그룹 펼쳐서 비교 가능
     - 탐색 깊이(depth) 최소화: 그룹 페이지 → 바로 워크스페이스 진입

     대안 (필요 시): 그룹 상세 페이지 /project-groups/{id} 로 이동 → 프로젝트 리스트 → 선택 → 워크스페이스

     ---
     구현 계획

     1. 타입 추가 — src/types/project.ts

     export interface ProjectGroup {
       group_id: string;
       name: string;
       description: string | null;
       project_count: number;
       projects: Project[];        // 그룹에 포함된 프로젝트 목록
       manager_count: number;
       member_count: number;
       created_at: string;
       updated_at: string;
     }

     export interface ProjectGroupListResponse {
       groups: ProjectGroup[];
     }

     2. Mock 데이터 — src/services/project-group-service.ts (신규)

     projectGroupService.list() — 3~4개 그룹 mock 데이터. 각 그룹은 2~4개 프로젝트 포함.

     3. ProjectToolbar 분석타입 필터 옵셔널화 — src/components/projects/ProjectToolbar.tsx (수정)

     analysisTypeFilter / onAnalysisTypeFilterChange props를 optional로 변경. 미제공 시 Select가 렌더링되지 않음.
     project-groups 페이지에서는 이 props를 전달하지 않음.

     4. ProjectGroupCard — src/components/projects/ProjectGroupCard.tsx (신규)

     기본 상태 (접힘):
     ┌──────────────────────────────┐
     │ 📁 Group Name         [8]   │  ← icon + 이름 + 프로젝트 수 뱃지
     │ 그룹 설명 (line-clamp-2)     │  ← description
     │ ──────────────────────────── │
     │ ⏰  3일 전  👤 M:3  👥 12    │  ← 날짜 + 매니저 수 + 멤버 수
     └──────────────────────────────┘

     확장 상태: 하단에 프로젝트 카드 그리드 표시 + 우측 상단 ChevronUp

     React.memo 적용. 확장 상태는 로컬 useState로 관리 (한 번에 여러 그룹 펼침 가능).

     5. ProjectGroupListSkeleton — src/components/projects/ProjectGroupListSkeleton.tsx (신규)

     기존 ProjectListSkeleton과 유사, 그룹 카드 형태에 맞게 조정.

     6. 페이지 — src/app/(main)/(projects)/project-groups/page.tsx (수정)

     my-projects 페이지와 동일한 패턴:
     - ProjectToolbar에서 analysisType props 제외
     - projectGroupService.list() 호출
     - 그룹 카드 그리드 + 확장 시 프로젝트 카드 표시
     - 검색, 로딩/에러/빈 상태

     ---
     파일 목록

     ┌─────┬──────────────────────────────────────────────────┬────────────────────────────────────────────────────     ┐
     │  #  │                       파일                       │                        종류
     │
     ├─────┼──────────────────────────────────────────────────┼────────────────────────────────────────────────────     ┤
     │ 1   │ types/project.ts                                 │ 수정 (ProjectGroup, ProjectGroupListResponse 추가)
     │
     ├─────┼──────────────────────────────────────────────────┼────────────────────────────────────────────────────     ┤
     │ 2   │ services/project-group-service.ts                │ 신규
     │
     ├─────┼──────────────────────────────────────────────────┼────────────────────────────────────────────────────     ┤
     │ 3   │ components/projects/ProjectToolbar.tsx           │ 수정 (analysisType 옵셔널화)
     │
     ├─────┼──────────────────────────────────────────────────┼────────────────────────────────────────────────────     ┤
     │ 4   │ components/projects/ProjectGroupCard.tsx         │ 신규
     │
     ├─────┼──────────────────────────────────────────────────┼────────────────────────────────────────────────────     ┤
     │ 5   │ components/projects/ProjectGroupListSkeleton.tsx │ 신규
     │
     ├─────┼──────────────────────────────────────────────────┼────────────────────────────────────────────────────     ┤
     │ 6   │ app/(main)/(projects)/project-groups/page.tsx    │ 수정
     │
     └─────┴──────────────────────────────────────────────────┴────────────────────────────────────────────────────     ┘

     검증 방법

     1. /project-groups 접속 → 그룹 카드 3~4개 렌더링 확인
     2. 그룹 카드 클릭 → 확장되어 포함된 프로젝트 카드들 표시
     3. 프로젝트 카드 클릭 → /projects/{id} 워크스페이스 이동
     4. 검색 → 그룹명/설명으로 필터링
     5. 카드/리스트 뷰 토글 동작
     6. 다른 그룹 클릭 → 이전 그룹은 접히지 않고 독립적으로 토글
