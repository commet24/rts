import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('главная страница проходит базовую axe-проверку', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const results = await new AxeBuilder({ page }).exclude('iframe').analyze();

  expect(results.violations).toEqual([]);
});
