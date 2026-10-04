// Cache only the reviewed honours page from this deployment, never LinkedIn.
const scope = new URL(self.registration.scope);
const archiveURL = new URL('honours.html', scope).href;
const cachePrefix = `annadurai-honours:${scope.pathname}:`;
const cacheName = `${cachePrefix}v1`;
let inFlight;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith(cachePrefix) && name !== cacheName)
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

function refreshArchive() {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      // Let the browser revalidate its HTTP cache (ETag/Last-Modified when supplied).
      const response = await fetch(archiveURL, { cache: 'no-cache', signal: controller.signal });
      if (
        !response.ok ||
        response.redirected ||
        !response.headers.get('content-type')?.includes('text/html')
      )
        return;
      const content = await response.clone().text();
      // Avoid caching host error pages that happen to return HTTP 200.
      if (!content.includes('id="honours-archive"') || !content.includes('id="award-list"')) return;
      const cache = await caches.open(cacheName);
      const previous = await cache.match(archiveURL);
      const changed = previous && (await previous.text()) !== content;
      if (!previous || changed) await cache.put(archiveURL, response.clone());
      if (changed) {
        for (const client of await self.clients.matchAll({ type: 'window' })) {
          if (new URL(client.url).pathname === new URL(archiveURL).pathname)
            client.postMessage({ type: 'honours-updated' });
        }
      }
      return response;
    } catch {
      // Keep the last successful archive on network or storage failure.
    } finally {
      clearTimeout(timeout);
    }
  })().finally(() => {
    inFlight = undefined;
  });
  return inFlight;
}

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'refresh-honours' || !event.source?.url) return;
  const source = new URL(event.source.url);
  if (source.origin !== scope.origin || !source.pathname.startsWith(scope.pathname)) return;
  event.waitUntil(
    refreshArchive().then(() => {
      event.ports[0]?.postMessage({ type: 'honours-refresh-complete' });
    }),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate' || request.url !== archiveURL) return;
  const fresh = refreshArchive();
  event.waitUntil(fresh);
  event.respondWith(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        const saved = await cache.match(archiveURL);
        // Explicit reloads request the newly published version, including the update link.
        if (request.cache === 'reload' || request.cache === 'no-cache')
          return (await fresh) || saved || fetch(request);
        return saved || (await fresh) || fetch(request);
      } catch {
        return fetch(request);
      }
    })(),
  );
});
