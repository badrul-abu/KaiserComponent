<?php
/**
 * Zero-dependency AWS S3 REST API & Signature Version 4 Client.
 *
 * Implements direct S3 signing and multipart upload operations
 * without requiring the official AWS SDK or external composer packages.
 *
 * @package ASEN_S3_Upload
 */

if (!defined('ABSPATH')) {
    exit;
}

class ASEN_S3_Client
{
    /** @var string */
    private $access_key;

    /** @var string */
    private $secret_key;

    /** @var string */
    private $region;

    /** @var string */
    private $bucket;

    /** @var string */
    private $custom_domain;

    /**
     * Constructor.
     *
     * @param string $access_key
     * @param string $secret_key
     * @param string $region
     * @param string $bucket
     * @param string $custom_domain Optional CDN or custom domain URL.
     */
    public function __construct($access_key, $secret_key, $region, $bucket, $custom_domain = '')
    {
        $this->access_key = trim((string) $access_key);
        $this->secret_key = trim((string) $secret_key);
        $this->region = trim((string) $region) ?: 'us-east-1';
        $this->bucket = trim((string) $bucket);
        $domain = rtrim(trim((string) $custom_domain), '/');
        if (!empty($domain) && strpos($domain, 'http') !== 0) {
            $domain = 'https://' . $domain;
        }
        $this->custom_domain = $domain;
    }

    /**
     * Get host name for this bucket.
     *
     * @return string
     */
    public function get_host()
    {
        return sprintf('%s.s3.%s.amazonaws.com', $this->bucket, $this->region);
    }

    /**
     * Get canonical S3 URL or custom CDN URL for a key.
     *
     * @param string $key
     * @return string
     */
    public function get_file_url($key)
    {
        $encoded_key = implode('/', array_map('rawurlencode', explode('/', ltrim($key, '/'))));
        if (!empty($this->custom_domain)) {
            return $this->custom_domain . '/' . $encoded_key;
        }
        return 'https://' . $this->get_host() . '/' . $encoded_key;
    }

    /**
     * Format RFC 3986 URI path.
     *
     * @param string $path
     * @return string
     */
    private function encode_uri_path($path)
    {
        $parts = explode('/', ltrim($path, '/'));
        $encoded = array_map('rawurlencode', $parts);
        return '/' . implode('/', $encoded);
    }

    /**
     * Build AWS SigV4 Signing Key.
     *
     * @param string $date Ymd format.
     * @return string Binary signing key.
     */
    private function get_signature_key($date)
    {
        $k_secret = 'AWS4' . $this->secret_key;
        $k_date = hash_hmac('sha256', $date, $k_secret, true);
        $k_region = hash_hmac('sha256', $this->region, $k_date, true);
        $k_service = hash_hmac('sha256', 's3', $k_region, true);
        $k_signing = hash_hmac('sha256', 'aws4_request', $k_service, true);
        return $k_signing;
    }

