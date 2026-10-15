<?php
if (!defined('ABSPATH')) {
    exit;
}

class SOI_Admin
{
    const SLUG = 'soi-inspector';

    public static function init()
    {
        add_action('admin_menu', array(__CLASS__, 'menu'));
        add_action('add_meta_boxes', array(__CLASS__, 'metabox'));
    }

    public static function menu()
    {
        add_media_page('S3 Offload Inspector', 'Offload Inspector', 'manage_options', self::SLUG, array(__CLASS__, 'render_page'));
    }

    public static function metabox()
    {
        if (!current_user_can('manage_options')) {
            return;
        }
        foreach (get_post_types(array('public' => true)) as $type) {
            if ($type === 'attachment') {
                continue;
            }
            add_meta_box('soi-box', 'S3 Offload Inspector', array(__CLASS__, 'render_metabox'), $type, 'side', 'low');
        }
    }

    public static function render_metabox($post)
    {
        $url = add_query_arg(array('page' => self::SLUG, 'post' => $post->ID, '_wpnonce' => wp_create_nonce('soi_inspect')), admin_url('upload.php'));
        echo '<p><a class="button" href="' . esc_url($url) . '">Check S3 offload status</a></p>';
    }

    public static function render_page()
    {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('Insufficient permissions.', 's3-offload-inspector'));
        }

        $input = isset($_GET['post']) ? sanitize_text_field(wp_unslash($_GET['post'])) : '';
        $live = !empty($_GET['live']);
        $submitted = $input !== '' && isset($_GET['_wpnonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['_wpnonce'])), 'soi_inspect');

        echo '<div class="wrap"><h1>S3 Offload Inspector</h1>';
        echo '<form method="get"><input type="hidden" name="page" value="' . esc_attr(self::SLUG) . '">';
        wp_nonce_field('soi_inspect', '_wpnonce', false);
        echo '<p><input type="text" name="post" class="regular-text" placeholder="Post ID or URL" value="' . esc_attr($input) . '"> ';
        echo '<label><input type="checkbox" name="live" value="1"' . checked($live, true, false) . '> Live HTTP check</label> ';
        echo '<button class="button button-primary">Inspect</button></p></form>';

        if ($submitted) {
            $post_id = SOI_Status::resolve_post($input);
            $post = $post_id ? get_post($post_id) : null;
            if (!$post) {
                echo '<div class="notice notice-error"><p>Post not found.</p></div></div>';
                return;
            }

            $rows = array();
            foreach (SOI_Collector::collect($post_id) as $item) {
                $rows[] = SOI_Status::inspect($item, $live);
            }

            $counts = array();
            foreach ($rows as $r) {
                $counts[$r['status']] = isset($counts[$r['status']]) ? $counts[$r['status']] + 1 : 1;
            }

            echo '<h2>' . esc_html(get_the_title($post)) . ' (#' . (int) $post_id . ')</h2>';
            if (!SOI_Status::as3cf_table_exists()) {
                echo '<div class="notice notice-warning inline"><p>WP Offload Media table (as3cf_items) not found; falling back to legacy meta.</p></div>';
            }
            $summary = array();
            foreach ($counts as $status => $n) {
                $summary[] = esc_html($status) . ': ' . (int) $n;
            }
            echo '<p><strong>' . (empty($rows) ? 'No media found.' : implode(' | ', $summary)) . '</strong></p>';

            if ($rows) {
                echo '<table class="widefat striped"><thead><tr><th>ID</th><th>Title</th><th>Mime</th><th>Found via</th><th>Status</th><th>Bucket / path</th><th>Local file</th><th>Live</th><th>Flags</th></tr></thead><tbody>';
                foreach ($rows as $r) {
                    $local = $r['local_exists'] === null ? '—' : ($r['local_exists'] ? 'yes (' . size_format($r['local_size'], 2) . ')' : 'missing');
                    $live_txt = $r['live'] === null ? '—' : ($r['live']['error'] !== '' ? $r['live']['error'] : 'HTTP ' . $r['live']['code']);
                    echo '<tr>';
                    echo '<td>' . ($r['attachment_id'] ? '<a href="' . esc_url(get_edit_post_link($r['attachment_id'])) . '">' . (int) $r['attachment_id'] . '</a>' : '—') . '</td>';
                    echo '<td>' . esc_html($r['title'] !== '' ? $r['title'] : $r['url']) . '</td>';
                    echo '<td>' . esc_html($r['mime']) . '</td>';
                    echo '<td>' . esc_html(implode(', ', $r['via'])) . '</td>';
                    echo '<td><strong>' . esc_html($r['status']) . '</strong></td>';
                    echo '<td>' . esc_html(trim($r['bucket'] . ' ' . $r['path'])) . '</td>';
                    echo '<td>' . esc_html($local) . '</td>';
                    echo '<td>' . esc_html($live_txt) . '</td>';
                    echo '<td>' . esc_html(implode('; ', $r['flags'])) . '</td>';
                    echo '</tr>';
                }
                echo '</tbody></table>';
            }
        }
        echo '</div>';
    }
}
