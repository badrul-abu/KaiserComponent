<?php
/**
 * Settings Page and AWS Configuration Manager for ASEN S3 Upload.
 *
 * @package ASEN_S3_Upload
 */

if (!defined('ABSPATH')) {
    exit;
}

class ASEN_S3_Settings
{
    const OPTION_KEY = 'asen_s3_upload_settings';

    /**
     * Get default settings.
     *
     * @return array
     */
    public static function get_defaults()
    {
        return array(
            'aws_access_key_id'     => '',
            'aws_secret_access_key' => '',
            'aws_region'            => 'ap-southeast-1',
            's3_bucket'             => '',
            's3_prefix'             => 'asen-uploads/{year}/{month}/',
            'custom_domain'         => '',
            'storage_class'         => 'STANDARD',
            'chunk_size_mb'         => 10,
            'max_file_size_gb'      => 50,
            'url_expiry_minutes'    => 30,
            'post_type'             => 'asen_video_post',
            'allowed_extensions'    => 'mp4, mov, mxf, wav, mkv, avi, mp3, aac, pdf, doc, docx, csv, xlsx, txt',
        );
    }

    /**
     * Parse and retrieve settings defined via wp-config.php constants.
     *
     * Supports:
     * 1. define( 'ASEN_S3_SETTINGS', serialize( array(
     *        'provider'          => 'aws',
     *        'access-key-id'     => 'AKIAIOSFODNN7EXAMPLE',
     *        'secret-access-key' => 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
     *        'region'            => 'ap-southeast-1', // optional
     *        'bucket'            => 'my-bucket-name', // optional
     *    ) ) );
     * Or a raw array if passed directly in PHP.
     * 2. Also supports individual constants:
     *    ASEN_AWS_ACCESS_KEY_ID, ASEN_AWS_SECRET_ACCESS_KEY, ASEN_AWS_REGION, ASEN_AWS_BUCKET.
     *
     * @return array Array of defined settings keyed by plugin setting names.
     */
    public static function get_config_constant_settings()
    {
        $defined = array();

        // 1. Check ASEN_S3_SETTINGS serialized/array constant (WP Offload Media style)
        if (defined('ASEN_S3_SETTINGS')) {
            $const_val = ASEN_S3_SETTINGS;
            $data = null;
            if (is_string($const_val)) {
                $unserialized = @unserialize($const_val);
                if (is_array($unserialized)) {
                    $data = $unserialized;
                }
            } elseif (is_array($const_val)) {
                $data = $const_val;
            }

            if (is_array($data)) {
                // Map keys with support for both kebab-case and snake_case
                if (!empty($data['access-key-id'])) {
                    $defined['aws_access_key_id'] = trim($data['access-key-id']);
                } elseif (!empty($data['aws_access_key_id'])) {
                    $defined['aws_access_key_id'] = trim($data['aws_access_key_id']);
                }

                if (!empty($data['secret-access-key'])) {
                    $defined['aws_secret_access_key'] = trim($data['secret-access-key']);
                } elseif (!empty($data['aws_secret_access_key'])) {
                    $defined['aws_secret_access_key'] = trim($data['aws_secret_access_key']);
                }

                if (!empty($data['region'])) {
                    $defined['aws_region'] = trim($data['region']);
                } elseif (!empty($data['aws_region'])) {
                    $defined['aws_region'] = trim($data['aws_region']);
                }

                if (!empty($data['bucket'])) {
                    $defined['s3_bucket'] = trim($data['bucket']);
                } elseif (!empty($data['s3_bucket'])) {
                    $defined['s3_bucket'] = trim($data['s3_bucket']);
                }
            }
        }

        // 2. Fallback to individual constants
        if (!isset($defined['aws_access_key_id']) && defined('ASEN_AWS_ACCESS_KEY_ID')) {
            $defined['aws_access_key_id'] = ASEN_AWS_ACCESS_KEY_ID;
        }
        if (!isset($defined['aws_secret_access_key']) && defined('ASEN_AWS_SECRET_ACCESS_KEY')) {
            $defined['aws_secret_access_key'] = ASEN_AWS_SECRET_ACCESS_KEY;
        }
        if (!isset($defined['aws_region']) && defined('ASEN_AWS_REGION')) {
            $defined['aws_region'] = ASEN_AWS_REGION;
        }
        if (!isset($defined['s3_bucket']) && defined('ASEN_AWS_BUCKET')) {
            $defined['s3_bucket'] = ASEN_AWS_BUCKET;
        }

        return $defined;
    }

    /**
     * Check if a specific setting key is defined via wp-config.php.
     *
     * @param string $key Setting key name (e.g. 'aws_access_key_id')
     * @return bool
     */
    public static function is_defined_in_config($key = '')
    {
        $defined = self::get_config_constant_settings();
        if (empty($key)) {
            return !empty($defined);
        }
        return isset($defined[$key]) && $defined[$key] !== '';
    }

