# РТС Website

Минимальный статический сайт на Astro: шапка, прямой эфир, партнёры и футер.

## Команды

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:a11y
npm run live:extract
```

## Кастомизация

- Основные настройки сайта лежат в `src/data/site.config.ts`.
- Партнёры добавляются в `src/data/partners.ts`.
- Праздничный или обычный режим задаётся через `visual.skin`: `regular` или
  `may9`.
- Светлую или тёмную тему выбирает пользователь на сайте; выбор сохраняется в
  `localStorage`. Если выбора ещё нет, используется `prefers-color-scheme`.

Фоновые изображения 9 мая и логотип лежат в `src/assets`. Заголовки используют
`RTRONE` из `public/fonts/rtrone.woff2`, основной текст остаётся на системном
UI-шрифте.

## Прямой эфир

Источник CTV задаётся в `src/data/site.config.ts`. Команда `npm run live:extract`
пытается через Playwright открыть страницу канала, нажать Play и сохранить
найденный player/HLS URL в `src/generated/live-stream.ts`.
