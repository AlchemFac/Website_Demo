import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSiteUrl,
  indexingAllowed,
  robotsText,
  sitemapXml,
} from '../src/config/seo.mjs';

test('no domain means no invented origin or sitemap discovery', () => {
  assert.equal(parseSiteUrl(), undefined);
  assert.equal(indexingAllowed(undefined, 'true', false), false);
  assert.equal(robotsText(undefined, false), 'User-agent: *\nDisallow: /\n');
  assert.throws(() => sitemapXml(undefined, ['/']));
});

test('only a root HTTPS origin is accepted', () => {
  assert.equal(
    parseSiteUrl(' https://cleaning.example ').href,
    'https://cleaning.example/',
  );
  for (const invalid of [
    'not-a-url',
    'http://cleaning.example',
    'https://user:password@cleaning.example',
    'https://cleaning.example/path',
    'https://cleaning.example/?x=1',
    'https://cleaning.example/#fragment',
  ])
    assert.throws(() => parseSiteUrl(invalid));
});

test('a domain and indexing flag cannot override fictional demo protection', () => {
  const site = parseSiteUrl('https://cleaning.example');
  assert.equal(indexingAllowed(site, 'true', true), false);
  assert.equal(indexingAllowed(site, 'false', false), false);
  assert.equal(indexingAllowed(site, undefined, false), false);
  assert.equal(indexingAllowed(site, 'true', false), true);
});

test('approved release discovery uses the configured origin and deduplicates routes', () => {
  const site = parseSiteUrl('https://cleaning.example');
  assert.match(
    robotsText(site, true),
    /Sitemap: https:\/\/cleaning\.example\/sitemap.xml/,
  );
  const xml = sitemapXml(site, ['/', '/services/', '/contact/', '/contact/']);
  assert.equal((xml.match(/<url>/g) ?? []).length, 3);
  assert.match(xml, /<loc>https:\/\/cleaning\.example\/contact\/<\/loc>/);
  assert.ok(!xml.includes('lastmod'));
  assert.ok(!xml.includes('localhost'));
});

test('discovery rejects off-site or query/fragment routes and escapes XML', () => {
  const site = parseSiteUrl('https://cleaning.example');
  for (const route of [
    '//evil.example/',
    'https://evil.example/',
    '/?email=private',
    '/#section',
  ])
    assert.throws(() => sitemapXml(site, [route]));
  assert.match(sitemapXml(site, ['/a&b/']), /a&amp;b/);
});
