import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1440]) {
  test(`promotional website works at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    expect((await page.goto('/'))?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('A proper website.');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('#starter-title')).toHaveText('Starter');
    await expect(page.locator('#business-title')).toHaveText('Business');
    await expect(page.locator('.price').nth(0)).toContainText('599');
    await expect(page.locator('.price').nth(1)).toContainText('999');
    await expect(page.locator('#care')).toContainText('$59');
    await expect(page.locator('#care')).toContainText('$99');
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((el: HTMLImageElement) => el.decode());
      await expect(image).toHaveAttribute('alt', /\S/);
      await expect(image).toHaveAttribute('width', /\d+/);
      await expect(image).toHaveAttribute('src', /\.webp$/);
    }
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute('href')!),
      )) {
      const target = new URL(href, page.url());
      expect(target.pathname).toBe('/');
      if (target.hash)
        expect(
          await page.locator(`[id="${target.hash.slice(1)}"]`).count(),
        ).toBe(1);
    }
  });
}

test('pricing choices, FAQs and ownership terms are usable', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('[data-plan="business"]').click();
  await expect(page.locator('[data-selected-plan]')).toHaveText(
    'Business · $999 one time',
  );
  await page.locator('[data-plan="starter"]').click();
  await expect(page.locator('[data-selected-plan]')).toHaveText(
    'Starter · $599 one time',
  );
  const ownership = page.locator('details').first();
  await ownership.locator('summary').click();
  await expect(ownership.locator('p')).toBeVisible();
  await expect(ownership.locator('p')).toContainText(
    'Canceling optional care does not remove your site',
  );
  await expect(page.locator('#care')).toContainText(
    'No 12-month care commitment',
  );
  await expect(page.locator('#example')).toContainText(
    'not a completed client engagement',
  );
});

test('mobile menu handles keyboard and focus without losing the destination', async ({
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
  await expect(page.locator('#studio-nav a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.locator('#studio-nav a').first().click();
  await expect(page.locator('#packages')).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('preview is honest about pending contact details and indexing', async ({
  page,
}) => {
  const calls: string[] = [];
  page.on('request', (request) => {
    if (['fetch', 'xhr'].includes(request.resourceType()))
      calls.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('.preview-banner')).toContainText(
    'Business name and contact details to be finalized',
  );
  await expect(page.locator('.brand').first()).toContainText(
    '[Your Business Name]',
  );
  await expect(page.locator('[aria-disabled="true"]')).toHaveText(
    'Contact opening soon',
  );
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  expect(await (await page.request.get('/robots.txt')).text()).toBe(
    'User-agent: *\nDisallow: /\n',
  );
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
  expect(calls).toEqual([]);
});

test('404 provides a working route back to the promotional homepage', async ({
  page,
}) => {
  expect((await page.goto('/missing-page/'))?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Let’s get you back on track.');
  await page.getByRole('link', { name: 'Return to homepage' }).click();
  await expect(page.locator('h1')).toContainText('A proper website.');
});
