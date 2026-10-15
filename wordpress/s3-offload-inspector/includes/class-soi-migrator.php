<?php
if (!defined('ABSPATH')) {
    exit;
}

use DeliciousBrains\WP_Offload_Media\Items\Media_Library_Item;
use DeliciousBrains\WP_Offload_Media\Items\Remove_Local_Handler;
use DeliciousBrains\WP_Offload_Media\Providers\Storage\Storage_Provider;

/**
 * Migrates ONE existing local attachment to S3 and registers it in WP Offload Media (v3.x).
 *
 * WP Offload Media's own Upload_Handler uploads with a single putObject call, which S3 limits to 5 GB.
 * Larger files therefore never offload. This class builds the item with Offload Media's own API
 * (bucket, region, path, versioning), uploads with the bundled AWS SDK MultipartUploader,
 * verifies the object, and then saves the item row.
 */
class SOI_Migrator
{
    const MULTIPART_THRESHOLD = 1073741824; // 1 GB; anything below uses Offload Media's own putObject path.

    /** The AWS S3Client is a private property of the storage provider, so read it by reflection. */
    private static function get_s3_client($as3cf, $region)
    {
        $provider = $as3cf->get_provider_client($region);
        $ref = new ReflectionObject($provider);
        while ($ref && !$ref->hasProperty('s3_client')) {
            $ref = $ref->getParentClass();
        }
        if (!$ref) {
            return null;
        }
        $prop = $ref->getProperty('s3_client');
        $prop->setAccessible(true);
        $client = $prop->getValue($provider);
        return is_object($client) ? $client : null;
    }

    /**
     * @param int   $attachment_id
     * @param array $opts dry_run, delete_local, part_size_mb, logger (callable)
     * @return array|WP_Error
     */
    public static function migrate($attachment_id, array $opts = array())
    {
        global $as3cf;

        $opts = array_merge(array('dry_run' => false, 'delete_local' => false, 'update_meta' => true, 'part_size_mb' => 64, 'logger' => null), $opts);
        $log = is_callable($opts['logger']) ? $opts['logger'] : function () {
        };

        $attachment_id = (int) $attachment_id;
        if (get_post_type($attachment_id) !== 'attachment') {
            return new WP_Error('soi_not_attachment', 'Not an attachment.');
        }
        if (empty($as3cf) || !class_exists(Media_Library_Item::class)) {
            return new WP_Error('soi_no_offload', 'WP Offload Media (3.x) is not active.');
        }
        if (Media_Library_Item::get_by_source_id($attachment_id)) {
            return new WP_Error('soi_already', 'Attachment already has a WP Offload Media record.');
        }

        $item = Media_Library_Item::create_from_source_id($attachment_id);
        if (is_wp_error($item)) {
            return $item;
        }

        $primary = $item::primary_object_key();
        $local_url = $item->get_local_url();
        $bucket = $item->bucket();
        $region = $item->region();

        $local = $item->full_source_path($primary);
        if (!is_readable($local)) {
            return new WP_Error('soi_no_file', 'Local file missing or unreadable: ' . $local);
        }
        $mime = AS3CF_Utils::get_mime_type($local);
        $allowed = $as3cf->get_allowed_mime_types();
        if (!in_array($mime, $allowed, true)) {
            return new WP_Error('soi_mime', 'Mime type not allowed by WP Offload Media: ' . $mime);
        }

        // Only objects that exist locally are offloaded (same rule as Offload Media's Upload_Handler).
        $objects = $item->objects();
        $plan = array();
        foreach ($objects as $object_key => $object) {
            $source = $item->full_source_path($object_key);
            if (!file_exists($source)) {
                if ($object_key === $primary) {
                    return new WP_Error('soi_no_file', 'Primary file missing: ' . $source);
                }
                unset($objects[$object_key]);
                continue;
            }
            $plan[$object_key] = $source;
        }

        $acl_default = $as3cf->get_storage_provider()->get_default_acl();
        $report = array(
            'attachment_id' => $attachment_id,
            'bucket'        => $bucket,
            'region'        => $region,
            'key'           => $item->path($primary),
            'files'         => count($plan),
            'bytes'         => filesize($local),
            'uploaded'      => false,
            'registered'    => false,
            'meta_updated'  => 0,
            'local_deleted' => false,
        );
        $log(sprintf('Target s3://%s/%s (%s, %d file(s))', $bucket, $report['key'], size_format($report['bytes'], 2), count($plan)));
        if ($opts['dry_run']) {
            return $report;
        }

        $client = self::get_s3_client($as3cf, $region);
        if (!$client) {
            return new WP_Error('soi_no_client', 'Could not obtain the S3 client from WP Offload Media.');
        }

        // Primary file first, so a failure leaves no partial state registered.
        uksort($plan, function ($a, $b) use ($primary) {
            return $a === $primary ? -1 : ($b === $primary ? 1 : 0);
        });

        foreach ($plan as $object_key => $source) {
            $source_file = $objects[$object_key]['source_file'];

            $is_private = apply_filters('as3cf_upload_object_key_as_private', $item->is_private($object_key), $object_key, $item);
            $item->set_is_private($is_private, $object_key);

            $args = array(
                'Bucket'       => $bucket,
                'Key'          => $item->path($object_key),
                'SourceFile'   => $source,
                'ContentType'  => AS3CF_Utils::get_mime_type($source_file),
                'CacheControl' => 'max-age=31536000',
            );
            $acl = $item->is_private($object_key) ? $as3cf->get_storage_provider()->get_private_acl() : $acl_default;
            if (!empty($acl) && $as3cf->use_acl_for_intermediate_size(0, $object_key, $bucket, $item)) {
                $args['ACL'] = $acl;
            }
            $args = Storage_Provider::filter_object_meta($args, $item, $object_key);
            $args['Bucket'] = $bucket; // an existing-bucket change via filter is not supported here
            $args['Key'] = $item->path($object_key);
            if ($item->is_private($object_key)) {
                $args['Key'] = $item->provider_key($object_key);
            }

            $res = self::upload($as3cf, $client, $region, $args, (int) $opts['part_size_mb'], $log);
            if (is_wp_error($res)) {
                return $res;
            }

            if ($object_key === $primary) {
                try {
                    $head = $client->headObject(array('Bucket' => $args['Bucket'], 'Key' => $args['Key']));
                } catch (\Exception $e) {
                    return new WP_Error('soi_verify', 'Verification failed: ' . $e->getMessage());
                }
                if ((int) $head['ContentLength'] !== (int) filesize($source)) {
                    return new WP_Error('soi_verify', sprintf('Size mismatch: local %d, remote %d', filesize($source), $head['ContentLength']));
                }
                $log('Primary object verified (size matches).');
            }
        }
        $report['uploaded'] = true;

        $item->set_objects($objects);
        $saved = $item->save();
        if (is_wp_error($saved)) {
            return $saved;
        }
        do_action('as3cf_post_upload_item', $item);
        $report['registered'] = true;
        $log('Registered in WP Offload Media (as3cf_items id ' . $item->id() . ').');

        if ($opts['update_meta'] && $local_url) {
            $updated = self::replace_meta_urls($attachment_id, $local_url, $log);
            $report['meta_updated'] = is_wp_error($updated) ? 0 : $updated;
            if (is_wp_error($updated)) {
                $log('Meta update skipped: ' . $updated->get_error_message());
            }
        }

        if ($opts['delete_local']) {
            $handler = $as3cf->get_item_handler(Remove_Local_Handler::get_item_handler_key_name());
            $removed = $handler->handle($item);
            if (is_wp_error($removed)) {
                $log('Remove-local reported: ' . $removed->get_error_message());
            } else {
                $report['local_deleted'] = (bool) $removed;
                $log('Local files removed via WP Offload Media.');
            }
        }

        return $report;
    }

