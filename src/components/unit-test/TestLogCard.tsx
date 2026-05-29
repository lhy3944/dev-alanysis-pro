"use client";

import { ScrollText } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestLogCardProps {
  log: string;
  name: string;
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

export function TestLogCard({ log, name, className }: TestLogCardProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lines = parseLog(log);

  useEffect(() => {
    if (!autoScroll) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [autoScroll, log]);

  return (
    <SectionCard
      title={`Test Log (${name})`}
      icon={ScrollText}
      headerRight={
        <label className="text-fg-muted flex cursor-pointer items-center gap-2 text-[11px]">
          <span>자동 스크롤 {autoScroll ? "ON" : "OFF"}</span>
          <Switch
            checked={autoScroll}
            onCheckedChange={setAutoScroll}
            aria-label="자동 스크롤 토글"
          />
        </label>
      }
      className={className}
      bodyClassName="p-0"
    >
      <ScrollArea className="bg-canvas-surface-2 h-[360px]">
        <div ref={scrollRef} className="h-full overflow-auto px-4 py-3">
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
    </SectionCard>
  );
}
