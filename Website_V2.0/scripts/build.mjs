import { readFile, writeFile, mkdir, cp, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFile(path.join(root, file), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const icon = shape => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shape}</svg>`;
const down = icon('<path d="M12 4v16M6 14l6 6 6-6"/>');
const up = icon('<path d="M12 20V4M6 10l6-6 6 6"/>');
const external = icon('<path d="M6 18 18 6M6 6h12v12"/>');
const plus = icon('<path d="M12 5v14M5 12h14"/>');
const caseNotes = (item, isProject = false) => {
  const fields = [
    ['Approach', item.approach || item.detail],
    ['Finding', item.finding],
    ['What it led to', item.consequence],
    ['Output', item.output],
    ...(isProject ? [['Context', item.context]] : [])
  ].filter(([, value]) => typeof value === 'string' && value.trim());
  return `<dl class="case-notes">${fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>`;
};

export function validateContent(content) {
  const { site, education, projects } = content;
  if (!site || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) throw new Error('A valid contact email is required.');
  if (new URL(site.url).protocol !== 'https:') throw new Error('Canonical URL must use HTTPS.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(site.updated) || Number.isNaN(Date.parse(site.updated))) throw new Error('Use an ISO content update date.');
  for (const key of ['github', 'linkedin']) {
    if (site[key] && new URL(site[key]).protocol !== 'https:') throw new Error(`Invalid ${key} URL.`);
  }
  if (!education?.length || !projects?.length) throw new Error('Education and selected projects are required.');
  const projectIds = projects.map(project => project.id);
  if (new Set(projectIds).size !== projectIds.length) throw new Error('Project IDs must be unique.');
  const allowed = new Set(['Completed', 'In progress', 'Planned']);
  for (const project of projects) {
    if (!/^[a-z0-9-]+$/.test(project.id) || !allowed.has(project.status)) throw new Error('Projects need valid IDs and explicit status.');
    for (const key of ['name', 'area', 'description', 'detail']) {
      if (!project[key]?.trim()) throw new Error(`Project ${project.id} is missing ${key}.`);
    }
  }
}

export async function render() {
  const [raw, template, css, js] = await Promise.all([
    read('src/content.json'), read('src/template.html'), read('src/styles.css'), read('src/script.js')
  ]);
  const content = JSON.parse(raw);
  validateContent(content);
  const { site, hero, education, experience, projects, awards, toolkit } = content;
  const navigation = [['education', 'Education'], ['experience', 'Experience'], ['projects', 'Projects'], ['recognition', 'Recognition'], ['contact', 'Contact']];
  const coursework = record => record.coursework?.length ? `<div class="coursework"><h4>Coursework</h4><p class="coursework-note">Across the BAI degree programme.</p><div class="coursework-groups">${record.coursework.map(group => `<div><h5>${escape(group.category)}</h5><ul>${group.courses.map(course => `<li>${escape(course)}</li>`).join('')}</ul></div>`).join('')}</div></div>` : '';
  const educationalRecords = education.map(record => `<article class="education-record">
    <div class="record-top"><h3 class="record-title">${escape(record.institution)}</h3><span class="record-date">${escape(record.date)}</span></div>
    <p class="record-subtitle">${escape(record.qualification)}</p>
    ${record.location ? `<p class="record-meta">${record.status === 'Incoming exchange' ? `${escape(record.status)} · ` : ''}${escape(record.location)}</p>` : ''}
    <p class="record-note">${escape(record.note)}</p>
    ${coursework(record)}
  </article>`).join('\n');
  const certificates = education.filter(record => record.certificate).map(record => `<p class="certificate">Certification: ${escape(record.certificate)}</p>`).join('');
  const experienceRecord = `<div class="record-top"><h3 class="record-title">${escape(experience.organization)}</h3><span class="record-date">${escape(experience.date)}</span></div>
    <p class="record-meta">${escape(experience.role)} · ${escape(experience.location)} · ${escape(experience.status)}</p>
    <div class="contributions">${experience.contributions.map(item => `<details class="bank-case"><summary><h4>${escape(item.title)}</h4><span class="bank-description">${escape(item.description)}</span><span class="project-toggle" aria-hidden="true">${plus}</span></summary><div class="bank-case-details">${caseNotes(item)}</div></details>`).join('')}</div>`;
  const projectRecords = projects.map(project => `<details class="project" id="project-${escape(project.id)}">
    <summary>
      <h3>${escape(project.name)}</h3>
      <span class="project-description">${escape(project.description)}</span>
      <span class="project-meta">${escape(project.area)} · ${escape(project.status)}</span>
      <span class="project-toggle" aria-hidden="true">${plus}</span>
    </summary>
    <div class="project-details">${caseNotes(project, true)}</div>
  </details>`).join('\n');
  const structured = {
    '@context': 'https://schema.org', '@type': 'ProfilePage',
    '@id': `${site.url}/#profile`, url: `${site.url}/`, dateModified: site.updated,
    mainEntity: {
      '@type': 'Person', '@id': `${site.url}/#person`, name: site.fullName,
      alternateName: site.name, url: `${site.url}/`, email: `mailto:${site.email}`,
      description: 'Undergraduate student in Mathematical and Computing Sciences for Artificial Intelligence at Bocconi University.',
      affiliation: { '@type': 'CollegeOrUniversity', name: 'Bocconi University' },
      sameAs: [site.github, site.linkedin].filter(Boolean)
    }
  };
  const tokens = {
    NAME: escape(site.name), FULL_NAME: escape(site.fullName), TITLE: escape(site.title),
    DESCRIPTION: escape(site.description), URL: escape(site.url), LOCATION: escape(site.location),
    EMAIL: escape(site.email), GITHUB: escape(site.github), LINKEDIN: escape(site.linkedin), PROFILE: escape(site.profile),
    YEAR: site.updated.slice(0, 4), EDITION: escape(site.edition), CSS: css, JS: js,
    ICON_DOWN: down, ICON_UP: up, ICON_EXTERNAL: external,
    JSON_LD: JSON.stringify(structured).replace(/</g, '\\u003c'),
    NAVIGATION: navigation.map(([id, title]) => `<li><a href="#${id}">${title}</a></li>`).join(''),
    HERO_SUBTITLE: escape(hero.subtitle), HERO_INTRO: escape(hero.intro), HERO_CONTEXT: escape(hero.context),
    EDUCATION: educationalRecords + certificates, EXPERIENCE: experienceRecord, PROJECTS: projectRecords,
    AWARDS: awards.filter(award => award.featured !== false).map(award => `<li class="award"><span class="award-year">${escape(award.year)}</span><div><h3>${escape(award.title)}</h3><p>${escape(award.detail)}</p></div></li>`).join(''),
    TOOLKIT: toolkit.map(group => `<div><dt>${escape(group.label)}</dt><dd>${group.items.map(escape).join(' · ')}</dd></div>`).join('')
  };
  const html = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in tokens)) throw new Error(`Unknown template token ${key}.`);
    return tokens[key];
  });
  if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error('Unresolved template tokens.');
  return { html, css, js, site, structured };
}

