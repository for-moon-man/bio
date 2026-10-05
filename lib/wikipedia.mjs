import { bibliography } from './books.mjs';
import { esc } from './visuals.mjs';

export function additionalCareerRecords(language = 'en') {
  const ta = language === 'ta';
  return `<details class="wiki-career"><summary>${ta ? 'விக்கிப்பீடியாவில் உள்ள கூடுதல் பணிப் பதிவுகள்' : 'Additional career records in Wikipedia'}</summary><p>${ta ? 'வழங்கப்பட்ட 37 பதிவுகளுக்கு அப்பால் விக்கிப்பீடியா பின்வரும் இரண்டு பொறுப்புகளையும் குறிப்பிடுகிறது.' : 'Beyond the 37 supplied chronology entries, Wikipedia lists these two assignments.'}</p><ul><li><strong>1993–1996</strong> · ${ta ? 'ஐ.என்.எஸ்.ஏ.டி.–2B விண்கல இயக்க மேலாளர்.' : 'Spacecraft operations manager, INSAT-2B.'}</li><li><strong>1994–1996</strong> · ${ta ? 'ஐ.என்.எஸ்.ஏ.டி.–2C துணைத் திட்ட இயக்குநர்.' : 'Deputy project director, INSAT-2C.'}</li></ul><a href="${esc(bibliography.wikipedia)}#Previous_assignments">${ta ? 'விக்கிப்பீடியா · ஆய்வு செய்யப்பட்ட பதிவு' : 'Wikipedia · reviewed revision'} ↗</a></details>`;
}

export function scienceOutreach(language = 'en') {
  return language === 'ta'
    ? `<p>கல்வியும் தொடக்க வாழ்க்கையும் இஸ்ரோ பணிகளும் தமிழ்நாட்டின் பத்தாம் வகுப்பு அறிவியல் பாடநூலில் இடம்பெற்றுள்ளதாக <a href="https://www.ursc.gov.in/directors/annadurai.jsp">யு.ஆர்.எஸ்.சி. வாழ்க்கைக் குறிப்பு</a> தெரிவிக்கிறது. இரண்டு மாணவர் செயற்கைக்கோள் திட்டங்களின் மேற்பார்வைப் பணியையும் அது பதிவு செய்கிறது.</p>`
    : `<p>The <a href="https://www.ursc.gov.in/directors/annadurai.jsp">URSC biography</a> records the inclusion of the education, early life and ISRO career described here in Tamil Nadu’s Class 10 science textbook. It also records supervision of two student-satellite projects, connecting professional experience with the next generation of engineers.</p>`;
}
