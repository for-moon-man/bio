import { media } from './content.mjs';
import { renderVideoEmbed } from './embeds.mjs';

const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const kinds = { interview: 'Interview', talk: 'Talk / webinar', profile: 'Biographical film' };
const dateLabel = (value) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value));
const duration = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export function renderRecordings() {
  const selected = media.videos.filter((item) => item.edition === 'en');
  const videos = [
    ...selected.filter((item) => item.publishedAt),
    ...selected.filter((item) => !item.publishedAt),
  ];
  return `<section class="wrap recordings-section" id="watch"><div class="section-top"><div><span class="eyebrow">IDEAS &amp; CONVERSATIONS</span><h2>Selected talks<br>&amp; interviews.</h2></div><label class="select-field" data-enhanced hidden><span>Recording type</span><select id="video-kind" aria-controls="recording-list"><option value="all">All recordings</option>${Object.entries(
    kinds,
  )
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join('')}</select></label></div>
  <p class="archive-note">Conversations from newsrooms, public talks and university events. Selected for their relevance, publisher provenance and range of perspectives. Upload dates use Indian Standard Time and do not necessarily identify the event date. <a href="sources.html#internet-research">About this selection</a>.</p>
  <p id="video-count" class="source-note" role="status">${videos.length} recordings</p><div class="recording-grid" id="recording-list">${videos
    .map(
      (
        video,
      ) => `<article class="video-record recording-card" id="recording-${video.id}" data-video-kind="${video.kind}"><span class="mini">${kinds[video.kind]}${video.durationSeconds ? ` · ${duration(video.durationSeconds)}` : ''}</span><h3><a href="${video.url}">${escape(video.editorialTitle || video.title)} ↗</a></h3><p class="recording-byline"><a href="${escape(video.publisherUrl)}">${escape(video.publisher)} ↗</a>${video.publishedAt ? ` · Uploaded <time datetime="${escape(video.publishedAt)}">${dateLabel(video.publishedAt)}</time>` : ''}</p><p class="recording-description">${escape(video.description)}</p>
  ${video.chapters ? `<ul class="recording-chapters" aria-label="Publisher chapter links">${video.chapters.map((chapter) => `<li><a href="${video.url}&amp;t=${chapter.seconds}s">${duration(chapter.seconds)} · ${escape(chapter.label)}</a></li>`).join('')}</ul>` : ''}
  <details class="recording-details"><summary>Original title &amp; source</summary><p>${escape(video.title)}</p><p class="record-source"><a href="${escape(video.metadataSource)}">YouTube metadata</a> · Checked ${dateLabel(video.verifiedOn)}</p>${video.sourceNote ? `<p class="record-note">${escape(video.sourceNote)}</p>` : ''}</details>
  ${renderVideoEmbed(video)}</article>`,
    )
    .join(
      '',
    )}</div><p class="source-note">Players connect to YouTube when loaded. The selection combines two existing recordings with six independently researched additions.</p></section>`;
}
