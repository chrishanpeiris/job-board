'use client';

// ─── withAuth HOC ─────────────────────────────────────────────────────────────
// Demonstrates: Higher-Order Component pattern in TypeScript, generics,
// displayName, and redirecting unauthenticated users.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectTo = '/login',
) {
  function ProtectedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace(redirectTo);
      }
    }, [loading, user, router]);

    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (!user) return null; // will redirect momentarily

    return <WrappedComponent {...props} />;
  }

  // Preserve the display name for React DevTools
  ProtectedComponent.displayName = `withAuth(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'
  })`;

  return ProtectedComponent;
}
