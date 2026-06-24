<?php

require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    require_auth();

    $db = Database::getInstance()->getConnection();

    if (!isset($_GET['id']) || empty($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing submission ID']);
        exit;
    }

    $id = (int)$_GET['id'];

    $stmt = $db->prepare("
        SELECT
            id,
            name,
            experience_type,
            preferred_date,
            email,
            message,
            status,
            admin_notes,
            created_at,
            updated_at
        FROM contact_submissions
        WHERE id = ?
        LIMIT 1
    ");

    $stmt->execute([$id]);
    $submission = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$submission) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Submission not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'submission' => $submission
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}