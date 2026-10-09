<?php
/**
 * Plugin Name: ABU GA Firebase Storage PDF
 * Description: Displays programme PDFs stored in Firestore with the [firebase_programme_pdf] shortcode, using a Lit PDF reader component.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: ISC
 * Text Domain: custom-programme-pdf
 * Author: Aknel Kaiser
 */

if (!defined('ABSPATH')) {
    exit;
}

define('CUSTOM_PDF_VERSION', '1.0.0');
define('CUSTOM_PDF_OPTION', 'custom_programme_pdf_settings');

function custom_pdf_defaults()
{
    return array(
        'project_id' => 'abu-ga-2024-1bec1',
        'collection' => 'programme',
        'slug_field' => 'programme',
        'pdf_field' => 'pdf',
        'direct_hosts' => "firebasestorage.googleapis.com",
        'proxy_hosts' => "firebasestorage.googleapis.com\nga2026srilanka.abu.org.my",
        'default_width' => '600px',
        'default_height' => '849px',
        'cache_minutes' => 10,
        'pdfjs_url' => 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'pdfjs_worker_url' => 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    );
}

function custom_pdf_settings()
{
    $saved = get_option(CUSTOM_PDF_OPTION, array());
    return wp_parse_args(is_array($saved) ? $saved : array(), custom_pdf_defaults());
}

function custom_pdf_css_length($value, $fallback)
{
    $value = trim((string) $value);
    if (preg_match('/\A(?:\d+(?:\.\d+)?)(?:px|%|em|rem|vh|vw)\z/', $value)) {
        return $value;
    }
    return $fallback;
}

function custom_pdf_host_list($text)
{
    $hosts = preg_split('/[\s,]+/', strtolower((string) $text), -1, PREG_SPLIT_NO_EMPTY);
    return array_values(array_unique(array_filter(array_map(function ($host) {
        return preg_replace('/[^a-z0-9.\-]/', '', $host);
    }, $hosts))));
}

/* ---------------------------------------------------------------- Settings */

function custom_pdf_sanitize_settings($input)
{
    $defaults = custom_pdf_defaults();
    $input = is_array($input) ? $input : array();
    $out = array();

    foreach (array('project_id', 'collection', 'slug_field', 'pdf_field') as $key) {
        $value = isset($input[$key]) ? preg_replace('/[^A-Za-z0-9_\-.]/', '', (string) $input[$key]) : '';
        $out[$key] = $value !== '' ? $value : $defaults[$key];
    }
    foreach (array('direct_hosts', 'proxy_hosts') as $key) {
        $out[$key] = implode("\n", custom_pdf_host_list(isset($input[$key]) ? $input[$key] : ''));
    }
    $out['default_width'] = custom_pdf_css_length(isset($input['default_width']) ? $input['default_width'] : '', $defaults['default_width']);
    $out['default_height'] = custom_pdf_css_length(isset($input['default_height']) ? $input['default_height'] : '', $defaults['default_height']);
    $out['cache_minutes'] = isset($input['cache_minutes']) ? min(1440, max(0, (int) $input['cache_minutes'])) : $defaults['cache_minutes'];
    foreach (array('pdfjs_url', 'pdfjs_worker_url') as $key) {
        $url = isset($input[$key]) ? esc_url_raw(trim((string) $input[$key]), array('https')) : '';
        $out[$key] = $url ? $url : $defaults[$key];
    }

    custom_pdf_flush_cache();
    return $out;
}

function custom_pdf_register_settings()
{
    register_setting('custom_programme_pdf', CUSTOM_PDF_OPTION, array(
        'type' => 'array',
        'sanitize_callback' => 'custom_pdf_sanitize_settings',
        'default' => custom_pdf_defaults(),
    ));
}
add_action('admin_init', 'custom_pdf_register_settings');

function custom_pdf_admin_menu()
{
    add_options_page('Firebase Storage PDF', 'Firebase Storage PDF', 'manage_options', 'custom-programme-pdf', 'custom_pdf_settings_page');
}
add_action('admin_menu', 'custom_pdf_admin_menu');

function custom_pdf_action_links($links)
{
    array_unshift($links, '<a href="' . esc_url(admin_url('options-general.php?page=custom-programme-pdf')) . '">Settings</a>');
    return $links;
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'custom_pdf_action_links');

