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
        "bg-info-soft border-info/30 flex items-start gap-3 rounded-lg border px-4 py-3",
        className,
      )}
    >
      <Lightbulb className="text-info mt-0.5 size-4 shrink-0" />
      <p className="text-fg-secondary text-[13px] leading-relaxed">
        {children}
      </p>
    </aside>
  );
}
