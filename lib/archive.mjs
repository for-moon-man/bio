import { additionalCareerRecords } from './wikipedia.mjs';
import { photograph, photoCollection, chronologyImage } from './visuals.mjs';
import { renderRecordings } from './recordings.mjs';
import { renderBooks } from './books.mjs';
import { profileLink } from './public-life.mjs';
import { chronologyLinks, honourLinks } from './evidence.mjs';
import { awards, timeline, media } from './content.mjs';

const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const sourceLink = () => `<a href="sources.html#biographical-source">About the collection ↗</a>`;
export function renderTimeline() {
  return `<section class="timeline-section wrap" id="chronicle" lang="en"><div class="section-top"><div><span class="eyebrow">03 / THE CHRONICLE</span><h2>A lifetime, in chapters.</h2></div><div class="filters" aria-label="Filter chronology" data-enhanced hidden>${[
    ['all', 'All years'],
    ['education', 'Education'],
    ['isro', 'ISRO'],
    ['beyond', 'Beyond ISRO'],
  ]
    .map(
      ([value, label]) =>
        `<button class="${value === 'all' ? 'active' : ''}" data-era-filter="${value}" aria-pressed="${value === 'all'}" aria-controls="chronicle-list">${label}</button>`,
    )
    .join('')}</div></div>

  <div class="timeline-options"><p id="timeline-count" role="status">37 entries</p></div>
  <div id="chronicle-list">${timeline.map((item, index) => `${chronologyImage(index)}<article class="timeline-row" data-era="${item.era}" id="${item.id}"><span>${escape(item.year)}</span><div><h3>${escape(item.title)}</h3>${chronologyLinks(item)}</div></article>`).join('')}</div>
  ${additionalCareerRecords()}<p class="source-note">The collection is preserved alongside corrections from the cited records. ${sourceLink()} · <a href="sources.html#editorial-notes">Source differences and editorial notes</a>.</p></section>`;
}

export function renderHonours() {
  const categories = [...new Set(awards.map((item) => item.category))];
  const years = [...new Set(awards.flatMap((item) => item.year?.split('–') || []))]
    .sort()
    .reverse();
  return `<section class="awards-section wrap" id="honours-archive"><div class="section-top"><h2>The honours archive.</h2><span id="result-count" role="status">${awards.length} entries</span></div>
  <p class="archive-note">Five categories covering individual honours, team awards, citations, fellowships and listings. Explore the references beside each entry.</p>
  <form class="search-controls" id="award-filters" role="search" aria-label="Filter honours" data-enhanced hidden><label class="search-field"><span class="sr-only">Search honours</span><input id="award-search" type="search" placeholder="Search an award or institution" aria-controls="award-list"></label><label class="select-field"><span>Category</span><select id="award-category" aria-controls="award-list"><option value="all">All categories</option>${categories.map((category) => `<option value="${escape(category)}">${escape(category)} (${awards.filter((item) => item.category === category).length})</option>`).join('')}</select></label><label class="select-field"><span>Year</span><select id="award-year" aria-controls="award-list"><option value="all">All years</option>${years.map((year) => `<option>${year}</option>`).join('')}</select></label><button class="reset-filters" type="reset">Reset filters</button></form>
  <div class="award-list" id="award-list">${awards.map((item, index) => `${index === 0 || awards[index - 1].category !== item.category ? `<div class="award-category-heading" data-award-group="${escape(item.category)}"><span aria-hidden="true">${['✦', '◇', '◎', '✧', '◈'][categories.indexOf(item.category)]}</span><h3>${escape(item.category)}</h3><small>${awards.filter((a) => a.category === item.category).length} records</small></div>` : ''}<article class="award-row" id="${item.id}" data-category="${escape(item.category)}" data-years="${item.year?.replace('–', ' ') || 'undated'}"><span class="award-year">${item.year || ''}</span><div><span class="mini">${escape(item.category)} · ${escape(item.kind)}</span><h3>${escape(item.title)}</h3>${item.organization ? `<p class="award-organization">${escape(item.organization)}</p>` : ''}${item.description ? `<p class="award-description">${escape(item.description)}</p>` : ''}${honourLinks(item)}</div></article>`).join('')}</div>
  <p id="no-results" hidden>No honours match these filters. Try another year or institution, or reset the filters.</p><p class="source-note">79 category records, representing 78 distinct recognitions: the 2024 Weekend Leader / Ethiraj College award appears in two source categories. The BHASKARA and SIES honours are separate records. <a href="sources.html#editorial-notes">Read the source notes</a>.</p></section>`;
}

