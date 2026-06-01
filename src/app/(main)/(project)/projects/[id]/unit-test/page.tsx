"use client";

import { MobileLeftPanelTrigger } from "@/components/layout/MobileLeftPanelTrigger";
import { AnalysisResultHeader } from "@/components/shared/AnalysisResultHeader";
import { CommitSelector } from "@/components/shared/CommitSelector";
import { PageToolbar } from "@/components/shared/PageToolbar";
import { ScrollNavButtons } from "@/components/shared/ScrollNavButtons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { BestOfNCard } from "@/components/unit-test/BestOfNCard";
import { TestLogViewer } from "@/components/unit-test/TestLogViewer";
import { UnitTestVerificationCard } from "@/components/unit-test/UnitTestVerificationCard";
import { layoutMaxW } from "@/config/layout";
import { useOverlay } from "@/hooks/useOverlay";
import { cn } from "@/lib/utils";
import { commitService } from "@/services/commit-service";
import { unitTestService } from "@/services/unit-test-service";
import { usePanelStore } from "@/stores/panel-store";
import type { CommitOption } from "@/types/commit";
import type { UnitTestAgentReport, UnitTestGroupKey } from "@/types/unit-test";
import { Download, Logs, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function UnitTestPage() {
  const { id } = useParams<{ id: string }>();
  const overlay = useOverlay();
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);
  const resetRightPanel = usePanelStore((s) => s.resetRightPanel);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleViewLog = useCallback(() => {
    if (!report) return;
    overlay.modal({
      title: `${report.test_log_name}`,
      size: "2xl",
      content: <TestLogViewer log={report.test_log} />,
    });
  }, [overlay, report]);

  return (
    <div className="relative flex h-full flex-col">
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
              onClick={handleViewLog}
              disabled={!report}
              aria-label="Log"
              className="max-md:size-8 max-md:px-0!"
            >
              <Logs className="size-4" />
              <span className="max-md:hidden">Log</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              disabled={!report}
              aria-label="Export Markdown"
              className="max-md:size-8 max-md:px-0!"
            >
              <Download className="size-4" />
              <span className="max-md:hidden">Export</span>
            </Button>
            <Button
              size="sm"
              onClick={handleShare}
              aria-label="Share"
              className="max-md:size-8 max-md:px-0!"
            >
              <Share2 className="size-4" />
              <span className="max-md:hidden">
                {shareCopied ? "Copied" : "Share"}
              </span>
            </Button>
          </>
        }
      />

      <ScrollArea className="min-h-0 flex-1" viewportRef={scrollRef}>
        <div
          className={cn(
            "mx-auto px-6 pb-6 transition-[max-width] duration-300 ease-in-out",
            layoutMaxW(fullWidthMode),
          )}
        >
          <AnalysisResultHeader
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
              <UnitTestVerificationCard
                items={filteredItems}
                totalItems={report.vis.length}
                query={query}
                onQueryChange={setQuery}
                groups={report.groups}
                activeKey={activeKey}
                onActiveKeyChange={setActiveKey}
                files={report.files}
              />
              <BestOfNCard rows={report.bestofn} files={report.files} />
            </div>
          )}
        </div>
      </ScrollArea>
      <ScrollNavButtons targetRef={scrollRef} />
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-[420px] w-full" />
      <Skeleton className="h-[320px] w-full" />
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
