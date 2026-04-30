import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const distDir = 'dist';
const ignoredDirs = new Set([join(distDir, 'admin')]);
const limits = {
  totalBytes: 5_700_000,
  entryScriptBytes: 120_000,
  lazyHlsBytes: 380_000,
  styleBytes: 180_000,
};

const collectFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (ignoredDirs.has(path)) {
      return [];
    }

    return entry.isDirectory() ? collectFiles(path) : [path];
  });

const files = collectFiles(distDir).map((path) => ({
  path,
  size: statSync(path).size,
}));

const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
const scriptBytes = files
  .filter((file) => file.path.endsWith('.js'))
  .reduce((sum, file) => sum + file.size, 0);
const lazyHlsBytes = files
  .filter((file) => /hls(\.light)?\..+\.js$/.test(file.path))
  .reduce((sum, file) => sum + file.size, 0);
const entryScriptBytes = files
  .filter(
    (file) =>
      file.path.endsWith('.js') && !/hls(\.light)?\..+\.js$/.test(file.path),
  )
  .reduce((sum, file) => sum + file.size, 0);
const styleBytes = files
  .filter((file) => file.path.endsWith('.css'))
  .reduce((sum, file) => sum + file.size, 0);

const failures = [
  ['total', totalBytes, limits.totalBytes],
  ['entry scripts', entryScriptBytes, limits.entryScriptBytes],
  ['lazy HLS player', lazyHlsBytes, limits.lazyHlsBytes],
  ['styles', styleBytes, limits.styleBytes],
].filter(([, actual, limit]) => actual > limit);

if (failures.length > 0) {
  for (const [label, actual, limit] of failures) {
    console.error(
      `Build size limit exceeded for ${label}: ${actual} bytes > ${limit} bytes`,
    );
  }

  process.exit(1);
}

console.warn(
  `Build size OK: total=${totalBytes} bytes, scripts=${scriptBytes} bytes, entryScripts=${entryScriptBytes} bytes, lazyHls=${lazyHlsBytes} bytes, styles=${styleBytes} bytes`,
);
