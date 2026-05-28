"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";

interface PanZoomViewerProps {
  children: ReactNode;
  minScale?: number;
  maxScale?: number;
  showToolbar?: boolean;
  /** Maximize 버튼 클릭 시 모달로 큰 사이즈 열기. 기본 true */
  expandable?: boolean;
  /**
   * 확대 모달의 타이틀. 모달 헤더에 표시되며 a11y 에도 사용된다.
   * 기본 "확대 보기"
   */
  expandedTitle?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * 이미지/SVG 를 자식으로 받아 휠·드래그·툴바로 zoom/pan 하는 공유 뷰어.
 * `react-zoom-pan-pinch` 를 캡슐화.
 *
 * - 인라인(카드 안) 사용 시: 페이지 스크롤이 막히지 않도록 휠 줌은 비활성.
 *   border 도 두르지 않아 카드 chrome 과 중첩되지 않는다.
 * - 확대 모달 안: 페이지 스크롤이 없으므로 휠 줌 활성. 모달 헤더에 타이틀 표시.
 */
export function PanZoomViewer({
  children,
  minScale = 0.5,
  maxScale = 4,
  showToolbar = true,
  expandable = true,
  expandedTitle = "확대 보기",
  className,
  ariaLabel,
}: PanZoomViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PanZoomCore
        minScale={minScale}
        maxScale={maxScale}
        showToolbar={showToolbar}
        onExpand={expandable ? () => setOpen(true) : undefined}
        wheelDisabled
        className={className}
        ariaLabel={ariaLabel}
      >
        {children}
      </PanZoomCore>
      {expandable && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="!max-w-[min(1280px,calc(100vw-48px))] gap-0 overflow-hidden p-0">
            <DialogHeader className="border-line-subtle border-b px-5 py-3">
              <DialogTitle className="text-fg-primary text-[15px] font-semibold">
                {expandedTitle}
              </DialogTitle>
            </DialogHeader>
            <PanZoomCore
              minScale={minScale}
              maxScale={maxScale}
              showToolbar
              ariaLabel={expandedTitle}
              className="h-[min(80vh,720px)]"
            >
              {children}
            </PanZoomCore>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

interface PanZoomCoreProps {
  children: ReactNode;
  minScale: number;
  maxScale: number;
  showToolbar: boolean;
  onExpand?: () => void;
  /** true 면 휠 줌을 막아 페이지 스크롤을 보존한다. 모달 안에서는 false. */
  wheelDisabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

function PanZoomCore({
  children,
  minScale,
  maxScale,
  showToolbar,
  onExpand,
  wheelDisabled = false,
  className,
  ariaLabel,
}: PanZoomCoreProps) {
  return (
    <div
      className={cn(
        "bg-canvas-primary relative h-full w-full overflow-hidden rounded-md",
        className,
      )}
      aria-label={ariaLabel}
    >
      <TransformWrapper
        minScale={minScale}
        maxScale={maxScale}
        initialScale={1}
        centerOnInit
        wheel={{ step: 0.005, wheelDisabled }}
        doubleClick={{ mode: "reset" }}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="!w-full !h-full flex items-center justify-center"
        >
          {children}
        </TransformComponent>
        {showToolbar && <PanZoomToolbar onExpand={onExpand} />}
      </TransformWrapper>
    </div>
  );
}

function PanZoomToolbar({ onExpand }: { onExpand?: () => void }) {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="bg-canvas-surface/95 border-line-subtle absolute right-3 bottom-3 flex items-center gap-0.5 rounded-md border p-1 shadow-sm backdrop-blur">
      <ToolButton label="확대" icon={Plus} onClick={() => zoomIn()} />
      <ToolButton label="축소" icon={Minus} onClick={() => zoomOut()} />
      <ToolButton
        label="원본 크기로 리셋"
        icon={RotateCcw}
        onClick={() => resetTransform()}
      />
      {onExpand && (
        <ToolButton label="크게 보기" icon={Maximize2} onClick={onExpand} />
      )}
    </div>
  );
}

interface ToolButtonProps {
  label: string;
  icon: typeof Plus;
  onClick: () => void;
}

function ToolButton({ label, icon: Icon, onClick }: ToolButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      className="text-icon-default hover:text-icon-active size-7"
      onClick={onClick}
    >
      <Icon className="size-3.5" />
    </Button>
  );
}
