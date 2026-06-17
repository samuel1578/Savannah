<?php
/**
 * Check Session Endpoint
 * Verifies if the admin session is active and valid.
 */

require_once __DIR__ . '/middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/config/session.php';

// Start session securely
start_secure_session();

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['user_email']
        ]
    ]);
} else {
    echo json_encode([
        'success' => true,
        'authenticated' => false
    ]);
}
