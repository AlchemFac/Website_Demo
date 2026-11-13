import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { business } from '../src/config/business.ts';
import { validateLaunch } from '../src/lib/launch-validation.ts';

const root = mkdtempSync(join(tmpdir(), 'launch-validation-'));
for (const name of [
  'public/hero.svg',
  'src/pages/index.astro',
  'src/pages/services.astro',
  'src/pages/contact.astro',
  'src/page-templates/about.astro',
  'src/page-templates/gallery.astro',
  'src/page-templates/privacy.astro',
  'src/assets/gallery/room.png',
]) {
  mkdirSync(dirname(join(root, name)), { recursive: true });
  writeFileSync(
    join(root, name),
    'Automated test fixture, not a deployed asset.',
  );
}
test.after(() => rmSync(root, { recursive: true, force: true }));
// Synthetic format fixtures only. No accounts exist or are contacted by these tests.
function fixture(websitePackage = 'business') {
  const b = structuredClone(business);
  Object.assign(b, {
    name: 'Cedar Grove Cleaning',
    isDemo: false,
    description: 'Residential cleaning for local households.',
    email: 'office@client-fixture.com',
    phone: { display: '+1 202 555 0200', href: 'tel:+12025550200' },
  });
  b.branding.tagline = 'More room for everyday life.';
  const ids =
    websitePackage === 'business'
      ? ['home', 'services', 'about', 'gallery', 'contact']
      : ['home', 'services', 'contact'];
  const navigation = ids.map((id) => ({
    id,
    href: id === 'home' ? '/' : `/${id}/`,
    ...(['about', 'gallery'].includes(id)
      ? { template: `src/page-templates/${id}.astro` }
      : {}),
  }));
  return {
    business: b,
    websitePackage,
    navigation,
    metadata: Object.fromEntries(
      [...ids, 'notFound'].map((id) => [
        id,
        { title: `Page ${id}`, description: `Information about ${id}.` },
      ]),
    ),
    hero: {
      heroImageSrc: '/hero.svg',
      heroImageAlt: 'A calm room',
      heroImageWidth: 840,
      heroImageHeight: 920,
    },
    services: [
      {
        id: 'routine-care',
        number: '01',
        title: 'Routine care',
        homepage: {
          description: 'Routine surface care.',
          details: 'Agreed tasks.',
        },
        summary: 'Everyday upkeep.',
        description: 'Discuss the rooms and tasks before scheduling.',
        includes: ['Accessible counters'],
        excludes: ['Repairs'],
      },
    ],
    content: {
      shared: { quoteAction: { label: 'Request a quote', href: '/contact/' } },
      home: { title: 'A calmer home.' },
    },
    gallery: [
      {
        src: '/src/assets/gallery/room.png',
        title: 'A calm room',
        alt: 'A sunlit room',
        label: 'AI-generated illustration',
        caption: 'An imagined space, not a customer job.',
      },
    ],
    privacy: {
      enabled: true,
      clientApproved: true,
      linkLabel: 'Privacy',
      title: 'Privacy information',
      description: 'How information is handled.',
      heading: 'Privacy information',
      introduction: 'Read the following information.',
      sections: [
        'information',
        'purpose',
        'providers',
        'retention',
        'contact',
      ].map((id) => ({
        id,
        title: id,
        paragraphs: [
          id === 'providers'
            ? 'Formspree and Cloudflare Turnstile provide form processing and verification.'
            : 'Approved factual information for this category.',
        ],
      })),
    },
    environment: {
      SITE_URL: 'https://launch.client-fixture.com',
      ALLOW_INDEXING: 'true',
      PUBLIC_FORMSPREE_FORM_ID: 'fixtureform',
      PUBLIC_TURNSTILE_SITE_KEY: 'fixture-public-site-key',
    },
  };
}
const errors = (c, demo = false) =>
  validateLaunch(c, root, demo).filter((i) => i.severity === 'error');
const has = (issues, field) => issues.some((i) => i.field === field);

