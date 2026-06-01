import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum LayoutMode {
  WIDE = "wide",
  SPLIT = "split",
  CLOSED = "closed",
  CUSTOM = "custom",
}

/**
 * 우측 패널 컨텐츠 분기.
 * 새 컨텐츠가 추가될 때마다 union 에 추가하고 RightPanel 의 분기에 케이스를 더한다.
 */
export type RightPanelView = "empty" | "code-viewer";

export interface OpenedCodeFile {
  /** 파일 경로 또는 표시명. activeFile 식별 키. */
  name: string;
  /** 원본 코드 문자열. */
  code: string;
  /** monaco language id (예: "c", "typescript", "python"). */
  language: string;
}

export interface CodeViewerState {
  files: OpenedCodeFile[];
  activeFile: string;
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
  /** setViewport 가 최초 1회 실행되었는지. 페이지 새로고침 후 첫 호출에서
   *  데스크탑이면 previousLeftSidebar 로부터 leftSidebarOpen 을 복원하는 데 사용. */
  isViewportInitialized: boolean;
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

  /** 우측 패널 현재 컨텐츠 분기. */
  rightPanelView: RightPanelView;
  /** 코드 뷰어 상태 — rightPanelView === "code-viewer" 일 때만 의미. */
  codeViewer: CodeViewerState | null;

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

  /** 코드 파일을 우측 패널에 연다. 이미 열린 파일이면 active 만 전환. */
  openCodeFile: (file: OpenedCodeFile) => void;
  /** 파일 탭 닫기. 마지막 탭이면 패널 자동 닫힘. */
  closeCodeFile: (fileName: string) => void;
  /** 다른 탭으로 active 전환. */
  setActiveCodeFile: (fileName: string) => void;
  /** 우측 패널을 빈 상태로 리셋 + 패널 닫음. 페이지 unmount 시 호출. */
  resetRightPanel: () => void;
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
      isViewportInitialized: false,
      previousLeftSidebar: false,
      hasLeftSidebar: false,
      leftSidebarLabel: "메뉴",

      rightPanelView: "empty",
      codeViewer: null,

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
        const isDesktop = !isMobile && !isTablet;
        const state = get();

        // 첫 호출(새로고침 직후): 영속화된 previousLeftSidebar 를 기준으로 복원
        if (!state.isViewportInitialized) {
          if (isDesktop) {
            set({
              isMobile: false,
              isTablet: false,
              isViewportInitialized: true,
              leftSidebarOpen: state.previousLeftSidebar,
              previousLeftSidebar: false,
            });
          } else if (isMobile) {
            set({
              isMobile: true,
              isTablet: false,
              isViewportInitialized: true,
              leftSidebarOpen: false,
              rightPanelOpen: false,
              notificationOpen: false,
            });
          } else {
            set({
              isMobile: false,
              isTablet: true,
              isViewportInitialized: true,
              leftSidebarOpen: false,
            });
          }
          return;
        }

        // 이후 호출: viewport 카테고리 전환 시에만 사이드바 상태 조정
        const wasMobile = state.isMobile;
        const wasTablet = state.isTablet;
        const wasDesktop = !wasMobile && !wasTablet;

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
        // 모바일/태블릿: drawer 가 라우트 이동 후 열린 채 남지 않도록 닫는다.
        // 데스크탑: 사용자의 펼침/접힘 선호를 라우트 간 보존한다.
        set((state) => ({
          hasLeftSidebar: false,
          leftSidebarOpen:
            state.isMobile || state.isTablet ? false : state.leftSidebarOpen,
        }));
      },

      openCodeFile: (file) => {
        const state = get();
        // 탭 UI 미사용 — 단일 파일만 표시. 새 파일 클릭 시 기존 파일 교체.
        set({
          rightPanelView: "code-viewer",
          codeViewer: { files: [file], activeFile: file.name },
          rightPanelOpen: true,
          rightPanelWidth: state.rightPanelWidth || 50,
          layoutMode:
            state.layoutMode === LayoutMode.CLOSED
              ? LayoutMode.SPLIT
              : state.layoutMode,
        });
      },

      closeCodeFile: (fileName) => {
        const current = get().codeViewer;
        if (!current) return;
        const remaining = current.files.filter((f) => f.name !== fileName);
        if (remaining.length === 0) {
          set({
            rightPanelView: "empty",
            codeViewer: null,
            rightPanelOpen: false,
            layoutMode: LayoutMode.CLOSED,
          });
          return;
        }
        const stillActive = remaining.some(
          (f) => f.name === current.activeFile,
        );
        set({
          codeViewer: {
            files: remaining,
            activeFile: stillActive
              ? current.activeFile
              : remaining[remaining.length - 1].name,
          },
        });
      },

      setActiveCodeFile: (fileName) => {
        const current = get().codeViewer;
        if (!current) return;
        if (!current.files.some((f) => f.name === fileName)) return;
        set({ codeViewer: { ...current, activeFile: fileName } });
      },

      resetRightPanel: () => {
        set({
          rightPanelView: "empty",
          codeViewer: null,
          rightPanelOpen: false,
          layoutMode: LayoutMode.CLOSED,
        });
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
