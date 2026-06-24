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
    | Validate ID
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
    | Delete Post (Hard Delete)
    |--------------------------------------------------------------------------
    */

    $deleteStmt = $db->prepare("DELETE FROM blog_posts WHERE id = ?");
    $deleteStmt->execute([$input['id']]);

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        'success' => true,
        'message' => 'Post deleted successfully'
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}