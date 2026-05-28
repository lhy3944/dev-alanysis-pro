import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvisoryNoteProps {
  children: React.ReactNode;
  className?: string;
}

export function AdvisoryNote({ children, className }: AdvisoryNoteProps) {
  return (
    <aside
      className={cn(
        "bg-canvas-surface border-line-subtle flex items-start gap-3 rounded-lg border px-4 py-3",
        className,
      )}
    >
      <Lightbulb className="text-fg-muted mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="text-fg-secondary text-[13px] leading-relaxed">
        {children}
      </p>
    </aside>
  );
}
