# JobBoard — Developer Guide

A deep-dive reference for understanding the architecture, adding features, and answering interview questions about this project.

---

## 1. System overview

```
Browser
  │
  ├─ RSC pages (server-rendered, data fetched at request time)
  │     app/page.tsx, app/jobs/[id]/page.tsx, app/saved/page.tsx, app/applications/page.tsx
  │
  ├─ Client pages (interactive, TanStack Query fetches /api/*)
  │     app/jobs/page.tsx, app/login/page.tsx
  │
  └─ API routes (called by TanStack Query)
        /api/jobs         → GET job listings
        /api/jobs/[id]    → GET single job
        /api/auth/login   → POST credential login → sets httpOnly cookie
        /api/auth/logout  → POST → clears cookie
        /api/auth/me      → GET → returns session user

Server Actions (mutations, co-located with feature):
  src/lib/actions/jobs.ts         — read helpers (also called from RSC pages)
  src/lib/actions/bookmarks.ts    — toggle/get saved jobs
  src/lib/actions/applications.ts — CRUD on Application rows
```

---

## 2. Directory walkthrough

```
src/
├── app/                 Next.js App Router
│   ├── layout.tsx       Root layout — fonts, metadata, Providers wrapper
│   ├── page.tsx         Home (RSC, featured jobs via Suspense)
│   ├── globals.css      Tailwind directives + CSS custom props for dark mode
│   ├── api/             Route Handlers
│   ├── jobs/
│   │   ├── page.tsx     Client component — TanStack Query + useJobFilters
│   │   ├── loading.tsx  Suspense fallback skeleton
│   │   ├── error.tsx    Error boundary with reset()
│   │   └── [id]/page.tsx  RSC job detail + generateMetadata
│   ├── applications/page.tsx  RSC auth guard + <ApplicationBoard>
│   ├── saved/page.tsx   RSC auth guard + saved job list
│   └── login/page.tsx   Client — controlled form, useAuth().login()
│
├── components/
│   ├── ui/              Primitive components (no business logic)
│   │   ├── Button.tsx   forwardRef, variant/size props, loading spinner
│   │   ├── Badge.tsx    Pill chip + domain helpers (JobTypeBadge, StatusBadge)
│   │   ├── Modal.tsx    createPortal, Escape key, focus management
│   │   ├── Skeleton.tsx Shimmer placeholders
│   │   ├── Spinner.tsx  Accessible loading indicator
│   │   └── ErrorBoundary.tsx  Class component, getDerivedStateFromError
│   ├── jobs/
│   │   ├── JobCard.tsx  React.memo, bookmark action, compound badges
│   │   ├── JobList.tsx  IntersectionObserver infinite-scroll sentinel
│   │   ├── JobFilters.tsx  Controlled selects, clear-all button
│   │   └── JobSearch.tsx   Controlled search input
│   ├── applications/
│   │   ├── ApplicationBoard.tsx  useApplicationTracker + column layout
│   │   ├── ApplicationColumn.tsx Renders a single Kanban column
│   │   └── ApplicationCard.tsx  Notes modal + quick-move select
│   ├── layout/
│   │   ├── Header.tsx   useAuth + useTheme, active-link highlight
│   │   └── Providers.tsx  QueryClient + ThemeProvider + AuthProvider
│   └── auth/
│       └── withAuth.tsx  HOC — loading spinner → redirect if no user
│
├── context/
│   ├── AuthContext.tsx  createContext, useContext, fetch /api/auth/*
│   └── ThemeContext.tsx createContext, localStorage, prefers-color-scheme
│
├── hooks/
│   ├── useJobs.ts         TanStack Query, queryKey factory, debounced fetch
│   ├── useJobFilters.ts   useReducer + URL sync (useRouter.replace)
│   ├── useApplicationTracker.ts  useReducer + optimistic updates
│   ├── useLocalStorage.ts Generic hook, cross-tab StorageEvent sync
│   ├── useDebounce.ts     setTimeout cleanup pattern
│   ├── useIntersection.ts IntersectionObserver, once flag
│   └── useBookmarks.ts    Thin Zustand selector wrapper
│
├── lib/
│   ├── actions/           Server Actions (use server directive)
│   ├── auth.ts            jose JWT: signToken, verifyToken, cookie helpers
│   ├── db.ts              Prisma singleton (globalThis pattern)
│   └── utils.ts           cn(), formatSalary(), timeAgo()
│
├── store/
│   └── bookmarkStore.ts  Zustand + persist middleware (Set ↔ Array serialisation)
│
└── types/index.ts         All domain interfaces + discriminated union actions
```

