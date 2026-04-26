export type LiveStream = {
  status: 'available' | 'unavailable';
  playerUrl: string | null;
  hlsUrl: string | null;
  extractedAt: string | null;
  error: string | null;
};

export const liveStream: LiveStream = {
  status: 'available',
  playerUrl: null,
  hlsUrl:
    'https://ctvroblox.com/hls/9ac0570e701c4172a1e2d5c1edd62188/index.m3u8',
  extractedAt: '2026-04-26T07:17:36.642Z',
  error: null,
};
