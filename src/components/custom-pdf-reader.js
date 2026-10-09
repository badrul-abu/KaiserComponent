import { LitElement, html, css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';

const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js';

let pdfjsPromise;
function loadPdfJs(scriptUrl, workerUrl) {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc ||= workerUrl;
    return Promise.resolve(window.pdfjsLib);
  }
  pdfjsPromise ||= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      resolve(window.pdfjsLib);
    };
    script.onerror = () => {
      pdfjsPromise = undefined;
      reject(new Error('Unable to load PDF.js'));
    };
    document.head.append(script);
  });
  return pdfjsPromise;
}

@customElement('custom-pdf-reader')
export class CustomPdfReader extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 100%;
    }
    .viewer {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      border: 1px solid #cbd5e1;
      background: #f1f5f9;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 5px;
      min-height: 42px;
      padding: 5px 8px;
      box-sizing: border-box;
      background: #1f2937;
      color: #fff;
      font: 13px sans-serif;
    }
    .toolbar a {
      color: #fff;
      margin-left: auto;
    }
    .toolbar button[aria-pressed='true'] {
      background: #2563eb;
      color: #fff;
    }
    .body {
      display: flex;
      flex: 1;
      min-height: 0;
    }
    .panel {
      flex: 0 0 150px;
      max-width: 45%;
      overflow: auto;
      padding: 8px;
      background: #fff;
      border-right: 1px solid #cbd5e1;
      font: 13px sans-serif;
    }
    .panel[hidden] {
      display: none;
    }
    .thumb {
      display: flex;
      width: 100%;
      min-height: 160px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 4px;
      border: 2px solid transparent;
      background: transparent;
      cursor: pointer;
    }
    .thumb[aria-current='page'] {
      border-color: #2563eb;
    }
    .thumb canvas {
      max-width: 100px;
      max-height: 132px;
      background: #fff;
      box-shadow: 0 1px 4px #0003;
    }
    .page-area {
      flex: 1;
      min-width: 0;
      min-height: 0;
      overflow: auto;
      padding: 12px;
      text-align: center;
    }
    .pages {
      display: flex;
      width: max-content;
      min-width: 100%;
      align-items: flex-start;
      justify-content: center;
      gap: 12px;
    }
    .pages.continuous {
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    .pages canvas {
      flex: 0 0 auto;
      max-width: none;
      background: #fff;
      box-shadow: 0 1px 4px #0003;
    }
  `;

  static properties = {
    pdfUrl: { type: String, attribute: 'pdf-url' },
    width: { type: String },
    height: { type: String },
    pdfjsVersion: { type: String, attribute: 'pdfjs-version' },
    pdfjsUrl: { type: String, attribute: 'pdfjs-url' },
    pdfjsWorkerUrl: { type: String, attribute: 'pdfjs-worker-url' },
    continuous: { type: Boolean },
    _status: { state: true },
    _pageNumber: { state: true },
    _numPages: { state: true },
    _scale: { state: true },
    _fitMode: { state: true },
    _rotation: { state: true },
    _layout: { state: true },
    _panelOpen: { state: true },
  };

  constructor() {
    super();

    this.pdfUrl = '';
    this.width = '600px';
    this.height = '849px';
    this.pdfjsVersion = '3.11.174';
    this.pdfjsUrl = '';
    this.pdfjsWorkerUrl = '';
    this.continuous = false;

    this._status = 'Loading PDF...';
    this._pageNumber = 1;
    this._numPages = 0;
    this._scale = 1;
    this._fitMode = 'width';
    this._rotation = 0;
    this._layout = 'single';
    this._panelOpen = false;

    this._pdf = null;
    this._rendering = false;
    this._pendingRender = false;
    this._thumbs = new Set();
    this._loadToken = 0;
    this._resizeObserver = null;
    this._pageObserver = null;
  }

  _$(selector) {
    return this.renderRoot?.querySelector(selector);
  }

  get _pdfjsScriptUrl() {
    return this.pdfjsUrl || `${PDFJS_CDN}/${encodeURIComponent(this.pdfjsVersion)}/pdf.min.js`;
  }

  get _pdfjsWorkerUrl() {
    return this.pdfjsWorkerUrl || `${PDFJS_CDN}/${encodeURIComponent(this.pdfjsVersion)}/pdf.worker.min.js`;
  }

  render() {
    const continuous = this.continuous;
    const spread = !continuous && this._layout === 'spread';
    const last = Math.min(this._numPages, this._pageNumber + (spread ? 1 : 0));
    const pageLabel = this._numPages
      ? continuous
        ? `${this._numPages} pages`
        : spread && last > this._pageNumber
          ? `${this._pageNumber}-${last} / ${this._numPages}`
          : `${this._pageNumber} / ${this._numPages}`
      : this._status;
    return html`
      <div class="viewer" style="width:${this.width}; height:${this.height}; max-width:100%">
        <div class="toolbar">
          ${continuous ? nothing : html`<button type="button" aria-label="Previous page" title="Previous page" @click=${() => this._go(-1)}>&#x2039;</button>`}
          <span aria-live="polite">${pageLabel}</span>
          ${continuous ? nothing : html`<button type="button" aria-label="Next page" title="Next page" @click=${() => this._go(1)}>&#x203A;</button>`}
          <button type="button" aria-pressed=${this._fitMode === 'width'} @click=${() => this._setFit('width')}>Fit width</button>
          <button type="button" aria-pressed=${this._fitMode === 'page'} @click=${() => this._setFit('page')}>Fit page</button>
          <button type="button" title="Rotate clockwise" @click=${this._rotate}>Rotate</button>
          ${continuous
            ? nothing
            : html`
                <button type="button" aria-pressed=${!spread} @click=${() => this._setLayout('single')}>1 page</button>
                <button type="button" aria-pressed=${spread} @click=${() => this._setLayout('spread')}>2 pages</button>
                <button type="button" aria-expanded=${this._panelOpen} @click=${this._togglePanel}>Pages</button>
              `}
          <button type="button" aria-label="Zoom out" title="Zoom out" @click=${() => this._zoom(-0.2)}>&minus;</button>
          <span>${Math.round(this._scale * 100)}%</span>
          <button type="button" aria-label="Zoom in" title="Zoom in" @click=${() => this._zoom(0.2)}>&plus;</button>
          ${this.pdfUrl ? html`<a href=${this.pdfUrl} target="_blank" rel="noopener">Open PDF</a>` : nothing}
        </div>
        <div class="body">
          <aside class="panel" ?hidden=${continuous || !this._panelOpen} @scroll=${this._renderVisibleThumbs}>
            <div style="display:flex;flex-direction:column">
              ${Array.from({ length: continuous ? 0 : this._numPages }, (_, i) => i + 1).map(
                (n) => html`
                  <button
                    type="button"
                    class="thumb"
                    data-page=${n}
                    aria-label="Go to page ${n}"
                    aria-current=${n >= this._pageNumber && n <= last ? 'page' : nothing}
                    @click=${() => this._goTo(n)}
                  >
                    <canvas width="100" height="132"></canvas>
                    <span>Page ${n}</span>
                  </button>
                `
              )}
            </div>
          </aside>
          <div class="page-area"><div class="pages ${continuous ? 'continuous' : ''}"></div></div>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    this._resizeObserver = new ResizeObserver(() => this._requestRender());
    this._resizeObserver.observe(this._$('.page-area'));
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) {
      this._resizeObserver?.observe(this._$('.page-area'));
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._pageObserver?.disconnect();
  }

  updated(changed) {
    if (changed.has('continuous') && changed.get('continuous') !== undefined) {
      this._requestRender();
    }
    if (['pdfUrl', 'pdfjsVersion', 'pdfjsUrl', 'pdfjsWorkerUrl'].some((key) => changed.has(key))) {
      this._load();
    }
    if (changed.has('_numPages') && this._numPages) {
      this._thumbs.clear();
      this._renderVisibleThumbs();
    }
  }

  async _load() {
    const token = ++this._loadToken;
    this._pdf = null;
    this._numPages = 0;
    this._pageNumber = 1;
    this._$('.pages')?.replaceChildren();
    if (!this.pdfUrl) {
      this._status = 'No PDF specified';
      return;
    }
    this._status = 'Loading PDF...';
    try {
      const pdfjs = await loadPdfJs(this._pdfjsScriptUrl, this._pdfjsWorkerUrl);
      const pdf = await pdfjs.getDocument(this.pdfUrl).promise;
      if (token !== this._loadToken) return;
      this._pdf = pdf;
      this._numPages = pdf.numPages;
      await this.updateComplete;
      this._requestRender();
    } catch (error) {
      if (token !== this._loadToken) return;
      this._status = 'Unable to load PDF';
      console.error('PDF.js could not load the PDF.', error);
    }
  }

  _step() {
    return this._layout === 'spread' ? 2 : 1;
  }

  _go(direction) {
    this._goTo(this._pageNumber + direction * this._step());
  }

  _goTo(n) {
    if (!this._numPages || this.continuous) return;
    this._pageNumber = Math.min(this._numPages, Math.max(1, n));
    this._requestRender();
  }

  _zoom(delta) {
    this._scale = Math.min(2, Math.max(0.4, Math.round((this._scale + delta) * 10) / 10));
    this._requestRender();
  }

  _setFit(mode) {
    this._fitMode = mode;
    this._requestRender();
  }

  _setLayout(layout) {
    this._layout = layout;
    this._requestRender();
  }

  _rotate() {
    this._rotation = (this._rotation + 90) % 360;
    this._thumbs.clear();
    this._requestRender();
    this._renderVisibleThumbs();
  }

  _togglePanel() {
    this._panelOpen = !this._panelOpen;
    this.updateComplete.then(() => {
      this._requestRender();
      this._renderVisibleThumbs();
    });
  }

  _requestRender() {
    this._renderPages().catch((error) => {
      this._status = 'Unable to render PDF page';
      console.error('PDF.js could not render the PDF.', error);
    });
  }

  async _renderPages() {
    const area = this._$('.page-area');
    if (!this._pdf || !area) return;
    const spread = !this.continuous && this._layout === 'spread';
    if (area.clientWidth <= (spread ? 36 : 24) || area.clientHeight <= 24) return;
    if (this._rendering) {
      this._pendingRender = true;
      return;
    }
    this._rendering = true;
    try {
      if (this.continuous) {
        await this._renderContinuous(area);
        return;
      }
      const count = spread ? 2 : 1;
      const availableWidth = area.clientWidth - 24;
      const availableHeight = area.clientHeight - 24;
      const pageWidth = count === 2 ? (availableWidth - 12) / 2 : availableWidth;
      const ratio = window.devicePixelRatio || 1;
      const last = Math.min(this._pdf.numPages, this._pageNumber + count - 1);
      const views = [];
      const tasks = [];
      for (let n = this._pageNumber; n <= last; n += 1) {
        const page = await this._pdf.getPage(n);
        const base = page.getViewport({ scale: 1, rotation: this._rotation });
        const widthScale = pageWidth / base.width;
        const fit = this._fitMode === 'page' ? Math.min(widthScale, availableHeight / base.height) : widthScale;
        const viewport = page.getViewport({ scale: fit * this._scale, rotation: this._rotation });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = Math.floor(viewport.width * ratio);
        canvas.height = Math.floor(viewport.height * ratio);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        views.push(canvas);
        tasks.push(page.render({ canvasContext: context, viewport }).promise);
      }
      this._$('.pages').replaceChildren(...views);
      await Promise.all(tasks);
    } finally {
      this._rendering = false;
      if (this._pendingRender) {
        this._pendingRender = false;
        requestAnimationFrame(() => this._requestRender());
      }
    }
  }

  // Builds correctly sized placeholders for every page and draws each one when it nears the viewport.
  async _renderContinuous(area) {
    const availableWidth = area.clientWidth - 24;
    const availableHeight = area.clientHeight - 24;
    const ratio = window.devicePixelRatio || 1;
    const scrollRatio = area.scrollHeight ? area.scrollTop / area.scrollHeight : 0;
    const pdf = this._pdf;
    const rotation = this._rotation;
    const views = [];
    for (let n = 1; n <= pdf.numPages; n += 1) {
      const page = await pdf.getPage(n);
      const base = page.getViewport({ scale: 1, rotation });
      const widthScale = availableWidth / base.width;
      const fit = this._fitMode === 'page' ? Math.min(widthScale, availableHeight / base.height) : widthScale;
      const viewport = page.getViewport({ scale: fit * this._scale, rotation });
      const canvas = document.createElement('canvas');
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      canvas._draw = () => {
        canvas.width = Math.floor(viewport.width * ratio);
        canvas.height = Math.floor(viewport.height * ratio);
        const context = canvas.getContext('2d');
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        return page.render({ canvasContext: context, viewport }).promise;
      };
      views.push(canvas);
    }
    if (pdf !== this._pdf || !this.continuous) return;
    this._pageObserver?.disconnect();
    this._$('.pages').replaceChildren(...views);
    area.scrollTop = scrollRatio * area.scrollHeight;
    this._pageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          this._pageObserver.unobserve(entry.target);
          entry.target._draw().catch((error) => console.error('PDF.js could not render a page.', error));
        });
      },
      { root: area, rootMargin: '800px 0px' }
    );
    views.forEach((canvas) => this._pageObserver.observe(canvas));
  }

  _renderVisibleThumbs = () => {
    if (!this._pdf || !this._panelOpen) return;
    const panel = this._$('.panel');
    const bounds = panel.getBoundingClientRect();
    panel.querySelectorAll('.thumb').forEach((button) => {
      const b = button.getBoundingClientRect();
      if (b.bottom >= bounds.top - 120 && b.top <= bounds.bottom + 120) {
        this._renderThumb(button);
      }
    });
  };

  async _renderThumb(button) {
    const n = Number(button.dataset.page);
    if (this._thumbs.has(n)) return;
    this._thumbs.add(n);
    try {
      const page = await this._pdf.getPage(n);
      const base = page.getViewport({ scale: 1, rotation: this._rotation });
      const scale = Math.min(100 / base.width, 132 / base.height);
      const viewport = page.getViewport({ scale, rotation: this._rotation });
      const canvas = button.querySelector('canvas');
      const context = canvas.getContext('2d');
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(viewport.width * ratio);
      canvas.height = Math.ceil(viewport.height * ratio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      await page.render({ canvasContext: context, viewport }).promise;
    } catch (error) {
      console.error('PDF.js could not render a page thumbnail.', error);
    }
  }
}
