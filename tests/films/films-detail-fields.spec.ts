// spec: specs/films-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Films - Fiches détaillées', () => {
  test('Afficher les propriétés disponibles sur une fiche film', async ({ page }) => {
    const film = {
      id: 42,
      title: 'Film de test',
      episodeId: 9,
      director: 'Réalisatrice de test',
      producer: null,
      releaseDate: '',
      openingCrawl: 'Une transmission de test.',
      characters: ['/people/1', '/people/2'],
      planets: [],
      starships: [],
      vehicles: [],
      species: [],
      url: 'https://example.test/films/42',
      created: '2026-01-01',
      edited: '2026-02-01',
      extraField: 'Cette propriété dépasse la limite.',
    };

    await page.route('**/api/films/42', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(film),
      });
    });

    // 1. Intercepter GET /api/films/42 avec une réponse contenant un titre, des propriétés simples, une valeur nulle, une chaîne vide et un tableau de relations; ouvrir directement /films/42.
    await page.goto('http://localhost:4200/films/42');
    await expect(page.getByRole('heading', { name: film.title, level: 1 })).toBeVisible();
    const specifications = page.locator('.data-panel');
    await expect(specifications.getByText('SPECIFICATIONS')).toBeVisible();
    const fieldNames = await specifications.locator('dt').allTextContents();
    expect(fieldNames).not.toContain('id');
    expect(fieldNames).not.toContain('title');
    await expect(specifications.getByText('—', { exact: true })).toHaveCount(2);
    await expect(specifications.getByText('2 éléments liés')).toBeVisible();
    await expect(specifications.locator('.data-row')).toHaveCount(12);
  });
});
