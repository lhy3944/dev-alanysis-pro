"use client";

import { Download, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { layoutMaxW } from "@/config/layout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CommitSelector } from "@/components/dashboard/CommitSelector";
import { MobileLeftPanelTrigger } from "@/components/layout/MobileLeftPanelTrigger";
import { PageToolbar } from "@/components/shared/PageToolbar";
import { BestOfNCard } from "@/components/unit-test/BestOfNCard";
import { TestLogCard } from "@/components/unit-test/TestLogCard";
import { UnitTestKpiStrip } from "@/components/unit-test/UnitTestKpiStrip";
import { UnitTestVerificationCard } from "@/components/unit-test/UnitTestVerificationCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { commitService } from "@/services/commit-service";
import { unitTestService } from "@/services/unit-test-service";
import { usePanelStore } from "@/stores/panel-store";
import type { CommitOption } from "@/types/commit";
import type { UnitTestAgentReport, UnitTestGroupKey } from "@/types/unit-test";

export default function UnitTestPage() {
  const { id } = useParams<{ id: string }>();
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);
  const resetRightPanel = usePanelStore((s) => s.resetRightPanel);

  const [commits, setCommits] = useState<CommitOption[]>([]);
  const [commitId, setCommitId] = useState<string>();
  const [report, setReport] = useState<UnitTestAgentReport>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [activeKey, setActiveKey] = useState<UnitTestGroupKey | null>(null);
  const [query, setQuery] = useState("");
  const [shareCopied, setShareCopied] = useState(false);

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

  // 2) commit 변경 시 에이전트 리포트 로딩
  useEffect(() => {
    if (!commitId) return;
    let cancelled = false;
    unitTestService
      .getAgentReport(id, commitId)
      .then((r) => {
        if (cancelled) return;
        setReport(r);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unit Test 리포트 로딩 실패");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, commitId]);

  // 3) 페이지 unmount 시 코드 뷰어 정리
  useEffect(() => {
    return () => {
      resetRightPanel();
    };
  }, [resetRightPanel]);

  const handleCommitChange = useCallback((next: string) => {
    setCommitId((prev) => {
      if (prev === next) return prev;
      setIsLoading(true);
      return next;
    });
  }, []);

  const currentCommit = commits.find((c) => c.commit_id === commitId);

  const filteredItems = useMemo(() => {
    if (!report) return [];
    const group = activeKey
      ? report.groups.find((g) => g.key === activeKey)
      : null;
    const allowedCodes = group ? new Set<string>(group.codes) : null;
    const q = query.trim().toLowerCase();
    return report.vis.filter((v) => {
      if (allowedCodes && !allowedCodes.has(v.code)) return false;
      if (!q) return true;
      const hay =
        `#${v.id} ${v.text} ${v.reason} ${v.file ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [report, activeKey, query]);

  const handleExportMarkdown = useCallback(() => {
    if (!report) return;
    const blob = new Blob([report.markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `unittest-${currentCommit?.commit_id ?? "report"}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [report, currentCommit]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch {
      // clipboard 미지원 환경 — 무시
    }
  }, []);

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
              onClick={handleExportMarkdown}
              disabled={!report}
              aria-label="Export Markdown"
              className="max-md:size-8 max-md:!px-0"
            >
              <Download className="size-4" />
              <span className="max-md:hidden">Export</span>
            </Button>
            <Button
              size="sm"
              onClick={handleShare}
              aria-label="Share"
              className="max-md:size-8 max-md:!px-0"
            >
              <Share2 className="size-4" />
              <span className="max-md:hidden">
                {shareCopied ? "Copied" : "Share"}
              </span>
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
          title="Unit Test 결과 리포트"
          status={report ? "complete" : "running"}
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

        {isLoading || !report ? (
          <LoadingGrid />
        ) : (
          <div className="flex flex-col gap-4">
            <UnitTestKpiStrip
              total={report.total}
              groups={report.groups}
              activeKey={activeKey}
              onChange={setActiveKey}
            />
            <UnitTestVerificationCard
              items={filteredItems}
              totalItems={report.vis.length}
              query={query}
              onQueryChange={setQuery}
              files={report.files}
            />
            <div className="grid grid-cols-12 items-start gap-4">
              <BestOfNCard
                className="col-span-12 lg:col-span-7"
                rows={report.bestofn}
                files={report.files}
              />
              <TestLogCard
                className="col-span-12 lg:col-span-5"
                log={report.test_log}
                name={report.test_log_name}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-[96px] w-full" />
      <Skeleton className="h-[420px] w-full" />
      <div className="grid grid-cols-12 gap-4">
        <Skeleton className="col-span-12 h-[320px] lg:col-span-7" />
        <Skeleton className="col-span-12 h-[320px] lg:col-span-5" />
      </div>
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
