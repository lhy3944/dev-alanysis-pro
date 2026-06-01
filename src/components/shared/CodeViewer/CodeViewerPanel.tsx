"use client";

import { Check, Copy, Download, FileCode, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePanelStore } from "@/stores/panel-store";
import { CodeViewerLazy } from "./CodeViewer.lazy";

/**
 * 우측 패널의 코드 뷰어 컨텐츠.
 * 단일 파일 — 툴바(파일명 / 복사 / 다운로드 / 닫기) + 본문(monaco).
 */
export function CodeViewerPanel() {
  const codeViewer = usePanelStore((s) => s.codeViewer);

  const active = codeViewer?.files.find((f) => f.name === codeViewer.activeFile);

  if (!active) {
    return (
      <div className="bg-canvas-surface text-fg-muted flex h-full items-center justify-center text-[12px]">
        왼쪽 표에서 테스트 파일을 클릭하세요.
      </div>
    );
  }

  return (
    <div className="bg-canvas-primary flex h-full flex-col">
      <CodeViewerToolbar file={active} />

      <div className="min-h-0 flex-1">
        <CodeViewerLazy
          key={active.name}
          code={active.code}
          language={active.language}
        />
      </div>
    </div>
  );
}

function CodeViewerToolbar({
  file,
}: {
  file: { name: string; code: string; language: string };
}) {
  const resetRightPanel = usePanelStore((s) => s.resetRightPanel);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard 미지원 환경 — 무시
    }
  };

  const handleDownload = () => {
    const blob = new Blob([file.code], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const lineCount = file.code.split("\n").length;

  return (
    <div className="border-line-subtle flex h-10 shrink-0 items-center justify-between gap-2 border-b px-3">
      <div className="flex min-w-0 items-center gap-1.5">
        <FileCode className="text-icon-default size-3.5 shrink-0" aria-hidden />
        <span className="text-fg-primary truncate text-[12px] font-medium">
          {file.name}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-fg-tertiary text-[11px] tabular-nums max-md:hidden">
          {lineCount} lines
        </span>
        <StatusBadge tone="neutral" label={file.language} />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-1 px-2 text-[11px]"
          aria-label="코드 복사"
        >
          {copied ? (
            <>
              <Check className="size-3" aria-hidden />
              복사됨
            </>
          ) : (
            <>
              <Copy className="size-3" aria-hidden />
              복사
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="h-7 gap-1 px-2 text-[11px]"
          aria-label="다운로드"
        >
          <Download className="size-3" aria-hidden />
          다운로드
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={resetRightPanel}
          className="size-7"
          aria-label="패널 닫기"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
