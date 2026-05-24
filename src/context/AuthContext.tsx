'use client';

// ─── AuthContext ──────────────────────────────────────────────────────────────
// Demonstrates: createContext, useContext, custom hook pattern, Context + state
// management, async state updates, and protecting context consumers.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { User } from '@/types';

// ── Shape ────────────────────────────────────────────────────────────────────

interface AuthState {
  user:    User | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login:  (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Manually refresh session (e.g. after a Server Action updates the cookie) */
  refresh: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

// Provide a meaningful error when context is consumed outside the provider
// instead of a silent undefined crash.
const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  // Hydrate from the server session on mount
  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const { user } = await res.json() as { user: User };
        setState({ user, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch {
      setState({ user: null, loading: false });
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const { error } = await res.json() as { error: string };
      throw new Error(error ?? 'Login failed');
    }
    const { user } = await res.json() as { user: User };
    setState({ user, loading: false });
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setState({ user: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Consumer hook ─────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
