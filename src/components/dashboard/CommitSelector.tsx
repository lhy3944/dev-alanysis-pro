"use client";

import { GitCommit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CommitOption } from "@/types/commit";

interface CommitSelectorProps {
  value: string | undefined;
  options: CommitOption[];
  onChange: (commitId: string) => void;
  className?: string;
}

export function CommitSelector({
  value,
  options,
  onChange,
  className,
}: CommitSelectorProps) {
  const current = options.find((c) => c.commit_id === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label="분석 결과 선택 (commit ID)"
        className={cn(
          "bg-canvas-primary min-w-[260px] max-w-[360px] gap-2",
          className,
        )}
      >
        <GitCommit className="text-icon-default size-4 shrink-0" />
        <SelectValue placeholder="커밋을 선택하세요">
          {current && (
            <span className="flex min-w-0 items-center gap-2">
              <span className="font-mono text-[12px] font-semibold">
                {current.commit_id}
              </span>
              <span className="text-fg-muted truncate text-[12px]">
                {trimMessage(current.label, current.commit_id)}
              </span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="bottom"
        align="start"
        sideOffset={4}
        className="min-w-[var(--radix-select-trigger-width)] max-w-[460px]"
      >
        {options.map((c) => (
          <SelectItem key={c.commit_id} value={c.commit_id}>
            <div className="flex min-w-0 max-w-[400px] flex-col gap-0.5">
              <span className="truncate font-mono text-[12px] font-semibold">
                {c.label}
              </span>
              <span className="text-fg-muted truncate text-[11px]">
                {c.branch} · {c.author ?? "—"} ·{" "}
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** "9f6ed7b - Merge branch..." 형태에서 commit_id 와 구분자를 제거하고 메시지만. */
function trimMessage(label: string, commitId: string): string {
  const stripped = label.replace(new RegExp(`^${commitId}\\s*[-:]\\s*`), "");
  return stripped === label ? label : stripped;
}
