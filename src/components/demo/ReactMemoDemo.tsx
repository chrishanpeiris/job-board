'use client';

import { useState, memo, useCallback } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';

// ── Track render counts without useRef (ref values don't display reactively) ──
// We use a module-level map so mutation doesn't trigger re-renders.
const renderCounts: Record<string, number> = {};

function bump(id: string) {
  renderCounts[id] = (renderCounts[id] ?? 0) + 1;
  return renderCounts[id];
}

// ── Non-memoised child — re-renders every time parent re-renders ──────────────
function NaiveChild({ label, onAction }: { label: string; onAction: () => void }) {
  const n = bump('naive');
  return (
    <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
      <div>
        <p className="text-xs font-medium text-red-700 dark:text-red-400">❌ No memo</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{label}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">renders: <b className="text-red-600">{n}</b></span>
        <Button variant="secondary" size="sm" onClick={onAction}>Action</Button>
      </div>
    </div>
  );
}

// ── Memoised child — only re-renders when its own props change ────────────────
const MemoChild = memo(function MemoChild({
  label,
  onAction,
}: {
  label: string;
  onAction: () => void;
}) {
  const n = bump('memo');
  return (
    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
      <div>
        <p className="text-xs font-medium text-green-700 dark:text-green-400">✅ React.memo</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{label}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">renders: <b className="text-green-600">{n}</b></span>
        <Button variant="secondary" size="sm" onClick={onAction}>Action</Button>
      </div>
    </div>
  );
});

export function ReactMemoDemo() {
  const [parentCount, setParentCount] = useState(0);
  const [actionCount, setActionCount] = useState(0);

  // Stable handler — memo child won't re-render because of this
  const stableAction = useCallback(() => setActionCount((c) => c + 1), []);

  // Unstable handler — new reference every render, breaks memo
  const unstableAction = () => setActionCount((c) => c + 1);

  return (
    <DemoSection
      id="reactmemo"
      title="React.memo"
      badge="Performance"
      badgeColor="purple"
      usedIn="JobCard"
      description="Wraps a component so it only re-renders when its own props change (shallow comparison). Without memo, every parent re-render cascades down — even if the child's data didn't change. Must pair with useCallback for function props."
    >
      <div className="demo-card">
        <p className="demo-label">Re-render the parent — watch the render counts</p>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Parent renders: <b className="text-gray-900 dark:text-white">{parentCount}</b> ·
          Action clicks: <b className="text-gray-900 dark:text-white">{actionCount}</b>
        </p>
        <div className="space-y-2">
          <NaiveChild label="Re-renders with parent" onAction={unstableAction} />
          <MemoChild  label="Skips render — props unchanged" onAction={stableAction} />
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
          Note: page re-mounts on navigation, so render counts reset each visit
        </p>
      </div>

      <CodeBlock>{`// Wrap with memo — shallow-compares props before re-rendering
const JobCard = memo(function JobCard({ job, onBookmark }) {
  return <div>...</div>;
});

// MUST pair with useCallback for function props —
// otherwise a new function reference breaks memo on every render
const handleBookmark = useCallback((id) => {
  toggle(id);
}, [toggle]);`}</CodeBlock>
    </DemoSection>
  );
}
