<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Determines the S3 offload state of an attachment. Read-only.
 */
class SOI_Status
{
    const LARGE_FILE_BYTES = 5368709120; // 5 GB

    public static function as3cf_table_exists()
    {
        global $wpdb;
        static $exists = null;
        if ($exists === null) {
            $table = $wpdb->prefix . 'as3cf_items';
            $exists = ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)) === $table);
        }
        return $exists;
    }

    public static function inspect(array $item, $live_check = false)
    {
        $id = (int) $item['attachment_id'];
        $row = array(
            'attachment_id' => $id,
            'title'         => '',
            'mime'          => '',
            'via'           => $item['via'],
            'status'        => 'unknown',
            'bucket'        => '',
            'region'        => '',
            'path'          => '',
            'url'           => $item['url'],
            'local_exists'  => null,
            'local_size'    => null,
            'flags'         => array(),
            'live'          => null,
        );

        if (!$id) {
            $row['status'] = 'external';
            $row['flags'][] = 'URL is not in the media library';
            return $row;
        }

        $row['title'] = get_the_title($id);
        $row['mime'] = (string) get_post_mime_type($id);
        if ($row['url'] === '') {
            $row['url'] = (string) wp_get_attachment_url($id);
        }

        $as3cf = self::get_as3cf_record($id);
        $legacy = get_post_meta($id, 'amazonS3_info', true);
        $asen = get_post_meta($id, '_asen_s3_info', true);

        if ($as3cf) {
            $row['status'] = 'offloaded';
            $row['bucket'] = $as3cf['bucket'];
            $row['region'] = $as3cf['region'];
            $row['path'] = $as3cf['path'];
        } elseif ((is_array($legacy) && !empty($legacy['key'])) || (is_array($asen) && !empty($asen['key']))) {
            $info = (is_array($legacy) && !empty($legacy['key'])) ? $legacy : $asen;
            $row['status'] = 'legacy-meta-only';
            $row['bucket'] = isset($info['bucket']) ? $info['bucket'] : '';
            $row['region'] = isset($info['region']) ? $info['region'] : '';
            $row['path'] = $info['key'];
            $row['flags'][] = self::as3cf_table_exists()
                ? 'Legacy S3 meta exists but WP Offload Media has no record'
                : 'as3cf_items table not found; only legacy meta available';
        } else {
            $row['status'] = 'local-only';
        }

        $file = get_attached_file($id);
        if ($file) {
            $row['local_exists'] = file_exists($file);
            $row['local_size'] = $row['local_exists'] ? filesize($file) : null;
        }

        $size = $row['local_size'];
        if ($size === null) {
            $meta = wp_get_attachment_metadata($id);
            $size = (is_array($meta) && !empty($meta['filesize'])) ? (int) $meta['filesize'] : null;
        }
        if ($row['status'] === 'local-only' && $size !== null && $size >= self::LARGE_FILE_BYTES) {
            $row['flags'][] = 'Large local-only file';
        }
        if ($row['status'] === 'local-only' && $row['local_exists'] === false) {
            $row['flags'][] = 'Not offloaded and missing on disk';
        }

        if ($live_check && $row['url'] !== '') {
            $row['live'] = self::head($row['url']);
            if ($row['status'] !== 'local-only' && $row['live']['code'] >= 400) {
                $row['flags'][] = 'Recorded as offloaded but delivery URL returns ' . $row['live']['code'];
            }
            if ($row['live']['size'] !== null && $row['local_size'] !== null && $row['live']['size'] !== (int) $row['local_size']) {
                $row['flags'][] = 'Remote size differs from local file size';
            }
        }

        return $row;
    }

    private static function get_as3cf_record($attachment_id)
    {
        global $wpdb;
        if (!self::as3cf_table_exists()) {
            return null;
        }
        $table = $wpdb->prefix . 'as3cf_items';
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT bucket, region, path FROM {$table} WHERE source_id = %d AND source_type = 'media-library' LIMIT 1",
            $attachment_id
        ), ARRAY_A);
        return ($row && $row['path'] !== '') ? $row : null;
    }

    private static function head($url)
    {
        $res = wp_remote_head($url, array('timeout' => 10, 'redirection' => 3));
        if (is_wp_error($res)) {
            return array('code' => 0, 'size' => null, 'error' => $res->get_error_message());
        }
        $len = wp_remote_retrieve_header($res, 'content-length');
        return array(
            'code'  => (int) wp_remote_retrieve_response_code($res),
            'size'  => $len !== '' ? (int) $len : null,
            'error' => '',
        );
    }

    /** Resolve a post ID or URL to a post ID. */
    public static function resolve_post($input)
    {
        $input = trim((string) $input);
        if ($input === '') {
            return 0;
        }
        if (ctype_digit($input)) {
            return (int) $input;
        }
        return (int) url_to_postid($input);
    }
}
