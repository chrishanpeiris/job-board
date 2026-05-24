// ─── useLocalStorage tests ────────────────────────────────────────────────────
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// ── Helpers ────────────────────────────────────────────────────────────────────

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem:    (key: string) => store[key] ?? null,
    setItem:    (key: string, val: string) => { store[key] = val; },
    removeItem: (key: string) => { delete store[key]; },
    clear:      () => { store = {}; },
  };
})();

beforeEach(() => {
  mockStorage.clear();
  Object.defineProperty(window, 'localStorage', { value: mockStorage, writable: true });
  vi.restoreAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useLocalStorage', () => {
  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('key', 42));
    expect(result.current[0]).toBe(42);
  });

  it('returns the stored value when something already exists', () => {
    mockStorage.setItem('key', JSON.stringify('hello'));
    const { result } = renderHook(() => useLocalStorage('key', ''));
    expect(result.current[0]).toBe('hello');
  });

  it('setValue updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 0));
    act(() => result.current[1](99));
    expect(result.current[0]).toBe(99);
    expect(JSON.parse(mockStorage.getItem('key')!)).toBe(99);
  });

  it('setValue accepts a function updater', () => {
    const { result } = renderHook(() => useLocalStorage('count', 5));
    act(() => result.current[1]((prev) => prev + 1));
    expect(result.current[0]).toBe(6);
  });

  it('removeValue resets to initial value and clears storage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'init'));
    act(() => result.current[1]('changed'));
    act(() => result.current[2]()); // removeValue
    expect(result.current[0]).toBe('init');
    expect(mockStorage.getItem('key')).toBeNull();
  });

  it('handles JSON parse errors gracefully', () => {
    mockStorage.setItem('bad', 'not-json{{{');
    const { result } = renderHook(() => useLocalStorage('bad', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('syncs state across hooks with the same key via storage event', () => {
    const { result: a } = renderHook(() => useLocalStorage('shared', 0));
    const { result: b } = renderHook(() => useLocalStorage('shared', 0));

    act(() => {
      a.current[1](42);
      window.dispatchEvent(new StorageEvent('storage', { key: 'shared', newValue: '42' }));
    });

    expect(b.current[0]).toBe(42);
  });
});
