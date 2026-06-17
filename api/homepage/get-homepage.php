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

