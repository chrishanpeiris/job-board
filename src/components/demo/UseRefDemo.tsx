'use client';

import { useState, useEffect, useRef } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';

// ── usePrevious — classic useRef pattern ──────────────────────────────────────
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; });   // runs AFTER render — stores previous
  return ref.current;
}

export function UseRefDemo() {
  // ── 1. DOM reference — focus an input programmatically ────────
  const inputRef = useRef<HTMLInputElement>(null);

  // ── 2. Mutable value that doesn't cause re-renders ────────────
  const renderCount = useRef(0);
  const [, setTick] = useState(0);              // only this triggers renders
  renderCount.current += 1;                    // mutate ref directly, no re-render

  // ── 3. Previous value ─────────────────────────────────────────
  const [score, setScore] = useState(0);
  const prevScore = usePrevious(score);

  return (
    <DemoSection
      id="useref"
      title="useRef"
      badge="Core Hook"
      badgeColor="blue"
      usedIn="useIntersection · Modal · JobSearch"
      description="Two use-cases: (1) hold a mutable DOM reference so you can call focus/scroll/observe on it imperatively; (2) hold a mutable value across renders without triggering a re-render — like a render counter or a previous value."
    >
      {/* DOM ref */}
      <div className="demo-card">
        <p className="demo-label">DOM ref — focus input from parent button</p>
        <div className="flex gap-2">
          <input ref={inputRef} className="demo-input flex-1" placeholder="Click Focus Me →" />
          <Button variant="secondary" size="sm" onClick={() => inputRef.current?.focus()}>
            Focus Me
          </Button>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          ref.current points to the real &lt;input&gt; DOM node
        </p>
      </div>

      {/* Render counter */}
      <div className="demo-card">
        <p className="demo-label">Mutable ref — render counter (doesn&apos;t trigger re-render)</p>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Renders so far: <span className="font-bold text-blue-600 dark:text-blue-400">{renderCount.current}</span>
          </p>
          <Button variant="secondary" size="sm" onClick={() => setTick((t) => t + 1)}>
            Force re-render
          </Button>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          renderCount lives in a ref — updating it never causes a re-render
        </p>
      </div>

      {/* Previous value */}
      <div className="demo-card">
        <p className="demo-label">usePrevious — classic ref pattern</p>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setScore((s) => s - 5)}>−5</Button>
          <span className="w-12 text-center text-xl font-bold text-gray-900 dark:text-white">{score}</span>
          <Button variant="secondary" size="sm" onClick={() => setScore((s) => s + 5)}>+5</Button>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Previous: <span className="font-mono font-semibold">{prevScore ?? '—'}</span>
          {prevScore !== undefined && (
            <span className={`ml-2 font-semibold ${score > prevScore ? 'text-green-600' : 'text-red-500'}`}>
              ({score > prevScore ? '▲' : '▼'} {Math.abs(score - prevScore)})
            </span>
          )}
        </p>
      </div>

      <CodeBlock>{`// 1. DOM reference
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} />
inputRef.current?.focus();   // imperative DOM call

// 2. Mutable counter — no re-render when mutated
const renderCount = useRef(0);
renderCount.current += 1;   // mutate directly

// 3. usePrevious — stores value AFTER each render
function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; }); // no deps = runs after every render
  return ref.current;  // returns the PREVIOUS render's value
}`}</CodeBlock>
    </DemoSection>
  );
}
