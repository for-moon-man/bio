document.documentElement.classList.add('js');
document.querySelectorAll('[data-enhanced]').forEach((element) => {
  element.hidden = false;
});
const buttons = [...document.querySelectorAll('[data-era-filter]')];
function showEra(era) {
  buttons.forEach((button) =>
    button.setAttribute('aria-pressed', String(button.dataset.eraFilter === era)),
  );
  const rows = [...document.querySelectorAll('[data-era]')];
  rows.forEach((row) => {
    row.hidden = era !== 'all' && row.dataset.era !== era;
  });
  document.querySelector('#timeline-count').textContent =
    rows.filter((row) => !row.hidden).length + ' பதிவுகள்';
}
buttons.forEach((button) =>
  button.addEventListener('click', () => showEra(button.dataset.eraFilter)),
);
window.addEventListener('hashchange', () => {
  if (location.hash.startsWith('#chronicle')) {
    showEra('all');
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }
});
