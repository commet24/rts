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

export const liveEmbed = {
  sourcePageUrl: siteConfig.live.sourcePageUrl,
  embedUrl: trustedPlayerUrl,
  hlsUrl: trustedHlsUrl,
  status: liveStream.status,
  extractedAt: liveStream.extractedAt,
  hasGeneratedPlayer: trustedPlayerUrl !== null,
};
