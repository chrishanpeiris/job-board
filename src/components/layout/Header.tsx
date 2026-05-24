'use client';

// ─── Header ───────────────────────────────────────────────────────────────────
// Demonstrates: useContext (Auth + Theme), conditional rendering based on auth
// state, and Next.js Link-based navigation.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/jobs',         label: 'Browse Jobs' },
  { href: '/saved',        label: 'Saved',        auth: true },
  { href: '/applications', label: 'Applications',  auth: true },
  { href: '/demo',         label: '⚛️ Demo' },
];

export function Header() {
  const { user, logout, loading } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          JobBoard
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.filter((l) => !l.auth || user).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? '☀️' : '🌙'}
          </button>

          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-gray-600 dark:text-gray-400 sm:block">
                  {user.name}
                </span>
                <Button variant="secondary" size="sm" onClick={() => void logout()}>
                  Log out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">Sign in</Button>
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
