'use client';

import { useState, useCallback } from 'react';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatSalaryRange, timeAgo } from '@/lib/utils';
import type { Application, ApplicationStatus } from '@/types';

interface ApplicationCardProps {
  application: Application;
  onMove:      (id: string, status: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onRemove:    (id: string) => void;
}

const STATUSES: ApplicationStatus[] = ['SAVED', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'];

export function ApplicationCard({
  application, onMove, onUpdateNotes, onRemove,
}: ApplicationCardProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes,     setNotes]     = useState(application.notes ?? '');

  const handleSaveNotes = useCallback(() => {
    onUpdateNotes(application.id, notes);
    setNotesOpen(false);
  }, [application.id, notes, onUpdateNotes]);

  const { job } = application;

  return (
    <>
      <article
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700"
        aria-label={`${job.title} at ${job.company.name}`}
      >
        {/* Job info */}
        <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{job.company.name}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {formatSalaryRange(job.salaryMin, job.salaryMax)}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Added {timeAgo(application.createdAt)}
        </p>

        {/* Status badge */}
        <div className="mt-2">
          <StatusBadge status={application.status} />
        </div>

        {/* Notes preview */}
        {application.notes && (
          <p className="mt-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {application.notes}
          </p>
        )}

        {/* Actions */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => setNotesOpen(true)}>
            {application.notes ? 'Edit notes' : 'Add notes'}
          </Button>

          {/* Quick-move select */}
          <select
            aria-label="Move to status"
            value={application.status}
            onChange={(e) => onMove(application.id, e.target.value as ApplicationStatus)}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-500 dark:bg-gray-800 dark:text-white"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(application.id)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </Button>
        </div>
      </article>

      {/* Notes modal */}
      <Modal open={notesOpen} onClose={() => setNotesOpen(false)} title="Application notes">
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          rows={5}
          placeholder="Interview notes, contacts, follow-up dates…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setNotesOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSaveNotes}>Save</Button>
        </div>
      </Modal>
    </>
  );
}
