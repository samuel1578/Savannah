<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

require_auth();
validate_csrf();

try {

    $input = json_decode(file_get_contents('php://input'), true);

    $collectionId = $input['id'] ?? null;

    if (!$collectionId) {
        throw new Exception('Missing collection ID');
    }

    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("
        UPDATE about_signature_collections
        SET
            tab_title = ?,
            tab_content = ?,
            status = ?,
            updated_at = NOW()
        WHERE id = ?
    ");

    $stmt->execute([
        $input['tab_title'] ?? '',
        $input['tab_content'] ?? '',
        $input['status'] ?? 'published',
        $collectionId
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Signature collection updated successfully'
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}