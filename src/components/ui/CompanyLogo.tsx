'use client';

// ─── CompanyLogo ──────────────────────────────────────────────────────────────
// Tries to load the remote logo; on any load error falls back to a letter
// avatar. This is necessary because external logo APIs (e.g. Clearbit) can be
// unreliable — the logo URL exists but the request fails at runtime.

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  name:       string;
  logo:       string | null;
  size?:      number;   // px — used for both width/height and sizes hint
  className?: string;
}

export function CompanyLogo({ name, logo, size = 48, className }: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);

  const showLetter = !logo || imgError;

  return (
    <div
      className={cn(
        'relative flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50',
        'dark:border-gray-600 dark:bg-gray-700',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showLetter ? (
        <span
          className="flex h-full w-full items-center justify-center font-bold text-gray-400 dark:text-gray-500"
          style={{ fontSize: size * 0.4 }}
          aria-label={name}
        >
          {name[0].toUpperCase()}
        </span>
      ) : (
        <Image
          src={logo}
          alt={`${name} logo`}
          fill
          className="object-contain p-1"
          sizes={`${size}px`}
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
