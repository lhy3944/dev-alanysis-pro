import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum LayoutMode {
  WIDE = "wide",
  SPLIT = "split",
  CLOSED = "closed",
  CUSTOM = "custom",
}

interface PanelState {
  leftSidebarOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  layoutMode: LayoutMode;
  notificationOpen: boolean;
  fullWidthMode: boolean;
  isMobile: boolean;
  isTablet: boolean;
  previousLeftSidebar: boolean;
  /**
   * 현재 라우트에 좌측 사이드바를 가진 레이아웃이 마운트되어 있는지.
   * Header 의 모바일 트리거가 이 값을 보고 노출 여부를 결정한다.
   */
  hasLeftSidebar: boolean;
  /**
   * 현재 라우트의 좌측 사이드바를 모바일에서 열었을 때 라벨/aria 로 사용할 이름.
   * 예: "대화 목록", "프로젝트 워크스페이스 메뉴", "Admin 메뉴".
   */
  leftSidebarLabel: string;

  toggleLeftSidebar: () => void;
  setLeftSidebarOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelWidth: (pct: number) => void;
  setRightPanelPreset: (
    preset: LayoutMode.WIDE | LayoutMode.SPLIT | LayoutMode.CLOSED,
  ) => void;
  toggleNotification: () => void;
  toggleFullWidth: () => void;
  setViewport: (width: number) => void;
  registerLeftSidebar: (label: string) => void;
  unregisterLeftSidebar: () => void;
}

export const usePanelStore = create<PanelState>()(
  persist(
    (set, get) => ({
      leftSidebarOpen: false,
      rightPanelOpen: false,
      rightPanelWidth: 0,
      layoutMode: LayoutMode.CLOSED,
      notificationOpen: false,
      fullWidthMode: false,
      isMobile: false,
      isTablet: false,
      previousLeftSidebar: false,
      hasLeftSidebar: false,
      leftSidebarLabel: "메뉴",

      toggleLeftSidebar: () => {
        set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen }));
      },

      setLeftSidebarOpen: (open) => {
        set({ leftSidebarOpen: open });
      },

      toggleRightPanel: () => {
        set((s) => ({ rightPanelOpen: !s.rightPanelOpen }));
      },

      setRightPanelWidth: (pct) => {
        const clamped = Math.max(20, Math.min(70, pct));
        set({ rightPanelWidth: clamped });
      },

      setRightPanelPreset: (preset) => {
        switch (preset) {
          case LayoutMode.WIDE:
            set({
              rightPanelOpen: true,
              rightPanelWidth: 70,
              layoutMode: LayoutMode.WIDE,
            });
            break;
          case LayoutMode.SPLIT:
            set({
              rightPanelOpen: true,
              rightPanelWidth: 50,
              layoutMode: LayoutMode.SPLIT,
            });
            break;
          case LayoutMode.CLOSED:
            set({ rightPanelOpen: false, layoutMode: LayoutMode.CLOSED });
            break;
        }
      },

      toggleNotification: () => {
        set((s) => ({ notificationOpen: !s.notificationOpen }));
      },

      toggleFullWidth: () => {
        set((s) => ({ fullWidthMode: !s.fullWidthMode }));
      },

      setViewport: (width) => {
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;
        const state = get();

        // Only adjust sidebar state when the viewport category actually changes
        const wasMobile = state.isMobile;
        const wasTablet = state.isTablet;
        const wasDesktop = !wasMobile && !wasTablet;
        const isDesktop = !isMobile && !isTablet;

        if (isMobile && !wasMobile) {
          set({
            isMobile: true,
            isTablet: false,
            previousLeftSidebar:
              state.leftSidebarOpen || state.previousLeftSidebar,
            leftSidebarOpen: false,
            rightPanelOpen: false,
            notificationOpen: false,
          });
        } else if (isTablet && !wasTablet) {
          set({
            isMobile: false,
            isTablet: true,
            previousLeftSidebar:
              state.leftSidebarOpen || state.previousLeftSidebar,
            leftSidebarOpen: false,
          });
        } else if (isDesktop && !wasDesktop) {
          set({
            isMobile: false,
            isTablet: false,
            leftSidebarOpen: state.previousLeftSidebar,
            previousLeftSidebar: false,
          });
        }
      },

      registerLeftSidebar: (label) => {
        set({ hasLeftSidebar: true, leftSidebarLabel: label });
      },

      unregisterLeftSidebar: () => {
        // 사이드바 언마운트 시 열림 상태도 초기화 — 다른 라우트로 이동했을 때
        // drawer 가 열린 채 남아있지 않게 한다.
        set({ hasLeftSidebar: false, leftSidebarOpen: false });
      },
    }),
    {
      name: "panel",
      // leftSidebarOpen 은 viewport-dependent 라 hydration 깜빡임을 피하기 위해 persist 안 함.
      // 대신 previousLeftSidebar 로 desktop 복귀 시 사용자의 마지막 선호 상태 복원.
      partialize: (state) => ({
        previousLeftSidebar: state.previousLeftSidebar || state.leftSidebarOpen,
        rightPanelOpen: state.rightPanelOpen,
        rightPanelWidth: state.rightPanelWidth,
        layoutMode: state.layoutMode,
        fullWidthMode: state.fullWidthMode,
      }),
    },
  ),
);
