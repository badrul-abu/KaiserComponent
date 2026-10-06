import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import './flickr-mosaic/film-strip.js';
import './flickr-mosaic.css';

@customElement('flickr-mosaic')
export class FlickrMosaic extends LitElement {
  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      --container-width: 100%;
      --container-height: 500px;
      --background-color: #1d1d1f;
      --border-color: #1d1d1f;
      --columns: 5;
      --gap: 10px;
      user-select: none;
      overflow: hidden;
    }

    .container {
      width: calc(var(--container-width) - 2 * var(--gap));
      height: var(--container-height);
      border: var(--gap) solid var(--border-color);
      background-color: var(--background-color);
      display: grid;
      grid-template-columns: repeat(var(--columns), 1fr);
      gap: var(--gap);
      position: relative;
    }

    .gallery-panel {
      position: absolute;
      left: clamp(0.75rem, 2vw, 1.5rem);
      bottom: clamp(0.75rem, 2vw, 1.5rem);
      width: min(25rem, calc(100% - 1.5rem));
      box-sizing: border-box;
      padding: 1rem 1.15rem 1.15rem;
      z-index: 1;
      isolation: isolate;
      display: grid;
      gap: 0.7rem;
      overflow: hidden;
      cursor: default;
      border: 1px solid rgba(224, 240, 246, 0.28);
      border-left: 3px solid #67ddff;
      border-radius: 6px;
      background: linear-gradient(135deg, rgba(11, 26, 33, 0.96), rgba(15, 20, 24, 0.88));
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.36);
      backdrop-filter: blur(12px);
      color: #f7fbfc;

      &::before {
        position: absolute;
        inset: 0;
        content: '';
        background: linear-gradient(135deg, #1389a0, #0d596f 72%);
        clip-path: circle(0 at 0 100%);
        pointer-events: none;
        transition: clip-path 650ms cubic-bezier(0.2, 0.75, 0.25, 1);
        z-index: -1;
      }

      & .brand-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      & .brand-logo {
        display: block;
        width: 8.5rem;
        max-height: 2.5rem;
        object-fit: contain;
        object-position: left center;
      }

      & .eyebrow {
        margin: 0;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #9ddced;
      }

      & .gallery-title {
        margin: 0;
        max-width: 14ch;
        color: #fff;
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.08;
      }

      & .description {
        max-width: 36ch;
        margin: 0;
        color: rgba(242, 248, 250, 0.82);
        font-family: 'Montserrat', sans-serif;
        font-size: 0.92rem;
        line-height: 1.5;
      }

      & .gallery-link {
        display: inline-flex;
        align-items: center;
        justify-self: start;
        gap: 0.65rem;
        min-height: 2.75rem;
        box-sizing: border-box;
        padding: 0.55rem 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.72);
        border-radius: 4px;
        background: #f5fafc;
        color: #102832;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.84rem;
        font-weight: 700;
        line-height: 1.2;
        text-decoration: none;
        transition: background-color 160ms ease, transform 160ms ease;
      }

      & .gallery-link:hover {
        transform: translateY(-2px);
        background: #fff;
      }

      & .gallery-link:focus-visible {
        outline: 2px solid #67ddff;
        outline-offset: 3px;
      }

      & .flickr-mark {
        display: block;
        width: auto;
        max-width: 3.5rem;
        max-height: 1rem;
        padding: 0.2rem 0.3rem;
        border-radius: 2px;
        background: #fff;
      }

      & .external-arrow {
        font-size: 1.1rem;
        line-height: 1;
      }
    }

    .gallery-panel:focus-within {
      &::before {
        clip-path: circle(150% at 0 100%);
      }
    }

    @media (hover: hover) {
      .gallery-panel:hover::before {
        clip-path: circle(150% at 0 100%);
      }
    }

    .gallery-panel.is-revealed::before {
      clip-path: circle(150% at 0 100%);
    }

    @media (hover: none) {
      .gallery-panel:active::before {
        clip-path: circle(150% at 0 100%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .gallery-panel::before {
        transition: none;
      }

      .gallery-panel .gallery-link {
        transition: none;
      }
    }

    @media (max-width: 600px) {
      .gallery-panel {
        left: 0.65rem;
        bottom: 0.65rem;
        width: calc(100% - 1.3rem);
        gap: 0.55rem;
        padding: 0.85rem 0.9rem 0.9rem;
      }

      .gallery-panel .brand-logo {
        width: 7.25rem;
        max-height: 2rem;
      }

      .gallery-panel .gallery-title {
        font-size: 1.65rem;
      }

      .gallery-panel .description {
        font-size: 0.84rem;
      }
    }
  `;

  static properties = {
    width: { type: String },
    height: { type: String },
    backgroundColor: { type: String, attribute: 'background-color' },
    borderColor: { type: String, attribute: 'border-color' },
    columns: { type: Number },
    gap: { type: String },
    flickrLogoUrl: { type: String, attribute: 'flickr-logo-url' },
    flickrImageUrls: { type: Array, state: true },
    flickrImageIndex: { type: Number, state: true },
    colorRevealed: { state: true },
  }

  constructor() {
    super();
    this.width = '100%';
    this.height = '500px';
    this.backgroundColor = '#1d1d1f';
    this.borderColor = '#1d1d1f';
    this.columns = 5;
    this.gap = '10px';
    this.flickrLogoUrl = 'assets/flickr-logo.png';
    this.flickrImageUrls = [];
    this.colorRevealed = false;
    this.photoStrip = [];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  willUpdate(changedProperties) {
    // Update CSS custom properties based on changed attributes
    if (changedProperties.has('width')) {
      this.style.setProperty('--container-width', `${this.width}`);
    }
    if (changedProperties.has('height')) {
      this.style.setProperty('--container-height', `${this.height}`);
    }
    if (changedProperties.has('backgroundColor')) {
      this.style.setProperty('--background-color', this.backgroundColor);
    }
    if (changedProperties.has('borderColor')) {
      this.style.setProperty('--border-color', this.borderColor);
    }
    if (changedProperties.has('columns')) {
      this.style.setProperty('--columns', `${this.columns}`);
    }
    if (changedProperties.has('gap')) {
      this.style.setProperty('--gap', this.gap);
    }
    if (changedProperties.has('flickrImageUrls')) {
      this.photoStrip = this.repeatFlickrImage();
    }
  }

  firstUpdated() {
    this.flickrJson();
  }

  async flickrJson() {
    try {
      const params = new URLSearchParams({ api_key: 'afb50c566b96ad82afd6517569db973f', user_id: '144302542@N04', format: 'json', nojsoncallback: '1', method: 'flickr.people.getPhotos', privacy_filter: '1', extras: 'url_n', per_page: '200' });
      const response = await fetch(`https://www.flickr.com/services/rest/?${params}`);
      const data = await response.json();
      this.flickrImageUrls = data.photos.photo.map(photo => { return { url: photo.url_n, height: photo.height_n, width: photo.width_n }; }).slice(0, 200);
    } catch (error) {
      console.error('Error fetching Flickr JSON:', error);
      return null;
    }
  }

  getRandomIndex() {
    return Math.floor(Math.random() * (this.flickrImageUrls.length || 1));
  }

  togglePanelColor(event) {
    if (!event.target.closest('a')) {
      this.colorRevealed = !this.colorRevealed;
    }
  }

  repeatFlickrImage() {
    return Array.from({ length: this.columns }, () => {
      const jugglePhoto = this.flickrImageUrls.sort(() => Math.random() - 0.5); 
      return html`
      <film-strip
        .images=${jugglePhoto}
        .index=${this.getRandomIndex()}
        .gap=${this.gap}
      ></film-strip>
    `});
  }

  render() {
    return html`<div class="container">
      <aside class="gallery-panel ${classMap({ 'is-revealed': this.colorRevealed })}" aria-labelledby="gallery-title" @click=${this.togglePanelColor}>
        <div class="brand-row">
          <img class="brand-logo" src="https://abu-prod-wp-media.s3.ap-southeast-1.amazonaws.com/uploads/2026/04/ABU-Logo-white-2026-lines-semibold-768x227.png" alt="ABU">
          <p class="eyebrow">Photo journal</p>
        </div>
        <h2 class="gallery-title" id="gallery-title">Our world,<br>in focus.</h2>
        <p class="description">Moments, places, and people behind the work.</p>
        <a class="gallery-link" href="https://www.flickr.com/photos/abu_hq/" target="_blank" rel="noopener noreferrer">
          <span>Explore on</span>
          <img class="flickr-mark" src=${this.flickrLogoUrl} alt="">
          <span class="external-arrow" aria-hidden="true">↗</span>
        </a>
      </aside>
      ${this.photoStrip.map(item => item)}
    </div>`;
  }
}