    /**
     * Get current settings merged with defaults and wp-config overrides.
     *
     * @return array
     */
    public static function get_settings()
    {
        $saved = get_option(self::OPTION_KEY, array());
        $settings = wp_parse_args(is_array($saved) ? $saved : array(), self::get_defaults());

        // Apply wp-config.php constants overrides
        $constants = self::get_config_constant_settings();
        foreach ($constants as $k => $v) {
            $settings[$k] = $v;
        }

        return $settings;
    }

    /**
     * Get an instantiated S3 client based on current settings.
     *
     * @return ASEN_S3_Client|null
     */
    public static function get_client()
    {
        $settings = self::get_settings();
        if (empty($settings['aws_access_key_id']) || empty($settings['aws_secret_access_key']) || empty($settings['s3_bucket'])) {
            return null;
        }
        return new ASEN_S3_Client(
            $settings['aws_access_key_id'],
            $settings['aws_secret_access_key'],
            $settings['aws_region'],
            $settings['s3_bucket'],
            $settings['custom_domain']
        );
    }

    /**
     * List of AWS Regions.
     *
     * @return array
     */
    public static function get_aws_regions()
    {
        return array(
            'ap-southeast-1' => 'Asia Pacific (Singapore) [ap-southeast-1]',
            'ap-southeast-2' => 'Asia Pacific (Sydney) [ap-southeast-2]',
            'ap-southeast-3' => 'Asia Pacific (Jakarta) [ap-southeast-3]',
            'ap-southeast-4' => 'Asia Pacific (Melbourne) [ap-southeast-4]',
            'ap-south-1'     => 'Asia Pacific (Mumbai) [ap-south-1]',
            'ap-northeast-1' => 'Asia Pacific (Tokyo) [ap-northeast-1]',
            'ap-northeast-2' => 'Asia Pacific (Seoul) [ap-northeast-2]',
            'ap-northeast-3' => 'Asia Pacific (Osaka) [ap-northeast-3]',
            'us-east-1'      => 'US East (N. Virginia) [us-east-1]',
            'us-east-2'      => 'US East (Ohio) [us-east-2]',
            'us-west-1'      => 'US West (N. California) [us-west-1]',
            'us-west-2'      => 'US West (Oregon) [us-west-2]',
            'eu-west-1'      => 'Europe (Ireland) [eu-west-1]',
            'eu-west-2'      => 'Europe (London) [eu-west-2]',
            'eu-west-3'      => 'Europe (Paris) [eu-west-3]',
            'eu-central-1'   => 'Europe (Frankfurt) [eu-central-1]',
            'me-south-1'     => 'Middle East (Bahrain) [me-south-1]',
            'me-central-1'   => 'Middle East (UAE) [me-central-1]',
            'af-south-1'     => 'Africa (Cape Town) [af-south-1]',
            'sa-east-1'      => 'South America (São Paulo) [sa-east-1]',
        );
    }

    /**
     * Initialize settings hooks.
     */
    public static function init()
    {
        add_action('admin_init', array(__CLASS__, 'register_settings'));
        add_action('wp_ajax_asen_s3_test_connection', array(__CLASS__, 'ajax_test_connection'));
    }

    /**
     * Register settings in WordPress.
     */
    public static function register_settings()
    {
        register_setting('asen_s3_upload_group', self::OPTION_KEY, array(
            'type'              => 'array',
            'sanitize_callback' => array(__CLASS__, 'sanitize_settings'),
            'default'           => self::get_defaults(),
        ));
    }

