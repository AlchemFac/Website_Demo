import { test, expect, type Page } from '@playwright/test';

const endpoint = 'https://formspree.io/f/testform';
const captchaScript = `
window.captchaMock = { options: null, resets: 0 };
window.turnstile = {
  render(container, options) {
    container.textContent = 'Mock spam verification (no network)';
    window.captchaMock.options = options;
    options.callback('mock-token');
    return 'mock-widget';
  },
  reset() { window.captchaMock.resets++; window.captchaMock.options.callback('mock-token'); }
};`;

test.beforeEach(async ({ context }) => {
  // Fail closed: no provider request is ever allowed to leave this test context.
  await context.route('https://formspree.io/**', (route) =>
    route.abort('blockedbyclient'),
  );
  await context.route('https://challenges.cloudflare.com/**', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: captchaScript,
    }),
  );
});

async function openAndFill(page: Page) {
  await page.goto('/contact/');
  await expect(page.locator('[data-captcha-error]')).toHaveText(
    'Spam check complete.',
  );
  await page.locator('#contact-name').fill('Demo Test');
  await page.locator('#contact-email').fill('demo@example.com');
  await page.locator('#contact-service').selectOption('standard-cleaning');
  await page.locator('#contact-message').fill('Synthetic automated test only.');
}

test('configured form validates before contacting the provider', async ({
  page,
}) => {
  let requests = 0;
  await page.route(endpoint, (route) => {
    requests++;
    return route.abort();
  });
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Send test inquiry' }).click();
  await expect(page.locator('#contact-name')).toBeFocused();
  await expect(page.locator('[data-error-summary]')).toContainText('4 fields');
  expect(requests).toBe(0);
});

test('pending and accepted states prevent duplicate sends', async ({
  page,
}) => {
  let sends = 0;
  let release!: () => void;
  const barrier = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(endpoint, async (route) => {
    sends++;
    const body = route.request().postData() ?? '';
    expect(body).toContain('name="_gotcha"');
    expect(body).toContain('name="cf-turnstile-response"');
    expect(body).toContain('mock-token');
    expect(route.request().headers()['accept']).toBe('application/json');
    await barrier;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });
  await openAndFill(page);
  await page.getByRole('button', { name: 'Send test inquiry' }).click();
  await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true');
  await expect(
    page.getByRole('button', { name: 'Sending…', exact: true }),
  ).toBeDisabled();
  await page.locator('form').evaluate((form: HTMLFormElement) => {
    form.requestSubmit();
    form.requestSubmit();
  });
  release();
  await expect(page.locator('[data-form-status]')).toContainText(
    'accepted your test inquiry for processing',
  );
  await expect(page.locator('[data-form-status]')).toContainText(
    'not a booking confirmation or proof of email delivery',
  );
  await expect(page.locator('[data-form-status]')).toBeFocused();
  await expect(page.locator('#contact-name')).toBeDisabled();
  await page
    .locator('form')
    .evaluate((form: HTMLFormElement) => form.requestSubmit());
  expect(sends).toBe(1);
  await page.getByRole('button', { name: 'Start a new inquiry' }).click();
  await expect(page.locator('#contact-name')).toBeEmpty();
  await expect(page.locator('#contact-name')).toBeFocused();
  await expect(
    page.getByRole('button', { name: 'Send test inquiry' }),
  ).toBeEnabled();
});

for (const status of [403, 404, 422, 429, 500]) {
  test(`HTTP ${status} preserves entries and shows a useful error`, async ({
    page,
  }) => {
    await page.route(endpoint, (route) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [
            {
              field: 'email',
              message: '<script>private provider content</script>',
            },
          ],
        }),
      }),
    );
    await openAndFill(page);
    await page.getByRole('button', { name: 'Send test inquiry' }).click();
    await expect(page.locator('[data-submission-error]')).toBeVisible();
    await expect(page.locator('[data-submission-error]')).not.toBeEmpty();
    await expect(page.locator('[data-form-status]')).toBeEmpty();
    await expect(page.locator('#contact-message')).toHaveValue(
      'Synthetic automated test only.',
    );
    await expect(
      page.getByRole('button', { name: 'Send test inquiry' }),
    ).toBeEnabled();
    await expect(page.locator('body')).not.toContainText(
      'private provider content',
    );
    if (status === 422) {
      await expect(page.locator('#email-error')).toBeVisible();
      await expect(page.locator('#contact-email')).toBeFocused();
    }
    if (status === 429)
      await expect(page.locator('[data-submission-error]')).toContainText(
        'too many requests',
      );
  });
}

