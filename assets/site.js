document.documentElement.classList.add('js');
document.querySelectorAll('[data-enhanced]').forEach((element) => {
  element.hidden = false;
});
if (window.lucide) window.lucide.createIcons();
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', expanded);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a') && menu.getAttribute('aria-expanded') === 'true') menu.click();
});
document.addEventListener('keydown', (event) => {
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
const awardYear = document.querySelector('#award-year');
function filterAwards() {
  let count = 0;
  for (const row of document.querySelectorAll('.award-row')) {
    const visible =
      row.textContent.toLowerCase().includes(search.value.trim().toLowerCase()) &&
      (awardCategory.value === 'all' || row.dataset.category === awardCategory.value) &&
      (awardYear.value === 'all' || row.dataset.years.split(' ').includes(awardYear.value));
    row.hidden = !visible;
    if (visible) count++;
  }
  document.querySelector('#result-count').textContent =
    count + (count === 1 ? ' entry' : ' entries');
  document.querySelector('#no-results').hidden = count !== 0;
  document.querySelectorAll('[data-award-group]').forEach((group) => {
    group.hidden = ![...document.querySelectorAll('.award-row')].some(
      (row) => !row.hidden && row.dataset.category === group.dataset.awardGroup,
    );
  });
}
search?.addEventListener('input', filterAwards);
awardCategory?.addEventListener('change', filterAwards);
awardYear?.addEventListener('change', filterAwards);
document
  .querySelector('#award-filters')
  ?.addEventListener('submit', (event) => event.preventDefault());
document
  .querySelector('#award-filters')
  ?.addEventListener('reset', () => setTimeout(filterAwards, 0));
if (search) filterAwards();

document.querySelectorAll('[data-era-filter]').forEach((button) =>
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-era-filter]').forEach((other) => {
      other.classList.toggle('active', button === other);
      other.setAttribute('aria-pressed', String(button === other));
    });
    document.querySelectorAll('[data-era]').forEach((row) => {
      row.hidden =
        button.dataset.eraFilter !== 'all' && row.dataset.era !== button.dataset.eraFilter;
    });
    const count = document.querySelectorAll('[data-era]:not([hidden])').length;
    document.querySelector('#timeline-count').textContent =
      count + (count === 1 ? ' entry' : ' entries');
  }),
);
const galleryCategory = document.querySelector('#gallery-category');
const videoKind = document.querySelector('#video-kind');
function filterRecordings() {
  let count = 0;
  document.querySelectorAll('[data-video-kind]').forEach((card) => {
    card.hidden = videoKind.value !== 'all' && card.dataset.videoKind !== videoKind.value;
    if (card.hidden) {
      card.querySelector('.video-player').replaceChildren();
      card.querySelector('[data-video]').hidden = false;
      card.querySelector('[data-stop-video]').hidden = true;
    }
    if (!card.hidden) count++;
  });
  document.querySelector('#video-count').textContent =
    count + (count === 1 ? ' recording' : ' recordings');
}
videoKind?.addEventListener('change', filterRecordings);
galleryCategory?.addEventListener('change', () => {
  const sections = [...document.querySelectorAll('[data-collection]')];
  sections.forEach((section) => {
    section.hidden =
      galleryCategory.value !== 'all' && section.dataset.collection !== galleryCategory.value;
  });
  const count = sections.filter((section) => !section.hidden).length;
  document.querySelector('#archive-count').textContent =
    count + (count === 1 ? ' collection shown' : ' collections shown');
});
window.addEventListener('hashchange', () => {
  if (videoKind && (location.hash.startsWith('#recording-') || location.hash === '#watch')) {
    videoKind.value = 'all';
    filterRecordings();
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }
  if (galleryCategory && location.hash.startsWith('#archive-')) {
    galleryCategory.value = 'all';
    galleryCategory.dispatchEvent(new Event('change'));
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll('.intro, .mission-grid, .milestones, .chapter, .legacy')
    .forEach((element) => {
      element.classList.add('reveal');
      observer.observe(element);
    });
}