async function build() {
  const { html, css, js, site, structured } = await render();
  const profilePath = path.join(root, 'public', site.profile.replace(/^\.\//, ''));
  if (!(await stat(profilePath)).isFile()) throw new Error('Missing profile PDF. See README.md.');
  const output = path.join(root, 'dist');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(path.join(root, 'public'), output, { recursive: true });
  await writeFile(path.join(output, 'index.html'), html);
  const notFound = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found — ${escape(site.name)}</title><style>${css}</style></head><body><main class="wrap hero"><p class="section-label">404 · Page not found</p><h1>Back to the beginning.</h1><p class="hero-context">The page you’re looking for isn’t here.</p><a class="text-link" href="/">Return to the portfolio ${up}</a></main></body></html>`;
  await writeFile(path.join(output, '404.html'), notFound);
  await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
  await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(site.url)}/</loc><lastmod>${site.updated}</lastmod></url></urlset>\n`);
  const hash = value => `'sha256-${createHash('sha256').update(value).digest('base64')}'`;
  const jsonLd = JSON.stringify(structured).replace(/</g, '\\u003c');
  await writeFile(path.join(output, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src ${hash(js)} ${hash(jsonLd)}; style-src ${hash(css)}; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'\n/assets/*\n  Cache-Control: public, max-age=86400\n`);
  console.log(`Built dist/index.html (${Buffer.byteLength(html).toLocaleString()} bytes). No runtime dependencies or network requests.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build().catch(error => { console.error(error.message); process.exitCode = 1; });
}
