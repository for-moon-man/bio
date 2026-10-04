import { readFileSync } from 'node:fs';

export const photos = JSON.parse(
  readFileSync(new URL('../data/archive-photos.json', import.meta.url), 'utf8'),
);
export const esc = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
export function photograph(id, language = 'en', className = '') {
  const p = photos.find((photo) => photo.id === id);
  const ta = language === 'ta';
  const caption = ta ? p.captionTa : p.caption;
  return `<figure class="archive-photo ${className}"><a href="${p.src}" data-photo="${p.src}" data-caption="${esc(caption)}" data-credit="${esc(ta ? p.creditTa : p.credit)}" data-source="${esc(p.source)}" aria-label="${esc(ta ? 'பெரிதாகப் பார்க்க: ' + p.titleTa : 'Enlarge: ' + p.title)}"><img src="${p.src}" alt="${esc(caption)}" width="${p.width}" height="${p.height}" loading="lazy"><span class="enlarge-mark" aria-hidden="true">↗</span></a><figcaption><span class="photo-date">${esc(ta ? p.dateTa : p.date)}</span><span>${esc(caption)}</span><a class="photo-credit" href="${esc(p.source)}">${esc(ta ? p.creditTa : p.credit)} · ${esc(ta ? p.licenseTa || (p.license === 'Public domain' ? 'பொதுக் களம்' : p.license) : p.license)} ↗</a></figcaption></figure>`;
}
export function viewer(language = 'en') {
  const ta = language === 'ta';
  return `<dialog id="photo-dialog" aria-label="${ta ? 'ஒளிப்படக் காட்சி' : 'Photograph viewer'}"><div class="viewer-toolbar"><span id="photo-position" aria-live="polite"></span><button type="button" class="dialog-close" aria-label="${ta ? 'மூடு' : 'Close photograph'}">×</button></div><img id="dialog-image" alt=""><div class="viewer-caption"><p id="dialog-caption"></p><a id="dialog-source"></a></div><div class="viewer-nav"><button type="button" data-photo-step="-1" aria-label="${ta ? 'முந்தைய படம்' : 'Previous photograph'}">←</button><span>${ta ? 'படங்களைத் தொடர்க' : 'Explore the photographs'}</span><button type="button" data-photo-step="1" aria-label="${ta ? 'அடுத்த படம்' : 'Next photograph'}">→</button></div></dialog>`;
}
export function pageTrail(items, language = 'en') {
  return `<nav class="page-trail ${language === 'ta' ? 'folio' : 'wrap'}" aria-label="${language === 'ta' ? 'இந்தப் பக்கத்தில்' : 'On this page'}"><span>${language === 'ta' ? 'இந்தப் பக்கத்தில்' : 'EXPLORE THIS CHAPTER'}</span>${items.map(([url, label]) => `<a href="${url}">${label}</a>`).join('')}</nav>`;
}
export function routeStory(language = 'en') {
  const ta = language === 'ta';
  const stops = ta
    ? [
        ['1958', 'கோதவாடி', 'பிறந்த ஊர்'],
        ['1976–1982', 'கோயம்புத்தூர்', 'பொறியியல் கல்வி'],
        ['1982–2018', 'பெங்களூரு', 'இஸ்ரோவில் பணி'],
        ['2008', 'ஸ்ரீஹரிகோட்டா', 'சந்திரயான்–1 ஏவுதல்'],
      ]
    : [
        ['1958', 'Kodhawady', 'Where the story begins'],
        ['1976–1982', 'Coimbatore', 'An engineering education'],
        ['1982–2018', 'Bengaluru', 'A career at ISRO'],
        ['2008', 'Sriharikota', 'Chandrayaan-1 lifts off'],
      ];
  return `<aside class="route-story" aria-label="${ta ? 'பயணத்தின் இடங்கள்' : 'Places in the journey'}"><span class="${ta ? 'kicker' : 'eyebrow'}">${ta ? 'ஊரும் கல்வியும் விண்வெளியும்' : 'FOUR PLACES. ONE EXTRAORDINARY JOURNEY.'}</span><ol>${stops.map(([date, place, caption]) => `<li><span>${date}</span><strong>${place}</strong><small>${caption}</small></li>`).join('')}</ol><a href="${ta ? '#chronicle' : 'biography.html#chronicle'}">${ta ? 'முழுக் காலவரிசை' : 'Follow the complete chronology'} ↗</a></aside>`;
}
export function visualStory(id, language = 'en') {
  const ta = language === 'ta';
  const stories = {
    science: [
      'science-2012',
      'Science belongs in the conversation.',
      'அறிவியல் அனைவருக்குமானது.',
      'Beyond the control room, Annadurai brings space science into public life. This 2012 address in New Delhi connects the mission leader with the science communicator.',
      'கட்டுப்பாட்டு அறைக்கு அப்பாலும் விண்வெளி அறிவியலை மக்களிடம் கொண்டு செல்கிறார் அண்ணாதுரை. புதுதில்லியில் 2012-இல் நிகழ்த்திய உரை அவரது அறிவியல் பரப்புரைப் பணிக்கான ஒரு பதிவு.',
      'gallery.html#watch',
      '#watch',
      'Hear him speak',
      'அவரது உரையாடல்களைக் கேட்க',
    ],
    award: [
      'padma-2016',
      'A moment of national recognition.',
      'நாட்டின் பாராட்டைப் பெற்ற தருணம்.',
      'On 28 March 2016, President Pranab Mukherjee presented Annadurai with the Padma Shri at Rashtrapati Bhavan. An archival photograph puts a face and a moment to the honour.',
      '28 மார்ச் 2016 அன்று குடியரசுத் தலைவர் மாளிகையில், பிரணாப் முகர்ஜி அண்ணாதுரைக்குப் பத்மஸ்ரீ விருதை வழங்கினார். அந்தத் தருணத்தைப் பதிவு செய்த ஒளிப்படம்.',
      'honours.html#honours-archive',
      '#honours',
      'Explore the honours',
      'விருதுகளை அறிக',
    ],
    launch: [
      'launch-2008',
      '22 October 2008. A new horizon.',
      '22 அக்டோபர் 2008. புதிய தொடக்கம்.',
      'From Sriharikota to lunar orbit: Chandrayaan-1 carried Indian and international instruments on India’s first mission to the Moon. Annadurai was its project director.',
      'ஸ்ரீஹரிகோட்டாவிலிருந்து நிலவின் சுற்றுப்பாதைக்கு: இந்திய மற்றும் பன்னாட்டு அறிவியல் கருவிகளை ஏந்திச் சென்ற இந்தியாவின் முதல் நிலவுப் பயணம். அதன் திட்ட இயக்குநர் அண்ணாதுரை.',
      'missions.html#chandrayaan-1',
      '#lunar-discovery',
      'Inside Chandrayaan-1',
      'சந்திரயான்–1 பற்றி அறிக',
    ],
  };
  const [photo, title, titleTa, copy, copyTa, url, urlTa, link, linkTa] = stories[id];
  return `<section class="visual-story ${ta ? 'folio' : 'wrap'}">${photograph(photo, language)}<div class="visual-story-copy"><span class="${ta ? 'kicker' : 'eyebrow'}">${ta ? 'ஒளிப்படம் சொல்லும் வரலாறு' : 'A MOMENT IN THE ARCHIVE'}</span><h2>${ta ? titleTa : title}</h2><p>${ta ? copyTa : copy}</p><a class="${ta ? 'watch-link' : 'text-link'}" href="${ta ? urlTa : url}">${ta ? linkTa : link} ↗</a></div></section>`;
}
export function discovery(language = 'en') {
  const ta = language === 'ta';
  return `<section class="discovery ${ta ? 'folio' : 'wrap'}" id="lunar-discovery"><div><span class="${ta ? 'kicker' : 'eyebrow'}">${ta ? 'தரவுகள் சொல்லும் கதை' : 'THE SCIENCE, UP CLOSE'}</span><h2>${ta ? 'நிலவில் நீரின் தடயம்.' : 'The signature of water.'}</h2><p>${ta ? 'நிலவின் மேற்பரப்பிலிருந்து பிரதிபலிக்கும் ஒளியை ஆய்வு செய்த கருவிகள், கனிமங்களில் நீர் மற்றும் ஹைட்ராக்சிலின் தடயங்களை வெளிப்படுத்தின. நீல வண்ணம் குறிக்கும் பகுதியை அசல் படத்தில் பெரிதாகக் காணலாம்.' : 'By studying reflected light, the Moon Mineralogy Mapper aboard Chandrayaan-1 revealed signatures of water and hydroxyl in surface material. Open the image to examine the blue regions in detail.'}</p><a class="${ta ? 'watch-link' : 'text-link'}" href="https://science.nasa.gov/mission/chandrayaan-1/">${ta ? 'நாசாவின் அறிவியல் விளக்கம்' : 'Explore NASA’s mission account'} ↗</a></div>${photograph('lunar-water', language)}${photograph('water-crater', language, 'crater-detail')}</section>`;
}
export function photoCollection(language = 'en') {
  const ta = language === 'ta';
  return `<div class="photo-filters" data-enhanced hidden role="group" aria-label="${ta ? 'படங்களைத் தேர்ந்தெடுக்க' : 'Filter photographs'}">${[
    ['all', ta ? 'அனைத்தும்' : 'All photographs'],
    ['people', ta ? 'அண்ணாதுரை' : 'The person'],
    ['missions', ta ? 'விண்வெளிப் பயணங்கள்' : 'The missions'],
  ]
    .map(
      ([value, label]) =>
        `<button type="button" data-photo-filter="${value}" aria-pressed="${value === 'all'}">${label}</button>`,
    )
    .join(
      '',
    )}</div><div class="archive-photo-grid">${photos.map((p) => `<div data-photo-category="${p.category}">${photograph(p.id, language)}</div>`).join('')}</div><p class="photo-count" role="status">${ta ? '7 ஒளிப்படங்களும் அறிவியல் படங்களும்' : '7 archival photographs and science images'}</p>`;
}
export function creditCards(language = 'en') {
  const ta = language === 'ta';
  return `<div class="credit-cards">${photos.map((p) => `<article><a href="${esc(p.source)}"><img src="${p.src}" alt="${esc(ta ? p.titleTa : p.title)}" loading="lazy" width="${p.width}" height="${p.height}"></a><div><h3><a href="${esc(p.source)}">${esc(ta ? p.titleTa : p.title)} ↗</a></h3><p>${esc(ta ? p.creditTa : p.credit)}</p>${p.licenseUrl ? `<a href="${esc(p.licenseUrl)}">${esc(ta ? p.licenseTa || (p.license === 'Public domain' ? 'பொதுக் களம்' : p.license) : p.license)} ↗</a>` : `<span>${esc(ta ? p.licenseTa || (p.license === 'Public domain' ? 'பொதுக் களம்' : p.license) : p.license)}</span>`}<p>${esc(ta ? p.modificationsTa || 'அளவு மாற்றப்பட்டு இணையப் பட வடிவில் வழங்கப்படுகிறது.' : p.modifications)}</p></div></article>`).join('')}</div>`;
}
export function chronologyImage(index, language = 'en') {
  const map = {
    3: ['early-portrait', 'isro'],
    14: ['launch-2008', 'isro'],
    17: ['padma-2016', 'isro'],
    23: ['science-2012', 'beyond'],
  };
  const item = map[index];
  return item
    ? `<aside class="chronicle-photo" data-era-illustration="${item[1]}">${photograph(item[0], language)}</aside>`
    : '';
}
