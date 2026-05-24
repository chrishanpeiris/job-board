// ─── Saved Jobs page (RSC) ────────────────────────────────────────────────────
// Demonstrates: RSC auth guard via getSession, redirect(), and Suspense.

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { getSavedJobs } from '@/lib/actions/bookmarks';
import { JobCard } from '@/components/jobs/JobCard';
import type { JobType } from '@/types';

export const metadata: Metadata = { title: 'Saved Jobs' };

export default async function SavedPage() {
  const user = await getSession();
  if (!user) redirect('/login');

  const saved = await getSavedJobs();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Saved Jobs
        {saved.length > 0 && (
          <span className="ml-2 text-lg font-normal text-gray-400">({saved.length})</span>
        )}
      </h1>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-600">
          <p className="text-3xl">🔖</p>
          <p className="font-medium text-gray-700 dark:text-gray-300">No saved jobs yet</p>
          <p className="text-sm text-gray-500">Bookmark jobs while browsing to see them here.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {saved.map(({ job }) => {
            const mapped = {
              ...job,
              type:         job.type as JobType,
              requirements: JSON.parse(job.requirements ?? '[]') as string[],
              techStack:    JSON.parse(job.techStack   ?? '[]') as string[],
              createdAt:    job.createdAt.toISOString(),
              expiresAt:    job.expiresAt?.toISOString() ?? null,
            };
            return (
              <li key={job.id}>
                <JobCard job={mapped} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
