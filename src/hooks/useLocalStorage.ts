// ─── useLocalStorage ──────────────────────────────────────────────────────────
// Demonstrates: custom hook, generic types, lazy initialiser, SSR safety,
// storage event cross-tab sync.

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>, () => void] {
  // Lazy init: read from localStorage once on mount (safe for SSR — useState
  // initialiser only runs on the client after hydration).
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const next = value instanceof Function ? value(storedValue) : value;
        setStoredValue(next);
        window.localStorage.setItem(key, JSON.stringify(next));
        // Dispatch so other hooks listening on the same key are notified
        window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(next) }));
      } catch {
        // Ignore write errors (e.g. storage quota exceeded)
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }, [key, initialValue]);

  // Cross-tab sync: listen for storage events from other tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        setStoredValue(e.newValue ? (JSON.parse(e.newValue) as T) : initialValue);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
