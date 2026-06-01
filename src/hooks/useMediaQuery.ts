"use client";

import { useLayoutEffect } from "react";
import { usePanelStore } from "@/stores/panel-store";

export function useResponsivePanel() {
  const setViewport = usePanelStore((s) => s.setViewport);

  // useLayoutEffect: 첫 페인트 전에 viewport 기반 초기 사이드바 상태(열림/닫힘)를
  // 복원한다. useEffect 면 닫힌 상태로 1프레임 페인트 후 열려서 본문이 슬라이딩한다.
  // (레이아웃은 StoreProvider 하이드레이션 게이트 뒤에서만 마운트되므로 SSR 경고 없음)
  useLayoutEffect(() => {
    const handleResize = () => setViewport(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setViewport]);
}