    /**
     * Sanitize settings on save.
     *
     * @param array $input
     * @return array
     */
    public static function sanitize_settings($input)
    {
        $existing = self::get_settings();
        $defaults = self::get_defaults();
        $output = array();

        // If defined via wp-config.php constant, preserve constant values
        $constant_settings = self::get_config_constant_settings();

        // AWS Access Key ID
        if (isset($constant_settings['aws_access_key_id'])) {
            $output['aws_access_key_id'] = $constant_settings['aws_access_key_id'];
        } else {
            $output['aws_access_key_id'] = isset($input['aws_access_key_id'])
                ? sanitize_text_field(trim($input['aws_access_key_id']))
                : $defaults['aws_access_key_id'];
        }

        // AWS Secret Access Key: keep existing if field left blank / masked
        if (isset($constant_settings['aws_secret_access_key'])) {
            $output['aws_secret_access_key'] = $constant_settings['aws_secret_access_key'];
        } elseif (!empty($input['aws_secret_access_key']) && $input['aws_secret_access_key'] !== '••••••••••••••••') {
            $output['aws_secret_access_key'] = sanitize_text_field(trim($input['aws_secret_access_key']));
        } else {
            $output['aws_secret_access_key'] = !empty($existing['aws_secret_access_key']) ? $existing['aws_secret_access_key'] : '';
        }

        // Region
        if (isset($constant_settings['aws_region'])) {
            $output['aws_region'] = $constant_settings['aws_region'];
        } else {
            $regions = self::get_aws_regions();
            $selected_region = isset($input['aws_region']) ? sanitize_text_field($input['aws_region']) : 'ap-southeast-1';
            $output['aws_region'] = array_key_exists($selected_region, $regions) ? $selected_region : 'ap-southeast-1';
        }

        // S3 Bucket
        if (isset($constant_settings['s3_bucket'])) {
            $output['s3_bucket'] = $constant_settings['s3_bucket'];
        } else {
            $output['s3_bucket'] = isset($input['s3_bucket'])
                ? preg_replace('/[^a-z0-9.\-]/', '', strtolower(trim($input['s3_bucket'])))
                : '';
        }

        // S3 Prefix
        $output['s3_prefix'] = isset($input['s3_prefix'])
            ? sanitize_text_field(trim($input['s3_prefix']))
            : $defaults['s3_prefix'];

        // Custom Domain
        $output['custom_domain'] = isset($input['custom_domain'])
            ? esc_url_raw(rtrim(trim($input['custom_domain']), '/'))
            : '';

        // Storage Class
        $allowed_classes = array('STANDARD', 'INTELLIGENT_TIERING', 'STANDARD_IA');
        $output['storage_class'] = in_array($input['storage_class'] ?? '', $allowed_classes, true)
            ? $input['storage_class']
            : 'STANDARD';

        // Chunk Size MB (min 5, max 100)
        $chunk = isset($input['chunk_size_mb']) ? (int) $input['chunk_size_mb'] : 10;
        $output['chunk_size_mb'] = min(100, max(5, $chunk));

        // Max File Size GB
        $max_size = isset($input['max_file_size_gb']) ? (int) $input['max_file_size_gb'] : 50;
        $output['max_file_size_gb'] = min(5000, max(1, $max_size));

        // URL Expiry (Minutes)
        $expiry = isset($input['url_expiry_minutes']) ? (int) $input['url_expiry_minutes'] : 30;
        $output['url_expiry_minutes'] = min(1440, max(5, $expiry));

        // Post Type (open input: allows any custom post type such as vidmov_video, asen_video_post, post)
        $post_type = isset($input['post_type']) ? sanitize_key(trim($input['post_type'])) : 'asen_video_post';
        $output['post_type'] = !empty($post_type) ? $post_type : 'asen_video_post';

        // Allowed extensions
        $output['allowed_extensions'] = isset($input['allowed_extensions'])
            ? sanitize_text_field($input['allowed_extensions'])
            : $defaults['allowed_extensions'];

        return $output;
    }

