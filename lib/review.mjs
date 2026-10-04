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
  const labels = {
    confirmed: ta ? 'ஆதாரத்துடன் உறுதிப்படுத்தப்பட்டது' : 'Corroborated record',
    partial: ta
      ? 'பதிவு உறுதி; சில விவரங்கள் உறுதியாகவில்லை'
      : 'Record supported; some details unconfirmed',
    disputed: ta ? 'முரண்படும் பதிவுகள்' : 'Conflicting records',
    collection: ta ? 'வழங்கப்பட்ட தொகுப்பின் பதிவு' : 'Collection record',
  };
  return `<div class="record-review"><p><strong>${labels[review.status]}</strong> · ${esc(ta ? review.noteTa : review.note)}</p>${
    review.sources.length
      ? `<p>${review.sources
          .map((id) => {
            const ref = recordReview.sources[id];
            if (!ref) throw new Error(`Missing reviewed reference: ${id}`);
            return `<a href="${esc(ref.url)}" rel="noopener noreferrer">${esc(ta ? ref.titleTa : ref.title)} ↗</a>`;
          })
          .join(' · ')}</p>`
      : `<a href="${ta ? '#notes' : 'sources.html#review-findings'}">${ta ? 'ஆய்வுக் குறிப்புகள்' : 'Review notes'} ↗</a>`
  }</div>`;
}

export function reviewSummary(language = 'en') {
  const ta = language === 'ta';
  return `<p class="archive-note">${ta ? 'ஆதாரங்கள் கிடைத்த இடங்களில் தேதிகளும் விவரங்களும் திருத்தப்பட்டுள்ளன. உறுதிப்படுத்தப்படாத பதிவுகள் தனியாகக் குறிக்கப்பட்டுள்ளன; ஆண்டு இல்லாத இடங்களில் ஆண்டு ஊகிக்கப்படவில்லை.' : 'Dates and descriptions have been corrected where supporting records are available. Each entry distinguishes corroborated facts from collection-only or conflicting details; missing dates are not inferred.'}</p>`;
}

export function reviewSources() {
  const records = Object.values(recordReview.records);
  const counts = (status) => records.filter((r) => r.status === status).length;
  return `<h2 id="review-findings">Date and reference review · 3 October 2026</h2><p>The review covers all 79 honours records and 37 career entries, the ten selected recordings, public-event reports and image captions. The supplied source texts remain preserved; the displayed edition incorporates documented corrections.</p><p>Across honours and career records: ${counts('confirmed')} are corroborated to the scope stated beside them, ${counts('partial')} have partial support, ${counts('disputed')} retain a conflict, and ${counts('collection')} still rely on the supplied collection. A collection record is not independent confirmation. A missing fellowship year does not imply that the fellowship is false.</p><p>The Firodia Foundation establishes 2009 for its award; the NDRF register establishes 18 February 2019–7 March 2022 for the chairmanship. The Vivekananda award is dated 2014 by URSC, and The Hindu reported the Poorna Chandra award in November 2008. No exact date is asserted for the disputed Mumbai recognition, and the uncorroborated UCLA date range is excluded from the year filter.</p><ul>${Object.values(
    recordReview.sources,
  )
    .map(
      (ref) =>
        `<li><a href="${esc(ref.url)}">${esc(ref.title)}</a>. ${esc(ref.scope)} Reviewed ${recordReview.checkedOn}.</li>`,
    )
    .join('')}</ul>`;
}