test('unrecognized success response never confirms acceptance', async ({
  page,
}) => {
  await page.route(endpoint, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<h1>Unexpected page</h1>',
    }),
  );
  await openAndFill(page);
  await page.getByRole('button', { name: 'Send test inquiry' }).click();
  await expect(page.locator('[data-submission-error]')).toContainText(
    'unexpected response',
  );
  await expect(page.locator('[data-form-status]')).toBeEmpty();
});

test('network failure is recoverable without automatic retry or personal-data logging', async ({
  page,
}) => {
  const consoleMessages: string[] = [];
  page.on('console', (message) => consoleMessages.push(message.text()));
  let sends = 0;
  await page.route(endpoint, (route) => {
    sends++;
    return route.abort('failed');
  });
  await openAndFill(page);
  await page.getByRole('button', { name: 'Send test inquiry' }).click();
  await expect(page.locator('[data-submission-error]')).toContainText(
    'could not confirm acceptance',
  );
  await expect(page.locator('#contact-email')).toHaveValue('demo@example.com');
  expect(sends).toBe(1);
  expect(consoleMessages.join('\n')).not.toMatch(
    /demo@example\.com|Demo Test|Synthetic automated/,
  );
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
});

test('request timeout does not claim failure to deliver or retry automatically', async ({
  page,
}) => {
  let sends = 0;
  await page.clock.install();
  await page.route(endpoint, () => {
    sends++;
  });
  await openAndFill(page);
  await page.getByRole('button', { name: 'Send test inquiry' }).click();
  await page.clock.fastForward(21000);
  await expect(page.locator('[data-submission-error]')).toContainText(
    'may already have received',
  );
  await expect(
    page.getByRole('button', { name: 'Send test inquiry' }),
  ).toBeEnabled();
  expect(sends).toBe(1);
});

test('spam-check failure blocks submission and offers retry', async ({
  page,
}) => {
  await page.route('https://challenges.cloudflare.com/**', (route) =>
    route.abort(),
  );
  let sends = 0;
  await page.route(endpoint, (route) => {
    sends++;
    return route.abort();
  });
  await page.goto('/contact/');
  await expect(page.locator('[data-captcha-error]')).toContainText(
    'unavailable or expired',
  );
  await expect(
    page.getByRole('button', { name: 'Retry spam protection' }),
  ).toBeVisible();
  await page.route('https://challenges.cloudflare.com/**', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: captchaScript,
    }),
  );
  await page.getByRole('button', { name: 'Retry spam protection' }).click();
  await expect(page.locator('[data-captcha-error]')).toHaveText(
    'Spam check complete.',
  );
  expect(sends).toBe(0);
});

test('expired tokens and filled honeypots cannot submit', async ({ page }) => {
  let sends = 0;
  await page.route(endpoint, (route) => {
    sends++;
    return route.abort();
  });
  await openAndFill(page);
  await page.evaluate(() =>
    (
      window as unknown as {
        captchaMock: { options: { 'expired-callback': () => void } };
      }
    ).captchaMock.options['expired-callback'](),
  );
  await page.getByRole('button', { name: 'Send test inquiry' }).click();
  await expect(page.locator('[data-turnstile]')).toBeFocused();
  await page.getByRole('button', { name: 'Retry spam protection' }).click();
  await page.locator('[name="_gotcha"]').evaluate((input: HTMLInputElement) => {
    input.value = 'bot-filled';
  });
  await page.getByRole('button', { name: 'Send test inquiry' }).click();
  await expect(page.locator('[data-submission-error]')).toContainText(
    'Unable to submit',
  );
  expect(sends).toBe(0);
});

test('compact spam widget does not introduce mobile overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/contact/');
  await expect(page.locator('[data-captcha-error]')).toHaveText(
    'Spam check complete.',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
