import { readFileSync } from 'node:fs';
import { esc } from './visuals.mjs';
import { reviewLinks, recordReview } from './review.mjs';

export const officialEvidence = JSON.parse(
  readFileSync(new URL('../data/official-evidence.json', import.meta.url), 'utf8'),
);
export const chronologyEvidence = {
  'chronicle-02': ['ursc'],
  'chronicle-03': ['ursc'],
  'chronicle-04': ['ursc'],
  'chronicle-05': ['ursc'],
  'chronicle-06': ['irs-1a'],
  'chronicle-07': ['insat-2a'],
  'chronicle-08': ['insat-2c'],
  'chronicle-09': ['insat-2d'],
  'chronicle-10': ['insat-2e'],
  'chronicle-11': ['insat-3b'],
  'chronicle-12': ['gsat-1'],
  'chronicle-13': ['insat-3e'],
  'chronicle-14': ['edusat'],
  'chronicle-15': ['ursc', 'chandrayaan-1'],
  'chronicle-16': ['chandrayaan-2'],
  'chronicle-17': ['ursc', 'mars'],
  'chronicle-18': ['ursc'],
  'chronicle-20': ['ndrf'],
};
export const awardEvidence = Object.fromEntries(
  [
    'government-01',
    'isro-01',
    'isro-03',
    'isro-04',
    'isro-05',
    'isro-06',
    'professional-01',
    'professional-02',
    'professional-03',
    'professional-04',
    'professional-12',
    'professional-13',
    'professional-15',
    'social-01',
    'social-10',
    'social-12',
  ].map((id) => [id, ['ursc']]),
);
awardEvidence['government-02'] = ['ursc', 'padma'];

export function evidenceLinks(ids = [], language = 'en', note = '') {
  if (!ids.length) return '';
  const ta = language === 'ta';
  return `<div class="evidence-links"><span>${ta ? 'அதிகாரப்பூர்வ ஆதாரம்' : 'Official evidence'}: </span>${ids
    .map((id) => {
      const source = officialEvidence.find((item) => item.id === id);
      if (!source) throw new Error(`Unknown evidence: ${id}`);
      return `<a href="${esc(source.url)}" rel="noopener noreferrer">${esc(ta ? source.titleTa : source.title)} ↗</a>`;
    })
    .join(' · ')}${note ? `<small>${esc(note)}</small>` : ''}</div>`;
}

export function chronologyLinks(item, language = 'en') {
  const ids = (chronologyEvidence[item.id] || []).filter((id) => !['ursc', 'ndrf'].includes(id));
  const ta = language === 'ta';
  const note = ta
    ? 'திட்ட விவரங்களுக்கான ஆதாரம்; தனிப்பட்ட பதவிக்காலத்தை உறுதிப்படுத்தாது.'
    : 'Mission context only; this does not establish the personal tenure.';
  return reviewLinks(item, language) + evidenceLinks(ids, language, note);
}

export const honoursProfile =
  'https://www.linkedin.com/in/dr-mylswamy-annadurai-05641a1/details/honors/';
export function honourLinks(item, language = 'en') {
  const review = item.review || recordReview.records[item.id];
  return review?.sources.length
    ? reviewLinks(item, language)
    : `<div class="record-review"><a href="${honoursProfile}" rel="noopener noreferrer">${language === 'ta' ? 'லிங்க்ட்இன் விருதுகள்' : 'Honours on LinkedIn'} ↗</a></div>`;
}

const pageEvidence = {
  index: ['ursc', 'padma', 'chandrayaan-1', 'nasa'],
  biography: ['ursc', 'ndrf', 'padma'],
  missions: [
    'chandrayaan-1',
    'brochure',
    'nasa',
    'chandrayaan-2',
    'mars',
    'edusat',
    'irs-1a',
    'insat-2a',
    'insat-2c',
    'insat-2d',
    'insat-2e',
    'insat-3b',
    'gsat-1',
    'insat-3e',
  ],
  honours: ['padma', 'ursc'],
  gallery: ['padma', 'nasa', 'chandrayaan-1'],
  sources: officialEvidence.map((item) => item.id),
  tamil: ['ursc', 'padma', 'chandrayaan-1', 'nasa', 'chandrayaan-2', 'mars', 'edusat', 'ndrf'],
};
export function renderEvidence(page, language = 'en') {
  const ta = language === 'ta';
  return `<section class="${ta ? 'folio' : 'wrap'} evidence-section" id="official-evidence"><h2>${ta ? 'அதிகாரப்பூர்வ ஆவணங்கள்' : 'Explore the official evidence'}</h2><p>${ta ? 'அரசு மற்றும் நிறுவனங்களின் மூலப் பதிவுகள். ஒவ்வொரு ஆதாரமும் உறுதிப்படுத்தும் தகவல்கள் கீழே தரப்பட்டுள்ளன.' : 'Government and institutional records, with the scope of each source explained below.'}</p><div class="evidence-grid">${pageEvidence[
    page
  ]
    .map((id) => {
      const source = officialEvidence.find((item) => item.id === id);
      return `<article class="evidence-card"><h3><a href="${esc(source.url)}" rel="noopener noreferrer">${esc(ta ? source.titleTa : source.title)} ↗</a></h3><p>${esc(ta ? source.scopeTa : source.scope)}</p><p>${ta ? 'சரிபார்த்த நாள்: 3 அக்டோபர் 2026' : 'Checked 3 October 2026'}</p></article>`;
    })
    .join('')}</div></section>`;
}
