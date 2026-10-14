<?php
/**
 * Media and Post Management for ASEN S3 Upload.
 *
 * Implements WP Offload Media compatible metadata schema,
 * custom post type registration, Media Library columns,
 * and the Uploaded Video Posts admin management dashboard.
 *
 * @package ASEN_S3_Upload
 */

if (!defined('ABSPATH')) {
    exit;
}

class ASEN_S3_Media_Manager
{
    const POST_TYPE = 'asen_video_post';
    const TAXONOMY  = 'asen_category';

    /**
     * Initialize media manager hooks.
     */
    public static function init()
    {
        add_action('init', array(__CLASS__, 'register_post_type_and_taxonomies'));
        add_action('admin_menu', array(__CLASS__, 'register_admin_menus'));
        add_filter('manage_media_columns', array(__CLASS__, 'add_media_columns'));
        add_action('manage_media_custom_column', array(__CLASS__, 'render_media_columns'), 10, 2);

        // Custom columns for ASEN Video Posts list table
        add_filter('manage_' . self::POST_TYPE . '_posts_columns', array(__CLASS__, 'add_video_post_columns'));
        add_action('manage_' . self::POST_TYPE . '_posts_custom_column', array(__CLASS__, 'render_video_post_columns'), 10, 2);
        add_filter('post_row_actions', array(__CLASS__, 'add_video_post_row_actions'), 10, 2);

        add_action('delete_attachment', array(__CLASS__, 'handle_attachment_deletion'));
        add_action('before_delete_post', array(__CLASS__, 'handle_post_deletion'));
        add_action('wp_ajax_asen_s3_delete_item', array(__CLASS__, 'ajax_delete_item'));

        // Delivery / URL Rewriting for S3 & CloudFront (serves ASEN & WP Offload Media items)
        add_filter('wp_get_attachment_url', array(__CLASS__, 'filter_attachment_url'), 99, 2);
        add_filter('image_downsize', array(__CLASS__, 'filter_image_downsize'), 99, 3);
        add_filter('wp_calculate_image_srcset', array(__CLASS__, 'filter_calculate_image_srcset'), 99, 5);
        add_filter('the_content', array(__CLASS__, 'filter_the_content'), 99);
    }

    /**
     * Register Custom Post Type and Taxonomy.
     */
    public static function register_post_type_and_taxonomies()
    {
        // Custom taxonomy for ASEN Categories
        register_taxonomy(self::TAXONOMY, array(self::POST_TYPE, 'post'), array(
            'labels' => array(
                'name'          => 'ASEN Categories',
                'singular_name' => 'ASEN Category',
                'search_items'  => 'Search Categories',
                'all_items'     => 'All Categories',
                'edit_item'     => 'Edit Category',
                'update_item'   => 'Update Category',
                'add_new_item'  => 'Add New Category',
                'menu_name'     => 'ASEN Categories',
            ),
            'hierarchical'      => true,
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_rest'      => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'asen-category'),
        ));

        // Custom Post Type for Video Posts
        register_post_type(self::POST_TYPE, array(
            'labels' => array(
                'name'               => 'Video Posts',
                'singular_name'      => 'Video Post',
                'menu_name'          => 'ASEN S3 Media',
                'name_admin_bar'     => 'ASEN Video Post',
                'add_new'            => 'Upload New',
                'add_new_item'       => 'Add New Video Post',
                'edit_item'          => 'Edit Video Post',
                'new_item'           => 'New Video Post',
                'view_item'          => 'View Video Post',
                'search_items'       => 'Search Video Posts',
                'not_found'          => 'No video posts found',
                'not_found_in_trash' => 'No video posts found in trash',
            ),
            'public'             => true,
            'has_archive'        => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'menu_icon'          => 'dashicons-video-alt3',
            'show_in_rest'       => true,
            'supports'           => array('title', 'editor', 'thumbnail', 'custom-fields', 'author'),
            'taxonomies'         => array(self::TAXONOMY, 'post_tag'), // Removed default 'category' taxonomy
            'rewrite'            => array('slug' => 'video-posts'),
        ));
    }

