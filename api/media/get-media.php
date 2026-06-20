<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $db = Database::getInstance()->getConnection();

    $stmt = $db->query("
        SELECT
            id,
            filename,
            file_path,
            file_type,
            file_size,
            alt_text,
            created_at
        FROM media_assets
        ORDER BY created_at DESC
    ");

    $media = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'media' => $media
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}