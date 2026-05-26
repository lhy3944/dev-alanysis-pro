"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/stores/project-store";
import { usePanelStore } from "@/stores/panel-store";
import { layoutMaxW } from "@/config/layout";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  Activity,
  Box,
  CheckCircle2,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Users,
  GitPullRequest,
  Clock,
  Play,
  ShieldCheck,
  FileCode,
  TrendingUp,
  Cpu,
  FileDown,
  Share2,
  AlertCircle,
  Lightbulb,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  X,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

// Interactive Mock Commit Data Types
interface TopologyNode {
  id: string;
  label: string;
  type: "source" | "affected" | "none";
  x: number;
  y: number;
}

interface TopologyLink {
  source: string;
  target: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isCritical?: boolean;
}

interface VerificationItem {
  id: string;
  title: string;
  description: string;
  priority: "P1 HIGH" | "P2 MID" | "P3 LOW";
  category: string;
}

interface AssociatedReq {
  id: string;
  name: string;
}

interface AIReviewMetric {
  score: number;
  desc: string;
}

interface UnitTest {
  name: string;
  status: "PASSED" | "FAILED" | "SKIPPED";
  duration: string;
}

interface SystemTest {
  id: string;
  name: string;
  desc: string;
  status: "PASSED" | "FAILED";
}

interface CommitAnalysis {
  commitId: string;
  commitMsg: string;
  branch: string;
  updatedAt: string;
  criticalPath: boolean;
  topology: {
    nodes: TopologyNode[];
    links: TopologyLink[];
  };
  verificationItems: VerificationItem[];
  associatedReqs: {
    prm: AssociatedReq[];
    feature: AssociatedReq[];
    srs: AssociatedReq[];
  };
  aiReview: {
    perf: AIReviewMetric;
    readability: AIReviewMetric;
    security: {
      count: number;
      desc: string;
    };
    testability: AIReviewMetric;
    advice: string;
  };
  unitTests: {
    coverage: number;
    total: number;
    tests: UnitTest[];
  };
  systemTests: {
    successRate: number;
    total: number;
    tests: SystemTest[];
  };
}

