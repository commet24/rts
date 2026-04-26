import { liveStream } from '../generated/live-stream';
import { siteConfig } from './site.config';

const isTrustedEmbedUrl = (value: string) => {
  try {
    const { hostname, protocol } = new URL(value);
    return (
      protocol === 'https:' &&
      siteConfig.live.allowedEmbedHosts.includes(hostname)
    );
  } catch {
    return false;
  }
};

const trustedPlayerUrl =
  liveStream.playerUrl && isTrustedEmbedUrl(liveStream.playerUrl)
    ? liveStream.playerUrl
    : null;

const trustedHlsUrl =
  liveStream.hlsUrl && isTrustedEmbedUrl(liveStream.hlsUrl)
    ? liveStream.hlsUrl
    : null;

const toProxiedHlsUrl = (value: string | null) => {
  if (!value) {
    return null;
  }

  const url = new URL(value);
  if (!url.pathname.startsWith('/hls/')) {
    return value;
  }

  return `/api/hls/${url.pathname.slice('/hls/'.length)}${url.search}`;
};

export const liveEmbed = {
  sourcePageUrl: siteConfig.live.sourcePageUrl,
  embedUrl: trustedPlayerUrl,
  hlsUrl: toProxiedHlsUrl(trustedHlsUrl),
  status: liveStream.status,
  extractedAt: liveStream.extractedAt,
  hasGeneratedPlayer: trustedPlayerUrl !== null,
};
