if (!document.getElementById('top')) document.body.id = 'top';
if (window.lucide) window.lucide.createIcons();
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', expanded);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.querySelector('#photo-dialog')?.open) {
    event.preventDefault();
    document.querySelector('#photo-dialog').close();
  }
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    menu.click();
    menu.focus();
  }
});
const search = document.querySelector('#award-search');
const awardCategory = document.querySelector('#award-category');
function filterAwards() {
  let count = 0;
  for (const row of document.querySelectorAll('.award-row')) {
    const visible = row.textContent.toLowerCase().includes(search.value.trim().toLowerCase()) && (awardCategory.value === 'all' || row.dataset.category === awardCategory.value);
    row.hidden = !visible;
    if (visible) count++;
  }
  document.querySelector('#result-count').textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
  document.querySelector('#no-results').hidden = count !== 0;
}
search?.addEventListener('input', filterAwards);
awardCategory?.addEventListener('change', filterAwards);
document.querySelectorAll('[data-era-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-era-filter]').forEach(other => {
    other.classList.toggle('active', button === other);
    other.setAttribute('aria-pressed', String(button === other));
  });
  document.querySelectorAll('[data-era]').forEach(row => { row.hidden = button.dataset.eraFilter !== 'all' && row.dataset.era !== button.dataset.eraFilter; });
}));
document.querySelector('#gallery-category')?.addEventListener('change', event => {
  document.querySelectorAll('.archive-link').forEach(link => { link.hidden = event.target.value !== 'all' && link.dataset.category !== event.target.value; });
});
const dialog = document.querySelector('#photo-dialog');
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#dialog-image').src = button.dataset.photo;
  document.querySelector('#dialog-image').alt = button.dataset.caption;
  document.querySelector('#dialog-caption').textContent = button.dataset.caption;
  dialog.showModal();
}));
document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.intro, .mission-grid, .milestones, .chapter, .legacy').forEach(element => { element.classList.add('reveal'); observer.observe(element); });
}