// 3 High-Fidelity Mock Commits Datasets
const MOCK_COMMIT_ANALYSES: Record<string, CommitAnalysis> = {
  "9f6edfb": {
    commitId: "9f6edfb",
    commitMsg: "Merge branch 'filtering-validation-fix' into main",
    branch: "feature/auth-refactor",
    updatedAt: "2023.11.24 14:30",
    criticalPath: true,
    topology: {
      nodes: [
        { id: "API_Gateway", label: "API_Gateway", type: "none", x: 110, y: 70 },
        { id: "User_Profile", label: "User_Profile", type: "none", x: 110, y: 230 },
        { id: "Core_Auth", label: "Core_Auth", type: "source", x: 310, y: 110 },
        { id: "Audit_Log", label: "Audit_Log", type: "affected", x: 510, y: 190 },
      ],
      links: [
        { source: "API_Gateway", target: "Core_Auth", x1: 110, y1: 70, x2: 310, y2: 110 },
        { source: "API_Gateway", target: "User_Profile", x1: 110, y1: 70, x2: 110, y2: 230 },
        { source: "Core_Auth", target: "Audit_Log", x1: 310, y1: 110, x2: 510, y2: 190, isCritical: true },
        { source: "User_Profile", target: "Audit_Log", x1: 110, y1: 230, x2: 510, y2: 190 },
      ]
    },
    verificationItems: [
      {
        id: "v-01",
        title: "토큰 만료 로직 예외 처리",
        description: "JWT 리프레시 토큰 처리 과정에서 레이스 컨디션 발생 가능성 검증 필요",
        priority: "P1 HIGH",
        category: "Auth-Server"
      },
      {
        id: "v-02",
        title: "DB 커넥션 풀 누수 검사",
        description: "사용자 프로필 업데이트 모듈의 비동기 호출 시 커넥션 릴리즈 확인",
        priority: "P2 MID",
        category: "Database"
      },
      {
        id: "v-03",
        title: "입력 데이터 밸리데이션",
        description: "특수문자 필터링 우회 가능성 검증 (Regex 패턴 확인)",
        priority: "P3 LOW",
        category: "Security"
      }
    ],
    associatedReqs: {
      prm: [
        { id: "PRM-101", name: "User Authentication Enhancements" },
        { id: "PRM-004", name: "Audit Logging Architecture" }
      ],
      feature: [
        { id: "FEAT-202", name: "JWT Refresh Token Logic" },
        { id: "FEAT-115", name: "Distributed Session Store" }
      ],
      srs: [
        { id: "SRS-303", name: "Security Validation Rules" },
        { id: "SRS-102", name: "Error Handling Patterns" }
      ]
    },
    aiReview: {
      perf: { score: 85, desc: "루프 최적화 3건 제안됨" },
      readability: { score: 92, desc: "명명 규칙 우수" },
      security: { count: 2, desc: "CSRF 방어 보강 권장" },
      testability: { score: 78, desc: "의존성 주입 패턴 적용 필요" },
      advice: "현재 변경사항은 인증 모듈의 결합도를 12% 증가시켰습니다. auth.service.ts 의 인터페이스를 분리하여 의존성을 완화할 것을 권장합니다."
    },
    unitTests: {
      coverage: 88,
      total: 8,
      tests: [
        { name: "AuthService.validateToken()", status: "PASSED", duration: "12ms" },
        { name: "AuthService.generateKey()", status: "PASSED", duration: "8ms" },
        { name: "AuthService.expiredToken()", status: "FAILED", duration: "15ms" },
        { name: "SessionHandler.init()", status: "SKIPPED", duration: "-" }
      ]
    },
    systemTests: {
      successRate: 80,
      total: 5,
      tests: [
        { id: "TC01", name: "End-to-End User Login Flow", desc: "UI-to-Auth-to-DB integration check", status: "PASSED" },
        { id: "TC02", name: "Multi-Factor Auth Bypass Attempt", desc: "Security robustness system test", status: "PASSED" },
        { id: "TC03", name: "Session Persistence on Network Loss", desc: "Failed at reconnection hook", status: "FAILED" }
      ]
    }
  },
  "3a4f8bc": {
    commitId: "3a4f8bc",
    commitMsg: "Implement parallel log processing and connection pooling",
    branch: "feature/perf-opt",
    updatedAt: "2023.11.25 10:15",
    criticalPath: false,
    topology: {
      nodes: [
        { id: "API_Gateway", label: "API_Gateway", type: "none", x: 110, y: 70 },
        { id: "User_Profile", label: "User_Profile", type: "affected", x: 110, y: 230 },
        { id: "Database_Pool", label: "Database_Pool", type: "source", x: 310, y: 110 },
        { id: "Audit_Log", label: "Audit_Log", type: "none", x: 510, y: 190 },
      ],
      links: [
        { source: "API_Gateway", target: "Database_Pool", x1: 110, y1: 70, x2: 310, y2: 110 },
        { source: "Database_Pool", target: "User_Profile", x1: 310, y1: 110, x2: 110, y2: 230 },
        { source: "Database_Pool", target: "Audit_Log", x1: 310, y1: 110, x2: 510, y2: 190 },
      ]
    },
    verificationItems: [
      {
        id: "v-04",
        title: "커넥션 풀 자원 기갈 대응",
        description: "동시 요청 폭주시 커넥션 반환 지연 및 타임아웃 예외 검증 필요",
        priority: "P1 HIGH",
        category: "Database"
      },
      {
        id: "v-05",
        title: "대용량 로그 처리 영향 분석",
        description: "대용량 로그 유입시 CPU 스파이크 및 디스크 I/O 병목 분석",
        priority: "P2 MID",
        category: "Performance"
      }
    ],
    associatedReqs: {
      prm: [
        { id: "PRM-002", name: "System Performance SLA" },
        { id: "PRM-004", name: "Audit Logging Architecture" }
      ],
      feature: [
        { id: "FEAT-105", name: "Connection Pool Optimization" }
      ],
      srs: [
        { id: "SRS-104", name: "Database Constraints" }
      ]
    },
    aiReview: {
      perf: { score: 96, desc: "지연 속도 15% 개선됨" },
      readability: { score: 88, desc: "메서드 길이 표준 초과 (1건)" },
      security: { count: 0, desc: "보안 취약점 감지 안됨" },
      testability: { score: 82, desc: "인메모리 DB 테스트 적합" },
      advice: "로그 병렬 버퍼 처리가 효과적으로 적용되었습니다. 다만 대용량 요청 버스트 상황에서 데이터 유실 방지를 위해 세마포어 한계 조정을 권장합니다."
    },
    unitTests: {
      coverage: 94,
      total: 12,
      tests: [
        { name: "PoolManager.getConnection()", status: "PASSED", duration: "4ms" },
        { name: "PoolManager.releaseConnection()", status: "PASSED", duration: "2ms" },
        { name: "LogDispatcher.dispatch()", status: "PASSED", duration: "10ms" },
        { name: "LogQueue.flush()", status: "SKIPPED", duration: "-" }
      ]
    },
    systemTests: {
      successRate: 100,
      total: 5,
      tests: [
        { id: "TC01", name: "Database Connection Scaling Test", desc: "Simulated load scaling up to 500 parallel queries", status: "PASSED" },
        { id: "TC02", name: "Log Buffer Overflow Stress Test", desc: "Simulated burst logs up to 10MB/sec", status: "PASSED" }
      ]
    }
  },
  "d34f9ae": {
    commitId: "d34f9ae",
    commitMsg: "Hotfix for token parsing buffer overflow vulnerability",
    branch: "hotfix/vulnerability-patch",
    updatedAt: "2023.11.26 18:02",
    criticalPath: true,
    topology: {
      nodes: [
        { id: "API_Gateway", label: "API_Gateway", type: "source", x: 110, y: 150 },
        { id: "Token_Parser", label: "Token_Parser", type: "affected", x: 310, y: 150 },
        { id: "Core_Auth", label: "Core_Auth", type: "affected", x: 510, y: 150 },
      ],
      links: [
        { source: "API_Gateway", target: "Token_Parser", x1: 110, y1: 150, x2: 310, y2: 150, isCritical: true },
        { source: "Token_Parser", target: "Core_Auth", x1: 310, y1: 150, x2: 510, y2: 150, isCritical: true },
      ]
    },
    verificationItems: [
      {
        id: "v-06",
        title: "바운더리 오프셋 검증",
        description: "비정상적으로 긴 입력 세그먼트 수신 시 메모리 침범 방지 로직 검증",
        priority: "P1 HIGH",
        category: "Security"
      },
      {
        id: "v-07",
        title: "토큰 서명 위조 공격 시뮬레이션",
        description: "잘못된 서명 헤더 조작 시 거부 응답이 올바르게 리턴되는지 확인",
        priority: "P1 HIGH",
        category: "Security"
      }
    ],
    associatedReqs: {
      prm: [
        { id: "PRM-101", name: "User Authentication Enhancements" }
      ],
      feature: [
        { id: "FEAT-203", name: "Token Signature Check" }
      ],
      srs: [
        { id: "SRS-303", name: "Security Validation Rules" }
      ]
    },
    aiReview: {
      perf: { score: 82, desc: "스트링 가비지 컬렉션 부하 미세 증가" },
      readability: { score: 95, desc: "변수 명명 매우 우수" },
      security: { count: 0, desc: "취약점 조치 완료" },
      testability: { score: 90, desc: "경계값 유닛테스트 커버리지 100%" },
      advice: "바운드 체크 코드가 효과적으로 보강되었습니다. 토큰 파서 라이브러리 버전을 2.4.1로 고정하여 추후 발생 가능한 종속성 취약점 이슈를 방지하십시오."
    },
    unitTests: {
      coverage: 100,
      total: 6,
      tests: [
        { name: "TokenParser.parseHeader()", status: "PASSED", duration: "1ms" },
        { name: "TokenParser.validateSignature()", status: "PASSED", duration: "2ms" },
        { name: "TokenParser.boundaryCheck()", status: "PASSED", duration: "3ms" }
      ]
    },
    systemTests: {
      successRate: 100,
      total: 3,
      tests: [
        { id: "TC01", name: "Token Tampering Attack Simulation", desc: "Simulate brute-force token forgery requests", status: "PASSED" },
        { id: "TC02", name: "Buffer Overflow Input Injection", desc: "Send 10MB garbage payload in Auth header", status: "PASSED" }
      ]
    }
  }
};

