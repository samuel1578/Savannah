<?php

require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    require_auth();
    validate_csrf();

    $db = Database::getInstance()->getConnection();

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['settings']) || !is_array($input['settings'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid payload. Expected settings array.'
        ]);
        exit;
    }

    $db->beginTransaction();

    $stmt = $db->prepare("
        UPDATE global_settings
        SET setting_value = ?, updated_at = NOW()
        WHERE setting_key = ?
    ");

    foreach ($input['settings'] as $setting) {
        if (!isset($setting['setting_key']) || !isset($setting['setting_value'])) {
            continue;
        }
        $stmt->execute([$setting['setting_value'], $setting['setting_key']]);
    }

    $db->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Settings updated successfully'
    ]);

} catch (Throwable $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}