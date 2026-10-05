import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createPreviewServer } from './preview.mjs';
import { projectRoot, pageFiles } from '../lib/project.mjs';

const captures = join(projectRoot, 'test-results');
mkdirSync(captures, { recursive: true });
const server = await createPreviewServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.route('**/*', (route) =>
    route.request().url().startsWith(base) ? route.continue() : route.abort(),
  );
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith(base) && response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const file of pageFiles) {
      await page.goto(base + file);
      // Exercise every local image, including images below the fold and in details.
      await page.locator('img[src]').evaluateAll(async (images) => {
        for (const image of images) image.loading = 'eager';
        await Promise.all(images.map((image) => image.decode()));
      });
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${file} overflows at ${width}px`,
      );
      assert.deepEqual(
        await page
          .locator('img[src]')
          .evaluateAll((images) =>
            images
              .filter((image) => image.complete && !image.naturalWidth)
              .map((image) => image.src),
          ),
        [],
        file,
      );
      assert.ok(await page.locator('footer .site-legal').count(), `${file}: copyright notice`);
      if ([1440, 390].includes(width)) {
        await page.locator('.reveal').evaluateAll((elements) => {
          elements.forEach((element) => element.classList.add('in-view'));
        });
        await page.screenshot({
          path: join(captures, `${file}-${width}-full.png`),
          fullPage: true,
        });
      }
      if (['index.html', 'tamil.html'].includes(file) && [1440, 320].includes(width)) {
        await page.screenshot({ path: join(captures, `${file}-${width}.png`) });
        const frame = page.locator('#upcoming-events iframe');
        const url = new URL(await frame.getAttribute('src'));
        assert.equal(url.hostname, 'calendar.google.com');
        assert.equal(url.searchParams.get('src'), 'mylswamy.annadurai.calendar@gmail.com');
        assert.equal(url.searchParams.get('ctz'), 'Asia/Kolkata');
        assert.equal(url.searchParams.get('hl'), file === 'tamil.html' ? 'ta' : 'en');
        assert.equal(url.searchParams.get('mode'), 'AGENDA');
        assert.ok(await frame.getAttribute('title'));
      }
    }
  }
  console.log('All seven pages fit 320–1440 px; images and calendar configuration passed.');

  for (const file of ['biography.html', 'gallery.html', 'tamil.html']) {
    await page.goto(base + file);
    const collage = page.locator('.vintage-photo img').first();
    await collage.scrollIntoViewIfNeeded();
    const size = await collage.boundingBox();
    assert.ok(Math.abs(size.width / size.height - 2.5) < 0.02, `${file}: uncropped collage`);
    await collage.screenshot({ path: join(captures, `${file}-collage.png`) });
  }

  for (const file of ['biography.html', 'tamil.html', 'gallery.html']) {
    await page.goto(base + file + (file === 'gallery.html' ? '#archive-books' : '#books'));
    assert.equal(await page.locator('.book-card').count(), 5);
    for (const cover of await page.locator('.book-cover img').all()) {
      await cover.scrollIntoViewIfNeeded();
      await page.waitForFunction(
        (image) => image.complete && image.naturalWidth > 0,
        await cover.elementHandle(),
      );
    }
    await page.locator('.book-details summary').first().click();
    assert.ok(
      await page
        .locator('.book-details')
        .first()
        .evaluate((element) => element.open),
    );
    if (file === 'gallery.html') {
      await page.selectOption('#gallery-category', 'books');
      assert.equal(await page.locator('[data-collection]:not([hidden])').count(), 1);
      assert.ok(await page.locator('#archive-books').isVisible());
      await page.selectOption('#gallery-category', 'photos');
      assert.equal(await page.locator('#archive-books').isVisible(), false);
      await page.selectOption('#gallery-category', 'all');
      assert.equal(await page.locator('[data-collection]:not([hidden])').count(), 9);
    }
  }

  await page.goto(base + 'index.html');
  await page.locator('.menu-toggle').click();
  await page.locator('#navigation a[href="index.html#upcoming-events"]').click();
  assert.ok(page.url().endsWith('#upcoming-events'));
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  await page.locator('.language').click();
  assert.ok(page.url().endsWith('tamil.html'));
  await page.locator('.masthead nav a[href="#upcoming-events"]').click();
  assert.ok(page.url().endsWith('#upcoming-events'));
  await page.locator('.language').click();
  assert.ok(page.url().endsWith('index.html'));

  await page.goto(base + 'honours.html');
  assert.equal(await page.locator('.award-row:not([hidden])').count(), 79);
  await page.fill('#award-search', '  padma SHRI  ');
  assert.equal(await page.locator('.award-row:not([hidden])').count(), 1);
  await page.fill('#award-search', 'unmatched-term-xx');
  assert.ok(await page.locator('#no-results').isVisible());
  await page.locator('[type=reset]').click();
  await page.waitForFunction(
    () => document.querySelector('#result-count').textContent === '79 entries',
  );
  assert.equal(await page.locator('.award-row:not([hidden])').count(), 79);

  for (const file of ['biography.html', 'tamil.html']) {
    await page.goto(base + file);
    for (const [era, count] of [
      ['education', 3],
      ['isro', 15],
      ['beyond', 19],
      ['all', 37],
    ]) {
      await page.locator(`[data-era-filter=${era}]`).click();
      assert.equal(await page.locator('.timeline-row:not([hidden])').count(), count);
    }
  }
  await page.goto(base + 'gallery.html');
  for (const [kind, count] of [
    ['talk', 4],
    ['interview', 3],
    ['profile', 1],
    ['all', 8],
  ]) {
    await page.selectOption('#video-kind', kind);
    assert.equal(await page.locator('[data-video-kind]:not([hidden])').count(), count);
  }
  const photo = page.locator('[data-photo]').first();
  await photo.focus();
  await page.keyboard.press('Enter');
  assert.ok(await page.locator('#photo-dialog').evaluate((element) => element.open));
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#photo-dialog').evaluate((element) => element.open), false);
  assert.ok(await photo.evaluate((element) => element === document.activeElement));
  assert.equal(await page.locator('iframe').count(), 0);
  await page.locator('[data-video-kind="talk"] [data-video]').first().click();
  assert.equal(await page.locator('iframe').count(), 1);
  assert.ok(
    (await page.locator('iframe').getAttribute('src')).startsWith(
      'https://www.youtube-nocookie.com/embed/',
    ),
  );
  await page.selectOption('#video-kind', 'profile');
  assert.equal(await page.locator('iframe').count(), 0, 'Filtering removes active players');
  assert.equal(await page.locator('[data-stop-video]:visible').count(), 0);
  const youtubeRequests = [];
  const trackYouTube = (request) => {
    if (/youtube|ytimg|googlevideo/.test(new URL(request.url()).hostname))
      youtubeRequests.push(request.url());
  };
  page.on('request', trackYouTube);
  for (const file of [
    'index.html',
    'biography.html',
    'missions.html',
    'gallery.html',
    'tamil.html',
  ]) {
    youtubeRequests.length = 0;
    await page.goto(base + file);
    assert.equal(youtubeRequests.length, 0, `${file}: no YouTube requests before consent`);
    assert.equal(await page.locator('[data-stop-video]:visible').count(), 0);
    const load = page.locator('[data-video]').first();
    await load.click();
    const frame = page.locator('.video-player iframe');
    const url = new URL(await frame.getAttribute('src'));
    assert.equal(url.hostname, 'www.youtube-nocookie.com');
    assert.equal(url.searchParams.get('autoplay'), '0');
    assert.equal(url.searchParams.get('hl'), file === 'tamil.html' ? 'ta' : 'en');
    assert.equal(await frame.getAttribute('referrerpolicy'), 'strict-origin-when-cross-origin');
    assert.ok(await frame.getAttribute('title'));
    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `${file}: loaded player fits mobile`,
    );
    await page.locator('[data-stop-video]:visible').click();
    assert.equal(await page.locator('.video-player iframe').count(), 0);
    assert.ok(await load.evaluate((element) => document.activeElement === element));
  }
  page.off('request', trackYouTube);
  assert.deepEqual(errors, []);

  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
  });
  await noJs.route('**/*', (route) =>
    route.request().url().startsWith(base) ? route.continue() : route.abort(),
  );
  const plain = await noJs.newPage();
  for (const file of pageFiles) {
    await plain.goto(base + file);
    assert.ok(
      await plain.locator(file === 'tamil.html' ? '.masthead nav' : '#navigation').isVisible(),
      file,
    );
    assert.ok(
      await plain.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `${file}: no-JavaScript layout`,
    );
    assert.equal(await plain.locator('[data-enhanced]:visible').count(), 0);
  }
  console.log(
    'Language navigation, calendar links, filters, keyboard photo viewer, videos, and no-JavaScript layouts passed.',
  );
  console.log(
    `Review screenshots in ${captures}. External services were blocked for repeatable checks.`,
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
