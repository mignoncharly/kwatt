import { expect, test } from '@playwright/test';

test('web shell and health route are reachable', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Community Assistance' })).toBeVisible();

  const response = await request.get('/api/health');
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ status: 'ok' });
});