---

## 3. Key request flows

### A. Browsing jobs (client-side with filters)

```
User types in search box
  → JobSearch calls useJobFilters().setSearch(value)
  → useJobFilters dispatches SET_SEARCH → reducer updates state
  → syncUrl() calls router.replace('/jobs?q=react')   ← URL stays in sync
  → useJobs debounces search by 300ms
  → TanStack Query fires GET /api/jobs?q=react
  → /api/jobs/route.ts calls getJobs() → Prisma WHERE clause
  → Results returned → JobList renders JobCards
  → keepPreviousData keeps old results visible while new query loads
```

### B. Viewing a job detail (RSC)

```
User clicks JobCard link → /jobs/[id]
  → Next.js renders app/jobs/[id]/page.tsx on the server
  → getJob(params.id) calls Prisma directly (no HTTP round-trip)
  → generateMetadata runs in parallel → sets <title> and og:description
  → If not found → notFound() throws → Next.js shows 404
  → HTML streamed to browser (no client JS needed for initial content)
```

### C. Login

```
User submits form
  → useAuth().login(email, password)
  → POST /api/auth/login → bcrypt.compare → signToken → setAuthCookie
  → Cookie: auth_token (httpOnly, secure in prod, 7-day maxAge)
  → Response: { user }
  → AuthContext sets user state
  → router.replace('/jobs')
```

### D. Moving an application card (optimistic UI)

```
User changes select → onMove(id, newStatus)
  → useApplicationTracker.moveApplication(id, status)
  → dispatch({ type: 'MOVE', id, status })   ← instant UI update
  → await updateApplicationStatus(id, status) (Server Action)
  → revalidatePath('/applications')
  → If server fails → console.error (in production: re-fetch to roll back)
```

---

## 4. Testing strategy (TDD)

### Unit tests (Vitest + RTL)

Tests live in `src/__tests__/` mirroring `src/`:

| File | What it tests |
|------|---------------|
| `hooks/useLocalStorage.test.ts` | Read/write/remove, cross-tab sync, error handling |
| `hooks/useJobFilters.test.ts` | Reducer actions, URL sync, URL → state hydration |
| `hooks/useApplicationTracker.test.ts` | Optimistic updates, byStatus grouping, server action calls |
| `components/JobCard.test.tsx` | Rendering, badges, salary, compact mode, bookmark button |
| `components/JobFilters.test.tsx` | Controlled inputs, onChange handlers, clear-all button |
| `components/Modal.test.tsx` | Portal rendering, Escape key, close button, aria attributes |
| `components/ApplicationBoard.test.tsx` | Column rendering, card removal, notes modal |

**Test setup** (`src/__tests__/setup.ts`):
- `@testing-library/jest-dom` matchers
- `cleanup()` after each test
- `next/navigation` mocked with `vi.fn()` so tests can override `mockReturnValue`
- `next/cache` mocked

### E2E tests (Playwright)

Run against the live dev server (`playwright.config.ts` sets `baseURL: http://localhost:3000`):

| File | Covers |
|------|--------|
| `e2e/jobs.spec.ts` | Listing page, search, filter, click-through to detail |
| `e2e/applications.spec.ts` | Login, Kanban columns, auth redirects for protected routes |

---

## 5. How to add a feature

### Add a new filter (e.g. Tech Stack filter)

1. Add `techStack: string` to `JobFilters` in `src/types/index.ts`
2. Add a `SET_TECH` case to the `FilterAction` union + `reducer` in `useJobFilters.ts`
3. Add `setTechStack` dispatcher + URL sync in `useJobFilters.ts`
4. Add a `<select>` or multi-checkbox in `JobFilters.tsx`
5. Update `getJobs()` in `src/lib/actions/jobs.ts` to filter by tech stack
6. Update `GET /api/jobs` to read the new param
7. Write a test in `useJobFilters.test.ts` for the new action

### Add a new application status

1. Add the new value to `ApplicationStatus` in `src/types/index.ts`
2. Add it to the Prisma schema comment (cosmetic — SQLite stores a string)
3. Add a column entry in `ApplicationBoard.tsx` `COLUMNS` array
4. Add a color to `STATUS_VARIANT` in `Badge.tsx`
5. Add it to the `<select>` options in `ApplicationCard.tsx`

