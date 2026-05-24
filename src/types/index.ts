// ─── Domain types ──────────────────────────────────────────────────────────────

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

export type ApplicationStatus =
  | 'SAVED'
  | 'APPLIED'
  | 'INTERVIEWING'
  | 'OFFER'
  | 'REJECTED';

export interface Company {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
}

export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  remote: boolean;
  type: JobType;
  salaryMin: number | null;
  salaryMax: number | null;
  description: string;
  requirements: string[];
  techStack: string[];
  featured: boolean;
  createdAt: string;
  expiresAt: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Application {
  id: string;
  job: Job;
  status: ApplicationStatus;
  notes: string | null;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Filter / search types ────────────────────────────────────────────────────

export interface JobFilters {
  search: string;
  type: JobType | '';
  remote: boolean | null;
  location: string;
}

export type JobSortKey = 'newest' | 'salary' | 'featured';

// ─── Application board action types ───────────────────────────────────────────
// Used with useReducer in ApplicationBoard — explicit action types make the
// state machine self-documenting and testable.

export type ApplicationAction =
  | { type: 'MOVE';   id: string; status: ApplicationStatus }
  | { type: 'UPDATE_NOTES'; id: string; notes: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_ALL'; applications: Application[] };

// ─── API response types ───────────────────────────────────────────────────────

export interface JobsResponse {
  jobs: Job[];
  total: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
