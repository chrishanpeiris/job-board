// ─── Job detail page (RSC) ────────────────────────────────────────────────────
// Demonstrates: dynamic route params, generateMetadata, RSC data fetching,
// notFound(), and streaming Suspense.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJob } from '@/lib/actions/jobs';
import { Badge, JobTypeBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CompanyLogo } from '@/components/ui/CompanyLogo';
import { ApplyButton } from '@/components/jobs/ApplyButton';
import { formatSalaryRange, timeAgo } from '@/lib/utils';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob(params.id);
  if (!job) return { title: 'Job not found' };
  return {
    title: `${job.title} at ${job.company.name}`,
    description: job.description.slice(0, 155),
  };
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJob(params.id);
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back */}
      <Link href="/jobs" className="mb-6 flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← Back to jobs
      </Link>

      <article className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-start gap-5">
          <CompanyLogo name={job.company.name} logo={job.company.logo} size={64} className="rounded-xl" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {job.company.website ? (
                <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {job.company.name}
                </a>
              ) : job.company.name}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge>📍 {job.location}</Badge>
          {job.remote && <Badge variant="green">Remote</Badge>}
          <JobTypeBadge type={job.type} />
          {job.featured && <Badge variant="blue">Featured</Badge>}
        </div>

        {/* Salary */}
        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          {formatSalaryRange(job.salaryMin, job.salaryMax)}
        </p>
        <p className="mt-1 text-sm text-gray-400">Posted {timeAgo(job.createdAt)}</p>

        {/* Description */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">About the role</h2>
          <p className="text-gray-600 leading-relaxed dark:text-gray-300">{job.description}</p>
        </section>

        {/* Requirements */}
        {job.requirements.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <span className="mt-0.5 flex-shrink-0">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tech stack */}
        {job.techStack.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Tech stack</h2>
            <div className="flex flex-wrap gap-2">
              {job.techStack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-10 flex gap-3">
          <ApplyButton jobId={job.id} />
          <Button variant="secondary" size="lg">Save job</Button>
        </div>
      </article>
    </div>
  );
}