export function renderGallery() {
  const collections = media.categories.filter((item) =>
    [
      'photos',
      'videos',
      'leaders',
      'work',
      'public',
      'books',
      'media',
      'speeches',
      'about',
    ].includes(item.id),
  );
  return `<section class="wrap" id="photographs"><div class="section-top"><div><span class="eyebrow">THE PERSON. THE WORK. THE MOMENTS.</span><h2>Step into the archive.</h2></div></div>${photoCollection()}<details class="additional-photos"><summary>Portrait &amp; celestial perspectives · 3 more images</summary><div class="photo-grid">${[
    ['portrait.webp', 'Dr. Mylswamy Annadurai', 'Portrait'],
    ['moon.webp', 'The Moon, photographed from Earth', 'Lunar destination'],
    ['earth.webp', 'Earth, photographed by Apollo 17', 'Earth, the home planet'],
  ]
    .map(
      ([file, caption, label]) =>
        `<a class="photo-tile" href="assets/${file}" data-photo="assets/${file}" data-caption="${caption}" aria-label="Enlarge ${caption}"><img src="assets/${file}" alt="${caption}" loading="lazy" width="800" height="800"><span><small>${label}</small>${caption}<i data-lucide="maximize-2" aria-hidden="true"></i></span></a>`,
    )
    .join(
      '',
    )}</div></details><p class="source-note">Photographs include the supplied portrait and Wikimedia Commons imagery. The Moon and Earth images illustrate mission destinations; they are not images from the missions featured here. <a href="sources.html#image-credits">Image credits</a>.</p></section>
  ${renderRecordings()}
  <section class="wrap archive-section" id="archive"><div class="section-top"><div><span class="eyebrow">FROM THE ORIGINAL COLLECTION</span><h2>The personal archive.</h2></div><label class="select-field" data-enhanced hidden><span>Collection</span><select id="gallery-category" aria-controls="archive-collections"><option value="all">All ${collections.length} collections</option>${collections.map((item) => `<option value="${item.id}">${escape(item.title)}</option>`).join('')}</select></label></div>
  <p class="archive-note">Photographs, books, interviews and public appearances from a life in science.</p><p id="archive-count" class="source-note" role="status">${collections.length} collections</p>
  <div class="archive-collections" id="archive-collections">${collections
    .map((category) => {
      if (category.id === 'books') return renderBooks('en', false, { collection: true });
      return `<section class="archive-collection" data-collection="${category.id}" id="archive-${category.id}"><span class="collection-symbol" aria-hidden="true">${{ photos: '▧', videos: '▷', leaders: '◇', work: '◎', public: '◈', family: '⌂', students: '✦', abroad: '↗', school: '▤', quotes: '“', books: '▥', media: '▧', speeches: '◉', about: '▷' }[category.id]}</span><h3>${escape(category.title)}</h3><p>${escape(category.description)}</p>
    ${category.id === 'leaders' ? photograph('padma-2016') : category.id === 'work' ? photograph('chandrayaan-spacecraft') : category.id === 'public' ? photograph('science-2012') : ''}${category.id === 'photos' ? '<a class="text-link" href="#photographs">Explore the photographs ↗</a>' : ''}

    ${category.id === 'videos' ? '<p class="record-source"><a href="#watch">Explore all selected recordings ↗</a></p>' : ''}
    ${
      category.id === 'speeches'
        ? '<ul class="archive-assets">' +
          media.videos
            .filter((video) => video.edition === 'en' && video.kind === 'talk')
            .map(
              (video) =>
                `<li><a href="#recording-${video.id}">${escape(video.editorialTitle || video.title)} ↗</a></li>`,
            )
            .join('') +
          '</ul>'
        : ''
    }
    ${category.id === 'media' ? media.articles.map((article) => `<article class="media-article"><h4><a href="${escape(article.url)}">${escape(article.title)} ↗</a></h4><p class="record-source">${escape(article.publisher)} · ${article.publishedDate}</p><p>${escape(article.description)}</p></article>`).join('') + '<p class="record-source"><a href="#recording-7o2L1_wPYAE">Forbes India interview ↗</a> · <a href="#recording-JIzr664YHFo">The New Indian Express interview ↗</a></p>' : ''}
    ${category.id === 'about' ? '<p class="record-source"><a href="#recording-pLSUgxm4eK0">Watch the biographical film ↗</a></p>' : ''}
    </section>`;
    })
    .join('')}</div></section>
  <section class="wrap channel-section" id="youtube-channel"><div><span class="eyebrow">WATCH &amp; LISTEN</span><h2>Talks on YouTube</h2><p>Explore the channel for more talks and updates.</p></div>${profileLink('youtube', 'Explore the channel')}</section>
`;
}

export function missionRegister() {
  const rows = timeline.filter((item) => item.era === 'isro' && item.year !== '1982');
  return `<section class="wrap mission-register" id="mission-record"><span class="eyebrow">THE CAREER RECORD</span><h2>From simulation to<br>centre leadership.</h2><p class="archive-note">The assignments below connect each mission and programme to the <a href="biography.html#chronicle">complete career chronology</a>. Overlapping dates reflect concurrent roles as recorded by the source.</p><ol>${rows.map((item) => `<li><span>${item.year}</span><a href="biography.html#${item.id}">${escape(item.title)} ↗</a>${chronologyLinks(item)}</li>`).join('')}</ol><p class="source-note">${sourceLink()} · The English INSAT-3B designation is preserved; <a href="sources.html#editorial-notes">the Tamil source differs</a>.</p></section>`;
}
