# Job Board — Testing Guide

**Stack:** Vitest + React Testing Library + jest-dom + Playwright

---

## Commands

```bash
npm test                  # Run all unit tests once
npm run test:watch        # Watch mode — re-runs on every save
npm run test:coverage     # Coverage report (opens HTML in coverage/)
npm run test:e2e          # Playwright E2E (requires dev server running)
npm run test:e2e:ui       # Playwright with interactive UI
```

---

## How it's wired up

```
vitest.config.ts
  ├── environment: 'jsdom'          — fake browser for React components
  ├── setupFiles: setup.ts          — jest-dom matchers + Next.js mocks
  └── include: src/**/*.test.*      — only picks up files under src/
```

`src/__tests__/setup.ts` runs before every test file:
- Imports `@testing-library/jest-dom` (adds `.toBeInTheDocument()` etc.)
- Calls `cleanup()` after each test (unmounts components)
- Mocks `next/navigation` with `vi.fn()` so tests can control routing
- Mocks `next/cache` (revalidatePath / revalidateTag are no-ops)

---

## The three tools

| Tool | What it does |
|---|---|
| **Vitest** | Finds test files, runs them, reports pass/fail |
| **React Testing Library** | Renders components into jsdom, queries the DOM |
| **jest-dom** | Extra assertions: `toBeInTheDocument`, `toHaveAttribute`, `toHaveClass` |

---

## Test file locations

Mirror `src/` under `src/__tests__/`:

```
src/hooks/useDebounce.ts           →  src/__tests__/hooks/useDebounce.test.ts
src/components/ui/Button.tsx       →  src/__tests__/components/Button.test.tsx
src/lib/utils.ts                   →  src/__tests__/lib/utils.test.ts
```

---

## Pattern 1 — Pure function (simplest)

```ts
// src/__tests__/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatSalaryRange, timeAgo } from '@/lib/utils';

describe('formatSalaryRange', () => {
  it('formats a full range', () => {
    expect(formatSalaryRange(100000, 150000)).toBe('$100,000 – $150,000');
  });

  it('returns "Salary not listed" when both are null', () => {
    expect(formatSalaryRange(null, null)).toBe('Salary not listed');
  });

  it('formats hourly rates (small numbers)', () => {
    expect(formatSalaryRange(80, 120)).toBe('$80/hr – $120/hr');
  });
});
```

---

## Pattern 2 — Custom hook

Use `renderHook` to mount the hook. Wrap state updates in `act()`.

```ts
// src/__tests__/hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('updates after the delay elapses', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'first' } },
    );

    rerender({ value: 'second' });
    expect(result.current).toBe('first'); // still old value

    await act(() => new Promise((r) => setTimeout(r, 150)));
    expect(result.current).toBe('second'); // now updated
  });
});
```

**Key API:**

| API | Purpose |
|---|---|
| `result.current` | The hook's current return value |
| `act(() => ...)` | Wraps anything that causes a state update |
| `rerender({ newProp })` | Re-renders with new props |

---

## Pattern 3 — React component

```tsx
// src/__tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

**Most useful `screen` queries:**

| Query | Use when |
|---|---|
| `getByText('...')` | Exactly one element with that text |
| `getByRole('button', { name: /save/i })` | By ARIA role + accessible name |
| `getByLabel('Email')` | Input linked to a `<label>` |
| `queryByText('...')` | Checking something is **not** there (returns null) |
| `findByText('...')` | Async — waits for element to appear |

---

## Pattern 4 — Component that needs a provider

Some components use TanStack Query or Zustand. Wrap them in a `wrapper`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

it('renders job title', () => {
  render(<JobCard job={makeJob()} />, { wrapper });
  expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
});
```

---

## Pattern 5 — Mocking

### Mock a whole module
```ts
vi.mock('@/lib/actions/applications', () => ({
  updateApplicationStatus: vi.fn().mockResolvedValue(undefined),
  deleteApplication:       vi.fn().mockResolvedValue(undefined),
}));
```

### Mock a function and assert it was called
```ts
const onClose = vi.fn();
render(<Modal open onClose={onClose}>Content</Modal>);
fireEvent.keyDown(document, { key: 'Escape' });
expect(onClose).toHaveBeenCalledOnce();
```

### Override the Next.js router per test
```ts
import { useRouter } from 'next/navigation'; // already mocked in setup.ts

const mockReplace = vi.fn();
beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({ replace: mockReplace, push: vi.fn(), back: vi.fn() });
});

it('redirects after save', () => {
  // ...trigger the action...
  expect(mockReplace).toHaveBeenCalledWith('/jobs');
});
```

### Reset between tests
```ts
beforeEach(() => vi.clearAllMocks());  // clears call counts, keeps mock implementation
// or
beforeEach(() => vi.resetAllMocks());  // also resets return values
```

---

## Pattern 6 — Async component behaviour

```tsx
import { waitFor, findByText } from '@testing-library/react';

it('shows notes modal after clicking Add notes', async () => {
  render(<ApplicationBoard initialApplications={[makeApp()]} />);

  fireEvent.click(await screen.findByText('Add notes'));

  expect(await screen.findByText('Application notes')).toBeInTheDocument();
});

// waitFor — keeps retrying the assertion until it passes or times out
it('removes card after clicking Remove', async () => {
  render(<ApplicationBoard initialApplications={[makeApp()]} />);
  fireEvent.click(screen.getByText('Remove'));
  await waitFor(() => {
    expect(screen.queryByText('React Engineer')).not.toBeInTheDocument();
  });
});
```

---

## E2E tests (Playwright)

E2E tests live in `e2e/` and run against the **live dev server**.

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run test:e2e
```

```ts
// e2e/jobs.spec.ts
import { test, expect } from '@playwright/test';

test('search filters the job list', async ({ page }) => {
  await page.goto('/jobs');
  await page.getByRole('searchbox').fill('Staff Engineer');
  await page.waitForTimeout(400); // wait for debounce
  await expect(page.getByText('Staff Engineer — Platform')).toBeVisible();
});
```

`playwright.config.ts` sets `baseURL: 'http://localhost:3000'` — all `page.goto('/path')` calls are relative to that.

---

## TDD workflow

```bash
npm run test:watch
```

1. Write the test → it fails (red)
2. Write the code to make it pass (green)
3. Refactor — tests guard against regressions

This is exactly how all hooks and components in this project were built.

---

## What's already tested

| File | Tests |
|---|---|
| `useLocalStorage` | Read, write, remove, cross-tab sync, JSON errors |
| `useJobFilters` | All filter actions, URL sync, URL → state hydration |
| `useApplicationTracker` | Optimistic updates, grouping by status, server action calls |
| `JobCard` | Rendering, badges, salary format, compact mode, bookmark button |
| `JobFilters` | All onChange handlers, clear-all visibility |
| `Modal` | Portal, Escape key, close button, ARIA attributes |
| `ApplicationBoard` | Column rendering, card removal, notes modal |
