// ─── useJobFilters tests ──────────────────────────────────────────────────────
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useJobFilters } from '@/hooks/useJobFilters';

const mockReplace = vi.fn();
const mockPathname = '/jobs';

beforeEach(() => {
  mockReplace.mockClear();

  vi.mocked(useRouter).mockReturnValue({
    push: vi.fn(), replace: mockReplace, back: vi.fn(),
    forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(),
  });
  vi.mocked(usePathname).mockReturnValue(mockPathname);
  vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>);
});

describe('useJobFilters', () => {
  it('initialises with default values', () => {
    const { result } = renderHook(() => useJobFilters());
    expect(result.current.filters).toEqual({
      search: '', type: '', remote: null, location: '', sort: 'newest',
    });
  });

  it('setSearch updates the search filter and syncs URL', () => {
    const { result } = renderHook(() => useJobFilters());
    act(() => result.current.setSearch('react'));
    expect(result.current.filters.search).toBe('react');
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('q=react'));
  });

  it('setType updates the type filter', () => {
    const { result } = renderHook(() => useJobFilters());
    act(() => result.current.setType('FULL_TIME'));
    expect(result.current.filters.type).toBe('FULL_TIME');
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('type=FULL_TIME'));
  });

  it('setRemote to true updates the remote filter', () => {
    const { result } = renderHook(() => useJobFilters());
    act(() => result.current.setRemote(true));
    expect(result.current.filters.remote).toBe(true);
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('remote=true'));
  });

  it('setRemote to null removes remote param from URL', () => {
    const { result } = renderHook(() => useJobFilters());
    act(() => result.current.setRemote(true));
    act(() => result.current.setRemote(null));
    expect(result.current.filters.remote).toBeNull();
    const lastCall = mockReplace.mock.calls.at(-1)![0] as string;
    expect(lastCall).not.toContain('remote');
  });

  it('reset restores defaults and clears URL', () => {
    const { result } = renderHook(() => useJobFilters());
    act(() => result.current.setSearch('something'));
    act(() => result.current.reset());
    expect(result.current.filters).toEqual({
      search: '', type: '', remote: null, location: '', sort: 'newest',
    });
    expect(mockReplace).toHaveBeenCalledWith(mockPathname);
  });

  it('initialises from URL search params', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('q=typescript&type=CONTRACT&remote=true') as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useJobFilters());
    expect(result.current.filters.search).toBe('typescript');
    expect(result.current.filters.type).toBe('CONTRACT');
    expect(result.current.filters.remote).toBe(true);
  });
});
