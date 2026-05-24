'use client';

import { useState, type ComponentType } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';

// ── HOC 1: withLogger — logs every prop change ────────────────────────────────

function withLogger<P extends object>(WrappedComponent: ComponentType<P>) {
  function LoggedComponent(props: P) {
    // In production you'd send to analytics — here we just show it on screen
    return (
      <div>
        <div className="mb-2 rounded border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs dark:border-yellow-800 dark:bg-yellow-900/20">
          <span className="font-semibold text-yellow-700 dark:text-yellow-400">withLogger: </span>
          <span className="font-mono text-yellow-600 dark:text-yellow-300">
            {JSON.stringify(props)}
          </span>
        </div>
        <WrappedComponent {...props} />
      </div>
    );
  }
  LoggedComponent.displayName = `withLogger(${WrappedComponent.displayName ?? WrappedComponent.name})`;
  return LoggedComponent;
}

// ── HOC 2: withLoadingSpinner — injects loading state ────────────────────────

interface WithLoadingProps { isLoading?: boolean; }

function withLoadingSpinner<P extends object>(WrappedComponent: ComponentType<P>) {
  function WithSpinner(props: P & WithLoadingProps) {
    const { isLoading, ...rest } = props;
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          Loading…
        </div>
      );
    }
    return <WrappedComponent {...(rest as P)} />;
  }
  WithSpinner.displayName = `withLoadingSpinner(${WrappedComponent.displayName ?? WrappedComponent.name})`;
  return WithSpinner;
}

// ── Base components ───────────────────────────────────────────────────────────

function UserCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-600">
      <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  );
}

function StatsCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-600">
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// ── Enhanced versions via HOC composition ─────────────────────────────────────

const LoggedUserCard   = withLogger(UserCard);
const LoadableStatsCard = withLoadingSpinner(StatsCard);

// ── Demo ──────────────────────────────────────────────────────────────────────

export function HOCDemo() {
  const [name, setName]       = useState('Alice');
  const [isLoading, setLoading] = useState(false);

  function simulateLoad() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <DemoSection
      id="hoc"
      title="Higher-Order Component (HOC)"
      badge="Advanced Pattern"
      badgeColor="orange"
      usedIn="withAuth"
      description="A function that takes a component and returns an enhanced component. HOCs add cross-cutting concerns (logging, auth guards, loading states) without modifying the original component. Each HOC has a single responsibility. TypeScript generics preserve the wrapped component's prop types."
    >
      {/* withLogger */}
      <div className="demo-card">
        <p className="demo-label">withLogger — wraps any component, logs its props</p>
        <div className="mb-3 flex gap-2">
          {['Alice', 'Bob', 'Carol'].map((n) => (
            <Button key={n} size="sm" variant={name === n ? 'primary' : 'secondary'} onClick={() => setName(n)}>
              {n}
            </Button>
          ))}
        </div>
        <LoggedUserCard name={name} role="Senior Engineer" />
      </div>

      {/* withLoadingSpinner */}
      <div className="demo-card">
        <p className="demo-label">withLoadingSpinner — injects loading UI</p>
        <LoadableStatsCard value={42} label="Applications" isLoading={isLoading} />
        <Button variant="secondary" size="sm" className="mt-3" onClick={simulateLoad} disabled={isLoading}>
          Simulate 2s load
        </Button>
      </div>

      <CodeBlock>{`// Generic HOC — preserves the wrapped component's prop types
function withLogger<P extends object>(Wrapped: ComponentType<P>) {
  function LoggedComponent(props: P) {
    console.log('[withLogger]', props);
    return <Wrapped {...props} />;
  }
  // displayName shows correctly in React DevTools
  LoggedComponent.displayName = \`withLogger(\${Wrapped.name})\`;
  return LoggedComponent;
}

// Compose multiple HOCs
const EnhancedCard = withLogger(withLoadingSpinner(UserCard));

// HOC vs hook — HOCs wrap the whole component render;
// hooks compose logic inside a single component.`}</CodeBlock>
    </DemoSection>
  );
}
