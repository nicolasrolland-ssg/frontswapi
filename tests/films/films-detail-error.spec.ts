// spec: specs/films-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Films - Fiches détaillées', () => {
  test('Gérer une erreur lors de l’ouverture d’une fiche et relancer', async ({ page }) => {
    let requestCount = 0;
    const film = {
      id: 999,
      title: 'Film restauré après erreur',
      episodeId: 99,
      director: 'Réalisateur de test',
    };

    await page.route('**/api/films/999', async (route) => {
      requestCount++;
      if (requestCount === 1) {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Film introuvable' }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(film),
      });
    });

    // 1. Intercepter GET /api/films/999 pour renvoyer HTTP 404, puis ouvrir /films/999 dans un contexte vierge.
    await page.goto('http://localhost:4200/films/999');
    const errorPanel = page.getByRole('alert');
    await expect(page.locator('app-loading')).toHaveCount(0);
    await expect(errorPanel).toBeVisible();
    await expect(errorPanel.getByRole('heading', { name: 'Signal perdu' })).toBeVisible();
    await expect(page.locator('.detail-hero')).toHaveCount(0);
    await expect(page.locator('.data-panel')).toHaveCount(0);
    const retryButton = page.getByRole('button', { name: /RELANCER LA TRANSMISSION/ });
    await expect(retryButton).toBeVisible();

    // 2. Configurer la requête suivante pour réussir, puis cliquer sur « RELANCER LA TRANSMISSION ».
    await retryButton.click();
    await expect.poll(() => requestCount).toBe(2);
    await expect(page.getByRole('heading', { name: film.title, level: 1 })).toBeVisible();
    await expect(errorPanel).toHaveCount(0);
    await expect(page.locator('.data-panel')).toBeVisible();
  });
});
