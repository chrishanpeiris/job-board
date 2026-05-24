// ─── GET /api/jobs ────────────────────────────────────────────────────────────
// Route handler for job listings — used by TanStack Query on the client.

import { NextRequest, NextResponse } from 'next/server';
import { getJobs } from '@/lib/actions/jobs';
import type { JobFilters, JobSortKey, JobType } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const filters: JobFilters = {
    search:   searchParams.get('q')        ?? '',
    type:     (searchParams.get('type')    ?? '') as JobType | '',
    remote:   searchParams.get('remote') === 'true'  ? true
            : searchParams.get('remote') === 'false' ? false : null,
    location: searchParams.get('location') ?? '',
  };
  const sort = (searchParams.get('sort') ?? 'newest') as JobSortKey;

  try {
    const data = await getJobs(filters, sort);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET /api/jobs]', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
