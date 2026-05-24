'use client';

import { ApplicationCard } from './ApplicationCard';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Application, ApplicationStatus } from '@/types';

interface ApplicationColumnProps {
  status:   ApplicationStatus;
  label:    string;
  applications: Application[];
  onMove:   (id: string, status: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onRemove: (id: string) => void;
  colorClass?: string;
}

export function ApplicationColumn({
  status, label, applications, onMove, onUpdateNotes, onRemove, colorClass,
}: ApplicationColumnProps) {
  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-xl bg-gray-50 dark:bg-gray-800/50">
      {/* Column header */}
      <div className={cn('flex items-center justify-between rounded-t-xl px-4 py-3', colorClass ?? 'bg-gray-100 dark:bg-gray-700')}>
        <span className="font-semibold text-gray-800 dark:text-gray-200">{label}</span>
        <Badge>{applications.length}</Badge>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {applications.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">No applications</p>
        )}
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onMove={onMove}
            onUpdateNotes={onUpdateNotes}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
