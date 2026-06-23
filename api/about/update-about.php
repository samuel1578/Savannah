<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

require_auth();
validate_csrf();

try {

    $input = json_decode(file_get_contents('php://input'), true);

    $sectionId = $input['id'] ?? null;

    if (!$sectionId) {
        throw new Exception('Missing section ID');
    }

    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("
        UPDATE about_sections
        SET
            hero_title = ?,
            hero_subtitle = ?,
            hero_image_id = ?,
            farms_image_id = ?,
            status = ?,
            updated_at = NOW()
        WHERE id = ?
    ");

    $stmt->execute([
        $input['hero_title'] ?? '',
        $input['hero_subtitle'] ?? '',
        $input['hero_image_id'] ?? null,
        $input['farms_image_id'] ?? null,
        $input['status'] ?? 'published',
        $sectionId
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'About section updated successfully'
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}