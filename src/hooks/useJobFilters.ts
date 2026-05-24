// ─── useJobFilters ────────────────────────────────────────────────────────────
// Demonstrates: useReducer, URL-search-param sync, useCallback, custom hook
// encapsulating complex state logic.

import { useReducer, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { JobFilters, JobSortKey, JobType } from '@/types';

// ── State + Action types ──────────────────────────────────────────────────────

type FilterAction =
  | { type: 'SET_SEARCH';   search:   string }
  | { type: 'SET_TYPE';     jobType:  JobType | '' }
  | { type: 'SET_REMOTE';   remote:   boolean | null }
  | { type: 'SET_LOCATION'; location: string }
  | { type: 'SET_SORT';     sort:     JobSortKey }
  | { type: 'RESET' };

interface FilterState extends JobFilters {
  sort: JobSortKey;
}

const DEFAULT: FilterState = {
  search:   '',
  type:     '',
  remote:   null,
  location: '',
  sort:     'newest',
};

function reducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH':   return { ...state, search:   action.search };
    case 'SET_TYPE':     return { ...state, type:     action.jobType };
    case 'SET_REMOTE':   return { ...state, remote:   action.remote };
    case 'SET_LOCATION': return { ...state, location: action.location };
    case 'SET_SORT':     return { ...state, sort:     action.sort };
    case 'RESET':        return DEFAULT;
    default:             return state;
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useJobFilters() {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  // Initialise from URL so filters survive page refresh / share
  const [state, dispatch] = useReducer(reducer, DEFAULT, () => ({
    search:   searchParams.get('q')        ?? '',
    type:     (searchParams.get('type')    ?? '') as JobType | '',
    remote:   searchParams.get('remote') === 'true' ? true
            : searchParams.get('remote') === 'false' ? false : null,
    location: searchParams.get('location') ?? '',
    sort:     (searchParams.get('sort')    ?? 'newest') as JobSortKey,
  }));

  // Sync state → URL (shallow replace so Back button works correctly)
  const syncUrl = useCallback((next: FilterState) => {
    const params = new URLSearchParams();
    if (next.search)           params.set('q',        next.search);
    if (next.type)             params.set('type',     next.type);
    if (next.remote !== null)  params.set('remote',   String(next.remote));
    if (next.location)         params.set('location', next.location);
    if (next.sort !== 'newest') params.set('sort',    next.sort);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }, [router, pathname]);

  // Wrapped dispatchers keep call-sites clean
  const setSearch = useCallback((search: string) => {
    const next = reducer(state, { type: 'SET_SEARCH', search });
    dispatch({ type: 'SET_SEARCH', search });
    syncUrl(next);
  }, [state, syncUrl]);

  const setType = useCallback((jobType: JobType | '') => {
    const next = reducer(state, { type: 'SET_TYPE', jobType });
    dispatch({ type: 'SET_TYPE', jobType });
    syncUrl(next);
  }, [state, syncUrl]);

  const setRemote = useCallback((remote: boolean | null) => {
    const next = reducer(state, { type: 'SET_REMOTE', remote });
    dispatch({ type: 'SET_REMOTE', remote });
    syncUrl(next);
  }, [state, syncUrl]);

  const setLocation = useCallback((location: string) => {
    const next = reducer(state, { type: 'SET_LOCATION', location });
    dispatch({ type: 'SET_LOCATION', location });
    syncUrl(next);
  }, [state, syncUrl]);

  const setSort = useCallback((sort: JobSortKey) => {
    const next = reducer(state, { type: 'SET_SORT', sort });
    dispatch({ type: 'SET_SORT', sort });
    syncUrl(next);
  }, [state, syncUrl]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    router.replace(pathname);
  }, [router, pathname]);

  return { filters: state, setSearch, setType, setRemote, setLocation, setSort, reset };
}
