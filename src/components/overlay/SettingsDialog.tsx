"use client";

import { SettingsGeneral } from "@/components/overlay/SettingsGeneral";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarClock,
  Database,
  Link,
  Palette,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface SettingsMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
}

const SETTINGS_MENU: SettingsMenuItem[] = [
  {
    id: "account",
    label: "계정",
    icon: User,
    content: <p className="text-sm text-fg-muted">계정 설정</p>,
  },
  {
    id: "general",
    label: "설정",
    icon: Settings,
    content: <SettingsGeneral />,
  },
  {
    id: "usage",
    label: "사용량",
    icon: BarChart3,
    content: <p className="text-sm text-fg-muted">사용량</p>,
  },
  {
    id: "schedule",
    label: "예약 작업",
    icon: CalendarClock,
    content: <p className="text-sm text-fg-muted">예약 작업</p>,
  },
  {
    id: "data",
    label: "데이터 제어",
    icon: Database,
    content: <p className="text-sm text-fg-muted">데이터 제어</p>,
  },
  {
    id: "personalize",
    label: "개인화",
    icon: Palette,
    content: <p className="text-sm text-fg-muted">개인화</p>,
  },
  {
    id: "skills",
    label: "스킬",
    icon: Sparkles,
    content: <p className="text-sm text-fg-muted">스킬</p>,
  },
  {
    id: "integration",
    label: "통합",
    icon: Link,
    content: <p className="text-sm text-fg-muted">통합</p>,
  },
];

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: string;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeId, setActiveId] = useState("general");
  const activeItem = SETTINGS_MENU.find((item) => item.id === activeId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex flex-col gap-0 p-0 overflow-hidden",
          "max-md:max-w-[calc(100%-8px)] max-md:h-[70dvh]",
          "md:max-w-[720px] md:h-[560px] md:flex-row",
        )}
      >
        {/* ── 데스크탑: 좌측 사이드바 ── */}
        <nav className="hidden md:flex w-[200px] shrink-0 flex-col border-r border-line-primary bg-canvas-secondary/50 py-4">
          <DialogTitle className="px-5 pb-4 text-lg font-semibold text-fg-primary">
            앱 설정
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 text-icon-default hover:text-icon-active"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-0.5 px-2">
              {SETTINGS_MENU.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant="ghost"
                  onClick={() => setActiveId(id)}
                  className={cn(
                    "justify-start gap-2.5 h-9 px-3 text-sm font-normal",
                    activeId === id
                      ? "bg-canvas-surface text-fg-primary"
                      : "text-fg-secondary hover:text-fg-primary",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </nav>

        {/* ── 모바일: 상단 헤더 + 탭 네비게이션 ── */}
        <div className="flex flex-col md:hidden border-b border-line-primary">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <DialogTitle className="text-lg font-semibold text-fg-primary">
              앱 설정
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 text-icon-default hover:text-icon-active"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
          </div>
          <div className="relative">
            <ScrollArea className="w-full">
              <div className="flex items-center gap-1 px-4 pb-[10px] pr-8">
                <Tabs defaultValue="overview">
                  <TabsList variant={"line"}>
                    {SETTINGS_MENU.map(({ id, label }) => (
                      <TabsTrigger
                        key={id}
                        value={id}
                        onClick={() => setActiveId(id)}
                      >
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="pointer-events-none absolute top-0 bottom-2.5 left-0 w-4 bg-linear-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute top-0 bottom-2.5 right-0 w-8 bg-linear-to-l from-background to-transparent" />
          </div>
        </div>

        {/* ── 컨텐츠 영역 ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 데스크탑에서만 컨텐츠 상단에 제목 표시 */}
          <div className="hidden md:block px-6 pt-6 pb-4 border-b border-line-primary">
            <h2 className="text-lg font-semibold text-fg-primary">
              {activeItem?.label}
            </h2>
          </div>
          <ScrollArea className="self-stretch items-start flex flex-col gap-[32px] flex-1 overflow-y-auto px-4 py-4">
            {activeItem?.content}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
