"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_ORDER,
} from "@/constants/review";
import type { ReviewStatus } from "@/types/review";

export type FindingFilterValue = ReviewStatus | "all";

interface FindingFilterChipsProps {
  value: FindingFilterValue;
  onChange: (next: FindingFilterValue) => void;
  counts: Record<ReviewStatus, number>;
  total: number;
}

/**
 * Finding 리스트 상단 필터 — shadcn Tabs(variant="line") 위에 구성.
 * 콘텐츠 패널은 자체 렌더하지 않고 부모(FindingsCard)가 value 를 받아
 * 리스트를 필터링한다. w-full 로 카드 폭에 꽉 차게 배치.
 */
export function FindingFilterChips({
  value,
  onChange,
  counts,
  total,
}: FindingFilterChipsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as FindingFilterValue)}
      className="gap-0"
    >
      <TabsList variant="line" className="w-full">
        <TabTrigger value="all" label="전체" count={total} />
        {REVIEW_STATUS_ORDER.map((s) => (
          <TabTrigger
            key={s}
            value={s}
            label={REVIEW_STATUS_LABELS[s]}
            count={counts[s]}
          />
        ))}
      </TabsList>
    </Tabs>
  );
}

interface TabTriggerProps {
  value: string;
  label: string;
  count: number;
}

function TabTrigger({ value, label, count }: TabTriggerProps) {
  return (
    <TabsTrigger value={value} className="text-[12px]">
      <span>{label}</span>
      <span className="text-fg-tertiary tabular-nums">{count}</span>
    </TabsTrigger>
  );
}
