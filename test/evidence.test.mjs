import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  officialEvidence,
  chronologyEvidence,
  awardEvidence,
  evidenceLinks,
  honourLinks,
} from '../lib/evidence.mjs';
import { renderVideoEmbed } from '../lib/embeds.mjs';
import { awards, timeline } from '../lib/content.mjs';

test('evidence maps to existing records and preserves limits on official support', () => {
  const ids = new Set(officialEvidence.map((item) => item.id));
  assert.equal(ids.size, officialEvidence.length);
  for (const item of officialEvidence) {
    const url = new URL(item.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(
      [
        'www.isro.gov.in',
        'www.ursc.gov.in',
        'science.nasa.gov',
        'www.ndrf.res.in',
        'archive.pib.gov.in',
      ].includes(url.hostname),
    );
    assert.ok(item.scope && item.scopeTa && item.checkedOn);
  }
  for (const [map, records] of [
    [chronologyEvidence, timeline],
    [awardEvidence, awards],
  ]) {
    for (const [id, sources] of Object.entries(map)) {
      assert.ok(
        records.some((item) => item.id === id),
        id,
      );
      sources.forEach((source) => assert.ok(ids.has(source)));
    }
  }
  assert.throws(() => evidenceLinks(['unreviewed-source']));
  assert.match(honourLinks({ id: 'professional-12' }), /hkfirodiaawards.org\/awards-by-year.php/);
  assert.match(honourLinks({ id: 'professional-13' }), /aif.org\/people\/dr-mylswamy-annadurai/);
});

test('only reviewed recordings can use the embed renderer and no provider loads in static cards', () => {
  assert.throws(() => renderVideoEmbed({ id: 'arbitrary-source' }));
  for (const file of ['index', 'biography', 'missions', 'gallery', 'tamil']) {
    const html = readFileSync(new URL(`../${file}.html`, import.meta.url), 'utf8');
    assert.ok(html.includes('class="embed-shell"'));
    assert.doesNotMatch(html, /<iframe[^>]+src="https:\/\/(?:www\.)?youtube/);
    assert.doesNotMatch(html, /<img[^>]+src="https:\/\/(?:i\.)?ytimg/);
    assert.ok(html.includes('assets/embeds.js'));
    assert.ok(html.includes(file === 'tamil' ? 'href="#privacy"' : 'href="sources.html#privacy"'));
  }
});
