import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1440]) {
  test(`tango homepage works at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    expect((await page.goto('/'))?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Maria Fernanda');
    await expect(page).toHaveTitle(/Tango lessons with Maria Fernanda/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Dallas–Fort Worth/,
    );
    await expect(page.locator('.lesson-card')).toHaveCount(4);
    const order = await page
      .locator('#about, #lessons, #contact')
      .evaluateAll((sections) => sections.map((s) => s.id));
    expect(order).toEqual(['about', 'lessons', 'contact']);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const hero = page.locator('.hero-image');
    await expect(hero).toHaveAttribute('alt', '');
    await expect(hero).toHaveAttribute('fetchpriority', 'high');
    await expect(hero).toHaveAttribute('loading', 'eager');
    await expect(hero).toHaveAttribute('srcset', /480w/);
    await expect(page.locator('.about-figure img')).toHaveAttribute(
      'loading',
      'lazy',
    );
    for (const img of await page.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((image: HTMLImageElement) => image.decode());
      await expect(img).toHaveAttribute('width', /\d+/);
      await expect(img).toHaveAttribute('height', /\d+/);
      await expect(img).toHaveAttribute('src', /\.webp$/);
    }
    await expect(page.locator('.hero-bottom')).toContainText('AI-generated');
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute('href')!),
      )) {
      const target = new URL(href, page.url());
      expect(target.origin).toBe(new URL(page.url()).origin);
      expect(['/', '/privacy/']).toContain(target.pathname);
      if (target.hash)
        await expect(
          page.locator(`[id="${target.hash.slice(1)}"]`),
        ).toHaveCount(1);
    }
  });
}

test('mobile navigation supports keyboard, Escape and focus at destinations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const toggle = page.locator('.menu-toggle');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(page.locator('#site-navigation a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.locator('#site-navigation a').first().click();
  await expect(page.locator('#about')).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('lesson choices and native FAQs work without creating a booking', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('[data-lesson]').first().click();
  await expect(page.locator('[data-selected-lesson]')).toContainText(
    'Private lessons',
  );
  await expect(page.locator('#contact')).toBeFocused();
  expect(new URL(page.url()).hash).toBe('#contact');
  await page.locator('[data-lesson]').last().click();
  await expect(page.locator('[data-selected-lesson]')).toContainText(
    'Find your community',
  );
  const faq = page.locator('details').first();
  await faq.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(faq.locator('p')).toBeVisible();
  await expect(page.locator('.lesson-note')).toContainText(
    'Prices, lesson lengths and booking details are being finalized',
  );
  await expect(page.locator('form')).toHaveCount(0);
});

test('pending contacts do not create fabricated links, trackers or browser storage', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4340')
      external.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('.contact-status')).toContainText(
    'Online inquiries are not available yet',
  );
  await expect(page.locator('.pending-value')).toHaveCount(2);
  await expect(
    page.locator('.social-pending[aria-disabled="true"]'),
  ).toHaveCount(2);
  await expect(
    page.locator('a[href^="mailto:"], a[href^="tel:"], iframe, form'),
  ).toHaveCount(0);
  await expect(page.locator('address')).toHaveCount(0);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
  expect(await page.context().cookies()).toEqual([]);
  expect(external).toEqual([]);
});

test('privacy draft is reachable, clear about review, and protected from indexing', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Footer navigation' })
    .getByRole('link', { name: 'Privacy policy (draft)' })
    .click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page).toHaveTitle(/Privacy policy — draft/);
  await expect(page.locator('.policy-status')).toContainText(
    'DRAFT FOR OWNER REVIEW',
  );
  for (const id of [
    'operator',
    'information',
    'purposes',
    'providers',
    'cookies',
    'retention',
    'choices',
    'updates',
  ]) {
    await expect(page.locator(`#privacy-${id}`)).toBeVisible();
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  expect(await (await page.request.get('/robots.txt')).text()).toBe(
    'User-agent: *\nDisallow: /\n',
  );
  expect((await page.request.get('/sitemap.xml')).status()).toBe(404);
  await page.getByRole('link', { name: 'Back to the website' }).click();
  await expect(page.locator('h1')).toContainText('Maria Fernanda');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
});

test('missing page has an accessible return path', async ({ page }) => {
  expect((await page.goto('/missing/'))?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('our way back');
  await page.getByRole('link', { name: 'Back to the homepage' }).click();
  await expect(page.locator('h1')).toContainText('Maria Fernanda');
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
]) {
  test(`desktop hero shows the full image at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const result = await page
      .locator('.hero-image')
      .evaluate(async (image: HTMLImageElement) => {
        await image.decode();
        const bounds = image.getBoundingClientRect();
        const hero = image.closest('.hero')!.getBoundingClientRect();
        return {
          ratio: bounds.width / bounds.height,
          originalRatio: image.naturalWidth / image.naturalHeight,
          top: bounds.top - hero.top,
          bottom: hero.bottom - bounds.bottom,
          left: bounds.left - hero.left,
          right: hero.right - bounds.right,
        };
      });
    expect(result.ratio).toBeCloseTo(result.originalRatio, 2);
    for (const edge of [result.top, result.bottom, result.left, result.right])
      expect(edge).toBeGreaterThanOrEqual(-1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test('social icons retain accessible platform names and no WhatsApp', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.locator('.social-row [data-social-icon="instagram"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('.social-row [data-social-icon="facebook"]'),
  ).toHaveCount(1);
  await expect(page.locator('.social-row')).not.toContainText('WhatsApp');
  await expect(page.locator('.social-row a[href]')).toHaveCount(0);
  for (const platform of ['Instagram', 'Facebook']) {
    const icon = page
      .locator('.social-pending')
      .filter({ hasText: `${platform} link to be added` });
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute(
      'title',
      `${platform} — link to be added`,
    );
    expect((await icon.boundingBox())!.width).toBeGreaterThanOrEqual(44);
  }
});
