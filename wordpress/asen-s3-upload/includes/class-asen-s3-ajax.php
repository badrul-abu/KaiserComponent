<?php
/**
 * AJAX endpoints for direct client-to-S3 uploads and post creation.
 *
 * @package ASEN_S3_Upload
 */

if (!defined('ABSPATH')) {
    exit;
}

class ASEN_S3_Ajax
{
    /**
     * Register AJAX hooks.
     */
    public static function init()
    {
        // Logged-in users
        add_action('wp_ajax_asen_s3_initiate_upload', array(__CLASS__, 'handle_initiate_upload'));
        add_action('wp_ajax_asen_s3_sign_parts', array(__CLASS__, 'handle_sign_parts'));
        add_action('wp_ajax_asen_s3_complete_upload', array(__CLASS__, 'handle_complete_upload'));
        add_action('wp_ajax_asen_s3_abort_upload', array(__CLASS__, 'handle_abort_upload'));
        add_action('wp_ajax_asen_s3_create_post', array(__CLASS__, 'handle_create_post'));

        // Support non-logged in if user capability allows, or restrict to logged-in users
        // By default, content contributors/editors/admins can upload; also allow front-end users with nonce
        add_action('wp_ajax_nopriv_asen_s3_initiate_upload', array(__CLASS__, 'handle_initiate_upload'));
        add_action('wp_ajax_nopriv_asen_s3_sign_parts', array(__CLASS__, 'handle_sign_parts'));
        add_action('wp_ajax_nopriv_asen_s3_complete_upload', array(__CLASS__, 'handle_complete_upload'));
        add_action('wp_ajax_nopriv_asen_s3_abort_upload', array(__CLASS__, 'handle_abort_upload'));
        add_action('wp_ajax_nopriv_asen_s3_create_post', array(__CLASS__, 'handle_create_post'));
    }

    /**
     * Verify security nonce.
     */
    private static function check_security()
    {
        if (!check_ajax_referer('asen_s3_client_nonce', 'nonce', false)) {
            wp_send_json_error(array('message' => 'Security token invalid or expired. Please refresh the page.'), 403);
        }
    }

    /**
     * Generate S3 object key matching WP Offload Media structure.
     *
     * Example structure:
     * wp-content/uploads/{year}/{month}/{object_version}/{filename}
     * e.g.: wp-content/uploads/2026/10/13135825/my-video.mp4
     *
     * @param string $original_filename
     * @return string
     */
    public static function generate_s3_key($original_filename)
    {
        $settings = ASEN_S3_Settings::get_settings();
        $prefix = isset($settings['s3_prefix']) ? trim($settings['s3_prefix']) : 'wp-content/uploads/';
        if (empty($prefix)) {
            $prefix = 'wp-content/uploads/';
        }

        $now = current_time('timestamp');
        $has_dynamic_tags = (strpos($prefix, '{') !== false);

        if ($has_dynamic_tags) {
            $replacements = array(
                '{year}'           => gmdate('Y', $now),
                '{month}'          => gmdate('m', $now),
                '{day}'            => gmdate('d', $now),
                '{object_version}' => gmdate('dHis', $now),
            );
            $full_prefix = str_replace(array_keys($replacements), array_values($replacements), $prefix);
            $full_prefix = trim($full_prefix, '/') . '/';
        } else {
            $parts = array();
            $clean_prefix = trim($prefix, '/');
            if (!empty($clean_prefix)) {
                $parts[] = $clean_prefix;
            }

            // Add Year & Month (e.g. 2026/10)
            $add_year_month = !isset($settings['add_year_month']) || !empty($settings['add_year_month']);
            if ($add_year_month) {
                $parts[] = gmdate('Y/m', $now);
            }

            // Add Object Version (e.g. 13135825/)
            $add_object_version = !isset($settings['add_object_version']) || !empty($settings['add_object_version']);
            if ($add_object_version) {
                $parts[] = gmdate('dHis', $now);
            }

            $full_prefix = implode('/', $parts) . '/';
        }

        $info = pathinfo($original_filename);
        $ext = !empty($info['extension']) ? '.' . strtolower($info['extension']) : '';
        $base = sanitize_file_name(!empty($info['filename']) ? $info['filename'] : 'file');
        $clean_base = preg_replace('/[^a-zA-Z0-9_\-\.]/', '-', $base);
        $clean_base = trim(preg_replace('/-+/', '-', $clean_base), '-');
        if (empty($clean_base)) {
            $clean_base = 'file';
        }

        // If object version is NOT used and no timestamp in prefix, prepend unique string to prevent collision
        $has_version = (!empty($settings['add_object_version']) || strpos($prefix, '{object_version}') !== false);
        if (!$has_version) {
            $clean_base = wp_generate_uuid4() . '-' . $clean_base;
        }

        return $full_prefix . $clean_base . $ext;
    }

