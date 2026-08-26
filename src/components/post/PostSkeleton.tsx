import { Skeleton } from "@/components/ui/Feedback";

export function PostSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-32 w-full rounded-lg" />
      <div className="mt-3 flex gap-4">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}
