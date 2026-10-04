(() => {
  const ta = document.documentElement.lang === 'ta';
  const dialog = document.querySelector('#photo-dialog');
  const triggers = [...document.querySelectorAll('[data-photo]')];
  let opener,
    current = 0,
    visiblePhotos = [];
  function showPhoto(index) {
    current = (index + visiblePhotos.length) % visiblePhotos.length;
    const item = visiblePhotos[current];
    const img = dialog.querySelector('#dialog-image');
    img.src = item.dataset.photo;
    img.alt = item.dataset.caption;
    dialog.querySelector('#dialog-caption').textContent = item.dataset.caption;
    const source = dialog.querySelector('#dialog-source');
    source.textContent =
      item.dataset.credit || (ta ? 'படங்களின் உரிமக் குறிப்புகள்' : 'Image source & credit');
    source.href = item.dataset.source || (ta ? '#image-credits' : 'sources.html#image-credits');
    dialog.querySelector('#photo-position').textContent =
      `${current + 1} / ${visiblePhotos.length}`;
  }
  triggers.forEach((trigger) =>
    trigger.addEventListener('click', (event) => {
      if (!dialog || typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      opener = trigger;
      const seen = new Set();
      visiblePhotos = triggers.filter(
        (item) =>
          item.getClientRects().length &&
          !seen.has(item.dataset.photo) &&
          seen.add(item.dataset.photo),
      );
      showPhoto(visiblePhotos.findIndex((item) => item.dataset.photo === trigger.dataset.photo));
      dialog.showModal();
    }),
  );
  dialog?.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () => opener?.focus({ preventScroll: true }));
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        dialog.close();
    }
  });
  dialog
    ?.querySelectorAll('[data-photo-step]')
    .forEach((button) =>
      button.addEventListener('click', () => showPhoto(current + Number(button.dataset.photoStep))),
    );
  dialog?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  document.querySelectorAll('[data-photo-filter]').forEach((button) =>
    button.addEventListener('click', () => {
      const value = button.dataset.photoFilter;
      document
        .querySelectorAll('[data-photo-filter]')
        .forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      document.querySelectorAll('[data-photo-category]').forEach((item) => {
        item.hidden = value !== 'all' && item.dataset.photoCategory !== value;
        if (!item.hidden) count++;
      });
      document.querySelector('.photo-count').textContent =
        count + (ta ? ' படங்கள்' : count === 1 ? ' image' : ' images');
    }),
  );
  document.querySelectorAll('[data-era-filter]').forEach((button) =>
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-era-illustration]').forEach((item) => {
        item.hidden =
          button.dataset.eraFilter !== 'all' &&
          item.dataset.eraIllustration !== button.dataset.eraFilter;
      });
    }),
  );
  function revealHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(id);
    if (!target) return;
    for (let parent = target.parentElement; parent; parent = parent.parentElement)
      if (parent.tagName === 'DETAILS') parent.open = true;
    if (target.matches('.timeline-row')) document.querySelector('[data-era-filter="all"]')?.click();
    if (target.matches('.award-row')) {
      document.querySelector('#award-filters')?.reset();
      setTimeout(() => target.scrollIntoView({ block: 'start' }), 20);
    }
    if (id) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
  window.addEventListener('hashchange', revealHash);
  if (location.hash) revealHash();
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let pending = false;
  const update = () => {
    const length = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (length > 0 ? (scrollY / length) * 100 : 0) + '%';
    pending = false;
  };
  addEventListener(
    'scroll',
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  addEventListener('resize', update);
  update();
})();