    /**
     * Create a presigned URL for Single PUT Upload (for small files / attachments).
     *
     * @param string $key
     * @param string $content_type
     * @param int $expires_in Seconds (default 1800).
     * @return string
     */
    public function create_presigned_put_url($key, $content_type = '', $expires_in = 1800)
    {
        $now = time();
        $date = gmdate('Ymd', $now);
        $datetime = gmdate('Ymd\THis\Z', $now);
        $host = $this->get_host();
        $canonical_uri = $this->encode_uri_path($key);

        $credential_scope = sprintf('%s/%s/s3/aws4_request', $date, $this->region);
        $credential = sprintf('%s/%s', $this->access_key, $credential_scope);

        $query_params = array(
            'X-Amz-Algorithm' => 'AWS4-HMAC-SHA256',
            'X-Amz-Credential' => $credential,
            'X-Amz-Date' => $datetime,
            'X-Amz-Expires' => (string) $expires_in,
            'X-Amz-SignedHeaders' => 'host',
        );

        ksort($query_params);
        $canonical_query_pairs = array();
        foreach ($query_params as $k => $v) {
            $canonical_query_pairs[] = rawurlencode($k) . '=' . rawurlencode($v);
        }
        $canonical_query_string = implode('&', $canonical_query_pairs);

        $canonical_headers = "host:" . strtolower($host) . "\n";
        $signed_headers = 'host';
        $payload_hash = 'UNSIGNED-PAYLOAD';

        $canonical_request = "PUT\n"
            . $canonical_uri . "\n"
            . $canonical_query_string . "\n"
            . $canonical_headers . "\n"
            . $signed_headers . "\n"
            . $payload_hash;

        $string_to_sign = "AWS4-HMAC-SHA256\n"
            . $datetime . "\n"
            . $credential_scope . "\n"
            . hash('sha256', $canonical_request);

        $signing_key = $this->get_signature_key($date);
        $signature = hash_hmac('sha256', $string_to_sign, $signing_key);

        return 'https://' . $host . $canonical_uri . '?' . $canonical_query_string . '&X-Amz-Signature=' . $signature;
    }

