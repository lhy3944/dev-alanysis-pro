import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center text-center duration-300",
        className,
      )}
    >
      <div className="bg-canvas-surface mb-4 flex size-16 items-center justify-center rounded-full">
        <Icon className="text-fg-muted size-6" />
      </div>
      <h2 className="text-fg-primary text-base font-medium">{title}</h2>
      <p className="text-fg-secondary text-sm">{description}</p>
    </div>
  );
}
