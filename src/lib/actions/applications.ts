'use server';

// ─── Application Server Actions ───────────────────────────────────────────────
// Demonstrates: Server Actions with auth guard, revalidatePath, Prisma upsert.

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { ApplicationStatus } from '@/types';

async function requireUser() {
  const user = await getSession();
  if (!user) throw new Error('Not authenticated');
  return user;
}

export async function getApplications() {
  const user = await requireUser();
  return prisma.application.findMany({
    where: { userId: user.id },
    include: { job: { include: { company: true } } },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function applyToJob(jobId: string, status: ApplicationStatus = 'APPLIED') {
  const user = await requireUser();
  await prisma.application.upsert({
    where:  { userId_jobId: { userId: user.id, jobId } },
    create: { userId: user.id, jobId, status, appliedAt: new Date() },
    update: { status, appliedAt: new Date() },
  });
  revalidatePath('/applications');
}

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  const user = await requireUser();
  await prisma.application.updateMany({
    where: { id: applicationId, userId: user.id },
    data:  { status },
  });
  revalidatePath('/applications');
}

export async function updateApplicationNotes(applicationId: string, notes: string) {
  const user = await requireUser();
  await prisma.application.updateMany({
    where: { id: applicationId, userId: user.id },
    data:  { notes },
  });
  revalidatePath('/applications');
}

export async function deleteApplication(applicationId: string) {
  const user = await requireUser();
  await prisma.application.deleteMany({
    where: { id: applicationId, userId: user.id },
  });
  revalidatePath('/applications');
}
