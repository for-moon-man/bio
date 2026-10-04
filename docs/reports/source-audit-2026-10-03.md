# Site source and date audit — 3 October 2026

Reviewed all seven pages, both language editions, 79 honours, 37 career entries, ten selected recordings, public-event references and seven archival photo records. Corrections are applied through `data/record-review.json`; the original collection remains preserved internally.

## Findings and corrections

| Record                                | Published correction                                                                                                    | Supporting reference                                                                                                                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vivekananda Human Excellence Award    | 2014; previously undated                                                                                                | [URSC biography](https://www.ursc.gov.in/directors/annadurai.jsp)                                                                                                                                 |
| Poorna Chandra Award                  | 2008; November 18 is the article date, not an asserted ceremony date                                                    | [The Hindu, archived](https://web.archive.org/web/20121107044256/http://www.hindu.com/2008/11/18/stories/2008111855000500.htm)                                                                    |
| H. K. Firodia Award                   | 2009; award foundation resolves the conflicting 2007 employer biography                                                 | [Foundation register](https://hkfirodiaawards.org/awards-by-year.php)                                                                                                                             |
| Bhaskara Award / ISRS fellowship      | Award: 2016. Fellowship confirmed, election year unspecified                                                            | [ISRS register](https://www.isrs-india.org/list-of-awardees.aspx)                                                                                                                                 |
| IEI–IEEE Engineering Excellence Award | 2016                                                                                                                    | [American India Foundation profile](https://aif.org/people/dr-mylswamy-annadurai/)                                                                                                                |
| AIAA Space Systems Award              | Chandrayaan-1 team award; Annadurai represented the team                                                                | [The Hindu](https://www.thehindu.com/news/national/Space-Systems-award-for-Chandrayaan/article16879456.ece)                                                                                       |
| URSC directorship                     | 1 April 2015–31 July 2018                                                                                               | [URSC biography](https://www.ursc.gov.in/directors/annadurai.jsp)                                                                                                                                 |
| NDRF chairmanship                     | 18 February 2019–7 March 2022; organization name corrected                                                              | [NDRF chairmen register](https://www.ndrf.res.in/chairmen.html)                                                                                                                                   |
| Kaynes appointment                    | Additional non-executive independent director from 13 May 2026; proposed five-year term subject to shareholder approval | [Stock exchange disclosure, Annexure E](https://www.kaynestechnology.co.in/doc/Stock-Exchange-Disclosures/ChangeInManagement13May2026.pdf)                                                        |
| Tamil Nadu curriculum committee       | Appointment reported 29 June 2026; report date distinguished from effective appointment date                            | [The Times of India](https://timesofindia.indiatimes.com/city/chennai/isros-chandrayaan-1-scientist-mylswamy-annadurai-to-head-tamil-nadus-curriculum-design-committee/articleshow/132075811.cms) |

Also corrected INSAT-3P to INSAT-3B in Tamil, separated two merged Tamil social honours, and removed the unsupported Global Thinkers ranking claim. The uncorroborated UCLA attribution is marked for review and its arbitrary 2024–2025 range is excluded from displayed year filters. Mumbai recognition retains May 2024 without choosing between conflicting presentation days. TNSCST and Dhaksha tenure conflicts remain explicitly identified.

## Media

All ten recordings have publication dates, publisher links and checked playback metadata. YouTube returned `OK` and embeddable status for all ten. Publication dates display in Asia/Kolkata and are distinguished from event dates. The previously undated biographical film was uploaded on 3 August 2018; the US Consulate Chennai recording was published/broadcast on 12 July 2019. Metadata availability does not guarantee playback in every region or browser.

Photo captions distinguish upload, publication, capture and file-metadata dates. The early portrait was uploaded on 9 March 2006; its capture date is unknown. The prelaunch photograph carries 4 October 2008 file metadata. The lunar-water visualization was published on 25 September 2009. No capture date is invented for the crater image. English visible video view counts were removed; retained Tamil counts are identified as snapshots.

## Remaining uncertainty

Of 116 honours and career records, **27 are corroborated within the stated scope, 17 have partial support, five retain conflicting records and 67 rely on the supplied collection**. Each record now has a bilingual source-status note. A corroborated award year does not establish its presentation day, and a mission page does not independently establish personal tenure.

**Sixteen honour records still lack an established year:**

| Record ID                               | Recognition                                           |
| --------------------------------------- | ----------------------------------------------------- |
| academia-05                             | Eminent Scientist Award                               |
| academia-08                             | Jewel of GCT                                          |
| academia-09                             | Personality of the Year                               |
| academia-12                             | Distinguished Scientist Award                         |
| professional-02                         | Certificate of Appreciation                           |
| professional-05 through professional-10 | Six fellowships, including ISRS                       |
| professional-16                         | Lifetime Contribution Award                           |
| professional-23                         | Lifetime Achievement Award — attribution under review |
| social-11                               | Lifetime Achievement Award in Science and Technology  |
| social-14                               | Tamil Ma-Mani Award                                   |
| social-16                               | Example to Youth Award                                |

LinkedIn returned HTTP 999 without usable page content. Its posts could not be reviewed directly. The profile link remains available, but this audit does not claim access to its activity or completeness against its latest posts. Institutional records, award-provider registers, contemporary reporting and publisher metadata support the published corrections. Missing dates require additional evidence; none were invented.

## Validation

- Formatting, build and all 15 automated tests passed.
- All 43 checked reference URLs returned HTTP 200. Response success is a link-health check, not proof of a claim; claims are limited to the documented source scope.
- Browser layout checks passed for all seven pages at 320, 390, 768, 1024 and 1440 pixels.
- The complete browser suite passed: language navigation, calendar links, honours and career filters, keyboard photo viewer, video loading and stopping, and layouts without JavaScript. External services were blocked during these repeatable interface checks.
- Visually inspected English honours and career entries and Tamil source notes on mobile and desktop captures.
- The browser video-filter check now selects a talk explicitly, avoiding an assumption about recording order after previously undated videos gained publication dates.

The generated site is available in `dist/`. This audit does not deploy it. Research downloads and browser captures remain local and are excluded from the publishing artifact.
