# Contributing

Contributions should improve the site while preserving its English and Tamil editions, documented sources, and accessibility.

## Local workflow

Use Node.js 24 LTS (see `.nvmrc`) and npm. The code requires Node.js 20 or newer; CI checks the maintained 22 and 24 release lines.

```sh
npm ci
npm run build
npm run preview
```

Open <http://127.0.0.1:4173>. Edit the source templates, data, and assets, then rebuild. Root HTML files and `assets/lucide.js` are generated; don't edit them directly. `dist/` is disposable publishing output.

Before proposing a change:

```sh
npm run format
npm run check
npx playwright install chromium
npm run test:browser
```

`npm run check` verifies formatting, rebuilds the site and publishing artifact, and runs content and tooling tests. Browser checks run separately and block external requests for repeatability. Inspect the live calendar manually when changing calendar integration; browser checks cannot verify Google's sharing settings. See [testing](docs/DEVELOPMENT.md#testing).

## Content and design

- Keep navigation and interface copy in the selected edition's language. Preserve the two visual designs.
- Preserve original dates and disclose discrepancies. An open-ended appointment date does not prove that a role is still current.
- Include a reliable source and review date for factual additions. Never invent event attendance, image identities, quotations, or missing years.
- Record image attribution, license, dimensions, and modifications before adding an asset. Retain third-party notices.
- Maintain visible focus, keyboard access, descriptive iframe titles, readable contrast, and a usable layout at 320 px. Core biography content must remain readable without JavaScript.
- Keep event descriptions public-appropriate. Edit live events in Google Calendar; enter both languages there when bilingual descriptions are needed.

## Pull requests and review

Explain the problem, the resulting behavior, and the checks performed. Include desktop and mobile screenshots for visible changes. Call out source discrepancies, licensing changes, and any Google account configuration needed. Keep unrelated changes separate.

Commit regenerated root HTML with template or data changes; leave `dist/`, dependencies, working files, and the source ZIP untracked. CI checks that rebuilding does not change committed generated files.

This is a [proprietary project](LICENSE). Changes require the owner's authorization for incorporation into the proprietary website. Only contribute material you have the right to submit, and document any third-party terms. Submitting a pull request does not by itself transfer copyright; maintainers must establish the necessary ownership or permission before merging. Discuss substantial design, licensing, or architecture changes before implementation.

For security issues, follow [SECURITY.md](SECURITY.md). Keep discussion respectful and focused on the work; do not publish private personal information.