    /**
     * AJAX handler to test connection to AWS S3.
     */
    public static function ajax_test_connection()
    {
        check_ajax_referer('asen_s3_admin_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Unauthorized permissions.'));
        }

        $access_key = isset($_POST['access_key']) ? sanitize_text_field(trim($_POST['access_key'])) : '';
        $secret_key = isset($_POST['secret_key']) ? sanitize_text_field(trim($_POST['secret_key'])) : '';
        $region     = isset($_POST['region']) ? sanitize_text_field(trim($_POST['region'])) : '';
        $bucket     = isset($_POST['bucket']) ? sanitize_text_field(trim($_POST['bucket'])) : '';

        // If secret key is placeholder, use stored secret key
        if ($secret_key === '••••••••••••••••' || empty($secret_key)) {
            $settings = self::get_settings();
            $secret_key = $settings['aws_secret_access_key'];
        }

        if (empty($access_key) || empty($secret_key) || empty($bucket)) {
            wp_send_json_error(array('message' => 'Please provide Access Key, Secret Key, and Bucket name.'));
        }

        $client = new ASEN_S3_Client($access_key, $secret_key, $region, $bucket);
        $result = $client->test_connection();

        if (!empty($result['success'])) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result);
        }
    }

    /**
     * Render the admin settings page.
     */
    public static function render_settings_page()
    {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $settings = self::get_settings();
        $regions = self::get_aws_regions();
        $is_key_const = self::is_defined_in_config('aws_access_key_id');
        $is_secret_const = self::is_defined_in_config('aws_secret_access_key');
        $is_region_const = self::is_defined_in_config('aws_region');
        $is_bucket_const = self::is_defined_in_config('s3_bucket');
        $has_any_const = self::is_defined_in_config();
        $masked_secret = !empty($settings['aws_secret_access_key']) ? '••••••••••••••••' : '';
        ?>
        <div class="wrap asen-s3-admin-wrap">
            <h1 class="wp-heading-inline">
                <span class="dashicons dashicons-cloud" style="font-size:28px;margin-right:8px;vertical-align:middle;color:#4f46e5;"></span>
                ASEN AWS S3 Upload Settings
            </h1>
            <p class="description">
                Configure Amazon Web Services credentials to enable high-speed direct client-to-S3 uploads for files up to 5 TB with automatic multipart chunking.
            </p>
            <hr class="wp-header-end" />

            <?php settings_errors(); ?>

            <?php if ($has_any_const) : ?>
                <div class="notice notice-info" style="margin-top:16px;border-left-color:#4f46e5;">
                    <p style="font-size:13px;">
                        <span class="dashicons dashicons-lock" style="vertical-align:middle;color:#4f46e5;"></span>
                        <strong>Credentials defined in wp-config.php:</strong> One or more AWS authentication settings are currently set via PHP constants in <code>wp-config.php</code> and locked from editing here.
                    </p>
                </div>
            <?php endif; ?>

            <div class="asen-s3-layout" style="display:flex;gap:24px;margin-top:20px;flex-wrap:wrap;">
                <!-- Main Form Column -->
                <div style="flex:1;min-width:320px;max-width:800px;">
                    <form method="post" action="options.php" class="asen-s3-settings-form">
                        <?php settings_fields('asen_s3_upload_group'); ?>

                        <!-- Card: AWS Credentials -->
                        <div class="postbox" style="padding:18px 24px;">
                            <h2 class="hndle" style="margin-top:0;padding-bottom:10px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;">
                                <span>
                                    <span class="dashicons dashicons-shield-alt" style="color:#4f46e5;margin-right:6px;"></span>
                                    AWS Authentication & Bucket
                                </span>
                                <?php if ($has_any_const) : ?>
                                    <span style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:#e0e7ff;color:#4338ca;">wp-config.php active</span>
                                <?php endif; ?>
                            </h2>
                            <table class="form-table" role="presentation">
                                <tr>
                                    <th scope="row">
                                        <label for="aws_access_key_id">AWS Access Key ID <span class="required" style="color:#dc2626;">*</span></label>
                                    </th>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:8px;">
                                            <input type="text" id="aws_access_key_id" name="<?php echo esc_attr(self::OPTION_KEY); ?>[aws_access_key_id]"
                                                value="<?php echo esc_attr($settings['aws_access_key_id']); ?>" class="regular-text" placeholder="AKIAIOSFODNN7EXAMPLE" autocomplete="off" <?php echo $is_key_const ? 'readonly style="background:#f1f5f9;color:#64748b;"' : ''; ?> />
                                            <?php if ($is_key_const) : ?>
                                                <span class="dashicons dashicons-lock" title="Defined in wp-config.php" style="color:#64748b;"></span>
                                                <span style="font-size:12px;color:#64748b;font-style:italic;">(Defined in wp-config.php)</span>
                                            <?php endif; ?>
                                        </div>
                                        <p class="description">IAM user Access Key with S3 permissions (s3:PutObject, s3:AbortMultipartUpload, s3:ListBucket).</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="aws_secret_access_key">AWS Secret Access Key <span class="required" style="color:#dc2626;">*</span></label>
                                    </th>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:8px;">
                                            <input type="password" id="aws_secret_access_key" name="<?php echo esc_attr(self::OPTION_KEY); ?>[aws_secret_access_key]"
                                                value="<?php echo esc_attr($masked_secret); ?>" class="regular-text" placeholder="Enter secret key..." autocomplete="new-password" <?php echo $is_secret_const ? 'readonly style="background:#f1f5f9;color:#64748b;"' : ''; ?> />
                                            <?php if (!$is_secret_const) : ?>
                                                <button type="button" class="button" id="toggle-secret-btn" title="Toggle visibility">
                                                    <span class="dashicons dashicons-visibility" style="vertical-align:middle;"></span>
                                                </button>
                                            <?php else : ?>
                                                <span class="dashicons dashicons-lock" title="Defined in wp-config.php" style="color:#64748b;"></span>
                                                <span style="font-size:12px;color:#64748b;font-style:italic;">(Defined in wp-config.php)</span>
                                            <?php endif; ?>
                                        </div>
                                        <p class="description">Your AWS Secret Access Key. Stored securely and never exposed to website visitors.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="aws_region">AWS Region <span class="required" style="color:#dc2626;">*</span></label>
                                    </th>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:8px;">
                                            <select id="aws_region" name="<?php echo esc_attr(self::OPTION_KEY); ?>[aws_region]" class="regular-text" <?php echo $is_region_const ? 'disabled style="background:#f1f5f9;color:#64748b;"' : ''; ?>>
                                                <?php foreach ($regions as $code => $name) : ?>
                                                    <option value="<?php echo esc_attr($code); ?>" <?php selected($settings['aws_region'], $code); ?>>
                                                        <?php echo esc_html($name); ?>
                                                    </option>
                                                <?php endforeach; ?>
                                            </select>
                                            <?php if ($is_region_const) : ?>
                                                <input type="hidden" name="<?php echo esc_attr(self::OPTION_KEY); ?>[aws_region]" value="<?php echo esc_attr($settings['aws_region']); ?>" />
                                                <span class="dashicons dashicons-lock" title="Defined in wp-config.php" style="color:#64748b;"></span>
                                                <span style="font-size:12px;color:#64748b;font-style:italic;">(Defined in wp-config.php)</span>
                                            <?php endif; ?>
                                        </div>
                                        <p class="description">Select the AWS region where your S3 bucket was created.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="s3_bucket">S3 Bucket Name <span class="required" style="color:#dc2626;">*</span></label>
                                    </th>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:8px;">
                                            <input type="text" id="s3_bucket" name="<?php echo esc_attr(self::OPTION_KEY); ?>[s3_bucket]"
                                                value="<?php echo esc_attr($settings['s3_bucket']); ?>" class="regular-text" placeholder="my-media-bucket" <?php echo $is_bucket_const ? 'readonly style="background:#f1f5f9;color:#64748b;"' : ''; ?> />
                                            <?php if ($is_bucket_const) : ?>
                                                <span class="dashicons dashicons-lock" title="Defined in wp-config.php" style="color:#64748b;"></span>
                                                <span style="font-size:12px;color:#64748b;font-style:italic;">(Defined in wp-config.php)</span>
                                            <?php endif; ?>
                                        </div>
                                        <p class="description">Target S3 bucket for uploaded video, audio, and attachments.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Connection Test</th>
                                    <td>
                                        <button type="button" id="asen-test-connection-btn" class="button button-secondary">
                                            <span class="dashicons dashicons-update" style="vertical-align:middle;margin-right:4px;"></span>
                                            Test AWS Connection
                                        </button>
                                        <span id="asen-test-status" style="margin-left:12px;font-weight:600;"></span>
                                        <div id="asen-test-result" style="margin-top:10px;display:none;"></div>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <!-- Card: Storage & Delivery Settings -->
                        <div class="postbox" style="padding:18px 24px;">
                            <h2 class="hndle" style="margin-top:0;padding-bottom:10px;border-bottom:1px solid #e2e8f0;">
                                <span class="dashicons dashicons-database" style="color:#4f46e5;margin-right:6px;"></span>
                                S3 Paths & Delivery Options
                            </h2>
                            <table class="form-table" role="presentation">
                                <tr>
                                    <th scope="row">
                                        <label for="s3_prefix">Upload Path Prefix</label>
                                    </th>
                                    <td>
                                        <input type="text" id="s3_prefix" name="<?php echo esc_attr(self::OPTION_KEY); ?>[s3_prefix]"
                                            value="<?php echo esc_attr($settings['s3_prefix']); ?>" class="regular-text" />
                                        <p class="description">Supports dynamic tags: <code>{year}</code>, <code>{month}</code>, <code>{day}</code>. E.g. <code>asen-uploads/{year}/{month}/</code>.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="custom_domain">CloudFront CDN / Custom Domain</label>
                                    </th>
                                    <td>
                                        <input type="url" id="custom_domain" name="<?php echo esc_attr(self::OPTION_KEY); ?>[custom_domain]"
                                            value="<?php echo esc_attr($settings['custom_domain']); ?>" class="regular-text" placeholder="https://cdn.example.com" />
                                        <p class="description">Optional CloudFront or CDN domain URL to serve uploaded media with lower egress costs and caching.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="storage_class">S3 Storage Class</label>
                                    </th>
                                    <td>
                                        <select id="storage_class" name="<?php echo esc_attr(self::OPTION_KEY); ?>[storage_class]" class="regular-text">
                                            <option value="STANDARD" <?php selected($settings['storage_class'], 'STANDARD'); ?>>Standard (Recommended for frequent access)</option>
                                            <option value="INTELLIGENT_TIERING" <?php selected($settings['storage_class'], 'INTELLIGENT_TIERING'); ?>>Intelligent-Tiering (Automatic cost savings)</option>
                                            <option value="STANDARD_IA" <?php selected($settings['storage_class'], 'STANDARD_IA'); ?>>Standard-IA (Infrequent Access)</option>
                                        </select>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <!-- Card: Upload & Chunking Configuration -->
                        <div class="postbox" style="padding:18px 24px;">
                            <h2 class="hndle" style="margin-top:0;padding-bottom:10px;border-bottom:1px solid #e2e8f0;">
                                <span class="dashicons dashicons-controls-forward" style="color:#4f46e5;margin-right:6px;"></span>
                                Client Direct Multipart Upload
                            </h2>
                            <table class="form-table" role="presentation">
                                <tr>
                                    <th scope="row">
                                        <label for="chunk_size_mb">Multipart Chunk Size</label>
                                    </th>
                                    <td>
                                        <select id="chunk_size_mb" name="<?php echo esc_attr(self::OPTION_KEY); ?>[chunk_size_mb]" class="regular-text">
                                            <option value="5" <?php selected($settings['chunk_size_mb'], 5); ?>>5 MB (AWS Minimum)</option>
                                            <option value="10" <?php selected($settings['chunk_size_mb'], 10); ?>>10 MB (Recommended default)</option>
                                            <option value="20" <?php selected($settings['chunk_size_mb'], 20); ?>>20 MB (Faster on high-bandwidth)</option>
                                            <option value="50" <?php selected($settings['chunk_size_mb'], 50); ?>>50 MB</option>
                                            <option value="100" <?php selected($settings['chunk_size_mb'], 100); ?>>100 MB</option>
                                        </select>
                                        <p class="description">Large files are sliced in the browser and uploaded directly to S3 chunk by chunk. If a chunk drops, only that chunk retries.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="max_file_size_gb">Max Upload File Size</label>
                                    </th>
                                    <td>
                                        <input type="number" id="max_file_size_gb" name="<?php echo esc_attr(self::OPTION_KEY); ?>[max_file_size_gb]"
                                            value="<?php echo esc_attr($settings['max_file_size_gb']); ?>" class="small-text" min="1" max="5000" /> GB
                                        <p class="description">Direct S3 client upload overcomes server limits. Set your maximum allowed file size (up to 5000 GB / 5 TB).</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="post_type">Created Post Type</label>
                                    </th>
                                    <td>
                                        <input type="text" id="post_type" name="<?php echo esc_attr(self::OPTION_KEY); ?>[post_type]"
                                            value="<?php echo esc_attr($settings['post_type']); ?>" class="regular-text" list="asen_post_type_suggestions" placeholder="vidmov_video" autocomplete="off" />
                                        <datalist id="asen_post_type_suggestions">
                                            <option value="vidmov_video">Vidmov Theme Video (vidmov_video)</option>
                                            <option value="asen_video_post">Dedicated Post Type (asen_video_post)</option>
                                            <option value="post">Standard Post Type (post)</option>
                                        </datalist>
                                        <div style="margin-top:8px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                                            <span style="font-size:12px;color:#64748b;font-weight:600;">Suggestions:</span>
                                            <button type="button" class="button button-small asen-pt-pill" data-val="vidmov_video" title="Merge directly with Vidmov Theme and BeeTeam368">vidmov_video (Vidmov)</button>
                                            <button type="button" class="button button-small asen-pt-pill" data-val="asen_video_post" title="Use ASEN Dedicated Post Type">asen_video_post (Dedicated)</button>
                                            <button type="button" class="button button-small asen-pt-pill" data-val="post" title="Use Standard WordPress Posts">post (Standard)</button>
                                        </div>
                                        <p class="description" style="margin-top:6px;">
                                            Type any custom post type slug or click a suggestion above. When set to <code>vidmov_video</code>, posts automatically configure Vidmov's HTML5/HLS player, categories, and theme fields.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="allowed_extensions">Allowed File Extensions</label>
                                    </th>
                                    <td>
                                        <input type="text" id="allowed_extensions" name="<?php echo esc_attr(self::OPTION_KEY); ?>[allowed_extensions]"
                                            value="<?php echo esc_attr($settings['allowed_extensions']); ?>" class="large-text" />
                                        <p class="description">Comma-separated list of allowed extensions for video/audio and attachments.</p>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <?php submit_button('Save Changes', 'primary button-hero'); ?>
                    </form>
                </div>

                <!-- Sidebar Guides Column -->
                <div style="flex:1;min-width:300px;max-width:440px;">
                    <!-- wp-config.php Constants Guide (Recommended) -->
                    <div class="postbox" style="padding:18px 20px;border-left:4px solid #6366f1;">
                        <h3 style="margin-top:0;display:flex;align-items:center;justify-content:space-between;">
                            <span>
                                <span class="dashicons dashicons-admin-network" style="color:#6366f1;margin-right:6px;"></span>
                                Store Keys in wp-config.php
                            </span>
                            <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;background:#e0e7ff;color:#4338ca;">RECOMMENDED</span>
                        </h3>
                        <p style="font-size:13px;line-height:1.5;">
                            For better security, you can define AWS credentials in your <code>wp-config.php</code> file using the <code>ASEN_S3_SETTINGS</code> serialized array constant (similar to WP Offload Media). When defined, the plugin automatically reads from this constant and locks the input fields.
                        </p>
                        <p style="font-size:12px;color:#64748b;margin-bottom:8px;">
                            Add this code above <em>/* That's all, stop editing! */</em> in <code>wp-config.php</code>:
                        </p>
                        <div style="position:relative;">
                            <textarea id="asen-config-code" readonly rows="9" class="large-text code" style="font-size:11px;background:#f8fafc;font-family:monospace;"><?php echo esc_textarea("define( 'ASEN_S3_SETTINGS', serialize( array(
    'provider'          => 'aws',
    'access-key-id'     => 'YOUR_AWS_ACCESS_KEY_ID',
    'secret-access-key' => 'YOUR_AWS_SECRET_ACCESS_KEY',
    'region'            => '" . esc_html($settings['aws_region']) . "',
    'bucket'            => '" . esc_html($settings['s3_bucket'] ?: 'your-bucket-name') . "',
) ) );"); ?></textarea>
                            <button type="button" class="button button-small" id="copy-config-btn" style="position:absolute;top:6px;right:6px;">
                                <span class="dashicons dashicons-clipboard" style="vertical-align:middle;font-size:14px;"></span> Copy
                            </button>
                        </div>
                        <p style="font-size:12px;color:#64748b;margin-top:10px;line-height:1.4;">
                            <em>Tip:</em> If not defined in <code>wp-config.php</code>, credentials entered in the form on the left are securely stored in the WordPress database.
                        </p>
                    </div>

                    <!-- S3 Bucket CORS Guide -->
                    <div class="postbox" style="padding:18px 20px;border-left:4px solid #4f46e5;">
                        <h3 style="margin-top:0;">
                            <span class="dashicons dashicons-rest-api" style="color:#4f46e5;margin-right:6px;"></span>
                            Required: AWS S3 Bucket CORS
                        </h3>
                        <p style="font-size:13px;line-height:1.5;">
                            Direct browser-to-S3 uploads require a <strong>Cross-Origin Resource Sharing (CORS)</strong> policy on your bucket so the browser can send <code>PUT</code> requests and read the <code>ETag</code> header.
                        </p>
                        <ol style="font-size:12px;padding-left:18px;line-height:1.6;margin-bottom:12px;">
                            <li>Open <a href="https://s3.console.aws.amazon.com/s3/" target="_blank" rel="noopener">AWS S3 Console</a>.</li>
                            <li>Click your bucket name &rarr; <strong>Permissions</strong> tab.</li>
                            <li>Scroll to <strong>Cross-origin resource sharing (CORS)</strong> &rarr; Click <strong>Edit</strong>.</li>
                            <li>Paste the JSON policy below and click <strong>Save changes</strong>:</li>
                        </ol>
                        <div style="position:relative;">
                            <textarea id="asen-cors-policy" readonly rows="8" class="large-text code" style="font-size:11px;background:#f8fafc;">[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag", "x-amz-server-side-encryption"]
  }
]</textarea>
                            <button type="button" class="button button-small" id="copy-cors-btn" style="position:absolute;top:6px;right:6px;">
                                <span class="dashicons dashicons-clipboard" style="vertical-align:middle;font-size:14px;"></span> Copy
                            </button>
                        </div>
                    </div>

                    <!-- Usage / Shortcode Guide -->
                    <div class="postbox" style="padding:18px 20px;border-left:4px solid #10b981;">
                        <h3 style="margin-top:0;">
                            <span class="dashicons dashicons-shortcode" style="color:#10b981;margin-right:6px;"></span>
                            How to Embed Upload Page
                        </h3>
                        <p style="font-size:13px;line-height:1.5;">
                            To display the client upload page on any page, post, or Elementor section, insert this shortcode:
                        </p>
                        <p>
                            <code style="display:block;padding:8px;background:#f1f5f9;font-size:13px;font-weight:600;">[asen_s3_upload]</code>
                        </p>
                        <p style="font-size:12px;color:#64748b;">
                            Optional shortcode attributes:
                        </p>
                        <ul style="font-size:12px;padding-left:16px;line-height:1.5;color:#475569;">
                            <li><code>title="Upload"</code>: Page header text</li>
                            <li><code>header="yes|no"</code>: Show/hide ASEN branding header bar</li>
                            <li><code>allow_multiple="yes|no"</code>: Allow "+ New Video Post" button</li>
                        </ul>
                    </div>

                    <!-- WP Offload Media Compatibility -->
                    <div class="postbox" style="padding:18px 20px;border-left:4px solid #0284c7;">
                        <h3 style="margin-top:0;">
                            <span class="dashicons dashicons-media-document" style="color:#0284c7;margin-right:6px;"></span>
                            WP Offload Media Compatible
                        </h3>
                        <p style="font-size:13px;line-height:1.5;">
                            All files uploaded via this plugin are registered in the WordPress Media Library and post meta with standard <code>amazonS3_info</code> schema identical to WP Offload Media.
                        </p>
                        <p style="font-size:12px;color:#64748b;">
                            Manage offloaded videos, copy URLs, and view files in the <a href="<?php echo esc_url(admin_url('admin.php?page=asen-s3-media')); ?>">Uploaded Posts</a> dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <script>
        (function() {
            var toggleBtn = document.getElementById('toggle-secret-btn');
            var secretInput = document.getElementById('aws_secret_access_key');
            if (toggleBtn && secretInput) {
                toggleBtn.addEventListener('click', function() {
                    if (secretInput.type === 'password') {
                        secretInput.type = 'text';
                    } else {
                        secretInput.type = 'password';
                    }
                });
            }

            var copyCorsBtn = document.getElementById('copy-cors-btn');
            var corsTextarea = document.getElementById('asen-cors-policy');
            if (copyCorsBtn && corsTextarea) {
                copyCorsBtn.addEventListener('click', function() {
                    corsTextarea.select();
                    navigator.clipboard.writeText(corsTextarea.value).then(function() {
                        copyCorsBtn.textContent = 'Copied!';
                        setTimeout(function() { copyCorsBtn.textContent = 'Copy'; }, 2000);
                    });
                });
            }

            var copyConfigBtn = document.getElementById('copy-config-btn');
            var configTextarea = document.getElementById('asen-config-code');
            if (copyConfigBtn && configTextarea) {
                copyConfigBtn.addEventListener('click', function() {
                    configTextarea.select();
                    navigator.clipboard.writeText(configTextarea.value).then(function() {
                        copyConfigBtn.textContent = 'Copied!';
                        setTimeout(function() { copyConfigBtn.textContent = 'Copy'; }, 2000);
                    });
                });
            }

            var ptPills = document.querySelectorAll('.asen-pt-pill');
            var ptInput = document.getElementById('post_type');
            if (ptPills && ptInput) {
                ptPills.forEach(function(pill) {
                    pill.addEventListener('click', function(e) {
                        e.preventDefault();
                        var val = pill.getAttribute('data-val');
                        if (val) {
                            ptInput.value = val;
                            ptInput.focus();
                        }
                    });
                });
            }

            var testBtn = document.getElementById('asen-test-connection-btn');
            var statusSpan = document.getElementById('asen-test-status');
            var resultDiv = document.getElementById('asen-test-result');

            if (testBtn) {
                testBtn.addEventListener('click', function() {
                    var accessKey = document.getElementById('aws_access_key_id').value;
                    var secretKey = document.getElementById('aws_secret_access_key').value;
                    var region = document.getElementById('aws_region').value;
                    var bucket = document.getElementById('s3_bucket').value;

                    testBtn.disabled = true;
                    statusSpan.style.color = '#64748b';
                    statusSpan.textContent = 'Connecting to AWS S3...';
                    resultDiv.style.display = 'none';

                    var data = new FormData();
                    data.append('action', 'asen_s3_test_connection');
                    data.append('nonce', '<?php echo esc_js(wp_create_nonce('asen_s3_admin_nonce')); ?>');
                    data.append('access_key', accessKey);
                    data.append('secret_key', secretKey);
                    data.append('region', region);
                    data.append('bucket', bucket);

                    fetch(ajaxurl, {
                        method: 'POST',
                        body: data,
                    })
                    .then(function(res) { return res.json(); })
                    .then(function(json) {
                        testBtn.disabled = false;
                        if (json.success) {
                            statusSpan.style.color = '#15803d';
                            statusSpan.textContent = '✓ Connected';
                            resultDiv.innerHTML = '<div class="notice notice-success inline" style="padding:10px;margin:0;"><p>' + json.data.message + '</p></div>';
                        } else {
                            statusSpan.style.color = '#b91c1c';
                            statusSpan.textContent = '✗ Connection Failed';
                            resultDiv.innerHTML = '<div class="notice notice-error inline" style="padding:10px;margin:0;"><p><strong>Error:</strong> ' + (json.data && json.data.message ? json.data.message : 'Unknown error') + '</p></div>';
                        }
                        resultDiv.style.display = 'block';
                    })
                    .catch(function(err) {
                        testBtn.disabled = false;
                        statusSpan.style.color = '#b91c1c';
                        statusSpan.textContent = '✗ Request Failed';
                        resultDiv.innerHTML = '<div class="notice notice-error inline" style="padding:10px;margin:0;"><p>Error: ' + err.message + '</p></div>';
                        resultDiv.style.display = 'block';
                    });
                });
            }
        })();
        </script>
        <?php
    }
}
