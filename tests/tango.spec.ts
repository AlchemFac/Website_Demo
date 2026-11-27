import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1440]) {
  test(`tango homepage works at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    expect((await page.goto('/'))?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Fernanda Delgado');
    await expect(page).toHaveTitle(/Fernanda Delgado Tango/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Dallas–Fort Worth/,
    );
    await expect(page.locator('.lesson-card')).toHaveCount(8);
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
      if (target.protocol === 'mailto:' || target.protocol === 'tel:') continue;
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
    'Social dance partnering',
  );
  const faq = page.locator('details').first();
  await faq.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(faq.locator('p')).toBeVisible();
  await expect(page.locator('.lesson-note')).toContainText(
    'Contact Fernanda for pricing',
  );
  await expect(page.locator('form')).toHaveCount(1);
  await expect(page.locator('#contact-service')).toHaveValue('partnering');
});

test('public contacts work while form demo and pending socials make no external requests', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4340')
      external.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('#form-notice')).toContainText(
    'nothing is sent or saved',
  );
  await expect(page.locator('.pending-value')).toHaveCount(0);
  await expect(
    page.locator('.social-pending[aria-disabled="true"]'),
  ).toHaveCount(2);
  await expect(page.locator('iframe')).toHaveCount(0);
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
  await expect(page.locator('h1')).toContainText('Fernanda Delgado');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
});

test('missing page has an accessible return path', async ({ page }) => {
  expect((await page.goto('/missing/'))?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('our way back');
  await page.getByRole('link', { name: 'Back to the homepage' }).click();
  await expect(page.locator('h1')).toContainText('Fernanda Delgado');
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

test('questionnaire identity, public contacts, services and approved palette are applied', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.brand-logo')).toHaveCount(2);
  await expect(page.locator('.wordmark').first()).toHaveAccessibleName(
    'Fernanda Delgado Tango homepage',
  );
  await expect(page.locator('#about')).toContainText(
    'María Fernanda Delgado García',
  );
  await expect(page.locator('.contact-value[href^="mailto:"]')).toHaveAttribute(
    'href',
    'mailto:fernanda.fd93@gmail.com',
  );
  await expect(page.locator('.contact-value[href^="tel:"]')).toHaveAttribute(
    'href',
    'tel:+12148997168',
  );
  await expect(page.locator('.contact-hours')).toContainText('9 AM–8 PM');
  await expect(page.locator('.hours-note')).toContainText(
    'Days and lesson availability to be confirmed',
  );
  for (const title of [
    'Milonga organization',
    'Tango DJ',
    'Salon tango performances',
    'Stage tango performances',
    'Class assistance',
    'Social dance partnering',
  ])
    await expect(page.locator('#lessons')).toContainText(title);
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary')
        .trim(),
    ),
  ).toBe('#584334');
  await expect(page.locator('.portfolio-photo')).toHaveCount(5);
  await expect(page.locator('.portfolio-photo figcaption')).toContainText([
    'Fernanda Delgado.',
    'A portrait in magenta.',
    'Louis Parks',
    'Louis Parks',
    'Louis Parks',
  ]);
  await expect(page.locator('[data-video-file]')).toHaveCount(1);
  await expect(page.locator('.student-reviews')).toHaveCount(0);
});

test('tango demo form validates its own services and never sends or stores an inquiry', async ({
  page,
}) => {
  const sent: string[] = [];
  page.on('request', (request) => {
    if (['fetch', 'xhr'].includes(request.resourceType()))
      sent.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('form')).toHaveAttribute('data-endpoint', '');
  const submit = page.getByRole('button', {
    name: 'Check demo form',
    exact: true,
  });
  await submit.click();
  await expect(page.locator('#contact-name')).toBeFocused();
  await expect(page.locator('[data-error-summary]')).toContainText('4 fields');
  await expect(page.locator('#message-error')).toContainText(
    'lesson or event inquiry',
  );
  await page.locator('#contact-name').fill('Synthetic Test');
  await page.locator('#contact-email').fill('test@example.com');
  await page.locator('#contact-service').selectOption('dj');
  await page.locator('#contact-message').fill('Synthetic automated check.');
  await submit.click();
  await expect(page.locator('[data-form-status]')).toContainText(
    'Nothing has been sent or saved',
  );
  expect(sent).toEqual([]);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
});

test('monthly events navigate across years without inventing availability', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-12-15T18:00:00Z') });
  await page.goto('/');
  await expect(page.locator('[data-month-title]')).toHaveText('December 2026');
  await expect(page.locator('.calendar-day')).toHaveCount(31);
  await page.getByRole('button', { name: 'Next month' }).click();
  await expect(page.locator('[data-month-title]')).toHaveText('January 2027');
  await expect(page.locator('.calendar-empty')).toContainText(
    'No events have been published',
  );
  await page.getByRole('button', { name: 'Previous month' }).click();
  await expect(page.locator('[data-month-title]')).toHaveText('December 2026');
  await expect(page.locator('.event-listing, .event-dot')).toHaveCount(0);
});

test('video players load only after an explicit choice and close cleanly', async ({
  page,
}) => {
  let external = 0;
  await page.route('https://www.youtube-nocookie.com/**', (route) => {
    external++;
    return route.fulfill({
      contentType: 'text/html',
      body: '<p>Synthetic video player</p>',
    });
  });
  await page.route('http://127.0.0.1:4340/', async (route) => {
    const response = await route.fetch();
    const html = (await response.text()).replace(
      '</main>',
      '<div data-video-stage><button type="button" data-video-embed="https://www.youtube-nocookie.com/embed/abcdefghijk" data-video-title="Synthetic video">Play synthetic video</button></div></main>',
    );
    await route.fulfill({ response, body: html });
  });
  await page.goto('/');
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(external).toBe(0);
  await page.getByRole('button', { name: 'Play synthetic video' }).click();
  await expect(page.locator('iframe')).toHaveAttribute(
    'title',
    'Synthetic video',
  );
  await expect.poll(() => external).toBe(1);
  await page.getByRole('button', { name: 'Close video' }).click();
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Play synthetic video' }),
  ).toBeFocused();
});

test('original photos and credits remain visible without gallery crops', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('.about-figure img')).toHaveAttribute(
    'alt',
    /Portrait of Fernanda Delgado/,
  );
  await expect(page.locator('.about-figure figcaption')).toHaveText(
    'Fernanda Delgado',
  );
  await expect(page.locator('.portfolio-photo')).toHaveCount(5);
  await expect(page.locator('.portfolio-photo--wide')).toHaveCount(1);
  await expect(
    page
      .locator('.portfolio-photo figcaption')
      .filter({ hasText: 'Louis Parks' }),
  ).toHaveCount(3);
  for (const image of await page.locator('.portfolio-photo img').all()) {
    await image.scrollIntoViewIfNeeded();
    const dimensions = await image.evaluate(async (img: HTMLImageElement) => {
      await img.decode();
      const box = img.getBoundingClientRect();
      return {
        displayed: box.width / box.height,
        original: img.naturalWidth / img.naturalHeight,
      };
    });
    expect(dimensions.displayed).toBeCloseTo(dimensions.original, 2);
  }
});

test('local clip loads only on Play, preserves its frame and closes cleanly', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/media/')) requests.push(request.url());
  });
  await page.goto('/');
  const play = page.getByRole('button', {
    name: 'Play A moment of tango practice',
    exact: true,
  });
  await play.scrollIntoViewIfNeeded();
  await expect(play.locator('img')).toHaveAttribute('loading', 'lazy');
  await expect(page.locator('video')).toHaveCount(0);
  expect(requests).toEqual([]);
  await play.click();
  const video = page.locator('video.local-video');
  await expect(video).toHaveAttribute('src', '/media/tango-practice.mp4');
  await expect(video).toHaveJSProperty('controls', true);
  await expect(video).toHaveJSProperty('playsInline', true);
  await expect(video).not.toHaveAttribute('autoplay', /.*/);
  await expect
    .poll(() => video.evaluate((el: HTMLVideoElement) => el.readyState))
    .toBeGreaterThanOrEqual(2);
  await expect
    .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
    .toBeGreaterThan(0);
  expect(
    await video.evaluate((el: HTMLVideoElement) => el.duration),
  ).toBeCloseTo(8.93, 1);
  expect(
    await video.evaluate(
      (el: HTMLVideoElement) => el.videoWidth / el.videoHeight,
    ),
  ).toBeCloseTo(720 / 1280, 2);
  expect(requests.length).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Close video' }).click();
  await expect(page.locator('video')).toHaveCount(0);
  await expect(play).toBeFocused();
});
