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
    | Resolve Hero Image
    |--------------------------------------------------------------------------
    */

    if (!empty($hero['hero_image_id'])) {

        $mediaStmt = $db->prepare("
            SELECT file_path, alt_text
            FROM media_assets
            WHERE id = ?
        ");

        $mediaStmt->execute([$hero['hero_image_id']]);

        $media = $mediaStmt->fetch(PDO::FETCH_ASSOC);

        if ($media) {

            $hero['hero_image_url'] = $media['file_path'];
            $hero['hero_image_alt'] = $media['alt_text'];
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Resolve Farms Image
    |--------------------------------------------------------------------------
    */

    if (
        isset($hero['farms_image_id']) &&
        !empty($hero['farms_image_id'])
    ) {

        $mediaStmt = $db->prepare("
            SELECT file_path, alt_text
            FROM media_assets
            WHERE id = ?
        ");

        $mediaStmt->execute([$hero['farms_image_id']]);

        $media = $mediaStmt->fetch(PDO::FETCH_ASSOC);

        if ($media) {

            $hero['farms_image_url'] = $media['file_path'];
            $hero['farms_image_alt'] = $media['alt_text'];
        }
    }

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
    | Resolve Timeline Images
    |--------------------------------------------------------------------------
    */

    foreach ($storyTimeline as &$item) {

        if (
            isset($item['image_id']) &&
            !empty($item['image_id'])
        ) {

            $mediaStmt = $db->prepare("
                SELECT file_path, alt_text
                FROM media_assets
                WHERE id = ?
            ");

            $mediaStmt->execute([$item['image_id']]);

            $media = $mediaStmt->fetch(PDO::FETCH_ASSOC);

            if ($media) {

                $item['image_url'] = $media['file_path'];
                $item['image_alt'] = $media['alt_text'];
            }
        }
    }

    unset($item);

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
    | Resolve Craftsmanship Images
    |--------------------------------------------------------------------------
    */

    foreach ($craftsmanshipCards as &$card) {

        if (!empty($card['image_id'])) {

            $mediaStmt = $db->prepare("
                SELECT file_path, alt_text
                FROM media_assets
                WHERE id = ?
            ");

            $mediaStmt->execute([$card['image_id']]);

            $media = $mediaStmt->fetch(PDO::FETCH_ASSOC);

            if ($media) {

                $card['image_url'] = $media['file_path'];
                $card['image_alt'] = $media['alt_text'];
            }
        }
    }

    unset($card);

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
    | Resolve Collection Images
    |--------------------------------------------------------------------------
    */

    foreach ($signatureCollections as &$collection) {

        if (
            isset($collection['main_image_id']) &&
            !empty($collection['main_image_id'])
        ) {

            $mediaStmt = $db->prepare("
                SELECT file_path, alt_text
                FROM media_assets
                WHERE id = ?
            ");

            $mediaStmt->execute([$collection['main_image_id']]);

            $media = $mediaStmt->fetch(PDO::FETCH_ASSOC);

            if ($media) {

                $collection['main_image_url'] = $media['file_path'];
                $collection['main_image_alt'] = $media['alt_text'];
            }
        }
    }

    unset($collection);

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