    /**
     * Point post meta that stores the attachment's old local URL (e.g. beeteam368_video_url)
     * at the offloaded URL. Offload Media rewrites attachment URLs and post content, but not arbitrary post meta.
     * Serialized values are reported and left untouched.
     *
     * @return int|WP_Error number of meta rows updated
     */
    public static function replace_meta_urls($attachment_id, $old_url, $log = null, $dry_run = false)
    {
        global $wpdb;
        $log = is_callable($log) ? $log : function () {
        };

        $new_url = wp_get_attachment_url($attachment_id);
        if (!$new_url || $new_url === $old_url) {
            return new WP_Error('soi_url', 'Attachment URL is not rewritten to S3 (is it offloaded?).');
        }

        $filename = wp_basename((string) wp_parse_url($new_url, PHP_URL_PATH));
        $log('Offloaded URL: ' . $new_url);
        $log('Old local URL searched: ' . $old_url);

        // Search by filename so other hosts / CDN domains / relative paths are found too.
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT meta_id, post_id, meta_key, meta_value FROM {$wpdb->postmeta} WHERE meta_value LIKE %s AND meta_key NOT LIKE %s",
            '%' . $wpdb->esc_like($filename) . '%',
            $wpdb->esc_like('_wp_') . '%'
        ));
        if (!$rows) {
            $log('No post meta contains the file name ' . $filename);
            return 0;
        }

        $pattern = '#(?:https?:)?//[^\s"\'<>\]\[]*?' . preg_quote($filename, '#') . '#i';
        $count = 0;
        foreach ($rows as $row) {
            $where = sprintf('post %d meta %s', $row->post_id, $row->meta_key);
            if (is_serialized($row->meta_value)) {
                $log('  skipped (serialized) ' . $where);
                continue;
            }
            if (strpos($row->meta_value, $new_url) !== false && !preg_match_all($pattern, str_replace($new_url, '', $row->meta_value))) {
                $log('  already offloaded ' . $where);
                continue;
            }
            $value = str_replace($new_url, "\0soi\0", $row->meta_value);
            $replaced = preg_replace($pattern, $new_url, $value, -1, $n);
            $replaced = str_replace("\0soi\0", $new_url, $replaced);
            if (!$n) {
                $log(sprintf('  no URL match, value is: %s (%s)', mb_substr($row->meta_value, 0, 120), $where));
                continue;
            }
            $log(sprintf('  %s %s: %s', $dry_run ? 'would update' : 'updating', $where, mb_substr($row->meta_value, 0, 120)));
            if (!$dry_run) {
                update_metadata_by_mid('post', $row->meta_id, $replaced);
            }
            $count++;
        }
        return $count;
    }

    /** Update meta for an attachment that is already offloaded. */
    public static function fix_meta($attachment_id, $dry_run = false, $log = null)
    {
        $item = Media_Library_Item::get_by_source_id((int) $attachment_id);
        if (!$item) {
            return new WP_Error('soi_not_offloaded', 'Attachment has no WP Offload Media record.');
        }
        return self::replace_meta_urls((int) $attachment_id, $item->get_local_url(), $log, $dry_run);
    }

    /** Remove local files through Offload Media, after confirming the S3 object exists with the right size. */
    public static function remove_local($attachment_id, $log = null)
    {
        global $as3cf;
        $log = is_callable($log) ? $log : function () {
        };

        $item = Media_Library_Item::get_by_source_id((int) $attachment_id);
        if (!$item) {
            return new WP_Error('soi_not_offloaded', 'Attachment has no WP Offload Media record.');
        }
        $primary = $item::primary_object_key();
        $local = $item->full_source_path($primary);
        if (!file_exists($local)) {
            return new WP_Error('soi_no_local', 'Local file already gone.');
        }

        $client = self::get_s3_client($as3cf, $item->region());
        if (!$client) {
            return new WP_Error('soi_no_client', 'Could not obtain the S3 client from WP Offload Media.');
        }
        try {
            $head = $client->headObject(array('Bucket' => $item->bucket(), 'Key' => $item->provider_key($primary)));
        } catch (\Exception $e) {
            return new WP_Error('soi_verify', 'S3 object not found, local file kept: ' . $e->getMessage());
        }
        if ((int) $head['ContentLength'] !== (int) filesize($local)) {
            return new WP_Error('soi_verify', 'S3 size differs from local file, local file kept.');
        }
        $log('S3 object verified. Removing local files via WP Offload Media.');

        $handler = $as3cf->get_item_handler(Remove_Local_Handler::get_item_handler_key_name());
        $removed = $handler->handle($item);
        return is_wp_error($removed) ? $removed : (bool) $removed;
    }

    private static function upload($as3cf, $client, $region, array $args, $part_mb, $log)
    {
        $source = $args['SourceFile'];
        $size = filesize($source);

        if ($size < self::MULTIPART_THRESHOLD) {
            try {
                $as3cf->get_provider_client($region)->upload_object($args);
            } catch (\Exception $e) {
                return new WP_Error('soi_put', 'Upload failed: ' . $e->getMessage());
            }
            return true;
        }

        $uploader_class = 'DeliciousBrains\\WP_Offload_Media\\Aws3\\Aws\\S3\\MultipartUploader';
        $exception_class = 'DeliciousBrains\\WP_Offload_Media\\Aws3\\Aws\\Exception\\MultipartUploadException';
        if (!class_exists($uploader_class)) {
            return new WP_Error('soi_sdk', 'Bundled AWS MultipartUploader not found.');
        }

        $params = $args;
        unset($params['SourceFile'], $params['Bucket'], $params['Key']);
        $part_size = max(5, $part_mb) * 1048576;
        while ($size / $part_size > 9000) {
            $part_size *= 2;
        }

        $state = null;
        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $config = array(
                'bucket'          => $args['Bucket'],
                'key'             => $args['Key'],
                'part_size'       => $part_size,
                'concurrency'     => 2,
                'before_upload'   => function ($command) use ($log) {
                    $log('  uploading part ' . $command['PartNumber']);
                },
            );
            if (!empty($params['ACL'])) {
                $config['acl'] = $params['ACL'];
            }
            // Object attributes belong on CreateMultipartUpload; the 'params' option only reaches UploadPart.
            $extra = array_diff_key($params, array('ACL' => 1));
            $config['before_initiate'] = function ($command) use ($extra) {
                foreach ($extra as $k => $v) {
                    $command[$k] = $v;
                }
            };
            if ($state) {
                $config['state'] = $state;
            }

            try {
                $uploader = new $uploader_class($client, $source, $config);
                $uploader->upload();
                return true;
            } catch (\Throwable $e) {
                if (is_a($e, $exception_class) && $attempt < 5) {
                    $state = $e->getState();
                    $log('Part failed, resuming (attempt ' . $attempt . '): ' . $e->getMessage());
                    sleep($attempt * 2);
                    continue;
                }
                if (is_a($e, $exception_class)) {
                    try {
                        $client->abortMultipartUpload($e->getState()->getId());
                    } catch (\Throwable $ignored) {
                    }
                }
                return new WP_Error('soi_multipart', 'Multipart upload failed: ' . $e->getMessage());
            }
        }
        return new WP_Error('soi_multipart', 'Multipart upload failed after retries.');
    }
}