    /**
     * Validate file extension against allowed list.
     *
     * @param string $filename
     * @return bool
     */
    private static function is_allowed_extension($filename)
    {
        $settings = ASEN_S3_Settings::get_settings();
        $allowed = array_map('trim', explode(',', strtolower($settings['allowed_extensions'])));
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        return in_array($ext, $allowed, true);
    }

    /**
     * Initiate upload endpoint.
     */
    public static function handle_initiate_upload()
    {
        self::check_security();

        $client = ASEN_S3_Settings::get_client();
        if (!$client) {
            wp_send_json_error(array('message' => 'AWS S3 is not configured. Please configure AWS credentials in WP Admin.'), 500);
        }

        $file_name = isset($_POST['file_name']) ? sanitize_file_name(wp_unslash($_POST['file_name'])) : '';
        $file_type = isset($_POST['file_type']) ? sanitize_mime_type(wp_unslash($_POST['file_type'])) : 'application/octet-stream';
        $file_size = isset($_POST['file_size']) ? (float) $_POST['file_size'] : 0;

        if (empty($file_name)) {
            wp_send_json_error(array('message' => 'Filename is required.'), 400);
        }

        if (!self::is_allowed_extension($file_name)) {
            wp_send_json_error(array('message' => 'File extension is not allowed.'), 400);
        }

        $settings = ASEN_S3_Settings::get_settings();
        $max_bytes = (float) $settings['max_file_size_gb'] * 1024 * 1024 * 1024;
        if ($file_size > $max_bytes) {
            wp_send_json_error(array(
                'message' => sprintf('File size exceeds the maximum allowed limit of %d GB.', $settings['max_file_size_gb'])
            ), 400);
        }

        $chunk_size_bytes = (int) $settings['chunk_size_mb'] * 1024 * 1024;
        $s3_key = self::generate_s3_key($file_name);
        $expiry = (int) $settings['url_expiry_minutes'] * 60;

        // For files smaller than 5MB, direct single PUT presigned URL can be used
        // AWS S3 multipart upload requires parts to be >= 5MB (except last part)
        $is_multipart = ($file_size >= 5 * 1024 * 1024);

        if (!$is_multipart) {
            // Single PUT presigned URL
            $put_url = $client->create_presigned_put_url($s3_key, $file_type, $expiry);
            wp_send_json_success(array(
                'is_multipart'     => false,
                'key'              => $s3_key,
                'put_url'          => $put_url,
                'file_url'         => $client->get_file_url($s3_key),
                'chunk_size_bytes' => $chunk_size_bytes,
                'bucket'           => $settings['s3_bucket'],
                'region'           => $settings['aws_region'],
            ));
        }

        // Multipart Upload
        $result = $client->initiate_multipart_upload($s3_key, $file_type, $settings['storage_class']);
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()), 500);
        }

        wp_send_json_success(array(
            'is_multipart'     => true,
            'upload_id'        => $result['upload_id'],
            'key'              => $s3_key,
            'chunk_size_bytes' => $chunk_size_bytes,
            'bucket'           => $result['bucket'],
            'region'           => $result['region'],
        ));
    }

    /**
     * Batch generate presigned part URLs.
     */
    public static function handle_sign_parts()
    {
        self::check_security();

        $client = ASEN_S3_Settings::get_client();
        if (!$client) {
            wp_send_json_error(array('message' => 'AWS S3 is not configured.'), 500);
        }

        $key = isset($_POST['key']) ? sanitize_text_field(wp_unslash($_POST['key'])) : '';
        $upload_id = isset($_POST['upload_id']) ? sanitize_text_field(wp_unslash($_POST['upload_id'])) : '';
        $part_numbers = isset($_POST['parts']) ? (array) $_POST['parts'] : array();

        if (empty($key) || empty($upload_id) || empty($part_numbers)) {
            wp_send_json_error(array('message' => 'Missing key, upload_id, or part numbers.'), 400);
        }

        $settings = ASEN_S3_Settings::get_settings();
        $expiry = (int) $settings['url_expiry_minutes'] * 60;

        $urls = $client->batch_presign_parts($key, $upload_id, $part_numbers, $expiry);
        wp_send_json_success(array('urls' => $urls));
    }

    /**
     * Complete Multipart Upload.
     */
    public static function handle_complete_upload()
    {
        self::check_security();

        $client = ASEN_S3_Settings::get_client();
        if (!$client) {
            wp_send_json_error(array('message' => 'AWS S3 is not configured.'), 500);
        }

        $key = isset($_POST['key']) ? sanitize_text_field(wp_unslash($_POST['key'])) : '';
        $upload_id = isset($_POST['upload_id']) ? sanitize_text_field(wp_unslash($_POST['upload_id'])) : '';
        $parts_raw = isset($_POST['parts']) ? $_POST['parts'] : '';

        if (is_string($parts_raw)) {
            $parts = json_decode(wp_unslash($parts_raw), true);
        } else {
            $parts = (array) $parts_raw;
        }

        if (empty($key) || empty($upload_id) || empty($parts) || !is_array($parts)) {
            wp_send_json_error(array('message' => 'Invalid multipart completion payload.'), 400);
        }

        $result = $client->complete_multipart_upload($key, $upload_id, $parts);
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()), 500);
        }

        wp_send_json_success($result);
    }

    /**
     * Abort Multipart Upload.
     */
    public static function handle_abort_upload()
    {
        self::check_security();

        $client = ASEN_S3_Settings::get_client();
        if (!$client) {
            wp_send_json_error(array('message' => 'AWS S3 is not configured.'), 500);
        }

        $key = isset($_POST['key']) ? sanitize_text_field(wp_unslash($_POST['key'])) : '';
        $upload_id = isset($_POST['upload_id']) ? sanitize_text_field(wp_unslash($_POST['upload_id'])) : '';

        if (!empty($key) && !empty($upload_id)) {
            $client->abort_multipart_upload($key, $upload_id);
        }

        wp_send_json_success(array('aborted' => true));
    }

    /**
     * Create WordPress Post(s) and register WP Offload Media attachments.
     */
    public static function handle_create_post()
    {
        self::check_security();

        $posts_raw = isset($_POST['posts']) ? $_POST['posts'] : '';
        if (is_string($posts_raw)) {
            $posts_data = json_decode(wp_unslash($posts_raw), true);
        } else {
            $posts_data = (array) $posts_raw;
        }

        if (empty($posts_data) || !is_array($posts_data)) {
            wp_send_json_error(array('message' => 'No post data received.'), 400);
        }

        $created_posts = array();

        foreach ($posts_data as $item) {
            $item['post_status'] = 'pending';
            $post_id = ASEN_S3_Media_Manager::create_video_post_from_data($item);
            if (!is_wp_error($post_id) && $post_id > 0) {
                $created_posts[] = array(
                    'post_id'   => $post_id,
                    'title'     => get_the_title($post_id),
                    'permalink' => get_permalink($post_id),
                );
            }
        }

        if (empty($created_posts)) {
            wp_send_json_error(array('message' => 'Failed to create post. Please try again.'), 500);
        }

        wp_send_json_success(array(
            'message' => count($created_posts) . ' post(s) created successfully!',
            'posts'   => $created_posts,
        ));
    }
}
