// ─── Root Layout (RSC) ────────────────────────────────────────────────────────
// Demonstrates: App Router layout, metadata API, font optimisation, and the
// Providers wrapper pattern (client providers in a separate component so this
// file stays a Server Component).

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import { Header } from '@/components/layout/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title:       { default: 'JobBoard', template: '%s | JobBoard' },
  description: 'Find your next engineering role',
  openGraph: {
    title:       'JobBoard',
    description: 'Find your next engineering role',
    type:        'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
