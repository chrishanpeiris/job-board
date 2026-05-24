// ─── Jobs loading UI (Suspense boundary) ─────────────────────────────────────
// Next.js automatically wraps this segment in a Suspense boundary.
// Demonstrates: streaming UI with loading.tsx.

import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function JobsLoading() {
  return (
    <div>
      <Skeleton className="mb-6 h-8 w-40" />
      <Skeleton className="mb-6 h-12 w-full rounded-xl" />
      <div className="flex gap-8">
        <div className="hidden w-56 space-y-5 lg:block">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
