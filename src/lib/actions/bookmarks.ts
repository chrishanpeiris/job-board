'use server';

// ─── Bookmark Server Actions ──────────────────────────────────────────────────

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function getSavedJobIds(): Promise<string[]> {
  const user = await getSession();
  if (!user) return [];
  const saved = await prisma.savedJob.findMany({
    where: { userId: user.id },
    select: { jobId: true },
  });
  return saved.map((s) => s.jobId);
}

export async function toggleBookmark(jobId: string): Promise<{ bookmarked: boolean }> {
  const user = await getSession();
  if (!user) throw new Error('Not authenticated');

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId: user.id, jobId } },
  });

  if (existing) {
    await prisma.savedJob.delete({
      where: { userId_jobId: { userId: user.id, jobId } },
    });
    revalidatePath('/saved');
    return { bookmarked: false };
  } else {
    await prisma.savedJob.create({ data: { userId: user.id, jobId } });
    revalidatePath('/saved');
    return { bookmarked: true };
  }
}

export async function getSavedJobs() {
  const user = await getSession();
  if (!user) return [];
  return prisma.savedJob.findMany({
    where: { userId: user.id },
    include: { job: { include: { company: true } } },
    orderBy: { savedAt: 'desc' },
  });
}
