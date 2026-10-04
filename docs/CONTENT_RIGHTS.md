# Content, evidence and embedding rules

These rules apply to future additions as well as the current English and Tamil editions. The owner has requested conservative handling of copyright and legal risk. Technical checks reduce risk; they cannot establish all rights or guarantee compliance in every jurisdiction.

- Prefer a relevant official government, employer, university or award-provider record. Link the exact claim, not an unrelated homepage. Record the URL, date reviewed and the scope of support in `data/official-evidence.json`. Distinguish mission context from evidence of personal roles and dates. Keep disagreements visible.
- Write original, factual summaries. Do not copy articles, book pages, transcripts, screenshots, logos or private correspondence merely because they are accessible online. Attribution is not permission. Material without a documented licence or authority remains a link or an inventory entry.
- Embed videos only through the publisher-enabled YouTube player, using a reviewed original publisher upload. Verify publisher identity, oEmbed availability and actual player availability before adding an upload. Recheck when a restriction or rights complaint is reported. Never work around disabled embedding, age or geographic restrictions, remove advertisements or branding, or download and rehost a video or thumbnail. An available player is not proof that an uploader owns every included work.
- Preserve the explicit click before YouTube loads, privacy-enhanced hostname, normal controls, no autoplay, visible publisher/source links, privacy notice and close control. Use `lib/embeds.mjs` and `assets/embeds.js`; do not paste arbitrary third-party HTML or scripts into content. Document additional providers and their privacy implications before enabling them.
- Official articles and PDF documents currently use direct links. A successful HTTP response or lack of frame-blocking headers is not permission to embed a page. Add a new service only when it offers a supported embedding method suitable for this use.
- Check each photograph’s own rights record, including third-party exclusions, creator attribution, licence links and adaptation terms. Government publication does not automatically put an image in the public domain. Preserve CC BY-SA terms on the adapted Moon image and existing per-image credits.
- Keep source files, research downloads, private calendar details and archival material out of `dist/`. The calendar owner is responsible for publishing only events suitable for public disclosure. Do not infer consent to publish personal details, especially about family members or students.
- Do not describe the site as endorsed by ISRO, NASA, universities, publishers or award providers without their authorization. Copyright notices cover only materials the named owner actually owns.

## Remaining limits

The supplied biographical text and derived records have no documented public reuse licence in this repository. Confirm authorship or permission from the relevant rights holders before treating that text as cleared for redistribution. Existing Commons licence declarations are source records, not a legal opinion on title. Independently hosted video content has not been reviewed in full for underlying rights.

The 3 October 2026 review resolves the H.K. Firodia year as 2009 using the award foundation’s own winners register, superseding the URSC profile’s 2007 date. AIF’s institutional profile corroborates the IEI–IEEE Engineering Excellence Award in 2016. The displayed NDRF tenure follows the institution’s register (18 February 2019–7 March 2022). Source-specific corrections and remaining conflicts are maintained in `data/record-review.json`; records without corroboration must not be described as independently verified.

For a rights complaint, remove or disable the disputed item while reviewing the source record. Do not invent a contact address; use a verified owner contact if one is later supplied. Jurisdiction-specific advice or unresolved ownership requires qualified legal review.

## Provider guidance

The owner specifically requested book covers with the bibliography. The five small identification thumbnails are documented separately in [third-party notices](../THIRD_PARTY_NOTICES.md) and `data/books.json`; the source catalogues do not provide an open reuse licence. Preserve their source links and limited identification use. Do not treat these thumbnails as cleared promotional artwork or apply the site's proprietary copyright notice to them. Unconfirmed book covers remain absent rather than being fabricated.

- [YouTube embedding and privacy-enhanced mode](https://support.google.com/youtube/answer/171780)
- [YouTube Terms of Service](https://www.youtube.com/t/terms)
- [YouTube API Services Terms](https://developers.google.com/youtube/terms/api-services-terms-of-service)
- [YouTube developer policies](https://developers.google.com/youtube/terms/developer-policies)
- [Google Privacy Policy](https://policies.google.com/privacy)

The biography is for a general audience. If its audience or purpose changes to a child-directed service, review the provider’s child-directed designation requirements and applicable privacy rules before deployment.
