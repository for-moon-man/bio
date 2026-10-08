import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import {
  awards,
  timeline,
  media,
  archiveImages,
  source,
  tamil,
  collectionSource,
  research,
  sourceAwards,
  sourceTimeline,
} from '../lib/content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = ['index', 'biography', 'missions', 'honours', 'gallery', 'tamil', 'sources'];
const read = (file) => readFileSync(resolve(root, file), 'utf8');

test('all 79 honours retain category, source position and only explicitly supplied years', () => {
  const awards = sourceAwards;
  const categories = [
    'Government',
    'Universities & Academia',
    'ISRO',
    'Professional / National / International',
    'Social & Public',
  ];
  assert.deepEqual(
    categories.map((category) => awards.filter((item) => item.category === category).length),
    [3, 15, 6, 24, 31],
  );
  assert.equal(new Set(awards.map((item) => item.id)).size, 79);
  const raw = source
    .split('## Awards and achievements')[1]
    .split('## Chronicle Profile')[0]
    .replace('[33] 15.SIES', '\n15. SIES');
  const lists = marked.lexer(raw).filter((token) => token.type === 'list');
  lists.forEach((list, categoryIndex) =>
    list.items.forEach((item, index) => {
      const record = awards.find(
        (record) =>
          record.category === categories[categoryIndex] && record.sourceItem === index + 1,
      );
      assert.ok(record, `Missing source record ${categoryIndex}/${index + 1}`);
      assert.equal(record.source, collectionSource);
      const sourceYears = [...new Set(item.text.match(/\b(?:19|20)\d{2}\b/g) || [])].sort();
      assert.deepEqual(record.year?.split('–').sort() || [], sourceYears, record.id);
      assert.ok(record.title && record.kind);
    }),
  );
  assert.equal(awards.find((item) => item.title === 'BHASKARA Award').year, '2016');
  assert.equal(awards.find((item) => item.id === 'professional-15').year, '2009');
  assert.equal(awards.find((item) => item.organization === 'AISYWC-18').year, null);
  assert.equal(awards.find((item) => item.id === 'social-07').kind, 'Listing');
  assert.equal(awards.find((item) => item.id === 'social-30').date, '2024-05-25');
  assert.equal(
    awards.filter((item) => item.title === 'Lifetime Achievement Award in Space Science').length,
    2,
  );
});

test('all 37 timeline dates and original Tamil lines survive, including open appointments', () => {
  const timeline = sourceTimeline;
  const dates = [
    '1976',
    '1976–1980',
    '1980–1982',
    '1982',
    '1985–1988',
    '1988–1992',
    '1992–1996',
    '1996–2001',
    '1997–1998',
    '1999–2012',
    '2000–2010',
    '2001–2002',
    '2003–2011',
    '2003–2005',
    '2004–2009',
    '2008–2013',
    '2011–2015',
    '2015–2018',
    '2019–2023',
    '2019–2023',
    '2021–2024',
    '2021–2024',
    '2022–',
    '2022–',
    '2023–',
    '2023–',
    '2023–',
    '2023–2026',
    '2024–',
    '2025–',
    '2026–',
    '2026–',
    '2026–',
    '2026–',
    '2026–',
    '2026–',
    '2026–',
  ];
  assert.deepEqual(
    timeline.map((item) => item.year),
    dates,
  );
  const rawTamil = tamil.split('## கல்வியும் பணியும்')[1].split('## தளத்தின் கேலரி அமைப்பு')[0];
  assert.equal(timeline.length, 37);
  timeline.forEach((item) => {
    assert.ok(rawTamil.includes(item.tamil), item.id);
    assert.equal(item.openEnded, item.year.endsWith('–'));
    assert.equal(item.source, collectionSource);
  });
  assert.deepEqual(
    ['education', 'isro', 'beyond'].map(
      (era) => timeline.filter((item) => item.era === era).length,
    ),
    [3, 15, 19],
  );
  assert.match(timeline[10].title, /INSAT-3B/);
  assert.match(timeline[10].tamil, /3P/);
  assert.match(timeline[22].title, /Patron/);
  assert.equal(timeline[27].tamilYear, '2024–');
  for (const index of [10, 22, 27]) assert.ok(timeline[index].note);
});

