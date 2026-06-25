<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $db = Database::getInstance()->getConnection();

    $stmt = $db->query("
        SELECT
            id,
            setting_key,
            setting_value,
            group_name,
            created_at,
            updated_at
        FROM global_settings
        ORDER BY group_name, setting_key
    ");

    $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'settings' => $settings
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}