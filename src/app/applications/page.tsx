// ─── Applications page (RSC + Client Board) ───────────────────────────────────
// Demonstrates: server-side data fetch with auth guard, passing data to a
// client component, and useReducer-powered Kanban board.

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { getApplications } from '@/lib/actions/applications';
import { ApplicationBoard } from '@/components/applications/ApplicationBoard';
import type { Application } from '@/types';

export const metadata: Metadata = { title: 'My Applications' };

export default async function ApplicationsPage() {
  const user = await getSession();
  if (!user) redirect('/login');

  const raw = await getApplications();

  // Map Prisma result → domain type
  const applications: Application[] = raw.map((a) => ({
    id:     a.id,
    status: a.status as Application['status'],
    notes:  a.notes,
    appliedAt: a.appliedAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    job: {
      id:          a.job.id,
      title:       a.job.title,
      location:    a.job.location,
      remote:      a.job.remote,
      type:        a.job.type as Application['job']['type'],
      salaryMin:   a.job.salaryMin,
      salaryMax:   a.job.salaryMax,
      description: a.job.description,
      requirements: JSON.parse(a.job.requirements ?? '[]') as string[],
      techStack:   JSON.parse(a.job.techStack   ?? '[]') as string[],
      featured:    a.job.featured,
      createdAt:   a.job.createdAt.toISOString(),
      expiresAt:   a.job.expiresAt?.toISOString() ?? null,
      company: {
        id:          a.job.company.id,
        name:        a.job.company.name,
        logo:        a.job.company.logo,
        website:     a.job.company.website,
        description: a.job.company.description,
      },
    },
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        My Applications
        {applications.length > 0 && (
          <span className="ml-2 text-lg font-normal text-gray-400">({applications.length})</span>
        )}
      </h1>
      <ApplicationBoard initialApplications={applications} />
    </div>
  );
}
