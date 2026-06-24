<?php

// ============================================================
// 1. CORS HANDLING - MUST BE FIRST
// ============================================================

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $allowed_origins = [
        'http://localhost:5173',
        'https://savannah-delta.vercel.app'
    ];
    if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400");
    }
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: " . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']);
    }
    exit(0);
}

// ============================================================
// 2. NORMAL EXECUTION
// ============================================================

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $db = Database::getInstance()->getConnection();

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
        exit;
    }

    $required = ['name', 'email', 'message'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => "Missing required field: {$field}"]);
            exit;
        }
    }

    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid email address']);
        exit;
    }

    $stmt = $db->prepare("
        INSERT INTO contact_submissions (
            name,
            experience_type,
            preferred_date,
            email,
            message,
            status
        ) VALUES (
            :name,
            :experience_type,
            :preferred_date,
            :email,
            :message,
            'new'
        )
    ");

    $stmt->execute([
        ':name' => $input['name'],
        ':experience_type' => !empty($input['experience_type']) ? $input['experience_type'] : null,
        ':preferred_date' => !empty($input['preferred_date']) ? $input['preferred_date'] : null,
        ':email' => $input['email'],
        ':message' => $input['message']
    ]);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for contacting us. We will get back to you shortly.'
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}