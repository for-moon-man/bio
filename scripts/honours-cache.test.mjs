import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { chromium } from 'playwright';
import { createPreviewServer } from './preview.mjs';

test(
  'honours cache warms from home, updates safely and works under a project path',
  { timeout: 30000 },
  async (t) => {
    const preview = await createPreviewServer();
    const original = readFileSync(new URL('../dist/honours.html', import.meta.url), 'utf8');
    let version = 1;
    let invalid = false;
    const server = createServer((request, response) => {
      if (!request.url.startsWith('/bio/')) return response.writeHead(404).end();
      request.url = request.url.slice(4);
      if (request.url === '/honours.html') {
        const content = invalid
          ? '<html>Host error</html>'
          : original.replace(
              '</head>',
              `<meta name="cache-test-version" content="${version}"></head>`,
            );
        // Keep the first cached render observable before revalidation completes.
        setTimeout(
          () =>
            response
              .writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' })
              .end(content),
          100,
        );
      } else preview.emit('request', request, response);
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}/bio/`;
    const browser = await chromium.launch();
    t.after(async () => {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    });
    const context = await browser.newContext();
    await context.route('**/*', (route) =>
      route.request().url().startsWith(base) ? route.continue() : route.abort(),
    );
    const page = await context.newPage();
    await page.clock.install();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base + 'index.html');
    const cached = async () =>
      page.evaluate(async (url) => {
        for (const name of await caches.keys()) {
          const match = await (await caches.open(name)).match(url);
          if (match) return match.text();
        }
        return '';
      }, base + 'honours.html');
    await page.evaluate(async (url) => {
      const deadline = Date.now() + 5000;
      do {
        for (const name of await caches.keys())
          if (await (await caches.open(name)).match(url)) return;
        await new Promise((resolve) => setTimeout(resolve, 50));
      } while (Date.now() < deadline);
      throw new Error('Homepage did not warm the honours cache');
    }, base + 'honours.html');
    assert.match(await cached(), /cache-test-version" content="1"/);
    const refresh = () =>
      page.evaluate(async () => {
        const registration = await navigator.serviceWorker.ready;
        await new Promise((resolve) => {
          const channel = new MessageChannel();
          channel.port1.onmessage = () => {
            channel.port1.close();
            resolve();
          };
          registration.active.postMessage({ type: 'refresh-honours' }, [channel.port2]);
        });
      });
    await page.goto(base + 'honours.html');
    await refresh();
    assert.equal(
      await page.locator('.honours-update').count(),
      0,
      'Unchanged content creates no update notice',
    );
    version = 2;
    await page.clock.fastForward(5 * 60 * 1000);
    await page.waitForSelector('.honours-update a');
    assert.match(await cached(), /cache-test-version" content="2"/);
    assert.equal(
      await page.locator('meta[name="cache-test-version"]').getAttribute('content'),
      '1',
      'Reading is not interrupted by replacement',
    );
    await Promise.all([page.waitForNavigation(), page.locator('.honours-update a').click()]);
    assert.equal(
      await page.locator('meta[name="cache-test-version"]').getAttribute('content'),
      '2',
    );
    invalid = true;
    await refresh();
    assert.match(
      await cached(),
      /cache-test-version" content="2"/,
      'An HTTP 200 host error never replaces the archive',
    );
    await context.setOffline(true);
    await page.goto(base + 'honours.html');
    assert.equal(
      await page.locator('.award-row').count(),
      79,
      'Cached archive remains readable offline',
    );
    assert.deepEqual(errors, []);
  },
);
