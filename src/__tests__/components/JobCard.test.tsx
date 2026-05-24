// ─── JobCard component tests ──────────────────────────────────────────────────
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JobCard } from '@/components/jobs/JobCard';
import type { Job } from '@/types';

// ── Test helpers ──────────────────────────────────────────────────────────────

const makeJob = (overrides: Partial<Job> = {}): Job => ({
  id: 'job-1',
  title: 'Senior Frontend Engineer',
  company: { id: 'co-1', name: 'Stripe', logo: null, website: 'https://stripe.com', description: null },
  location: 'San Francisco, CA',
  remote: true,
  type: 'FULL_TIME',
  salaryMin: 160000,
  salaryMax: 220000,
  description: 'Build amazing products.',
  requirements: ['React', 'TypeScript'],
  techStack: ['React', 'TypeScript', 'Next.js'],
  featured: false,
  createdAt: new Date().toISOString(),
  expiresAt: null,
  ...overrides,
});

// Mock Next.js Image to avoid canvas issues in jsdom
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('JobCard', () => {
  it('renders job title and company name', () => {
    render(<JobCard job={makeJob()} />, { wrapper });
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Stripe')).toBeInTheDocument();
  });

  it('renders the Remote badge when job.remote is true', () => {
    render(<JobCard job={makeJob({ remote: true })} />, { wrapper });
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });

  it('does NOT render a Remote badge when job.remote is false', () => {
    render(<JobCard job={makeJob({ remote: false })} />, { wrapper });
    expect(screen.queryByText('Remote')).not.toBeInTheDocument();
  });

  it('renders the correct job type badge', () => {
    render(<JobCard job={makeJob({ type: 'CONTRACT' })} />, { wrapper });
    expect(screen.getByText('Contract')).toBeInTheDocument();
  });

  it('renders tech stack pills (up to 5)', () => {
    const job = makeJob({ techStack: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Prisma', 'Vitest'] });
    render(<JobCard job={job} />, { wrapper });
    expect(screen.getByText('React')).toBeInTheDocument();
    // 6th item should be collapsed into +1
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('renders Featured badge when job.featured is true', () => {
    render(<JobCard job={makeJob({ featured: true })} />, { wrapper });
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('renders a formatted salary range', () => {
    render(<JobCard job={makeJob({ salaryMin: 160000, salaryMax: 220000 })} />, { wrapper });
    expect(screen.getByText(/\$160,000/)).toBeInTheDocument();
  });

  it('renders "Salary not listed" when salaryMin and salaryMax are null', () => {
    render(<JobCard job={makeJob({ salaryMin: null, salaryMax: null })} />, { wrapper });
    expect(screen.getByText('Salary not listed')).toBeInTheDocument();
  });

  it('hides salary and tech stack in compact mode', () => {
    render(<JobCard job={makeJob()} compact />, { wrapper });
    expect(screen.queryByText(/\$160,000/)).not.toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('has a link to the job detail page', () => {
    render(<JobCard job={makeJob({ id: 'job-42' })} />, { wrapper });
    expect(screen.getByRole('link')).toHaveAttribute('href', '/jobs/job-42');
  });

  it('bookmark button has correct aria-pressed', () => {
    render(<JobCard job={makeJob()} />, { wrapper });
    const btn = screen.getByRole('button', { name: /bookmark/i });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });
});