function custom_pdf_field($key, $label, $description = '', $type = 'text', $textarea = false)
{
    $settings = custom_pdf_settings();
    $name = CUSTOM_PDF_OPTION . '[' . $key . ']';
    echo '<tr><th scope="row"><label for="custom-pdf-' . esc_attr($key) . '">' . esc_html($label) . '</label></th><td>';
    if ($textarea) {
        printf('<textarea id="custom-pdf-%1$s" name="%2$s" rows="3" class="large-text code">%3$s</textarea>', esc_attr($key), esc_attr($name), esc_textarea($settings[$key]));
    } else {
        printf('<input id="custom-pdf-%1$s" name="%2$s" type="%4$s" value="%3$s" class="regular-text" />', esc_attr($key), esc_attr($name), esc_attr($settings[$key]), esc_attr($type));
    }
    if ($description) {
        echo '<p class="description">' . esc_html($description) . '</p>';
    }
    echo '</td></tr>';
}

function custom_pdf_settings_page()
{
    if (!current_user_can('manage_options')) {
        return;
    }
    ?>
    <div class="wrap">
        <h1>Firebase Storage PDF</h1>
        <form method="post" action="options.php">
            <?php settings_fields('custom_programme_pdf'); ?>
            <h2>Firestore source</h2>
            <table class="form-table" role="presentation">
                <?php
                custom_pdf_field('project_id', 'Firebase project ID');
                custom_pdf_field('collection', 'Collection', 'Firestore collection that holds programme documents.');
                custom_pdf_field('slug_field', 'Programme field', 'String field matched against the shortcode "programme" attribute.');
                custom_pdf_field('pdf_field', 'PDF URL field', 'String field containing the PDF URL.');
                custom_pdf_field('cache_minutes', 'Cache (minutes)', 'How long Firestore lookups are cached. 0 disables caching.', 'number');
                ?>
            </table>
            <h2>PDF delivery</h2>
            <table class="form-table" role="presentation">
                <?php
                custom_pdf_field('direct_hosts', 'Direct hosts', 'One per line. PDFs on these hosts are loaded straight from the browser (host must send CORS headers).', 'text', true);
                custom_pdf_field('proxy_hosts', 'Allowed proxy hosts', 'One per line. All other PDFs are streamed through WordPress, only from these hosts.', 'text', true);
                custom_pdf_field('pdfjs_url', 'PDF.js script URL', 'HTTPS URL of pdf.min.js (v3.x).', 'url');
                custom_pdf_field('pdfjs_worker_url', 'PDF.js worker URL', 'HTTPS URL of pdf.worker.min.js.', 'url');
                ?>
            </table>
            <h2>Viewer defaults</h2>
            <table class="form-table" role="presentation">
                <?php
                custom_pdf_field('default_width', 'Default width', 'e.g. 600px, 100%.');
                custom_pdf_field('default_height', 'Default height', 'e.g. 849px, 80vh.');
                ?>
            </table>
            <?php submit_button(); ?>
        </form>
        <h2>Usage</h2>
        <p><code>[firebase_programme_pdf programme="technical" width="600px" height="849px"]</code></p>
    </div>
    <?php
}

/* ------------------------------------------------------------------- Proxy */

function custom_pdf_proxy()
{
    $settings = custom_pdf_settings();
    $pdf_url = isset($_GET['url']) ? esc_url_raw(wp_unslash($_GET['url'])) : '';
    $signature = isset($_GET['sig']) ? sanitize_text_field(wp_unslash($_GET['sig'])) : '';

    if (!$pdf_url || !$signature || !hash_equals(wp_hash($pdf_url), $signature)) {
        wp_die('Invalid PDF request.', '', array('response' => 403));
    }

    $host = strtolower((string) wp_parse_url($pdf_url, PHP_URL_HOST));
    if (!in_array($host, custom_pdf_host_list($settings['proxy_hosts']), true)) {
        wp_die('PDF host is not allowed.', '', array('response' => 403));
    }

    $headers = array();
    if (!empty($_SERVER['HTTP_RANGE'])) {
        $headers['Range'] = sanitize_text_field(wp_unslash($_SERVER['HTTP_RANGE']));
    }

    $response = wp_remote_get($pdf_url, array('timeout' => 30, 'redirection' => 3, 'headers' => $headers));
    if (is_wp_error($response)) {
        wp_die('Unable to retrieve the PDF.', '', array('response' => 502));
    }

    $status = wp_remote_retrieve_response_code($response);
    if (!in_array($status, array(200, 206), true)) {
        wp_die('Unable to retrieve the PDF.', '', array('response' => 502));
    }

    status_header($status);
    header('Content-Type: application/pdf');
    header('Content-Disposition: inline; filename="programme.pdf"');
    header('Accept-Ranges: bytes');
    header('Cache-Control: private, max-age=3600');

    // Use the decoded body length; the upstream header can describe a compressed payload.
    $body = wp_remote_retrieve_body($response);
    $content_range = wp_remote_retrieve_header($response, 'content-range');
    header('Content-Length: ' . strlen($body));
    if ($content_range) {
        header('Content-Range: ' . $content_range);
    }

    echo $body; // phpcs:ignore WordPress.Security.EscapeOutput
    exit;
}
add_action('wp_ajax_custom_programme_pdf_proxy', 'custom_pdf_proxy');
add_action('wp_ajax_nopriv_custom_programme_pdf_proxy', 'custom_pdf_proxy');

