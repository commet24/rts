import { expect, test } from '@playwright/test';

test('главная страница показывает базовые секции', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('banner')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Прямой эфир' }),
  ).toBeVisible();
  await expect(page.getByText(/Источник извлечён|Нужен extract/)).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Партнёрская лента' }),
  ).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('пустая карусель партнёров сохраняет визуальный ритм', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.partner-tile--placeholder')).toHaveCount(16);
});

test('пользователь может переключить светлую и тёмную тему', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const toggle = page.getByRole('button', { name: /тему/i });
  await expect(toggle).toBeVisible();

  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await toggle.click();

  await expect(page.locator('html')).toHaveAttribute(
    'data-theme',
    initialTheme === 'dark' ? 'light' : 'dark',
  );
});
