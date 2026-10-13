<?php
/**
 * Plugin Name: ASEN AWS S3 Uploader
 * Plugin URI: https://github.com/badrul-abu/KaiserComponent
 * Description: High-speed direct client-to-AWS S3 uploader supporting large files (>5GB up to 5TB) with browser multipart chunking, settings page, and WP Offload Media compatible data management.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: ISC
 * Text Domain: asen-s3-upload
 * Author: Aknel Kaiser
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ASEN_S3_VERSION', '1.0.0');
define('ASEN_S3_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ASEN_S3_PLUGIN_URL', plugin_dir_url(__FILE__));

// Require Core Classes
require_once ASEN_S3_PLUGIN_DIR . 'includes/class-asen-s3-client.php';
require_once ASEN_S3_PLUGIN_DIR . 'includes/class-asen-s3-settings.php';
require_once ASEN_S3_PLUGIN_DIR . 'includes/class-asen-s3-ajax.php';
require_once ASEN_S3_PLUGIN_DIR . 'includes/class-asen-s3-media-manager.php';

// Initialize Components
ASEN_S3_Settings::init();
ASEN_S3_Ajax::init();
ASEN_S3_Media_Manager::init();

/**
 * Add Settings link to plugin actions on the Plugins page.
 */
function asen_s3_plugin_action_links($links)
{
    $settings_link = '<a href="' . esc_url(admin_url('edit.php?post_type=asen_video_post&page=asen-s3-settings')) . '">' . __('Settings', 'asen-s3-upload') . '</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'asen_s3_plugin_action_links');

/**
 * Enqueue frontend web component assets.
 */
function asen_s3_enqueue_uploader_assets()
{
    $settings = ASEN_S3_Settings::get_settings();
    $current_user = wp_get_current_user();
    $client = ASEN_S3_Settings::get_client();

    $uploader_config = array(
        'ajaxUrl'           => admin_url('admin-ajax.php'),
        'nonce'             => wp_create_nonce('asen_s3_client_nonce'),
        'isConfigured'      => ($client !== null),
        'chunkSizeMb'       => (int) $settings['chunk_size_mb'],
        'maxFileSizeGb'     => (int) $settings['max_file_size_gb'],
        'allowedExtensions' => $settings['allowed_extensions'],
        'homeUrl'           => home_url('/'),
        'user'              => array(
            'isLoggedIn' => is_user_logged_in(),
            'name'       => $current_user->exists() ? $current_user->display_name : 'Guest',
            'avatar'     => $current_user->exists() ? get_avatar_url($current_user->ID) : '',
        ),
    );

    wp_enqueue_script(
        'asen-s3-uploader',
        ASEN_S3_PLUGIN_URL . 'assets/asen-s3-uploader.js',
        array(),
        ASEN_S3_VERSION,
        true
    );

    wp_localize_script('asen-s3-uploader', 'asenS3Config', $uploader_config);

    if (file_exists(ASEN_S3_PLUGIN_DIR . 'assets/asen-s3-uploader.css')) {
        wp_enqueue_style(
            'asen-s3-uploader-style',
            ASEN_S3_PLUGIN_URL . 'assets/asen-s3-uploader.css',
            array(),
            ASEN_S3_VERSION
        );
    }
}

/**
 * Shortcode handler: [asen_s3_upload]
 *
 * @param array $atts
 * @return string
 */
function asen_s3_upload_shortcode($atts = array())
{
    $settings = ASEN_S3_Settings::get_settings();

    $atts = shortcode_atts(array(
        'component_title'=> 'Upload',
        'header'         => 'yes',
        'allow_multiple' => 'yes',
        'theme'          => 'light',
    ), $atts, 'asen_s3_upload');

    asen_s3_enqueue_uploader_assets();

    $client = ASEN_S3_Settings::get_client();
    $is_configured = ($client !== null) ? 'yes' : 'no';

    return sprintf(
        '<asen-s3-uploader component-title="%1$s" show-header="%2$s" allow-multiple="%3$s" theme="%4$s" configured="%5$s" max-file-size="%6$d" chunk-size="%7$d"></asen-s3-uploader>',
        esc_attr($atts['component_title']),
        esc_attr($atts['header']),
        esc_attr($atts['allow_multiple']),
        esc_attr($atts['theme']),
        esc_attr($is_configured),
        (int) $settings['max_file_size_gb'],
        (int) $settings['chunk_size_mb']
    );
}
add_shortcode('asen_s3_upload', 'asen_s3_upload_shortcode');
