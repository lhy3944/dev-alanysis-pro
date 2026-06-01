"use client";

import { Fragment } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TestLogViewerProps {
  log: string;
  className?: string;
}

type LineKind = "ok" | "err" | "step" | "plain";

interface ParsedSegment {
  text: string;
  isFile: boolean;
}

interface ParsedLine {
  kind: LineKind;
  segments: ParsedSegment[];
}

const LINE_KIND_CLASS: Record<LineKind, string> = {
  ok: "text-status-emerald-fg",
  err: "text-status-red-fg",
  step: "text-info",
  plain: "text-fg-secondary",
};

const FILE_PATTERN = /([\w./-]+\.c(?:pp)?)\b/g;

function classifyLine(raw: string): LineKind {
  if (
    /\[FAILED\]/.test(raw) ||
    raw.includes("❌") ||
    raw.includes("🔴") ||
    /(failed|build-fail):\s*[1-9]/.test(raw)
  ) {
    return "err";
  }
  if (/\[PASSED\]/.test(raw) || raw.includes("✅") || /passed:\s*[1-9]/.test(raw)) {
    return "ok";
  }
  if (/^\s*(#|▶|\[Stage)/.test(raw)) {
    return "step";
  }
  return "plain";
}

function parseLine(raw: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  let lastIndex = 0;
  FILE_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = FILE_PATTERN.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: raw.slice(lastIndex, match.index), isFile: false });
    }
    segments.push({ text: match[0], isFile: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < raw.length) {
    segments.push({ text: raw.slice(lastIndex), isFile: false });
  }
  return segments;
}

function parseLog(log: string): ParsedLine[] {
  return log.split("\n").map((raw) => ({
    kind: classifyLine(raw),
    segments: parseLine(raw),
  }));
}

export function TestLogViewer({ log, className }: TestLogViewerProps) {
  const lines = parseLog(log);

  return (
    <ScrollArea className={cn("bg-canvas-surface-2 h-[60vh] rounded-md", className)}>
      <div className="px-4 py-3">
        <pre className="font-mono text-[11px] leading-relaxed">
          {lines.map((line, i) => (
            <Fragment key={i}>
              <span className={LINE_KIND_CLASS[line.kind]}>
                {line.segments.map((seg, j) =>
                  seg.isFile ? (
                    <span key={j} className="text-status-blue-fg">
                      {seg.text}
                    </span>
                  ) : (
                    <span key={j}>{seg.text}</span>
                  ),
                )}
              </span>
              {i < lines.length - 1 && "\n"}
            </Fragment>
          ))}
        </pre>
      </div>
    </ScrollArea>
  );
}
