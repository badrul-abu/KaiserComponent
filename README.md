# KaiserComponent

A small website of prepackaged, reusable UI components built with
[Lit 3](https://lit.dev) and bundled with [Webpack](https://webpack.js.org/),
so they can be dropped into any website as a single `<script>` tag.

## Getting started

Install dependencies:

```bash
npm install
```

Run the local dev server (serves `public/index.html` with live reload):

```bash
npm start
```

Build the production bundle:

```bash
npm run build
```

This produces `dist/kaiser-component.js`, which registers the custom
elements (e.g. `<kaiser-greeting>`) when loaded in a browser.

Run the component tests:

```bash
npm test
```

## Embedding a component in another website

Copy `dist/kaiser-component.js` to the target site (or load it from wherever
it is hosted), then use the custom element anywhere in the page's HTML:

```html
<script src="kaiser-component.js" defer></script>
<kaiser-greeting name="Kaiser"></kaiser-greeting>
```

## Project structure

- `src/components/` – individual Lit component source files.
- `src/index.js` – the bundle entry point; exports/registers every component.
- `public/index.html` – demo page used by the dev server.
- `webpack.config.js` – bundles the components into `dist/kaiser-component.js`.
- `test/` – component tests run with `@web/test-runner`.
