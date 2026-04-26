import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const sourcePageUrl =
  'https://ctvroblox.com/channel.html?channel_id=9ac0570e701c4172a1e2d5c1edd62188';
const outputPath = resolve('src/generated/live-stream.ts');
const channelId = new URL(sourcePageUrl).searchParams.get('channel_id');
const publicChannelApiUrl = channelId
  ? `https://ctvroblox.com/api/public/channels/${channelId}`
  : null;

type ExtractionResult = {
  status: 'available' | 'unavailable';
  playerUrl: string | null;
  hlsUrl: string | null;
  extractedAt: string;
  error: string | null;
};

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

const extractHlsUrl = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const player = (payload as { player?: unknown }).player;
  if (!player || typeof player !== 'object') {
    return null;
  }

  const hlsUrl = (player as { hls_url?: unknown }).hls_url;
  return typeof hlsUrl === 'string' && isHttpsUrl(hlsUrl) ? hlsUrl : null;
};

const writeResult = (result: ExtractionResult) => {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(
    outputPath,
    `export type LiveStream = {
  status: 'available' | 'unavailable';
  playerUrl: string | null;
  hlsUrl: string | null;
  extractedAt: string | null;
  error: string | null;
};

export const liveStream: LiveStream = ${JSON.stringify(result, null, 2)};\n`,
  );
};

const extract = async (): Promise<ExtractionResult> => {
  const hlsCandidates = new Set<string>();
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('.m3u8') && isHttpsUrl(url)) {
        hlsCandidates.add(url);
      }
    });

    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('.m3u8') && isHttpsUrl(url)) {
        hlsCandidates.add(url);
      }

      if (url.includes('/api/public/channels/') && !url.includes('/schedule')) {
        const hlsUrl = extractHlsUrl(await response.json().catch(() => null));
        if (hlsUrl) {
          hlsCandidates.add(hlsUrl);
        }
      }
    });

    await page.goto(sourcePageUrl, {
      waitUntil: 'commit',
      timeout: 45_000,
    });
    await page
      .waitForLoadState('domcontentloaded', { timeout: 15_000 })
      .catch(() => undefined);

    const playControl = page
      .getByRole('button', { name: /play|воспроизвести|нажмите/i })
      .first();

    if ((await playControl.count()) > 0) {
      await playControl.click({ timeout: 5_000 }).catch(() => undefined);
    }

    await page
      .waitForLoadState('networkidle', { timeout: 8_000 })
      .catch(() => undefined);
    await page.waitForTimeout(6_000);

    if (publicChannelApiUrl) {
      const apiResponse = await page.request
        .get(publicChannelApiUrl)
        .catch(() => null);
      const hlsUrl = apiResponse
        ? extractHlsUrl(await apiResponse.json().catch(() => null))
        : null;
      if (hlsUrl) {
        hlsCandidates.add(hlsUrl);
      }
    }

    const playerUrl =
      page
        .frames()
        .map((frame) => frame.url())
        .find((url) => url !== sourcePageUrl && isHttpsUrl(url)) ?? null;

    const hlsUrl = [...hlsCandidates][0] ?? null;

    return {
      status: playerUrl || hlsUrl ? 'available' : 'unavailable',
      playerUrl,
      hlsUrl,
      extractedAt: new Date().toISOString(),
      error: playerUrl || hlsUrl ? null : 'Плеер или HLS-поток не найден.',
    };
  } finally {
    await browser.close();
  }
};

try {
  writeResult(await extract());
} catch (error) {
  writeResult({
    status: 'unavailable',
    playerUrl: null,
    hlsUrl: null,
    extractedAt: new Date().toISOString(),
    error: error instanceof Error ? error.message : 'Неизвестная ошибка.',
  });
  console.error(error);
  process.exitCode = 1;
}
