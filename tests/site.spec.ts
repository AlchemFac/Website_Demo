import { test, expect } from '@playwright/test';

for (const width of [320, 768, 1440]) {
  test(`pages and navigation work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/services/',
      '/about/',
      '/gallery/',
      '/contact/',
    ]) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (width < 1024)
        await page.getByRole('button', { name: 'Menu', exact: true }).click();
      const current = page.locator(
        'nav[aria-label="Main navigation"] [aria-current="page"]',
      );
      await expect(current).toHaveAttribute('href', route);
      const destination = route === '/contact/' ? '/services/' : '/contact/';
      await page
        .locator(`nav[aria-label="Main navigation"] a[href="${destination}"]`)
        .click();
      await expect(page).toHaveURL(new RegExp(`${destination}$`));
    }
  });
}

test('gallery images load with descriptions and responsive sources', async ({
  page,
}) => {
  await page.goto('/gallery/');
  const photos = page.locator('main figure img');
  await expect(photos).toHaveCount(3);
  for (const image of await photos.all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element: HTMLImageElement) => element.decode());
    await expect(image).toHaveAttribute('alt', /AI-generated/);
    await expect(image).toHaveAttribute('srcset', /360w.*640w.*960w/);
    await expect(image).toHaveAttribute('src', /\.webp$/);
  }
  await expect(page.locator('main figure').first()).toContainText(
    'Not a customer home',
  );
});

test('contact validation is accessible and never delivers the demo inquiry', async ({
  page,
}) => {
  await page.goto('/contact/');
  await expect(page.locator('form fieldset')).toBeEnabled();
  const requests: string[] = [];
  page.on('request', (request) => {
    if (
      request.isNavigationRequest() ||
      ['fetch', 'xhr'].includes(request.resourceType())
    )
      requests.push(request.url());
  });
  const check = page.getByRole('button', { name: 'Check demo form' });
  await check.click();
  await expect(page.getByRole('alert')).toContainText('4 fields');
  await expect(page.getByLabel('Name', { exact: false })).toBeFocused();
  await expect(page.locator('#contact-name')).toHaveAttribute(
    'aria-describedby',
    'name-error',
  );
  await expect(page.locator('#name-error')).toBeVisible();
  await page.locator('#contact-name').fill('   ');
  await check.click();
  await expect(page.locator('#contact-name')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await page.locator('#contact-name').fill('Demo User');
  await page.locator('#contact-email').fill('invalid');
  await page.locator('#contact-phone').fill('abc');
  await page.locator('#contact-service').selectOption('not-sure');
  await page.locator('#contact-message').fill('Sample inquiry only.');
  await check.click();
  await expect(page.locator('#email-error')).toContainText('valid email');
  await expect(page.locator('#phone-error')).toBeVisible();
  await page.locator('#contact-email').fill('demo@example.com');
  for (const phone of ['', '+1 (214) 555-0100']) {
    await page.locator('#contact-phone').fill(phone);
    await check.click();
    await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
    await expect(page.locator('[data-form-status]')).toContainText(
      'nothing has been sent or saved',
    );
  }
  await page.locator('#contact-message').fill('');
  await expect(page.locator('[data-form-status]')).toBeEmpty();
  await page.locator('#contact-name').press('Enter');
  await expect(page.locator('#message-error')).toBeVisible();
  expect(requests).toEqual([]);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
});

test('contact stays disabled without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/contact/');
  await expect(
    page.getByRole('button', { name: 'Check demo form' }),
  ).toBeDisabled();
  await expect(page.locator('#contact-email')).toBeDisabled();
  await expect(page.locator('noscript p.notice')).toBeVisible();
  await expect(page.locator('noscript p.notice')).toContainText(
    'JavaScript is required',
  );
  await context.close();
});

test('page metadata, headings, images, and internal destinations are valid', async ({
  page,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const destinations = new Set<string>();
  for (const route of [
    '/',
    '/services/',
    '/about/',
    '/gallery/',
    '/contact/',
    '/404.html',
  ]) {
    await page.goto(route);
    const title = await page.title();
    expect(title.trim()).not.toBe('');
    expect(titles.has(title)).toBe(false);
    titles.add(title);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(description?.trim()).toBeTruthy();
    expect(descriptions.has(description!)).toBe(false);
    descriptions.add(description!);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
    const levels = await page
      .locator('h1,h2,h3,h4,h5,h6')
      .evaluateAll((headings) => headings.map((h) => Number(h.tagName[1])));
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++)
      expect(levels[i]).toBeLessThanOrEqual(levels[i - 1] + 1);
    const ids = await page
      .locator('[id]')
      .evaluateAll((nodes) => nodes.map((n) => n.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const image of await page.locator('main img').all()) {
      await expect(image).toHaveAttribute('alt', /\S/);
      await expect(image).toHaveAttribute('width', /\d+/);
      await expect(image).toHaveAttribute('height', /\d+/);
    }
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')!))) {
      const target = new URL(href, page.url());
      if (target.origin !== new URL(page.url()).origin) continue;
      destinations.add(target.pathname);
      if (target.pathname === new URL(page.url()).pathname && target.hash)
        expect(ids).toContain(decodeURIComponent(target.hash.slice(1)));
    }
  }
  for (const destination of destinations)
    expect((await page.request.get(destination)).ok(), destination).toBe(true);
  const robots = await page.request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toBe('User-agent: *\nDisallow: /\n');
  expect((await page.request.get('/sitemap.xml')).status()).toBe(404);
});

test('mobile keyboard menu, skip link, and focus visibility work', async ({
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
  await expect(page.locator('#main-navigation a').first()).toBeFocused();
  const outline = await page
    .locator('#main-navigation a')
    .first()
    .evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe('none');
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const footerContact = page.locator('footer a[href="/contact/"]');
  await footerContact.focus();
  await footerContact.evaluate((el) => el.scrollIntoView({ block: 'nearest' }));
  const focused = await footerContact.boundingBox();
  const sticky = await page.locator('.mobile-cta').boundingBox();
  expect(focused!.y + focused!.height).toBeLessThanOrEqual(sticky!.y);
});

test('200 percent text sizing remains within a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of [
    '/',
    '/services/',
    '/about/',
    '/gallery/',
    '/contact/',
  ]) {
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
});
