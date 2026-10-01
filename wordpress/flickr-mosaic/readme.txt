=== Flickr Mosaic ===
Contributors: 
Tags: flickr, gallery, photos, mosaic
Requires at least: 6.0
Requires PHP: 7.4
Stable tag: 1.0.0
License: ISC

Displays a moving Flickr photo gallery using the [flickr-mosaic] shortcode.

== Installation ==

1. From the project root, run `npm ci` and then `npm run package:wordpress`.
2. In WordPress, go to Plugins > Add New Plugin > Upload Plugin.
3. Upload `dist/flickr-mosaic.zip`, install it, and activate Flickr Mosaic.
4. Add the shortcode to a post or page.

== Usage ==

[flickr-mosaic]

Optional attributes:

* `width` - gallery width. Accepts CSS lengths in px, rem, em, vw, vh, vmin, vmax, or percent. Default: `100%`.
* `height` - gallery height using the same CSS length units. Default: `500px`.
* `columns` - number of strips, from 1 to 12. Default: `5`.
* `gap` - spacing as a CSS length. Default: `10px`.
* `background-color` - six-digit or three-digit hex color. Default: `#1d1d1f`.
* `border-color` - six-digit or three-digit hex color. Default: `#1d1d1f`.

Example:

[flickr-mosaic width="100%" height="500px" columns="5" gap="10px" background-color="#1d1d1f" border-color="#1d1d1f"]

Assets are enqueued for pages containing this shortcode. The gallery requests photo data from Flickr, loads photos from Flickr image hosts, fonts from Google Fonts, and the existing ABU logo from its current host. Visitors' browsers need access to these services. The current Flickr API key is included in the client-side bundle and is visible to site visitors.
