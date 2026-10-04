const calendarId = 'mylswamy.annadurai.calendar@gmail.com';

export function renderCalendar(language = 'en') {
  const tamil = language === 'ta';
  const text = tamil
    ? {
        kicker: 'அறிவியல் · கல்வி · சந்திப்புகள்',
        title: 'வரவிருக்கும் நிகழ்வுகள்',
        description: 'முனைவர் மயில்சாமி அண்ணாதுரையின் பொது நிகழ்ச்சி அட்டவணை.',
        timezone: 'இந்திய நேரம் · UTC +5:30',
        open: 'கூகுள் நாள்காட்டியில் திறக்க',
        help: 'நாள்காட்டி தெரியவில்லையா? மேலுள்ள இணைப்பில் திறக்கவும்.',
        frame: 'முனைவர் மயில்சாமி அண்ணாதுரையின் பொது நிகழ்வுகள்',
      }
    : {
        kicker: 'SCIENCE · EDUCATION · CONVERSATION',
        title: 'Upcoming events',
        description: 'Public events and engagements with Dr. Mylswamy Annadurai.',
        timezone: 'India Standard Time · UTC +5:30',
        open: 'Open in Google Calendar',
        help: 'Calendar not showing? Use the link above to open it directly.',
        frame: 'Dr. Mylswamy Annadurai’s public events',
      };
  const params = new URLSearchParams({
    src: calendarId,
    ctz: 'Asia/Kolkata',
    hl: language,
    mode: 'AGENDA',
    showTitle: '0',
    showPrint: '0',
    showTabs: '0',
    showCalendars: '0',
    showTz: '0',
  });
  const url = `https://calendar.google.com/calendar/embed?${params}`.replaceAll('&', '&amp;');
  return `<section class="calendar-section ${tamil ? 'folio' : 'wrap'}" id="upcoming-events" aria-labelledby="calendar-title">
<div class="calendar-heading"><div><span class="calendar-kicker">${text.kicker}</span><h2 id="calendar-title">${text.title}</h2><p>${text.description}</p></div><span class="calendar-timezone">${text.timezone}</span></div>
<div class="calendar-frame"><iframe src="${url}" title="${text.frame}" width="800" height="600" loading="eager"></iframe></div>
<div class="calendar-footer"><a href="${url}" target="_blank" rel="noopener noreferrer">${text.open} <span aria-hidden="true">↗</span></a><p>${text.help}</p></div>
</section>`;
}
