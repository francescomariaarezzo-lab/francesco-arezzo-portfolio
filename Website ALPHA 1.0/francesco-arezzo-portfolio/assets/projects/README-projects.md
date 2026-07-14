# Project editing

Project cards and previews are generated from `assets/projects/projects-data.js`.

To add a project:

1. Put the file in `assets/files/` — for example `my_project.ipynb`, `my_report.pdf`, or `my_script.py`.
2. Open `assets/projects/projects-data.js`.
3. Duplicate one project block and edit the text fields and `file` path.
4. Do not edit `script.js`; it only renders whatever project data is listed here.

Minimal notebook example:

```js
{
  title: "Credit Default Risk Prediction",
  status: "Machine Learning Project",
  year: "2026",
  fileType: "jupyter",
  file: "assets/files/credit_default_risk.ipynb",
  summary: "Predicting credit default risk from borrower and financial features.",
  explanationHeadline: "A supervised tabular-learning project for credit-risk modelling.",
  context: "The project estimates default probability from structured financial data.",
  whatToNotice: "Feature engineering, validation, model comparison and calibration.",
  outcome: "To be added after the final notebook is complete."
}
```

Tags are intentionally omitted in the current layout, so the project cards stay cleaner.

For reliable preview loading while testing locally, open the folder with a small local server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in the browser. Once deployed online, the project previews load directly from the file paths.
