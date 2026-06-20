<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $db = Database::getInstance()->getConnection();

    /*
    |--------------------------------------------------------------------------
    | Homepage Sections
    |--------------------------------------------------------------------------
    */

    $sectionsQuery = "
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
        ORDER BY hs.id ASC
    ";

    $stmt = $db->query($sectionsQuery);
    $sectionsData = $stmt->fetchAll();

    $sections = [];

    foreach ($sectionsData as $row) {

        $sectionId = $row['id'];

        if (!isset($sections[$sectionId])) {

            $sections[$sectionId] = [
                'id' => $row['id'],
                'section_key' => $row['section_key'],
                'chapter_marker' => $row['chapter_marker'],
                'status' => $row['status'],
                'fields' => []
            ];
        }

        if (!empty($row['field_key'])) {

            $sections[$sectionId]['fields'][] = [
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

foreach ($sections as &$section) {

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
}

unset($section);
    /*
    |--------------------------------------------------------------------------
    | Homepage Products
    |--------------------------------------------------------------------------
    */

    $productsQuery = "
        SELECT
            p.*,
            m.file_path,
            m.alt_text
        FROM homepage_products p
        LEFT JOIN media_assets m
            ON p.image_id = m.id
        ORDER BY p.display_order ASC
    ";

    $stmt = $db->query($productsQuery);
    $products = $stmt->fetchAll();

    /*
    |--------------------------------------------------------------------------
    | Product Specifications
    |--------------------------------------------------------------------------
    */

    foreach ($products as &$product) {

        $specStmt = $db->prepare("
            SELECT
                spec_label,
                spec_value
            FROM homepage_product_specs
            WHERE product_id = ?
            ORDER BY display_order ASC
        ");

        $specStmt->execute([$product['id']]);

        $product['specifications'] = $specStmt->fetchAll();
    }

    /*
    |--------------------------------------------------------------------------
    | Heritage Stories
    |--------------------------------------------------------------------------
    */

    $storiesQuery = "
        SELECT
            h.*,
            m.file_path,
            m.alt_text
        FROM homepage_heritage_stories h
        LEFT JOIN media_assets m
            ON h.image_id = m.id
        ORDER BY h.display_order ASC
    ";

    $stmt = $db->query($storiesQuery);
    $heritageStories = $stmt->fetchAll();

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        'success' => true,
        'sections' => array_values($sections),
        'products' => $products,
        'heritageStories' => $heritageStories
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

