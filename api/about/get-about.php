<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $db = Database::getInstance()->getConnection();

    /*
    |--------------------------------------------------------------------------
    | ABOUT HERO SECTION
    |--------------------------------------------------------------------------
    */

    $heroStmt = $db->query("
        SELECT *
        FROM about_sections
        WHERE section_key = 'about_hero'
        LIMIT 1
    ");

    $hero = $heroStmt->fetch(PDO::FETCH_ASSOC);

    /*
    |--------------------------------------------------------------------------
    | STORY TIMELINE
    |--------------------------------------------------------------------------
    */

    $timelineStmt = $db->query("
        SELECT *
        FROM about_story_timeline
        WHERE status = 'published'
        ORDER BY display_order ASC
    ");

    $storyTimeline = $timelineStmt->fetchAll(PDO::FETCH_ASSOC);

    /*
    |--------------------------------------------------------------------------
    | CRAFTSMANSHIP CARDS
    |--------------------------------------------------------------------------
    */

    $craftStmt = $db->query("
        SELECT *
        FROM about_craftsmanship_cards
        WHERE status = 'published'
        ORDER BY display_order ASC
    ");

    $craftsmanshipCards = $craftStmt->fetchAll(PDO::FETCH_ASSOC);

    /*
    |--------------------------------------------------------------------------
    | SIGNATURE COLLECTIONS
    |--------------------------------------------------------------------------
    */

    $collectionsStmt = $db->query("
        SELECT *
        FROM about_signature_collections
        WHERE status = 'published'
        ORDER BY display_order ASC
    ");

    $signatureCollections = $collectionsStmt->fetchAll(PDO::FETCH_ASSOC);

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        'success' => true,
        'hero' => $hero,
        'storyTimeline' => $storyTimeline,
        'craftsmanshipCards' => $craftsmanshipCards,
        'signatureCollections' => $signatureCollections
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}