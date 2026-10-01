// spec: specs/films-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Films - Fiches détaillées', () => {
  test('Ouvrir une fiche depuis l’index puis revenir à la liste', async ({ page }) => {
    // 1. Avec au moins un film disponible, ouvrir /films dans un contexte vierge puis sélectionner « INSPECTER » sur sa carte.
    await page.goto('http://localhost:4200/films');
    const firstCard = page.locator('.record-card').first();
    await expect(firstCard).toBeVisible();
    const filmUrl = await firstCard.getAttribute('href');
    const filmTitle = await firstCard.locator('h2').textContent();
    expect(filmUrl).toBeTruthy();
    expect(filmTitle).toBeTruthy();

    await firstCard.click();
    await expect(page).toHaveURL(new RegExp(`${filmUrl}$`));
    await expect(page.getByRole('heading', { name: filmTitle!, level: 1 })).toBeVisible();
    await expect(page.locator('.data-panel')).toBeVisible();

    // 2. Cliquer sur « RETOUR À L’INDEX ».
    await page.getByRole('link', { name: "← RETOUR À L'INDEX" }).click();
    await expect(page).toHaveURL(/\/films$/);
    await expect(page.getByRole('heading', { name: 'Films', level: 1 })).toBeVisible();
    await expect(page.locator('.record-card').first()).toBeVisible();
  });
});
