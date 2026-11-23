# Running and publishing the portfolio

The current host, domain registrar and DNS records were not visible. These are conditional routes for a static website, not a claim about the existing hosting setup. No deployment or DNS change was performed.

## Review locally

Extract the delivery ZIP and open `francesco-arezzo/dist/index.html`, keeping the adjacent `assets/` folder. The HTML contains its CSS and JavaScript; the PDF is a conventional asset. To review the production folder through a local server, install Node.js 18 or later and run these commands from the project root:

```sh
npm run check
npm start
```

Visit `http://127.0.0.1:4173`. No package installation or account credentials are needed. The browser receives pre-rendered HTML and local assets.

## If the current host accepts static files

1. Download a backup of the existing published files.
2. Upload the contents of `dist/` into the existing site's document root. `index.html` must sit at the root, with `assets/` beside it.
3. Keep the existing domain connection when staying with the same host. Follow that host's settings for serving `404.html` on missing paths.
4. Check the homepage, PDF download, contact links and HTTPS at the actual domain.

The `_headers` file is understood by compatible static hosts such as Netlify. Hosts that ignore it can still serve this site; configure equivalent response headers in the host's settings if needed.

## If choosing Netlify

For a manual upload, extract the project ZIP and upload the **`dist` folder** through Netlify's drag-and-drop publisher. Netlify documents this as a direct deployment of an already built output folder. Review the temporary deployment URL before connecting the personal domain.

For Git-based deployment, add this source folder to the intended repository, import it into Netlify, and use:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `22` |

The included `netlify.toml` records these settings. If this project lives in a subdirectory of a larger repository, set its base directory to that subdirectory.

Add `www.francescoarezzo.com` in the project's domain management settings, then configure the exact DNS records provided for that deployment. Also add `francescoarezzo.com` and configure the host's redirect to the chosen `www` primary domain. Keep existing email-related DNS records when changing web records. Wait for DNS validation and the HTTPS certificate, then check both domain variants.

Official documentation, checked 21 November 2026:

- [Create deploys](https://docs.netlify.com/deploy/create-deploys/)
- [Get started with domains](https://docs.netlify.com/manage/domains/get-started-with-domains/)

## If choosing GitHub Pages

No accessible repository was returned by the connected GitHub account, so no branch or remote repository has been modified. A manually triggered Pages workflow is included at `.github/workflows/pages.yml`; it runs only after you enable Pages and choose **Run workflow** in your own repository.

1. Put this project at the root of the intended repository. The workflow assumes that location.
2. In the repository's **Settings → Pages**, choose **GitHub Actions** as the build source.
3. Run the **Publish portfolio to GitHub Pages** workflow. It builds, tests, uploads `dist` and deploys the Pages artifact.
4. Review the generated Pages URL.
5. Add `www.francescoarezzo.com` as the custom domain in Pages settings **before** changing the domain's DNS records. Point the `www` CNAME to `francescomariaarezzo-lab.github.io`, without a repository path. Configure the apex records according to GitHub's current domain documentation so both variants work together.
6. Enable HTTPS when GitHub has provisioned the certificate. For custom Actions deployments, GitHub says a source `CNAME` file is not required.

The `www` domain matches `site.url` in `src/content.json`. If you choose the apex domain as primary instead, change `site.url` and rebuild so canonical, sitemap and social-sharing URLs match.

Official documentation, checked 21 November 2026:

- [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## Verify after deployment

- Confirm both domain variants reach the intended HTTPS page and one redirects to the canonical host.
- Download the profile PDF and check it opens.
- Follow GitHub, LinkedIn and email links.
- Check a phone-width viewport, the menu, project details and keyboard focus.
- Check `/robots.txt`, `/sitemap.xml` and `/assets/social-card.png` on the deployed host.
- Confirm a missing URL returns a real 404 response.

Never upload `src`, documentation or the original user brief as the public document root. Only `dist` is intended to be public.
