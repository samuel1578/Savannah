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

    $required = ['title', 'category_id', 'excerpt', 'body_content', 'status'];

    foreach ($required as $field) {

        if (empty($input[$field])) {

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
    | Generate Slug if Not Provided
    |--------------------------------------------------------------------------
    */

    $slug = !empty($input['slug']) ? $input['slug'] : $input['title'];

    // Sanitize slug: lowercase, replace spaces with hyphens, remove special chars
    $slug = strtolower(trim($slug));
    $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
    $slug = preg_replace('/-+/', '-', $slug);
    $slug = trim($slug, '-');

    // Check if slug already exists
    $checkStmt = $db->prepare("SELECT id FROM blog_posts WHERE slug = ?");
    $checkStmt->execute([$slug]);

    if ($checkStmt->fetch()) {

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
    | Insert Blog Post
    |--------------------------------------------------------------------------
    */

    $insertStmt = $db->prepare("
        INSERT INTO blog_posts (
            slug,
            title,
            category_id,
            excerpt,
            body_content,
            featured_image_id,
            author,
            publish_date,
            status,
            seo_title,
            seo_description
        ) VALUES (
            :slug,
            :title,
            :category_id,
            :excerpt,
            :body_content,
            :featured_image_id,
            :author,
            :publish_date,
            :status,
            :seo_title,
            :seo_description
        )
    ");

    $insertStmt->execute([
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

    $newId = $db->lastInsertId();

    /*
    |--------------------------------------------------------------------------
    | Fetch and Return the New Post
    |--------------------------------------------------------------------------
    */

    // Re-fetch the post with resolved image (reuse get-blog-post logic)
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

    $fetchStmt->execute([$newId]);
    $newPost = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    // Resolve featured image
    if (!empty($newPost['featured_image_id'])) {

        $mediaStmt = $db->prepare(
            "SELECT file_path, alt_text FROM media_assets WHERE id = ?"
        );

        $mediaStmt->execute([$newPost['featured_image_id']]);

        $media = $mediaStmt->fetch(PDO::FETCH_ASSOC);

        if ($media) {

            $newPost['featured_image_url'] = $media['file_path'];
            $newPost['featured_image_alt'] = $media['alt_text'];
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    http_response_code(201);

    echo json_encode([
        'success' => true,
        'message' => 'Post created successfully',
        'post' => $newPost
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}