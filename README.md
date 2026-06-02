# JobBoard

A full-stack job board application built with Next.js 14, TypeScript, and Prisma. This project is a portfolio showcase covering advanced React patterns, TypeScript, TDD, performance, and modern server-rendering techniques.

## Tech Stack

| Layer          | Choice                         |
| -------------- | ------------------------------ |
| Framework      | Next.js 14 (App Router)        |
| Language       | TypeScript (strict)            |
| Styling        | Tailwind CSS                   |
| Database       | SQLite + Prisma ORM            |
| Auth           | JWT (jose) + httpOnly cookies  |
| State (client) | TanStack Query v5 + Zustand v5 |
| Tests (unit)   | Vitest + React Testing Library |
| Tests (e2e)    | Playwright                     |

## React/TypeScript concepts demonstrated

1. **Hooks** : `useState`, `useEffect`, `useReducer`, `useCallback`, `useMemo`, `useRef`, custom hooks
2. **Advanced patterns** : HOC (`withAuth`), render props, compound components, Portal (`Modal`)
3. **Performance** : `React.memo`, fine-grained Zustand selectors, debounced search, `keepPreviousData`
4. **Context** : `AuthContext`, `ThemeContext` (dark mode + system preference)
5. **TypeScript** : discriminated unions, generic hooks, `forwardRef`, strict typing throughout
6. **RSC & Server Actions** : Server Components, `generateMetadata`, `notFound()`, Server Actions with auth guard
7. **Streaming** : `Suspense` + `loading.tsx` + `error.tsx` boundaries
8. **TDD** : tests written alongside hooks and components; 51 unit tests passing

## Getting started

```bash
npm install
cp .env.example .env.local

# Push schema and seed demo data
DATABASE_URL="file:./dev.db" npx prisma db push
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo credentials**: `demo@example.com` / `password123`

## Commands

| Command                 | Description                       |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Start Next.js dev server          |
| `npm test`              | Run Vitest unit tests             |
| `npm run test:watch`    | Watch mode                        |
| `npm run test:coverage` | Coverage report                   |
| `npm run test:e2e`      | Playwright E2E (needs dev server) |
| `npm run typecheck`     | TypeScript type check             |
| `npm run db:seed`       | Re-seed the database              |
| `npm run db:studio`     | Open Prisma Studio                |

## Project structure

```
src/
├── app/               # Next.js App Router pages & API routes
│   ├── api/           # Route handlers (jobs, auth)
│   ├── jobs/          # Listing + [id] detail
│   ├── applications/  # Kanban board
│   ├── saved/         # Bookmarked jobs
│   └── login/         # Auth page
├── components/
│   ├── ui/            # Button, Badge, Modal, Skeleton, ErrorBoundary
│   ├── jobs/          # JobCard (memo), JobList, JobFilters, JobSearch
│   ├── applications/  # ApplicationBoard, ApplicationColumn, ApplicationCard
│   ├── layout/        # Header, Providers
│   └── auth/          # withAuth HOC
├── context/           # AuthContext, ThemeContext
├── hooks/             # All custom hooks
├── lib/
│   ├── actions/       # Server Actions (jobs, bookmarks, applications)
│   ├── auth.ts        # JWT + cookie helpers
│   ├── db.ts          # Prisma singleton
│   └── utils.ts       # cn(), formatSalary(), timeAgo()
├── store/             # Zustand bookmark store
└── types/             # Shared domain types
```

## Key architecture decisions

- **RSC + Client hybrid**: Server Components fetch data (faster TTFB, no waterfall), Client Components own interactivity.
- **Server Actions** over API routes for mutations: co-located, type-safe, revalidatePath built-in.
- **TanStack Query** for client-side caching: staleTime + keepPreviousData prevents UI flicker during filter changes.
- **Zustand** for bookmarks only: ephemeral client state that doesn't need server persistence.
- **useReducer** for complex state (`useApplicationTracker`, `useJobFilters`): explicit action types make state machines testable.
