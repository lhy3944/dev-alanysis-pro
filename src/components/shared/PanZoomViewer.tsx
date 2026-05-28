"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
  /** 확대 모달의 타이틀 (a11y). 기본 "확대 보기" */
  expandedTitle?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * 이미지/SVG 를 자식으로 받아 휠·드래그·툴바로 zoom/pan 하는 공유 뷰어.
 * `react-zoom-pan-pinch` 를 캡슐화. wheel 은 작은 step 으로 부드럽게 동작.
 * 우하단 툴바의 ⛶ 버튼은 같은 콘텐츠를 큰 모달로 열어준다.
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
        className={className}
        ariaLabel={ariaLabel}
      >
        {children}
      </PanZoomCore>
      {expandable && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="!max-w-[min(1280px,calc(100vw-48px))] gap-0 overflow-hidden p-0">
            <DialogTitle className="sr-only">{expandedTitle}</DialogTitle>
            <PanZoomCore
              minScale={minScale}
              maxScale={maxScale}
              showToolbar
              ariaLabel={expandedTitle}
              className="h-[min(80vh,720px)] rounded-lg border-0"
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
  className?: string;
  ariaLabel?: string;
}

function PanZoomCore({
  children,
  minScale,
  maxScale,
  showToolbar,
  onExpand,
  className,
  ariaLabel,
}: PanZoomCoreProps) {
  return (
    <div
      className={cn(
        "bg-canvas-primary border-line-subtle relative h-full w-full overflow-hidden rounded-md border",
        className,
      )}
      aria-label={ariaLabel}
    >
      <TransformWrapper
        minScale={minScale}
        maxScale={maxScale}
        initialScale={1}
        centerOnInit
        wheel={{ step: 0.01, wheelDisabled: true }}
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
