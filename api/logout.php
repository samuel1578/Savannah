<?php
/**
 * Admin Logout Endpoint
 * Securely destroys session and clears cookies.
 */

require_once __DIR__ . '/middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/config/session.php';

// Securely destroy the session
destroy_secure_session();

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);
