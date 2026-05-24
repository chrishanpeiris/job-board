'use client';

// ─── Jobs listing page ────────────────────────────────────────────────────────
// Demonstrates: TanStack Query, custom hooks, debouncing, URL-sync filters,
// and component composition.

import { useJobs } from '@/hooks/useJobs';
import { useJobFilters } from '@/hooks/useJobFilters';
import { JobList } from '@/components/jobs/JobList';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobSearch } from '@/components/jobs/JobSearch';

export default function JobsPage() {
  const { filters, setSearch, setType, setRemote, setLocation, setSort, reset } = useJobFilters();

  const { data, isLoading, isError } = useJobs({ filters, sort: filters.sort });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Browse Jobs</h1>

      {/* Search bar */}
      <JobSearch
        value={filters.search}
        onChange={setSearch}
        className="mb-6"
      />

      <div className="flex gap-8">
        {/* Filters sidebar */}
        <div className="hidden w-56 flex-shrink-0 lg:block">
          <JobFilters
            filters={filters}
            onSearch={setSearch}
            onType={setType}
            onRemote={setRemote}
            onLocation={setLocation}
            onSort={setSort}
            onReset={reset}
          />
        </div>

        {/* Job list */}
        <div className="flex-1 min-w-0">
          {isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              Failed to load jobs. Please try again.
            </div>
          ) : (
            <JobList
              jobs={data?.jobs ?? []}
              total={data?.total}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
