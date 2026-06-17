<?php

require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/middleware/auth.php';

header('Content-Type: application/json');

try {

    $token = get_or_create_csrf_token();

    session_write_close();

    echo json_encode([
        'success' => true,
        'csrf_token' => $token
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

