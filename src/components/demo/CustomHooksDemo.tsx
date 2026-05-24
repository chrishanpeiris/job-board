'use client';

import { useState, useRef, useEffect } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDebounce }     from '@/hooks/useDebounce';
import { useIntersection } from '@/hooks/useIntersection';

export function CustomHooksDemo() {
  // ── useLocalStorage ───────────────────────────────────────────
  const [savedName, setSavedName, clearName] = useLocalStorage('demo-name', '');

  // ── useDebounce ───────────────────────────────────────────────
  const [raw, setRaw]         = useState('');
  const debounced             = useDebounce(raw, 500);
  const [callCount, setCallCount] = useState(0);
  const prevDebounced = useRef('');
  useEffect(() => {
    if (debounced !== prevDebounced.current) {
      if (debounced) setCallCount((c) => c + 1);
      prevDebounced.current = debounced;
    }
  }, [debounced]);

  // ── useIntersection ───────────────────────────────────────────
  const [boxRef, isVisible] = useIntersection<HTMLDivElement>({ threshold: 0.8 });

  return (
    <DemoSection
      id="customhooks"
      title="Custom Hooks"
      badge="Composition"
      badgeColor="green"
      usedIn="useLocalStorage · useDebounce · useIntersection · useJobs · useJobFilters"
      description="Custom hooks extract stateful logic into reusable functions. They follow the same rules as built-in hooks (call order, no conditionals) but compose them into higher-level behaviour. The key insight: logic is shared — not component trees."
    >
      {/* useLocalStorage */}
      <div className="demo-card">
        <p className="demo-label">
          <code className="demo-code">useLocalStorage</code> — persists across page reloads
        </p>
        <div className="flex gap-2">
          <input
            className="demo-input flex-1"
            placeholder="Type your name…"
            value={savedName}
            onChange={(e) => setSavedName(e.target.value)}
          />
          <Button variant="ghost" size="sm" onClick={clearName}>Clear</Button>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Stored in <code className="demo-code">localStorage[&apos;demo-name&apos;]</code> — reload the page and it&apos;s still here.
          Cross-tab synced via <code className="demo-code">StorageEvent</code>.
        </p>
      </div>

      {/* useDebounce */}
      <div className="demo-card">
        <p className="demo-label">
          <code className="demo-code">useDebounce(value, 500ms)</code> — fires 500ms after you stop typing
        </p>
        <input
          className="demo-input"
          placeholder="Type quickly…"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
        <div className="mt-2 space-y-0.5 text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            Raw: <span className="font-mono text-gray-900 dark:text-white">&quot;{raw}&quot;</span>
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Debounced: <span className="font-mono text-blue-600 dark:text-blue-400">&quot;{debounced}&quot;</span>
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            API calls fired: <span className="font-semibold text-green-600 dark:text-green-400">{callCount}</span>
            <span className="ml-1 text-xs">(without debounce: {raw.length})</span>
          </p>
        </div>
      </div>

      {/* useIntersection */}
      <div className="demo-card">
        <p className="demo-label">
          <code className="demo-code">useIntersection</code> — fires when element enters viewport
        </p>
        <p className="mb-3 text-xs text-gray-400">Scroll down until the box enters the viewport:</p>
        <div className="h-24 overflow-y-scroll rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 p-2">
          <div className="h-20 flex items-end justify-center pb-1 text-xs text-gray-300">↓ scroll ↓</div>
          <div
            ref={boxRef}
            className={`rounded-lg border-2 p-4 text-center transition-all duration-500 ${
              isVisible
                ? 'border-green-400 bg-green-50 dark:bg-green-900/30 dark:border-green-600'
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
            }`}
          >
            <p className={`text-sm font-semibold transition-colors ${isVisible ? 'text-green-700 dark:text-green-400' : 'text-gray-400'}`}>
              {isVisible ? '✅ Visible — IntersectionObserver fired' : '⏳ Not yet visible'}
            </p>
          </div>
          <div className="h-8" />
        </div>
      </div>

      <CodeBlock>{`// Every custom hook is just a function that calls other hooks
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);   // cancel on next keystroke
  }, [value, delay]);

  return debounced;
}

// Usage — identical to a built-in hook
const debouncedSearch = useDebounce(searchTerm, 300);`}</CodeBlock>
    </DemoSection>
  );
}
