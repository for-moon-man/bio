import {
  photograph,
  viewer,
  pageTrail,
  routeStory,
  visualStory,
  discovery,
} from './lib/visuals.mjs';
import { writeFileSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderCalendar } from './lib/calendar.mjs';
import { copyrightNotice } from './lib/legal.mjs';
import { projectRoot } from './lib/project.mjs';
import { renderTamil } from './lib/tamil.mjs';
import { renderSources } from './lib/sources.mjs';
import { renderEvidence, evidenceLinks } from './lib/evidence.mjs';
import { featuredRecording } from './lib/embeds.mjs';
import { renderBooks } from './lib/books.mjs';
import { scienceOutreach } from './lib/wikipedia.mjs';

import { profiles, profileLinks, renderPublicLife } from './lib/public-life.mjs';

const root = projectRoot;
import { awards, timeline, manifest } from './lib/content.mjs';
import { renderTimeline, renderHonours, renderGallery, missionRegister } from './lib/archive.mjs';
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const arrow = icon('arrow-up-right');
const link = (url, text, style = 'text-link') =>
  `<a class="${style}" href="${url}">${text}${arrow}</a>`;
const nav = [
  ['index.html', 'Overview'],
  ['biography.html', 'The journey'],
  ['missions.html', 'Missions'],
  ['honours.html', 'Honours'],
  ['biography.html#books', 'Books'],
  ['gallery.html', 'In focus'],
  ['index.html#upcoming-events', 'Events'],
];
const page = (file, title, content, language = 'en') => {
  const descriptions = {
    'index.html':
      'Dr. Mylswamy Annadurai, the Moon Man of India: his life, ISRO missions, honours and archive.',
    'biography.html':
      'From Kodhawady to ISRO and beyond: education, mission leadership and 37 career records through 2026.',
    'missions.html':
      'Satellite simulation, IRS and INSAT operations, EDUSAT, Chandrayaan and programme leadership in Dr. Annadurai’s career.',
    'honours.html':
      'Explore 79 source records of government, academic, ISRO, professional and public honours. Search by award, category and year.',
    'gallery.html':
      'Watch eight selected talks, interviews and films, and explore 14 archive collections from Dr. Mylswamy Annadurai’s life.',
    'sources.html':
      'Sources, archival provenance, editorial notes and image credits for the biography of Dr. Mylswamy Annadurai.',
  };
  const canonical = 'https://for-moon-man.github.io/bio/' + file;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://for-moon-man.github.io/bio/#website',
        url: 'https://for-moon-man.github.io/bio/',
        name: 'Dr. Mylswamy Annadurai — Moon Man of India',
        inLanguage: ['en', 'ta'],
      },
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name: title,
        description: descriptions[file],
        inLanguage: language,
        isPartOf: { '@id': 'https://for-moon-man.github.io/bio/#website' },
        about: { '@id': 'https://for-moon-man.github.io/bio/#person' },
      },
      ...(file === 'index.html'
        ? [
            {
              '@type': 'Person',
              '@id': 'https://for-moon-man.github.io/bio/#person',
              name: 'Mylswamy Annadurai',
              alternateName: 'Moon Man of India',
              sameAs: Object.values(profiles),
              birthDate: '1958-07-02',
              birthPlace: { '@type': 'Place', name: 'Kodhawady, Tamil Nadu, India' },
              award: 'Padma Shri (2016)',
              alumniOf: [
                'Government College of Technology, Coimbatore',
                'PSG College of Technology, Coimbatore',
                'Anna University',
              ].map((name) => ({ '@type': 'CollegeOrUniversity', name })),
            },
          ]
        : []),
    ],
  };
  const html = `<!doctype html>
<html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#161817"><meta name="description" content="${escape(descriptions[file])}"><title>${escape(title)} | Dr. Mylswamy Annadurai</title><link rel="canonical" href="${canonical}">${file === 'index.html' ? '<link rel="alternate" hreflang="ta" href="https://for-moon-man.github.io/bio/tamil.html"><link rel="alternate" hreflang="en" href="https://for-moon-man.github.io/bio/index.html">' : ''}<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script><link rel="stylesheet" href="assets/site.css"><link rel="stylesheet" href="assets/visuals.css"><link rel="stylesheet" href="assets/embeds.css"><link rel="stylesheet" href="assets/public-life.css"><link rel="stylesheet" href="assets/review.css"><link rel="stylesheet" href="assets/books.css">${file === 'index.html' ? '<link rel="stylesheet" href="assets/calendar.css">' : ''}<script defer src="assets/lucide.js"></script><script defer src="assets/site.js"></script><script defer src="assets/visuals.js"></script><script defer src="assets/embeds.js"></script>${['index.html', 'honours.html'].includes(file) ? '<script defer src="assets/honours-cache.js"></script>' : ''}</head>
<body id="top" class="${file === 'index.html' ? 'home' : 'interior'}"><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><a class="identity" href="index.html" aria-label="Dr. Mylswamy Annadurai home"><span class="identity-mark">ma<span>.</span></span><span class="identity-name">DR. MYLSWAMY<br>ANNADURAI</span></a><nav id="navigation" aria-label="Main navigation">${nav.map(([url, label]) => `<a href="${url}" ${file === url ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav><div class="header-actions"><a class="language" href="tamil.html${{ 'biography.html': '#life', 'missions.html': '#lunar-discovery', 'honours.html': '#honours', 'gallery.html': '#gallery', 'sources.html': '#notes' }[file] || ''}" hreflang="ta" aria-label="Read the Tamil edition">Tamil</a><button class="icon-button menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="navigation">${icon('menu')}</button></div></header>
<main id="main">${content}${renderEvidence(file.replace('.html', ''))}</main>${viewer()}
<footer><div class="footer-top"><div><span class="eyebrow">SCIENCE. SERVICE. POSSIBILITY.</span><h2>A life looking forward.</h2></div>${link('biography.html#beyond', 'Beyond ISRO')}</div>${profileLinks()}<div class="footer-bottom"><a href="index.html">Dr. Mylswamy Annadurai</a><span>From Kodhawady. For the world.</span><a href="sources.html">Sources &amp; image credits</a><a href="#top" class="back-top" aria-label="Back to top">${icon('arrow-up')}</a></div>${copyrightNotice()}</footer></body></html>`;
  writeFileSync(join(root, file), html);
};
const heading = (number, title, description) =>
  `<section class="page-heading wrap"><span class="eyebrow">${number} / THE MOON MAN OF INDIA</span><h1>${title}</h1><p>${description}</p></section>`;
const chapter = (number, title, content, image = '', references = []) =>
  `<section class="chapter wrap"><div class="chapter-label"><span class="eyebrow">${number}</span><h2>${title}</h2>${image ? photograph(image) : ''}</div><div class="chapter-body">${content}${evidenceLinks(references, 'en', 'See the source cards below for the scope of support.')}</div></section>`;
const missionCards = `<div class="mission-grid"><a class="mission-card lunar" href="missions.html#chandrayaan-1"><span class="eyebrow">01 / LUNAR EXPLORATION</span><img src="assets/moon.webp" alt="The near side of the Moon" loading="lazy"><div><span class="mini">PROJECT DIRECTOR · 2004–2009</span><h3>Chandrayaan-1 ${arrow}</h3><p>India's first journey to the Moon.</p></div></a><a class="mission-card earth" href="missions.html#satellites"><span class="eyebrow">02 / CONNECTING INDIA</span><img src="assets/earth.webp" alt="Earth photographed from space" loading="lazy"><div><span class="mini">OPERATIONS &amp; MISSION LEADERSHIP</span><h3>A nation, connected ${arrow}</h3><p>From INSAT to India's student satellites.</p></div></a></div>`;

page(
  'index.html',
  'The Moon Man of India',
  `<section class="hero"><img class="hero-portrait" src="assets/portrait.webp" alt="Dr. Mylswamy Annadurai, Indian aerospace engineer" fetchpriority="high"><div class="hero-shade"></div><div class="hero-content"><div class="eyebrow hero-kicker"><span class="status-dot"></span> THE MOON MAN OF INDIA</div><h1><span>Dr. Mylswamy</span><br>Annadurai<span class="red">.</span></h1><p>A village in Tamil Nadu. A vision beyond Earth.<br>A life dedicated to taking India further.</p>${link('biography.html', 'Discover the journey', 'button primary')}<div class="hero-honour">${icon('award')}<span>PADMA SHRI<br><strong>Science &amp; Engineering · 2016</strong></span></div></div><div class="hero-bottom"><span>ENGINEER. EXPLORER. EDUCATOR.</span><a href="#introduction">A life in perspective ${icon('arrow-down')}</a><span>01 — 06</span></div></section>
<section class="intro wrap" id="introduction"><div><span class="eyebrow">01 / THE PERSON BEHIND THE MISSIONS</span><h2>Grounded in his roots.<br><em>Boundless in his vision.</em></h2></div><div>${evidenceLinks(['ursc'])}<p>Born in Kodhawady, educated in Coimbatore, and shaped by 36 years at ISRO. Dr. Mylswamy Annadurai helped turn a nation's ambition into journeys beyond Earth.</p><p>Project director of Chandrayaan-1. Former director of the ISRO Satellite Centre. His later work includes advising innovators and speaking on science and education.</p>${link('biography.html', 'Meet Dr. Annadurai')}${profileLinks()}</div></section>
<div class="stats wrap"><div><strong>36<span>years</span></strong><p>At the Indian Space Research Organisation</p></div><div><strong>1982<span>– 2018</span></strong><p>From engineer to centre director</p></div><div><strong>2016</strong><p>Padma Shri, Government of India</p></div></div>
${renderCalendar()}
${renderPublicLife({ limit: 3 })}
${featuredRecording('K0hIB18WuM0', 'A conversation with India’s Moon Man')}
${visualStory('award')}<section class="mission-section wrap"><div class="section-top"><div><span class="eyebrow">02 / A NATION REACHES FURTHER</span><h2>Missions that matter.</h2></div>${link('missions.html', 'Explore the missions')}</div>${missionCards}</section>
<section class="journey-preview"><div class="wrap"><div class="section-top"><div><span class="eyebrow">03 / THE MAKING OF A SCIENTIST</span><h2>Small beginnings.<br>Extraordinary horizons.</h2></div>${link('biography.html#chronicle', 'The complete chronology')}</div><div class="milestones">${[
    ['1958', 'Kodhawady, Tamil Nadu', 'Born on 2 July in a village near Pollachi.'],
    ['1982', 'A new chapter at ISRO', 'Joined after his postgraduate studies at PSG.'],
    ['2008', 'India looks to the Moon', 'Chandrayaan-1 launches on 22 October.'],
    ['2015', 'Leading from the front', 'Appointed director of the ISRO Satellite Centre.'],
  ]
    .map(
      ([year, title, text]) =>
        `<article><span class="year">${year}</span><h3>${title}</h3><p>${text}</p>${evidenceLinks([year === '2008' ? 'chandrayaan-1' : 'ursc'])}</article>`,
    )
    .join('')}</div></div></section>
${renderBooks('en', true)}${visualStory('science')}<section class="legacy wrap"><span class="eyebrow">04 / THE NEXT GENERATION</span><h2>The next great journey<br>begins with <em>curiosity.</em></h2><div><p>His work continues beyond the space programme: guiding technology ventures, supporting education, and making science part of the public conversation.</p>${link('biography.html#beyond', 'Science beyond the launchpad')}${link('gallery.html#watch', 'Watch talks &amp; interviews')}</div></section>`,
);

page(
  'biography.html',
  'The journey',
  `${heading('01', 'From a village.<br>To the Moon.', 'An engineer by training. An explorer by vocation. A life shaped by education, teamwork and service.')}${pageTrail(
    [
      ['#roots', 'Roots & education'],
      ['#chronicle', 'Career chronology'],
      ['#beyond', 'Beyond ISRO'],
      ['#books', 'Books & writing'],
      ['#public-life', 'Events & recognitions'],
    ],
  )}<div class="biography-photo wrap"><img src="assets/portrait.webp" alt="Portrait of Dr. Mylswamy Annadurai"><div><span class="eyebrow">DR. MYLSWAMY ANNADURAI</span><p>“Moon Man of India”</p><span>Born 2 July 1958 · Kodhawady, Tamil Nadu</span></div></div><div class="wrap">${profileLinks()}</div>${chapter('01 / ROOTS', '<span id="roots">Early life<br>&amp; education.</span>', '<p>Dr. Mylswamy Annadurai is an Indian aerospace engineer, former ISRO scientist and recipient of the Padma Shri (2016).</p><p>Born on 2 July 1958 in Kodhawady, Tamil Nadu, Annadurai completed schooling in his native village in 1976. From 1976 to 1980, he studied Electronics and Communication Engineering at the Government College of Technology, Coimbatore, graduating in 1980. He pursued postgraduate studies at PSG College of Technology from 1980 to 1982 and earned his master\'s degree in Applied Electronics in 1982. He also obtained a PhD from Anna University; the profile does not specify the year. His honorary doctorates are listed separately in the <a href="honours.html#honours-archive">honours archive</a>.</p><p>In 1982, he joined the Indian Space Research Organisation. Work on satellite simulation and spacecraft operations became the foundation for a career in mission leadership.</p>', 'early-portrait', ['ursc', 'padma'])}${routeStory()}${chapter('02 / LEADERSHIP', 'Building missions.<br>Building teams.', "<p>His assignments stretched from the IRS and INSAT satellite programmes to EDUSAT and lunar exploration. As project director of Chandrayaan-1 (2004–2009), he led the team behind India's first lunar mission.</p><p>He served as project director of Chandrayaan-2 during its development from 2008 to 2013, and as programme director for Indian Remote Sensing and Small, Science and Student Satellites from 2011 to 2015. From 1 April 2015 to 31 July 2018, he directed the ISRO Satellite Centre, now the U R Rao Satellite Centre.</p>", 'chandrayaan-spacecraft', ['ursc', 'edusat'])}
${featuredRecording('pLSUgxm4eK0', 'The journey, on film')}
${renderTimeline()}
<section id="beyond">${chapter('04 / STILL LOOKING FORWARD', 'Science in<br>everyday life.', '<p>After retiring from ISRO, Dr. Annadurai continued to advise startups, charities and institutions. Institutional profiles record service as vice president of the Tamil Nadu State Council for Science and Technology and advisory work in Earth observation, biotechnology, aerospace and education. The council role’s end date differs between sources; the chronology explains the conflict.</p><p>He chaired the Board of Governors of the <a href="https://www.ndrf.res.in/chairmen.html">National Design and Research Forum</a> from 18 February 2019 to 7 March 2022. SS Innovations lists him as a board member, and the American India Foundation records his advisory connections.</p><p>A <a href="https://www.kaynestechnology.co.in/doc/Stock-Exchange-Disclosures/ChangeInManagement13May2026.pdf">Kaynes Technology stock-exchange disclosure</a> dates his appointment as Additional Non-Executive Independent Director to 13 May 2026. <a href="https://timesofindia.indiatimes.com/city/chennai/isros-chandrayaan-1-scientist-mylswamy-annadurai-to-head-tamil-nadus-curriculum-design-committee/articleshow/132075811.cms">Reporting on 29 June 2026</a> also confirms his appointment to chair Tamil Nadu’s curriculum design committee.</p><p>Other appointments from the supplied collection remain in the chronology with their verification status. Open-ended dates do not establish that a position continues today.</p><h3 id="engineering-beyond-space">Engineering beyond space</h3><p>In January 2021, EdexLive reported on a banana-fibre initiative spearheaded by Annadurai. Faculty and students at IIITDM Kancheepuram developed an integrated machine to process banana pseudo-stems, working with industry partner Gencrest. The report described prototype development and plans for a pilot plant; it did not establish later commercial results.</p><p class="record-source"><a href="https://www.edexlive.com/campus/2021/jan/23/iitdm-develops-integrated-machine-that-can-process-banana-stem-to-make-fibre-yarn-17529.html">EdexLive / IANS · 23 January 2021 ↗</a></p><h3>Hear the journey in his own words</h3><p>Explore <a href="gallery.html#watch">selected interviews and public talks</a>, including conversations with Forbes India, TEDx talks and university webinars.</p><h3>Science on the page</h3><p>His Tamil writing extends from the autobiographical <em>Kaiyaruke Nila</em> to books about space exploration and scientific thought. His collaborations include <em>Valarum Ariviyal Kalanjiyam</em> with E. K. T. Sivakumar and <em>Vinnum Mannum</em> with V. Dillibabu. The <a href="#books">bookshelf below</a> brings together cover images, catalogue records and edition details.</p><h3>Returning to his roots</h3><p>In December 2021, <a href="https://www.newindianexpress.com/states/tamil-nadu/2021/Dec/20/moon-mans-long-standing-dream-becomes-a-reality-2397627.html">The New Indian Express reported</a> that he visited Kothavadi to appreciate volunteers restoring the village lake. The report connects his concern for the lake with a passage in his autobiography. It credits the restoration effort to local volunteers and public works, rather than assigning the project to him.</p>', 'science-2012')}</section>${renderBooks()}<section class="wrap science-outreach"><h2>Science for the next generation.</h2>${scienceOutreach()}</section>${renderPublicLife()}`,
);

page(
  'missions.html',
  'Missions',
  `${heading('02', 'A nation’s ambition.<br>A shared endeavour.', 'Satellite operations, lunar exploration and the teams that made them possible.')}${pageTrail(
    [
      ['#chandrayaan-1', 'Chandrayaan-1'],
      ['#lunar-discovery', 'The discovery'],
      ['#chandrayaan-2', 'Chandrayaan-2'],
      ['#satellites', 'Satellite programmes'],
      ['#mission-record', 'All assignments'],
    ],
  )}<section class="wrap">${missionCards}</section>${chapter('01 / 2004–2009', '<span id="chandrayaan-1">Chandrayaan-1</span>', '<span class="role-label">PROJECT DIRECTOR</span><p>India\'s first lunar mission launched on 22 October 2008 and entered lunar orbit on 8 November. Its scientific instruments brought together contributions from India and international partners.</p><p>Dr. Annadurai led the project during 2004–2009. The mission helped transform our understanding of the Moon, including evidence of water molecules on the lunar surface from NASA\'s Moon Mineralogy Mapper.</p><p>The international collaboration was built into the payload: NASA records scientific equipment from the United States, the United Kingdom, Germany, Sweden and Bulgaria alongside the Indian instruments. Its mission account describes M3’s role in confirming water locked in lunar minerals.</p><p class="record-source"><a href="https://science.nasa.gov/mission/chandrayaan-1/">NASA Science: Chandrayaan-1 / Moon Impact Probe ↗</a></p><a class="text-link" href="https://www.isro.gov.in/Chandrayaan_1.html">Mission record at ISRO &#8599;</a>', 'launch-2008', ['ursc', 'brochure'])}${discovery()}${chapter('02 / 2008–2013', '<span id="chandrayaan-2">Chandrayaan-2</span>', "<span class=\"role-label\">PROJECT DIRECTOR · DEVELOPMENT PHASE</span><p>Dr. Annadurai's recorded assignment covers the early development phase of Chandrayaan-2, from 2008 to 2013. This work contributed to the next chapter of India's lunar exploration programme.</p><p>His project-director tenure preceded the mission's 2019 launch. The chronology distinguishes that development role from the later launch and mission operations.</p>", '', ['chandrayaan-2'])}${chapter('03 / 2011–2015', 'A wider horizon.', '<span class="role-label">PROGRAMME DIRECTOR · IRS &amp; SSS</span><p>As programme director for Indian Remote Sensing and Small, Science and Student Satellites, his responsibilities encompassed a broad scientific portfolio, including the Mars Orbiter Mission.</p><p>Mangalyaan launched on 5 November 2013 and entered Mars orbit on 24 September 2014, a landmark in India\'s interplanetary exploration.</p><a class="text-link" href="https://www.isro.gov.in/MarsOrbiterMissionSpacecraft.html">Mars Orbiter Mission at ISRO &#8599;</a>', '', ['ursc'])}${chapter('04 / OPERATIONS & LEADERSHIP', '<span id="satellites">Space, in service<br>of Earth.</span>', '<p>Before the lunar missions came software simulation and spacecraft operations. From 1985 to 1988, Annadurai led a team developing a software satellite simulator. Annadurai served as spacecraft operations manager for IRS-1A and INSAT-2A, and mission director across the INSAT-2C, INSAT-2D, INSAT-2E, INSAT-3B, GSAT-1 and INSAT-3E programmes.</p><p>As associate project director of EDUSAT (2003–2005), he contributed to a mission dedicated to education. Later, as director of the satellite centre (2015–2018), he led work spanning communication, remote sensing, navigation and space science.</p>', 'chandrayaan-spacecraft', ['ursc', 'edusat'])}${featuredRecording('ZIgCUfFAWNo', 'India’s space ambitions, in his own words')}${missionRegister()}`,
);

page(
  'honours.html',
  'Honours',
  `${heading('03', 'Recognition.<br>For a life of contribution.', 'National honours, scientific fellowships and recognition from communities around the world.')}${pageTrail(
    [
      ['#national-honour', 'Padma Shri'],
      ['#recognition-news', 'In the news'],
      ['#honours-archive', 'Search the honours'],
    ],
  )}<section class="award-feature wrap" id="national-honour"><span class="award-symbol">${icon('award')}</span><div><span class="eyebrow">GOVERNMENT OF INDIA · 2016</span><h2>Padma Shri</h2><p>Recognising distinguished service in science and engineering.</p>${evidenceLinks(['padma', 'ursc'])}</div><strong>2016</strong></section>${visualStory('award')}${renderPublicLife({ kind: 'recognition', id: 'recognition-news' })}${renderHonours()}`,
);
page(
  'gallery.html',
  'In focus | The archive',
  `${heading('04', 'A life, in focus.', 'The scientist, the missions and the public archive.')}${pageTrail(
    [
      ['#photographs', 'Photographs'],
      ['#watch', 'Watch & listen'],
      ['#archive-books', 'Books & writing'],
      ['#archive', 'Personal collections'],
    ],
  )}${renderGallery()}`,
);
writeFileSync(join(root, 'tamil.html'), renderTamil());
page(
  'sources.html',
  'Sources & image credits',
  heading(
    '06',
    'The record.<br>And its sources.',
    'Documented milestones, independent references and image credits.',
  ) +
    pageTrail([
      ['#biographical-source', 'The collection'],
      ['#editorial-notes', 'Editorial notes'],
      ['#internet-research', 'Further reading'],
      ['#books-sources', 'Books & Wikipedia'],
      ['#image-credits', 'Image credits'],
    ]) +
    renderSources(),
);

copyFileSync(join(root, 'node_modules/lucide/dist/umd/lucide.js'), join(root, 'assets/lucide.js'));
copyFileSync(
  join(root, 'node_modules/lucide/LICENSE'),
  join(root, 'assets/licenses/Lucide-ISC.txt'),
);
console.log(
  `Built 7 pages, ${awards.length} honours, ${timeline.length} chronology entries and ${manifest.length} image records.`,
);
