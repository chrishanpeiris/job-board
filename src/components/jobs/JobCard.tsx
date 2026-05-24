'use client';

// ─── JobCard ──────────────────────────────────────────────────────────────────
// Demonstrates: React.memo, callback props to avoid re-renders, Image
// optimisation, and compound component pattern.

import { memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatSalaryRange, timeAgo } from '@/lib/utils';
import { JobTypeBadge, Badge } from '@/components/ui/Badge';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { Job } from '@/types';

interface JobCardProps {
  job:       Job;
  compact?:  boolean;
  className?: string;
}

// React.memo — prevents re-renders when parent re-renders but this job hasn't changed.
// Works best when the job prop is stable (same object reference).
export const JobCard = memo(function JobCard({ job, compact, className }: JobCardProps) {
  const { isBookmarked, toggle } = useBookmarks(job.id);

  const handleBookmark = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // don't navigate when clicking the bookmark icon
      e.stopPropagation();
      toggle();
    },
    [toggle],
  );

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        'group block rounded-xl border border-gray-200 bg-white p-5',
        'transition-shadow hover:shadow-md',
        'dark:border-gray-700 dark:bg-gray-800',
        job.featured && 'ring-2 ring-blue-500/40',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
          {job.company.logo ? (
            <Image
              src={job.company.logo}
              alt={`${job.company.name} logo`}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-bold text-gray-400">
              {job.company.name[0]}
            </span>
          )}
        </div>

        {/* Title + company */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{job.company.name}</p>
        </div>

        {/* Bookmark button */}
        <button
          onClick={handleBookmark}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
          aria-pressed={isBookmarked}
          className={cn(
            'flex-shrink-0 rounded-lg p-1.5 transition-colors',
            isBookmarked
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
          )}
        >
          {isBookmarked ? '🔖' : '🔖'}
          <span className="sr-only">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
        </button>
      </div>

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>📍 {job.location}</span>
        {job.remote && <Badge variant="green">Remote</Badge>}
        <JobTypeBadge type={job.type} />
        {job.featured && <Badge variant="blue">Featured</Badge>}
      </div>

      {/* Salary + date */}
      {!compact && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {formatSalaryRange(job.salaryMin, job.salaryMax)}
          </span>
          <span className="text-gray-400 dark:text-gray-500">{timeAgo(job.createdAt)}</span>
        </div>
      )}

      {/* Tech stack pills */}
      {!compact && job.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.techStack.slice(0, 5).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
          {job.techStack.length > 5 && (
            <Badge>+{job.techStack.length - 5}</Badge>
          )}
        </div>
      )}
    </Link>
  );
});
