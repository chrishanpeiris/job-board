'use client';

// ─── ApplicationBoard ─────────────────────────────────────────────────────────
// Demonstrates: useReducer for complex state, optimistic UI, compound component
// pattern, and horizontal scrolling Kanban layout.

import { useEffect } from 'react';
import { ApplicationColumn } from './ApplicationColumn';
import { useApplicationTracker } from '@/hooks/useApplicationTracker';
import type { Application, ApplicationStatus } from '@/types';

interface ApplicationBoardProps {
  initialApplications: Application[];
}

const COLUMNS: Array<{ status: ApplicationStatus; label: string; colorClass: string }> = [
  { status: 'SAVED',        label: 'Saved',        colorClass: 'bg-gray-100  dark:bg-gray-700' },
  { status: 'APPLIED',      label: 'Applied',      colorClass: 'bg-blue-100  dark:bg-blue-900/40' },
  { status: 'INTERVIEWING', label: 'Interviewing', colorClass: 'bg-yellow-100 dark:bg-yellow-900/40' },
  { status: 'OFFER',        label: 'Offer',        colorClass: 'bg-green-100 dark:bg-green-900/40' },
  { status: 'REJECTED',     label: 'Rejected',     colorClass: 'bg-red-100   dark:bg-red-900/40' },
];

export function ApplicationBoard({ initialApplications }: ApplicationBoardProps) {
  const {
    byStatus,
    moveApplication,
    updateNotes,
    removeApplication,
    setApplications,
  } = useApplicationTracker([]);

  // Hydrate from server data on mount
  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications, setApplications]);

  return (
    <section aria-label="Application board">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(({ status, label, colorClass }) => (
          <ApplicationColumn
            key={status}
            status={status}
            label={label}
            colorClass={colorClass}
            applications={byStatus[status] ?? []}
            onMove={moveApplication}
            onUpdateNotes={updateNotes}
            onRemove={removeApplication}
          />
        ))}
      </div>
    </section>
  );
}
