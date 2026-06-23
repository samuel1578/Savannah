<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

require_auth();
validate_csrf();

try {

    $input = json_decode(file_get_contents('php://input'), true);

    $timelineId = $input['id'] ?? null;

    if (!$timelineId) {
        throw new Exception('Missing timeline ID');
    }

    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("
        UPDATE about_story_timeline
        SET
            year_label = ?,
            title = ?,
            story_content = ?,
            image_id = ?,
            status = ?,
            updated_at = NOW()
        WHERE id = ?
    ");

    $stmt->execute([
        $input['year_label'] ?? '',
        $input['title'] ?? '',
        $input['story_content'] ?? '',
        $input['image_id'] ?? null,
        $input['status'] ?? 'published',
        $timelineId
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Timeline updated successfully'
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}