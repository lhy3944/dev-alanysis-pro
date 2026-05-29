"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * CodeViewer 의 lazy 진입점.
 * monaco 코어가 우측 패널이 처음 열릴 때만 fetch 되도록 ssr:false + dynamic 로드.
 */
export const CodeViewerLazy = dynamic(
  () => import("./CodeViewer").then((m) => m.CodeViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  },
);
