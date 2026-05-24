// ─── Badge ────────────────────────────────────────────────────────────────────
// Simple pill chip for job type / status labels.

import { cn } from '@/lib/utils';
import type { JobType, ApplicationStatus } from '@/types';

type BadgeVariant = 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';

interface BadgeProps {
  children:  React.ReactNode;
  variant?:  BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  blue:    'bg-blue-100  text-blue-800  dark:bg-blue-900  dark:text-blue-300',
  green:   'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  yellow:  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  red:     'bg-red-100  text-red-800  dark:bg-red-900  dark:text-red-300',
  purple:  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ── Domain-specific badge helpers ─────────────────────────────────────────────

const JOB_TYPE_VARIANT: Record<JobType, BadgeVariant> = {
  FULL_TIME:  'blue',
  PART_TIME:  'purple',
  CONTRACT:   'yellow',
  INTERNSHIP: 'green',
};

const JOB_TYPE_LABEL: Record<JobType, string> = {
  FULL_TIME:  'Full Time',
  PART_TIME:  'Part Time',
  CONTRACT:   'Contract',
  INTERNSHIP: 'Internship',
};

export function JobTypeBadge({ type }: { type: JobType }) {
  return <Badge variant={JOB_TYPE_VARIANT[type]}>{JOB_TYPE_LABEL[type]}</Badge>;
}

const STATUS_VARIANT: Record<ApplicationStatus, BadgeVariant> = {
  SAVED:        'default',
  APPLIED:      'blue',
  INTERVIEWING: 'yellow',
  OFFER:        'green',
  REJECTED:     'red',
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
