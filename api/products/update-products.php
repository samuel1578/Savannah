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

    $db->beginTransaction();

    // Update product text fields
    $stmt = $db->prepare("
        UPDATE homepage_products
        SET
            title = ?,
            description = ?,
            updated_at = NOW()
        WHERE id = ?
    ");

    $stmt->execute([
        $input['title'] ?? '',
        $input['description'] ?? '',
        $productId
    ]);

    // Update specifications
    if (
        isset($input['specifications']) &&
        is_array($input['specifications'])
    ) {

        $deleteStmt = $db->prepare("
            DELETE FROM homepage_product_specs
            WHERE product_id = ?
        ");

        $deleteStmt->execute([$productId]);

        $insertStmt = $db->prepare("
            INSERT INTO homepage_product_specs
            (
                product_id,
                spec_label,
                spec_value,
                display_order
            )
            VALUES (?, ?, ?, ?)
        ");

        foreach ($input['specifications'] as $index => $spec) {

            $insertStmt->execute([
                $productId,
                $spec['spec_label'] ?? '',
                $spec['spec_value'] ?? '',
                $index
            ]);
        }
    }

    $db->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Product updated successfully'
    ]);

} catch (Throwable $e) {

    if (
        isset($db) &&
        $db->inTransaction()
    ) {
        $db->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}