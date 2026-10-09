# KaiserComponent

A Lit 3 photo gallery bundled with Webpack and packaged as a WordPress plugin.

## Getting started

Install dependencies:

```bash
npm install
```

Run the local dev server (serves `public/index.html` with live reload):

```bash
npm start
```

Build the demo production bundle:

```bash
npm run build
```

This produces the demo page and hashed JavaScript and CSS assets in `dist/`.

Build an installable WordPress plugin ZIP:

```bash
npm run package:wordpress
```

The package command writes `dist/flickr-mosaic.zip`.

Run the component tests:

```bash
npm test
```

## Install in WordPress

In WordPress, go to **Plugins > Add New Plugin > Upload Plugin**, select
`dist/flickr-mosaic.zip`, install it, and activate Flickr Mosaic. Add the
gallery to a post or page with this shortcode:

```text
[flickr-mosaic]
```

Optional attributes:

```text
[flickr-mosaic width="100%" height="500px" columns="5" gap="10px" background-color="#1d1d1f" border-color="#1d1d1f"]
```

`width`, `height`, and `gap` accept `px`, `%`, `em`, `rem`, `vw`, `vh`,
`vmin`, or `vmax` lengths. `columns` is clamped to 1–12. Colors accept
three- or six-digit hexadecimal values; invalid values use the defaults.
Assets load on pages containing the shortcode.

The gallery fetches photo data from Flickr, loads photos from Flickr image
hosts, fonts from Google Fonts, and the existing ABU logo from its current
host. Visitors' browsers need access to these services. The current Flickr API
key is included in the client-side bundle and is visible to site visitors.

## Project structure

- `src/components/` – individual Lit component source files.
- `src/index.js` – the bundle entry point; exports/registers every component.
- `public/index.html` – demo page used by the dev server.
- `wordpress/flickr-mosaic/` – WordPress plugin source and generated assets.
- `scripts/package-wordpress.js` – creates the installable plugin ZIP.
- `webpack.config.js` – builds the demo and WordPress asset bundles.
- `test/` – component tests run with `@web/test-runner`.

## ABU Programme PDF plugin

`src/components/pdf-reader.js` is a Lit `<abu-pdf-reader>` component (ported from the original PHP/inline-JS shortcode). `wordpress/abu-programme-pdf/` is the plugin: it looks up the PDF URL in Firestore, proxies non-CORS hosts, and renders the component.

- `npm run package:pdfreader` builds the bundle and writes `dist/abu-programme-pdf.zip`.
- Configure under **Settings → ABU Programme PDF** (Firebase project, collection/fields, allowed hosts, PDF.js URLs, defaults, cache).
- Shortcode: `[firebase_programme_pdf programme="technical" width="600px" height="849px"]`
- The component accepts `pdf-url` for the PDF, and `pdfjs-version` to choose the PDF.js CDN version (defaults to `3.11.174`). Explicit `pdfjs-url` and `pdfjs-worker-url` attributes override the version-based URLs, for example:

  ```html
  <abu-pdf-reader
    pdf-url="https://example.com/document.pdf"
    pdfjs-version="3.11.174"
    width="600px"
    height="849px"
  ></abu-pdf-reader>
  ```
- Add the boolean `continuous` attribute (shortcode: `continuous="yes"`) to show all pages in one scrollable column. This hides the previous/next, 1 page/2 pages and Pages sidebar controls; fit, rotate and zoom still work.
