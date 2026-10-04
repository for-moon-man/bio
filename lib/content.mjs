import { readFileSync } from 'node:fs';
import { marked } from 'marked';
import { reviewedRecord } from './review.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
export const collectionSource = 'Biographical collection, 30 September 2026';
export const snapshotDate = '2026-09-30';
export const source = read('content/english.md');
export const tamil = read('content/tamil.md');
export const sourceAwards = JSON.parse(read('data/annadurai-awards.json'));
export const awards = sourceAwards.map(reviewedRecord);
export const media = JSON.parse(read('data/annadurai-media.json'));
export const research = JSON.parse(read('data/annadurai-research.json'));

const englishRows = marked
  .lexer(source.split('## Chronicle Profile')[1].split('## Gallery')[0])
  .find((token) => token.type === 'list').items;
const tamilRows = marked
  .lexer(tamil.split('## கல்வியும் பணியும்')[1].split('## தளத்தின் கேலரி அமைப்பு')[0])
  .find((token) => token.type === 'list').items;
if (englishRows.length !== 37 || tamilRows.length !== 37)
  throw new Error('Review the chronology alignment before rebuilding.');
const notes = {
  10: 'The English record names INSAT-3B; the Tamil record uses INSAT-3P. The difference remains unresolved.',
  19: 'The biographical collection gives 2019–2023. NDRF’s own past-chairmen register instead records 18 February 2019–7 March 2022. Both records are disclosed pending reconciliation; NDRF expands its name as National Design and Research Forum.',
  22: 'The English source title is Patron; the Tamil line describes a senior advisor. The English title is used for the appointment.',
  27: 'The English chronology records 2023–2026; the Tamil snapshot records 2024–. The English dates are used here and the Tamil edition retains its own date.',
};
export const sourceTimeline = englishRows.map((item, index) => {
  const [, date, title] = item.text.split('\n')[0].match(/\*\*(.*?)\*\*\s*—\s*(.*)/);
  const [, tamilDate, tamilTitle] = tamilRows[index].text.match(/\*\*(.*?)\*\*\s*—\s*(.*)/);
  const start = Number(date.slice(0, 4));
  const year = date.replace(/\s*-\s*/g, '–');
  return {
    id: `chronicle-${String(index + 1).padStart(2, '0')}`,
    year,
    title: title
      .replace('Completed Schooling', 'Completed schooling')
      .replace('S/W satellite Simulator', 'software satellite simulator'),
    era: start < 1982 ? 'education' : start < 2019 ? 'isro' : 'beyond',
    openEnded: year.endsWith('–'),
    tamil: tamilTitle,
    tamilYear: tamilDate.replace(/\s*-\s*/g, '–'),
    source: collectionSource,
    sourceItem: index + 1,
    note: notes[index] || null,
    ...(index === 19
      ? { verificationSource: research.sources.find((item) => item.id === 'ndrf-register').url }
      : {}),
  };
});
export const timeline = sourceTimeline.map(reviewedRecord);

export const manifest = read('data/image-inventory.txt')
  .split(/\r?\n/)
  .filter((line) => line.startsWith('img/'));
const categoryFor = (url) => {
  const path = decodeURIComponent(url);
  if (path.includes('/Books/')) return 'books';
  if (path.includes('/with Students/')) return 'students';
  if (path.includes('/with family/')) return 'family';
  if (path.includes('/ISRO/')) return 'work';
  if (path.includes('/School College/')) return 'school';
  if (path.includes('/Quotes/')) return 'quotes';
  if (path.includes('/Functions/')) return 'public';
  return 'photos';
};
export const archiveImages = manifest.map((url, index) => ({
  id: `image-${String(index + 1).padStart(2, '0')}`,
  archivalPath: url,
  category: categoryFor(url),
  source: collectionSource,
  filename: decodeURIComponent(url.split('/').pop()),
  context:
    'Category follows the source folder; people, event dates and image contents have not been independently verified.',
  rights: 'Not established; archival filename only. The image is not available locally.',
}));
