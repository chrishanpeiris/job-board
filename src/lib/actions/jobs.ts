'use server';

// ─── Job Server Actions ───────────────────────────────────────────────────────
// Demonstrates: Server Actions, Prisma query building, revalidatePath.

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { Job, JobFilters, JobSortKey } from '@/types';

function mapJob(j: any): Job {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return {
    id:          j.id,
    title:       j.title,
    company:     j.company,
    location:    j.location,
    remote:      j.remote,
    type:        j.type,
    salaryMin:   j.salaryMin,
    salaryMax:   j.salaryMax,
    description: j.description,
    requirements: JSON.parse(j.requirements ?? '[]') as string[],
    techStack:   JSON.parse(j.techStack   ?? '[]') as string[],
    featured:    j.featured,
    createdAt:   j.createdAt.toISOString(),
    expiresAt:   j.expiresAt?.toISOString() ?? null,
  };
}

export async function getJobs(
  filters: JobFilters,
  sort: JobSortKey,
): Promise<{ jobs: Job[]; total: number }> {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { title:            { contains: filters.search } },
      { description:      { contains: filters.search } },
      { company:          { is: { name: { contains: filters.search } } } },
    ];
  }
  if (filters.type)            where.type   = filters.type;
  if (filters.remote !== null) where.remote = filters.remote;
  if (filters.location)        where.location = { contains: filters.location };

  const orderBy =
    sort === 'salary'   ? [{ salaryMax: 'desc' as const }] :
    sort === 'featured' ? [{ featured: 'desc' as const }, { createdAt: 'desc' as const }] :
                          [{ createdAt: 'desc' as const }];

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({ where, orderBy, include: { company: true } }),
    prisma.job.count({ where }),
  ]);

  return { jobs: jobs.map(mapJob), total };
}

export async function getJob(id: string): Promise<Job | null> {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });
  return job ? mapJob(job) : null;
}
