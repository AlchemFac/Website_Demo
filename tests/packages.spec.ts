import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Deliberately independent expected routes: do not derive assertions from the config under test.
const expectedRoutes = {
  starter: ['/', '/services/', '/contact/'],
  business: ['/', '/services/', '/about/', '/gallery/', '/contact/'],
};
const routesFor = (name: string) =>
  expectedRoutes[name as keyof typeof expectedRoutes];

test('static output and indexable sitemap contain exactly the package pages', async ({}, info) => {
  const routes = routesFor(info.project.name);
  const output = resolve(`.package-${info.project.name}-dist`);
  const html = readdirSync(output, { recursive: true })
    .map(String)
    .filter((file) => file.endsWith('.html'))
    .map((file) => file.replaceAll('\\', '/'))
    .sort();
  expect(html).toEqual(
    [
      '404.html',
      'privacy/index.html',
      ...routes.map((route) =>
        route === '/' ? 'index.html' : `${route.slice(1)}index.html`,
      ),
    ].sort(),
  );
  const sitemap = readFileSync(resolve(output, 'sitemap.xml'), 'utf8');
  expect(
    [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]),
  ).toEqual(
    [...routes, ...(info.project.name === 'business' ? ['/privacy/'] : [])].map(
      (route) => `https://packages.example${route}`,
    ),
  );
  expect(readFileSync(resolve(output, 'robots.txt'), 'utf8')).toBe(
    'User-agent: *\nAllow: /\nSitemap: https://packages.example/sitemap.xml\n',
  );
});

for (const width of [320, 768, 1440]) {
  test(`navigation, footer and every internal destination work at ${width}px`, async ({
    page,
  }, info) => {
    const routes = routesFor(info.project.name);
    await page.setViewportSize({ width, height: 900 });
    const destinations = new Set<string>();
    for (const route of routes) {
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (width < 1024)
        await page.getByRole('button', { name: 'Menu', exact: true }).click();
      for (const selector of ['#main-navigation', 'footer nav']) {
        expect(
          await page
            .locator(`${selector} a`)
            .evaluateAll((links) =>
              links.map((link) => link.getAttribute('href')),
            ),
        ).toEqual(routes);
      }
      await expect(
        page.locator('#main-navigation [aria-current="page"]'),
      ).toHaveAttribute('href', route);
      await expect(page.locator('#main-navigation a').last()).toBeVisible();
      for (const href of await page
        .locator('a[href]')
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute('href')!),
        )) {
        const target = new URL(href, page.url());
        if (target.origin !== new URL(page.url()).origin) continue;
        expect([...routes, '/privacy/'], `Enabled link: ${href}`).toContain(
          target.pathname,
        );
        destinations.add(target.pathname);
        if (target.pathname === route && target.hash) {
          await expect(
            page.locator(`[id="${decodeURIComponent(target.hash.slice(1))}"]`),
          ).toHaveCount(1);
        }
      }
      // Navigate using the existing responsive menu, not just direct URLs.
      await page.locator('#main-navigation a[href="/contact/"]').click();
      await expect(page).toHaveURL(/\/contact\/$/);
    }
    for (const destination of destinations)
      expect((await page.request.get(destination)).status()).toBe(200);
  });
}

test('disabled and unknown pages return 404, and the 404 links stay enabled', async ({
  page,
}, info) => {
  const routes = routesFor(info.project.name);
  const disabled =
    info.project.name === 'starter'
      ? ['/about/', '/gallery/', '/about/index.html', '/gallery/index.html']
      : [];
  for (const route of [...disabled, '/missing-package-page/']) {
    expect((await page.request.get(route)).status()).toBe(404);
  }
  await page.goto('/404.html');
  for (const href of await page
    .locator('a[href]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')!))) {
    if (href.startsWith('/')) expect([...routes, '/privacy/']).toContain(href);
  }
});

test('mobile menu preserves keyboard focus and Escape behavior', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(page.locator('#main-navigation a').first()).toBeFocused();
  await expect(page.locator('#main-navigation a')).toHaveCount(
    routesFor(info.project.name).length,
  );
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('client offline validation still works in either package', async ({
  page,
}) => {
  await page.route('https://formspree.io/**', (route) => route.abort());
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Check form entries' }).click();
  await expect(page.locator('[data-error-summary]')).toContainText('4 fields');
  await expect(page.locator('#contact-name')).toBeFocused();
});

test('Privacy is auxiliary, accessible, and indexes only with approval', async ({
  page,
}, info) => {
  await page.goto('/contact/');
  await expect(page.locator('footer a[href="/privacy/"]')).toBeVisible();
  await expect(page.locator('footer nav a')).toHaveCount(
    routesFor(info.project.name).length,
  );
  await page.locator('footer a[href="/privacy/"]').click();
  await expect(page.locator('h1')).toHaveText('Privacy information');
  await expect(page.locator('main h2')).toHaveCount(5);
  await expect(page.locator('main')).toContainText('DRAFT PLACEHOLDER');
  const approvedFixture = info.project.name === 'business';
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    approvedFixture ? 'index, follow' : 'noindex, nofollow',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(
    approvedFixture ? 1 : 0,
  );
});
