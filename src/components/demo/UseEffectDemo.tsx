'use client';

import { useState, useEffect } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';

export function UseEffectDemo() {
  // ── 1. Interval with cleanup ──────────────────────────────────
  const [time, setTime]       = useState(new Date());
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;                           // early-return skips setup
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);                 // ← cleanup runs on unmount or re-run
  }, [running]);                                    // ← re-run only when `running` changes

  // ── 2. Window resize listener ─────────────────────────────────
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler); // ← cleanup
  }, []);                                           // ← empty deps = run once on mount

  // ── 3. Document title sync ────────────────────────────────────
  const [title, setTitle] = useState('React Demo');
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => { document.title = prev; };        // restore on unmount
  }, [title]);

  return (
    <DemoSection
      id="useeffect"
      title="useEffect"
      badge="Core Hook"
      badgeColor="blue"
      usedIn="AuthContext · ThemeContext · Modal · useDebounce · useLocalStorage"
      description="Runs side-effects after render. The return value is a cleanup function that runs before the next effect or on unmount. Dependency array controls when it re-runs."
    >
      {/* Clock */}
      <div className="demo-card">
        <p className="demo-label">setInterval + cleanup — stops leaking timers</p>
        <div className="flex items-center gap-4">
          <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
            {time.toLocaleTimeString()}
          </span>
          <Button variant="secondary" size="sm" onClick={() => setRunning((r) => !r)}>
            {running ? 'Pause' : 'Resume'}
          </Button>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {running ? 'Interval active — cleanup will run if component unmounts' : 'Interval cleared'}
        </p>
      </div>

      {/* Window width */}
      <div className="demo-card">
        <p className="demo-label">addEventListener + cleanup — resize your window</p>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Window width: <span className="text-blue-600 dark:text-blue-400">{width}px</span>
        </p>
      </div>

      {/* Title sync */}
      <div className="demo-card">
        <p className="demo-label">Document title sync — runs on every title change</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="demo-input"
          placeholder="Type a page title"
        />
        <p className="mt-1 text-xs text-gray-400">Check your browser tab ↑</p>
      </div>

      <CodeBlock>{`// Dependency array controls when effect re-runs:
useEffect(() => { ... }, []);        // once on mount
useEffect(() => { ... }, [value]);   // when value changes
useEffect(() => { ... });            // after every render (rare)

// Cleanup function prevents memory leaks
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);   // runs before next effect / unmount
}, [running]);`}</CodeBlock>
    </DemoSection>
  );
}