test('archive includes all categories without invented video or image metadata', () => {
  assert.deepEqual(
    media.categories.map((item) => item.id),
    [
      'photos',
      'videos',
      'leaders',
      'work',
      'public',
      'family',
      'students',
      'abroad',
      'school',
      'quotes',
      'books',
      'media',
      'speeches',
      'about',
    ],
  );
  assert.equal(archiveImages.length, 40);
  assert.equal(new Set(archiveImages.map((item) => item.archivalPath)).size, 40);
  for (const item of archiveImages) {
    assert.ok(media.categories.some((category) => category.id === item.category));
    assert.match(item.rights, /Not established/);
  }
  assert.equal(media.videos.length, 10);
  assert.ok(
    media.videos.every(
      (item) =>
        /^[A-Za-z0-9_-]{11}$/.test(item.id) &&
        item.publisher &&
        item.metadataSource.startsWith('https://www.youtube.com/oembed?'),
    ),
  );
  assert.equal(media.familyAddress.url, null);
  assert.equal(media.channel.url, 'https://www.youtube.com/@drmylswamyannadurai6093');
});

test('new recordings retain primary metadata, timestamps and documented scope', () => {
  assert.equal(new Set(media.videos.map((item) => item.id)).size, 10);
  const additions = media.videos.filter((item) => item.publishedAt);
  assert.equal(additions.length, 10);
  for (const item of additions) {
    assert.ok(Number.isFinite(Date.parse(item.publishedAt)));
    assert.ok(item.durationSeconds > 0 && item.viewCount >= 0);
    assert.equal(item.viewCountCheckedOn, '2026-10-03');
    assert.equal(item.source, item.url);
    assert.ok(item.selectionReason && item.summaryBasis);
    for (const chapter of item.chapters || []) assert.ok(chapter.seconds < item.durationSeconds);
  }
  const ted = additions.filter((item) => item.publisher === 'TEDx Talks');
  assert.equal(ted.length, 2);
  const university = additions.find((item) => item.id === 'nElss3iRpB0');
  assert.match(university.title, /'20/);
  assert.match(university.publishedAt, /^2021-/);
  assert.match(timeline[19].review.note, /7 March 2022/);
  assert.equal(timeline[19].year, '2019–2022');
  assert.equal(timeline[19].verificationSource, 'https://www.ndrf.res.in/chairmen.html');
  assert.equal(research.sources.length, 3);
  assert.equal(media.articles.length, 1);
  const gallery = read('gallery.html');
  assert.equal((gallery.match(/data-video-kind=/g) || []).length, 8);
  assert.equal((read('tamil.html').match(/class="video-record"/g) || []).length, 2);
  for (const video of media.videos) {
    const intendedPage = video.edition === 'ta' ? read('tamil.html') : gallery;
    const otherPage = video.edition === 'ta' ? gallery : read('tamil.html');
    assert.ok(intendedPage.includes(`id="recording-${video.id}"`));
    assert.ok(!otherPage.includes(`id="recording-${video.id}"`));
  }
  assert.equal((gallery.match(/<iframe/g) || []).length, 0, 'YouTube must remain click-to-load');
});

test('generated pages contain complete readable archives and valid local links without JavaScript', () => {
  assert.equal((read('honours.html').match(/class="award-row"/g) || []).length, 79);
  assert.equal((read('gallery.html').match(/data-collection=/g) || []).length, 9);
  for (const page of ['biography', 'tamil']) {
    const html = read(`${page}.html`);
    assert.equal((html.match(/class="timeline-row"/g) || []).length, 37);
    assert.ok(!html.includes('show-tamil'));
  }
  for (const page of pages) {
    const html = read(`${page}.html`);
    assert.match(
      html,
      /href="mailto:drmylswamyannadurai@gmail\.com"[^>]*>[\s\S]*?<span>drmylswamyannadurai@gmail\.com<\/span>/,
      `${page}: contact email`,
    );
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, `Duplicate IDs in ${page}`);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, page);
    assert.ok(html.includes('id="top"'));
    assert.doesNotThrow(() =>
      JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]),
    );
    for (const [, url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?|mailto):/.test(url)) {
        assert.doesNotThrow(() => new URL(url), `${page}: invalid URL ${url}`);
        continue;
      }
      const [path, fragment] = url.split('#');
      const target = path ? resolve(root, path) : resolve(root, `${page}.html`);
      assert.ok(existsSync(target), `${page}: missing ${url}`);
      if (fragment)
        assert.ok(
          readFileSync(target, 'utf8').includes(`id="${fragment}"`),
          `${page}: broken ${url}`,
        );
    }
  }
});

