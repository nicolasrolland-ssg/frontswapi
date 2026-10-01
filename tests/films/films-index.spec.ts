// spec: specs/films-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Films - Index et recherche', () => {
  test('Accéder à l’index Films et afficher les premiers résultats', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    let releaseFilmsResponse!: () => void;
    const responseGate = new Promise<void>((resolve) => {
      releaseFilmsResponse = resolve;
    });
    let filmsPayload: any;

    await page.route('**/api/films**', async (route) => {
      const response = await route.fetch();
      filmsPayload = await response.json();
      await responseGate;
      await route.fulfill({ response, body: JSON.stringify(filmsPayload) });
    });

    // 1. Depuis un contexte navigateur vierge, ouvrir le tableau de bord puis sélectionner « Films » dans la navigation principale. Attendre la fin de la requête GET /api/films.
    await page.goto('http://localhost:4200');
    await page.getByRole('link', { name: 'Films', exact: true }).click();
    await expect(page).toHaveURL(/\/films$/);
    await expect(page.getByRole('heading', { name: 'Films', level: 1 })).toBeVisible();
    await expect(page.locator('app-loading')).toBeVisible();

    releaseFilmsResponse();
    const records = Array.isArray(filmsPayload)
      ? filmsPayload
      : filmsPayload.content ?? filmsPayload.data ?? filmsPayload.results ?? [];
    const total = Array.isArray(filmsPayload)
      ? records.length
      : filmsPayload.totalElements ?? filmsPayload.total ?? records.length;
    const cards = page.locator('.record-card');
    await expect(cards).toHaveCount(Math.min(12, total));
    await expect(page.locator('.result-count')).toContainText(`${total} SIGNATURES`);
    await expect(page.getByRole('button', { name: /PRÉCÉDENT/ })).toBeDisabled();
    expect(records.length).toBeGreaterThan(0);

    // 2. Vérifier les titres et métadonnées visibles sur plusieurs cartes.
    for (let index = 0; index < Math.min(2, records.length); index++) {
      const record = records[index];
      const card = cards.nth(index);
      await expect(card.getByRole('heading', { level: 2 })).toHaveText(String(record.title ?? 'UNKNOWN'));
      await expect(card).toContainText(`#${record.id ?? index + 1}`);
      await expect(card).toContainText(String(record.episodeId ?? '—'));
      await expect(card).toContainText(String(record.director ?? '—'));
      await expect(card).toContainText('INSPECTER');
      await expect(card).toHaveAttribute('href', `/films/${record.id ?? index + 1}`);
    }

    const firstRecord = records[0];
    await cards.first().click();
    await expect(page).toHaveURL(new RegExp(`/films/${firstRecord.id ?? 1}$`));
    await expect(page.getByRole('heading', { name: String(firstRecord.title ?? 'SIGNATURE INCONNUE'), level: 1 })).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});