    /**
     * Register Admin Menus.
     */
    public static function register_admin_menus()
    {
        // Settings submenu under ASEN S3 Media
        add_submenu_page(
            'edit.php?post_type=' . self::POST_TYPE,
            'AWS S3 Settings',
            'AWS S3 Settings',
            'manage_options',
            'asen-s3-settings',
            array('ASEN_S3_Settings', 'render_settings_page')
        );

        // Also add under standard Settings for discovery
        add_options_page(
            'ASEN AWS S3 Settings',
            'ASEN AWS S3',
            'manage_options',
            'asen-s3-settings',
            array('ASEN_S3_Settings', 'render_settings_page')
        );

        // Also add under configured target post type (e.g. edit.php?post_type=vidmov_video) if different
        $settings = ASEN_S3_Settings::get_settings();
        $target_post_type = !empty($settings['post_type']) ? $settings['post_type'] : self::POST_TYPE;
        if ($target_post_type !== self::POST_TYPE && $target_post_type !== 'post') {
            add_submenu_page(
                'edit.php?post_type=' . $target_post_type,
                'AWS S3 Settings',
                'AWS S3 Settings',
                'manage_options',
                'asen-s3-settings',
                array('ASEN_S3_Settings', 'render_settings_page')
            );
        }
    }

    /**
     * Retrieve S3 information for an attachment.
     * Supports ASEN metadata, WP Offload Media legacy metadata (amazonS3_info),
     * and WP Offload Media items database table (as3cf_items).
     *
     * @param int $attachment_id
     * @return array|null Array with keys bucket, key, region, or null if not offloaded.
     */
    public static function get_attachment_s3_info($attachment_id)
    {
        $attachment_id = (int) $attachment_id;
        if (!$attachment_id) {
            return null;
        }

        // 1. Check ASEN metadata
        $asen_info = get_post_meta($attachment_id, '_asen_s3_info', true);
        if (!empty($asen_info) && is_array($asen_info) && !empty($asen_info['key'])) {
            return array(
                'bucket' => !empty($asen_info['bucket']) ? $asen_info['bucket'] : '',
                'key'    => $asen_info['key'],
                'region' => !empty($asen_info['region']) ? $asen_info['region'] : '',
            );
        }

        // 2. Check WP Offload Media legacy metadata (amazonS3_info)
        $s3_info = get_post_meta($attachment_id, 'amazonS3_info', true);
        if (!empty($s3_info) && is_array($s3_info) && !empty($s3_info['key'])) {
            return array(
                'bucket' => !empty($s3_info['bucket']) ? $s3_info['bucket'] : '',
                'key'    => $s3_info['key'],
                'region' => !empty($s3_info['region']) ? $s3_info['region'] : '',
            );
        }

        // 3. Check WP Offload Media items database table (as3cf_items) if present
        global $wpdb;
        if (!empty($wpdb)) {
            static $has_as3cf_table = null;
            $table_name = $wpdb->prefix . 'as3cf_items';
            if ($has_as3cf_table === null) {
                $has_as3cf_table = ($wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") === $table_name);
            }
            if ($has_as3cf_table) {
                $row = $wpdb->get_row($wpdb->prepare(
                    "SELECT bucket, path, region FROM {$table_name} WHERE source_id = %d LIMIT 1",
                    $attachment_id
                ), ARRAY_A);
                if (!empty($row) && !empty($row['path'])) {
                    return array(
                        'bucket' => !empty($row['bucket']) ? $row['bucket'] : '',
                        'key'    => $row['path'],
                        'region' => !empty($row['region']) ? $row['region'] : '',
                    );
                }
            }
        }

        return null;
    }

    /**
     * Generate canonical delivery URL for an S3 object key.
     * Uses CloudFront custom domain / CNAME if configured, falling back to S3 direct URL.
     *
     * @param string $key
     * @param string $bucket
     * @param string $region
     * @return string
     */
    public static function get_s3_delivery_url($key, $bucket = '', $region = '')
    {
        if (empty($key)) {
            return '';
        }

        $settings = ASEN_S3_Settings::get_settings();
        $custom_domain = !empty($settings['custom_domain']) ? trim($settings['custom_domain']) : '';
        $force_https = !isset($settings['force_https']) || !empty($settings['force_https']);
        $scheme = $force_https ? 'https://' : (is_ssl() ? 'https://' : 'http://');

        $clean_key = ltrim($key, '/');

        if (!empty($custom_domain)) {
            $domain = preg_replace('#^https?://#i', '', rtrim($custom_domain, '/'));
            return $scheme . $domain . '/' . $clean_key;
        }

        $bucket = $bucket ?: (!empty($settings['s3_bucket']) ? $settings['s3_bucket'] : '');
        $region = $region ?: (!empty($settings['aws_region']) ? $settings['aws_region'] : 'ap-southeast-1');

        if (!empty($bucket)) {
            return sprintf('%s%s.s3.%s.amazonaws.com/%s', $scheme, $bucket, $region, $clean_key);
        }

        return '';
    }

    /**
     * Filter wp_get_attachment_url to deliver offloaded files via CloudFront / S3.
     *
     * @param string $url
     * @param int $post_id
     * @return string
     */
    public static function filter_attachment_url($url, $post_id)
    {
        $settings = ASEN_S3_Settings::get_settings();
        if (isset($settings['deliver_media']) && empty($settings['deliver_media'])) {
            return $url;
        }

        $info = self::get_attachment_s3_info($post_id);
        if (!$info) {
            return $url;
        }

        $delivery_url = self::get_s3_delivery_url($info['key'], $info['bucket'], $info['region']);
        return !empty($delivery_url) ? $delivery_url : $url;
    }

    /**
     * Filter image_downsize to serve thumbnails and scaled images from CloudFront / S3.
     *
     * @param array|bool $downsize
     * @param int $post_id
     * @param string|array $size
     * @return array|bool
     */
    public static function filter_image_downsize($downsize, $post_id, $size)
    {
        $settings = ASEN_S3_Settings::get_settings();
        if (isset($settings['deliver_media']) && empty($settings['deliver_media'])) {
            return false;
        }

        $info = self::get_attachment_s3_info($post_id);
        if (!$info) {
            return false;
        }

        $key = $info['key'];
        $meta = wp_get_attachment_metadata($post_id);
        $width = 0;
        $height = 0;
        $is_intermediate = false;

        if (is_array($meta)) {
            if ($size === 'full') {
                $width = isset($meta['width']) ? (int) $meta['width'] : 0;
                $height = isset($meta['height']) ? (int) $meta['height'] : 0;
            } elseif (is_string($size) && isset($meta['sizes']) && is_array($meta['sizes']) && isset($meta['sizes'][$size])) {
                $size_data = $meta['sizes'][$size];
                $dir = dirname($key);
                $key = ($dir === '.' || $dir === '') ? $size_data['file'] : $dir . '/' . $size_data['file'];
                $width = isset($size_data['width']) ? (int) $size_data['width'] : 0;
                $height = isset($size_data['height']) ? (int) $size_data['height'] : 0;
                $is_intermediate = true;
            }
        }

        $url = self::get_s3_delivery_url($key, $info['bucket'], $info['region']);
        if (!empty($url)) {
            return array($url, $width, $height, $is_intermediate);
        }

        return false;
    }

    /**
     * Filter wp_calculate_image_srcset to serve all responsive image sources from CloudFront / S3.
     *
     * @param array $sources
     * @param array $size_array
     * @param string $image_src
     * @param array $image_meta
     * @param int $attachment_id
     * @return array
     */
    public static function filter_calculate_image_srcset($sources, $size_array, $image_src, $image_meta, $attachment_id)
    {
        if (empty($sources) || !is_array($sources)) {
            return $sources;
        }

        $settings = ASEN_S3_Settings::get_settings();
        if (isset($settings['deliver_media']) && empty($settings['deliver_media'])) {
            return $sources;
        }

        $info = self::get_attachment_s3_info($attachment_id);
        if (!$info) {
            return $sources;
        }

        $dir = dirname($info['key']);
        $base_dir = ($dir === '.' || $dir === '') ? '' : $dir . '/';

        foreach ($sources as $width => &$data) {
            $filename = basename($data['url']);
            $size_key = $base_dir . $filename;
            $cdn_url = self::get_s3_delivery_url($size_key, $info['bucket'], $info['region']);
            if (!empty($cdn_url)) {
                $data['url'] = $cdn_url;
            }
        }

        return $sources;
    }

    /**
     * Filter the_content to rewrite local upload URLs to CloudFront.
     *
     * @param string $content
     * @return string
     */
    public static function filter_the_content($content)
    {
        if (empty($content) || !is_string($content)) {
            return $content;
        }

        $settings = ASEN_S3_Settings::get_settings();
        if (isset($settings['deliver_media']) && empty($settings['deliver_media'])) {
            return $content;
        }

        $custom_domain = !empty($settings['custom_domain']) ? trim($settings['custom_domain']) : '';
        if (empty($custom_domain)) {
            return $content;
        }

        $domain = preg_replace('#^https?://#i', '', rtrim($custom_domain, '/'));
        $force_https = !isset($settings['force_https']) || !empty($settings['force_https']);
        $scheme = $force_https ? 'https://' : (is_ssl() ? 'https://' : 'http://');
        $cdn_base = $scheme . $domain;

        if (function_exists('wp_upload_dir')) {
            $upload_dir = wp_upload_dir();
            $local_base = isset($upload_dir['baseurl']) ? $upload_dir['baseurl'] : '';
            if (!empty($local_base)) {
                $parsed = parse_url($local_base);
                if (!empty($parsed['host'])) {
                    $path = !empty($parsed['path']) ? $parsed['path'] : '';
                    $content = str_replace('https://' . $parsed['host'] . $path, $cdn_base . $path, $content);
                    $content = str_replace('http://' . $parsed['host'] . $path, $cdn_base . $path, $content);
                }
            }
        }

        return $content;
    }

    /**
     * Register an uploaded S3 file into the WordPress Media Library
     * with full WP Offload Media compatibility metadata.
     *
     * @param array $file_info
     * @param int $parent_post_id
     * @return int|WP_Error Attachment ID.
     */
    public static function register_s3_attachment(array $file_info, $parent_post_id = 0)
    {
        $filename = !empty($file_info['filename']) ? sanitize_file_name($file_info['filename']) : basename($file_info['key']);
        $mime_type = !empty($file_info['mime']) ? sanitize_mime_type($file_info['mime']) : 'application/octet-stream';
        $key = sanitize_text_field($file_info['key']);
        $bucket = sanitize_text_field($file_info['bucket']);
        $region = sanitize_text_field($file_info['region']);
        $url = esc_url_raw($file_info['url']);
        $filesize = isset($file_info['filesize']) ? (float) $file_info['filesize'] : 0;
        $etag = !empty($file_info['etag']) ? sanitize_text_field($file_info['etag']) : '';

        // Create attachment post
        $attachment = array(
            'guid'           => $url,
            'post_mime_type' => $mime_type,
            'post_title'     => preg_replace('/\.[^.]+$/', '', $filename),
            'post_content'   => '',
            'post_status'    => 'inherit',
            'post_parent'    => (int) $parent_post_id,
        );

        $attachment_id = wp_insert_attachment($attachment, $key, $parent_post_id);

        if (is_wp_error($attachment_id) || !$attachment_id) {
            return $attachment_id;
        }

        // WP Offload Media standard metadata format
        $amazon_s3_info = array(
            'bucket' => $bucket,
            'key'    => $key,
            'region' => $region,
        );
        update_post_meta($attachment_id, 'amazonS3_info', $amazon_s3_info);

        // Standard WordPress attachment metadata
        update_post_meta($attachment_id, '_wp_attached_file', $key);
        $meta = array(
            'filesize' => $filesize,
            'file'     => $key,
        );
        update_post_meta($attachment_id, '_wp_attachment_metadata', $meta);

        // Extended ASEN S3 offload metadata
        $asen_s3_meta = array(
            'provider'      => 'aws',
            'bucket'        => $bucket,
            'key'           => $key,
            'region'        => $region,
            'url'           => $url,
            'filesize'      => $filesize,
            'mime_type'     => $mime_type,
            'original_name' => $filename,
            'etag'          => $etag,
            'uploaded_at'   => current_time('mysql'),
        );
        update_post_meta($attachment_id, '_asen_s3_info', $asen_s3_meta);
        update_post_meta($attachment_id, '_asen_is_s3_offloaded', 1);
        update_post_meta($attachment_id, '_original_filename', $filename);

        return $attachment_id;
    }

    /**
     * Create Video Post and associate attachments.
     *
     * @param array $data
     * @return int|WP_Error Post ID.
     */
    public static function create_video_post_from_data(array $data)
    {
        $settings = ASEN_S3_Settings::get_settings();
        $target_post_type = !empty($settings['post_type']) ? $settings['post_type'] : self::POST_TYPE;

        $title       = !empty($data['title']) ? sanitize_text_field($data['title']) : 'Untitled Video Post';
        $location    = !empty($data['location']) ? sanitize_text_field($data['location']) : '';
        $reporter    = !empty($data['reporter']) ? sanitize_textarea_field($data['reporter']) : '';
        $restriction = !empty($data['restriction']) ? sanitize_text_field($data['restriction']) : '';
        $comments    = !empty($data['comments']) ? sanitize_textarea_field($data['comments']) : '';
        $contacts    = !empty($data['contacts']) ? sanitize_text_field($data['contacts']) : '';
        $script      = !empty($data['script']) ? sanitize_textarea_field($data['script']) : '';
        $categories  = !empty($data['categories']) ? (array) $data['categories'] : array();
        $tags        = !empty($data['tags']) ? (array) $data['tags'] : array();

        $video_file  = !empty($data['video_file']) && is_array($data['video_file']) ? $data['video_file'] : null;
        $attachments = !empty($data['attachments']) && is_array($data['attachments']) ? $data['attachments'] : array();

        // Build post content based on target post type
        if ($target_post_type === 'vidmov_video') {
            // Vidmov theme displays the video player via beeteam368_video_url; post_content is the script / story body
            $content = !empty($script) ? $script : '';
        } else {
            // HTML content with video embed, metadata details box, and script
            $content = '';
            if ($video_file && !empty($video_file['url'])) {
                $video_url = esc_url($video_file['url']);
                $content .= sprintf(
                    '<div class="asen-video-embed" style="margin-bottom:24px;">' .
                    '<video controls preload="metadata" style="width:100%%;max-height:540px;background:#000;border-radius:8px;">' .
                    '<source src="%s" type="%s">' .
                    'Your browser does not support the video tag.' .
                    '</video>' .
                    '</div>' . "\n\n",
                    $video_url,
                    esc_attr(!empty($video_file['mime']) ? $video_file['mime'] : 'video/mp4')
                );
            }

            // Add metadata box
            $content .= '<div class="asen-post-details" style="background:#f8fafc;padding:18px 24px;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:24px;">' . "\n";
            if ($location) {
                $content .= '<p><strong>Location:</strong> ' . esc_html($location) . '</p>' . "\n";
            }
            if ($reporter) {
                $content .= '<p><strong>Reporter:</strong> ' . esc_html($reporter) . '</p>' . "\n";
            }
            if ($restriction) {
                $content .= '<p><strong>Restriction:</strong> ' . esc_html($restriction) . '</p>' . "\n";
            }
            if ($contacts) {
                $content .= '<p><strong>Contacts:</strong> ' . esc_html($contacts) . '</p>' . "\n";
            }
            if ($comments) {
                $content .= '<p><strong>Comments:</strong> ' . nl2br(esc_html($comments)) . '</p>' . "\n";
            }
            $content .= '</div>' . "\n\n";

            if ($script) {
                $content .= '<h3>Script / Rundown</h3>' . "\n";
                $content .= '<div class="asen-script-content" style="white-space:pre-wrap;background:#fff;padding:16px;border:1px solid #e2e8f0;border-radius:6px;">' . esc_html($script) . '</div>' . "\n\n";
            }
        }

        $post_status = !empty($data['post_status']) ? sanitize_key($data['post_status']) : 'publish';

        $post_data = array(
            'post_title'   => $title,
            'post_content' => $content,
            'post_status'  => $post_status,
            'post_type'    => $target_post_type,
            'post_author'  => get_current_user_id() ?: 1,
        );

        $post_id = wp_insert_post($post_data);
        if (is_wp_error($post_id) || !$post_id) {
            return $post_id;
        }

        // Save ASEN Custom Fields (for ASEN dashboard and offload management)
        update_post_meta($post_id, '_asen_location', $location);
        update_post_meta($post_id, '_asen_reporter', $reporter);
        update_post_meta($post_id, '_asen_restriction', $restriction);
        update_post_meta($post_id, '_asen_comments', $comments);
        update_post_meta($post_id, '_asen_contacts', $contacts);
        update_post_meta($post_id, '_asen_script', $script);

        // Save Vidmov / BeeTeam368 standard meta fields
        update_post_meta($post_id, 'location', $location);
        update_post_meta($post_id, 'reporter', $reporter);
        update_post_meta($post_id, 'restriction', $restriction);
        update_post_meta($post_id, 'comment', $comments);
        update_post_meta($post_id, 'contact', $contacts);

        // Register Video Attachment
        $video_att_id = 0;
        if ($video_file) {
            $video_att_id = self::register_s3_attachment($video_file, $post_id);
            if (!is_wp_error($video_att_id) && $video_att_id > 0) {
                update_post_meta($post_id, '_asen_video_attachment_id', $video_att_id);
                update_post_meta($post_id, '_asen_video_s3_key', $video_file['key']);
                update_post_meta($post_id, '_asen_video_s3_url', $video_file['url']);
                update_post_meta($post_id, '_asen_video_filesize', $video_file['filesize'] ?? 0);

                // BeeTeam368 / Vidmov Player Integration fields
                update_post_meta($post_id, 'beeteam368_video_url', $video_file['url']);
                update_post_meta($post_id, 'beeteam368_video_mode', 'pro');
                update_post_meta($post_id, 'beeteam368_video_formats', 'auto');
                update_post_meta($post_id, 'beeteam368_video_formats_preview', 'auto');
                update_post_meta($post_id, 'beeteam368_video_ratio', '16:9');
                update_post_meta($post_id, 'beeteam368_store_his_media_data', $video_att_id);

                if (!has_post_thumbnail($post_id)) {
                    set_post_thumbnail($post_id, $video_att_id);
                }
            }
        }

        // Register Additional Attachments
        $attachment_ids = array();
        $attachment_urls = array();
        foreach ($attachments as $att_file) {
            if (!empty($att_file['url'])) {
                $att_id = self::register_s3_attachment($att_file, $post_id);
                if (!is_wp_error($att_id) && $att_id > 0) {
                    $attachment_ids[] = $att_id;
                    $attachment_urls[] = $att_file['url'];
                    if (function_exists('do_action')) {
                        do_action('beeteam368_after_processing_attachment', $att_id, $post_id);
                    }
                }
            }
        }
        update_post_meta($post_id, '_asen_attachment_ids', $attachment_ids);
        update_post_meta($post_id, '_asen_attachment_urls', $attachment_urls);

        // ACF Repeater Document Attachments (matches Vidmov theme ACF repeater schema)
        $sub_field_key = 'field_687d2f19c7a7c';
        $repeater_field_key = 'field_6864166f4c45e';
        foreach ($attachment_ids as $index => $att_id) {
            update_post_meta($post_id, "attachment_{$index}_attachment", $att_id);
            update_post_meta($post_id, "_attachment_{$index}_attachment", $sub_field_key);
        }
        if (!empty($attachment_ids)) {
            update_post_meta($post_id, 'attachment', count($attachment_ids));
            update_post_meta($post_id, '_attachment', $repeater_field_key);
        }

        // Assign Categories & Taxonomies
        if (!empty($categories)) {
            $cat_terms = array();
            foreach ($categories as $cat) {
                $cat = trim($cat);
                if ($cat === '') continue;
                $cat_terms[] = is_numeric($cat) ? (int) $cat : sanitize_text_field($cat);
            }

            if (!empty($cat_terms)) {
                // Vidmov theme video categories (vidmov_video_category)
                if ($target_post_type === 'vidmov_video' || taxonomy_exists('vidmov_video_category')) {
                    wp_set_object_terms($post_id, $cat_terms, 'vidmov_video_category', true);
                }

                // Dedicated ASEN post type taxonomy (asen_category)
                if ($target_post_type === self::POST_TYPE && taxonomy_exists(self::TAXONOMY)) {
                    wp_set_object_terms($post_id, $cat_terms, self::TAXONOMY, true);
                }

                // Standard WordPress post categories (category)
                if ($target_post_type === 'post' && taxonomy_exists('category')) {
                    wp_set_object_terms($post_id, $cat_terms, 'category', true);
                }

                update_post_meta($post_id, '_asen_categories', $categories);
            }
        }

        // Assign Tags (post_tag)
        if (!empty($tags)) {
            $tag_items = array();
            foreach ($tags as $tag) {
                $tag = trim($tag);
                if ($tag === '') continue;
                $tag_items[] = is_numeric($tag) ? (int) $tag : sanitize_text_field($tag);
            }
            if (!empty($tag_items)) {
                wp_set_object_terms($post_id, $tag_items, 'post_tag', true);
                update_post_meta($post_id, '_asen_tags', $tag_items);
            }
        }

        // Trigger BeeTeam368 completion hooks if available
        if (function_exists('do_action')) {
            do_action('beeteam368_after_submit_post_success', $post_id, $target_post_type);
            do_action('beeteam368_after_submit_post_success_add_new', $post_id, $target_post_type);
        }

        return $post_id;
    }

    /**
     * Add "S3 Offload" column to WordPress Media Library.
     *
     * @param array $columns
     * @return array
     */
    public static function add_media_columns($columns)
    {
        $columns['asen_s3_offload'] = 'S3 Offload';
        return $columns;
    }

    /**
     * Render "S3 Offload" column content in Media Library.
     *
     * @param string $column_name
     * @param int $post_id
     */
    public static function render_media_columns($column_name, $post_id)
    {
        if ($column_name !== 'asen_s3_offload') {
            return;
        }

        $s3_info = get_post_meta($post_id, 'amazonS3_info', true);
        if (!$s3_info || empty($s3_info['bucket'])) {
            echo '<span style="color:#94a3b8;">Local Server</span>';
            return;
        }

        $bucket = esc_html($s3_info['bucket']);
        $region = esc_html(!empty($s3_info['region']) ? $s3_info['region'] : '');
        $url = wp_get_attachment_url($post_id);

        echo '<div style="font-size:12px;line-height:1.4;">';
        echo '<span class="badge" style="display:inline-block;padding:2px 6px;border-radius:4px;background:#dcfce7;color:#15803d;font-weight:600;font-size:11px;">✓ AWS S3</span>';
        echo '<div style="color:#64748b;margin-top:2px;">' . $bucket . ($region ? ' (' . $region . ')' : '') . '</div>';
        if ($url) {
            echo '<a href="' . esc_url($url) . '" target="_blank" rel="noopener" style="font-size:11px;color:#4f46e5;text-decoration:none;">View on S3 &rarr;</a>';
        }
        echo '</div>';
    }

    /**
     * Delete object from S3 when attachment is deleted from WordPress.
     *
     * @param int $post_id
     */
    public static function handle_attachment_deletion($post_id)
    {
        $s3_info = get_post_meta($post_id, 'amazonS3_info', true);
        if (empty($s3_info) || empty($s3_info['key'])) {
            return;
        }

        $client = ASEN_S3_Settings::get_client();
        if ($client) {
            $client->delete_object($s3_info['key']);
        }
    }

    /**
     * Delete associated S3 media when a video post is deleted.
     *
     * @param int $post_id
     */
    public static function handle_post_deletion($post_id)
    {
        $settings = ASEN_S3_Settings::get_settings();
        $target_post_type = !empty($settings['post_type']) ? $settings['post_type'] : self::POST_TYPE;
        $allowed_post_types = array(self::POST_TYPE, 'post', 'vidmov_video', $target_post_type);

        if (!in_array(get_post_type($post_id), $allowed_post_types, true)) {
            return;
        }

        $attachment_ids = array();
        $video_att_id = (int) get_post_meta($post_id, '_asen_video_attachment_id', true);
        if ($video_att_id > 0) {
            $attachment_ids[] = $video_att_id;
        }
        $extra_ids = get_post_meta($post_id, '_asen_attachment_ids', true);
        if (is_array($extra_ids)) {
            $attachment_ids = array_merge($attachment_ids, array_map('intval', $extra_ids));
        }

        // Deleting the attachment record fires delete_attachment, which removes the S3 object.
        $deleted_keys = array();
        foreach (array_unique($attachment_ids) as $att_id) {
            if ($att_id <= 0 || get_post_type($att_id) !== 'attachment') {
                continue;
            }

            // Retain media that has been re-attached to another post.
            $parent_id = (int) wp_get_post_parent_id($att_id);
            if ($parent_id !== 0 && $parent_id !== (int) $post_id) {
                continue;
            }

            $s3_info = get_post_meta($att_id, 'amazonS3_info', true);
            if (!empty($s3_info['key'])) {
                $deleted_keys[] = $s3_info['key'];
            }
            wp_delete_attachment($att_id, true);
        }

        // Fallback for posts whose video has no attachment record.
        $video_key = get_post_meta($post_id, '_asen_video_s3_key', true);
        if (!empty($video_key) && !in_array($video_key, $deleted_keys, true)) {
            $client = ASEN_S3_Settings::get_client();
            if ($client) {
                $client->delete_object($video_key);
            }
        }
    }

    /**
     * AJAX action to delete post and associated S3 files.
     */
    public static function ajax_delete_item()
    {
        check_ajax_referer('asen_s3_admin_nonce', 'nonce');

        if (!current_user_can('delete_posts')) {
            wp_send_json_error(array('message' => 'Unauthorized permissions.'));
        }

        $post_id = isset($_POST['post_id']) ? (int) $_POST['post_id'] : 0;
        if (!$post_id) {
            wp_send_json_error(array('message' => 'Invalid post ID.'));
        }

        $deleted = wp_delete_post($post_id, true);
        if ($deleted) {
            wp_send_json_success(array('message' => 'Post and associated S3 media deleted successfully.'));
        } else {
            wp_send_json_error(array('message' => 'Failed to delete post.'));
        }
    }

    /**
     * Add custom columns to Video Posts admin table.
     *
     * @param array $columns
     * @return array
     */
    public static function add_video_post_columns($columns)
    {
        $new_columns = array();
        foreach ($columns as $key => $title) {
            $new_columns[$key] = $title;
            if ($key === 'title') {
                $new_columns['asen_location_reporter'] = 'Location & Reporter';
                $new_columns['asen_video_file']        = 'Video File (S3)';
                $new_columns['asen_attachments']       = 'Attachments';
                $new_columns['asen_s3_status']         = 'AWS S3 Status';
            }
        }
        return $new_columns;
    }

    /**
     * Render custom column contents in Video Posts admin table.
     *
     * @param string $column_name
     * @param int $post_id
     */
    public static function render_video_post_columns($column_name, $post_id)
    {
        switch ($column_name) {
            case 'asen_location_reporter':
                $location = get_post_meta($post_id, '_asen_location', true);
                $reporter = get_post_meta($post_id, '_asen_reporter', true);
                if ($location) {
                    echo '<div><strong>Loc:</strong> ' . esc_html($location) . '</div>';
                }
                if ($reporter) {
                    echo '<div style="color:#64748b;"><strong>Rep:</strong> ' . esc_html($reporter) . '</div>';
                }
                if (!$location && !$reporter) {
                    echo '<span style="color:#94a3b8;">&mdash;</span>';
                }
                break;

            case 'asen_video_file':
                $video_url = get_post_meta($post_id, '_asen_video_s3_url', true);
                $video_size = get_post_meta($post_id, '_asen_video_filesize', true);
                $video_att_id = get_post_meta($post_id, '_asen_video_attachment_id', true);

                if ($video_url) {
                    $filename = basename(parse_url($video_url, PHP_URL_PATH));
                    echo '<div style="font-weight:500;">' . esc_html($filename) . '</div>';
                    if ($video_size) {
                        echo '<span class="badge" style="background:#e0e7ff;color:#3730a3;font-size:11px;padding:2px 6px;border-radius:3px;">' . esc_html(self::format_bytes((float) $video_size)) . '</span> ';
                    }
                    echo '<a href="' . esc_url($video_url) . '" target="_blank" rel="noopener" style="font-size:11px;color:#4f46e5;text-decoration:none;">Open Video &rarr;</a>';
                } else {
                    echo '<span style="color:#94a3b8;">No video file</span>';
                }
                break;

            case 'asen_attachments':
                $att_urls = get_post_meta($post_id, '_asen_attachment_urls', true);
                if (is_array($att_urls) && !empty($att_urls)) {
                    echo '<span class="badge" style="background:#f1f5f9;color:#334155;font-weight:600;padding:2px 8px;border-radius:12px;font-size:12px;">' . count($att_urls) . ' file(s)</span>';
                } else {
                    echo '<span style="color:#94a3b8;">0</span>';
                }
                break;

            case 'asen_s3_status':
                $video_att_id = get_post_meta($post_id, '_asen_video_attachment_id', true);
                $s3_info = $video_att_id ? get_post_meta($video_att_id, 'amazonS3_info', true) : null;

                if ($s3_info && !empty($s3_info['bucket'])) {
                    echo '<span style="background:#dcfce7;color:#15803d;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600;">✓ Offloaded to S3</span>';
                    echo '<div style="font-size:11px;color:#64748b;margin-top:2px;">' . esc_html($s3_info['bucket']) . ' (' . esc_html($s3_info['region']) . ')</div>';
                } else {
                    echo '<span style="color:#f59e0b;font-size:12px;">Pending / Local</span>';
                }
                break;
        }
    }

    /**
     * Add row action for Copying S3 URL and Previewing video.
     *
     * @param array $actions
     * @param WP_Post $post
     * @return array
     */
    public static function add_video_post_row_actions($actions, $post)
    {
        if ($post->post_type !== self::POST_TYPE) {
            return $actions;
        }

        $video_url = get_post_meta($post->ID, '_asen_video_s3_url', true);
        if ($video_url) {
            $actions['asen_s3_url'] = sprintf(
                '<a href="%s" target="_blank" rel="noopener" style="color:#4f46e5;">%s</a>',
                esc_url($video_url),
                'View S3 File'
            );
        }
        return $actions;
    }

    /**
     * Format bytes to readable size string.
     *
     * @param float $bytes
     * @param int $precision
     * @return string
     */
    public static function format_bytes($bytes, $precision = 2)
    {
        if ($bytes <= 0) return '0 B';
        $units = array('B', 'KB', 'MB', 'GB', 'TB');
        $pow = floor(log($bytes) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
