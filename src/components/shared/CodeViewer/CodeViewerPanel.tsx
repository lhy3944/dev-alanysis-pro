"use client";

import { Check, Copy, FileCode, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import { CodeViewerLazy } from "./CodeViewer.lazy";

/**
 * 우측 패널의 코드 뷰어 컨텐츠.
 * 파일 탭(가로 스크롤) + 헤더(언어/복사) + 본문(monaco).
 */
export function CodeViewerPanel() {
  const codeViewer = usePanelStore((s) => s.codeViewer);
  const setActiveCodeFile = usePanelStore((s) => s.setActiveCodeFile);
  const closeCodeFile = usePanelStore((s) => s.closeCodeFile);

  if (!codeViewer || codeViewer.files.length === 0) {
    return (
      <div className="bg-canvas-surface text-fg-muted flex h-full items-center justify-center text-[12px]">
        왼쪽 표에서 테스트 파일을 클릭하세요.
      </div>
    );
  }

  const active = codeViewer.files.find(
    (f) => f.name === codeViewer.activeFile,
  );

  return (
    <div className="bg-canvas-primary flex h-full flex-col">
      <div className="border-line-subtle flex shrink-0 items-center gap-1 overflow-x-auto border-b px-2">
        {codeViewer.files.map((file) => {
          const isActive = file.name === codeViewer.activeFile;
          return (
            <button
              key={file.name}
              type="button"
              onClick={() => setActiveCodeFile(file.name)}
              className={cn(
                "group flex shrink-0 items-center gap-1.5 rounded-t-md border-b-2 px-3 py-2 text-[12px] transition-colors",
                isActive
                  ? "border-info text-fg-primary bg-canvas-surface font-semibold"
                  : "text-fg-muted hover:text-fg-secondary hover:bg-canvas-surface-2 border-transparent",
              )}
            >
              <FileCode className="size-3.5 shrink-0" aria-hidden />
              <span className="max-w-[180px] truncate">{file.name}</span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`${file.name} 탭 닫기`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeCodeFile(file.name);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    closeCodeFile(file.name);
                  }
                }}
                className="text-fg-tertiary hover:text-fg-primary ml-1 rounded-sm p-0.5"
              >
                <X className="size-3" aria-hidden />
              </span>
            </button>
          );
        })}
      </div>

      {active && <CodeViewerHeader file={active} />}

      <div className="min-h-0 flex-1">
        {active && (
          <CodeViewerLazy
            key={active.name}
            code={active.code}
            language={active.language}
          />
        )}
      </div>
    </div>
  );
}

function CodeViewerHeader({
  file,
}: {
  file: { name: string; code: string; language: string };
}) {
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

  const lineCount = file.code.split("\n").length;

  return (
    <div className="border-line-subtle flex h-9 shrink-0 items-center justify-between border-b px-3">
      <span className="text-fg-muted truncate text-[11px]">{file.name}</span>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-fg-tertiary text-[11px] tabular-nums">
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
              코드 복사
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
