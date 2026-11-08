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
