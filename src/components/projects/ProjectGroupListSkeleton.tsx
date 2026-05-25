import { Skeleton } from "@/components/ui/skeleton";

export function ProjectGroupListSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border-line-primary bg-canvas-surface rounded-lg border p-6"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Skeleton className="size-10 rounded-lg shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-24 rounded-full shrink-0" />
                </div>
              </div>
            </div>
            <Skeleton className="size-8 rounded-full shrink-0" />
          </div>

          <div className="mb-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="border-line-primary flex items-center gap-5 border-t border-dotted pt-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
