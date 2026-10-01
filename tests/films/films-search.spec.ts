// spec: specs/films-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Films - Index et recherche', () => {
  test('Rechercher un film sans tenir compte de la casse ou des espaces', async ({ page }) => {
    // 1. Ouvrir /films avec un jeu de données contenant un titre connu, puis saisir dans le champ « Rechercher un film » ce titre entouré d’espaces et avec une casse différente.
    await page.goto('http://localhost:4200/films');
    const searchbox = page.getByRole('searchbox', { name: 'Rechercher un film' });
    const cards = page.locator('.record-card');
    await expect(cards.first()).toBeVisible();
    const initialTitles = await cards.locator('h2').allTextContents();
    const knownTitle = initialTitles[0];
    expect(knownTitle).toBeTruthy();

    await searchbox.fill(`  ${knownTitle.toUpperCase()}  `);
    await expect(cards).toHaveCount(1);
    await expect(cards.locator('h2')).toHaveText(knownTitle);
    await expect(page.locator('.result-count')).toContainText('1 SIGNATURES');
    await expect(page.getByText('PAGE 1')).toBeVisible();

    // 2. Remplacer le texte par un terme sans correspondance.
    await searchbox.fill('aucun film de cette galaxie');
    await expect(cards).toHaveCount(0);
    await expect(page.getByText('AUCUNE SIGNATURE DETECTEE')).toBeVisible();
    await expect(page.locator('.result-count')).toContainText('0 SIGNATURES');
    await expect(page.getByRole('alert')).toHaveCount(0);

    // 3. Effacer le champ de recherche.
    await searchbox.fill('');
    await expect(cards.locator('h2')).toHaveText(initialTitles);
    await expect(page.locator('.result-count')).toContainText(`${initialTitles.length} SIGNATURES`);
    await expect(page.getByText('PAGE 1')).toBeVisible();
  });
});
