// ─── Home page (RSC) ──────────────────────────────────────────────────────────
// Server Component — fetches featured jobs at request time, then streams them
// via Suspense. Demonstrates RSC data fetching.

import { Suspense } from 'react';
import Link from 'next/link';
import { getJobs } from '@/lib/actions/jobs';
import { JobCard } from '@/components/jobs/JobCard';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

async function FeaturedJobs() {
  const { jobs } = await getJobs({ search: '', type: '', remote: null, location: '' }, 'featured');
  const featured = jobs.filter((j) => j.featured).slice(0, 3);

  return (
    <div className="space-y-4">
      {featured.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Find your next{' '}
          <span className="text-blue-600 dark:text-blue-400">engineering role</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Curated frontend and full-stack positions at top-tier companies.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/jobs">
            <Button size="lg">Browse jobs</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">Sign in</Button>
          </Link>
        </div>
      </div>

      {/* Featured jobs */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          Featured positions
        </h2>
        <Suspense
          fallback={
            <div className="space-y-4">
              {[0, 1, 2].map((i) => <JobCardSkeleton key={i} />)}
            </div>
          }
        >
          <FeaturedJobs />
        </Suspense>

        <div className="mt-6 text-center">
          <Link href="/jobs">
            <Button variant="secondary">View all jobs →</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
