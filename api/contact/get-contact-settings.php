<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $db = Database::getInstance()->getConnection();

    $stmt = $db->query("
        SELECT setting_key, setting_value
        FROM contact_settings
        WHERE setting_key = 'hero_image_id'
        LIMIT 1
    ");

    $setting = $stmt->fetch(PDO::FETCH_ASSOC);

    $heroImageId = $setting ? $setting['setting_value'] : null;

    $response = [
        'hero_image_id' => $heroImageId,
        'hero_image_url' => null,
        'hero_image_alt' => null
    ];

    if (!empty($heroImageId)) {

        $mediaStmt = $db->prepare(
            "SELECT file_path, alt_text FROM media_assets WHERE id = ?"
        );

        $mediaStmt->execute([$heroImageId]);

        $media = $mediaStmt->fetch(PDO::FETCH_ASSOC);

        if ($media) {

            $response['hero_image_url'] = $media['file_path'];
            $response['hero_image_alt'] = $media['alt_text'];
        }
    }

    echo json_encode([
        'success' => true,
        'settings' => $response
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}