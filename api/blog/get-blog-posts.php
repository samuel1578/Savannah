<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $db = Database::getInstance()->getConnection();

    /*
    |--------------------------------------------------------------------------
    | Fetch All Blog Posts with Categories
    |--------------------------------------------------------------------------
    */

    $postsQuery = "
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
        ORDER BY bp.publish_date DESC, bp.created_at DESC
    ";

    $stmt = $db->query($postsQuery);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    /*
    |--------------------------------------------------------------------------
    | Resolve Featured Images (Shadow Field Pattern)
    |--------------------------------------------------------------------------
    */

    foreach ($posts as &$post) {

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
    }

    unset($post);

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        'success' => true,
        'posts' => $posts
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}