/* --------------------------------------------------------------- Shortcode */

function custom_pdf_cache_key($settings)
{
    return 'custom_pdf_' . md5($settings['project_id'] . '|' . $settings['collection'] . '|' . $settings['slug_field'] . '|' . $settings['pdf_field']);
}

function custom_pdf_flush_cache()
{
    global $wpdb;
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '\\_transient\\_custom\\_pdf\\_%' OR option_name LIKE '\\_transient\\_timeout\\_custom\\_pdf\\_%'");
}

// Returns a map of programme slug => PDF URL, or null on failure.
function custom_pdf_fetch_map($settings)
{
    $key = custom_pdf_cache_key($settings);
    $cached = $settings['cache_minutes'] > 0 ? get_transient($key) : false;
    if (is_array($cached)) {
        return $cached;
    }

    $url = sprintf(
        'https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents/%s?pageSize=100',
        rawurlencode($settings['project_id']),
        rawurlencode($settings['collection'])
    );
    $response = wp_remote_get($url, array('timeout' => 15));
    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        return null;
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    $map = array();
    foreach ((isset($body['documents']) && is_array($body['documents'])) ? $body['documents'] : array() as $document) {
        $fields = isset($document['fields']) ? $document['fields'] : array();
        $slug = isset($fields[$settings['slug_field']]['stringValue']) ? $fields[$settings['slug_field']]['stringValue'] : '';
        $pdf = isset($fields[$settings['pdf_field']]['stringValue']) ? $fields[$settings['pdf_field']]['stringValue'] : '';
        if ($slug !== '' && !isset($map[$slug])) {
            $map[$slug] = $pdf;
        }
    }

    if ($settings['cache_minutes'] > 0) {
        set_transient($key, $map, $settings['cache_minutes'] * MINUTE_IN_SECONDS);
    }
    return $map;
}

function custom_pdf_shortcode($atts = array())
{
    $settings = custom_pdf_settings();
    $atts = shortcode_atts(array(
        'programme' => 'technical',
        'width' => $settings['default_width'],
        'height' => $settings['default_height'],
        'continuous' => 'no',
    ), $atts, 'firebase_programme_pdf');

    $map = custom_pdf_fetch_map($settings);
    $slug = sanitize_text_field($atts['programme']);
    $pdf_url = isset($map[$slug]) ? $map[$slug] : '';
    if (!$pdf_url || !wp_http_validate_url($pdf_url) || strpos($pdf_url, 'https://') !== 0) {
        return '';
    }

    $width = custom_pdf_css_length($atts['width'], $settings['default_width']);
    $height = custom_pdf_css_length($atts['height'], $settings['default_height']);

    $host = strtolower((string) wp_parse_url($pdf_url, PHP_URL_HOST));
    $viewer_url = $pdf_url;
    if (!in_array($host, custom_pdf_host_list($settings['direct_hosts']), true)) {
        $viewer_url = add_query_arg(array(
            'action' => 'custom_programme_pdf_proxy',
            'url' => $pdf_url,
            'sig' => wp_hash($pdf_url),
        ), admin_url('admin-ajax.php'));
    }

    $continuous = in_array(strtolower((string) $atts['continuous']), array('yes', 'true', '1'), true) ? ' continuous' : '';

    wp_enqueue_script('custom-pdf-reader', plugins_url('assets/custom-pdf-reader.js', __FILE__), array(), CUSTOM_PDF_VERSION, true);

    return sprintf(
        '<custom-pdf-reader pdf-url="%1$s" width="%2$s" height="%3$s" pdfjs-url="%4$s" pdfjs-worker-url="%5$s"%6$s></custom-pdf-reader>',
        esc_url($viewer_url),
        esc_attr($width),
        esc_attr($height),
        esc_url($settings['pdfjs_url']),
        esc_url($settings['pdfjs_worker_url']),
        $continuous
    );
}
add_shortcode('firebase_programme_pdf', 'custom_pdf_shortcode');
