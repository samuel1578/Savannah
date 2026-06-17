<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    if (!isset($_GET['id'])) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'message' => 'Section ID is required'
        ]);

        exit;
    }

    $sectionId = (int) $_GET['id'];

    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("
        SELECT
            hs.id,
            hs.section_key,
            hs.chapter_marker,
            hs.status,
            hsf.field_key,
            hsf.field_type,
            hsf.field_value
        FROM homepage_sections hs
        LEFT JOIN homepage_section_fields hsf
            ON hs.id = hsf.section_id
        WHERE hs.id = ?
    ");

    $stmt->execute([$sectionId]);

    $rows = $stmt->fetchAll();

    if (!$rows) {

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'message' => 'Section not found'
        ]);

        exit;
    }

    $section = [
        'id' => $rows[0]['id'],
        'section_key' => $rows[0]['section_key'],
        'chapter_marker' => $rows[0]['chapter_marker'],
        'status' => $rows[0]['status'],
        'fields' => []
    ];

    foreach ($rows as $row) {

        if (!empty($row['field_key'])) {

            $section['fields'][] = [
                'key' => $row['field_key'],
                'type' => $row['field_type'],
                'value' => $row['field_value']
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'section' => $section
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}