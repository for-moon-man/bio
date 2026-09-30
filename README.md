# Dr. Mylswamy Annadurai

A static, seven-page biography site. Open `index.html` directly in a browser; no server is needed. Publish this directory without `node_modules` to any static host.

## Pages

- `index.html`: photographic overview, milestones and mission features.
- `biography.html`: biography and 37 filterable chronology entries.
- `missions.html`: lunar exploration, satellite operations and programme leadership.
- `honours.html`: 78 searchable source entries, including fellowships and duplicates recorded in the original categories.
- `gallery.html`: local photographs with a keyboard-accessible viewer, 40 original photo links, and video links.
- `tamil.html`: the supplied Tamil biography, including a clearly labelled historical events archive.
- `sources.html`: source context and image attribution.

## Editing and rebuilding

Node.js 20 or newer is required only for rebuilding:

```sh
npm ci
npm run build
```

Edit `build.mjs` for page structure and editorial text, `assets/site.css` for styling, and `assets/site.js` for interactions. The builder preserves the supplied chronology, awards and Tamil content from `old/content/`. Generated HTML is checked in so the site works without Node.js.

The `old/` snapshot has been left untouched. Original image hosting was blocked by the local network's category policy; those images are preserved as external links rather than broken embedded photographs. Three credited Wikimedia images are stored locally. Google Fonts is the only runtime network dependency; system fallbacks apply offline.

Open-ended roles reflect the supplied September 2026 snapshot, not independent verification. Review current appointments and historical source wording before public publication. No invented contact information, contact forms or event bookings are included.