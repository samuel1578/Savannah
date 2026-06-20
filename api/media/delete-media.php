<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

require_auth();
validate_csrf();

try {

    $input =
        json_decode(file_get_contents('php://input'), true);

    $id = $input['id'] ?? null;

    if (!$id) {
        throw new Exception('Missing media ID');
    }

    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("
        SELECT *
        FROM media_assets
        WHERE id = ?
    ");

    $stmt->execute([$id]);

    $media =
        $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$media) {
        throw new Exception('Media not found');
    }

    $physicalFile =
        dirname(__DIR__, 2) .
        $media['file_path'];

    if (file_exists($physicalFile)) {
        unlink($physicalFile);
    }

    $deleteStmt = $db->prepare("
        DELETE FROM media_assets
        WHERE id = ?
    ");

    $deleteStmt->execute([$id]);

    echo json_encode([
        'success' => true,
        'message' => 'Media deleted'
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}