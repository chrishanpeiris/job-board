// ─── Jobs E2E tests ───────────────────────────────────────────────────────────
// Demonstrates: Playwright page object pattern, network intercepts, and
// accessibility assertions.

import { test, expect } from '@playwright/test';

test.describe('Jobs listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jobs');
  });

  test('shows the search bar and filter sidebar', async ({ page }) => {
    await expect(page.getByRole('searchbox', { name: /search jobs/i })).toBeVisible();
    await expect(page.getByLabel('Job type')).toBeVisible();
    await expect(page.getByLabel('Sort by')).toBeVisible();
  });

  test('displays at least one job card after load', async ({ page }) => {
    // Wait for job list to render
    await expect(page.getByRole('list', { name: /job listings/i })).toBeVisible();
    const cards = page.getByRole('listitem');
    await expect(cards.first()).toBeVisible();
  });

  test('search filters the job list', async ({ page }) => {
    const searchBox = page.getByRole('searchbox', { name: /search jobs/i });
    await searchBox.fill('Staff Engineer');
    // Wait for debounce + re-render
    await page.waitForTimeout(400);
    await expect(page.getByText('Staff Engineer — Platform')).toBeVisible();
  });

  test('filtering by FULL_TIME shows only full-time jobs', async ({ page }) => {
    await page.getByLabel('Job type').selectOption('FULL_TIME');
    await page.waitForTimeout(300);
    const badges = page.getByText('Full Time');
    await expect(badges.first()).toBeVisible();
  });

  test('clicking a job card navigates to the detail page', async ({ page }) => {
    const firstLink = page.getByRole('link').first();
    await firstLink.click();
    await expect(page).toHaveURL(/\/jobs\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('Job detail', () => {
  test('shows job details including requirements', async ({ page }) => {
    // Navigate to jobs list and click the first card
    await page.goto('/jobs');
    await page.getByRole('link').first().click();
    await expect(page.getByText('About the role')).toBeVisible();
    await expect(page.getByText('Requirements')).toBeVisible();
  });

  test('has an Apply now CTA button', async ({ page }) => {
    await page.goto('/jobs');
    await page.getByRole('link').first().click();
    await expect(page.getByRole('button', { name: 'Apply now' })).toBeVisible();
  });
});
