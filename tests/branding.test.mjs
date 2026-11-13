import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { business } from '../src/config/business.ts';
import {
  checkBranding,
  contrastRatio,
  localImageExists,
} from '../src/lib/branding-checks.ts';
const root = mkdtempSync(join(tmpdir(), 'branding-'));
mkdirSync(join(root, 'public'));
writeFileSync(join(root, 'public/hero.svg'), '<svg/>');
const hero = {
  heroImageSrc: '/hero.svg',
  heroImageAlt: 'Sample illustration',
  heroImageWidth: 840,
  heroImageHeight: 920,
};
test.after(() => rmSync(root, { recursive: true, force: true }));
test('default palette and optional null logo are valid', () =>
  assert.deepEqual(checkBranding(business, hero, root), []));
test('malformed colors and missing logo assets are errors', () => {
  const copy = structuredClone(business);
  copy.branding.colors.primary = 'red; background: url(x)';
  copy.branding.logo = { src: '/missing.svg', width: 0, height: -1 };
  const errors = checkBranding(copy, hero, root).filter(
    (i) => i.severity === 'error',
  );
  assert.equal(errors.length, 3);
});
test('low contrast warns and standard black/white contrast is 21', () => {
  const copy = structuredClone(business);
  copy.branding.colors.text = copy.branding.colors.background;
  assert.ok(
    checkBranding(copy, hero, root).some((i) => i.severity === 'warning'),
  );
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);
});
test('missing hero, blank alt and invalid dimensions are detected', () =>
  assert.equal(
    checkBranding(
      business,
      {
        ...hero,
        heroImageSrc: '/missing.png',
        heroImageAlt: '',
        heroImageWidth: 0,
      },
      root,
    ).length,
    3,
  ));
test('asset paths cannot escape public or use a remote URL', () => {
  for (const src of [
    'https://example.com/image.png',
    '//example.com/x.png',
    '/../hero.svg',
    '/hero.svg?x=1',
  ])
    assert.equal(localImageExists(root, src), false);
  assert.equal(localImageExists(root, '/hero.svg'), true);
});
