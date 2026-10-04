import { readFileSync } from 'node:fs';

export const profiles = {
  linkedin: 'https://www.linkedin.com/in/dr-mylswamy-annadurai-05641a1/',
  youtube: 'https://www.youtube.com/@drmylswamyannadurai6093',
};
export const coverage = JSON.parse(
  readFileSync(new URL('../data/public-coverage.json', import.meta.url), 'utf8'),
);
const esc = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const date = (value, language) =>
  new Intl.DateTimeFormat(language === 'ta' ? 'ta-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(`${value}T00:00:00+05:30`));

export function profileIcon(network) {
  const artwork = {
    linkedin:
      '<rect width="24" height="24" rx="3" fill="#0A66C2"/><circle cx="5.7" cy="6.1" r="1.6" fill="#fff"/><path fill="#fff" d="M4.3 9h2.8v10H4.3zm5 0H12v1.4c.6-1 1.6-1.7 3.1-1.7 3 0 3.9 1.9 3.9 4.7V19h-2.8v-5c0-1.5-.2-2.7-1.9-2.7-1.8 0-2.2 1.4-2.2 2.8V19H9.3z"/>',
    youtube:
      '<rect x="0" y="3.5" width="24" height="17" rx="5" fill="#FF0000"/><path d="m10 8 6 4-6 4z" fill="#fff"/>',
  };
  if (!artwork[network]) throw new Error(`Unknown profile icon: ${network}`);
  return `<svg class="profile-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">${artwork[network]}</svg>`;
}

export function profileLink(network, label) {
  return `<a class="social-link" href="${profiles[network]}" rel="me noopener noreferrer" lang="en">${profileIcon(network)}<span>${esc(label)}</span><span class="social-arrow" aria-hidden="true">↗</span></a>`;
}

export function profileLinks(language = 'en') {
  const ta = language === 'ta';
  return `<nav class="profile-links" aria-label="${ta ? 'அண்ணாதுரையின் சமூக ஊடகப் பக்கங்கள்' : 'Dr. Annadurai on social media'}"><span>${ta ? 'தொடர்ந்து இணைந்திருங்கள்' : 'Follow Dr. Annadurai'}</span>${profileLink('linkedin', 'LinkedIn')}${profileLink('youtube', 'YouTube')}</nav>`;
}

export function renderPublicLife({ language = 'en', kind, limit, id = 'public-life' } = {}) {
  const ta = language === 'ta';
  const items = coverage.items.filter((item) => !kind || item.kind === kind).slice(0, limit);
  const title =
    kind === 'recognition'
      ? ta
        ? 'செய்திகளில் அங்கீகாரங்கள்'
        : 'Recognition in the news'
      : ta
        ? 'நிகழ்வுகளும் அங்கீகாரங்களும்'
        : 'Past events & recognitions';
  return `<section class="public-life ${ta ? 'folio' : 'wrap'}" id="${id}" aria-labelledby="${id}-title"><div class="public-life-heading"><span class="${ta ? 'kicker' : 'eyebrow'}">${ta ? 'அறிவியலும் சமூகமும்' : 'SCIENCE & PUBLIC LIFE'}</span><h2 id="${id}-title">${title}</h2><p>${ta ? 'அறிவியல், கல்வி, சமூகப் பங்களிப்புகள் குறித்த தேர்ந்தெடுக்கப்பட்ட செய்திப் பதிவுகள்.' : 'Selected moments in science, education and public service, with coverage from the press.'}</p></div><div class="coverage-grid">${items.map((item) => `<article class="coverage-card" id="coverage-${item.id}"><span class="coverage-kind">${ta ? (item.kind === 'event' ? 'நிகழ்வு' : 'அங்கீகாரம்') : item.kind === 'event' ? 'Event' : 'Recognition'}</span><h3>${esc(ta ? item.titleTa : item.title)}</h3><p>${esc(ta ? item.summaryTa : item.summary)}</p><div class="coverage-source"><p>${ta ? 'செய்தி வெளியான நாள்' : 'Published'} <time datetime="${item.publishedDate}">${date(item.publishedDate, language)}</time></p><a href="${esc(item.url)}" rel="noopener noreferrer">${ta ? 'செய்தியைப் படிக்க' : 'Read coverage'} · ${esc(ta ? item.publisherTa : item.publisher)} <span aria-hidden="true">↗</span></a></div></article>`).join('')}</div>${limit ? `<a class="coverage-more" href="biography.html#public-life">Explore all past events &amp; recognitions <span aria-hidden="true">↗</span></a>` : ''}</section>`;
}

export function coverageSources() {
  return `<h2 id="press-coverage">Events and recognition in the press</h2><p>These original summaries follow reporting by The Hindu, The Times of India and The Economic Times / PTI, reviewed on 3 October 2026. Dates on the cards identify article publication, not necessarily the event date. The selection is not a complete event history.</p><ul>${coverage.items.map((item) => `<li><a href="${esc(item.url)}">${esc(item.title)}</a> · ${esc(item.publisher)} · ${date(item.publishedDate, 'en')}. ${esc(item.scope)}</li>`).join('')}</ul>`;
}