test('language editions have separate presentation, navigation and readable chronology', () => {
  for (const page of pages.filter((page) => page !== 'tamil')) {
    const html = read(`${page}.html`);
    assert.match(html, /<html lang="en">/);
    // Original book titles retain their language; English navigation and prose stay English.
    const prose = html.replace(/<h[34] lang="ta">[^<]*<\/h[34]>/g, '');
    assert.doesNotMatch(prose, /[\u0B80-\u0BFF]/u, page);
    assert.match(html, /href="assets\/site.css"/);
    assert.match(html, /href="tamil.html(?:#[a-z-]+)?" hreflang="ta"/);
  }
  const html = read('tamil.html');
  assert.match(html, /<html lang="ta">/);
  assert.match(html, /href="assets\/tamil.css"/);
  assert.match(html, /src="assets\/tamil.js"/);
  assert.doesNotMatch(html, /assets\/site\.(?:css|js)/);
  const localPageLinks = [...html.matchAll(/href="([^"#]+\.html)"/g)]
    .map((match) => match[1])
    .filter((url) => !url.startsWith('https:'));
  assert.deepEqual([...new Set(localPageLinks)].sort(), ['index.html', 'tamil.html']);
  assert.equal(
    localPageLinks.filter((link) => link === 'index.html').length,
    1,
    'Only the explicit language switch crosses editions',
  );
  const escape = (value) =>
    value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  for (const item of timeline) {
    assert.ok(html.includes(escape(item.tamil)), item.id);
    assert.ok(html.includes(escape(item.tamilYear)), item.id);
  }
  const frames = [...html.matchAll(/<iframe[^>]+src="([^"]+)"/g)];
  assert.equal(frames.length, 1);
  assert.ok(
    frames[0][1].startsWith('https://calendar.google.com/calendar/embed?'),
    'Only the public calendar loads automatically; videos remain click-to-load',
  );
});

test('new archival images have reuse credits in both editions and unlinked source labels are removed', () => {
  const photos = JSON.parse(read('data/archive-photos.json'));
  assert.equal(photos.length, 8);
  for (const photo of photos) {
    assert.ok(existsSync(resolve(root, photo.src)));
    assert.ok(photo.caption && photo.captionTa && photo.credit && photo.creditTa);
    if (photo.provenance === 'user-supplied') {
      assert.ok(['early-portrait', 'vintage-memories'].includes(photo.id));
      assert.ok(existsSync(resolve(root, photo.originalUrl)));
      assert.equal(photo.source, photo.src);
      assert.equal(photo.license, null);
      assert.equal(photo.licenseTa, null);
      assert.equal(photo.licenseUrl, '');
    } else {
      assert.ok(['Public domain', 'GODL-India'].includes(photo.license));
      assert.ok(photo.source.startsWith('https://commons.wikimedia.org/wiki/File:'));
      assert.ok(photo.licenseUrl.startsWith('https://'));
    }
    assert.ok(photo.width > 0 && photo.height > 0);
    for (const file of ['gallery.html', 'tamil.html']) assert.ok(read(file).includes(photo.src));
  }
  for (const page of pages)
    assert.ok(!read(page + '.html').includes('Biographical collection, 30 September 2026'));
});

test('published text and source inventories contain no links or citations to the retired domain', () => {
  const retired = new RegExp('mylswamyannadurai' + '\\.' + 'in', 'i');
  const walk = (folder) => {
    for (const item of readdirSync(resolve(root, folder), { withFileTypes: true })) {
      if (['.work', 'node_modules', '.git'].includes(item.name)) continue;
      const path = `${folder}/${item.name}`;
      if (item.isDirectory()) walk(path);
      else if (/\.(html|mjs|js|css|json|md|txt)$/.test(item.name))
        assert.doesNotMatch(read(path), retired, path);
    }
  };
  walk('.');
  for (const item of archiveImages) {
    assert.match(item.archivalPath, /^img\//);
    assert.equal(item.url, undefined, 'An unavailable image must not have a live URL');
  }
});
