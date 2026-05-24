// ─── /demo — React Concepts Showcase ─────────────────────────────────────────
// Server Component page. All interactive demos are 'use client' components.
// This page exists purely to show interviewers every React concept used in the
// job-board in isolation — no data fetching, no auth required.

import type { Metadata } from 'next';
import { DemoNav }             from './DemoNav';
import { UseStateDemo }        from '@/components/demo/UseStateDemo';
import { UseEffectDemo }       from '@/components/demo/UseEffectDemo';
import { UseReducerDemo }      from '@/components/demo/UseReducerDemo';
import { UseRefDemo }          from '@/components/demo/UseRefDemo';
import { UseCallbackMemoDemo } from '@/components/demo/UseCallbackMemoDemo';
import { UseContextDemo }      from '@/components/demo/UseContextDemo';
import { ReactMemoDemo }       from '@/components/demo/ReactMemoDemo';
import { ForwardRefDemo }      from '@/components/demo/ForwardRefDemo';
import { PortalDemo }          from '@/components/demo/PortalDemo';
import { ErrorBoundaryDemo }   from '@/components/demo/ErrorBoundaryDemo';
import { HOCDemo }             from '@/components/demo/HOCDemo';
import { CustomHooksDemo }     from '@/components/demo/CustomHooksDemo';

export const metadata: Metadata = {
  title:       'React Concepts Demo',
  description: 'Interactive showcase of every React pattern used in JobBoard — useState, useReducer, custom hooks, HOCs, Error Boundaries, Portals, and more.',
};

export default function DemoPage() {
  return (
    <div className="flex gap-8">
      {/* ── Sticky sidebar nav ─────────────────────────────────────── */}
      <DemoNav />

      {/* ── Main content ───────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-8">
        {/* Page header */}
        <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚛️</span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              React Concepts
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            Every React pattern used in this codebase — demonstrated in isolation with live
            interactions and annotated source code. Use the sidebar to jump to any section.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {[
              { label: 'Hook', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
              { label: 'Optimisation', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
              { label: 'Composition', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
              { label: 'Advanced Pattern', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' },
              { label: 'Class Component', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
            ].map(({ label, color }) => (
              <span key={label} className={`inline-flex items-center rounded-full px-2.5 py-1 font-semibold ${color}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Demo sections ───────────────────────────────────────── */}
        <UseStateDemo />
        <UseEffectDemo />
        <UseReducerDemo />
        <UseRefDemo />
        <UseCallbackMemoDemo />
        <UseContextDemo />
        <ReactMemoDemo />
        <ForwardRefDemo />
        <PortalDemo />
        <ErrorBoundaryDemo />
        <HOCDemo />
        <CustomHooksDemo />

        {/* Footer note */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/40 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
          <p className="font-semibold mb-1">📖 About this page</p>
          <p>
            Each demo is a self-contained client component. The <strong>source code</strong> shown
            below each demo is the real implementation — not a mockup. See{' '}
            <code className="rounded bg-blue-100 px-1.5 py-0.5 text-xs dark:bg-blue-900/40">
              src/components/demo/
            </code>{' '}
            for all files.
          </p>
        </div>
      </div>
    </div>
  );
}
