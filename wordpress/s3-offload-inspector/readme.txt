=== S3 Offload Inspector ===
Requires at least: 5.8
Tested up to: 6.6
Stable tag: 0.1.0
License: GPLv2 or later

Inspect which media of a post is offloaded to S3 by WP Offload Media Pro 3.x, and migrate files it could not offload (over 5 GB).

== Description ==
Inspection (read-only): Media > Offload Inspector, the post edit metabox, or `wp soi check <post_id|url> [--live] [--format=json]`.

Changes data (WP-CLI only):
* `wp soi migrate <attachment_id> [--dry-run] [--part-size-mb=128] [--keep-meta] [--delete-local]` uploads with S3 multipart and registers the file in Offload Media.
* `wp soi fix-meta <attachment_id> [--dry-run]` replaces the old local URL in post meta with the S3 URL.
* `wp soi remove-local <attachment_id>` removes local files through Offload Media after verifying S3.

See README.md for the full step-by-step guide, checks and troubleshooting.