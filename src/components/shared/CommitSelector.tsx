"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CommitOption } from "@/types/commit";
import { GitCommit } from "lucide-react";

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
          // SelectTrigger 베이스라인이 `w-fit + justify-between` 이라 콘텐츠가
          // 짧으면 가운데로 몰린다. SelectValue 를 flex-1 로 확장해서 좌측
          // 정렬 + chevron 우측 고정.
          // 너비는 부모 컨테이너를 채우되 min/max 로 가독성 범위 안에 둔다.
          // 좁은 화면에서는 줄어들고, 넓은 화면에서는 370px 에 멈춘다.
          "bg-canvas-primary gap-1.5 w-full! min-w-[200px] max-w-[370px]",
          "*:data-[slot=select-value]:flex-1",
          className,
        )}
      >
        <GitCommit className="text-icon-default size-4 shrink-0" />
        <SelectValue placeholder="커밋을 선택하세요">
          {current && (
            <span className="flex min-w-0 items-center gap-2">
              <span className="text-[12px] font-semibold">
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
        className="min-w-[var(--radix-select-trigger-width)] max-w-[800px]"
      >
        {options.map((c) => (
          <SelectItem key={c.commit_id} value={c.commit_id}>
            <div className="flex min-w-0 max-w-[760px] flex-col gap-0.5">
              <span className="truncate text-[12px] font-semibold">
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
