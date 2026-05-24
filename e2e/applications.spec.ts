// ─── Applications E2E tests ───────────────────────────────────────────────────
import { test, expect, type Page } from '@playwright/test';

// Helper: log in as demo user
async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill('demo@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('/jobs');
}

test.describe('Authentication', () => {
  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('successful login redirects to /jobs', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL('/jobs');
  });
});

test.describe('Applications board (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('navigates to applications page from header', async ({ page }) => {
    await page.getByRole('link', { name: 'Applications' }).click();
    await expect(page).toHaveURL('/applications');
    await expect(page.getByRole('heading', { name: /my applications/i })).toBeVisible();
  });

  test('shows the 5 Kanban columns', async ({ page }) => {
    await page.goto('/applications');
    for (const col of ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected']) {
      await expect(page.getByText(col).first()).toBeVisible();
    }
  });

  test('saved jobs page is accessible when logged in', async ({ page }) => {
    await page.goto('/saved');
    await expect(page.getByRole('heading', { name: /saved jobs/i })).toBeVisible();
  });
});

test.describe('Protected routes (unauthenticated)', () => {
  test('redirects /applications to /login', async ({ page }) => {
    await page.goto('/applications');
    await expect(page).toHaveURL('/login');
  });

  test('redirects /saved to /login', async ({ page }) => {
    await page.goto('/saved');
    await expect(page).toHaveURL('/login');
  });
});
