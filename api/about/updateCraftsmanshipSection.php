<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

require_auth();
validate_csrf();

try {

    $input = json_decode(file_get_contents('php://input'), true);

    $cardId = $input['id'] ?? null;

    if (!$cardId) {
        throw new Exception('Missing card ID');
    }

    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("
        UPDATE about_craftsmanship_cards
        SET
            heading = ?,
            body_content = ?,
            image_id = ?,
            status = ?,
            updated_at = NOW()
        WHERE id = ?
    ");

    $stmt->execute([
        $input['heading'] ?? '',
        $input['body_content'] ?? '',
        $input['image_id'] ?? null,
        $input['status'] ?? 'published',
        $cardId
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Craftsmanship card updated successfully'
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}