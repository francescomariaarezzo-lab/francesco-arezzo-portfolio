# Colour, motion and case-study update

21 November 2026 · Version 1.2. This extends the refinement documented in REFINEMENT.md and supersedes its palette and motion figures.

## Visual changes

The page stays predominantly white. The former beige cast is replaced with a cleaner warm white, deeper forest-green accents and a soft sage contact surface. The existing serif identity, content grid and thin section dividers remain.

| Role | Colour |
| --- | --- |
| Page | `#fdfdfb` |
| Main text | `#21332e` |
| Secondary text | `#5d6d65` |
| Accent and chapter labels | `#326a59` |
| Contact surface | `#eff6f2` |
| Dividers | `#dce7df` |
| Case-study rule | `#b6d2c2` |

Chapter labels now use an italic Georgia serif at 22px on desktop and 21px on mobile. They are actual section headings; the visual change does not alter navigation or document hierarchy. Repeated row gaps were removed from the project grid so spacing follows the text's existing margins.

The favicon and social-sharing image use the new palette. The existing PDF profile is retained unchanged.

## Motion

The hero uses a 600ms fade/rise with short 65ms and 130ms delays. Major sections enter once over 500ms. Link feedback lasts 220ms and toggle rotation 320ms.

Project and bank panels use native details/summary controls. On browsers supporting `::details-content`, `interpolate-size` and discrete transitions, the content expands and collapses naturally over 380ms, with a 240ms opacity transition. This is CSS-only: no height measurements, timers or animation dependency. Other browsers retain native disclosures with a short opening fade.

All animated disclosure sizing is inside the no-preference motion query and feature detection. Reduced-motion visitors receive native instant opening and closing. Main sections remain visible before JavaScript and before intersection callbacks.

Primary implementation references:

- [Chrome: styling native details](https://developer.chrome.com/blog/styling-details)
- [Chrome: intrinsic-size transitions](https://developer.chrome.com/docs/css-ui/animate-to-height-auto)

These features have been implemented and checked in source; browser rendering is not claimed because Chromium cannot launch in this session.

## Descriptions and factual boundaries

APS now has three expandable case descriptions, covering property valuation/risk, population forecasts/housing scenarios, and retail pricing. Each distinguishes the approach from the documented output. The completed academic projects have expanded technical explanations and context.

The content structure supports separate Finding and What it led to fields. They are published only when actual confirmed text is supplied. Empty fields are omitted; no placeholders or invented findings appear on the public page.

The available brief establishes scope, methods, forecasts/comparisons and pricing recommendations. It does not establish final empirical results or implementation decisions. Prior discussion also contains proposed workflows and earlier assistant summaries; those are not treated as proof of measured findings.

| Work | Included from the supplied material | Further detail needed to state findings and consequences |
| --- | --- | --- |
| APS property valuation | ML valuation and locality-level model-implied risk comparison | Which differences were found; interpretation and specific recommendations |
| APS population forecasts | Locality-level trajectories linked to housing-demand/valuation scenarios | Which trajectories differed; direction/horizon and resulting conclusions |
| APS retail pricing | Comparison of fees/subscriptions/low-activity charges; pricing-strategy recommendations | Specific findings, proposed fee changes and whether anything was adopted |
| S&P 500 | Regression, BIC model comparison and ANOVA | Selected model/drivers, statistical findings and conclusion |
| Ames Housing | Data preparation, feature engineering, regression/XGBoost comparison | Comparative outcome, evaluation results and main lesson |
| Single-cell hypoxia | Gene-expression classification checked against hypoxia signatures | Observed classification/biological findings and their interpretation |

A concise request for these results was sent to the owner while the independent visual work proceeded. Until those facts are supplied, this delivery completes the colour, typography, motion and description updates; outcome-specific copy remains pending.

## Validation

The new text contrasts are 13.07:1 for main text on white, 5.37:1 for secondary text on white, 6.17:1 for the accent on white, 4.98:1 for secondary text on sage and 5.73:1 for the accent on sage.

Build, integrity tests, HTTP asset serving, PDF bytes, heading/summary markup and CSP hashes are checked in VALIDATION.md. No deployment, commercial impact, model score or browser accessibility score is claimed.
