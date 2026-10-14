=== ASEN AWS S3 Uploader ===
Contributors: aknelkaiser
Tags: aws, s3, upload, video, large files, multipart, wp offload media
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: ISC

Direct client-to-AWS S3 uploader supporting files up to 5 TB with multipart chunking and WP Offload Media compatible data management.

== Description ==

ASEN AWS S3 Uploader allows your website users and editors to upload large broadcast video/audio files (such as MP4, MOV, MXF, WAV) directly from their browser to Amazon Web Services S3.

Key features:
* **Direct Client-to-S3 Upload**: Files bypass your web server completely, eliminating PHP timeouts, memory limits, and the standard 5 GB upload ceiling.
* **Large File Support (up to 5 TB)**: Uses S3 Multipart Upload with browser-side chunking and automatic retry on packet drops.
* **WP Offload Media Compatibility**: Automatically registers attachments in the WordPress Media Library with `amazonS3_info` and offload metadata.
* **Custom Video Posts**: Automatically generates video posts with metadata (Title, Location, Reporter, Categories, Restriction, Comments, Contacts, Script, and Document Attachments).
* **Settings & Diagnostic Suite**: Built-in test connection tool and 1-click S3 CORS policy generator.

== Configuration ==

You can configure AWS credentials in two ways:

= Option 1: In wp-config.php (Recommended) =
Similar to WP Offload Media, you can define AWS credentials securely in `wp-config.php`:

```php
define( 'ASEN_S3_SETTINGS', serialize( array(
    'provider'          => 'aws',
    'access-key-id'     => 'YOUR_AWS_ACCESS_KEY_ID',
    'secret-access-key' => 'YOUR_AWS_SECRET_ACCESS_KEY',
    'region'            => 'ap-southeast-1',
    'bucket'            => 'your-s3-bucket-name',
) ) );
```

When defined in `wp-config.php`, the settings UI will automatically display a lock indicator and read from the constant.

= Option 2: WordPress Settings Page =
If not defined in `wp-config.php`, go to **ASEN S3 Media > AWS S3 Settings** in WordPress and enter your credentials directly.

== Installation ==

1. Upload the `asen-s3-upload.zip` file via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Go to **ASEN S3 Media > AWS S3 Settings** (or **Settings > ASEN AWS S3**).
4. Enter your AWS Access Key, Secret Key, Region, and S3 Bucket Name.
5. Apply the provided CORS configuration to your S3 bucket in the AWS S3 Console.
6. Click **Test AWS Connection** to verify your setup.
7. Add the `[asen_s3_upload]` shortcode to any post or page.

== Shortcode ==

`[asen_s3_upload]`

Posts created through the uploader are saved with **Pending** status for review.

Optional attributes:
* `allow_multiple`: "yes" or "no" to show the **Add More Post** button at the top right and enable multi-post tabs at the top left
