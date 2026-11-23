# Portfolio refinement — version 1.1 record

21 November 2026. This records the version 1.1 editorial refinement. For the latest version 1.2 palette, motion and case-study changes, see COLOUR_AND_CASE_STUDIES.md. This is an editorial and interaction refinement of the existing portfolio. The warm ivory background, olive accents, Georgia headings, system sans text, 1120px grid and thin dividers are retained. No framework, font service, animation library or third-party script was added.

## Critique of the previous version

The visual identity was already coherent. The main weakness was repetition: the hero, sidebar and About section explained the same academic identity before the visitor reached evidence. The decorative three-step pathway repeated that identity again.

The information hierarchy also gave too much space to secondary labels. Numbered sections, contribution numbers, status dots, uppercase category labels and 9–11px metadata competed with the institutions and project titles. On mobile, that combination made the page longer while making useful text smaller.

Projects had substance but explained it several times: a summary, methodology list, question, approach and generic scope statement. Expanding a project often repeated information already visible. Contact similarly placed a general invitation above the actual address. These were editing problems rather than reasons to change the design language.

## What changed

| Element | Decision | Reason |
| --- | --- | --- |
| Hero | Keep the large serif name; use one academic subtitle and one specific sentence about probability, stochastic processes, optimization and statistical learning. | Establish identity and interests without a second introduction. |
| About | Remove the section and navigation item. | Its distinctive information is now in the hero; the remaining material repeated education and APS. |
| Hero sidebar and pathway | Remove repeated institutional summaries, the three-step slogan and edition label. | Education already gives exact dates and exchange context. |
| Education | Keep full degree, institutions, dates, location, expected graduation and exchange qualification. Remove promotional descriptions, subject lists and status decoration. | Qualifications and timing carry the evidence. Subjects remain available in the profile PDF. |
| IE exchange | Keep “Incoming exchange” and the note that individual courses await confirmation. | Avoid turning a future exchange into a completed qualification or finalized course list. |
| APS Bank | Keep all three concrete contributions; remove the generic introduction and decorative numbering. Use a compact vertical list. | Technical work reads more clearly across desktop and phone widths. |
| Projects | Keep all three completed academic projects and native disclosures. Use a title, concise investigation, plain status and one expanded technical paragraph. | Separate what was investigated from how it was approached, without repeating a methods list. No scores or unsupported outcomes added. |
| Recognition | Feature the National Register of Excellence, regional Physics Olympiad and INFN mention. | These three form the strongest scientific/academic group. Hack Your Talent is retained in the existing profile PDF and source data. |
| Toolkit | Consolidate programming libraries and languages into two rows under Recognition. | Preserve the actual tools and language qualifications without another full section. |
| Contact | Put email first, followed by GitHub, LinkedIn and the PDF. | The useful actions need no introductory slogan. |
| Navigation and labels | Five section links; no section numbers, numbered project indexes, status dots or duplicate header PDF link. | Navigation now follows the actual remaining structure. |
| PDF | Retain the existing profile, served as a normal PDF asset. Remove the embedded-data-URI export path. | A conventional file is easier to maintain, cache and replace. |

The PDF is the previously supplied generated profile, not a newly discovered original CV. No credentials, factual achievements, links or project completion states were strengthened.

## Motion system

All entrances share `cubic-bezier(.22, 1, .36, 1)`. There are no continuous animations, animated heights, parallax effects or scroll listeners.

| Interaction | Motion | Use |
| --- | --- | --- |
| Hero | 520ms fade and 10px rise; 55ms and 110ms delays for copy and links. | A short sequence for name, academic context and actions. |
| Sections | One-time 420ms fade and 10px rise. | Education, Experience, Projects, Recognition and Contact. |
| Navigation | 180ms underline and colour transitions. | Hover, keyboard focus and active section. |
| Project toggle | 220ms rotation to 45 degrees. | Visual feedback for native open/closed state. |
| Expanded project text | 180ms fade with 4px rise. | Opening only; native closing remains immediate and reliable. |
| Links | 180ms colour feedback; arrows move 2px in their action's direction. | Down for downloads/project navigation, diagonally for external links, up for Top. |

One IntersectionObserver handles section entrances and active navigation. A WeakSet records sections already introduced. The sections are never pre-hidden: without JavaScript, without IntersectionObserver or before its callback, the content remains visible. With reduced motion, CSS disables transitions and animations, smooth scrolling is removed, and JavaScript does not add entrance classes.

## Technical audit

- **Accessibility:** English language metadata, one H1, labelled semantic sections, native summary/details controls, a skip link, 44px navigation/link targets, visible keyboard focus and new-tab descriptions are preserved. The menu exposes `aria-expanded`, closes on Escape and restores focus to its button. No content depends on an animation finishing to exist in the document.
- **Responsive layout:** the original two-column editorial layout becomes one column at 760px. Metadata can wrap, APS contributions use one readable list, toolkit labels stack on narrow phones, the email can break safely, and the footer can wrap. Body copy is 14px; metadata generally 12–13px, rather than the earlier 9–11px. Device rendering still needs browser verification as noted below.
- **Performance:** CSS and JavaScript remain inline in the HTML; there are no runtime network dependencies. Motion changes opacity and transforms. The PDF is a separate 4.8KB file instead of duplicated base64 download URLs. The build removes the earlier embedded export logic.
- **Maintainability:** content remains in `src/content.json`; templates, styling and enhancement logic are separate editable sources. No unused class selectors were found in the refined stylesheet when checked against generated markup and the three dynamic classes. Canonical URL, Open Graph metadata, structured data, sitemap and CSP hashes are retained.

Project summaries contain a native heading and phrasing elements, without nested paragraph/div wrappers, following the [HTML Standard's summary content model](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-summary-element).

## Measured reduction

| Measure | Previous | Refined |
| --- | --- | --- |
| HTML file | 40,439 bytes | 29,453 bytes |
| HTML with gzip | 9,835 bytes | 7,685 bytes |
| Body words, including expanded details and accessibility text | 712 | 355 |
| DOM elements, excluding style/scripts | 310 | 186 |

## Verification and limits

The build, static integrity suite, JavaScript syntax, conventional PDF links, local HTTP responses, profile PDF bytes and colour contrast were checked. Current figures and outcomes are in `VALIDATION.md`.

Desktop (1440px), tablet (768px) and phone (390px) browser verification was attempted. Chromium could not launch because the environment rejected its socket operation. No viewport reached the page, so there are no actual website screenshots or claimed visual, keyboard, overflow, reduced-motion or assistive-technology test passes. The implementation is complete; those browser checks remain an explicit delivery limit.

No live hosting, DNS or remote repository settings were changed.
