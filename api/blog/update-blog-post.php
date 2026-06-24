<?php

require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $db = Database::getInstance()->getConnection();

    /*
    |--------------------------------------------------------------------------
    | Get JSON Input
    |--------------------------------------------------------------------------
    */

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON payload'
        ]);

        exit;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Required Fields
    |--------------------------------------------------------------------------
    */

    if (empty($input['id'])) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Missing post ID'
        ]);

        exit;
    }

    $required = ['title', 'category_id', 'excerpt', 'body_content', 'status'];

    foreach ($required as $field) {

        if (!isset($input[$field]) || empty($input[$field])) {

            http_response_code(400);

            echo json_encode([
                'success' => false,
                'error' => "Missing required field: {$field}"
            ]);

            exit;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Check if Post Exists
    |--------------------------------------------------------------------------
    */

    $checkStmt = $db->prepare("SELECT id FROM blog_posts WHERE id = ?");
    $checkStmt->execute([$input['id']]);

    if (!$checkStmt->fetch()) {

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'error' => 'Post not found'
        ]);

        exit;
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Slug if Changed
    |--------------------------------------------------------------------------
    */

    $slug = !empty($input['slug']) ? $input['slug'] : $input['title'];

    // Sanitize slug
    $slug = strtolower(trim($slug));
    $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
    $slug = preg_replace('/-+/', '-', $slug);
    $slug = trim($slug, '-');

    // Check if slug already exists (excluding current post)
    $checkSlugStmt = $db->prepare("SELECT id FROM blog_posts WHERE slug = ? AND id != ?");
    $checkSlugStmt->execute([$slug, $input['id']]);

    if ($checkSlugStmt->fetch()) {

        // Append timestamp to make unique
        $slug = $slug . '-' . time();
    }

    /*
    |--------------------------------------------------------------------------
    | Set Defaults for Optional Fields
    |--------------------------------------------------------------------------
    */

    $author = !empty($input['author']) ? $input['author'] : 'Savannah Water';
    $publishDate = !empty($input['publish_date']) ? $input['publish_date'] : date('Y-m-d');
    $featuredImageId = !empty($input['featured_image_id']) ? $input['featured_image_id'] : null;
    $seoTitle = !empty($input['seo_title']) ? $input['seo_title'] : null;
    $seoDescription = !empty($input['seo_description']) ? $input['seo_description'] : null;

    /*
    |--------------------------------------------------------------------------
    | Update Blog Post
    |--------------------------------------------------------------------------
    */

    $updateStmt = $db->prepare("
        UPDATE blog_posts SET
            slug = :slug,
            title = :title,
            category_id = :category_id,
            excerpt = :excerpt,
            body_content = :body_content,
            featured_image_id = :featured_image_id,
            author = :author,
            publish_date = :publish_date,
            status = :status,
            seo_title = :seo_title,
            seo_description = :seo_description
        WHERE id = :id
    ");

    $updateStmt->execute([
        ':id' => $input['id'],
        ':slug' => $slug,
        ':title' => $input['title'],
        ':category_id' => $input['category_id'],
        ':excerpt' => $input['excerpt'],
        ':body_content' => $input['body_content'],
        ':featured_image_id' => $featuredImageId,
        ':author' => $author,
        ':publish_date' => $publishDate,
        ':status' => $input['status'],
        ':seo_title' => $seoTitle,
        ':seo_description' => $seoDescription
    ]);

    /*
    |--------------------------------------------------------------------------
    | Fetch and Return the Updated Post
    |--------------------------------------------------------------------------
    */

    $fetchStmt = $db->prepare("
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
        WHERE bp.id = ?
        LIMIT 1
    ");

    $fetchStmt->execute([$input['id']]);
    $updatedPost = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    // Resolve featured image
    if (!empty($updatedPost['featured_image_id'])) {

        $mediaStmt = $db->prepare(
            "SELECT file_path, alt_text FROM media_assets WHERE id = ?"
        );

        $mediaStmt->execute([$updatedPost['featured_image_id']]);

        $media = $mediaStmt->fetch(PDO::FETCH_ASSOC);

        if ($media) {

            $updatedPost['featured_image_url'] = $media['file_path'];
            $updatedPost['featured_image_alt'] = $media['alt_text'];
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        'success' => true,
        'message' => 'Post updated successfully',
        'post' => $updatedPost
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}