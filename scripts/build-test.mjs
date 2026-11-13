import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const packageUrl = import.meta.resolve('astro/package.json');
const { bin } = JSON.parse(readFileSync(new URL(packageUrl), 'utf8'));
const astroBin = fileURLToPath(new URL(bin.astro, packageUrl));

const mode = process.argv[2];
if (mode !== 'demo' && mode !== 'submission')
  throw new Error('Choose demo or submission test build.');
const submission = mode === 'submission';
// Public settings are explicitly overridden so local live settings cannot affect tests.
// Non-credential fixtures, used only in an ignored, separate build.
// Browser tests intercept ALL Formspree/Turnstile requests before navigation.
const result = spawnSync(
  process.execPath,
  [
    astroBin,
    'build',
    '--outDir',
    submission ? './.submission-test-dist' : './.site-test-dist',
  ],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      WEBSITE_PACKAGE: 'business',
      SITE_URL: '',
      ALLOW_INDEXING: 'false',
      PUBLIC_FORMSPREE_FORM_ID: submission ? 'testform' : '',
      PUBLIC_TURNSTILE_SITE_KEY: submission
        ? 'mock-site-key-not-a-credential'
        : '',
    },
  },
);
process.exit(result.status ?? 1);
