import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { bibliography } from '../lib/books.mjs';

test('bibliography reconciles Wikipedia labels with catalogue editions and preserves uncertainty', () => {
  const books = bibliography.books;
  assert.equal(books.length, 5);
  assert.equal(bibliography.pending.length, 2);
  assert.equal(books.find((b) => b.id === 'kaiyaruke-nila').year, null);
  assert.equal(
    books.find((b) => b.id === 'valarum-ariviyal-kalanjiyam').collaborator,
    'E. K. T. Sivakumar',
  );
  assert.equal(books.find((b) => b.id === 'vinnum-mannum').collaborator, 'V. Dillibabu');
  assert.match(books.find((b) => b.id === 'siragai-virikkum-mangalyaan').note, /2015.*2019/);
  for (const b of books) {
    assert.ok(b.note && b.noteTa && b.coverCredit);
    assert.ok(b.sources.some((s) => !s.url.includes('wikipedia.org')));
    assert.ok(existsSync(new URL('../' + b.cover, import.meta.url)));
    assert.ok(b.coverWidth <= 240 && b.coverHeight <= 360);
    for (const page of ['biography', 'tamil', 'gallery']) {
      const html = readFileSync(new URL(`../${page}.html`, import.meta.url), 'utf8');
      assert.ok(html.includes(`id="book-${b.id}"`));
      assert.ok(html.includes(b.cover));
      assert.ok(html.includes(b.titleTa));
    }
  }
});
