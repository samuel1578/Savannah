<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

// Require authenticated session and CSRF token validation
require_auth();
validate_csrf();

try {
    // Parse JSON body
    $input = json_decode(file_get_contents('php://input'), true);

    $sectionId = $input['section_id'] ?? null;
    $fields = $input['fields'] ?? null;

    // Validate inputs
    if ($sectionId === null) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing section_id'
        ]);
        exit;
    }

    if (!is_array($fields)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'fields must be an array'
        ]);
        exit;
    }

    $db = Database::getInstance()->getConnection();

    // Verify section exists in homepage_sections
    $sectionCheck = $db->prepare("SELECT id FROM homepage_sections WHERE id = ? LIMIT 1");
    $sectionCheck->execute([$sectionId]);
    if (!$sectionCheck->fetch()) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Section not found'
        ]);
        exit;
    }

    // Begin database transaction
    $db->beginTransaction();

    $updateStmt = $db->prepare("
        UPDATE homepage_section_fields
        SET field_value = ?, updated_at = NOW()
        WHERE section_id = ? AND field_key = ?
    ");

    $totalAffected = 0;

    foreach ($fields as $field) {
        $key = $field['key'] ?? null;
        $value = $field['value'] ?? null;

        if ($key === null) {
            continue; // Skip invalid field structures
        }

        $updateStmt->execute([
            $value,
            $sectionId,
            $key
        ]);

        $affected = $updateStmt->rowCount();
        $totalAffected += $affected;

        file_put_contents(
            __DIR__ . '/update-debug.log',
            json_encode([
                'section_id' => $sectionId,
                'key' => $key,
                'value' => $value,
                'affected_rows' => $affected
            ]) . PHP_EOL,
            FILE_APPEND
        );
    }

    // Commit transaction
    $db->commit();

    echo json_encode([
        'success' => true,
        'section_id' => $sectionId,
        'processed_fields' => count($fields),
        'affected_rows' => $totalAffected,
        'database' => DB_NAME
    ]);

} catch (Exception $e) {
    // Rollback transaction on failure if active
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
