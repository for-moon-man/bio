import { additionalCareerRecords, scienceOutreach } from './wikipedia.mjs';
import { renderBooks } from './books.mjs';
import { recordReview } from './review.mjs';
import {
  photograph,
  viewer,
  pageTrail,
  routeStory,
  discovery,
  photoCollection,
  creditCards,
  chronologyImage,
} from './visuals.mjs';
import { copyrightNotice } from './legal.mjs';
import { renderCalendar } from './calendar.mjs';
import { profiles, profileLinks, renderPublicLife } from './public-life.mjs';
import { renderEvidence, evidenceLinks, chronologyLinks, honourLinks } from './evidence.mjs';
import { renderVideoEmbed } from './embeds.mjs';
import { privacyNotice } from './legal.mjs';
import { marked } from 'marked';
import { tamil, timeline, media, awards } from './content.mjs';

const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const section = (title) => tamil.split(`## ${title}`)[1].split('\n## ')[0].trim();
const tamilHonourIds = [
  ['government-01', 'government-02', 'government-03'],
  [
    'academia-01',
    'academia-04',
    'academia-02',
    'academia-03',
    ...Array.from({ length: 10 }, (_, i) => 'academia-' + String(i + 5).padStart(2, '0')),
  ],
  ['isro-02', 'isro-01', 'isro-03', 'isro-04', 'isro-05', 'isro-06'],
  [2, 4, 3, 12, 15, 18, 11, 17, 1, 5, 6, 7, 8, 9, 10, 13, 14, 16, 19, 20, 22].map(
    (i) => 'professional-' + String(i).padStart(2, '0'),
  ),
  [
    1, 2, 3, 4, 5, 15, 6, 12, 7, 18, 8, 17, 9, 10, 11, 13, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30,
  ].map((i) => 'social-' + String(i).padStart(2, '0')),
];
function linkedTamilHonours(markdown, category) {
  // The supplied Tamil text accidentally joins the first two social honours.
  const normalized = markdown.replace('விருது 2. கொங்கு', 'விருது\n2. கொங்கு');
  let index = 0;
  const html = marked.parse(normalized).replace(/<li>([\s\S]*?)<\/li>/g, (html, text) => {
    const id = tamilHonourIds[category][index++];
    const item = awards.find((a) => a.id === id);
    if (!item) throw new Error('Tamil honour mapping requires review');
    const replacement = recordReview.records[id].tamilText;
    return '<li>' + (replacement ? escape(replacement) : text) + honourLinks(item, 'ta') + '</li>';
  });
  if (index !== tamilHonourIds[category].length) throw new Error('Tamil honour count mismatch');
  return html;
}
const date = (value) =>
  new Intl.DateTimeFormat('ta-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value));
const duration = (value) => `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
const recordings = {
  '6bFEo12lDUI': {
    title: 'சந்திரயான் பயணம் — நிலாத் தமிழருடன் ஓர் உரையாடல்',
    publisher: 'மிஸ்டர் ஜி.கே.',
    description:
      'சந்திரயான், விண்வெளி அறிவியல் மற்றும் இந்திய விண்வெளிப் பயணம் குறித்து மயில்சாமி அண்ணாதுரையுடன் மிஸ்டர் ஜி.கே. நடத்தும் நேர்காணல்.',
  },
  VcjrlTcBcqE: {
    title: 'நிலவும் செவ்வாயும் — விண்வெளிக் கல்வியை நோக்கி',
    publisher: 'மதன் கௌரி',
    description:
      'நிலவில் நீர், செவ்வாய்ப் பயணம், தனியார் விண்வெளி முயற்சிகள், தாய்மொழிக் கல்வி ஆகியவை குறித்து மயில்சாமி அண்ணாதுரையும் ஆனந்த் மேகலிங்கமும் மதன் கௌரியுடன் உரையாடுகின்றனர்.',
  },
};
const chapters = [
  'நிலவில் நீர்',
  'செவ்வாய்ப் பயணம்',
  'தாய்மொழியில் கற்றல்',
  'மாணவர்களும் விண்வெளிக் கல்வியும்',
];

export function renderTamil() {
  const honours = section('விருதுகள்')
    .split('### ')
    .filter((value) => value.trim());
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'நிலாத் தமிழர் — முனைவர் மயில்சாமி அண்ணாதுரை',
    inLanguage: 'ta',
    url: 'https://for-moon-man.github.io/bio/tamil.html',
    about: {
      '@type': 'Person',
      name: 'மயில்சாமி அண்ணாதுரை',
      birthDate: '1958-07-02',
      sameAs: Object.values(profiles),
    },
  };
  return `<!doctype html>
<html lang="ta"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#351920"><title>நிலாத் தமிழர் | முனைவர் மயில்சாமி அண்ணாதுரை</title><meta name="description" content="கோதவாடியிலிருந்து விண்வெளி வரை: முனைவர் மயில்சாமி அண்ணாதுரையின் வாழ்க்கை, கல்வி, பணிகள், விருதுகள் மற்றும் தமிழ் நேர்காணல்கள்."><link rel="canonical" href="https://for-moon-man.github.io/bio/tamil.html"><link rel="alternate" hreflang="en" href="https://for-moon-man.github.io/bio/index.html"><link rel="alternate" hreflang="ta" href="https://for-moon-man.github.io/bio/tamil.html"><script type="application/ld+json">${JSON.stringify(schema)}</script><link rel="stylesheet" href="assets/tamil.css"><link rel="stylesheet" href="assets/visuals.css"><link rel="stylesheet" href="assets/embeds.css"><link rel="stylesheet" href="assets/public-life.css"><link rel="stylesheet" href="assets/review.css"><link rel="stylesheet" href="assets/books.css"><link rel="stylesheet" href="assets/calendar.css"><script defer src="assets/tamil.js"></script><script defer src="assets/visuals.js"></script><script defer src="assets/embeds.js"></script></head>
<body id="top"><a class="skip-link" href="#main">உள்ளடக்கத்திற்குச் செல்க</a>
<header class="masthead"><div class="edition-bar"><span>அறிவியல் · கல்வி · சமூகப் பணி</span><a href="index.html" lang="en" hreflang="en" class="language">English <span aria-hidden="true">↗</span></a></div><div class="masthead-brand"><img class="masthead-emblem" src="assets/tamil-kolam.svg" alt="" width="62" height="62"><div><a class="masthead-title" href="tamil.html">நிலாத் தமிழர்</a><p>முனைவர் மயில்சாமி அண்ணாதுரை</p></div></div><div class="ornament" aria-hidden="true">◆</div><nav aria-label="முதன்மை வழிசெலுத்தல்"><a href="#life">வாழ்க்கை</a><a href="#chronicle">கல்வியும் பணியும்</a><a href="#lunar-discovery">விண்வெளி</a><a href="#honours">விருதுகள்</a><a href="#books">நூல்கள்</a><a href="#watch">உரையாடல்கள்</a><a href="#gallery">படங்கள்</a><a href="#upcoming-events">நிகழ்வுகள்</a><a href="#public-life">நிகழ்வுப் பதிவுகள்</a><a href="#notes">குறிப்புகள்</a></nav></header>
<main id="main">
<section class="opening folio" aria-labelledby="intro-title"><div class="opening-copy"><p class="kicker">கோதவாடியில் தொடங்கிய பயணம்</p><h1 id="intro-title">மண்ணின் மைந்தர்.<br><em>நிலவின் நாயகர்.</em></h1><p class="lead">ஒரு கிராமத்தின் எளிய தொடக்கம்.<br>விண்வெளி வரை விரிந்த அறிவியல் பயணம்.</p><p>இந்தியாவின் முதல் நிலவுப் பயணமான சந்திரயான்–1 திட்டத்தின் இயக்குநர். அறிவியலையும் கல்வியையும் அடுத்த தலைமுறையிடம் கொண்டு செல்லும் நிலாத் தமிழர்.</p><a class="button" href="#life">வாழ்க்கைப் பயணத்தை அறிக <span aria-hidden="true">↓</span></a>${profileLinks('ta')}</div><figure class="portrait"><div class="portrait-frame"><img src="assets/portrait.webp" width="900" height="900" fetchpriority="high" alt="முனைவர் மயில்சாமி அண்ணாதுரை"></div><figcaption>முனைவர் மயில்சாமி அண்ணாதுரை<br><span>பத்மஸ்ரீ விருது · 2016</span></figcaption></figure></section>
<div class="milestone-strip folio"><div><strong>1958</strong><span>ஜூலை 2 · கோதவாடியில் பிறப்பு</span></div><div><strong>1982–2018</strong><span>இஸ்ரோவில் அறிவியல் பணி</span></div><div><strong>2008</strong><span>சந்திரயான்–1 விண்ணில் பாய்ந்த ஆண்டு</span></div></div>
${renderCalendar('ta')}${renderPublicLife({ language: 'ta' })}
<section class="folio chapter" id="life"><div class="section-heading" data-chapter="௦௧"><span class="kicker">வாழ்க்கைக் குறிப்பு</span><h2>வேர்களிலிருந்து விண்வெளிக்கு</h2></div><div class="life-spread">${photograph('early-portrait', 'ta')}<div class="reading">${marked.parse(section('நிலாத் தமிழர்'))}${evidenceLinks(['ursc'], 'ta')}<p>சந்திரயான்–1 திட்ட இயக்குநராக 2004–2009 காலகட்டத்திலும், சந்திரயான்–2 திட்டத்தின் தொடக்க வளர்ச்சிப் பணிகளில் 2008–2013 காலகட்டத்திலும் பணியாற்றினார். சந்திரயான்–2 பொறுப்பு, அதன் 2019 ஏவுதலுக்கு முந்தையது.</p><p>சந்திரயான்–1, 22 அக்டோபர் 2008 அன்று விண்ணில் ஏவப்பட்டது. அதன் அறிவியல் கருவிகள் நிலவில் நீர் மூலக்கூறுகள் இருப்பதற்கான ஆதாரங்களை வழங்கின. <a href="https://www.isro.gov.in/Chandrayaan_1.html">இஸ்ரோவின் திட்டக் குறிப்பு</a> · <a href="https://science.nasa.gov/mission/chandrayaan-1/">நாசாவின் அறிவியல் விளக்கம்</a>.</p></div></div>${routeStory('ta')}${photograph('vintage-memories', 'ta')}</section>${discovery('ta')}
<section class="folio chapter" id="chronicle"><div class="section-heading" data-chapter="௦௨"><span class="kicker">காலச்சுவடுகள்</span><h2>கல்வியும் பணியும்</h2><p>படிப்பு, விண்வெளிப் பணிகள், கல்வி மற்றும் சமூகப் பங்களிப்புகள்.</p></div><div class="era-filters" aria-label="காலவரிசையைத் தேர்ந்தெடுக்க" data-enhanced hidden>${[
    ['all', 'அனைத்தும்'],
    ['education', 'கல்வி'],
    ['isro', 'இஸ்ரோ'],
    ['beyond', 'இஸ்ரோவிற்குப் பின்'],
  ]
    .map(
      ([value, label]) =>
        `<button type="button" data-era-filter="${value}" aria-pressed="${value === 'all'}" aria-controls="chronicle-list">${label}</button>`,
    )
    .join(
      '',
    )}</div><p id="timeline-count" class="count" role="status">37 பதிவுகள்</p><div id="chronicle-list">${timeline.map((item, index) => `${chronologyImage(index, 'ta')}<article class="timeline-row" data-era="${item.era}" id="${item.id}"><span class="timeline-year">${escape(item.tamilYear)}</span><div><h3>${escape(item.tamil)}</h3>${chronologyLinks(item, 'ta')}</div></article>`).join('')}</div></section>
<section class="honours-band" id="honours"><div class="folio chapter"><div class="section-heading" data-chapter="௦௩"><span class="kicker">பணிக்குக் கிடைத்த பாராட்டுகள்</span><h2>விருதுகளும் அங்கீகாரங்களும்</h2></div><div class="honour-feature"><span aria-hidden="true">✦</span><div><h3>பத்மஸ்ரீ · 2016</h3><p>அறிவியல் மற்றும் பொறியியல் துறையில் ஆற்றிய பணிக்காக இந்திய அரசு வழங்கிய விருது.</p></div></div>${evidenceLinks(['padma', 'ursc'], 'ta')}${photograph('padma-2016', 'ta', 'tamil-award-photo')}<p class="note">தமிழ் வாழ்க்கைக் குறிப்பில் உள்ள விருதுகள் கீழே தொகுக்கப்பட்டுள்ளன. மதிப்புறு முனைவர் பட்டங்கள், கல்வி மூலம் பெற்ற முனைவர் பட்டத்திலிருந்து வேறுபட்டவை.</p><div class="honours-list">${honours
    .map((part, index) => {
      const split = part.indexOf('\n');
      return `<details${index === 0 ? ' open' : ''}><summary>${escape(part.slice(0, split).trim())}</summary>${linkedTamilHonours(part.slice(split), index)}</details>`;
    })
    .join('')}</div></div></section>
<section class="folio science-outreach">${additionalCareerRecords('ta')}${scienceOutreach('ta')}</section>${renderBooks('ta')}<section class="folio chapter" id="watch"><div class="section-heading" data-chapter="௦௪"><span class="kicker">அவரது குரலில்</span><h2>அறிவியலும் உரையாடலும்</h2><p>விண்வெளியை நெருக்கமாக அறிய உதவும் தமிழ் நேர்காணல்கள்.</p></div>${photograph('science-2012', 'ta', 'speaking-photo')}<div class="recording-grid">${media.videos
    .filter((video) => video.edition === 'ta')
    .map((video) => {
      const text = recordings[video.id];
      return `<article class="video-record" id="recording-${video.id}"><p class="kicker">நேர்காணல் · ${duration(video.durationSeconds)}</p><h3><a href="${video.url}">${text.title}</a></h3><p class="byline"><a href="${escape(video.publisherUrl)}">${text.publisher} ↗</a> · வெளியீடு <time datetime="${escape(video.publishedAt)}">${date(video.publishedAt)}</time></p><p>${text.description}</p><p class="note">${new Intl.NumberFormat('ta-IN').format(video.viewCount)} பார்வைகள் · ${date(video.viewCountCheckedOn)} நிலவரம்</p>${video.chapters ? `<ul class="chapters">${video.chapters.map((chapter, index) => `<li><a href="${video.url}&amp;t=${chapter.seconds}s">${duration(chapter.seconds)} · ${chapters[index]}</a></li>`).join('')}</ul>` : ''}<a class="watch-link" href="${video.url}">காணொளியைப் பார்க்க <span aria-hidden="true">↗</span></a>${renderVideoEmbed(video, 'ta', text.title)}</article>`;
    })
    .join(
      '',
    )}</div><p class="note">தலைப்புகள், வெளியீட்டாளர் விளக்கங்கள் மற்றும் காணொளித் தகவல்களின் அடிப்படையில் தேர்ந்தெடுக்கப்பட்டவை. பார்வை எண்ணிக்கைகள் தர மதிப்பீடுகள் அல்ல. இயக்கும் பொத்தானை அழுத்திய பிறகே காணொளிச் சேவையுடன் இணைப்பு ஏற்படும்.</p></section>
<section class="folio chapter" id="gallery"><div class="section-heading" data-chapter="௦௫"><span class="kicker">ஒளிப்படங்கள்</span><h2>ஒரு பார்வையில்</h2></div>${photoCollection('ta')}<details class="additional-photos"><summary>மேலும் மூன்று படங்கள்</summary><div class="picture-grid">${[
    ['portrait.webp', 'முனைவர் மயில்சாமி அண்ணாதுரை'],
    ['moon.webp', 'நிலவு — பூமியிலிருந்து எடுத்த படம்'],
    ['earth.webp', 'பூமி — அப்பல்லோ 17 எடுத்த படம்'],
  ]
    .map(
      ([file, caption]) =>
        `<figure><a href="assets/${file}" aria-label="${caption} — பெரிதாகப் பார்க்க"><img src="assets/${file}" alt="${caption}" loading="lazy" width="800" height="800"></a><figcaption>${caption}</figcaption></figure>`,
    )
    .join(
      '',
    )}</div></details><p class="note">நிலவு, பூமி ஆகிய படங்கள் விண்வெளிப் பயணங்களின் பின்னணியை விளக்குகின்றன; இவை சந்திரயான் திட்டத்தில் எடுக்கப்பட்டவை அல்ல. <a href="#image-credits">படங்களின் உரிமக் குறிப்புகள்</a>.</p></section>

<section class="folio chapter notes-section" id="notes"><div class="section-heading" data-chapter="௦௬"><span class="kicker">தொகுப்பைப் பற்றி</span><h2>பதிவுகளும் குறிப்புகளும்</h2></div><div class="reading"><p>இந்தத் தமிழ்ப் பதிப்பு, 30 செப்டம்பர் 2026 அன்று வழங்கப்பட்ட வாழ்க்கைக் குறிப்புத் தொகுப்பை அடிப்படையாகக் கொண்டது. மூலப் பதிவுகள் பாதுகாக்கப்பட்டுள்ளன. கிடைத்த நிறுவன மற்றும் செய்தி ஆதாரங்களின்படி தேதிகளும் விவரங்களும் திருத்தப்பட்டு, ஒவ்வொரு பதிவிற்கும் ஆதாரக் குறிப்புகள் சேர்க்கப்பட்டுள்ளன.</p><p>சிறந்த ஆளுமை விருதின் நாள் தமிழில் 24 மே 2024 என்றும் ஆங்கிலத்தில் 25 மே 2024 என்றும் உள்ளது. இங்கு மே 2024 என்று காட்டப்படுகிறது.</p><p>ஒரு நேர்காணலின் வெளியீட்டாளர் விளக்கத்தில் இஸ்ரோ தலைவர் என்று தவறாகக் குறிப்பிடப்பட்டுள்ளது. அண்ணாதுரை வகித்த பொறுப்பு இஸ்ரோ செயற்கைக்கோள் மையத்தின் இயக்குநர் என்பதாகும்.</p><p>காணொளி வெளியீட்டுத் தேதிகள் இந்திய நேரப்படி காட்டப்படுகின்றன; இவை நிகழ்வு நடைபெற்ற நாளாக இருக்க வேண்டியதில்லை. காணொளித் தகவல்கள் 3 அக்டோபர் 2026 அன்று மீண்டும் சரிபார்க்கப்பட்டன.</p>
<h3>நூல்களும் விக்கிப்பீடியா ஆய்வும்</h3><p>ஆங்கில, தமிழ் விக்கிப்பீடியா பதிவுகள் 3 அக்டோபர் 2026 அன்று ஆய்வு செய்யப்பட்டன. நூல் விவரங்கள் பதிப்பாளர் மற்றும் நூற்பட்டியல் ஆதாரங்களுடன் ஒப்பிடப்பட்டுள்ளன. அட்டைகள் நூல்களை அடையாளம் காண்பதற்கான சிறிய படங்களாகக் காட்டப்படுகின்றன; ஒவ்வொன்றும் அதன் ஆதாரத்துடன் இணைக்கப்பட்டுள்ளது. <a href="#books">நூல்களைக் காண்க</a>.</p><p>டிசம்பர் 2021-இல் கோதவாடி ஏரியை மீட்டெடுத்த தன்னார்வலர்களைப் பாராட்ட அண்ணாதுரை சென்றதாக <a href="https://www.newindianexpress.com/states/tamil-nadu/2021/Dec/20/moon-mans-long-standing-dream-becomes-a-reality-2397627.html">தி நியூ இந்தியன் எக்ஸ்பிரஸ்</a> செய்தி வெளியிட்டது. அவரது தன்வரலாற்று நூலிலும் ஏரி பற்றிய அக்கறை இடம்பெற்றிருப்பதாக அச்செய்தி குறிப்பிடுகிறது.</p><h3 id="image-credits">படங்களின் உரிமக் குறிப்புகள்</h3>${creditCards('ta')}<ul><li><a href="https://commons.wikimedia.org/wiki/File:Mylswamy_Annadurai.jpg">அண்ணாதுரை ஒளிப்படம்</a> — ராம் 121; பொதுக் கள உரிமம்; விக்கிமீடியா காமன்ஸ்.</li><li><a href="https://commons.wikimedia.org/wiki/File:FullMoon2010.jpg">முழு நிலவு, 2010</a> — கிரிகரி எச். ரெவெரா; <a href="https://creativecommons.org/licenses/by-sa/3.0/">கிரியேட்டிவ் காமன்ஸ் பகிர்வுரிமம் 3.0</a>. அளவு மாற்றம், வெட்டமைப்பு செய்யப்பட்ட படமும் அதே உரிமத்தில் பகிரப்படுகிறது.</li><li><a href="https://commons.wikimedia.org/wiki/File:The_Earth_seen_from_Apollo_17.jpg">பூமியின் ஒளிப்படம்</a> — நாசா / அப்பல்லோ 17 குழு; பொதுக் கள உரிமம்.</li></ul><p>எழுத்துரு: நோட்டோ செரிஃப் தமிழ். <a href="assets/fonts/NotoSerifTamil-OFL.txt">எழுத்துருவின் திறந்த உரிமம்</a>. இந்தத் தளத்திலிருந்தே எழுத்துரு ஏற்றப்படுகிறது; மாற்றாகக் கணினியில் உள்ள தமிழ் எழுத்துருக்கள் பயன்படுத்தப்படும்.</p></div></section>
${renderEvidence('tamil', 'ta')}<section class="folio chapter">${privacyNotice('ta')}</section></main>${viewer('ta')}<footer class="folio">${profileLinks('ta')}<div class="ornament" aria-hidden="true">◆</div><a class="footer-name" href="#top">நிலாத் தமிழர்</a><p>கோதவாடியின் வேர்கள் · விண்வெளியின் கனவுகள்</p><a href="#top">மேலே செல்க ↑</a>${copyrightNotice('ta')}</footer></body></html>`;
}
