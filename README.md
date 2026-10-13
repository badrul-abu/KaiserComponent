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

## ASEN AWS S3 Uploader Plugin (Direct Client-to-S3 Upload)

`src/components/asen-s3-uploader.js` is a Lit `<asen-s3-uploader>` web component. `wordpress/asen-s3-upload/` is the WordPress plugin for direct browser-to-AWS S3 uploads.

### Why Direct Client-to-S3 Upload?
Previously, uploads were sent to the WordPress server and synced via WP Offload Media, which was subject to PHP memory/timeout limits and capped at a 5 GB single-object limit. The new uploader uploads files **directly from the visitor's browser to Amazon AWS S3**:
- Bypasses PHP server upload limits (`upload_max_filesize`, `post_max_size`, PHP timeout).
- Supports large broadcast video/audio files (>5 GB up to 5 TB) using Amazon S3 Multipart Upload with browser chunking.
- If a chunk experiences a network drop, only that chunk retries automatically.
- Offloads 100% of bandwidth from the web server.

### Features
- **Client Multipart Uploading**: Slices files in browser (`File.slice()`) into configurable chunks (default 10 MB) and uploads concurrently with live progress, speed indicator, and ETA.
- **WP Offload Media Compatibility**: Automatically registers attachments in the WordPress Media Library with `amazonS3_info` and metadata matching WP Offload Media.
- **WordPress Settings Page**: Configure AWS Access Key ID, Secret Access Key, AWS Region, S3 Bucket, S3 Prefix/Folder, CloudFront CDN domain, chunk size, and max file size under **ASEN S3 Media &rarr; AWS S3 Settings**.
- **Diagnostic Connection Tester**: Built-in 1-click "Test AWS Connection" tool to verify credentials and bucket permissions.
- **S3 CORS Guide**: 1-click copyable CORS policy for the S3 bucket in the AWS Console.
- **Media & Post Management**: Custom Post Type `asen_video_post` and dedicated management table to view offloaded files, copy S3/CDN URLs, preview videos, and delete items from both WordPress and S3.

### Configuration & Credentials (`wp-config.php` Recommended)

You can provide AWS credentials via `wp-config.php` or through the WordPress admin settings page.

#### Option 1: Define in `wp-config.php` (Recommended, similar to WP Offload Media)
Add the `ASEN_S3_SETTINGS` serialized array constant to your `wp-config.php` file above `/* That's all, stop editing! Happy publishing. */`:

```php
define( 'ASEN_S3_SETTINGS', serialize( array(
    'provider'          => 'aws',
    'access-key-id'     => 'YOUR_AWS_ACCESS_KEY_ID',
    'secret-access-key' => 'YOUR_AWS_SECRET_ACCESS_KEY',
    'region'            => 'ap-southeast-1', // optional, defaults to ap-southeast-1
    'bucket'            => 'your-s3-bucket-name', // optional
) ) );
```

When `ASEN_S3_SETTINGS` is defined, the plugin automatically reads from this constant and locks the credential fields on the settings page to prevent tampering or database exposure.

#### Option 2: Define via WordPress Settings Page
If not defined in `wp-config.php`, navigate to **ASEN S3 Media &rarr; AWS S3 Settings** in your WordPress dashboard and enter your AWS Access Key ID, Secret Access Key, Region, and Bucket name.

### Build & Package
- Build component bundle:
  ```bash
  npm run build:s3upload
  ```
- Package WordPress plugin ZIP:
  ```bash
  npm run package:s3upload
  ```
  The package command writes `dist/asen-s3-upload.zip`.

### Shortcode
```text
[asen_s3_upload]
```
Optional attributes:
- `title="Upload"`: Page title.
- `header="yes"`: Show/hide ASEN branding header bar.
- `allow_multiple="yes"`: Enable "+ New Video Post" button to allow batch uploads.
- `theme="light"`: UI theme styling.

