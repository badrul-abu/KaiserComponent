<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Inspect S3 offload status of media attached to a post.
 */
class SOI_CLI
{
    /**
     * Upload one local attachment to S3 (multipart) and register it in WP Offload Media.
     *
     * ## OPTIONS
     *
     * <attachment_id>
     * : Attachment ID.
     *
     * [--dry-run]
     * : Show the target bucket/key only.
     *
     * [--delete-local]
     * : Remove local files after the upload is verified and registered.
     *
     * [--keep-meta]
     * : Do not rewrite post meta that holds the old local URL.
     *
     * [--part-size-mb=<mb>]
     * : Multipart part size. Default 64.
     *
     * @when after_wp_load
     */
    public function migrate($args, $assoc_args)
    {
        $result = SOI_Migrator::migrate((int) $args[0], array(
            'dry_run'      => !empty($assoc_args['dry-run']),
            'delete_local' => !empty($assoc_args['delete-local']),
            'update_meta'  => empty($assoc_args['keep-meta']),
            'part_size_mb' => isset($assoc_args['part-size-mb']) ? (int) $assoc_args['part-size-mb'] : 64,
            'logger'       => function ($m) {
                WP_CLI::log($m);
            },
        ));
        if (is_wp_error($result)) {
            WP_CLI::error($result->get_error_message());
        }
        WP_CLI::success(wp_json_encode($result));
    }

    /**
     * Rewrite post meta holding the old local URL of an already offloaded attachment.
     *
     * ## OPTIONS
     *
     * <attachment_id>
     * : Attachment ID.
     *
     * [--dry-run]
     * : List the meta that would change.
     *
     * @when after_wp_load
     */
    public function fix_meta($args, $assoc_args)
    {
        $n = SOI_Migrator::fix_meta((int) $args[0], !empty($assoc_args['dry-run']), function ($m) {
            WP_CLI::log($m);
        });
        if (is_wp_error($n)) {
            WP_CLI::error($n->get_error_message());
        }
        WP_CLI::success($n . ' meta value(s) ' . (!empty($assoc_args['dry-run']) ? 'would be updated.' : 'updated.'));
    }

    /**
     * Remove the local files of an offloaded attachment via WP Offload Media (verifies S3 first).
     *
     * ## OPTIONS
     *
     * <attachment_id>
     * : Attachment ID.
     *
     * @when after_wp_load
     */
    public function remove_local($args)
    {
        $r = SOI_Migrator::remove_local((int) $args[0], function ($m) {
            WP_CLI::log($m);
        });
        if (is_wp_error($r)) {
            WP_CLI::error($r->get_error_message());
        }
        WP_CLI::success($r ? 'Local files removed.' : 'Nothing was removed.');
    }

    /**
     * Check a post.
     *
     * ## OPTIONS
     *
     * <post>
     * : Post ID or URL.
     *
     * [--live]
     * : Perform an HTTP HEAD request against each delivery URL.
     *
     * [--format=<format>]
     * : table, json, csv. Default table.
     *
     * @when after_wp_load
     */
    public function check($args, $assoc_args)
    {
        $post_id = SOI_Status::resolve_post($args[0]);
        if (!$post_id || !get_post($post_id)) {
            WP_CLI::error('Post not found.');
        }
        $live = !empty($assoc_args['live']);
        $out = array();
        foreach (SOI_Collector::collect($post_id) as $item) {
            $r = SOI_Status::inspect($item, $live);
            $out[] = array(
                'attachment_id' => $r['attachment_id'],
                'mime'          => $r['mime'],
                'via'           => implode(', ', $r['via']),
                'status'        => $r['status'],
                'path'          => $r['path'] !== '' ? $r['path'] : $r['url'],
                'local_exists'  => $r['local_exists'] === null ? '' : ($r['local_exists'] ? 'yes' : 'no'),
                'local_size'    => $r['local_size'],
                'flags'         => implode('; ', $r['flags']),
            );
        }
        if (!$out) {
            WP_CLI::warning('No media found for this post.');
            return;
        }
        $format = isset($assoc_args['format']) ? $assoc_args['format'] : 'table';
        WP_CLI\Utils\format_items($format, $out, array_keys($out[0]));
    }
}
