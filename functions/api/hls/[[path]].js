const upstreamOrigin = 'https://ctvroblox.com';
const upstreamHlsRoot = `${upstreamOrigin}/hls/`;
const localHlsRoot = '/api/hls/';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Range, Content-Type',
};

const responseHeaders = (upstreamHeaders) => {
  const headers = new Headers(corsHeaders);
  const contentType = upstreamHeaders.get('content-type');
  const contentLength = upstreamHeaders.get('content-length');
  const contentRange = upstreamHeaders.get('content-range');

  if (contentType) headers.set('Content-Type', contentType);
  if (contentLength) headers.set('Content-Length', contentLength);
  if (contentRange) headers.set('Content-Range', contentRange);

  headers.set('Accept-Ranges', 'bytes');
  headers.set(
    'Cache-Control',
    'public, max-age=20, stale-while-revalidate=120',
  );

  return headers;
};

const proxiedPathFromUrl = (value, baseUrl) => {
  const url = new URL(value, baseUrl);

  if (url.origin !== upstreamOrigin || !url.pathname.startsWith('/hls/')) {
    return value;
  }

  return `${localHlsRoot}${url.pathname.slice('/hls/'.length)}${url.search}`;
};

const rewritePlaylist = (playlist, playlistUrl) =>
  playlist
    .split('\n')
    .map((line) => {
      if (line.includes('URI="')) {
        return line.replace(/URI="([^"]+)"/g, (_, uri) => {
          return `URI="${proxiedPathFromUrl(uri, playlistUrl)}"`;
        });
      }

      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return line;
      }

      return proxiedPathFromUrl(trimmed, playlistUrl);
    })
    .join('\n');

export async function onRequest({ request, params }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  const path = Array.isArray(params.path)
    ? params.path.join('/')
    : (params.path ?? '');

  const upstreamUrl = new URL(path, upstreamHlsRoot);
  const incomingUrl = new URL(request.url);
  upstreamUrl.search = incomingUrl.search;

  if (
    upstreamUrl.origin !== upstreamOrigin ||
    !upstreamUrl.pathname.startsWith('/hls/')
  ) {
    return new Response('Bad Request', {
      status: 400,
      headers: corsHeaders,
    });
  }

  const upstreamRequestHeaders = new Headers({
    Referer: `${upstreamOrigin}/`,
  });
  const range = request.headers.get('range');

  if (range) {
    upstreamRequestHeaders.set('Range', range);
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    headers: upstreamRequestHeaders,
    method: request.method,
  });

  const headers = responseHeaders(upstreamResponse.headers);
  const contentType = upstreamResponse.headers.get('content-type') ?? '';
  const isPlaylist =
    upstreamUrl.pathname.endsWith('.m3u8') ||
    contentType.includes('mpegurl') ||
    contentType.includes('application/vnd.apple');

  if (request.method === 'HEAD') {
    return new Response(null, {
      status: upstreamResponse.status,
      headers,
    });
  }

  if (isPlaylist) {
    headers.delete('Content-Length');
    const playlist = await upstreamResponse.text();
    return new Response(rewritePlaylist(playlist, upstreamUrl), {
      status: upstreamResponse.status,
      headers,
    });
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
}
