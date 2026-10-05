# Dr. Mylswamy Annadurai — Moon Man of India

A bilingual biography website covering Dr. Annadurai's life, space missions, honours, public talks, and upcoming events. The English edition has a modern editorial design; the Tamil edition uses a traditional literary style. Both run on static hosting with no backend.

[English edition](https://for-moon-man.github.io/bio/) · [தமிழ்ப் பதிப்பு](https://for-moon-man.github.io/bio/tamil.html) · [Contributing](CONTRIBUTING.md) · [Copyright](LICENSE)

## Quick start

Use **Node.js 24 LTS** and npm. Node.js 20 is the minimum supported runtime; CI covers Node.js 22 and 24.

```sh
npm ci
npm run build
npm run preview
```

Open <http://127.0.0.1:4173>. The build regenerates the root HTML files and creates a clean **`dist/`** directory for publishing. Root `index.html` and `tamil.html` also work when opened directly. The live calendar and external media need an internet connection.

## Commands

| Command                | Purpose                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| `npm run build`        | Generate the site and package public files in `dist/`                    |
| `npm run preview`      | Serve the built site on localhost                                        |
| `npm test`             | Check content, links, attribution, publishing, and preview behavior      |
| `npm run check`        | Check formatting, rebuild, and run tests                                 |
| `npm run format`       | Format maintained source files                                           |
| `npm run test:browser` | Check all pages in Chromium; first run `npx playwright install chromium` |

## Website

| Page                             | Content                                                                |
| -------------------------------- | ---------------------------------------------------------------------- |
| [index.html](index.html)         | English overview, public calendar, milestones, and mission features    |
| [biography.html](biography.html) | Life story and 37 career records                                       |
| [missions.html](missions.html)   | Mission narratives and 14 assignments                                  |
| [honours.html](honours.html)     | Padma Shri feature and 79 searchable honours                           |
| [gallery.html](gallery.html)     | English recordings and credited image collections                      |
| [tamil.html](tamil.html)         | Tamil biography, calendar, honours, interviews, and historical records |
| [sources.html](sources.html)     | References, collection background, and image credits                   |

Core biography content is readable without JavaScript. Enhancements add filtering, image viewing, navigation, and videos loaded on request. Both calendars request public events directly from Google on each visit; changing an event does not require republishing the website. Titles and descriptions use the language entered in Google Calendar.

## Maintenance

- [Development guide](docs/DEVELOPMENT.md): structure, editing map, source handling, and checks.
- [Deployment guide](docs/DEPLOYMENT.md): GitHub Pages, publishing boundaries, and calendar settings.
- [Contribution guide](CONTRIBUTING.md): editorial standards and review expectations.
- [Content rights and embedding rules](docs/CONTENT_RIGHTS.md): evidence scope, publisher embeds, attribution and unresolved rights.
- [Security guidance](SECURITY.md): reporting and maintenance practices.
- [Changelog](CHANGELOG.md) and [historical reports](docs/reports/README.md).

Edit `build.mjs`, `lib/`, `data/`, and authored assets; rebuild rather than editing generated HTML. The supplied source texts are in `content/`, with archival image identifiers in `data/image-inventory.txt`. Local research, dependencies, publishing output, and the original ZIP are excluded from version control as appropriate.

GitHub workflows validate changes and provide a **manual** Pages deployment. Publish only `dist/`; local builds do not deploy anything. Workflow setup is documented in the deployment guide.

## Ownership and licensing

**© 2026 Dr. Mylswamy Annadurai, the Moon Man of India. All rights reserved.** Original website code, design, and content owned by Dr. Annadurai are proprietary. See [LICENSE](LICENSE). The npm metadata uses `UNLICENSED` to indicate that the project is not offered under an open-source license.

Third-party photographs, fonts, libraries, and other materials retain their own rights and licenses. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the published image credits. Public source visibility does not grant permission to reuse proprietary materials.
