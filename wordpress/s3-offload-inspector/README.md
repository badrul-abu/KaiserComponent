# S3 Offload Inspector

Finds media that WP Offload Media (Pro 3.x) never offloaded, moves it to S3, and fixes the post so it plays from S3.

Built for files larger than 5 GB. Offload Media's own uploader uses a single S3 `putObject` call, which S3 limits to 5 GB, so such files stay on the web server. This plugin uploads them with S3 multipart and then registers them in Offload Media's `as3cf_items` table, so Offload Media treats them as normal offloaded files.

## What it does

| Command / screen | Changes data? | Purpose |
|---|---|---|
| Media → Offload Inspector, or `wp soi check` | No | Show which media of a post is offloaded or local-only |
| `wp soi migrate` | Yes | Upload one attachment to S3 and register it in Offload Media |
| `wp soi fix-meta` | Yes | Replace the old local URL stored in post meta with the S3 URL |
| `wp soi remove-local` | Yes | Delete the local file through Offload Media (verifies S3 first) |

## Requirements

- WP Offload Media Pro 3.x active (tested against source version 3.2.11). The code uses its `Media_Library_Item` class and its bundled AWS SDK.
- Shell access to the web server (SSH) and PHP CLI. WP-CLI is used for the migration steps. The admin screen is for inspection only.
- The S3 credentials Offload Media already uses must allow multipart uploads (`s3:PutObject`, `s3:AbortMultipartUpload`, `s3:ListMultipartUploadParts`) and `s3:GetObject`/`HeadObject` on the bucket.
- Free disk space is not needed on the server (the file is streamed from disk), but PHP CLI needs about 512 MB of memory.

## Install

1. Build the zip: `node scripts/package-wordpress.js s3-offload-inspector` (writes `dist/s3-offload-inspector.zip`).
2. WP Admin → Plugins → Add New → Upload Plugin → activate.
3. Confirm in `wp plugin list` that both this plugin and Offload Media are active.

If `wp` is not installed on the server, download WP-CLI into the WordPress folder and use `php wp-cli.phar` instead of `wp`:

```
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
php wp-cli.phar --info
```

Use `wget` if `curl` is missing. Delete `wp-cli.phar` when you are finished. Add `--allow-root` if you run as root, or `--path=/path/to/wordpress` if you are not in the WordPress folder.

## Step by step: migrate one large video

Example: post `159358`, video attachment `159360`. Run every command from the WordPress folder.

### 1. Inspect (read-only)

Admin: Media → Offload Inspector, enter the post ID or URL. Or:

```
php wp-cli.phar soi check 159358
php wp-cli.phar soi check 159358 --live     # also sends an HTTP HEAD request to each file URL
```

What to look for in the result:

| Status | Meaning |
|---|---|
| `offloaded` | Row exists in `as3cf_items`; nothing to do |
| `local-only` | No Offload Media record. A "Large local-only file" flag means 5 GB or more |
| `legacy-meta-only` | Only old `amazonS3_info` / `_asen_s3_info` meta exists, Offload Media has no record. Treat as not offloaded |
| `external` | URL is not in the Media Library (YouTube, other host); not handled |

"Found via" tells you where the media is referenced: the post's attachments, featured image, a meta field (for the theme this is `beeteam368_video_url` and `beeteam368_store_his_media_data`) or the content.

### 2. Back up the old URL

```
php wp-cli.phar post meta get 159358 beeteam368_video_url > video_url_backup.txt
```

`beeteam368_store_his_media_data` holds only the attachment ID (`159360`) and needs no change. Also take a database backup before the first real run.

### 3. Dry run

```
php wp-cli.phar soi migrate 159360 --dry-run
```

Check the output:
- `Target s3://<bucket>/<key>` has the expected bucket and region.
- The key contains the versioning folder (for example `.../2026/01/14160435/<file>.mp4`), the same pattern as files Offload Media offloaded itself.
- `bytes` matches the real file size.

Nothing is uploaded or changed.

### 4. Real migration

`screen` is often not installed, so use `nohup`:

