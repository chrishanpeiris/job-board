'use client';

// ─── ErrorBoundary ────────────────────────────────────────────────────────────
// Demonstrates: class component (only way to implement error boundaries in React),
// getDerivedStateFromError, componentDidCatch, and reset pattern.

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children:  ReactNode;
  fallback?: ReactNode;
  onError?:  (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error:    Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Called during render when a descendant throws
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Called after render with error details — good for logging
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    // In production you'd send to Sentry / Datadog here
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-lg font-semibold text-red-800 dark:text-red-300">
            Something went wrong
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <Button variant="secondary" size="sm" onClick={this.reset}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
