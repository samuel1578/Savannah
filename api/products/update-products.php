<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

require_auth();
validate_csrf();

try {

    $input = json_decode(file_get_contents('php://input'), true);

    $productId = $input['id'] ?? null;

    if (!$productId) {
        throw new Exception('Missing product ID');
    }

    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("
        UPDATE homepage_products
        SET
            product_name = ?,
            product_subtitle = ?,
            product_description = ?,
            updated_at = NOW()
        WHERE id = ?
    ");

    $stmt->execute([
        $input['product_name'] ?? '',
        $input['product_subtitle'] ?? '',
        $input['product_description'] ?? '',
        $productId
    ]);

    echo json_encode([
        'success' => true
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}