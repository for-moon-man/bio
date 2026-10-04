# Books, Wikipedia and LinkedIn review — 3 October 2026

The site now has a shared bookshelf on the English biography and Tamil edition, a three-book home-page preview, a Books navigation link and gallery cross-links. Five actual covers were located, visually checked against their titles and served as small local WebP thumbnails. Existing layouts, video consent controls, 79 reviewed honours and 37 original chronology records are preserved.

## Bibliography reconciliation

The English [Wikipedia revision 1376809719](https://en.wikipedia.org/w/index.php?title=Mylswamy_Annadurai&oldid=1376809719), last edited 26 September 2026, lists eight book labels. These are accounted for as follows:

| Wikipedia label(s)                     | Site treatment           | Evidence and limits                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kaiyaruke Nila                         | Full book card and cover | [The New Indian Express](https://www.newindianexpress.com/states/tamil-nadu/2021/Dec/20/moon-mans-long-standing-dream-becomes-a-reality-2397627.html) identifies the autobiography; [Goodreads](https://www.goodreads.com/book/show/18781356) provides the matching cover. Publication year unconfirmed.                                                                                |
| Siragai Virikkum Mangalyaan            | Full book card and cover | [Amazon](https://www.amazon.in/dp/8193129504) lists 2015 and ISBN 9788193129500; [Noolulagam](https://www.noolulagam.com/books/38039) lists Thanthi Publications and 2019. Both catalogue years are disclosed; no first-publication or exact launch date is inferred.                                                                                                                   |
| Valarum Ariviyal + Ariviyal Kalanjiyam | One combined title       | [Sixth Sense Publications](https://sixthsensepublications.com/index.php?route=product/product&product_id=756) confirms **Valarum Ariviyal Kalanjiyam**, ISBN 9789382577706, and E. K. T. Sivakumar alongside Annadurai. [Noolulagam](https://www.noolulagam.com/books/12932) lists 2012 and provides the cover. Page totals differ and are omitted. Separate books are not established. |
| Vinnum Mannum                          | Full book card and cover | [Amazon](https://www.amazon.in/dp/938317854X) credits Annadurai and V. Dillibabu, Murankalari Padaippagam, 2020, ISBN 9789383178544. The listed January 1 date is not asserted as a launch day.                                                                                                                                                                                         |
| Periyarum Ariviyalum                   | Full book card and cover | [PeriyarBooks](https://periyarbooks.com/products/periyarum-ariviyalum) identifies a 2023 first edition, 63 pages, Periyar Sinthanai Uyarayvu Maiyam.                                                                                                                                                                                                                                    |
| India–75                               | Further-title entry      | Listed by English and Tamil Wikipedia. The Tamil title includes “Pormunai Muthal Aermunai Varai”. No matching edition, publisher or cover was established.                                                                                                                                                                                                                              |
| Ariviyalum Maanudamum                  | Further-title entry      | Listed in English Wikipedia; no matching publisher/library record or authentic cover was established.                                                                                                                                                                                                                                                                                   |

The Wikipedia associations with the 2013 Adithanar Literary Award, the 2021 Manavai Mustafa science award and a Kannada translation of the Mangalyaan book remain source-qualified notes. They are not promoted into independently confirmed awards or edition dates. This resolves the list without inventing a total of eight distinct books or filling missing cover slots with unrelated images.

Source texts, image URLs, collaborators, edition notes and bilingual summaries are maintained in `data/books.json`. The five covers were checked visually; their exact compositions are preserved at a maximum of 240 × 360 pixels. Cover copyright and source listings appear in `THIRD_PARTY_NOTICES.md` and on the site. They are identification thumbnails requested by the owner, not openly licensed artwork or a claim to publisher endorsement.

## Wider Wikipedia review

| Topic                                      | Result                                                                                                                                                                                                                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Early life and education                   | Existing birth, institutions and chronology retained. Added Electronics and Communication Engineering and Applied Electronics specializations using [URSC](https://www.ursc.gov.in/directors/annadurai.jsp). No guessed PhD year.                                      |
| Chandrayaan, Mars and satellite programmes | Existing mission chapters already cover the principal dates and roles. The early Chandrayaan-2 development assignment remains distinct from the 2019 launch.                                                                                                           |
| Additional assignments                     | INSAT-2B spacecraft operations manager (1993–1996) and INSAT-2C deputy project director (1994–1996) appear in a separate, source-qualified disclosure in both languages. Their exact roles and periods are Wikipedia-only, outside the 37 original chronology records. |
| Science education                          | Added URSC-supported references to two student-satellite projects and his life/work appearing in Tamil Nadu's Class 10 science textbook. This does not claim inclusion in every current textbook edition.                                                              |
| Public life and writing                    | Added the 20 December 2021 New Indian Express account of his visit to thank Kothavadi lake volunteers, linked to his autobiography. Restoration is credited to volunteers and public works, not assigned to him.                                                       |
| Honours                                    | Existing review already covers the recognitions listed in English Wikipedia. Kept award-provider corrections and existing uncertainty labels.                                                                                                                          |
| Current roles                              | Wikipedia's open-ended NDRF/TNSCST claims do not supersede dated institutional records or the documented tenure conflict.                                                                                                                                              |
| Rankings, patent and satellite totals      | Unsupported ranking, ambiguous patent attribution and an uncorroborated personal total of 30 satellites were not imported as facts.                                                                                                                                    |
| Films and personal infobox claims          | Wikipedia's film-character assertions cite video links without sufficient independent film-production evidence. They were not promoted into biography facts. Unsupported political affiliation and unnecessary family details were not added.                          |

Wikipedia is used as a discovery source with permanent revision links. The site contains newly written factual summaries, with publisher/institutional evidence preferred where available. Existing corrections from the earlier audit remain intact.

## LinkedIn result

The following URLs were tried directly in this turn:

- https://www.linkedin.com/in/dr-mylswamy-annadurai-05641a1/
- https://www.linkedin.com/in/dr-mylswamy-annadurai-05641a1/details/honors/
- https://www.linkedin.com/in/dr-mylswamy-annadurai-05641a1/details/experience/

All returned **HTTP 999 with empty usable content**. The honours URL was the user's suggested retry. No signed-in session or authenticated export was available. Therefore no new LinkedIn honours, employment entries, linked evidence or pictures were retrieved. The existing 79 honours and 37 source chronology records are not described as a fresh LinkedIn import. An owner-provided export, copied entries or accessible evidence links are needed to finish that part.

## Runtime refresh

`assets/honours-cache.js` and `sw.js` implement automatic caching of this site's published English honours page, including its existing evidence links:

- Warm the cache from the home page after load.
- Revalidate every five minutes while visible and online; check again when due after returning to the tab.
- Use HTTP cache revalidation when the server supports it; compare document content and replace the cache only when changed.
- Keep the last valid archive on network failure or invalid host HTML.
- Offer a reload link if the archive changes while a visitor is reading it.
- Scope the cache to this deployment, including GitHub Pages paths such as `/bio/`.

This is document-level refresh of reviewed, published content. It does not scrape LinkedIn, call an unavailable public profile feed or discover new awards. Changes must first be reviewed, rebuilt and published. HTTPS or localhost is required; storage may be evicted and third-party services/assets are not guaranteed offline. No deployment was performed.

## Validation

`npm run check` passed formatting, packaging and all 16 content/tooling tests. `npm run test:browser` passed the full interface suite and the dedicated cache test. The five optimized cover files total approximately 73 KiB.

The cache's dedicated browser test passes for home-page warming, a simulated five-minute refresh, unchanged content, update notices and reload, invalid HTTP 200 content, offline honours text and project-path hosting. The full interface suite also checks the five covers and source disclosures in both languages, navigation, filters and responsive layouts from 320 to 1440 pixels. Visual captures are in local `test-results/books-*.png`; research downloads remain under `.work/`. Neither folder is published.
