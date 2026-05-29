"use client";

import { FindingsCard } from "@/components/code-impact/FindingsCard";
import { ModuleTopologyCard } from "@/components/code-impact/ModuleTopologyCard";
import { AgentSummaryCard } from "@/components/dashboard/AgentSummaryCard";
import { CommitSelector } from "@/components/dashboard/CommitSelector";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileLeftPanelTrigger } from "@/components/layout/MobileLeftPanelTrigger";
import { AssociatedRequirementsCard } from "@/components/requirement/AssociatedRequirementsCard";
import { PageToolbar } from "@/components/shared/PageToolbar";
import { SystemTestListCard } from "@/components/system-test/SystemTestListCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UnitTestListCard } from "@/components/unit-test/UnitTestListCard";
import { layoutMaxW } from "@/config/layout";
import { CURRENT_USER } from "@/constants/review";
import { cn } from "@/lib/utils";
import { codeImpactService } from "@/services/code-impact-service";
import { commitService } from "@/services/commit-service";
import { requirementService } from "@/services/requirement-service";
import { systemTestService } from "@/services/system-test-service";
import { unitTestService } from "@/services/unit-test-service";
import { usePanelStore } from "@/stores/panel-store";
import type { CodeImpactReport } from "@/types/code-impact-report";
import type { CommitOption } from "@/types/commit";
import type { RequirementReport } from "@/types/requirement-report";
import type { ReviewStatus } from "@/types/review";
import type { SystemTestReport } from "@/types/system-test-report";
import type { UnitTestReport } from "@/types/unit-test";
import { Download, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ProjectDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);

  const [commits, setCommits] = useState<CommitOption[]>([]);
  const [commitId, setCommitId] = useState<string>();
  const [codeImpact, setCodeImpact] = useState<CodeImpactReport>();
  const [requirement, setRequirement] = useState<RequirementReport>();
  const [unitTest, setUnitTest] = useState<UnitTestReport>();
  const [systemTest, setSystemTest] = useState<SystemTestReport>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  // 1) 커밋 목록 로딩 + 첫 커밋 자동 선택
  useEffect(() => {
    let cancelled = false;
    commitService
      .list(id)
      .then((list) => {
        if (cancelled) return;
        setCommits(list);
        if (list.length > 0) {
          setCommitId((prev) => prev ?? list[0].commit_id);
        } else {
          setIsLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "커밋 목록 로딩 실패");
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // 2) commit 변경시 4개 에이전트 결과 병렬 로딩
  useEffect(() => {
    if (!commitId) return;
    let cancelled = false;
    Promise.all([
      codeImpactService.get(id, commitId),
      requirementService.get(id, commitId),
      unitTestService.get(id, commitId),
      systemTestService.get(id, commitId),
    ])
      .then(([ci, rq, ut, st]) => {
        if (cancelled) return;
        setCodeImpact(ci);
        setRequirement(rq);
        setUnitTest(ut);
        setSystemTest(st);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "분석 결과 로딩 실패");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, commitId]);

  const handleCommitChange = useCallback((next: string) => {
    setCommitId((prev) => {
      if (prev === next) return prev;
      setIsLoading(true);
      return next;
    });
  }, []);

  const handleReviewChange = useCallback(
    async (findingId: string, next: ReviewStatus) => {
      if (!commitId) return;
      // optimistic update
      setCodeImpact((prev) =>
        prev
          ? {
              ...prev,
              findings: prev.findings.map((f) =>
                f.id === findingId
                  ? {
                      ...f,
                      review: {
                        status: next,
                        reviewer: next === "pending" ? null : CURRENT_USER,
                        reviewed_at:
                          next === "pending" ? null : new Date().toISOString(),
                      },
                    }
                  : f,
              ),
            }
          : prev,
      );
      try {
        await codeImpactService.updateReview(id, commitId, findingId, next);
      } catch {
        // 실패시 서버 상태로 재동기화
        const fresh = await codeImpactService.get(id, commitId);
        setCodeImpact(fresh);
      }
    },
    [id, commitId],
  );

  const currentCommit = commits.find((c) => c.commit_id === commitId);

  return (
    <div className="h-full overflow-y-auto">
      <PageToolbar
        maxWidthClassName={layoutMaxW(fullWidthMode)}
        left={
          <>
            <MobileLeftPanelTrigger />
            <CommitSelector
              value={commitId}
              options={commits}
              onChange={handleCommitChange}
            />
          </>
        }
        right={
          <>
            <Button
              variant="outline"
              size="sm"
              aria-label="Export"
              className="max-md:size-8 max-md:!px-0"
            >
              <Download className="size-4" />
              <span className="max-md:hidden">Export</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              aria-label="Share"
              className="max-md:size-8 max-md:!px-0"
            >
              <Share2 className="size-4" />
              <span className="max-md:hidden">Share</span>
            </Button>
          </>
        }
      />
      <div
        className={cn(
          "mx-auto px-6 pb-6 transition-[max-width] duration-300 ease-in-out",
          layoutMaxW(fullWidthMode),
        )}
      >
        <DashboardHeader
          status={codeImpact ? "complete" : "running"}
          analyzedAtLabel={
            currentCommit ? formatDateTime(currentCommit.created_at) : "—"
          }
          branch={currentCommit?.branch ?? "—"}
        />

        {error && (
          <div className="border-destructive/40 bg-destructive-soft text-destructive-fg mb-4 rounded-lg border px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {isLoading ||
        !codeImpact ||
        !requirement ||
        !unitTest ||
        !systemTest ? (
          <LoadingGrid />
        ) : (
          <div className="grid grid-cols-12 items-start gap-4">
            <ModuleTopologyCard
              className="col-span-12 lg:col-span-7"
              topology={codeImpact.topology}
              projectId={id}
              commitId={commitId}
            />
            <FindingsCard
              className="col-span-12 lg:col-span-5"
              findings={codeImpact.findings}
              projectId={id}
              commitId={commitId}
              onChangeStatus={handleReviewChange}
            />

            <AssociatedRequirementsCard
              className="col-span-12"
              data={requirement}
              projectId={id}
              commitId={commitId}
            />

            <AgentSummaryCard
              className="col-span-12"
              metrics={[
                codeImpact.score,
                requirement.score,
                systemTest.score,
                unitTest.score,
              ]}
              advisory={codeImpact.advisory}
            />

            <UnitTestListCard
              className="col-span-12 lg:col-span-6"
              data={unitTest}
              projectId={id}
              commitId={commitId}
            />
            <SystemTestListCard
              className="col-span-12 lg:col-span-6"
              data={systemTest}
              projectId={id}
              commitId={commitId}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Skeleton className="col-span-12 h-[380px] lg:col-span-7" />
      <Skeleton className="col-span-12 h-[380px] lg:col-span-5" />
      <Skeleton className="col-span-12 h-[180px]" />
      <Skeleton className="col-span-12 h-[140px]" />
      <Skeleton className="col-span-12 h-[320px] lg:col-span-6" />
      <Skeleton className="col-span-12 h-[320px] lg:col-span-6" />
    </div>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}
