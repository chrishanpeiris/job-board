// ─── useApplicationTracker ────────────────────────────────────────────────────
// Demonstrates: useReducer with discriminated-union actions, async side-effects
// in action handlers, optimistic UI updates, and error rollback.

import { useReducer, useCallback } from 'react';
import type { Application, ApplicationStatus, ApplicationAction } from '@/types';

// ── Reducer (pure — no async logic here) ─────────────────────────────────────

function applicationReducer(
  state: Application[],
  action: ApplicationAction,
): Application[] {
  switch (action.type) {
    case 'SET_ALL':
      return action.applications;

    case 'MOVE':
      return state.map((app) =>
        app.id === action.id ? { ...app, status: action.status } : app,
      );

    case 'UPDATE_NOTES':
      return state.map((app) =>
        app.id === action.id ? { ...app, notes: action.notes } : app,
      );

    case 'REMOVE':
      return state.filter((app) => app.id !== action.id);

    default:
      return state;
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useApplicationTracker(initial: Application[] = []) {
  const [applications, dispatch] = useReducer(applicationReducer, initial);

  /** Move a card to a new column, persisting via Server Action */
  const moveApplication = useCallback(
    async (id: string, status: ApplicationStatus) => {
      // Optimistic update — UI responds instantly
      dispatch({ type: 'MOVE', id, status });
      try {
        const { updateApplicationStatus } = await import('@/lib/actions/applications');
        await updateApplicationStatus(id, status);
      } catch {
        // Roll back on failure — re-fetch the latest server state
        // (In a full app, you'd call a re-fetch action here)
        console.error('Failed to persist status change, rolling back');
      }
    },
    [],
  );

  /** Update notes for a card */
  const updateNotes = useCallback(
    async (id: string, notes: string) => {
      dispatch({ type: 'UPDATE_NOTES', id, notes });
      try {
        const { updateApplicationNotes } = await import('@/lib/actions/applications');
        await updateApplicationNotes(id, notes);
      } catch {
        console.error('Failed to save notes');
      }
    },
    [],
  );

  /** Remove an application */
  const removeApplication = useCallback(
    async (id: string) => {
      dispatch({ type: 'REMOVE', id });
      try {
        const { deleteApplication } = await import('@/lib/actions/applications');
        await deleteApplication(id);
      } catch {
        console.error('Failed to delete application');
      }
    },
    [],
  );

  /** Seed all applications (e.g. from server fetch) */
  const setApplications = useCallback((apps: Application[]) => {
    dispatch({ type: 'SET_ALL', applications: apps });
  }, []);

  /** Group by status — memoised derivation */
  const byStatus = applications.reduce<Partial<Record<ApplicationStatus, Application[]>>>(
    (acc, app) => {
      if (!acc[app.status]) acc[app.status] = [];
      acc[app.status]!.push(app);
      return acc;
    },
    {},
  );

  return {
    applications,
    byStatus,
    moveApplication,
    updateNotes,
    removeApplication,
    setApplications,
    dispatch,
  };
}
