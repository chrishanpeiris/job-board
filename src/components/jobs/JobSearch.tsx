'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface JobSearchProps {
  value:    string;
  onChange: (value: string) => void;
  className?: string;
}

export function JobSearch({ value, onChange, className }: JobSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn('relative', className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        aria-label="Search jobs"
        placeholder="Search by title, company, or skill…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm',
          'placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500',
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
