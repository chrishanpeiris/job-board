'use client';

// ─── DemoShell ────────────────────────────────────────────────────────────────
// Shared wrapper components used by every demo section on /demo.
// DemoSection renders the section chrome (badge, title, description, "used in").
// CodeBlock renders a syntax-highlighted (via CSS) code snippet.

import type { ReactNode } from 'react';

// ── Badge colour map ──────────────────────────────────────────────────────────

const BADGE_COLOURS: Record<string, string> = {
  blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  green:  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  red:    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  gray:   'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

// ── DemoSection ───────────────────────────────────────────────────────────────

interface DemoSectionProps {
  id:          string;
  title:       string;
  badge:       string;
  badgeColor?: string;
  usedIn?:     string;
  description: string;
  children:    ReactNode;
}

export function DemoSection({
  id,
  title,
  badge,
  badgeColor = 'gray',
  usedIn,
  description,
  children,
}: DemoSectionProps) {
  const badgeCls = BADGE_COLOURS[badgeColor] ?? BADGE_COLOURS.gray;

  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Header row */}
      <div className="mb-4 flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeCls}`}>
              {badge}
            </span>
          </div>
          {usedIn && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              <span className="font-medium text-gray-500 dark:text-gray-400">Used in:</span>{' '}
              {usedIn}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {description}
      </p>

      {/* Demo content */}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

// ── CodeBlock ─────────────────────────────────────────────────────────────────

export function CodeBlock({ children }: { children: string }) {
  return (
    <div className="relative rounded-xl bg-gray-950 dark:bg-gray-900">
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 border-b border-gray-800">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-gray-500 font-mono">TypeScript</span>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="text-gray-300 font-mono whitespace-pre">{children}</code>
      </pre>
    </div>
  );
}