```
nohup php -d memory_limit=512M wp-cli.phar soi migrate 159360 --part-size-mb=128 > migrate.log 2>&1 &
tail -f migrate.log        # Ctrl+C stops watching, not the job
ps aux | grep "soi migrate" | grep -v grep
```

Run only one copy at a time. A successful run ends with:

```
Primary object verified (size matches).
Registered in WP Offload Media (as3cf_items id ...).
Success: {... "uploaded":true,"registered":true,"meta_updated":1 ...}
```

What it does, in order: builds the Offload Media item (bucket, region, path with versioning), uploads in multipart parts with retries, compares the S3 object size with the local file, saves the `as3cf_items` row, fires `as3cf_post_upload_item`, then rewrites post meta that holds the old local URL. The local file is never removed in this step.

If it fails, the message starts with `Error:`. Nothing is registered unless the upload and size check succeeded, so after fixing the cause you can simply rerun.

### 5. Fix post meta (only needed if step 4 ran with `--keep-meta`, or for a file migrated earlier)

Offload Media rewrites attachment URLs and post content, but not plain post meta. The theme player reads `beeteam368_video_url` directly, so it keeps playing the old local URL until that value changes.

```
php wp-cli.phar soi fix-meta 159360 --dry-run     # lists the meta rows that would change
php wp-cli.phar soi fix-meta 159360
```

It replaces the old local URL (including the http/https variant) with the offloaded URL. Serialized values and `_wp_*` meta are skipped and listed.

### 6. Verify

```
php wp-cli.phar soi check 159358 --live
```

- The video shows `offloaded` with a bucket and path, and no "Large local-only file" flag.
- The live check returns `HTTP 200` and no size-mismatch flag.
- Open the post in a private window, play the video, and in the browser's Network tab confirm the request goes to S3 or CloudFront, not the local domain. Seek to the middle of the video to confirm range requests work.
- Check the S3 object in the console: size 7,835,706,359 bytes for the example above.

### 7. Remove the local file (optional)

Wait until the video has played from S3 for a while and nothing else points at the local URL.

```
php wp-cli.phar soi remove-local 159360
```

It checks that the S3 object exists and has the same size as the local file, then removes the files through Offload Media's own remove-local handler. If the check fails the local file is kept. Alternatively, `soi migrate ... --delete-local` does this in the same run, but doing it as a separate step is safer.

## Troubleshooting

| Message / symptom | Cause and fix |
|---|---|
| `wp: command not found` | Use `php wp-cli.phar ...` as above |
| `Could not open input file: wp-cli.phar` | The download did not run or failed; rerun `curl -O ...` and check `ls -la wp-cli.phar` (a few MB) |
| `Could not obtain the S3 client from WP Offload Media` | The S3 client is read from a private property of Offload Media's storage provider; this can break on a different Offload Media version. Check the version and report the error |
| `Attachment already has a WP Offload Media record` | Already offloaded; go to step 5 or 6 |
| `Mime type not allowed by WP Offload Media` | Offload Media refuses that type; check its allowed mime types |
| `Local file missing or unreadable` | The file is not at the path stored in `_wp_attached_file` |
| `Size mismatch` | Remote size differs from local; the upload is not registered, rerun |
| `Attachment URL is not rewritten to S3` | The meta fix runs only when the attachment URL already resolves to S3; check Offload Media's "rewrite media URLs" setting |
| Memory error | Run PHP with a higher limit: `php -d memory_limit=1024M ...` |
| Post still plays the local file after migration | Run step 5; look for other meta fields holding the old URL (`soi check` lists the "Found via" fields) |

## Things to know

- Only the Media Library items of one post are inspected or migrated at a time. There is no site-wide scan yet.
- Only the primary file and thumbnails that exist on disk are uploaded.
- A killed upload leaves no Offload Media record. An orphaned multipart upload in S3 can incur storage cost until aborted; set a bucket lifecycle rule "Delete expired object delete markers or incomplete multipart uploads" (for example after 7 days) as a safeguard.
- Files are uploaded with the ACL, cache headers and private/public settings Offload Media's own filters would apply.
- The meta fix only replaces the exact local URL. Embedded copies in other posts' serialized data are not changed.
- Keep a backup of the old meta value until the video has been verified in production.
- This plugin does not delete S3 objects.
