import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { request } from 'node:http';
import { createPreviewServer } from '../scripts/preview.mjs';
import { distDirectory, projectRoot, pageFiles } from '../lib/project.mjs';

test('publishing includes public assets and notices, never workspace material', () => {
  const top = readdirSync(distDirectory).sort();
  assert.deepEqual(
    top,
    [...pageFiles, 'sw.js', 'assets', '.nojekyll', 'LICENSE', 'THIRD_PARTY_NOTICES.md'].sort(),
  );
  for (const file of pageFiles) {
    const html = readFileSync(join(distDirectory, file), 'utf8');
    assert.equal(html, readFileSync(join(projectRoot, file), 'utf8'));
    for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
      const path = match[1].split('#')[0];
      if (/^(https?:|data:|mailto:)/.test(path)) continue;
      assert.ok(existsSync(resolve(distDirectory, path)), `${file}: missing packaged ${path}`);
    }
  }
  assert.ok(existsSync(join(distDirectory, 'assets/licenses/Lucide-ISC.txt')));
  assert.ok(existsSync(join(distDirectory, 'assets/licenses/Feather-MIT.txt')));
  assert.ok(existsSync(join(distDirectory, 'assets/fonts/NotoSerifTamil-OFL.txt')));
  const walk = (folder) => {
    for (const item of readdirSync(folder, { withFileTypes: true })) {
      const path = join(folder, item.name);
      if (item.isDirectory()) walk(path);
      else {
        assert.doesNotMatch(item.name, /\.(zip|jpg|mjs|json|log)$/);
        if (item.name.endsWith('.css')) {
          for (const [, url] of readFileSync(path, 'utf8').matchAll(
            /url\(['"]?([^'"\)]+)['"]?\)/g,
          )) {
            if (!/^(https?:|data:)/.test(url))
              assert.ok(existsSync(resolve(dirname(path), url)), url);
          }
        }
      }
    }
  };
  walk(distDirectory);
});

test('preview serves the publishing artifact and rejects unsafe or unsupported requests', async (t) => {
  const server = await createPreviewServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const get = (path, method = 'GET') =>
    new Promise((resolve, reject) => {
      const req = request(
        { hostname: '127.0.0.1', port: server.address().port, path, method },
        (response) => {
          let body = '';
          response.setEncoding('utf8');
          response.on('data', (part) => (body += part));
          response.on('end', () =>
            resolve({ status: response.statusCode, headers: response.headers, body }),
          );
        },
      );
      req.on('error', reject);
      req.end();
    });
  const home = await get('/');
  assert.equal(home.status, 200);
  assert.match(home.body, /<html lang="en">/);
  assert.equal(home.headers['cache-control'], 'no-store');
  assert.match((await get('/assets/site.css')).headers['content-type'], /^text\/css/);
  assert.match((await get('/LICENSE')).body, /Dr\. Mylswamy Annadurai/);
  assert.equal((await get('/tamil.html', 'HEAD')).body, '');
  for (const path of ['/../package.json', '/%2e%2e/package.json', '/..%5cpackage.json', '/.env']) {
    assert.equal((await get(path)).status, 403, path);
  }
  for (const path of ['/package.json', '/old/content/homeindex.md', '/assets/']) {
    assert.equal((await get(path)).status, 404, path);
  }
  assert.equal((await get('/%zz')).status, 400);
  assert.equal((await get('/', 'POST')).status, 405);
});