### Add a new API route

1. Create `src/app/api/<resource>/route.ts`
2. Export `GET`, `POST`, `PUT`, `DELETE` functions
3. Use `getSession()` to guard authenticated routes
4. Return `NextResponse.json(data)` or `NextResponse.json({ error }, { status: N })`

---

## 6. Auth flow

```
Login POST /api/auth/login
  ↓ bcrypt.compare(password, hash)
  ↓ signToken({ id, email, name }) → HS256 JWT, 7d expiry
  ↓ setAuthCookie() → res.cookies.set('auth_token', token, { httpOnly: true })

Every RSC page:
  getSession() → cookies().get('auth_token') → verifyToken(token) → User | null
  if !user → redirect('/login')

AuthContext (client):
  mount → fetch /api/auth/me → getSession() → user state
  login() → POST /api/auth/login → update user state
  logout() → POST /api/auth/logout → clearAuthCookie() → user = null
```

---

## 7. Dark mode implementation

`ThemeContext.tsx`:
1. On mount, reads `localStorage.item('theme')` → `'light' | 'dark' | 'system'`
2. Resolves `'system'` via `window.matchMedia('(prefers-color-scheme: dark)')`
3. Toggles `document.documentElement.classList('dark', ...)`
4. Listens for `'change'` events on the media query when theme is `'system'`
5. `setTheme(t)` persists to localStorage + updates class

Tailwind is configured with `darkMode: 'class'` in `tailwind.config.ts`.

---

## 8. Performance decisions

| Technique | Where | Why |
|-----------|-------|-----|
| `React.memo` | `JobCard` | Prevents re-renders when parent re-renders but job data hasn't changed |
| Fine-grained Zustand selectors | `useBookmarks` | Only re-renders when this specific job's bookmark changes |
| `keepPreviousData` | `useJobs` | Keeps old list visible while new query loads (no layout shift) |
| `staleTime: 60_000` | `useJobs` | Jobs don't change every second; avoids redundant fetches on tab focus |
| `useDebounce(300ms)` | `useJobs` | Waits 300ms after typing stops before firing the query |
| `IntersectionObserver` | `JobList` | Lazy-loads more jobs only when sentinel scrolls into view |
| RSC for static pages | Home, detail, saved | Zero client JS bundle for data fetching — content streams from server |

---

## 9. Interview Q&A

**Q: Why use both Server Actions and API routes?**
A: Server Actions (`'use server'`) are used for mutations — they're co-located, type-safe, and call `revalidatePath` directly. API routes are used for client-side reads (TanStack Query needs a URL to fetch). Mixing both is intentional: RSC pages call Server Actions directly; the client-side jobs page uses TanStack Query via `/api/jobs`.

**Q: How does `useReducer` improve testability over `useState`?**
A: The reducer is a pure function — `applicationReducer(state, action)` → `newState`. Tests can import and call it directly with no React overhead. The discriminated-union `ApplicationAction` type means TypeScript catches incomplete `switch` cases at compile time.

**Q: What's the benefit of the `queryKey` factory pattern in `useJobs`?**
A: Centralising keys like `jobKeys.list(filters, sort)` means invalidation is a one-liner (`queryClient.invalidateQueries({ queryKey: jobKeys.lists() })`). It also prevents typo bugs — you never write `['jobs', 'list', ...]` as a raw string in multiple files.

**Q: How do you prevent the Zustand store from causing unnecessary re-renders?**
A: Fine-grained selectors. `useBookmarkStore(selectIsBookmarked)(jobId)` subscribes only to this specific job's bookmark status. When any other job is bookmarked, this component doesn't re-render.

**Q: Why `httpOnly` cookies for auth instead of localStorage?**
A: `httpOnly` cookies are invisible to JavaScript — XSS attacks can't steal the token. Server Components can read them directly via `cookies()` without any client JS. localStorage tokens are readable by any script on the page.

**Q: What's the HOC pattern good for vs hooks?**
A: HOCs (`withAuth`) are useful for cross-cutting concerns applied to whole page components. A hook (`useAuth`) handles logic inside a component but can't conditionally render a redirect. The HOC wraps the component and adds the auth guard before the component even renders, which is cleaner for protected pages.