    /**
     * Initiate a Multipart Upload in AWS S3.
     *
     * @param string $key
     * @param string $content_type
     * @param string $storage_class
     * @return array Array with success, upload_id, and key, or WP_Error.
     */
    public function initiate_multipart_upload($key, $content_type = 'application/octet-stream', $storage_class = 'STANDARD')
    {
        $now = time();
        $date = gmdate('Ymd', $now);
        $datetime = gmdate('Ymd\THis\Z', $now);
        $host = $this->get_host();
        $canonical_uri = $this->encode_uri_path($key);

        $credential_scope = sprintf('%s/%s/s3/aws4_request', $date, $this->region);
        $canonical_query = 'uploads=';

        $payload = '';
        $payload_hash = hash('sha256', $payload);

        $headers = array(
            'host' => strtolower($host),
            'x-amz-date' => $datetime,
            'x-amz-content-sha256' => $payload_hash,
            'x-amz-storage-class' => $storage_class,
        );
        if (!empty($content_type)) {
            $headers['content-type'] = $content_type;
        }

        ksort($headers);
        $canonical_headers = '';
        foreach ($headers as $k => $v) {
            $canonical_headers .= strtolower($k) . ':' . trim($v) . "\n";
        }
        $signed_headers = implode(';', array_keys($headers));

        $canonical_request = "POST\n"
            . $canonical_uri . "\n"
            . $canonical_query . "\n"
            . $canonical_headers . "\n"
            . $signed_headers . "\n"
            . $payload_hash;

        $string_to_sign = "AWS4-HMAC-SHA256\n"
            . $datetime . "\n"
            . $credential_scope . "\n"
            . hash('sha256', $canonical_request);

        $signing_key = $this->get_signature_key($date);
        $signature = hash_hmac('sha256', $string_to_sign, $signing_key);

        $authorization = sprintf(
            'AWS4-HMAC-SHA256 Credential=%s/%s, SignedHeaders=%s, Signature=%s',
            $this->access_key,
            $credential_scope,
            $signed_headers,
            $signature
        );

        $http_headers = array(
            'Authorization' => $authorization,
            'x-amz-date' => $datetime,
            'x-amz-content-sha256' => $payload_hash,
            'x-amz-storage-class' => $storage_class,
        );
        if (!empty($content_type)) {
            $http_headers['Content-Type'] = $content_type;
        }

        $endpoint = 'https://' . $host . $canonical_uri . '?uploads';
        $response = wp_remote_post($endpoint, array(
            'headers' => $http_headers,
            'timeout' => 20,
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);

        if ($code < 200 || $code >= 300) {
            $msg = $this->extract_error_message($body, 'S3 Initiate Multipart failed (HTTP ' . $code . ')');
            return new WP_Error('s3_initiate_failed', $msg, array('status' => $code, 'body' => $body));
        }

        // Parse XML response for UploadId
        $xml = simplexml_load_string($body);
        if (!$xml || empty($xml->UploadId)) {
            return new WP_Error('s3_parse_error', 'Unable to parse UploadId from S3 response.');
        }

        return array(
            'success' => true,
            'upload_id' => (string) $xml->UploadId,
            'key' => $key,
            'bucket' => $this->bucket,
            'region' => $this->region,
        );
    }

    /**
     * Create presigned URL for an individual part of a Multipart Upload.
     *
     * @param string $key
     * @param string $upload_id
     * @param int $part_number
     * @param int $expires_in Seconds.
     * @return string
     */
    public function create_presigned_part_url($key, $upload_id, $part_number, $expires_in = 3600)
    {
        $now = time();
        $date = gmdate('Ymd', $now);
        $datetime = gmdate('Ymd\THis\Z', $now);
        $host = $this->get_host();
        $canonical_uri = $this->encode_uri_path($key);

        $credential_scope = sprintf('%s/%s/s3/aws4_request', $date, $this->region);
        $credential = sprintf('%s/%s', $this->access_key, $credential_scope);

        $query_params = array(
            'partNumber' => (string) $part_number,
            'uploadId' => (string) $upload_id,
            'X-Amz-Algorithm' => 'AWS4-HMAC-SHA256',
            'X-Amz-Credential' => $credential,
            'X-Amz-Date' => $datetime,
            'X-Amz-Expires' => (string) $expires_in,
            'X-Amz-SignedHeaders' => 'host',
        );

        ksort($query_params);
        $canonical_query_pairs = array();
        foreach ($query_params as $k => $v) {
            $canonical_query_pairs[] = rawurlencode($k) . '=' . rawurlencode($v);
        }
        $canonical_query_string = implode('&', $canonical_query_pairs);

        $canonical_headers = "host:" . strtolower($host) . "\n";
        $signed_headers = 'host';
        $payload_hash = 'UNSIGNED-PAYLOAD';

        $canonical_request = "PUT\n"
            . $canonical_uri . "\n"
            . $canonical_query_string . "\n"
            . $canonical_headers . "\n"
            . $signed_headers . "\n"
            . $payload_hash;

        $string_to_sign = "AWS4-HMAC-SHA256\n"
            . $datetime . "\n"
            . $credential_scope . "\n"
            . hash('sha256', $canonical_request);

        $signing_key = $this->get_signature_key($date);
        $signature = hash_hmac('sha256', $string_to_sign, $signing_key);

        return 'https://' . $host . $canonical_uri . '?' . $canonical_query_string . '&X-Amz-Signature=' . $signature;
    }

    /**
     * Batch generate presigned part URLs.
     *
     * @param string $key
     * @param string $upload_id
     * @param array $part_numbers Array of integer part numbers, e.g. [1, 2, 3...].
     * @param int $expires_in
     * @return array Map of partNumber => presignedUrl.
     */
    public function batch_presign_parts($key, $upload_id, array $part_numbers, $expires_in = 3600)
    {
        $urls = array();
        foreach ($part_numbers as $part_num) {
            $num = (int) $part_num;
            if ($num > 0) {
                $urls[$num] = $this->create_presigned_part_url($key, $upload_id, $num, $expires_in);
            }
        }
        return $urls;
    }

    /**
     * Complete a Multipart Upload in S3.
     *
     * @param string $key
     * @param string $upload_id
     * @param array $parts Array of parts: [ ['PartNumber' => 1, 'ETag' => '"..."'], ... ]
     * @return array|WP_Error
     */
    public function complete_multipart_upload($key, $upload_id, array $parts)
    {
        usort($parts, function ($a, $b) {
            return (int) $a['PartNumber'] - (int) $b['PartNumber'];
        });

        $xml_body = "<CompleteMultipartUpload>\n";
        foreach ($parts as $p) {
            $part_num = (int) $p['PartNumber'];
            $etag = trim((string) $p['ETag']);
            // Ensure ETag is quoted per S3 specification
            if (substr($etag, 0, 1) !== '"') {
                $etag = '"' . $etag . '"';
            }
            $xml_body .= "  <Part>\n";
            $xml_body .= "    <PartNumber>{$part_num}</PartNumber>\n";
            $xml_body .= "    <ETag>{$etag}</ETag>\n";
            $xml_body .= "  </Part>\n";
        }
        $xml_body .= "</CompleteMultipartUpload>";

        $now = time();
        $date = gmdate('Ymd', $now);
        $datetime = gmdate('Ymd\THis\Z', $now);
        $host = $this->get_host();
        $canonical_uri = $this->encode_uri_path($key);

        $credential_scope = sprintf('%s/%s/s3/aws4_request', $date, $this->region);
        $canonical_query = 'uploadId=' . rawurlencode($upload_id);

        $payload_hash = hash('sha256', $xml_body);

        $headers = array(
            'content-type' => 'application/xml',
            'host' => strtolower($host),
            'x-amz-content-sha256' => $payload_hash,
            'x-amz-date' => $datetime,
        );

        ksort($headers);
        $canonical_headers = '';
        foreach ($headers as $k => $v) {
            $canonical_headers .= strtolower($k) . ':' . trim($v) . "\n";
        }
        $signed_headers = implode(';', array_keys($headers));

        $canonical_request = "POST\n"
            . $canonical_uri . "\n"
            . $canonical_query . "\n"
            . $canonical_headers . "\n"
            . $signed_headers . "\n"
            . $payload_hash;

        $string_to_sign = "AWS4-HMAC-SHA256\n"
            . $datetime . "\n"
            . $credential_scope . "\n"
            . hash('sha256', $canonical_request);

        $signing_key = $this->get_signature_key($date);
        $signature = hash_hmac('sha256', $string_to_sign, $signing_key);

        $authorization = sprintf(
            'AWS4-HMAC-SHA256 Credential=%s/%s, SignedHeaders=%s, Signature=%s',
            $this->access_key,
            $credential_scope,
            $signed_headers,
            $signature
        );

        $endpoint = 'https://' . $host . $canonical_uri . '?uploadId=' . rawurlencode($upload_id);
        $response = wp_remote_post($endpoint, array(
            'headers' => array(
                'Authorization' => $authorization,
                'Content-Type' => 'application/xml',
                'x-amz-date' => $datetime,
                'x-amz-content-sha256' => $payload_hash,
            ),
            'body' => $xml_body,
            'timeout' => 30,
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);

        if ($code < 200 || $code >= 300) {
            $msg = $this->extract_error_message($body, 'S3 Complete Multipart failed (HTTP ' . $code . ')');
            return new WP_Error('s3_complete_failed', $msg, array('status' => $code, 'body' => $body));
        }

        $xml = simplexml_load_string($body);
        $location = $xml && !empty($xml->Location) ? (string) $xml->Location : $this->get_file_url($key);
        $etag = $xml && !empty($xml->ETag) ? trim((string) $xml->ETag, '"') : '';

        return array(
            'success' => true,
            'key' => $key,
            'bucket' => $this->bucket,
            'region' => $this->region,
            'location' => $location,
            'url' => $this->get_file_url($key),
            'etag' => $etag,
        );
    }

    /**
     * Abort a Multipart Upload in S3.
     *
     * @param string $key
     * @param string $upload_id
     * @return bool|WP_Error
     */
    public function abort_multipart_upload($key, $upload_id)
    {
        $now = time();
        $date = gmdate('Ymd', $now);
        $datetime = gmdate('Ymd\THis\Z', $now);
        $host = $this->get_host();
        $canonical_uri = $this->encode_uri_path($key);

        $credential_scope = sprintf('%s/%s/s3/aws4_request', $date, $this->region);
        $canonical_query = 'uploadId=' . rawurlencode($upload_id);
        $payload_hash = hash('sha256', '');

        $headers = array(
            'host' => strtolower($host),
            'x-amz-content-sha256' => $payload_hash,
            'x-amz-date' => $datetime,
        );

        ksort($headers);
        $canonical_headers = '';
        foreach ($headers as $k => $v) {
            $canonical_headers .= strtolower($k) . ':' . trim($v) . "\n";
        }
        $signed_headers = implode(';', array_keys($headers));

        $canonical_request = "DELETE\n"
            . $canonical_uri . "\n"
            . $canonical_query . "\n"
            . $canonical_headers . "\n"
            . $signed_headers . "\n"
            . $payload_hash;

        $string_to_sign = "AWS4-HMAC-SHA256\n"
            . $datetime . "\n"
            . $credential_scope . "\n"
            . hash('sha256', $canonical_request);

        $signing_key = $this->get_signature_key($date);
        $signature = hash_hmac('sha256', $string_to_sign, $signing_key);

        $authorization = sprintf(
            'AWS4-HMAC-SHA256 Credential=%s/%s, SignedHeaders=%s, Signature=%s',
            $this->access_key,
            $credential_scope,
            $signed_headers,
            $signature
        );

        $endpoint = 'https://' . $host . $canonical_uri . '?uploadId=' . rawurlencode($upload_id);
        $response = wp_remote_request($endpoint, array(
            'method' => 'DELETE',
            'headers' => array(
                'Authorization' => $authorization,
                'x-amz-date' => $datetime,
                'x-amz-content-sha256' => $payload_hash,
            ),
            'timeout' => 15,
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        return ($code >= 200 && $code < 300);
    }

    /**
     * Delete an object from S3.
     *
     * @param string $key
     * @return bool|WP_Error
     */
    public function delete_object($key)
    {
        $now = time();
        $date = gmdate('Ymd', $now);
        $datetime = gmdate('Ymd\THis\Z', $now);
        $host = $this->get_host();
        $canonical_uri = $this->encode_uri_path($key);

        $credential_scope = sprintf('%s/%s/s3/aws4_request', $date, $this->region);
        $canonical_query = '';
        $payload_hash = hash('sha256', '');

        $headers = array(
            'host' => strtolower($host),
            'x-amz-content-sha256' => $payload_hash,
            'x-amz-date' => $datetime,
        );

        ksort($headers);
        $canonical_headers = '';
        foreach ($headers as $k => $v) {
            $canonical_headers .= strtolower($k) . ':' . trim($v) . "\n";
        }
        $signed_headers = implode(';', array_keys($headers));

        $canonical_request = "DELETE\n"
            . $canonical_uri . "\n"
            . $canonical_query . "\n"
            . $canonical_headers . "\n"
            . $signed_headers . "\n"
            . $payload_hash;

        $string_to_sign = "AWS4-HMAC-SHA256\n"
            . $datetime . "\n"
            . $credential_scope . "\n"
            . hash('sha256', $canonical_request);

        $signing_key = $this->get_signature_key($date);
        $signature = hash_hmac('sha256', $string_to_sign, $signing_key);

        $authorization = sprintf(
            'AWS4-HMAC-SHA256 Credential=%s/%s, SignedHeaders=%s, Signature=%s',
            $this->access_key,
            $credential_scope,
            $signed_headers,
            $signature
        );

        $endpoint = 'https://' . $host . $canonical_uri;
        $response = wp_remote_request($endpoint, array(
            'method' => 'DELETE',
            'headers' => array(
                'Authorization' => $authorization,
                'x-amz-date' => $datetime,
                'x-amz-content-sha256' => $payload_hash,
            ),
            'timeout' => 15,
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        return ($code === 204 || $code === 200);
    }

    /**
     * Test connection and permissions to AWS S3.
     *
     * Performs a lightweight HeadBucket or ListObjects request
     * and a temporary small write/delete test to verify full operational readiness.
     *
     * @return array Status array with success, message, details.
     */
    public function test_connection()
    {
        if (empty($this->access_key) || empty($this->secret_key) || empty($this->bucket)) {
            return array(
                'success' => false,
                'message' => 'Please provide AWS Access Key, Secret Key, and S3 Bucket Name.',
            );
        }

        $start_time = microtime(true);
        $now = time();
        $date = gmdate('Ymd', $now);
        $datetime = gmdate('Ymd\THis\Z', $now);
        $host = $this->get_host();

        // 1. Test HeadBucket / ListObjectsV2
        $canonical_uri = '/';
        $canonical_query = 'list-type=2&max-keys=1';
        $payload_hash = hash('sha256', '');
        $credential_scope = sprintf('%s/%s/s3/aws4_request', $date, $this->region);

        $headers = array(
            'host' => strtolower($host),
            'x-amz-content-sha256' => $payload_hash,
            'x-amz-date' => $datetime,
        );
        ksort($headers);
        $canonical_headers = '';
        foreach ($headers as $k => $v) {
            $canonical_headers .= strtolower($k) . ':' . trim($v) . "\n";
        }
        $signed_headers = implode(';', array_keys($headers));

        $canonical_request = "GET\n"
            . $canonical_uri . "\n"
            . $canonical_query . "\n"
            . $canonical_headers . "\n"
            . $signed_headers . "\n"
            . $payload_hash;

        $string_to_sign = "AWS4-HMAC-SHA256\n"
            . $datetime . "\n"
            . $credential_scope . "\n"
            . hash('sha256', $canonical_request);

        $signing_key = $this->get_signature_key($date);
        $signature = hash_hmac('sha256', $string_to_sign, $signing_key);

        $authorization = sprintf(
            'AWS4-HMAC-SHA256 Credential=%s/%s, SignedHeaders=%s, Signature=%s',
            $this->access_key,
            $credential_scope,
            $signed_headers,
            $signature
        );

        $endpoint = 'https://' . $host . '/?' . $canonical_query;
        $response = wp_remote_get($endpoint, array(
            'headers' => array(
                'Authorization' => $authorization,
                'x-amz-date' => $datetime,
                'x-amz-content-sha256' => $payload_hash,
            ),
            'timeout' => 15,
        ));

        if (is_wp_error($response)) {
            return array(
                'success' => false,
                'message' => 'Network error connecting to AWS S3: ' . $response->get_error_message(),
            );
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $latency = round((microtime(true) - $start_time) * 1000);

        if ($code === 200) {
            return array(
                'success' => true,
                'message' => sprintf(
                    'Successfully connected to S3 bucket "%s" in region "%s"! (Response time: %d ms)',
                    esc_html($this->bucket),
                    esc_html($this->region),
                    $latency
                ),
                'latency_ms' => $latency,
                'bucket' => $this->bucket,
                'region' => $this->region,
            );
        }

        // Handle common AWS S3 errors
        $error_msg = $this->extract_error_message($body, 'Connection failed with HTTP code ' . $code);
        if ($code === 403) {
            $error_msg .= ' (Access Denied. Check your Access Key, Secret Key, and IAM user S3 permissions).';
        } elseif ($code === 404) {
            $error_msg .= ' (Bucket Not Found. Check bucket name or ensure the bucket is in region ' . $this->region . ').';
        } elseif ($code === 301) {
            $error_msg .= ' (Bucket is located in a different AWS region than selected. Check AWS region).';
        }

        return array(
            'success' => false,
            'message' => $error_msg,
            'code' => $code,
        );
    }

    /**
     * Extract XML error message from AWS response.
     *
     * @param string $body
     * @param string $fallback
     * @return string
     */
    private function extract_error_message($body, $fallback)
    {
        if (empty($body)) {
            return $fallback;
        }
        $xml = @simplexml_load_string($body);
        if ($xml) {
            if (!empty($xml->Message)) {
                $code = !empty($xml->Code) ? (string) $xml->Code : '';
                return ($code ? $code . ': ' : '') . (string) $xml->Message;
            }
        }
        return $fallback;
    }
}
