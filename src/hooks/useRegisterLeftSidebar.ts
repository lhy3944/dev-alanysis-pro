"use client";

import { useEffect } from "react";
import { usePanelStore } from "@/stores/panel-store";

/**
 * 현재 라우트의 레이아웃이 좌측 사이드바를 가지고 있음을 panel-store 에 등록한다.
 * Header 의 모바일 트리거가 이 등록 여부를 보고 노출된다.
 *
 * @param label 모바일 드로어 헤더/aria 에 표시할 이름 (예: "프로젝트 워크스페이스 메뉴").
 */
export function useRegisterLeftSidebar(label: string) {
  const registerLeftSidebar = usePanelStore((s) => s.registerLeftSidebar);
  const unregisterLeftSidebar = usePanelStore((s) => s.unregisterLeftSidebar);

  useEffect(() => {
    registerLeftSidebar(label);
    return () => unregisterLeftSidebar();
  }, [label, registerLeftSidebar, unregisterLeftSidebar]);
}
