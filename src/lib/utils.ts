import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for conditional Tailwind class merging */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a salary number into a human-readable string */
export function formatSalary(amount: number | null, _type?: string): string {
  if (amount === null) return '';
  // Hourly (CONTRACT / INTERNSHIP with small amounts)
  if (amount < 1000) return `$${amount}/hr`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a salary range into a display string */
export function formatSalaryRange(min: number | null, max: number | null): string {
  if (!min && !max) return 'Salary not listed';
  if (min && max)   return `${formatSalary(min)} – ${formatSalary(max)}`;
  if (min)          return `From ${formatSalary(min)}`;
  return `Up to ${formatSalary(max)}`;
}

/** Return a relative time string (e.g. "3 days ago") */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days  = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}
