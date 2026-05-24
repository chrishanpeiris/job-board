// ─── useJobs ──────────────────────────────────────────────────────────────────
// Demonstrates: TanStack Query v5, queryKey factory pattern, staleTime tuning,
// select transform, and integration with useJobFilters.

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import type { Job, JobFilters, JobSortKey, JobsResponse } from '@/types';

// ── Query key factory ─────────────────────────────────────────────────────────
// Centralising keys makes invalidation easy and avoids typo bugs.
export const jobKeys = {
  all:     ['jobs'] as const,
  lists:   () => [...jobKeys.all, 'list'] as const,
  list:    (filters: JobFilters, sort: JobSortKey) =>
             [...jobKeys.lists(), { ...filters, sort }] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail:  (id: string) => [...jobKeys.details(), id] as const,
};

// ── Fetcher ───────────────────────────────────────────────────────────────────

async function fetchJobs(filters: JobFilters, sort: JobSortKey): Promise<JobsResponse> {
  const params = new URLSearchParams();
  if (filters.search)          params.set('q',        filters.search);
  if (filters.type)            params.set('type',     filters.type);
  if (filters.remote !== null) params.set('remote',   String(filters.remote));
  if (filters.location)        params.set('location', filters.location);
  params.set('sort', sort);

  const res = await fetch(`/api/jobs?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json() as Promise<JobsResponse>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseJobsOptions {
  filters: JobFilters;
  sort:    JobSortKey;
}

export function useJobs({ filters, sort }: UseJobsOptions) {
  // Debounce the search term so we don't fire a new request on every keystroke
  const debouncedSearch = useDebounce(filters.search, 300);
  const debouncedFilters = { ...filters, search: debouncedSearch };

  return useQuery({
    queryKey:  jobKeys.list(debouncedFilters, sort),
    queryFn:   () => fetchJobs(debouncedFilters, sort),
    staleTime: 60_000,           // 1 min — job listings don't change every second
    placeholderData: keepPreviousData, // keep old results visible while new ones load
  });
}

// ── Single job ────────────────────────────────────────────────────────────────

async function fetchJob(id: string): Promise<Job> {
  const res = await fetch(`/api/jobs/${id}`);
  if (!res.ok) throw new Error('Job not found');
  return res.json() as Promise<Job>;
}

export function useJob(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn:  () => fetchJob(id),
    staleTime: 5 * 60_000, // 5 min
  });
}
