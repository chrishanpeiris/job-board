import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/lib/actions/jobs';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const job = await getJob(params.id);
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(job);
  } catch (err) {
    console.error('[GET /api/jobs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
