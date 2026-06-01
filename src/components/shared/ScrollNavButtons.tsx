"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScrollNavButtonsProps {
  /**
   * 스크롤 대상 컨테이너 ref. 이 앱은 페이지 내부 컨테이너가 스크롤되므로
   * 보통 `overflow-y-auto` 컨테이너의 ref 를 넘긴다. 미지정 시 문서(window) 스크롤.
   */
  targetRef?: RefObject<HTMLElement | null>;
  /** 상/하단 "부근" 판정 임계값(px). 이 값 이내면 해당 끝에 닿은 것으로 본다. 기본 200. */
  edgeThreshold?: number;
  /** 위치/레이아웃 오버라이드. 기본은 컨테이너 우측 하단 absolute 배치. */
  className?: string;
}

/**
 * 스크롤을 따라다니는 페이지 up/down 플로팅 버튼.
 * - 상단 부근: down 만 노출
 * - 하단 부근: up 만 노출
 * - 중간: up/down 모두 노출
 * - 스크롤이 없으면(콘텐츠가 짧으면) 아무것도 노출하지 않음
 *
 * `absolute` 로 배치되므로 **부모에 `relative` 가 있어야 한다.**
 * 보통 스크롤 컨테이너를 `relative` 래퍼로 감싸고 그 안에 둔다.
 */
export function ScrollNavButtons({
  targetRef,
  edgeThreshold = 200,
  className,
}: ScrollNavButtonsProps) {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);

  const getEl = useCallback((): HTMLElement | null => {
    if (targetRef) return targetRef.current;
    return (document.scrollingElement as HTMLElement | null) ?? null;
  }, [targetRef]);

  useEffect(() => {
    const el = getEl();
    if (!el) return;

    let raf = 0;
    const compute = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { scrollTop, clientHeight, scrollHeight } = el;
        const scrollable = scrollHeight - clientHeight > 8;
        if (!scrollable) {
          setShowUp(false);
          setShowDown(false);
          return;
        }
        const nearTop = scrollTop <= edgeThreshold;
        const nearBottom =
          scrollTop + clientHeight >= scrollHeight - edgeThreshold;
        setShowUp(!nearTop);
        setShowDown(!nearBottom);
      });
    };

    compute();

    // 스크롤 위치: 컨테이너 스크롤이면 컨테이너에, 아니면 window 에 바인딩
    const scrollHost: HTMLElement | Window = targetRef ? el : window;
    scrollHost.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);

    // 컨테이너 크기 변화(패널 토글/뷰포트)
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    // 콘텐츠 변화(데이터 로딩으로 높이 변동)
    const mo = new MutationObserver(compute);
    mo.observe(targetRef ? el : document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(raf);
      scrollHost.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      ro.disconnect();
      mo.disconnect();
    };
  }, [getEl, targetRef, edgeThreshold]);

  const scrollToEdge = (edge: "top" | "bottom") => {
    const el = getEl();
    if (!el) return;
    el.scrollTo({
      top: edge === "top" ? 0 : el.scrollHeight,
      behavior: "smooth",
    });
  };

  const buttonClass =
    "pointer-events-auto size-9 rounded-full border-line-primary bg-canvas-surface text-fg-secondary shadow-lg hover:bg-canvas-surface-2 hover:text-fg-primary";

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-4 bottom-4 z-30 flex flex-col gap-2 sm:right-6 sm:bottom-6",
        className,
      )}
    >
      <AnimatePresence>
        {showUp && (
          <motion.div
            key="up"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="맨 위로 스크롤"
              onClick={() => scrollToEdge("top")}
              className={buttonClass}
            >
              <ChevronUp className="size-4" />
            </Button>
          </motion.div>
        )}
        {showDown && (
          <motion.div
            key="down"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="맨 아래로 스크롤"
              onClick={() => scrollToEdge("bottom")}
              className={buttonClass}
            >
              <ChevronDown className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
