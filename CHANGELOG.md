# Changelog

Project changes are recorded by date; there is no numbered public release series yet.

## 2026-10-03

### Added

- A bilingual bookshelf with five sourced cover thumbnails, collaborator and edition details, two further Wikipedia titles, and links from the homepage, biography, gallery and navigation.
- Wikipedia reconciliation and additional career notes, plus URSC-backed textbook and student-satellite context. LinkedIn's profile and detail URLs remain inaccessible (HTTP 999); no unsupported import is claimed.
- A deployment-scoped honours cache that warms from the homepage and checks the published site every five minutes while visible, with safe failure handling and a reload notice for changed content.
- A bilingual source and date review for all honours and career records, documented corrections from institutional and news references, and publication dates for all ten selected recordings. See the [audit report](docs/reports/source-audit-2026-10-03.md) for evidence and unresolved dates.
- Live read-only Google Calendar agendas in both language editions, localized controls, India Standard Time, and event navigation links.
- A proprietary copyright notice naming Dr. Mylswamy Annadurai, with separate third-party notices for images, icons, and fonts.
- Contributor and security guidance, development and deployment documentation, and an organized historical report archive.
- A clean `dist/` publishing build, localhost preview server, repeatable formatting, portable browser checks, and publishing-boundary tests.
- GitHub validation and manual Pages deployment workflows, plus dependency update configuration.

### Maintained

- Moved the required source texts into `content/` and image identifiers into `data/image-inventory.txt`; verified them against the legacy collection before removing `old/` at the owner's request.
- The English and Tamil visual designs, seven page URLs, historical source records, credits, and core content remain intact.

## 2026-10-02

- Separated English and Tamil presentation, refined the Tamil design, and added researched recordings and archival images. Historical implementation and review records are in [docs/reports](docs/reports/README.md).
