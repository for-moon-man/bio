(() => {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  const interval = 5 * 60 * 1000;
  let registration;
  let lastCheck = 0;
  const refresh = () => {
    if (document.hidden || !navigator.onLine || !registration?.active) return;
    if (Date.now() - lastCheck < interval) return;
    lastCheck = Date.now();
    registration.active.postMessage({ type: 'refresh-honours' });
  };
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type !== 'honours-updated' || document.querySelector('.honours-update')) return;
    const archive = document.querySelector('#honours-archive');
    if (!archive) return;
    const notice = document.createElement('p');
    notice.className = 'honours-update';
    notice.setAttribute('role', 'status');
    notice.append('An updated honours archive is available. ');
    const reload = document.createElement('a');
    reload.href = 'honours.html';
    reload.textContent = 'Load the latest version';
    reload.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.reload();
    });
    notice.append(reload);
    archive.prepend(notice);
  });
  window.addEventListener(
    'load',
    async () => {
      try {
        // Relative URLs also work beneath a GitHub Pages project path such as /bio/.
        await navigator.serviceWorker.register('sw.js', { scope: './', updateViaCache: 'none' });
        registration = await navigator.serviceWorker.ready;
        refresh();
        window.setInterval(refresh, interval);
        document.addEventListener('visibilitychange', refresh);
        window.addEventListener('online', refresh);
        window.addEventListener('pageshow', refresh);
      } catch {
        // The static page and ordinary navigation remain available without caching.
      }
    },
    { once: true },
  );
})();
