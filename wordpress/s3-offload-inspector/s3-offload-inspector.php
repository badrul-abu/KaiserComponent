<?php
/**
 * Plugin Name: S3 Offload Inspector
 * Description: Read-only tool. Give it a post and it reports which attached media is offloaded to S3 and which is still local-only.
 * Version: 0.1.0
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 * Text Domain: s3-offload-inspector
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SOI_VERSION', '0.1.0');
define('SOI_DIR', plugin_dir_path(__FILE__));

require_once SOI_DIR . 'includes/class-soi-collector.php';
require_once SOI_DIR . 'includes/class-soi-status.php';
require_once SOI_DIR . 'includes/class-soi-admin.php';
require_once SOI_DIR . 'includes/class-soi-migrator.php';

SOI_Admin::init();

if (defined('WP_CLI') && WP_CLI) {
    require_once SOI_DIR . 'includes/class-soi-cli.php';
    WP_CLI::add_command('soi', 'SOI_CLI');
}
