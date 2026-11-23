# Research, design and content record

Prepared 21 November 2026. This records the initial research and factual basis. The later editorial refinement is documented in `REFINEMENT.md`. This file is not published in `dist`.

## What could be inspected

| Source | Observation | Limit |
| --- | --- | --- |
| Supplied `Testo incollato.txt` | Read in full. Provides identity, education dates, exchange status, internship work, projects, awards, toolkit and email. | No original CV attachment accompanies it. |
| `https://galessandroni.com` | Web retrieval reached the page titled “Giancamillo Alessandroni”; returned no readable content. Direct retrieval was denied with HTTP 403. | No live visual, typography, grid, animation or mobile claims can be verified. |
| `https://www.francescoarezzo.com` | Both `www` and apex retrieval attempts failed in this session; direct requests returned HTTP 403. | This does not establish an outage. Current design, stack, assets, host and DNS could not be audited. |
| Connected GitHub | Authenticated account identity is `francescomariaarezzo-lab`. Searches and repository listing returned no accessible repositories. | A verified profile link can be included; repository URLs and project code cannot be inferred. |
| Public LinkedIn search result | Identifies Francesco Maria Arezzo at Bocconi, APS Bank in Malta, the May 2026 Linux certification, Fermi in Movimento and selected recognitions. | The original page rejects direct automated retrieval; no additional claims were inferred. |

LinkedIn source: <https://it.linkedin.com/in/francesco-maria-arezzo>. The website uses the equivalent canonical `www.linkedin.com` profile path. The GitHub profile URL uses the authenticated account identity; its public rendering was not verified.

## Reference comparison: evidence boundary

A genuine visual before/after comparison was not possible. The following design comparison explicitly distinguishes the user's description of the reference from independently implemented choices; it is not an invented audit of either live site.

| Aspect | Reference as described in the brief | Delivered implementation |
| --- | --- | --- |
| Structure | Compact About, Education, Awards, Projects, Contact | Education, Experience, Academic projects, Recognition with a compact toolkit, and Contact. The redundant About section was removed in refinement. |
| Visual language | Elegant, minimalist, academic | Original ivory and olive palette, serif display type, system sans body type, fine rules and restrained section labels. |
| Hierarchy | Compact, scannable academic identity | Name, actual degree context, mathematical interests, upcoming exchange and profile download visible early. |
| Project depth | Selected meaningful work | Three compact native disclosures; question, approach, methods and status for each. |
| Layout | Exact dimensions and responsive behaviour unknown | Independently chosen 1120px content width, fixed left section index, single column on mobile. |
| Interaction | Live animation and navigation unknown | Native anchor links and details; optional menu, active section state, one-time entrances and subtle hover transitions. |
| Mobile | Not visually observable | Implemented breakpoints at 1050px, 760px and 480px; browser verification remains required. |

The qualities described in the brief are effective because a small number of sections, clear typography and restrained project descriptions make an academic profile easy to scan. This is design reasoning based on the brief, not a claim that a particular font, colour or interaction was observed live.

## Content decisions

| Topic | Public treatment | Basis |
| --- | --- | --- |
| Name | Francesco Arezzo; full name in metadata and profile PDF | Supplied brief |
| Bocconi | BSc in progress; September 2024 start; July 2027 expected graduation | Supplied brief |
| IE University | Incoming exchange, Spring 2027; individual courses awaiting confirmation | Exchange confirmed in brief; final course approvals absent |
| APS Bank | Completed Summer 2026 internship, three modelling/analysis contributions | Brief; public LinkedIn corroborates broad work |
| S&P 500, Ames Housing, single-cell classification | Three completed academic projects; descriptive methods without fabricated metrics or code URLs | Detailed brief; selected completed academic work instruction |
| Recognition | Three supplied scientific/academic achievements featured; fourth retained in the profile PDF and content data | Brief; selected public corroboration |
| Linux for HPC | Education certification, not an award | Brief and public LinkedIn result |
| English | C1 / IELTS 8.0 | Brief; avoids the stronger public profile language label |
| MERCURY | Omitted | Mentioned only by name; no scope, status or accessible repository |
| CV | Newly created downloadable academic/professional profile, labelled Profile PDF | Original CV absent; all claims drawn from the supplied brief |
| GitHub and LinkedIn | Verified identity/profile paths only | Account identity and public search result |
| Grades, model scores, revenue impact, deployment claims | Omitted | No evidence supplied |

The profile PDF is not represented as the user's original CV. It is generated from the same content data as the site. Its copy should be reviewed against the current original CV before publication or application use.

## Before publication

1. Review or replace the generated profile PDF with the current approved CV.
2. Confirm that the supplied descriptions and completion statuses of the three academic projects are current.
3. Supply MERCURY's approved description/status and any public project links if it should be added.
4. Keep IE course names omitted until academic approvals are final.
5. Identify the current host and domain DNS records before choosing the matching deployment route.
6. Complete desktop/mobile and assistive-technology review in an unrestricted browser.

The site itself contains no placeholder links, made-up project results or internal editorial notes.
