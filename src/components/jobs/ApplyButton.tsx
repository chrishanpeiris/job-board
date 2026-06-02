'use client';

// ─── ApplyButton ──────────────────────────────────────────────────────────────
// Client component — handles the Apply click on the job detail page.
// Lives separately from the RSC page so we can use onClick + useState here.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { applyToJob } from '@/lib/actions/applications';

interface ApplyButtonProps {
  jobId: string;
}

export function ApplyButton({ jobId }: ApplyButtonProps) {
  const router = useRouter();
  const [loading,  setLoading]  = useState(false);
  const [applied,  setApplied]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleApply() {
    setLoading(true);
    setError(null);
    try {
      await applyToJob(jobId);
      setApplied(true);
      // Give user a moment to see the confirmation, then go to their board
      setTimeout(() => router.push('/applications'), 1200);
    } catch (err) {
      // Most likely they're not logged in
      setError('You need to be signed in to apply.');
    } finally {
      setLoading(false);
    }
  }

  if (applied) {
    return (
      <Button size="lg" disabled className="bg-green-600 hover:bg-green-600">
        ✓ Applied — redirecting…
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" loading={loading} onClick={handleApply}>
        Apply now
      </Button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
