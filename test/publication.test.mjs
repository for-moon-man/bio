import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pageFiles } from '../lib/project.mjs';
import { awards } from '../lib/content.mjs';
import { honourLinks, honoursProfile } from '../lib/evidence.mjs';
import { photograph } from '../lib/visuals.mjs';

test('public pages omit missing-data notices in both languages', () => {
  for (const file of pageFiles) {
    const html = readFileSync(new URL('../' + file, import.meta.url), 'utf8');
    const text = html.replace(/<[^>]*>/g, ' ');
    assert.doesNotMatch(
      text,
      /not recorded|unconfirmed|unavailable|dates unresolved|require confirmation|remain pending|need confirmation|பதிவாகவில்லை|உறுதியாகவில்லை|கிடைக்கவில்லை|தரப்படவில்லை|உறுதிப்படுத்தப்படவில்லை/i,
      file,
    );
    assert.doesNotMatch(html, />\s*(?:null|undefined)\s*</, file);
  }
});

test('honours without external research references link to the supplied LinkedIn page', () => {
  for (const item of awards) {
    for (const language of ['en', 'ta']) {
      const links = honourLinks(item, language);
      assert.doesNotMatch(links, /href="(?:#|sources\.html)/);
      if (!item.review.sources.length) assert.ok(links.includes(honoursProfile), item.id);
      else assert.ok(links.includes('href="https://'), item.id);
      if (item.date) assert.ok(links.includes(`datetime="${item.date}"`), item.id);
    }
  }
});

test('photograph metadata is optional while known dates and credits remain visible', () => {
  for (const language of ['en', 'ta']) {
    assert.doesNotMatch(photograph('vintage-memories', language), /class="photo-date"|null/);
    assert.match(photograph('padma-2016', language), /class="photo-date"/);
    assert.match(photograph('padma-2016', language), /2016/);
    assert.match(photograph('vintage-memories', language), /class="photo-credit"/);
  }
});
