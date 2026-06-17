<?php
require_once __DIR__ . '/middleware/cors.php';
header('Content-Type: application/json');
require_once __DIR__ . '/config/database.php';

// Only allow local/authorized access, or delete this file immediately after use!
try {
    $email = 'newadmin@savannahwater.com'; // Desired Admin Email
    $password = 'YourSecurePassword123!';  // Desired Admin Password

    $db = Database::getInstance()->getConnection();

    // Hash the password securely
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $db->prepare("
        INSERT INTO admin_users (email, password_hash)
        VALUES (:email, :password_hash)
    ");

    $stmt->execute([
        ':email' => $email,
        ':password_hash' => $passwordHash
    ]);

    echo json_encode([
        'success' => true,
        'message' => "Admin user '$email' created successfully!"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}