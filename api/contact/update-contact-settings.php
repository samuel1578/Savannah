<?php

require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    // Require authentication and CSRF validation
    require_auth();
    validate_csrf();

    $db = Database::getInstance()->getConnection();

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON payload'
        ]);

        exit;
    }

    if (!isset($input['hero_image_id'])) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Missing hero_image_id field'
        ]);

        exit;
    }

    $heroImageId = !empty($input['hero_image_id']) ? $input['hero_image_id'] : null;

    $stmt = $db->prepare("
        UPDATE contact_settings
        SET setting_value = ?
        WHERE setting_key = 'hero_image_id'
    ");

    $stmt->execute([$heroImageId]);

    // If no rows affected, insert the record
    if ($stmt->rowCount() === 0) {

        $insertStmt = $db->prepare("
            INSERT INTO contact_settings (setting_key, setting_value)
            VALUES ('hero_image_id', ?)
        ");

        $insertStmt->execute([$heroImageId]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Contact settings updated successfully'
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}