// spec: specs/films-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Films - Index et recherche', () => {
  test('Parcourir les pages de l’index et vérifier les bornes', async ({ page }) => {
    const records = Array.from({ length: 25 }, (_, index) => ({
      id: index + 1,
      title: `Film ${index + 1}`,
      episodeId: index + 1,
      director: 'Director',
    }));

    await page.route('**/api/films**', async (route) => {
      const requestUrl = new URL(route.request().url());
      const pageNumber = Number(requestUrl.searchParams.get('page') ?? 0);
      const pageSize = Number(requestUrl.searchParams.get('size') ?? 12);
      const content = records.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ content, totalElements: records.length }),
      });
    });

    // 1. Préparer une réponse API de plus de 12 films, puis ouvrir /films dans un contexte vierge.
    await page.goto('http://localhost:4200/films');
    const cards = page.locator('.record-card');
    const previous = page.getByRole('button', { name: /PRÉCÉDENT/ });
    const next = page.getByRole('button', { name: /SUIVANT/ });
    await expect(cards).toHaveCount(12);
    await expect(page.getByText('PAGE 1')).toBeVisible();
    await expect(previous).toBeDisabled();
    await expect(next).toBeEnabled();
    const firstPageTitles = await cards.locator('h2').allTextContents();

    // 2. Cliquer sur « Suivant » et attendre la réponse correspondant à la page suivante.
    await next.click();
    await expect(page.getByText('PAGE 2')).toBeVisible();
    await expect(cards).toHaveCount(12);
    await expect(previous).toBeEnabled();
    const secondPageTitles = await cards.locator('h2').allTextContents();
    expect(new Set([...firstPageTitles, ...secondPageTitles]).size).toBe(24);

    // 3. Cliquer sur « Précédent », puis avancer jusqu’à la dernière page et vérifier les commandes.
    await previous.click();
    await expect(page.getByText('PAGE 1')).toBeVisible();
    await expect(cards.locator('h2')).toHaveText(firstPageTitles);
    await next.click();
    await expect(page.getByText('PAGE 2')).toBeVisible();
    await next.click();
    await expect(page.getByText('PAGE 3')).toBeVisible();
    await expect(cards).toHaveCount(1);
    await expect(cards.locator('h2')).toHaveText('Film 25');
    await expect(next).toBeDisabled();
    const finalPageTitle = await cards.locator('h2').textContent();
    await expect(page.getByText('PAGE 3')).toBeVisible();
    expect(await cards.locator('h2').textContent()).toBe(finalPageTitle);
  });
});
