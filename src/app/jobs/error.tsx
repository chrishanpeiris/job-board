'use client';

// ─── Jobs error boundary ──────────────────────────────────────────────────────
// Next.js automatically wraps this segment's errors in this component.
// Demonstrates: error.tsx, reset function, ErrorBoundary.

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error:  Error & { digest?: string };
  reset: () => void;
}

export default function JobsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[JobsError]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-4xl">⚠️</p>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Something went wrong</h2>
      <p className="text-sm text-gray-500">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
