# Refinement validation

21 November 2026. Portfolio version 1.3. This supersedes earlier validation notes.

## Completed checks

| Check | Result |
| --- | --- |
| Static production build | Successful; complete HTML, local assets, robots, sitemap, security headers and custom 404. |
| Automated integrity suite | 7 passed; 0 failed. Covers anchors, ARIA references, metadata, content statuses, local assets and native project and bank-case disclosures. |
| JavaScript syntax | Build, server and browser scripts passed node syntax checks. |
| HTML audit | One H1, English language declaration, semantic sections, valid internal IDs and six native project/bank summaries with headings and phrasing content. |
| Initial readability | All five main content sections are present in static HTML without hidden/inert attributes. No JavaScript-generated content or persistent pre-hidden reveal state. |
| Download | Both profile links use the conventional assets/Francesco_Arezzo_Profile.pdf path. The PDF is byte-for-byte identical to the previous HTML's embedded download. |
| Profile PDF | Valid one-page PDF; 4,853 bytes. Existing rendering and content retained. |
| HTTP smoke check | Homepage, PDF, updated social image, SVG favicon, robots and sitemap returned 200 with correct MIME types; a missing path returned 404. Downloaded PDF bytes matched the asset. |
| CSP | Both inline scripts and the inline stylesheet have matching SHA-256 hashes in the generated headers file. |
| CSS audit | No unused class selectors against current markup and the js/motion/has-entered dynamic classes. |
| Link destinations | Existing email, GitHub and LinkedIn destinations preserved. |
| Contrast | Ink/white 13.07:1; secondary text/white 5.37:1; green/white 6.17:1; secondary text/sage 4.98:1; green/sage 5.73:1. |
| Dependencies | No runtime packages, remote fonts, animation library, analytics or background network calls. |

## Browser and accessibility limits

Earlier Chromium/Playwright launches were attempted for desktop (1440px), tablet (768px) and phone (390px) review. The same environment remains in use; browser rendering was not re-claimed for version 1.2. The environment rejected Chromium's socket operation before it could open a page. No viewport actually rendered. Consequently there are no actual website screenshots and no claimed browser passes for visual balance, overflow, keyboard interactions, native disclosures, reduced-motion rendering or assistive technology.

The code includes a single-column mobile layout at 760px, naturally wrapping headings/dates, safe email wrapping, 44px interactive targets, a keyboard-operable menu, visible focus, native disclosures, and reduced-motion handling. These features were reviewed in source; device and screen-reader verification remains necessary in a normal browser. No Lighthouse score is claimed.

## Content and deployment

The refinements retain the previously supplied factual basis. The actual empirical findings and resulting specific recommendations are not present in the source material; they were requested from the owner and remain pending. The current site uses documented methods, outputs and context, without inventing outcome claims. No new model metrics, research claims, courses, URLs or qualifications were invented. The PDF remains a generated profile from the original brief, not an original CV attachment. Course approval status for Madrid is still provisional.

No public site, hosting, DNS or remote repository settings were changed. See COLOUR_AND_CASE_STUDIES.md for the current design, motion and content changes and REFINEMENT.md for the earlier editorial critique; see DEPLOYMENT.md for publishing instructions.

Current production HTML: 36,824 bytes (9,138 bytes gzip). Three academic project panels and three bank panels. The profile PDF remains unchanged; the favicon and social-sharing image use the new palette. Modern disclosure animations are feature-detected and CSS-only, with a native fallback. Runtime animation behaviour remains unverified here.

Version 1.3 content checks: the updated interest-led introduction contains AI, reinforcement learning and data science; the former finance/science framing is removed from the introduction and metadata. Education now has three records, including the confirmed 2024 high-school diploma with 100/100 cum laude. The school name and location remain unconfirmed and are omitted. The BAI curriculum contains 18 combined entries in three visible groups, taken from the supplied brief and labelled as programme-wide coursework rather than completed courses. Seven existing checks passed; additional DOM checks confirmed the introduction, curriculum entries, honours and current CSP hashes.