test('complete synthetic client configurations pass both presets with manual warnings', () => {
  for (const name of ['starter', 'business']) {
    assert.deepEqual(errors(fixture(name)), []);
    assert.ok(
      validateLaunch(fixture(name), root).some(
        (i) => i.field === 'manual review',
      ),
    );
  }
});
test('missing/placeholder business data and invalid public contact details block launch', () => {
  const c = fixture();
  c.business.name = 'North Texas Home Cleaning';
  c.business.description = '';
  c.business.hours = [];
  c.business.serviceAreas = [];
  c.business.phone = { display: 'not a phone', href: 'tel:wrong' };
  c.business.email = 'hello@example.com';
  const result = errors(c);
  for (const field of [
    'business.name',
    'business.description',
    'business.hours',
    'business.serviceAreas',
    'business.phone',
    'business.email',
  ])
    assert.ok(has(result, field), field);
});
test('demo mode downgrades expected launch gaps but not structural failures', () => {
  const c = fixture();
  c.business.isDemo = true;
  c.environment = {};
  c.privacy.enabled = false;
  assert.ok(errors(c).length >= 4);
  assert.deepEqual(errors(c, true), []);
  c.navigation.push({ id: 'broken', href: '/broken/' });
  assert.ok(has(errors(c, true), 'navigation'));
});
test('production demo copy is detected without printing its contents', () => {
  const c = fixture();
  c.content.home.title = 'Fictional business private-marker';
  const result = errors(c);
  assert.ok(has(result, 'content.home.title'));
  assert.ok(!JSON.stringify(result).includes('private-marker'));
});
test('package limits, navigation duplicates, broken actions and missing entries are errors', () => {
  const c = fixture('starter');
  c.navigation.push({ id: 'contact', href: '/contact/' });
  c.content.shared.quoteAction.href = '/about/';
  assert.ok(has(errors(c), 'navigation'));
  assert.ok(has(errors(c), 'content.shared.quoteAction.href'));
  c.navigation[0].template = 'src/does-not-exist.astro';
  assert.ok(has(errors(c), 'navigation.home'));
  c.websitePackage = 'unknown';
  assert.ok(has(errors(c), 'WEBSITE_PACKAGE'));
});
test('missing and duplicate metadata are reported for enabled pages', () => {
  const c = fixture();
  delete c.metadata.contact.description;
  c.metadata.about.title = c.metadata.home.title;
  assert.ok(has(errors(c), 'pageMetadata.contact.description'));
  assert.ok(has(errors(c), 'pageMetadata'));
});
test('missing images, alt text, and malformed branding block launch', () => {
  const c = fixture();
  c.hero.heroImageSrc = '/missing.webp';
  c.business.branding.colors.primary = 'not-a-color';
  c.gallery[0].src = '/src/assets/gallery/missing.png';
  c.gallery[0].alt = '';
  for (const field of [
    'homeContent.heroImageSrc',
    'branding.colors.primary',
    'galleryImages[0].src',
    'galleryImages[0].alt',
  ])
    assert.ok(has(errors(c), field), field);
});
test('disabled gallery content does not create Starter image errors', () => {
  const c = fixture('starter');
  c.gallery[0].src = '/missing.png';
  assert.deepEqual(errors(c), []);
});
test('SEO origin/flag errors and contradictory demo indexing are reported', () => {
  const c = fixture();
  c.environment.SITE_URL = 'https://user:password@invalid.example/path';
  c.environment.ALLOW_INDEXING = 'yes';
  assert.ok(has(errors(c), 'SITE_URL'));
  assert.ok(has(errors(c), 'ALLOW_INDEXING'));
  c.environment.ALLOW_INDEXING = 'true';
  c.business.isDemo = true;
  assert.ok(has(errors(c), 'SEO/indexing'));
});
test('missing/partial provider identifiers are errors with no identifier values in output', () => {
  const c = fixture();
  c.environment.PUBLIC_TURNSTILE_SITE_KEY = '';
  c.environment.PUBLIC_FORMSPREE_FORM_ID = 'private-marker';
  const result = errors(c);
  assert.ok(has(result, 'contactForm'));
  assert.ok(!JSON.stringify(result).includes('private-marker'));
  c.environment.PUBLIC_FORMSPREE_FORM_ID = '';
  assert.ok(has(errors(c), 'contactForm'));
});
test('privacy approval never bypasses missing categories or leftover placeholders', () => {
  const c = fixture();
  c.privacy.sections = c.privacy.sections.filter((s) => s.id !== 'retention');
  c.privacy.introduction = 'DRAFT PLACEHOLDER';
  assert.ok(has(errors(c), 'privacy.sections.retention'));
  assert.ok(has(errors(c), 'privacy.introduction'));
  c.privacy.clientApproved = false;
  assert.ok(has(errors(c), 'privacy'));
});
test('privacy provider disclosure and unique service IDs are checked', () => {
  const c = fixture();
  c.privacy.sections.find((s) => s.id === 'providers').paragraphs = [
    'No provider information.',
  ];
  c.services.push(structuredClone(c.services[0]));
  assert.ok(has(errors(c), 'privacy.sections.providers'));
  assert.ok(has(errors(c), 'services'));
});
test('CLI demo review is offline and an invalid package fails safely', () => {
  const cwd = fileURLToPath(new URL('../', import.meta.url));
  const env = {
    ...process.env,
    SITE_URL: '',
    ALLOW_INDEXING: 'false',
    PUBLIC_FORMSPREE_FORM_ID: '',
    PUBLIC_TURNSTILE_SITE_KEY: '',
    WEBSITE_PACKAGE: 'starter',
  };
  const result = spawnSync(
    process.execPath,
    ['scripts/validate.mjs', '--demo'],
    { cwd, env, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /not a production launch approval/);
  assert.match(result.stdout, /0 error\(s\)/);
  const invalid = spawnSync(process.execPath, ['scripts/validate.mjs'], {
    cwd,
    env: { ...env, WEBSITE_PACKAGE: 'wrong' },
    encoding: 'utf8',
  });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /WEBSITE_PACKAGE/);
});
