'use client';

// ─── JobList ──────────────────────────────────────────────────────────────────
// Demonstrates: conditional rendering, Suspense boundary integration, and
// infinite-scroll with IntersectionObserver.

import { JobCard } from './JobCard';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { useIntersection } from '@/hooks/useIntersection';
import type { Job } from '@/types';

interface JobListProps {
  jobs:       Job[];
  isLoading?: boolean;
  total?:     number;
  onLoadMore?: () => void;
  hasMore?:   boolean;
}

export function JobList({ jobs, isLoading, total, onLoadMore, hasMore }: JobListProps) {
  // Sentinel element at the bottom of the list — when it scrolls into view we
  // trigger the next page load.
  const [sentinelRef, isSentinelVisible] = useIntersection<HTMLDivElement>({
    threshold: 0.1,
  });

  if (isSentinelVisible && hasMore && !isLoading) {
    onLoadMore?.();
  }

  if (isLoading && jobs.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 py-16 dark:border-gray-600">
        <p className="text-2xl">🔍</p>
        <p className="font-medium text-gray-700 dark:text-gray-300">No jobs found</p>
        <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div>
      {total !== undefined && (
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {total} {total === 1 ? 'job' : 'jobs'} found
        </p>
      )}

      <ul className="space-y-4" aria-label="Job listings">
        {jobs.map((job) => (
          <li key={job.id}>
            <JobCard job={job} />
          </li>
        ))}
      </ul>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" aria-hidden="true" />

      {isLoading && jobs.length > 0 && (
        <div className="mt-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <JobCardSkeleton key={`more-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}
