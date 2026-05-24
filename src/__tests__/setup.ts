import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Automatically unmount and clean up after each test
afterEach(() => {
  cleanup();
});

// ── Mock Next.js navigation ──────────────────────────────────────────────────
// Use vi.fn() so individual tests can override via vi.mocked(...).mockReturnValue()
vi.mock('next/navigation', () => ({
  useRouter:       vi.fn(() => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() })),
  usePathname:     vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// ── Mock Next.js cache-related functions ─────────────────────────────────────
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag:  vi.fn(),
}));

// ── Suppress act() warnings in test output ───────────────────────────────────
const originalError = console.error.bind(console.error);
console.error = (msg: string, ...args: unknown[]) => {
  if (typeof msg === 'string' && msg.includes('Warning: An update to')) return;
  originalError(msg, ...args);
};
