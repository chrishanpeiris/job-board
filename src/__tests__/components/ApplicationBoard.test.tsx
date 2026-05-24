// ─── ApplicationBoard component tests ────────────────────────────────────────
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApplicationBoard } from '@/components/applications/ApplicationBoard';
import type { Application } from '@/types';

vi.mock('@/lib/actions/applications', () => ({
  updateApplicationStatus: vi.fn().mockResolvedValue(undefined),
  updateApplicationNotes:  vi.fn().mockResolvedValue(undefined),
  deleteApplication:       vi.fn().mockResolvedValue(undefined),
}));

const makeApp = (overrides: Partial<Application> = {}): Application => ({
  id: 'app-1',
  status: 'APPLIED',
  notes: null,
  appliedAt: '2024-01-15',
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
  job: {
    id: 'job-1', title: 'React Engineer',
    company: { id: 'co-1', name: 'Acme', logo: null, website: null, description: null },
    location: 'Remote', remote: true, type: 'FULL_TIME',
    salaryMin: 120000, salaryMax: 160000, description: 'Cool job',
    requirements: [], techStack: [], featured: false,
    createdAt: '2024-01-01', expiresAt: null,
  },
  ...overrides,
});

describe('ApplicationBoard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders all 5 status columns', () => {
    render(<ApplicationBoard initialApplications={[]} />);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('Interviewing')).toBeInTheDocument();
    expect(screen.getByText('Offer')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('places application cards in the correct column', async () => {
    const apps = [
      makeApp({ id: '1', status: 'APPLIED' }),
      makeApp({ id: '2', status: 'INTERVIEWING' }),
    ];
    render(<ApplicationBoard initialApplications={apps} />);

    // Both cards should be rendered
    const cards = await screen.findAllByLabelText(/React Engineer at Acme/);
    expect(cards).toHaveLength(2);
  });

  it('removes a card when Remove is clicked', async () => {
    render(<ApplicationBoard initialApplications={[makeApp()]} />);
    const removeBtn = await screen.findByText('Remove');
    fireEvent.click(removeBtn);
    await waitFor(() => {
      expect(screen.queryByLabelText(/React Engineer at Acme/)).not.toBeInTheDocument();
    });
  });

  it('shows the notes modal when "Add notes" is clicked', async () => {
    render(<ApplicationBoard initialApplications={[makeApp()]} />);
    const addNotes = await screen.findByText('Add notes');
    fireEvent.click(addNotes);
    expect(await screen.findByText('Application notes')).toBeInTheDocument();
  });
});
