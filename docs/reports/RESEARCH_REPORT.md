# Internet research and additions

Historical report. The later [language separation and source migration](LANGUAGE_SEPARATION_REPORT.md) supersedes descriptions of bilingual public pages and external archive links below.

Research checked on 2 October 2026. The findings were implemented in the existing website, preserving its design and static build. This supplements the earlier `ENRICHMENT_REPORT.md`.

## Eight recordings added

The [recordings section](../../gallery.html#watch) now contains **10 items**: eight new talks/interviews plus the two existing links. It supports type filtering, original-title/source disclosures, direct YouTube links and players loaded on request. Four chapter links are included for the Madan Gowri conversation, using the publisher's own timestamps.

| Recording                                                                                            | Publisher                                        | Upload date (UTC) | Duration | Views at review |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------- | -------- | --------------- |
| [Life, Mars and the universe](https://www.youtube.com/watch?v=7o2L1_wPYAE)                           | Forbes India                                     | 21 December 2022  | 22:31    | 3,330           |
| [Future 2.0: Indian Space Technology and Beyond](https://www.youtube.com/watch?v=ZIgCUfFAWNo)        | TEDx Talks / TEDxSIBMBengaluru                   | 9 May 2019        | 19:19    | 5,765           |
| [Future of Space Technology in India](https://www.youtube.com/watch?v=C26gyxKRMtY)                   | TEDx Talks / TEDxMarwadiUniversity               | 1 October 2024    | 18:14    | 426             |
| [An engineer's journey — with Mr. GK](https://www.youtube.com/watch?v=6bFEo12lDUI)                   | Mr. GK                                           | 20 January 2023   | 41:45    | 435,487         |
| [The Moon, Mars and space education — with Madan Gowri](https://www.youtube.com/watch?v=VcjrlTcBcqE) | Madan Gowri, with Annadurai and Anand Megalingam | 1 October 2023    | 49:39    | 158,764         |
| [Chandrayaan-3 in the larger Indian space journey](https://www.youtube.com/watch?v=JIzr664YHFo)      | The New Indian Express                           | 31 August 2023    | 89:08    | 6,148           |
| [I3CIT 2020 keynote](https://www.youtube.com/watch?v=QIDT0dQr0uI)                                    | Chennai Institute of Technology                  | 30 July 2020      | 70:44    | 323             |
| [Amalthea '20 webinar](https://www.youtube.com/watch?v=nElss3iRpB0)                                  | Amalthea IIT Gandhinagar                         | 10 January 2021   | 69:45    | 952             |

Some display headings are concise editorial labels. Exact original titles, including Tamil text, are retained in the data and available on each card. Durations come from the player metadata in seconds; search-result duration labels occasionally differ by one second. Upload dates are converted from the source timestamps to UTC. The Amalthea series title contains “'20”, but the available upload timestamp is in January 2021; those are not treated as the same date.

The two Tamil-channel conversations have substantial recorded audiences. The TEDx and institutional recordings were selected for their subject matter and publisher provenance, not described as viral or universally acclaimed. View counts are dated snapshots, not like counts, ratings or proof of audience approval.

## Additional factual context

- **Engineering after ISRO:** [EdexLive / IANS, 23 January 2021](https://www.edexlive.com/campus/2021/jan/23/iitdm-develops-integrated-machine-that-can-process-banana-stem-to-make-fibre-yarn-17529.html) describes a banana-fibre initiative spearheaded by Annadurai. IIITDM Kancheepuram faculty and students developed the processing machine, with Gencrest as an industry partner. Added a paragraph to the existing post-ISRO narrative and a record in “In Media”. Prototype work and pilot-plant plans are not represented as demonstrated later commercial success.
- **International mission collaboration:** [NASA Science's Chandrayaan-1 account](https://science.nasa.gov/mission/chandrayaan-1/) documents scientific equipment from the United States, United Kingdom, Germany, Sweden and Bulgaria alongside Indian instruments. The missions page now includes this detail and NASA's account of M3's role in confirming water locked in lunar minerals. Credit remains with the mission and its scientific collaboration.
- **NDRF source discrepancy:** [NDRF's own chairmen register](https://www.ndrf.res.in/chairmen.html) lists Dr. M. Annadurai from **18 February 2019 to 7 March 2022**, whereas the supplied official biography gives **2019–2023**. The original chronology is retained with a conspicuous note and institutional source link in both language views. The institution calls itself **National Design and Research Forum**, reversing the order used in the supplied biography.

The International Tropical Fruits Network republishes the same banana-fibre reporting. It was useful corroboration of the available text but is not counted as an independent second report.

## Verification and editorial limits

- Discovered candidates through YouTube searches and followed original publisher uploads. Wikipedia was used to find source leads, not as sufficient evidence for new biographical claims.
- Verified each new video's title and publisher through YouTube oEmbed. Retrieved upload timestamp, duration, view count and description from the original watch page's player metadata.
- All eight new records reported player status `OK`. Full recordings were not watched or transcribed; summaries are grounded in publisher titles and descriptions. Predicted futures or speculative discussion are not incorporated as established facts.
- Did not copy images, thumbnails, video files or extended publisher descriptions into the website. New summaries are short editorial paraphrases; original video titles and sources remain available.
- Excluded similarly named speakers, including TEDx results about the “Auto Annadurai” entrepreneur, who is a different person.
- Did not adopt the Madan Gowri description's inaccurate “former Chairman of ISRO” label. The biography retains the documented ISRO Satellite Centre directorship, and the source-title issue is noted on that recording.
- Investigated [US7185858B2](https://patents.google.com/patent/US7185858B2/en), which appeared in a secondary source. Its inventors are Hangching Grant Wang and Rongsheng K Li, and its original assignee is Boeing. It cites a work by M. Annadurai, but does not list him as inventor. No inventorship or ownership claim was added.
- Britannica returned HTTP 403; the NRCB URL could not be resolved here; legacy ISRO/URSC biography URLs tried during discovery returned 404. No new claims rely on their inaccessible content.
- The original official biography and 40 source-image URLs remain blocked. The new recordings are described as independent additions, not as recovered members of the inaccessible official archive.

## Checks completed

- `npm run build`: passed; all seven static pages generated.
- `npm test`: **five checks passed**, covering the existing awards/chronology inventory, new research/video metadata, source differences, complete static archives, structured data, unique IDs and local links/fragments.
- Chromium: all seven pages at **1440, 768, 390 and 320 px**, with no horizontal overflow or failed local images.
- Verified all honours category/year combinations and the existing archive/chronology controls. Verified the new video filter counts: **4 talks/webinars, 5 interviews and 1 biographical film**.
- Verified cross-links reveal a recording even if its type was previously filtered out. Filtering away a loaded recording unloads its iframe, avoiding hidden playback.
- Verified keyboard image viewing, Escape/focus return, mobile navigation and click-to-load video behavior. No YouTube request occurs before loading a player.
- Verified no-JavaScript navigation and availability of all ten recording links. No browser script errors.
- Checked **87 unique external reference, chapter, metadata and embed URLs**: **45 HTTP 200**, **42 HTTP 403**. All 42 blocked URLs are the previously documented official biography pages and source images. No published reference returned 404.
- Visually inspected the new desktop and mobile recording layouts.

## Files changed in this research pass

New:

- `lib/recordings.mjs` — static rendering of the curated recording cards and filter controls.
- `data/annadurai-research.json` — source findings, scope limits and excluded claims.
- `RESEARCH_REPORT.md` — this report.

Modified:

- `data/annadurai-media.json` — eight recording additions, metadata, article record and collection descriptions.
- `lib/content.mjs` — research data and NDRF verification note.
- `lib/archive.mjs` — recordings section, article presentation and cross-links from archive categories.
- `build.mjs` — entry points, post-ISRO paragraph, NASA context, metadata and research-source section.
- `assets/site.js` — recording filters, deep-link behavior and unloading hidden players.
- `assets/site.css` — responsive recording cards, source details and article styles.
- `test/content.test.mjs` — new metadata/provenance and static-content checks.
- `README.md` — current inventory and data architecture.
- `ENRICHMENT_REPORT.md` — pointer to this subsequent research pass.
- `index.html`, `biography.html`, `missions.html`, `gallery.html`, `tamil.html`, `sources.html` — regenerated affected pages. `honours.html` was also rebuilt with identical content.

No dependencies, framework, new public pages, rehosted media or deployment were introduced. Scratch research downloads and browser-check helpers remain in ignored `.work/`.
