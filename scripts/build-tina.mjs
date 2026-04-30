import { execFileSync } from 'node:child_process';

const hasTinaCloudCredentials =
  Boolean(process.env.TINA_CLIENT_ID) && Boolean(process.env.TINA_TOKEN);

if (!hasTinaCloudCredentials) {
  console.warn(
    'Skipping TinaCMS admin build: TINA_CLIENT_ID and TINA_TOKEN are not set.',
  );
  process.exit(0);
}

execFileSync(
  'npx',
  [
    'tinacms',
    'build',
    '--skip-cloud-checks',
    '--skip-indexing',
    '--noTelemetry',
  ],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);
