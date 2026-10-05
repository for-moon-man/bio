import { readFileSync } from 'node:fs';
import { esc } from './visuals.mjs';

export const recordReview = JSON.parse(
  readFileSync(new URL('../data/record-review.json', import.meta.url), 'utf8'),
);

export function reviewedRecord(record) {
  const review = recordReview.records[record.id];
  return {
    ...record,
    original: { ...record },
    ...(review?.changes || {}),
    review,
  };
}

export function reviewLinks(item, language = 'en') {
  const ta = language === 'ta';
  const review = item.review || recordReview.records[item.id];
  if (!review) return '';
  if (!review.sources.length) return '';
  return `<div class="record-review">${review.sources
    .map((id) => {
      const ref = recordReview.sources[id];
      if (!ref) throw new Error(`Missing reviewed reference: ${id}`);
      return `<a href="${esc(ref.url)}" rel="noopener noreferrer">${esc(ta ? ref.titleTa : ref.title)} ↗</a>`;
    })
    .join(' · ')}</div>`;
}

export function reviewSources() {
  return `<h2 id="review-findings">References for honours and career records</h2><p>Institutional biographies, award registers and contemporary reports provide the references linked beside individual entries.</p><ul>${Object.values(
    recordReview.sources,
  )
    .map((ref) => `<li><a href="${esc(ref.url)}">${esc(ref.title)}</a></li>`)
    .join('')}</ul>`;
}
