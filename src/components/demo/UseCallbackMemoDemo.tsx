'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';

// ── Child that counts its own renders ─────────────────────────────────────────
// Without React.memo this component re-renders whenever the parent does.
// With React.memo it only re-renders when its props change — so a stable
// useCallback reference means it stays frozen even when the parent re-renders.

const ExpensiveChild = memo(function ExpensiveChild({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const renders = useMemo(() => ({ count: 0 }), []); // stable object
  renders.count += 1;

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-600">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">renders: <b className="text-blue-600 dark:text-blue-400">{renders.count}</b></span>
        <Button variant="secondary" size="sm" onClick={onClick}>Click</Button>
      </div>
    </div>
  );
});

// ── Fibonacci — expensive computation ─────────────────────────────────────────
function fib(n: number): number {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

export function UseCallbackMemoDemo() {
  const [parentCount, setParentCount] = useState(0);
  const [childClicks, setChildClicks]   = useState(0);
  const [fibN, setFibN]                 = useState(30);

  // ── useCallback — stable reference, child won't re-render ────
  const stableHandler = useCallback(() => {
    setChildClicks((c) => c + 1);
  }, []); // empty deps — function never changes

  // ── NO useCallback — new function every render, child re-renders ──
  const unstableHandler = () => setChildClicks((c) => c + 1);

  // ── useMemo — only re-computes when fibN changes ─────────────
  const fibResult = useMemo(() => fib(fibN), [fibN]);

  return (
    <DemoSection
      id="usecallback"
      title="useCallback + useMemo"
      badge="Optimisation"
      badgeColor="purple"
      usedIn="JobCard · useJobFilters · useApplicationTracker · AuthContext"
      description="useCallback returns a stable function reference across renders. useMemo returns a stable computed value. Both prevent unnecessary work — but only matter when paired with React.memo or as hook dependencies."
    >
      {/* useCallback */}
      <div className="demo-card">
        <p className="demo-label">useCallback — stable vs unstable handler</p>
        <p className="mb-3 text-xs text-gray-400">
          Parent renders: <b className="text-gray-700 dark:text-gray-300">{parentCount}</b> ·
          Child clicks: <b className="text-gray-700 dark:text-gray-300">{childClicks}</b>
        </p>
        <div className="space-y-2">
          <ExpensiveChild label="✅ useCallback — stable reference" onClick={stableHandler} />
          <ExpensiveChild label="❌ No useCallback — new fn each render" onClick={unstableHandler} />
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={() => setParentCount((c) => c + 1)}
        >
          Re-render parent
        </Button>
        <p className="mt-2 text-xs text-gray-400">
          Re-render the parent and watch which child&apos;s render count increases
        </p>
      </div>

      {/* useMemo */}
      <div className="demo-card">
        <p className="demo-label">useMemo — expensive computation cached by n</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={38}
            value={fibN}
            onChange={(e) => setFibN(Number(e.target.value))}
            className="flex-1"
          />
          <span className="w-8 text-center font-mono font-bold text-gray-900 dark:text-white">{fibN}</span>
        </div>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          fib({fibN}) = <span className="font-bold text-blue-600 dark:text-blue-400">{fibResult.toLocaleString()}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Only re-computes when the slider moves — not on every parent render
        </p>
      </div>

      <CodeBlock>{`// useCallback — same function reference across renders
const handler = useCallback(() => {
  doSomething(value);
}, [value]);   // only changes when value changes

// useMemo — same computed value across renders
const result = useMemo(() => expensiveCalc(n), [n]);

// Both only help when:
// 1. Used with React.memo children, OR
// 2. The value is itself a hook dependency`}</CodeBlock>
    </DemoSection>
  );
}
