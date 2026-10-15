<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Finds media referenced by a single post.
 * Returns a list of items: array('attachment_id' => int, 'url' => string, 'via' => string[]).
 * Items without an attachment ID are URLs that could not be resolved to the media library.
 */
class SOI_Collector
{
    public static function collect($post_id)
    {
        $post_id = (int) $post_id;
        $found = array();

        $add = function ($attachment_id, $url, $via) use (&$found) {
            $attachment_id = (int) $attachment_id;
            if (!$attachment_id && $url === '') {
                return;
            }
            $key = $attachment_id ? 'id:' . $attachment_id : 'url:' . $url;
            if (!isset($found[$key])) {
                $found[$key] = array('attachment_id' => $attachment_id, 'url' => $url, 'via' => array());
            }
            if (!in_array($via, $found[$key]['via'], true)) {
                $found[$key]['via'][] = $via;
            }
        };

        $post = get_post($post_id);
        if (!$post) {
            return array();
        }

        $children = get_posts(array(
            'post_type'      => 'attachment',
            'post_parent'    => $post_id,
            'post_status'    => 'any',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ));
        foreach ($children as $cid) {
            $add($cid, '', 'attached (post_parent)');
        }

        $thumb = (int) get_post_meta($post_id, '_thumbnail_id', true);
        if ($thumb) {
            $add($thumb, '', 'featured image');
        }

        foreach (get_post_meta($post_id) as $meta_key => $values) {
            if (in_array($meta_key, array('_thumbnail_id', '_edit_lock', '_edit_last'), true)) {
                continue;
            }
            foreach ($values as $raw) {
                foreach (self::extract_from_value(maybe_unserialize($raw)) as $ref) {
                    $resolved = self::resolve($ref);
                    if ($resolved !== null) {
                        $add($resolved['id'], $resolved['url'], 'meta: ' . $meta_key);
                    }
                }
            }
        }

        foreach (self::extract_from_content((string) $post->post_content) as $ref) {
            $resolved = self::resolve($ref);
            if ($resolved !== null) {
                $add($resolved['id'], $resolved['url'], 'content');
            }
        }

        return array_values($found);
    }

    /** Recursively pull candidate IDs / URLs out of a meta value. */
    public static function extract_from_value($value)
    {
        $refs = array();
        if (is_array($value) || is_object($value)) {
            foreach ((array) $value as $v) {
                $refs = array_merge($refs, self::extract_from_value($v));
            }
        } elseif (is_int($value) || (is_string($value) && ctype_digit($value) && strlen($value) < 12)) {
            $refs[] = (int) $value;
        } elseif (is_string($value) && preg_match('#^https?://#i', trim($value))) {
            $refs[] = trim($value);
        }
        return $refs;
    }

    public static function extract_from_content($content)
    {
        $refs = array();
        if (preg_match_all('/wp-image-(\d+)/', $content, $m)) {
            foreach ($m[1] as $id) {
                $refs[] = (int) $id;
            }
        }
        if (preg_match_all('/\[(?:video|audio|playlist|gallery)\b[^\]]*\bids?=["\']?([\d,\s]+)/i', $content, $m)) {
            foreach ($m[1] as $list) {
                foreach (preg_split('/[\s,]+/', trim($list)) as $id) {
                    if ($id !== '') {
                        $refs[] = (int) $id;
                    }
                }
            }
        }
        if (preg_match_all('/<(?:img|video|audio|source)\b[^>]*\bsrc=["\']([^"\']+)["\']/i', $content, $m)) {
            foreach ($m[1] as $url) {
                $refs[] = $url;
            }
        }
        if (preg_match_all('/\[(?:video|audio)\b[^\]]*\b(?:src|mp4|webm|mp3|m4a)=["\']([^"\']+)["\']/i', $content, $m)) {
            foreach ($m[1] as $url) {
                $refs[] = $url;
            }
        }
        return $refs;
    }

    /** Turn an ID or URL into array('id' => int, 'url' => string), or null if it is not media. */
    public static function resolve($ref)
    {
        if (is_int($ref)) {
            return get_post_type($ref) === 'attachment' ? array('id' => $ref, 'url' => '') : null;
        }

        $url = (string) $ref;
        $path = strtolower((string) wp_parse_url($url, PHP_URL_PATH));
        if (!preg_match('/\.(mp4|m4v|webm|mov|mkv|avi|mp3|m4a|wav|ogg|flac|jpe?g|png|gif|webp|avif|svg|pdf|zip|vtt|srt)$/', $path)) {
            return null;
        }

        $id = (int) attachment_url_to_postid($url);
        if (!$id) {
            $id = self::lookup_by_path($path);
        }
        return array('id' => $id, 'url' => $url);
    }

    /** Match an S3/CloudFront URL path to an attachment via _wp_attached_file. */
    private static function lookup_by_path($path)
    {
        global $wpdb;
        $candidates = array(ltrim($path, '/'));
        $uploads = '/' . trim((string) wp_parse_url(wp_get_upload_dir()['baseurl'], PHP_URL_PATH), '/') . '/';
        $pos = strpos($path, $uploads);
        if ($pos !== false) {
            $candidates[] = substr($path, $pos + strlen($uploads));
        }
        foreach ($candidates as $rel) {
            if ($rel === '') {
                continue;
            }
            $id = $wpdb->get_var($wpdb->prepare(
                "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_wp_attached_file' AND meta_value = %s LIMIT 1",
                $rel
            ));
            if ($id) {
                return (int) $id;
            }
        }
        return 0;
    }
}