export default function ProjectWorkspaceDashboard() {
  const { currentProject, isLoading, error } = useProjectStore();
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);
  const leftSidebarOpen = usePanelStore((s) => s.leftSidebarOpen);

  const [activeCommitId, setActiveCommitId] = useState<string>("9f6edfb");
  const [isPending, startTransition] = useTransition();
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-pulse">
        <LayoutDashboard className="text-fg-muted mb-4 size-10 animate-bounce" />
        <h3 className="text-fg-primary text-md font-semibold">
          워크스페이스 정보를 불러오는 중입니다...
        </h3>
      </div>
    );
  }

  if (error || !currentProject) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="bg-canvas-surface mb-4 flex size-16 items-center justify-center rounded-full border border-dashed border-red-500/50">
          <Box className="size-6 text-red-500" />
        </div>
        <h2 className="text-fg-primary text-lg font-medium">
          워크스페이스 정보를 불러올 수 없습니다
        </h2>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/my-projects">프로젝트 목록으로 이동</Link>
        </Button>
      </div>
    );
  }

  const contentHalfWidth = fullWidthMode ? "1080px" : "576px";
  const commit = MOCK_COMMIT_ANALYSES[activeCommitId] || MOCK_COMMIT_ANALYSES["9f6edfb"];

  const handleCommitChange = (commitId: string) => {
    startTransition(() => {
      setActiveCommitId(commitId);
    });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.7));
  };

  const handleZoomReset = () => {
    setZoomLevel(1.0);
  };

  return (
    <div className="h-full overflow-y-auto bg-canvas-primary">
      <div
        className={cn(
          "transition-[max-width,margin] duration-300 ease-in-out px-6 py-6 space-y-6",
          layoutMaxW(fullWidthMode),
        )}
        style={{
          "--sidebar-width": leftSidebarOpen ? "220px" : "60px",
          marginLeft: `max(0px, calc(50vw - ${contentHalfWidth} - var(--sidebar-width)))`,
          marginRight: "auto",
        } as React.CSSProperties}
      >
        {/* Header Title Section */}
        <div className="flex flex-col gap-4 border-b border-line-primary pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                ANALYSIS COMPLETE
              </span>
            </div>
            <h1 className="text-fg-primary text-2xl font-bold tracking-tight">변경 영향 분석 결과</h1>
            <p className="text-fg-secondary text-xs flex items-center gap-1.5">
              <Clock className="size-3.5 text-icon-default" />
              <span>최종 업데이트: {commit.updatedAt} (Branch: <span className="font-semibold text-fg-primary">{commit.branch}</span>)</span>
            </p>
          </div>

          {/* Top Actions: Interactive Selector & Premium Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <select
                value={activeCommitId}
                onChange={(e) => handleCommitChange(e.target.value)}
                className="appearance-none bg-canvas-surface text-fg-primary border border-line-primary rounded-md pl-3 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent-primary cursor-pointer hover:border-line-strong transition-colors min-w-[200px]"
              >
                {Object.values(MOCK_COMMIT_ANALYSES).map((item) => (
                  <option key={item.commitId} value={item.commitId}>
                    {item.commitId} - {item.commitMsg}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-fg-muted pointer-events-none" />
            </div>

            <Button
              variant="outline"
              className="border-line-primary text-fg-secondary bg-canvas-surface hover:bg-canvas-surface-2 hover:text-fg-primary text-xs font-semibold px-3 py-1.5 h-8 flex items-center gap-1.5"
            >
              <FileDown className="size-3.5" />
              <span>Export Markdown</span>
            </Button>

            <Button
              className="bg-accent-primary hover:bg-accent-hover text-canvas-primary text-xs font-semibold px-3 py-1.5 h-8 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Share2 className="size-3.5" />
              <span>Share Report</span>
            </Button>
          </div>
        </div>

        {/* Row 1 Grid: Module Topology & Items Needing Verification */}
        <div className={cn("grid gap-6 lg:grid-cols-3 transition-opacity duration-300", isPending && "opacity-60")}>
          
          {/* Card Left: Module Topology SVG Chart */}
          <div className="lg:col-span-2 border-line-primary bg-canvas-surface rounded-lg border p-5 flex flex-col justify-between shadow-xs relative min-h-[360px]">
            <div className="flex items-center justify-between border-b border-line-subtle pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-accent-primary" />
                <h3 className="text-fg-primary font-bold text-sm">영향받는 모듈 관계도 (Module Topology)</h3>
              </div>
              {commit.criticalPath && (
                <span className="text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full">
                  Critical Path
                </span>
              )}
            </div>

            {/* Interactive SVG Canvas Area */}
            <div className="flex-1 w-full relative overflow-hidden rounded-md bg-canvas-secondary/30 border border-line-subtle/50 h-[260px]">
              {/* Backing Grid Overlay */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                {Array.from({ length: 72 }).map((_, i) => (
                  <div key={i} className="border-t border-l border-fg-primary" />
                ))}
              </div>

              {/* Render links and nodes within a zoomable canvas */}
              <div 
                className="w-full h-full relative transition-transform duration-300 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 620 300" fill="none" preserveAspectRatio="none">
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="18"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" className="fill-icon-default/60" />
                    </marker>
                    <marker
                      id="arrow-red"
                      viewBox="0 0 10 10"
                      refX="18"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" className="fill-red-500" />
                    </marker>
                  </defs>

                  {/* Render links */}
                  {commit.topology.links.map((link, idx) => (
                    <line
                      key={idx}
                      x1={link.x1}
                      y1={link.y1}
                      x2={link.x2}
                      y2={link.y2}
                      className={cn(
                        link.isCritical 
                          ? "stroke-red-500 dark:stroke-red-400 stroke-[2px]" 
                          : "stroke-line-strong/40 stroke-[1.5px]"
                      )}
                      strokeDasharray="4 4"
                      markerEnd={link.isCritical ? "url(#arrow-red)" : "url(#arrow)"}
                    />
                  ))}
                </svg>

                {/* HTML Nodes Overlay */}
                {commit.topology.nodes.map((node) => (
                  <div
                    key={node.id}
                    className={cn(
                      "absolute px-3 py-2 rounded-md border shadow-sm flex flex-col items-center justify-center min-w-[120px] transition-all duration-300 text-xs font-semibold",
                      node.type === "source" && "border-blue-500 bg-blue-500/5 dark:border-blue-400 dark:bg-blue-400/5 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
                      node.type === "affected" && "border-red-500 bg-red-500/5 dark:border-red-400 dark:bg-red-400/5 shadow-[0_0_12px_rgba(239,68,68,0.15)]",
                      node.type === "none" && "border-line-primary bg-canvas-surface text-fg-primary"
                    )}
                    style={{
                      left: `${(node.x / 620) * 100}%`,
                      top: `${(node.y / 300) * 100}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    <span className={cn(
                      node.type === "source" && "text-blue-500 dark:text-blue-400",
                      node.type === "affected" && "text-red-500 dark:text-red-400",
                      node.type === "none" && "text-fg-primary"
                    )}>
                      {node.label}
                    </span>
                    {node.type === "source" && (
                      <span className="text-[8px] font-extrabold text-blue-500 dark:text-blue-400 uppercase mt-0.5 tracking-wider leading-none">
                        SOURCE
                      </span>
                    )}
                    {node.type === "affected" && (
                      <span className="text-[8px] font-extrabold text-red-500 dark:text-red-400 uppercase mt-0.5 tracking-wider leading-none">
                        AFFECTED
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Canvas Floating Controls */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-canvas-surface/90 border border-line-primary/50 rounded-md p-1 shadow-md shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={handleZoomOut} className="size-6 text-icon-default hover:text-icon-active hover:bg-canvas-surface-2 rounded flex items-center justify-center cursor-pointer transition-colors" aria-label="Zoom Out">
                      <ZoomOut className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">축소</TooltipContent>
                </Tooltip>
                <div className="text-[10px] font-semibold text-fg-secondary px-1 min-w-[32px] text-center select-none leading-none">
                  {Math.round(zoomLevel * 100)}%
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={handleZoomIn} className="size-6 text-icon-default hover:text-icon-active hover:bg-canvas-surface-2 rounded flex items-center justify-center cursor-pointer transition-colors" aria-label="Zoom In">
                      <ZoomIn className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">확대</TooltipContent>
                </Tooltip>
                <div className="w-px h-3.5 bg-line-primary mx-0.5" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={handleZoomReset} className="size-6 text-icon-default hover:text-icon-active hover:bg-canvas-surface-2 rounded flex items-center justify-center cursor-pointer transition-colors" aria-label="Reset View">
                      <Maximize2 className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">초기화</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Card Right: Items Needing Verification */}
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-5 flex flex-col justify-between shadow-xs">
            <div className="w-full border-b border-line-subtle pb-3 mb-4 flex items-center justify-between shrink-0">
              <h3 className="text-fg-primary font-bold text-sm">검증 필요 항목 ({commit.verificationItems.length}건)</h3>
              <button className="text-xs text-accent-primary hover:text-accent-hover hover:underline cursor-pointer font-semibold leading-none">
                모두 보기
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[260px] pr-1">
              {commit.verificationItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-start gap-3 p-3.5 rounded-lg border border-line-subtle bg-canvas-secondary/20 hover:bg-canvas-secondary/40 transition-colors"
                >
                  <AlertCircle className={cn(
                    "size-4 shrink-0 mt-0.5",
                    item.priority.includes("HIGH") ? "text-red-500" : "text-amber-500"
                  )} />
                  <div className="flex-1 space-y-1.5">
                    <h4 className="text-xs font-bold text-fg-primary leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-fg-secondary leading-normal">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[9px] px-1.5 py-0 rounded bg-transparent border-none font-extrabold tracking-wider leading-none",
                          item.priority.includes("HIGH") 
                            ? "bg-red-500/10 text-red-500" 
                            : "bg-amber-500/10 text-amber-500"
                        )}
                      >
                        {item.priority}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-[9px] px-1.5 py-0 rounded bg-canvas-surface-2 text-fg-secondary border-none font-semibold leading-none"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Associated Requirements Deck */}
        <div className={cn("border-line-primary bg-canvas-surface rounded-lg border p-5 shadow-xs space-y-4 transition-opacity duration-300", isPending && "opacity-60")}>
          <div className="flex items-center gap-2 border-b border-line-subtle pb-3">
            <FileText className="size-4 text-blue-500" />
            <h3 className="text-fg-primary font-bold text-sm">연관 요구사항 (Associated Requirements)</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* PRM Column */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2 flex items-center gap-1.5 select-none">
                <span className="size-1.5 rounded-full bg-blue-500 shrink-0" /> PRM
              </h4>
              <div className="space-y-2">
                {commit.associatedReqs.prm.map((req) => (
                  <div 
                    key={req.id} 
                    className="p-3 border border-line-subtle rounded-md bg-canvas-secondary/15 hover:border-blue-500/50 hover:bg-canvas-secondary/30 transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-blue-500 block mb-0.5 leading-none transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {req.id}
                    </span>
                    <span className="text-xs text-fg-primary font-medium">{req.name}</span>
                  </div>
                ))}
                {commit.associatedReqs.prm.length === 0 && (
                  <p className="text-[10px] text-fg-muted italic">연관된 PRM이 없습니다.</p>
                )}
              </div>
            </div>

            {/* FEATURE Column */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2 flex items-center gap-1.5 select-none">
                <span className="size-1.5 rounded-full bg-purple-500 shrink-0" /> FEATURE
              </h4>
              <div className="space-y-2">
                {commit.associatedReqs.feature.map((req) => (
                  <div 
                    key={req.id} 
                    className="p-3 border border-line-subtle rounded-md bg-canvas-secondary/15 hover:border-purple-500/50 hover:bg-canvas-secondary/30 transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-purple-500 block mb-0.5 leading-none transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {req.id}
                    </span>
                    <span className="text-xs text-fg-primary font-medium">{req.name}</span>
                  </div>
                ))}
                {commit.associatedReqs.feature.length === 0 && (
                  <p className="text-[10px] text-fg-muted italic">연관된 FEATURE가 없습니다.</p>
                )}
              </div>
            </div>

            {/* SRS Column */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2 flex items-center gap-1.5 select-none">
                <span className="size-1.5 rounded-full bg-amber-500 shrink-0" /> SRS
              </h4>
              <div className="space-y-2">
                {commit.associatedReqs.srs.map((req) => (
                  <div 
                    key={req.id} 
                    className="p-3 border border-line-subtle rounded-md bg-canvas-secondary/15 hover:border-amber-500/50 hover:bg-canvas-secondary/30 transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-amber-500 block mb-0.5 leading-none transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      {req.id}
                    </span>
                    <span className="text-xs text-fg-primary font-medium">{req.name}</span>
                  </div>
                ))}
                {commit.associatedReqs.srs.length === 0 && (
                  <p className="text-[10px] text-fg-muted italic">연관된 SRS가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: AI Code Review Summary & Advice Box */}
        <div className={cn("border-line-primary bg-canvas-surface rounded-lg border p-5 shadow-xs space-y-5 transition-opacity duration-300", isPending && "opacity-60")}>
          <div className="flex items-center gap-2 border-b border-line-subtle pb-3">
            <FileCode className="size-4 text-purple-500" />
            <h3 className="text-fg-primary font-bold text-sm">AI 코드 리뷰 결과 요약</h3>
          </div>

          {/* AI Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Metric 1 */}
            <div className="p-4 border border-line-subtle rounded-lg bg-canvas-secondary/10 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-fg-muted block uppercase tracking-wider">성능 최적화</span>
              <div className="my-2.5 space-y-1">
                <div className="text-fg-primary text-xl font-bold tracking-tight">{commit.aiReview.perf.score}%</div>
                <div className="w-full bg-line-primary/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${commit.aiReview.perf.score}%` }} />
                </div>
              </div>
              <span className="text-[10px] text-fg-secondary font-medium">{commit.aiReview.perf.desc}</span>
            </div>

            {/* Metric 2 */}
            <div className="p-4 border border-line-subtle rounded-lg bg-canvas-secondary/10 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-fg-muted block uppercase tracking-wider">코드 가독성</span>
              <div className="my-2.5 space-y-1">
                <div className="text-fg-primary text-xl font-bold tracking-tight">{commit.aiReview.readability.score}%</div>
                <div className="w-full bg-line-primary/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${commit.aiReview.readability.score}%` }} />
                </div>
              </div>
              <span className="text-[10px] text-fg-secondary font-medium">{commit.aiReview.readability.desc}</span>
            </div>

            {/* Metric 3 */}
            <div className="p-4 border border-line-subtle rounded-lg bg-canvas-secondary/10 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-fg-muted block uppercase tracking-wider">보안 취약점</span>
              <div className="my-2.5 space-y-1">
                <div className={cn(
                  "text-xl font-bold tracking-tight",
                  commit.aiReview.security.count > 0 ? "text-red-500" : "text-emerald-500"
                )}>
                  {commit.aiReview.security.count > 0 ? `${commit.aiReview.security.count} Issues` : "0 Issues"}
                </div>
                <div className="w-full bg-line-primary/30 h-1.5 rounded-full overflow-hidden">
                  <div className={cn(
                    "h-full transition-all duration-500",
                    commit.aiReview.security.count > 0 ? "bg-red-500" : "bg-emerald-500"
                  )} style={{ width: commit.aiReview.security.count > 0 ? "40%" : "100%" }} />
                </div>
              </div>
              <span className="text-[10px] text-fg-secondary font-medium">{commit.aiReview.security.desc}</span>
            </div>

            {/* Metric 4 */}
            <div className="p-4 border border-line-subtle rounded-lg bg-canvas-secondary/10 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-fg-muted block uppercase tracking-wider">테스트 용이성</span>
              <div className="my-2.5 space-y-1">
                <div className="text-fg-primary text-xl font-bold tracking-tight">{commit.aiReview.testability.score}%</div>
                <div className="w-full bg-line-primary/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${commit.aiReview.testability.score}%` }} />
                </div>
              </div>
              <span className="text-[10px] text-fg-secondary font-medium">{commit.aiReview.testability.desc}</span>
            </div>
          </div>

          {/* Advice Bulb Alert Box */}
          <div className="bg-blue-500/5 dark:bg-blue-400/5 rounded-lg p-4 border border-blue-500/10 dark:border-blue-400/10 flex items-start gap-3">
            <Lightbulb className="size-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-blue-500 dark:text-blue-400 leading-none">AI 아키텍처 의존성 권고사항</h5>
              <p className="text-xs text-fg-secondary leading-relaxed font-medium">
                {commit.aiReview.advice}
              </p>
            </div>
          </div>
        </div>

        {/* Row 4: Unit Test Tables & System Test Cards */}
        <div className={cn("grid gap-6 md:grid-cols-2 transition-opacity duration-300", isPending && "opacity-60")}>
          
          {/* Card Left: Unit Test List Table */}
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-5 shadow-xs flex flex-col justify-between">
            <div className="shrink-0 space-y-3 mb-4">
              <div className="flex items-center justify-between border-b border-line-subtle pb-3">
                <div className="flex items-center gap-2">
                  <FlaskConical className="size-4 text-blue-500" />
                  <h3 className="text-fg-primary font-bold text-sm">관련 Unit Test 목록 ({commit.unitTests.total}건)</h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold bg-blue-500/10 text-blue-500 border-none px-2.5 py-0.5 rounded-full select-none leading-none">
                  Coverage {commit.unitTests.coverage}%
                </Badge>
              </div>

              {/* Table Column Headers */}
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-fg-muted uppercase tracking-wider px-2">
                <span className="col-span-6">TEST CASE NAME</span>
                <span className="col-span-3 text-center">STATUS</span>
                <span className="col-span-3 text-right">DURATION</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="flex-1 space-y-2 overflow-y-auto max-h-[220px]">
              {commit.unitTests.tests.map((test, index) => (
                <div 
                  key={index}
                  className="grid grid-cols-12 gap-2 text-xs font-medium py-2.5 px-3 rounded-md border border-line-subtle/50 bg-canvas-secondary/10 items-center"
                >
                  <span className="col-span-6 truncate font-mono text-fg-primary" title={test.name}>{test.name}</span>
                  <div className="col-span-3 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 leading-none">
                      <span className={cn(
                        "size-1.5 rounded-full shrink-0",
                        test.status === "PASSED" && "bg-emerald-500",
                        test.status === "FAILED" && "bg-red-500",
                        test.status === "SKIPPED" && "bg-fg-muted/40"
                      )} />
                      <span className={cn(
                        "text-[10px] font-bold tracking-wider leading-none",
                        test.status === "PASSED" && "text-emerald-500",
                        test.status === "FAILED" && "text-red-500",
                        test.status === "SKIPPED" && "text-fg-muted"
                      )}>
                        {test.status}
                      </span>
                    </span>
                  </div>
                  <span className="col-span-3 text-right text-fg-muted font-mono leading-none">{test.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card Right: System Test Case Deck */}
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-5 shadow-xs flex flex-col justify-between">
            <div className="w-full border-b border-line-subtle pb-3 mb-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                <h3 className="text-fg-primary font-bold text-sm">System Test Case 목록 ({commit.systemTests.total}건)</h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border-none px-2.5 py-0.5 rounded-full select-none leading-none">
                Success Rate {commit.systemTests.successRate}%
              </Badge>
            </div>

            {/* Test Cards List */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[200px] pr-1">
              {commit.systemTests.tests.map((test) => (
                <div
                  key={test.id}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-md border transition-all duration-300",
                    test.status === "FAILED" 
                      ? "border-red-500/40 bg-red-500/5 dark:border-red-400/30 dark:bg-red-400/5" 
                      : "border-line-subtle bg-canvas-secondary/15 hover:bg-canvas-secondary/25"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[10px] font-extrabold tracking-wider leading-none px-1.5 py-0.5 rounded shrink-0",
                      test.status === "FAILED" 
                        ? "bg-red-500/10 text-red-500" 
                        : "bg-canvas-surface-2 text-fg-muted"
                    )}>
                      {test.id}
                    </span>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-fg-primary leading-tight">{test.name}</h4>
                      <p className="text-[10px] text-fg-muted leading-none font-medium">{test.desc}</p>
                    </div>
                  </div>

                  {test.status === "PASSED" ? (
                    <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="size-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 animate-pulse">
                      <X className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* View Full Report Footer Link */}
            <div className="mt-4 pt-3 border-t border-line-subtle flex justify-end shrink-0">
              <button className="text-xs font-bold text-accent-primary hover:text-accent-hover flex items-center gap-1 cursor-pointer leading-none">
                <span>전체 테스트 리포트 확인</span>
                <ExternalLink className="size-3" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


// Subtle hook wrapper to allow Tooltip layout checks
function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="relative group/tooltip">{children}</div>;
}

function TooltipTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  return <div className="inline-block">{children}</div>;
}

function TooltipContent({ children, side }: { children: React.ReactNode; side?: string }) {
  return (
    <div className={cn(
      "absolute hidden group-hover/tooltip:block bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black text-[10px] font-semibold px-2 py-1 rounded shadow-md z-50 pointer-events-none whitespace-nowrap -translate-x-1/2 left-1/2",
      side === "top" && "bottom-full mb-1.5",
      side === "bottom" && "top-full mt-1.5",
      side === "right" && "left-full ml-1.5 top-1/2 -translate-y-1/2"
    )}>
      {children}
    </div>
  );
}
