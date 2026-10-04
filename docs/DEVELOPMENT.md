# Development and architecture

## Structure

```text
assets/              Public styles, browser scripts, images, fonts, and notices
data/                Curated honours, media, research, and image metadata
lib/                 Content parsing, edition renderers, and shared components
scripts/             Publishing, localhost preview, and browser checks
test/                Content fidelity and publishing/tooling tests
docs/                Maintenance guides and historical reports
content/             Supplied English and Tamil September 2026 source texts
build.mjs            English page composition and generation entry point
*.html               Generated pages retained for direct local viewing
dist/                Generated publishing artifact; ignored by Git
.work/               Local research, backups, and captures; ignored by Git
```

`content/english.md`, `content/tamil.md`, and `data/image-inventory.txt` are active build inputs. They were copied and verified against the legacy collection before `old/` was removed at the owner's request. Do not deploy source inputs or the original ZIP.

## Build and preview

Use Node.js 24 LTS and the committed npm lockfile. The runtime minimum is Node.js 20; CI checks Node.js 22 and 24. On systems with nvm, `nvm use` selects the version from `.nvmrc`.

```sh
npm ci
npm run build
npm run preview
```

The build generates seven root HTML pages, copies the installed Lucide browser bundle and notice, and recreates `dist/` with public files only. The source files and root HTML remain available; `dist/` is replaced each time. The build rejects a redirected publishing directory or asset symlinks.

The preview serves only `dist/` at <http://127.0.0.1:4173>, without caching. Rebuild after changes and refresh the browser. Set `PORT` to use another local port. Stop the server with Ctrl+C. Root `index.html` and `tamil.html` can also be opened directly without a server.

## Editing map

| Change                                               | Source                                                     |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| English page layout and navigation                   | `build.mjs`                                                |
| Tamil layout, navigation, and presentation text      | `lib/tamil.mjs`                                            |
| Timeline alignment and source parsing                | `lib/content.mjs`                                          |
| Honours and media records                            | `data/annadurai-awards.json`, `data/annadurai-media.json`  |
| Research and photo provenance                        | `data/annadurai-research.json`, `data/archive-photos.json` |
| Shared photo viewer, gallery, and mission components | `lib/visuals.mjs`, `assets/visuals.*`                      |
| English styling and interactions                     | `assets/site.css`, `assets/site.js`                        |
| Tamil styling and interactions                       | `assets/tamil.css`, `assets/tamil.js`                      |
| Calendar configuration and translations              | `lib/calendar.mjs`, `assets/calendar.css`                  |
| Page inventory and output paths                      | `lib/project.mjs`                                          |

Do not edit generated HTML or `assets/lucide.js` directly. Source Markdown is trusted editorial input and may contain HTML; this project is not designed to publish unreviewed user input.

Official evidence lives in `data/official-evidence.json`, with per-record mappings in `lib/evidence.mjs`. Shared YouTube controls are in `lib/embeds.mjs`, `assets/embeds.js` and `assets/embeds.css`. Privacy text for both editions is in `lib/legal.mjs`. Follow [content rights and embedding rules](CONTENT_RIGHTS.md) for every addition. Mission links must not be presented as proof of an individual’s tenure.

`data/record-review.json` records the review status of every honour and career entry, reference scope, bilingual notes, and supported corrections. `lib/review.mjs` applies those corrections to the displayed records while `sourceAwards`, `sourceTimeline`, and each record’s `original` retain the supplied collection. Update this review layer instead of altering source Markdown to match new research. Tamil honours use an explicit ID mapping so corrections attach to the right recognition despite differences in source ordering. All recording publication dates use Asia/Kolkata and must remain distinct from event dates.

## Formatting

Public profile links and press highlights are rendered by `lib/public-life.mjs` and styled in `assets/public-life.css`. Maintain the bilingual summaries, exact publisher URLs, publication dates and evidence scope in `data/public-coverage.json`. Card dates refer to article publication, not inferred event dates. These highlights do not add duplicate entries to the supplied honours inventory. See [the research record](reports/public-life-2026-10-03.md) for the initial selection and the LinkedIn access limitation.

