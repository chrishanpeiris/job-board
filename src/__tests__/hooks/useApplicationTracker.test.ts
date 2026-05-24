// ─── useApplicationTracker tests ─────────────────────────────────────────────
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApplicationTracker } from '@/hooks/useApplicationTracker';
import type { Application } from '@/types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const makeApp = (overrides: Partial<Application> = {}): Application => ({
  id: 'app-1',
  job: {
    id: 'job-1', title: 'Senior Engineer',
    company: { id: 'co-1', name: 'Acme', logo: null, website: null, description: null },
    location: 'Remote', remote: true, type: 'FULL_TIME',
    salaryMin: 150000, salaryMax: 200000, description: 'Great job',
    requirements: [], techStack: [], featured: false,
    createdAt: '2024-01-01', expiresAt: null,
  },
  status: 'APPLIED',
  notes: null,
  appliedAt: '2024-01-15',
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
  ...overrides,
});

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/actions/applications', () => ({
  updateApplicationStatus: vi.fn().mockResolvedValue(undefined),
  updateApplicationNotes:  vi.fn().mockResolvedValue(undefined),
  deleteApplication:       vi.fn().mockResolvedValue(undefined),
}));

beforeEach(() => vi.clearAllMocks());

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useApplicationTracker', () => {
  it('initialises with provided applications', () => {
    const apps = [makeApp()];
    const { result } = renderHook(() => useApplicationTracker(apps));
    expect(result.current.applications).toHaveLength(1);
    expect(result.current.applications[0].status).toBe('APPLIED');
  });

  it('setApplications replaces all applications', () => {
    const { result } = renderHook(() => useApplicationTracker([]));
    const apps = [makeApp({ id: 'a' }), makeApp({ id: 'b' })];
    act(() => result.current.setApplications(apps));
    expect(result.current.applications).toHaveLength(2);
  });

  it('moveApplication performs an optimistic status update', async () => {
    const { result } = renderHook(() => useApplicationTracker([makeApp()]));

    await act(async () => {
      await result.current.moveApplication('app-1', 'INTERVIEWING');
    });

    expect(result.current.applications[0].status).toBe('INTERVIEWING');
  });

  it('updateNotes updates the notes for a specific application', async () => {
    const { result } = renderHook(() => useApplicationTracker([makeApp()]));

    await act(async () => {
      await result.current.updateNotes('app-1', 'Great first interview');
    });

    expect(result.current.applications[0].notes).toBe('Great first interview');
  });

  it('removeApplication removes the application from the list', async () => {
    const apps = [makeApp({ id: 'app-1' }), makeApp({ id: 'app-2' })];
    const { result } = renderHook(() => useApplicationTracker(apps));

    await act(async () => {
      await result.current.removeApplication('app-1');
    });

    expect(result.current.applications).toHaveLength(1);
    expect(result.current.applications[0].id).toBe('app-2');
  });

  it('byStatus groups applications by their status', () => {
    const apps = [
      makeApp({ id: '1', status: 'APPLIED' }),
      makeApp({ id: '2', status: 'APPLIED' }),
      makeApp({ id: '3', status: 'INTERVIEWING' }),
    ];
    const { result } = renderHook(() => useApplicationTracker(apps));
    expect(result.current.byStatus.APPLIED).toHaveLength(2);
    expect(result.current.byStatus.INTERVIEWING).toHaveLength(1);
  });

  it('moveApplication calls the server action', async () => {
    const { updateApplicationStatus } = await import('@/lib/actions/applications');
    const { result } = renderHook(() => useApplicationTracker([makeApp()]));

    await act(async () => {
      await result.current.moveApplication('app-1', 'OFFER');
    });

    await waitFor(() => {
      expect(updateApplicationStatus).toHaveBeenCalledWith('app-1', 'OFFER');
    });
  });
});
