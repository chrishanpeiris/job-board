'use client';

import { useState, Component, type ErrorInfo, type ReactNode } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';

// ── Inline error boundary for the demo ───────────────────────────────────────
// Error boundaries MUST be class components — there is no hook equivalent.
// getDerivedStateFromError catches during render; componentDidCatch is for logging.

interface EBState { hasError: boolean; message: string; }

class DemoErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): EBState {
    // Called during render — update state to show fallback UI
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Called after render — good place to log to Sentry / Datadog
    console.error('[DemoErrorBoundary]', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="font-semibold text-red-700 dark:text-red-400">💥 Caught by ErrorBoundary</p>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">{this.state.message}</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Reset boundary
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Component that can throw ──────────────────────────────────────────────────
function BombComponent({ shouldExplode }: { shouldExplode: boolean }) {
  if (shouldExplode) {
    throw new Error('Simulated render error — caught by ErrorBoundary');
  }
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
      <p className="text-sm text-green-700 dark:text-green-400">
        ✅ Component is stable — press the button to simulate a render crash
      </p>
    </div>
  );
}

export function ErrorBoundaryDemo() {
  const [explode, setExplode] = useState(false);

  return (
    <DemoSection
      id="errorboundary"
      title="Error Boundary"
      badge="Class Component"
      badgeColor="red"
      usedIn="ErrorBoundary · jobs/error.tsx"
      description="The only React pattern that still requires a class component — there is no hook for catching render errors. getDerivedStateFromError runs during render to show the fallback UI. componentDidCatch runs after render for side-effects like logging."
    >
      <div className="demo-card">
        <p className="demo-label">Crash a child component — boundary catches it</p>
        <DemoErrorBoundary>
          <BombComponent shouldExplode={explode} />
        </DemoErrorBoundary>
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={() => setExplode(true)}
          disabled={explode}
        >
          💣 Trigger render error
        </Button>
        {explode && (
          <p className="mt-2 text-xs text-gray-400">
            Reset the boundary above to restore the component
          </p>
        )}
      </div>

      <CodeBlock>{`// Must be a class — no hook equivalent exists
class ErrorBoundary extends Component {
  state = { hasError: false };

  // Called during render — return new state to show fallback
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Called after render — use for logging (Sentry, etc.)
  componentDidCatch(error, info) {
    logToSentry(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) return <Fallback />;
    return this.props.children;
  }
}`}</CodeBlock>
    </DemoSection>
  );
}
