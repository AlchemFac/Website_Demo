import { spawnSync } from 'node:child_process';
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixture = mkdtempSync(join(tmpdir(), 'astro-packages-'));
const packageUrl = import.meta.resolve('astro/package.json');
const { bin } = JSON.parse(readFileSync(new URL(packageUrl), 'utf8'));
const astroBin = fileURLToPath(new URL(bin.astro, packageUrl));
try {
  // Copy only public source, never local .env files or private account configuration.
  for (const name of [
    'src',
    'public',
    'astro.config.mjs',
    'package.json',
    'tsconfig.json',
  ]) {
    cpSync(join(root, name), join(fixture, name), { recursive: true });
  }
  // A junction also works on Windows without requiring symlink developer privileges.
  symlinkSync(
    join(root, 'node_modules'),
    join(fixture, 'node_modules'),
    'junction',
  );
  const businessFile = join(fixture, 'src/config/business.ts');
  const source = readFileSync(businessFile, 'utf8');
  if (!/isDemo:\s*(true|false)/.test(source))
    throw new Error('Expected an explicit business.isDemo setting.');
  // Isolated test-only indexable content, on a reserved origin. No source flag is changed.
  writeFileSync(
    businessFile,
    source.replace(/isDemo:\s*(true|false)/, 'isDemo: false'),
  );
  const privacyFile = join(fixture, 'src/config/privacy.ts');
  const privacySource = readFileSync(privacyFile, 'utf8');
  // Reuse one output directory to catch stale About/Gallery files when downgrading.
  for (const websitePackage of ['business', 'starter']) {
    // Business fixture exercises approved indexing; Starter exercises a noindex draft.
    writeFileSync(
      privacyFile,
      privacySource
        .replace('enabled: false', 'enabled: true')
        .replace(
          'clientApproved: false',
          `clientApproved: ${websitePackage === 'business'}`,
        ),
    );
    const result = spawnSync(process.execPath, [astroBin, 'build'], {
      cwd: fixture,
      stdio: 'inherit',
      env: {
        ...process.env,
        WEBSITE_PACKAGE: websitePackage,
        SITE_URL: 'https://packages.example',
        ALLOW_INDEXING: 'true',
        PUBLIC_FORMSPREE_FORM_ID: '',
        PUBLIC_TURNSTILE_SITE_KEY: '',
      },
    });
    if (result.status !== 0)
      throw new Error(`${websitePackage} test build failed.`);
    const output = join(root, `.package-${websitePackage}-dist`);
    rmSync(output, { recursive: true, force: true });
    cpSync(join(fixture, 'dist'), output, { recursive: true });
  }
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
