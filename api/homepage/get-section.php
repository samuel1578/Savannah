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

    /*
|--------------------------------------------------------------------------
| Resolve Homepage Section Media Assets
|--------------------------------------------------------------------------
*/

    $imageFields = [
        'hero_image_id',
        'hero_story_card_image_id',
        'map_image_id',
        'palm_banner_image_id',
        'watermaking_image_id',
        'farms_image_id',
        'reviews_image_id',
        'footer_logo_image_id'
    ];

    foreach ($section['fields'] as $field) {

        if (
            in_array($field['key'], $imageFields) &&
            !empty($field['value'])
        ) {

            $mediaStmt = $db->prepare(
                "SELECT file_path, alt_text FROM media_assets WHERE id = ?"
            );

            $mediaStmt->execute([$field['value']]);

            $media = $mediaStmt->fetch();

            if ($media) {

                $baseKey = str_replace('_id', '', $field['key']);

                $section['fields'][] = [
                    'key' => $baseKey . '_url',
                    'type' => 'url',
                    'value' => $media['file_path']
                ];

                $section['fields'][] = [
                    'key' => $baseKey . '_alt',
                    'type' => 'text',
                    'value' => $media['alt_text']
                ];
            }
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