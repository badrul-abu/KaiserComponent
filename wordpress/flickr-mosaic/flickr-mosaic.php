<?php
/**
 * Plugin Name: Flickr Mosaic
 * Description: Displays the Flickr Mosaic photo gallery with the [flickr-mosaic] shortcode.
 * Version: 1.0.5
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: ISC
 * Text Domain: flickr-mosaic
 * Author: Aknel Kaiser
 * Author URI: https://github.com/badrul-abu/KaiserComponent
 */

if (!defined('ABSPATH')) {
    exit;
}

define('FLICKR_MOSAIC_VERSION', '1.0.5');

function flickr_mosaic_enqueue_assets()
{
    $asset_url = plugins_url('assets/', __FILE__);

    wp_enqueue_style(
        'flickr-mosaic',
        $asset_url . 'flickr-mosaic.css',
        array(),
        FLICKR_MOSAIC_VERSION
    );
    wp_enqueue_script(
        'flickr-mosaic',
        $asset_url . 'flickr-mosaic.js',
        array(),
        FLICKR_MOSAIC_VERSION,
        true
    );
}

function flickr_mosaic_enqueue_for_content()
{
    if (!is_singular()) {
        return;
    }

    $post = get_queried_object();
    if ($post instanceof WP_Post && has_shortcode($post->post_content, 'flickr-mosaic')) {
        flickr_mosaic_enqueue_assets();
    }
}
add_action('wp_enqueue_scripts', 'flickr_mosaic_enqueue_for_content');

function flickr_mosaic_css_length($value, $fallback)
{
    $value = trim((string) $value);
    if (preg_match('/\A(?:0|(?:\d+(?:\.\d+)?|\.\d+)(?:px|%|em|rem|vw|vh|vmin|vmax))\z/i', $value)) {
        return $value;
    }

    return $fallback;
}

function flickr_mosaic_shortcode($attributes = array())
{
    $attributes = shortcode_atts(
        array(
            'width' => '100%',
            'height' => '500px',
            'columns' => '5',
            'gap' => '10px',
            'background-color' => '#1d1d1f',
            'border-color' => '#1d1d1f',
        ),
        $attributes,
        'flickr-mosaic'
    );

    $columns = filter_var($attributes['columns'], FILTER_VALIDATE_INT);
    if ($columns === false) {
        $columns = 5;
    }
    $columns = min(12, max(1, $columns));

    $background_color = sanitize_hex_color($attributes['background-color']);
    $border_color = sanitize_hex_color($attributes['border-color']);

    flickr_mosaic_enqueue_assets();

    return sprintf(
        '<flickr-mosaic width="%1$s" height="%2$s" columns="%3$d" gap="%4$s" background-color="%5$s" border-color="%6$s" flickr-logo-url="%7$s"></flickr-mosaic>',
        esc_attr(flickr_mosaic_css_length($attributes['width'], '100%')),
        esc_attr(flickr_mosaic_css_length($attributes['height'], '500px')),
        $columns,
        esc_attr(flickr_mosaic_css_length($attributes['gap'], '10px')),
        esc_attr($background_color ? $background_color : '#1d1d1f'),
        esc_attr($border_color ? $border_color : '#1d1d1f'),
        esc_url(plugins_url('assets/flickr-logo.png', __FILE__))
    );
}
add_shortcode('flickr-mosaic', 'flickr_mosaic_shortcode');
