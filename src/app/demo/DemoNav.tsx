'use client';

// ─── DemoNav ──────────────────────────────────────────────────────────────────
// Sticky sidebar navigation for the /demo page.
// Uses IntersectionObserver to highlight the active section as you scroll.

import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'usestate',          label: 'useState',          badge: 'Hook',             color: 'blue'   },
  { id: 'useeffect',         label: 'useEffect',         badge: 'Hook',             color: 'blue'   },
  { id: 'usereducer',        label: 'useReducer',        badge: 'Hook',             color: 'blue'   },
  { id: 'useref',            label: 'useRef',            badge: 'Hook',             color: 'blue'   },
  { id: 'usecallbackmemo',   label: 'useCallback/Memo',  badge: 'Optimisation',     color: 'purple' },
  { id: 'usecontext',        label: 'useContext',        badge: 'Hook',             color: 'blue'   },
  { id: 'reactmemo',         label: 'React.memo',        badge: 'Optimisation',     color: 'purple' },
  { id: 'forwardref',        label: 'forwardRef',        badge: 'Advanced Pattern', color: 'orange' },
  { id: 'portal',            label: 'createPortal',      badge: 'Advanced Pattern', color: 'orange' },
  { id: 'errorboundary',     label: 'Error Boundary',    badge: 'Class Component',  color: 'red'    },
  { id: 'hoc',               label: 'HOC',               badge: 'Advanced Pattern', color: 'orange' },
  { id: 'customhooks',       label: 'Custom Hooks',      badge: 'Composition',      color: 'green'  },
] as const;

const DOT_COLOURS: Record<string, string> = {
  blue:   'bg-blue-500',
  purple: 'bg-purple-500',
  green:  'bg-green-500',
  orange: 'bg-orange-500',
  red:    'bg-red-500',
};

export function DemoNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <nav className="sticky top-24 space-y-0.5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2">
          On this page
        </p>
        {SECTIONS.map(({ id, label, color }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={[
                'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
                isActive
                  ? 'bg-gray-100 font-medium text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
              ].join(' ')}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_COLOURS[color]}`} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
