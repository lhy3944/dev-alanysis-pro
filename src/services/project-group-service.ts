import type { ProjectGroup, ProjectGroupListResponse } from "@/types/project";

const MOCK_DELAY_MS = 600;

const MOCK_GROUPS: ProjectGroupListResponse = {
  groups: [
    {
      group_id: "group-001",
      name: "AI & Web Platform",
      description:
        "인공지능 및 차세대 엔터프라이즈 웹 핵심 솔루션들을 개발하고 코드 아키텍처를 정밀 정적 분석하는 프로젝트 그룹입니다.",
      project_count: 3,
      manager_count: 3,
      member_count: 24,
      created_at: "2025-06-01T09:00:00Z",
      updated_at: "2026-05-21T08:00:00Z",
      projects: [
        {
          project_id: "proj-001",
          name: "AISE+ Web Application",
          description:
            "차세대 AI 기반 소프트웨어 공학 분석 플랫폼. 요구사항 분석부터 설계, 테스트케이스 생성까지 전 과정을 자동화합니다.",
          domain: "Software Engineering",
          product_type: "Web Application",
          modules: ["requirements", "design", "testcase"],
          member_count: 8,
          status: "active",
          lifecycle_status: "published",
          analysis_type: "javascript_typescript",
          readiness: null,
          created_at: "2025-12-01T09:00:00Z",
          updated_at: "2026-05-18T14:30:00Z",
        },
        {
          project_id: "proj-004",
          name: "Python ML Pipeline",
          description:
            "머신러닝 모델 학습 파이프라인의 정적 분석 및 테스트 커버리지 자동 측정 시스템입니다.",
          domain: "AI/ML",
          product_type: "Library",
          modules: ["requirements", "testcase"],
          member_count: 6,
          status: "active",
          lifecycle_status: "published",
          analysis_type: "python",
          readiness: null,
          created_at: "2025-10-05T11:30:00Z",
          updated_at: "2026-05-19T16:45:00Z",
        },
        {
          project_id: "proj-008",
          name: "Java Enterprise Analyzer",
          description:
            "Spring Boot 기반 엔터프라이즈 애플리케이션의 아키텍처 분석과 코드 품질 측정 도구입니다.",
          domain: "Enterprise",
          product_type: "Web Service",
          modules: ["requirements", "design", "testcase"],
          member_count: 10,
          status: "active",
          lifecycle_status: "published",
          analysis_type: "java",
          readiness: null,
          created_at: "2025-06-01T09:00:00Z",
          updated_at: "2026-05-21T08:00:00Z",
        },
      ],
    },
    {
      group_id: "group-002",
      name: "Mobile & Frontend Platform",
      description:
        "모바일 어플리케이션의 CI/CD 빌드 최적화 및 레거시 모바일 코드베이스의 Swift 마이그레이션 계획을 추진하는 그룹입니다.",
      project_count: 3,
      manager_count: 2,
      member_count: 10,
      created_at: "2025-08-20T10:00:00Z",
      updated_at: "2026-05-20T09:00:00Z",
      projects: [
        {
          project_id: "proj-003",
          name: "iOS CI/CD Pipeline",
          description:
            "Swift 기반 iOS 앱의 CI/CD 파이프라인 구축 및 코드 품질 자동 분석.",
          domain: "Mobile",
          product_type: "iOS App",
          modules: ["design"],
          member_count: 5,
          status: "archived",
          lifecycle_status: "deleted",
          analysis_type: "swift",
          readiness: null,
          created_at: "2025-08-20T10:00:00Z",
          updated_at: "2026-03-01T07:00:00Z",
        },
        {
          project_id: "proj-006",
          name: "Legacy Objective-C Migration",
          description:
            "레거시 Objective-C 코드베이스를 분석하여 Swift로의 점진적 마이그레이션 계획을 수립합니다.",
          domain: "Mobile",
          product_type: "iOS App",
          modules: ["requirements"],
          member_count: 2,
          status: "active",
          lifecycle_status: "published",
          analysis_type: "objective_c_cpp",
          readiness: null,
          created_at: "2026-02-14T13:00:00Z",
          updated_at: "2026-05-15T10:20:00Z",
        },
        {
          project_id: "proj-007",
          name: "Dart Flutter Plugin",
          description:
            "Flutter 플러그인의 코드 품질을 정적 분석하고 API 호환성 리포트를 생성합니다.",
          domain: "Mobile",
          product_type: "Flutter Plugin",
          modules: ["testcase"],
          member_count: 3,
          status: "active",
          lifecycle_status: "draft",
          analysis_type: "dart",
          readiness: null,
          created_at: "2026-04-01T08:00:00Z",
          updated_at: "2026-05-20T09:00:00Z",
        },
      ],
    },
    {
      group_id: "group-003",
      name: "Embedded & TV Systems",
      description:
        "LG webOS 스마트 TV 제품군 탑재 앱 및 임베디드 펌웨어 취약점, 메모리 정밀 정적 분석 솔루션 모음입니다.",
      project_count: 2,
      manager_count: 2,
      member_count: 7,
      created_at: "2025-11-15T08:00:00Z",
      updated_at: "2026-04-28T11:00:00Z",
      projects: [
        {
          project_id: "proj-002",
          name: "Embedded Firmware Analyzer",
          description:
            "임베디드 시스템의 펌웨어를 정적 분석하고 취약점과 품질 지표를 리포트로 제공하는 도구입니다.",
          domain: "Embedded Systems",
          product_type: "CLI Tool",
          modules: ["requirements"],
          member_count: 4,
          status: "active",
          lifecycle_status: "draft",
          analysis_type: "c_cpp",
          readiness: null,
          created_at: "2025-11-15T08:00:00Z",
          updated_at: "2026-05-10T09:15:00Z",
        },
        {
          project_id: "proj-005",
          name: "webOS TV App Suite",
          description:
            "LG webOS 스마트 TV용 애플리케이션 스위트. 성능 분석과 메모리 누수 탐지 기능을 포함합니다.",
          domain: "Smart TV",
          product_type: "TV App",
          modules: ["design", "testcase"],
          member_count: 3,
          status: "active",
          lifecycle_status: "draft",
          analysis_type: "webos",
          readiness: null,
          created_at: "2026-01-10T07:00:00Z",
          updated_at: "2026-04-28T11:00:00Z",
        },
      ],
    },
  ],
};

export const projectGroupService = {
  list: (): Promise<ProjectGroupListResponse> =>
    new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_GROUPS), MOCK_DELAY_MS);
    }),

  get: (id: string): Promise<ProjectGroup> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const group = MOCK_GROUPS.groups.find((g) => g.group_id === id);
        if (group) {
          resolve(group);
        } else {
          reject(new Error(`프로젝트 그룹을 찾을 수 없습니다: ${id}`));
        }
      }, 400);
    }),
};
