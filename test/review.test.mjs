import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { awards, timeline, sourceAwards, sourceTimeline, media } from '../lib/content.mjs';
import { recordReview } from '../lib/review.mjs';

const html = (page) => readFileSync(new URL(`../${page}.html`, import.meta.url), 'utf8');
test('review covers every record while preserving the supplied originals', () => {
  assert.equal(Object.keys(recordReview.records).length, awards.length + timeline.length);
  for (const [records, originals] of [
    [awards, sourceAwards],
    [timeline, sourceTimeline],
  ]) {
    for (const item of records) {
      assert.deepEqual(
        item.original,
        originals.find((original) => original.id === item.id),
      );
      assert.ok(item.review.note && item.review.noteTa);
      if (['confirmed', 'partial'].includes(item.review.status))
        assert.ok(item.review.sources.length);
      for (const id of item.review.sources)
        assert.equal(new URL(recordReview.sources[id].url).protocol, 'https:');
    }
  }
});

test('verified corrections replace guesses and conflicts in the displayed records', () => {
  const award = (id) => awards.find((item) => item.id === id);
  assert.equal(award('social-01').year, '2014');
  assert.equal(award('social-13').year, '2008');
  assert.equal(award('professional-03').kind, 'Team award');
  assert.equal(award('professional-23').year, null);
  assert.equal(award('social-30').date, null);
  assert.equal(
    award('professional-08').year,
    null,
    'ISRS fellowship year must not be inferred from the Bhaskara award',
  );
  assert.equal(timeline[19].year, '2019–2022');
  assert.equal(timeline[19].tamilYear, '2019–2022');
  assert.match(timeline[10].tamil, /3B/);
  assert.doesNotMatch(timeline[10].tamil, /3P/);
  for (const page of ['biography', 'honours', 'tamil'])
    assert.ok(html(page).includes('class="record-review"'));
  assert.ok(html('honours').includes('https://hkfirodiaawards.org/awards-by-year.php'));
  assert.ok(html('tamil').includes('https://hkfirodiaawards.org/awards-by-year.php'));
  assert.ok(html('tamil').includes('மனித மேன்மைக்கான விவேகானந்தர் விருது — 2014'));
  assert.ok(html('tamil').includes('பூர்ண சந்திரா விருது — 2008'));
  assert.doesNotMatch(html('tamil'), /முதலிடம் பிடித்தது/);
});

test('every recording has a sourced publication date distinct from event dates', () => {
  for (const video of media.videos) {
    assert.ok(Number.isFinite(Date.parse(video.publishedAt)));
    assert.equal(video.playerStatus, 'OK');
    assert.equal(video.embedAvailable, true);
    assert.ok(
      html(video.edition === 'ta' ? 'tamil' : 'gallery').includes(
        `datetime="${video.publishedAt}"`,
      ),
    );
  }
  assert.match(media.videos.find((v) => v.id === 'pLSUgxm4eK0').publishedAt, /^2018-08-03/);
  assert.match(media.videos.find((v) => v.id === 'K0hIB18WuM0').eventDate, /^2019-07-12/);
});
