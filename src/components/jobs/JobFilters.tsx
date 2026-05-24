'use client';

// ─── JobFilters ───────────────────────────────────────────────────────────────
// Demonstrates: controlled inputs, compound onChange handlers, useCallback.

import { useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import type { JobFilters as JobFiltersType, JobType, JobSortKey } from '@/types';

interface JobFiltersProps {
  filters:     JobFiltersType & { sort: JobSortKey };
  onSearch:    (v: string)             => void;
  onType:      (v: JobType | '')       => void;
  onRemote:    (v: boolean | null)     => void;
  onLocation:  (v: string)             => void;
  onSort:      (v: JobSortKey)         => void;
  onReset:     ()                      => void;
}

const JOB_TYPES: Array<{ value: JobType | ''; label: string }> = [
  { value: '',           label: 'All types' },
  { value: 'FULL_TIME',  label: 'Full Time' },
  { value: 'PART_TIME',  label: 'Part Time' },
  { value: 'CONTRACT',   label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const REMOTE_OPTIONS = [
  { value: 'all',   label: 'All locations' },
  { value: 'true',  label: 'Remote only' },
  { value: 'false', label: 'On-site only' },
];

export function JobFilters({
  filters, onSearch: _onSearch, onType, onRemote, onLocation, onSort, onReset,
}: JobFiltersProps) {
  const isFiltered =
    filters.search || filters.type || filters.remote !== null || filters.location;

  const handleRemoteChange = useCallback(
    (value: string) => {
      onRemote(value === 'all' ? null : value === 'true');
    },
    [onRemote],
  );

  return (
    <aside className="space-y-5">
      {/* Sort */}
      <div>
        <label htmlFor="sort" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort by
        </label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => onSort(e.target.value as JobSortKey)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="newest">Newest first</option>
          <option value="salary">Highest salary</option>
          <option value="featured">Featured first</option>
        </select>
      </div>

      {/* Job type */}
      <div>
        <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Job type
        </label>
        <select
          id="type"
          value={filters.type}
          onChange={(e) => onType(e.target.value as JobType | '')}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          {JOB_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Remote filter */}
      <div>
        <label htmlFor="remote" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Work location
        </label>
        <select
          id="remote"
          value={filters.remote === null ? 'all' : String(filters.remote)}
          onChange={(e) => handleRemoteChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          {REMOTE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Location text */}
      <div>
        <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          City / region
        </label>
        <input
          id="location"
          type="text"
          placeholder="e.g. San Francisco"
          value={filters.location}
          onChange={(e) => onLocation(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {/* Reset */}
      {isFiltered && (
        <Button variant="ghost" size="sm" onClick={onReset} className="w-full">
          Clear all filters
        </Button>
      )}
    </aside>
  );
}
