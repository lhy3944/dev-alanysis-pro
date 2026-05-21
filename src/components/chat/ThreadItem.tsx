"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Thread } from "@/stores/chat-store";
import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
}

export function ThreadItem({ thread, isActive, onClick }: ThreadItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={cn(
        "group relative flex w-full items-center rounded-sm transition-colors pr-2",
        isActive
          ? "bg-canvas-surface text-fg-primary"
          : "text-fg-secondary hover:bg-canvas-surface/50",
      )}
    >
      <button
        onClick={onClick}
        className="flex flex-1 items-center gap-2 px-2.5 py-2 text-left min-w-0"
      >
        <MessageSquare className="h-3.5 w-3.5 shrink-0" fill="currentColor" />
        <span className="truncate text-[13px]">{thread.title}</span>
      </button>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "shrink-0 p-1 rounded text-fg-secondary hover:text-fg-primary transition-opacity cursor-pointer",
              menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right" className="w-40">
          <DropdownMenuItem className="text-xs gap-2">
            <Pencil className="h-3.5 w-3.5" />
            이름 변경
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs gap-2">
            <Share2 className="h-3.5 w-3.5" />
            공유
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs gap-2 text-destructive focus:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
