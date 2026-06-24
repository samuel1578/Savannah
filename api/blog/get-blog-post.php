<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $db = Database::getInstance()->getConnection();

    /*
    |--------------------------------------------------------------------------
    | Get Identifier (slug or id)
    |--------------------------------------------------------------------------
    */

    $identifier = isset($_GET['slug']) ? $_GET['slug'] : (isset($_GET['id']) ? $_GET['id'] : null);

    if (empty($identifier)) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Missing slug or id parameter'
        ]);

        exit;
    }

    /*
    |--------------------------------------------------------------------------
    | Determine Query By Slug or ID
    |--------------------------------------------------------------------------
    */

    $isNumeric = is_numeric($identifier);

    $query = "
        SELECT
            bp.id,
            bp.slug,
            bp.title,
            bp.category_id,
            bc.category_name,
            bp.excerpt,
            bp.body_content,
            bp.featured_image_id,
            bp.author,
            bp.publish_date,
            bp.status,
            bp.seo_title,
            bp.seo_description,
            bp.created_at,
            bp.updated_at
        FROM blog_posts bp
        LEFT JOIN blog_categories bc
            ON bp.category_id = bc.id
        WHERE " . ($isNumeric ? "bp.id = ?" : "bp.slug = ?") . "
        LIMIT 1
    ";

    $stmt = $db->prepare($query);
    $stmt->execute([$identifier]);

    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'error' => 'Post not found'
        ]);

        exit;
    }

    /*
    |--------------------------------------------------------------------------
    | Resolve Featured Image (Shadow Field Pattern)
    |--------------------------------------------------------------------------
    */

    if (!empty($post['featured_image_id'])) {

        $mediaStmt = $db->prepare(
            "SELECT file_path, alt_text FROM media_assets WHERE id = ?"
        );

        $mediaStmt->execute([$post['featured_image_id']]);

        $media = $mediaStmt->fetch(PDO::FETCH_ASSOC);

        if ($media) {

            $post['featured_image_url'] = $media['file_path'];
            $post['featured_image_alt'] = $media['alt_text'];
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        'success' => true,
        'post' => $post
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}