Run `npm run format` for authored code, styles, configuration, and Markdown. Prettier skips generated output, the historical collection, vendor code, license texts, and local working files. `.editorconfig` and `.gitattributes` standardize UTF-8, indentation, and line endings. Preserve third-party license text as supplied.

## Testing

```sh
npm run check
npx playwright install chromium
npm run test:browser
```

The content suite checks 79 English honours, 37 timeline entries per edition, source discrepancies, local links, language separation, media routing, and attribution. Tooling tests check publishing boundaries, packaged local references, preview responses, and traversal rejection.

Browser checks use a fresh headless Chromium context, the packaged site, and a temporary localhost port. They check all seven pages at 320, 390, 768, 1024, and 1440 px; navigation, filters, image viewing, and reading without JavaScript. They block third-party requests, so they neither require Google/YouTube availability nor claim to verify live events. Screenshots go to ignored `test-results/` for review. Install Linux browser dependencies with `npx playwright install --with-deps chromium` when required.

For calendar changes, also open both editions with network access and no Google login. Confirm visible events, interface language, time zone, mobile scrolling, and the direct link. Google's public sharing settings may hide event details as “busy.” External service caching can delay changes.

## Books, Wikipedia and honours caching

`data/books.json` maintains five catalogue-supported books, their collaborators, listed edition years, cover provenance and two further Wikipedia titles awaiting confirmation. `lib/books.mjs` renders the home-page preview, English bibliography, Tamil bibliography and source notes. `assets/books.css` shares layout rules while retaining each edition's colours; original Tamil titles are language-tagged in the English edition. Keep publisher spellings and edition conflicts explicit. The two separately labelled science titles in Wikipedia are represented by the combined title confirmed by the publisher.

`lib/wikipedia.mjs` contains the textbook/student-satellite summary supported by URSC and two additional Wikipedia-only career assignments. These remain outside the 37 original chronology records and explicitly lack independent date corroboration. See the [review report](reports/books-wikipedia-2026-10-03.md).

`assets/honours-cache.js` registers the root `sw.js` on the English home and honours pages. HTTPS or localhost is required. It warms the published `honours.html` cache after page load and revalidates every five minutes while the page is visible and online. A visible-tab return checks again when due. The service worker compares successful HTML responses and only replaces changed content, checks for archive markers, retains the last valid response on failure, and offers a reload notice without replacing a reader's current page. A normal honours navigation can use the cached page immediately; an explicit reload prefers the current network response. This is a full-document comparison, not a LinkedIn API integration or a record-level incremental feed. It does not promise that all page assets are available offline.

URLs and cache names are scoped to the deployment path, including `/bio/`. Only the honours navigation is intercepted; no external page or personal data is cached. The browser may evict storage. Clear site data to remove the cache; ordinary static links still work without service-worker support. Publish `sw.js` with the complete `dist/` artifact. To change the worker's storage format, increment its cache version and retain cleanup scoped to this application.

The cache browser test in `scripts/honours-cache.test.mjs` runs as part of `npm run test:browser`. It exercises a `/bio/` deployment, automatic warming and a simulated five-minute interval, unchanged responses, update notification/reload, invalid HTTP 200 pages and offline archive text. Install Playwright Chromium before running browser checks. The regular `npm test` remains independent of browser installation.

## Dependencies

Lucide supplies browser icons; Marked renders Markdown at build time. Prettier and Playwright are development tools. `package-lock.json` records exact versions. Use `npm ci` for reproduction, review Dependabot updates, and check `npm audit` before accepting dependency changes. The optional Chromium download and all development dependencies stay out of `dist/`.

## Ownership and external services

Original website materials owned by Dr. Mylswamy Annadurai are proprietary; see [LICENSE](../LICENSE). Third-party rights remain separate; see [notices](../THIRD_PARTY_NOTICES.md). The public calendar loads on page visits, English fonts load from Google Fonts, and YouTube players load only on request. The site has no analytics or contact form.
