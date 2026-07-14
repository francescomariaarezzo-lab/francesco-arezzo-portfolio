(() => {
  const fallbackData = {
    "meta": {
      "title": "Francesco Maria Arezzo | Academic Portfolio",
      "description": "Academic portfolio of Francesco Maria Arezzo, a Mathematics and Artificial Intelligence student interested in machine learning, statistics, optimization and reproducible technical work.",
      "url": ""
    },
    "person": {
      "name": "Francesco Maria Arezzo",
      "shortName": "FA",
      "role": "Mathematics & Artificial Intelligence Student",
      "location": "Bocconi University, Milan, Italy",
      "availability": "Open to research collaborations, analytical projects and internships",
      "email": "francescomariaarezzo@gmail.com",
      "linkedin": "https://www.linkedin.com/in/francesco-maria-arezzo",
      "website": "",
      "cv": "assets/files/Francesco_Maria_Arezzo_CV_OFFICIAL.pdf",
      "heroEyebrow": "Academic profile",
      "heroTitle": "",
      "heroSubtitle": "A focused portfolio of my studies, selected projects, achievements and current technical work.",
      "personalStatement": "I am a Mathematics and Artificial Intelligence student interested in rigorous reasoning, optimization, learning systems and the mathematical structures behind intelligent behaviour."
    },
    "metrics": [],
    "studies": [
      {
        "subtitle": "Mathematical foundations",
        "title": "Mathematics coursework",
        "description": "Linear algebra, mathematical analysis, probability, mathematical statistics, physics, decision theory and human behaviour, dynamical systems, complex analysis, differential geometry and convex optimization."
      },
      {
        "subtitle": "Computational foundations",
        "title": "Computing coursework",
        "description": "Algorithms and fundamentals of data structures, linear programming, convex programming and machine learning."
      }
    ],
    "interests": [
      "Artificial Intelligence",
      "Machine Learning",
      "Optimization",
      "Probability",
      "Statistics",
      "Decision Theory",
      "Mathematical Modelling",
      "Recent History",
      "Travel",
      "Hiking and Skiing"
    ],
    "achievements": [
      {
        "year": "2026-2027",
        "title": "IE University Madrid exchange",
        "detail": "Selected on the basis of academic performance to spend the second semester of the 2026-2027 academic year at IE University in Madrid, within the Artificial Intelligence faculty."
      },
      {
        "year": "2026",
        "title": "APS Bank Malta internship",
        "detail": "Selected for an internship at APS Bank in Malta, starting in July 2026, with exposure to a professional financial and analytical environment."
      },
      {
        "year": "2023",
        "title": "Regional Physics Games, second place",
        "detail": "Long-standing participant in the Physics Games, with second place at the Eastern Sicily regional level as my strongest result."
      }
    ],
    "nowNext": [
      {
        "label": "Building",
        "title": "Machine-learning model in progress",
        "detail": "I am currently developing a credit-default-risk prediction model. Once it is complete, I will add the notebook, results and full project file here."
      },
      {
        "label": "Experience",
        "title": "APS Bank internship in Malta",
        "detail": "Currently completing an internship at APS Bank in Malta, gaining exposure to a banking environment and analytical work connected with real institutional contexts."
      },
      {
        "label": "Next",
        "title": "IE University Madrid exchange",
        "detail": "During the second semester of the 2026-2027 academic year, I will study at IE University in Madrid within the Artificial Intelligence faculty, with a focus on deep learning, reinforcement learning and computer vision."
      }
    ],
    "projects": [],
    "contact": {
      "headline": "For collaborations, projects or research conversations, send me a note.",
      "body": "I am especially interested in mathematical modelling, machine learning, statistics, analytical projects and ambitious student research.",
      "primaryAction": "Write an email"
    }
  };
  const baseData = window.PORTFOLIO_DATA || fallbackData;
  const data = {
    ...baseData,
    meta: { ...(baseData.meta || {}) },
    person: { ...(baseData.person || {}) },
    projects: Array.isArray(window.PORTFOLIO_PROJECTS)
      ? window.PORTFOLIO_PROJECTS
      : (Array.isArray(baseData.projects) ? baseData.projects : [])
  };
  const state = { activeProject: 0, activeSection: 'about', projectRequest: 0 };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function getPath(obj, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }


  function isMissingHref(value) {
    if (!value) return true;
    const raw = String(value).trim();
    return raw === '' || raw === '#' || raw.toLowerCase().includes('your-domain.com') || raw.toLowerCase().includes('your-future-domain');
  }

  function normalizeHref(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.startsWith('mailto:') || raw.startsWith('#') || raw.startsWith('/') || raw.startsWith('./') || raw.startsWith('../')) return raw;
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return raw;
    if (raw.startsWith('www.')) return `https://${raw}`;
    return raw;
  }

  function updateBindings() {
    if (data.meta?.title) document.title = data.meta.title;
    const description = $('meta[name="description"]');
    if (description && data.meta?.description) description.setAttribute('content', data.meta.description);
    if (!isMissingHref(data.meta?.url)) {
      const absoluteUrl = normalizeHref(data.meta.url);
      const canonical = $('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', absoluteUrl);
      const ogUrl = $('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', absoluteUrl);
    }
    $$('[data-field]').forEach((element) => {
      const value = getPath(data, element.dataset.field);
      if (value !== undefined && value !== null) element.textContent = value;
    });
    $$('[data-href]').forEach((element) => {
      const value = getPath(data, element.dataset.href);
      if (isMissingHref(value)) {
        element.setAttribute('href', '#');
        element.setAttribute('aria-disabled', 'true');
        element.setAttribute('title', 'This link will be activated after the file or URL is added.');
        element.addEventListener('click', (event) => event.preventDefault(), { once: true });
      } else {
        element.setAttribute('href', normalizeHref(value));
        element.removeAttribute('aria-disabled');
        element.removeAttribute('title');
      }
    });
    const emailLinks = $$('[data-email-link]');
    emailLinks.forEach((link) => {
      if (data.person?.email) {
        const subject = encodeURIComponent('Portfolio contact');
        link.setAttribute('href', `mailto:${data.person.email}?subject=${subject}`);
      }
    });
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  function renderMetrics() {
    const target = $('[data-render="metrics"]');
    if (!target) return;
    target.innerHTML = (data.metrics || []).map((item) => `
      <article class="metric-card reveal">
        <strong>${escapeHtml(item.value)}</strong>
        <span>${escapeHtml(item.label)}</span>
      </article>
    `).join('');
  }

  function renderStudies() {
    const target = $('[data-render="studies"]');
    if (!target) return;
    const studies = (data.studies || []).slice(0, 2);
    target.innerHTML = studies.map((item, index) => `
      <article class="study-card reveal">
        <span class="card-number">${String(index + 1).padStart(2, '0')}</span>
        <div>
          ${item.subtitle ? `<p class="subtitle">${escapeHtml(item.subtitle)}</p>` : ''}
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </div>
      </article>
    `).join('');
  }

  function renderInterests() {
    const target = $('[data-render="interests"]');
    if (!target) return;
    const interests = [...(data.interests || []), ...(data.interests || [])];
    target.innerHTML = interests.map((item) => `<span class="interest-pill">${escapeHtml(item)}</span>`).join('');
  }

  function renderAchievements() {
    const target = $('[data-render="achievements"]');
    if (!target) return;
    target.innerHTML = (data.achievements || []).map((item) => `
      <article class="timeline-item reveal">
        <div class="timeline-year">${escapeHtml(item.year)}</div>
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.detail)}</p>
        </div>
      </article>
    `).join('');
  }

  function renderNowNext() {
    const target = $('[data-render="nowNext"]');
    if (!target) return;
    target.innerHTML = (data.nowNext || []).map((item) => `
      <article class="now-card reveal">
        <span class="now-label">${escapeHtml(item.label)}</span>
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.detail)}</p>
        </div>
      </article>
    `).join('');
  }

  function renderProjectSelectors() {
    const target = $('[data-render="projectSelectors"]');
    if (!target) return;
    target.innerHTML = (data.projects || []).map((project, index) => `
      <button class="project-selector ${index === state.activeProject ? 'active' : ''}" type="button" data-project-index="${index}" aria-pressed="${index === state.activeProject}">
        <span class="project-kicker">${escapeHtml(project.status || project.fileType || 'Project')} / ${escapeHtml(project.year || '')}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.summary)}</p>
      </button>
    `).join('');
    $$('.project-selector', target).forEach((button) => {
      button.addEventListener('click', () => selectProject(Number(button.dataset.projectIndex)));
    });
  }

  async function selectProject(index) {
    const project = (data.projects || [])[index];
    if (!project) return;
    state.activeProject = index;
    const requestId = state.projectRequest + 1;
    state.projectRequest = requestId;
    $$('.project-selector').forEach((button) => {
      const active = Number(button.dataset.projectIndex) === index;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    const title = $('#fileTitle');
    const subtitle = $('#fileSubtitle');
    if (title) title.textContent = project.title;
    if (subtitle) subtitle.textContent = `${project.fileType || 'file'} - ${fileNameFromPath(project.file) || 'embedded preview'}`;
    renderProjectExplanation(project);
    await renderProjectFile(project, requestId);
  }

  function renderProjectExplanation(project) {
    const target = $('#projectExplanation');
    if (!target) return;
    target.innerHTML = `
      <div>
        <p class="project-explainer-lead">${escapeHtml(project.explanationHeadline || project.title)}</p>
        <p>${escapeHtml(project.summary || '')}</p>
        <div class="explain-section">
          <span class="explain-label">Scope</span>
          <p>${escapeHtml(project.context || '')}</p>
        </div>
        <div class="explain-section">
          <span class="explain-label">Focus</span>
          <p>${escapeHtml(project.whatToNotice || '')}</p>
        </div>
        <div class="explain-section">
          <span class="explain-label">Result</span>
          <p>${escapeHtml(project.outcome || '')}</p>
        </div>
      </div>
      ${(project.tags || []).length ? `<div class="tag-row">${(project.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
    `;
  }

  async function renderProjectFile(project, requestId = state.projectRequest) {
    const preview = $('#filePreview');
    if (!preview) return;
    const type = String(project.fileType || '').toLowerCase();
    preview.dataset.view = type || 'file';
    preview.innerHTML = `<div class="preview-loading">Preparing a readable preview...</div>`;

    if (type === 'pdf' || String(project.file || '').toLowerCase().endsWith('.pdf')) {
      renderPdf(project);
      return;
    }

    if (type === 'jupyter' || type === 'ipynb' || String(project.file || '').toLowerCase().endsWith('.ipynb')) {
      let notebook = project.notebookFallback || null;
      if (project.file && window.location.protocol !== 'file:') {
        try {
          const text = await readTextFile(project.file);
          notebook = JSON.parse(text);
        } catch (error) {
          // Embedded fallback keeps the preview working on local files and restrictive hosts.
        }
      }
      if (requestId !== state.projectRequest) return;
      if (!notebook) {
        preview.innerHTML = renderUnavailable(project, 'The notebook could not be loaded here. Use the buttons below to open or download the original file.');
        return;
      }
      renderNotebook(notebook, project);
      return;
    }

    let code = project.codeFallback || '';
    if (project.file && window.location.protocol !== 'file:') {
      try {
        const fetched = await readTextFile(project.file);
        if (fetched) code = fetched;
      } catch (error) {
        // Keep the embedded fallback if fetch is not available.
      }
    }
    if (requestId !== state.projectRequest) return;
    if (!code) code = `Could not load ${project.file || 'this file'}. Open or download the original file instead.`;
    renderCode(code, 'python', project);
  }

  async function readTextFile(path) {
    if (!path) throw new Error('Missing file path');
    const response = await fetch(toResourceUrl(path), { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }

  function toResourceUrl(path) {
    const raw = String(path || '').trim();
    if (!raw) return '';
    if (/^(https?:|file:|data:|blob:|mailto:)/i.test(raw) || raw.startsWith('#')) return raw;
    const [withoutHash, hash = ''] = raw.split('#');
    const [pathname, query = ''] = withoutHash.split('?');
    const encodedPath = pathname.split('/').map((part) => encodeURIComponent(part)).join('/');
    return `${encodedPath}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
  }

  function fileNameFromPath(path) {
    const raw = String(path || '').split('#')[0].split('?')[0];
    const parts = raw.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : '';
  }

  const embeddedFileUrls = new Map();

  function getEmbeddedFile(project) {
    if (!project) return null;
    const embedded = project.embeddedFile;
    if (embedded && (embedded.base64 || embedded.text)) return embedded;

    const type = String(project.fileType || '').toLowerCase();
    const fallbackName = fileNameFromPath(project.file) || `${slugify(project.title || 'project') || 'project'}.${type === 'jupyter' || type === 'ipynb' ? 'ipynb' : 'txt'}`;

    if (project.notebookFallback) {
      return {
        fileName: fallbackName.endsWith('.ipynb') ? fallbackName : `${fallbackName}.ipynb`,
        mime: 'application/x-ipynb+json;charset=utf-8',
        text: JSON.stringify(project.notebookFallback, null, 2),
      };
    }

    if (project.codeFallback) {
      return {
        fileName: fallbackName.endsWith('.py') ? fallbackName : `${fallbackName}.py`,
        mime: 'text/x-python;charset=utf-8',
        text: String(project.codeFallback),
      };
    }

    return null;
  }

  function getEmbeddedFileUrl(project) {
    const embedded = getEmbeddedFile(project);
    if (!embedded) return '';
    const key = `${project.title || 'project'}::${embedded.fileName || project.file || 'embedded-file'}`;
    if (embeddedFileUrls.has(key)) return embeddedFileUrls.get(key);

    let blob;
    if (embedded.base64) {
      const base64 = String(embedded.base64 || '');
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      blob = new Blob([bytes], { type: embedded.mime || 'application/octet-stream' });
    } else {
      blob = new Blob([String(embedded.text || '')], { type: embedded.mime || 'text/plain;charset=utf-8' });
    }

    const url = URL.createObjectURL(blob);
    embeddedFileUrls.set(key, url);
    return url;
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function renderFileActions(project, openLabel = 'Open original') {
    const embedded = getEmbeddedFile(project);
    const src = toResourceUrl(project.file || '');
    if (!src && !embedded) return '';
    const fileName = (embedded && embedded.fileName) || fileNameFromPath(project.file);
    const type = String(project.fileType || 'file').toUpperCase();
    const projectIndex = (data.projects || []).indexOf(project);
    const actionAttrs = embedded && projectIndex >= 0 ? ` data-project-index="${projectIndex}"` : '';
    return `
      <div class="file-toolbar" aria-label="File actions">
        <span class="status-pill">${escapeHtml(type)}</span>
        <div class="file-toolbar-actions">
          <a class="small-button" href="${escapeHtml(src || '#')}" target="_blank" rel="noreferrer" data-file-action="open"${actionAttrs}>${escapeHtml(openLabel)}</a>
          <a class="small-button" href="${escapeHtml(src || '#')}" download="${escapeHtml(fileName)}" data-file-action="download"${actionAttrs}>Download</a>
        </div>
      </div>
    `;
  }

  function initFileActions() {
    document.addEventListener('click', (event) => {
      const action = event.target.closest('[data-file-action]');
      if (!action) return;
      const index = Number(action.dataset.projectIndex);
      const project = Number.isInteger(index) ? (data.projects || [])[index] : null;
      const embedded = getEmbeddedFile(project);
      if (!embedded) return;

      const url = getEmbeddedFileUrl(project);
      if (!url) return;
      event.preventDefault();

      const fileName = embedded.fileName || fileNameFromPath(project.file) || 'download';
      if (action.dataset.fileAction === 'download') {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        return;
      }

      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (!opened) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.target = '_blank';
        anchor.rel = 'noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      }
    });
  }

  function renderUnavailable(project, message) {
    return `
      ${renderFileActions(project)}
      <div class="preview-message">
        <strong>Preview unavailable</strong>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
  }

  function renderPdf(project) {
    const preview = $('#filePreview');
    if (!preview) return;
    const images = Array.isArray(project.pdfPreviewImages) ? project.pdfPreviewImages : [];
    if (images.length) {
      preview.innerHTML = `
        ${renderFileActions(project, 'Open original PDF')}
        <div class="pdf-status">
          <strong>Static PDF preview</strong>
          <span>${images.length} page${images.length === 1 ? '' : 's'} rendered as images for reliable local viewing.</span>
        </div>
        <div class="pdf-pages" aria-label="PDF page preview">
          ${images.map((image, index) => `
            <figure class="pdf-page">
              <div class="pdf-image-shell">
                <img src="${escapeHtml(toResourceUrl(image))}" alt="${escapeHtml(`${project.title || 'PDF'} - page ${index + 1}`)}" loading="lazy" decoding="async">
                <div class="pdf-image-fallback">
                  <strong>Page image could not be loaded</strong>
                  <span>Open or download the original PDF with the buttons above.</span>
                </div>
              </div>
              <figcaption>Page ${index + 1} of ${images.length}</figcaption>
            </figure>
          `).join('')}
        </div>
      `;
      preview.querySelectorAll('.pdf-page img').forEach((image) => {
        image.addEventListener('error', () => {
          const page = image.closest('.pdf-page');
          if (page) page.classList.add('image-error');
        });
      });
      preview.scrollTop = 0;
      return;
    }

    const src = toResourceUrl(project.file || '');
    if (!src) {
      preview.innerHTML = renderUnavailable(project, 'No PDF path has been configured for this project.');
      return;
    }
    preview.innerHTML = `
      ${renderFileActions(project, 'Open original PDF')}
      <object class="pdf-frame" data="${escapeHtml(src)}#toolbar=0&navpanes=0&view=FitH" type="application/pdf">
        <div class="preview-message">
          <strong>PDF viewer blocked</strong>
          <p>Your browser blocked the embedded PDF viewer. Open or download the original PDF with the buttons above.</p>
        </div>
      </object>
    `;
    preview.scrollTop = 0;
  }

  function renderNotebook(notebook, project) {
    const preview = $('#filePreview');
    if (!preview) return;
    const cells = Array.isArray(notebook?.cells) ? notebook.cells : [];
    const outputCount = cells.reduce((total, cell) => total + (Array.isArray(cell.outputs) ? cell.outputs.length : 0), 0);
    const plotCount = cells.reduce((total, cell) => {
      const source = Array.isArray(cell.source) ? cell.source.join('') : String(cell.source || '');
      return total + extractPlotSummaries(source).length;
    }, 0);
    const bannerText = outputCount
      ? `${outputCount} embedded output${outputCount === 1 ? '' : 's'} detected and rendered below.`
      : plotCount
        ? 'The uploaded notebook has its outputs cleared; plot-producing cells are marked so the preview remains readable.'
        : 'Source-only notebook preview.';

    preview.innerHTML = `
      ${renderFileActions(project, 'Open notebook')}
      <div class="notebook">
        <div class="notebook-banner">
          <strong>Notebook preview</strong>
          <span>${escapeHtml(bannerText)}</span>
        </div>
        ${cells.map((cell, index) => renderNotebookCell(cell, index)).join('')}
      </div>
    `;
    preview.scrollTop = 0;
  }

  function renderNotebookCell(cell, index) {
    const type = cell.cell_type || 'cell';
    const source = Array.isArray(cell.source) ? cell.source.join('') : String(cell.source || '');
    if (type === 'markdown') {
      return `
        <article class="notebook-cell markdown-cell">
          <div class="cell-head"><span>Markdown</span><span>Cell ${index + 1}</span></div>
          <div class="cell-markdown">${renderMarkdownLite(source)}</div>
        </article>
      `;
    }
    const execution = cell.execution_count ?? index + 1;
    const outputs = renderNotebookOutputs(cell, source);
    return `
      <article class="notebook-cell code-cell">
        <div class="cell-head"><span>Code</span><span>In [${escapeHtml(execution)}]</span></div>
        <pre class="code-block notebook-code"><code>${renderCodeLines(source, 'python')}</code></pre>
        ${outputs}
      </article>
    `;
  }

  function renderNotebookOutputs(cell, source) {
    const outputs = Array.isArray(cell.outputs) ? cell.outputs : [];
    const rendered = outputs.map((output, outputIndex) => renderNotebookOutput(output, outputIndex)).filter(Boolean).join('');
    if (rendered) return `<div class="notebook-outputs">${rendered}</div>`;

    const plotSummaries = extractPlotSummaries(source);
    const mentionsDisplay = /\bdisplay\s*\(/.test(source);
    if (!plotSummaries.length && !mentionsDisplay) return '';

    const plotCards = plotSummaries.length
      ? `<div class="plot-summary-grid">${plotSummaries.map(renderPlotSummaryCard).join('')}</div>`
      : '';
    const detail = plotSummaries.length
      ? 'This cell creates plots, but the uploaded .ipynb file does not contain saved image outputs. Open or run the notebook to regenerate the exact figures.'
      : 'This cell displays a table or value, but the uploaded .ipynb file does not contain saved output for it.';
    return `
      <div class="notebook-outputs output-placeholder">
        <div class="output-note">
          <strong>Output not embedded in the notebook file</strong>
          <span>${escapeHtml(detail)}</span>
        </div>
        ${plotCards}
      </div>
    `;
  }

  function renderNotebookOutput(output, outputIndex) {
    if (!output) return '';
    if (output.output_type === 'stream') {
      const text = normalizeNotebookMime(output.text);
      if (!text.trim()) return '';
      return `<pre class="notebook-output-text stream-output"><code>${escapeHtml(text)}</code></pre>`;
    }
    if (output.output_type === 'error') {
      const traceback = Array.isArray(output.traceback) && output.traceback.length
        ? output.traceback.join('\n')
        : `${output.ename || 'Error'}: ${output.evalue || ''}`;
      return `<pre class="notebook-output-text error-output"><code>${escapeHtml(stripAnsi(traceback))}</code></pre>`;
    }

    const data = output.data || {};
    const image = renderNotebookImageOutput(data, outputIndex);
    if (image) return image;

    if (data['text/html']) {
      return `<div class="notebook-html-output">${sanitizeNotebookHtml(normalizeNotebookMime(data['text/html']))}</div>`;
    }
    if (data['text/markdown']) {
      return `<div class="cell-markdown notebook-markdown-output">${renderMarkdownLite(normalizeNotebookMime(data['text/markdown']))}</div>`;
    }
    if (data['text/plain']) {
      const text = normalizeNotebookMime(data['text/plain']);
      if (text.trim()) return `<pre class="notebook-output-text"><code>${escapeHtml(text)}</code></pre>`;
    }
    return '';
  }

  function renderNotebookImageOutput(data, outputIndex) {
    if (data['image/png']) {
      const payload = normalizeNotebookMime(data['image/png']).replace(/\s+/g, '');
      if (payload) {
        return `<figure class="notebook-output-figure"><img src="data:image/png;base64,${payload}" alt="Notebook output image ${outputIndex + 1}" loading="lazy" decoding="async"></figure>`;
      }
    }
    if (data['image/jpeg']) {
      const payload = normalizeNotebookMime(data['image/jpeg']).replace(/\s+/g, '');
      if (payload) {
        return `<figure class="notebook-output-figure"><img src="data:image/jpeg;base64,${payload}" alt="Notebook output image ${outputIndex + 1}" loading="lazy" decoding="async"></figure>`;
      }
    }
    if (data['image/svg+xml']) {
      const svg = normalizeNotebookMime(data['image/svg+xml']);
      if (svg.trim()) {
        const src = svg.trim().startsWith('data:') ? svg.trim() : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        return `<figure class="notebook-output-figure"><img src="${escapeHtml(src)}" alt="Notebook output image ${outputIndex + 1}" loading="lazy" decoding="async"></figure>`;
      }
    }
    return '';
  }

  function normalizeNotebookMime(value) {
    if (Array.isArray(value)) return value.join('');
    if (value === null || value === undefined) return '';
    return String(value);
  }

  function stripAnsi(value) {
    return String(value || '').replace(/\u001b\[[0-9;]*m/g, '');
  }

  function sanitizeNotebookHtml(html) {
    return String(html || '')
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, '')
      .replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, '')
      .replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, '')
      .replace(/javascript:/gi, '');
  }

  function extractPlotSummaries(source) {
    const text = String(source || '');
    if (!/(plt\.|\.plot\(|\.scatter\(|\.bar\(|\.barh\(|\.boxplot\(|sns\.)/.test(text)) return [];
    const chunks = text.split(/plt\.show\s*\(\s*\)/g).filter((chunk) => /(plt\.|ax\.|\.plot\(|\.scatter\(|\.bar\(|\.barh\(|\.boxplot\()/.test(chunk));
    const summaries = [];
    chunks.forEach((chunk, index) => {
      const titleMatch = chunk.match(/(?:set_title|title)\s*\(\s*["'`]([^"'`]+)["'`]/);
      const xMatch = chunk.match(/(?:set_xlabel|xlabel)\s*\(\s*["'`]([^"'`]+)["'`]/);
      const yMatch = chunk.match(/(?:set_ylabel|ylabel)\s*\(\s*["'`]([^"'`]+)["'`]/);
      const kind = inferPlotKind(chunk);
      summaries.push({
        title: titleMatch ? titleMatch[1] : `Generated visualization ${index + 1}`,
        kind,
        xLabel: xMatch ? xMatch[1] : '',
        yLabel: yMatch ? yMatch[1] : '',
      });
    });
    return summaries.slice(0, 8);
  }

  function inferPlotKind(chunk) {
    if (/\.scatter\s*\(|plt\.scatter\s*\(/.test(chunk)) return 'scatter plot';
    if (/\.boxplot\s*\(|plt\.boxplot\s*\(/.test(chunk)) return 'box plot';
    if (/\.barh\s*\(/.test(chunk)) return 'horizontal bar chart';
    if (/\.bar\s*\(|plt\.bar\s*\(/.test(chunk)) return 'bar chart';
    if (/\.plot\s*\(|plt\.plot\s*\(/.test(chunk)) return 'line plot';
    return 'plot';
  }

  function renderPlotSummaryCard(summary, index) {
    const kindClass = summary.kind.includes('scatter') ? 'scatter' : summary.kind.includes('box') ? 'box' : summary.kind.includes('bar') ? 'bar' : 'line';
    const axes = [summary.xLabel, summary.yLabel].filter(Boolean).join(' / ');
    return `
      <div class="plot-summary-card">
        <div class="plot-miniature plot-miniature-${kindClass}" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div>
          <strong>${escapeHtml(summary.title || `Plot ${index + 1}`)}</strong>
          <span>${escapeHtml(summary.kind)}${axes ? ` - ${escapeHtml(axes)}` : ''}</span>
        </div>
      </div>
    `;
  }

  function renderMarkdownLite(source) {
    const lines = String(source || '').replace(/\r\n/g, '\n').split('\n');
    const blocks = [];
    let paragraph = [];
    let listItems = [];

    const flushParagraph = () => {
      if (!paragraph.length) return;
      blocks.push(`<p>${formatInlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    };
    const flushList = () => {
      if (!listItems.length) return;
      blocks.push(`<ul>${listItems.map((item) => `<li>${formatInlineMarkdown(item)}</li>`).join('')}</ul>`);
      listItems = [];
    };

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) {
        flushParagraph();
        flushList();
        return;
      }
      const heading = line.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        const level = Math.min(heading[1].length + 2, 4);
        blocks.push(`<h${level}>${formatInlineMarkdown(heading[2])}</h${level}>`);
        return;
      }
      const bullet = line.match(/^[-*]\s+(.+)$/);
      if (bullet) {
        flushParagraph();
        listItems.push(bullet[1]);
        return;
      }
      flushList();
      paragraph.push(line);
    });

    flushParagraph();
    flushList();
    return blocks.join('');
  }

  function formatInlineMarkdown(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\b_([^_]+)_\b/g, '<em>$1</em>');
  }

  function renderCode(code, language, project) {
    const preview = $('#filePreview');
    if (!preview) return;
    preview.innerHTML = `${renderFileActions(project, 'Open source')}<pre class="code-block"><code>${renderCodeLines(code, language)}</code></pre>`;
    preview.scrollTop = 0;
  }

  function renderCodeLines(code, language) {
    return String(code || '').replace(/\r\n/g, '\n').split('\n').map((line, index) => `<span class="code-line"><span class="line-number">${index + 1}</span><span class="code-text">${highlightLine(line, language) || '&nbsp;'}</span></span>`).join('');
  }

  function highlightLine(line, language) {
    if (language === 'python') return highlightPython(line);
    return escapeHtml(line);
  }

  function highlightPython(line) {
    const keywords = new Set(['False','None','True','and','as','assert','async','await','break','class','continue','def','del','elif','else','except','finally','for','from','global','if','import','in','is','lambda','nonlocal','not','or','pass','raise','return','try','while','with','yield']);
    let out = '';
    let i = 0;
    while (i < line.length) {
      const char = line[i];
      if (char === '#') { out += span('token-comment', line.slice(i)); break; }
      if (char === '"' || char === "'") {
        const quote = char;
        let j = i + 1;
        while (j < line.length) {
          if (line[j] === '\\') { j += 2; continue; }
          if (line[j] === quote) { j += 1; break; }
          j += 1;
        }
        out += span('token-string', line.slice(i, j));
        i = j;
        continue;
      }
      if (/\d/.test(char)) {
        const match = line.slice(i).match(/^\d+(\.\d+)?/);
        if (match) { out += span('token-number', match[0]); i += match[0].length; continue; }
      }
      if (/[A-Za-z_]/.test(char)) {
        const match = line.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/);
        const word = match[0];
        out += keywords.has(word) ? span('token-keyword', word) : escapeHtml(word);
        i += word.length;
        continue;
      }
      out += escapeHtml(char);
      i += 1;
    }
    return out;
  }

  function span(className, text) {
    return `<span class="${className}">${escapeHtml(text)}</span>`;
  }

  function initMobileNav() {
    const button = $('#mobileMenuButton');
    const menu = $('#mobileMenu');
    if (!button || !menu) return;
    button.addEventListener('click', () => {
      const open = menu.hasAttribute('hidden');
      menu.toggleAttribute('hidden', !open);
      document.body.classList.toggle('nav-open', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('#mobileMenu a').forEach((link) => link.addEventListener('click', () => {
      menu.setAttribute('hidden', '');
      document.body.classList.remove('nav-open');
      button.setAttribute('aria-expanded', 'false');
    }));
  }

  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.14 });
    $$('.reveal').forEach((element) => observer.observe(element));
  }

  function initSectionObserver() {
    const links = $$('.nav-links a, #mobileMenu a');
    const sections = $$('main section[id]');
    if (!sections.length) return;

    const setActive = (id) => {
      if (!id) return;
      const changed = state.activeSection !== id;
      state.activeSection = id;
      document.body.dataset.section = id;
      links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
      if (changed && window.constellationController) window.constellationController.setSection(id);
    };

    const readActiveSection = () => {
      const probe = Math.min(window.innerHeight * 0.42, 430);
      let active = sections[0];

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) {
          active = section;
          break;
        }
        if (rect.top <= probe) active = section;
      }

      setActive(active.id);
    };

    let ticking = false;
    const scheduleRead = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        readActiveSection();
      });
    };

    links.forEach((link) => {
      link.addEventListener('click', () => {
        const id = link.getAttribute('href')?.replace('#', '');
        if (id) setActive(id);
        window.setTimeout(readActiveSection, 520);
      });
    });

    readActiveSection();
    window.addEventListener('scroll', scheduleRead, { passive: true });
    window.addEventListener('resize', scheduleRead);
  }

  function initFormulaLayer() {
    const layer = $('#formulaLayer');
    if (!layer) return;
    const formulas = [
      '∇<sub>θ</sub> 𝓛(θ)',
      'P(y ∣ x, θ)',
      'A<sup>⊤</sup>A x = A<sup>⊤</sup>b',
      'arg min<sub>θ</sub> 𝔼[𝓛(θ)]',
      'softmax(QK<sup>⊤</sup>/√d)',
      'σ(Wx + b)',
      '𝔼[X ∣ 𝓕<sub>t</sub>]',
      '‖Ax − b‖<sub>2</sub>',
      'p(θ ∣ D) ∝ p(D ∣ θ)p(θ)',
      'λ<sub>max</sub>(H)'
    ];
    const positions = [[5,13],[66,15],[18,35],[75,40],[7,67],[57,69],[84,78],[32,83],[43,24],[70,56]];
    layer.innerHTML = formulas.map((formula, index) => `<span class="formula-chip ${index % 3 === 0 ? 'strong' : index % 3 === 1 ? 'soft' : ''}" style="left:${positions[index][0]}%;top:${positions[index][1]}%">${formula}</span>`).join('');
    const chips = $$('.formula-chip', layer);
    const onScroll = () => {
      const y = window.scrollY || 0;
      chips.forEach((chip, index) => {
        const speed = 0.018 + (index % 4) * 0.011;
        const drift = Math.sin((y * 0.003) + index) * 10;
        chip.style.transform = `translate3d(${drift}px, ${-y * speed}px, 0)`;
        chip.style.opacity = String(0.55 + Math.sin((y * 0.002) + index) * 0.18);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initConstellation() {
    const canvas = $('#constellation');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let active = 'about';
    const count = 92;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random(), y: Math.random(), tx: Math.random(), ty: Math.random(), phase: Math.random() * 6.28, r: 1.2 + (i % 5) * 0.25
    }));

    const patterns = {
      about: makeIntroPattern(count),
      study: makeGridPattern(count),
      achievements: makeCurvePattern(count),
      now: makeClusterPattern(count),
      projects: makePanelsPattern(count),
      contact: makeRingPattern(count)
    };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setTargets(active);
    }

    function setTargets(name) {
      active = patterns[name] ? name : 'about';
      const target = patterns[active];
      particles.forEach((p, i) => {
        p.tx = target[i % target.length][0];
        p.ty = target[i % target.length][1];
      });
    }

    function animate(time) {
      ctx.clearRect(0, 0, width, height);
      const offsetY = Math.sin(time * 0.00018) * 8;
      particles.forEach((p) => {
        p.x += (p.tx - p.x) * 0.035;
        p.y += (p.ty - p.y) * 0.035;
      });
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 112) {
            const alpha = (1 - dist / 112) * 0.115;
            ctx.strokeStyle = `rgba(169, 196, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height + offsetY);
            ctx.lineTo(b.x * width, b.y * height + offsetY);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p, i) => {
        const pulse = Math.sin(time * 0.001 + p.phase) * 0.32;
        ctx.fillStyle = i % 6 === 0 ? 'rgba(93, 216, 199, 0.48)' : 'rgba(247, 242, 232, 0.28)';
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height + offsetY, Math.max(0.8, p.r + pulse), 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }

    function makeIntroPattern(n) {
      const pts = [];
      const layerXs = [0.18, 0.32, 0.47, 0.63, 0.80];
      layerXs.forEach((x, layer) => {
        const rows = [3, 5, 6, 5, 3][layer];
        for (let i = 0; i < rows; i += 1) {
          const center = 0.49 + Math.sin(layer * 0.9) * 0.035;
          const spread = 0.30 + layer * 0.012;
          pts.push([x, center - spread / 2 + i * (spread / Math.max(rows - 1, 1))]);
        }
      });
      for (let i = 0; i < 34; i += 1) {
        const t = i / 33;
        pts.push([0.12 + 0.76 * t, 0.25 + 0.16 * Math.sin(t * Math.PI * 1.25) + 0.20 * t]);
      }
      for (let i = 0; i < 28; i += 1) {
        const t = i / 27;
        pts.push([0.20 + 0.65 * t, 0.72 - 0.14 * Math.sin(t * Math.PI) - 0.08 * t]);
      }
      return fillWithJitter(pts, n, 0.014);
    }
    function makeGridPattern(n) {
      const pts = [];
      for (let y = 0; y < 7; y += 1) for (let x = 0; x < 11; x += 1) pts.push([0.16 + x * 0.07, 0.19 + y * 0.085]);
      return fillWithJitter(pts, n, 0.018);
    }
    function makeCurvePattern(n) {
      const pts = [];
      for (let i = 0; i < n; i += 1) {
        const t = i / (n - 1);
        pts.push([0.13 + 0.76 * t, 0.68 - 0.38 * Math.pow(t, 0.72) + Math.sin(t * Math.PI * 3) * 0.025]);
      }
      return pts;
    }
    function makeClusterPattern(n) {
      const centers = [[0.25,0.30],[0.49,0.28],[0.72,0.33],[0.35,0.62],[0.62,0.64]];
      return Array.from({ length: n }, (_, i) => {
        const c = centers[i % centers.length];
        const angle = (i * 2.399) % (Math.PI * 2);
        const radius = 0.025 + ((i % 9) * 0.007);
        return [c[0] + Math.cos(angle) * radius, c[1] + Math.sin(angle) * radius];
      });
    }
    function makePanelsPattern(n) {
      const pts = [];
      for (let i = 0; i < 42; i += 1) pts.push([0.12 + (i % 7) * 0.045, 0.24 + Math.floor(i / 7) * 0.07]);
      for (let i = 0; i < 50; i += 1) pts.push([0.56 + (i % 10) * 0.035, 0.22 + Math.floor(i / 10) * 0.075]);
      return fillWithJitter(pts, n, 0.008);
    }
    function makeRingPattern(n) {
      return Array.from({ length: n }, (_, i) => {
        const t = (i / n) * Math.PI * 2;
        const r = 0.22 + (i % 5) * 0.006;
        return [0.62 + Math.cos(t) * r, 0.48 + Math.sin(t) * r];
      });
    }
    function fillWithJitter(points, n, jitter) {
      const out = [];
      for (let i = 0; i < n; i += 1) {
        const p = points[i % points.length];
        out.push([p[0] + (Math.random() - 0.5) * jitter, p[1] + (Math.random() - 0.5) * jitter]);
      }
      return out;
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(animate);
    window.constellationController = { setSection: setTargets };
  }

  function boot() {
    updateBindings();
    renderMetrics();
    renderStudies();
    renderInterests();
    renderAchievements();
    renderNowNext();
    renderProjectSelectors();
    selectProject(0);
    initMobileNav();
    initFileActions();
    initFormulaLayer();
    initConstellation();
    initReveal();
    initSectionObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
