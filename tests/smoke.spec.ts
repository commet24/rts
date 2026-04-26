import { expect, test } from '@playwright/test';

test('главная страница показывает базовые секции', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('banner')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Прямой эфир' }),
  ).toBeVisible();
  await expect(page.locator('video, iframe')).toBeVisible();
  await expect(page.locator('video[data-hls-src]')).toHaveAttribute(
    'data-hls-src',
    /^\/api\/hls\//,
  );
  await expect(page.getByRole('heading', { name: 'Партнёры' })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('карусель партнёров показывает реальные ссылки', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.partner-tile--placeholder')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'XXL Studios' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Аэрофлот' })).toHaveCount(2);
});

test('партнёрская карусель остаётся внутри секции на мобильном экране', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const firstPartner = page.getByRole('link', { name: 'XXL Studios' }).first();
  const partnerBox = await firstPartner.boundingBox();
  const sectionBox = await page.locator('.partners-section').boundingBox();

  expect(partnerBox?.width).toBeGreaterThan(100);
  expect(sectionBox?.width).toBeLessThanOrEqual(390);
});

test('пользователь может переключить светлую и тёмную тему', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.removeItem('rts-theme');
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const toggle = page.getByRole('button', { name: 'Переключить тему' });
  await expect(toggle).toBeVisible();

  await page.locator('html').evaluate((element) => {
    element.dataset.theme = 'light';
  });
  await toggle.click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
