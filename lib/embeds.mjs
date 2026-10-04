import { media } from './content.mjs';
import { esc } from './visuals.mjs';

// Only known publisher uploads may be rendered; never accept arbitrary embed HTML.
export function renderVideoEmbed(
  video,
  language = 'en',
  title = video.editorialTitle || video.title,
) {
  if (!media.videos.some((item) => item.id === video.id) || !/^[\w-]{11}$/.test(video.id)) {
    throw new Error('Unknown YouTube recording');
  }
  const ta = language === 'ta';
  return `<div class="embed-shell"><button type="button" class="embed-load" data-video="${video.id}" data-title="${esc(title)}" data-enhanced hidden><span class="embed-play" aria-hidden="true">▶</span><span>${ta ? 'YouTube காணொளியை இங்கே பார்க்க' : 'Watch here on YouTube'}</span></button><div class="video-player"></div><button type="button" class="embed-stop" data-stop-video data-enhanced hidden>${ta ? 'காணொளியை மூடு' : 'Close player'}</button></div><p class="embed-notice">${ta ? 'இயக்கும்போது YouTube இணைந்து தரவுகளைப் பெறும். தானியங்கு இயக்கம் இல்லை.' : 'Loading connects to YouTube and shares browser data. Playback does not start automatically.'} <a href="${ta ? '#privacy' : 'sources.html#privacy'}">${ta ? 'தனியுரிமை' : 'Privacy'}</a> · <a href="${esc(video.url)}">${ta ? 'YouTube தளத்தில் பார்க்க' : 'Open on YouTube'} ↗</a></p>`;
}

export function featuredRecording(id, heading) {
  const video = media.videos.find((item) => item.id === id);
  return `<section class="wrap featured-recording"><div><span class="eyebrow">WATCH &amp; LISTEN</span><h2>${esc(heading)}</h2><p>${esc(video.description)}</p><p><a href="${esc(video.publisherUrl)}">${esc(video.publisher)} ↗</a>${video.publishedAt ? ` · Published <time datetime="${esc(video.publishedAt)}">${new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(video.publishedAt))}</time>` : ''}</p></div><article class="video-record">${renderVideoEmbed(video)}</article></section>`;
}
