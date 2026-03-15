<?php

// This is a router script for the built-in PHP web server.
// It allows the server to serve static files with CORS headers during local development,
// resolving OpaqueResponseBlocking (ORB) issues when the frontend is on a different port.

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// This file allows us to emulate Apache's "mod_rewrite" functionality from the
// built-in PHP web server. This provides a convenient way to test a CodeIgniter
// application without having installed a "real" web server software here.
if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri)) {
    $filePath = __DIR__ . '/public' . $uri;
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    
    // List of static file extensions to serve directly
    $staticExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'css', 'js', 'ico'];
    
    if (in_array(strtolower($ext), $staticExts)) {
        // Essential CORS headers for static assets in development
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        
        // Handle OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        // Determine correct Content-Type mapping
        $mimeTypes = [
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'css' => 'text/css',
            'js' => 'application/javascript',
            'ico' => 'image/x-icon',
        ];
        
        $mime = $mimeTypes[strtolower($ext)] ?? 'application/octet-stream';
        header('Content-Type: ' . $mime);
        
        readfile($filePath);
        return true;
    }
    
    return false; // Let the built-in server handle other existing files
}

// Pass all other requests (APIs, pages) to CodeIgniter's index.php
require_once __DIR__ . '/public/index.php';
