"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ANALYSIS_TYPE_COLORS,
  ANALYSIS_TYPE_LABELS,
  LIFECYCLE_COLORS,
  LIFECYCLE_LABELS,
} from "@/constants/project";
import { useProjectStore } from "@/stores/project-store";
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
} from "lucide-react";
import Link from "next/link";
import { usePanelStore } from "@/stores/panel-store";
import { layoutMaxW } from "@/config/layout";

export default function ProjectWorkspaceDashboard() {
  const { currentProject, isLoading, error } = useProjectStore();
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);
  const leftSidebarOpen = usePanelStore((s) => s.leftSidebarOpen);

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
        <p className="text-fg-secondary mt-1 text-sm max-w-md">
          {error || "선택된 프로젝트가 존재하지 않거나 올바르지 않은 식별자입니다."}
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/my-projects">프로젝트 목록으로 이동</Link>
        </Button>
      </div>
    );
  }

  const contentHalfWidth = fullWidthMode ? "1080px" : "576px";

  return (
    <div className="h-full overflow-y-auto">
      <div
        className={cn(
          "transition-[max-width,margin] duration-300 ease-in-out px-6 py-6",
          layoutMaxW(fullWidthMode),
        )}
        style={{
          "--sidebar-width": leftSidebarOpen ? "220px" : "60px",
          marginLeft: `max(0px, calc(50vw - ${contentHalfWidth} - var(--sidebar-width)))`,
          marginRight: "auto",
        } as React.CSSProperties}
      >
        {/* Welcome Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-line-primary pb-6">
          <div>
            <span className="text-accent-primary text-sm font-bold uppercase tracking-wider">
              Project Workspace Dashboard
            </span>
            <h1 className="text-fg-primary text-2xl font-bold mt-1">
              {currentProject.name}
            </h1>
            <p className="text-fg-secondary text-sm mt-1">
              프로젝트 품질 분석 상태와 핵심 모듈 현황을 한눈에 모니터링합니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="ghost"
              className={cn(
                LIFECYCLE_COLORS[currentProject.lifecycle_status],
                "px-3 py-1 text-sm",
              )}
            >
              {LIFECYCLE_LABELS[currentProject.lifecycle_status]}
            </Badge>
            <Badge
              variant="ghost"
              className={cn(
                ANALYSIS_TYPE_COLORS[currentProject.analysis_type],
                "px-3 py-1 text-sm",
              )}
            >
              {ANALYSIS_TYPE_LABELS[currentProject.analysis_type]}
            </Badge>
          </div>
        </div>

        {/* Description & Overview Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main description */}
          <div className="md:col-span-2 border-line-primary bg-canvas-surface rounded-lg border p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-fg-primary font-semibold text-sm mb-2.5">프로젝트 소개</h3>
              <p className="text-fg-secondary text-sm leading-relaxed whitespace-pre-line">
                {currentProject.description || "이 프로젝트에 대한 세부 설명이 아직 등록되지 않았습니다."}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-dotted border-line-primary pt-5 text-sm text-fg-muted">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                업데이트: {new Date(currentProject.updated_at).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 justify-end">
                <Users className="size-4" />
                참여 멤버: {currentProject.member_count}명
              </span>
            </div>
          </div>

          {/* Info card */}
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-6">
            <h3 className="text-fg-primary font-semibold text-sm mb-4">프로젝트 정보 요약</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-line-subtle">
                <span className="text-fg-muted text-sm">Domain</span>
                <span className="text-fg-primary font-medium">{currentProject.domain || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-line-subtle">
                <span className="text-fg-muted text-sm">Product Type</span>
                <span className="text-fg-primary font-medium">{currentProject.product_type || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-line-subtle">
                <span className="text-fg-muted text-sm">Analysis Target</span>
                <span className="text-fg-primary font-medium">{currentProject.analysis_type}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-fg-muted text-sm">Status</span>
                <span className="text-fg-primary font-medium capitalize">{currentProject.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module Overview Section */}
        <h2 className="text-fg-primary text-base font-semibold mt-8 mb-4">활성화된 품질 분석 모듈</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Module: Requirement */}
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-5 flex flex-col justify-between hover:border-accent-primary/40 transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="bg-blue-500/10 text-blue-500 size-8 rounded-md flex items-center justify-center">
                  <FileText className="size-4" />
                </div>
                <h3 className="text-fg-primary font-semibold text-sm">요구사항 분석</h3>
              </div>
              <p className="text-fg-muted text-sm mb-4 leading-relaxed">
                업로드된 명세서로부터 요구사항 문장을 정밀 분석 및 정제하여 정적 자산화합니다.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-line-subtle pt-4 mt-auto">
              {currentProject.modules.includes("requirements") ? (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">
                  <CheckCircle2 className="size-3 mr-1" /> 활성화됨
                </Badge>
              ) : (
                <Badge variant="outline" className="text-fg-muted text-[10px]">
                  비활성화
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="text-sm text-accent-primary hover:text-accent-primary/80" asChild>
                <Link href={`/projects/${currentProject.project_id}/requirement`}>이동</Link>
              </Button>
            </div>
          </div>

          {/* Module: Design */}
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-5 flex flex-col justify-between hover:border-accent-primary/40 transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="bg-purple-500/10 text-purple-500 size-8 rounded-md flex items-center justify-center">
                  <Activity className="size-4" />
                </div>
                <h3 className="text-fg-primary font-semibold text-sm">아키텍처 설계</h3>
              </div>
              <p className="text-fg-muted text-sm mb-4 leading-relaxed">
                정제된 요구사항 모델을 기반으로 시스템 상세 아키텍처 및 관계 다이어그램을 추적 설계합니다.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-line-subtle pt-4 mt-auto">
              {currentProject.modules.includes("design") ? (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">
                  <CheckCircle2 className="size-3 mr-1" /> 활성화됨
                </Badge>
              ) : (
                <Badge variant="outline" className="text-fg-muted text-[10px]">
                  비활성화
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="text-sm text-accent-primary hover:text-accent-primary/80" asChild>
                <Link href={`/projects/${currentProject.project_id}/code-impact`}>이동</Link>
              </Button>
            </div>
          </div>

          {/* Module: Testcase */}
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-5 flex flex-col justify-between hover:border-accent-primary/40 transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="bg-amber-500/10 text-amber-500 size-8 rounded-md flex items-center justify-center">
                  <FlaskConical className="size-4" />
                </div>
                <h3 className="text-fg-primary font-semibold text-sm">자동 테스트 생성</h3>
              </div>
              <p className="text-fg-muted text-sm mb-4 leading-relaxed">
                설계 데이터와 코드 라인 분석 결과를 통합하여 정밀 단위 테스트 및 시나리오 테스트를 생성합니다.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-line-subtle pt-4 mt-auto">
              {currentProject.modules.includes("testcase") ? (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">
                  <CheckCircle2 className="size-3 mr-1" /> 활성화됨
                </Badge>
              ) : (
                <Badge variant="outline" className="text-fg-muted text-[10px]">
                  비활성화
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="text-sm text-accent-primary hover:text-accent-primary/80" asChild>
                <Link href={`/projects/${currentProject.project_id}/unit-test`}>이동</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mock Analytics Section */}
        <h2 className="text-fg-primary text-base font-semibold mt-8 mb-4">프로젝트 분석 통계 (Mock)</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-4 text-center">
            <span className="text-fg-muted text-sm font-medium">분석된 파일 개수</span>
            <div className="text-fg-primary text-xl font-bold mt-1">124개</div>
          </div>
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-4 text-center">
            <span className="text-fg-muted text-sm font-medium">정제 완료 요구사항</span>
            <div className="text-fg-primary text-xl font-bold mt-1">42개</div>
          </div>
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-4 text-center">
            <span className="text-fg-muted text-sm font-medium">생성된 테스트 커버리지</span>
            <div className="text-fg-primary text-xl font-bold mt-1">84.2%</div>
          </div>
          <div className="border-line-primary bg-canvas-surface rounded-lg border p-4 text-center">
            <span className="text-fg-muted text-sm font-medium">열린 PR 코드 영향도</span>
            <div className="text-fg-primary text-xl font-bold mt-1 flex items-center justify-center gap-1">
              <GitPullRequest className="size-4 text-accent-primary" />
              3건
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline helper for classnames
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
