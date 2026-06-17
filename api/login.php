<?php

require_once __DIR__ . '/middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/middleware/auth.php';

try {

    // Validate CSRF token
   validate_csrf();

    $input = json_decode(file_get_contents('php://input'), true);

    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Email and password are required'
        ]);

        exit();
    }

    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("
        SELECT id, email, password_hash
        FROM admin_users
        WHERE email = :email
        LIMIT 1
    ");

    $stmt->execute([
        ':email' => $email
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password_hash'])) {

        http_response_code(401);

        echo json_encode([
            'success' => false,
            'error' => 'Invalid credentials'
        ]);

        exit();
    }

    // Preserve CSRF token before session regeneration
$csrf_token = $_SESSION['csrf_token'] ?? null;

// Prevent session fixation
session_regenerate_id(true);

// Restore token after regeneration
if ($csrf_token !== null) {
    $_SESSION['csrf_token'] = $csrf_token;
}

// Create authenticated session
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_email'] = $user['email'];

    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email']
        ]
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
