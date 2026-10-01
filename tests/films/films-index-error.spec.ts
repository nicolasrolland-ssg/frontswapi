// spec: specs/films-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Films - Index et recherche', () => {
  test('Gérer une erreur de chargement de l’index et relancer', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/api/films**', async (route) => {
      requestCount++;
      if (requestCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Erreur de test' }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, title: 'A New Hope', episodeId: 4, director: 'George Lucas' },
        ]),
      });
    });

    // 1. Intercepter GET /api/films pour renvoyer une erreur HTTP 500 lors de la première requête, puis configurer la requête suivante pour réussir; ouvrir /films.
    await page.goto('http://localhost:4200/films');
    const errorPanel = page.getByRole('alert');
    await expect(page.locator('app-loading')).toHaveCount(0);
    await expect(errorPanel).toBeVisible();
    await expect(errorPanel.getByRole('heading', { name: 'Signal perdu' })).toBeVisible();
    const retryButton = page.getByRole('button', { name: /RELANCER LA TRANSMISSION/ });
    await expect(retryButton).toBeVisible();

    // 2. Cliquer sur « RELANCER LA TRANSMISSION ».
    await retryButton.click();
    await expect.poll(() => requestCount).toBe(2);
    await expect(errorPanel).toHaveCount(0);
    await expect(page.locator('.record-card')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'A New Hope', level: 2 })).toBeVisible();
  });
});
