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

    if (!$input || !isset($input['id']) || !isset($input['status'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing id or status']);
        exit;
    }

    $allowedStatuses = ['new', 'read', 'replied', 'archived'];
    if (!in_array($input['status'], $allowedStatuses)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid status value']);
        exit;
    }

    $stmt = $db->prepare("
        UPDATE contact_submissions
        SET status = ?, updated_at = NOW()
        WHERE id = ?
    ");

    $stmt->execute([$input['status'], $input['id']]);

    echo json_encode([
        'success' => true,
        'message' => 'Status updated successfully'
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}