document.querySelectorAll('[data-video]').forEach((button) => {
  const shell = button.closest('.embed-shell');
  const player = shell.querySelector('.video-player');
  const stop = shell.querySelector('[data-stop-video]');
  // Other enhancement scripts reveal controls; a close button needs an active player.
  stop.hidden = true;
  button.addEventListener('click', () => {
    if (!/^[A-Za-z0-9_-]{11}$/.test(button.dataset.video)) return;
    const iframe = document.createElement('iframe');
    const params = new URLSearchParams({
      hl: document.documentElement.lang,
      autoplay: '0',
      playsinline: '1',
    });
    iframe.src = `https://www.youtube-nocookie.com/embed/${button.dataset.video}?${params}`;
    iframe.title = button.dataset.title;
    iframe.width = '560';
    iframe.height = '315';
    iframe.allow = 'encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    player.replaceChildren(iframe);
    button.hidden = true;
    stop.hidden = false;
    iframe.focus();
  });
  stop.addEventListener('click', () => {
    player.replaceChildren();
    stop.hidden = true;
    button.hidden = false;
    button.focus();
  });
});
