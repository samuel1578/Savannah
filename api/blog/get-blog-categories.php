<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $db = Database::getInstance()->getConnection();

    /*
    |--------------------------------------------------------------------------
    | Fetch All Categories
    |--------------------------------------------------------------------------
    */

    $stmt = $db->query("
        SELECT
            id,
            category_name
        FROM blog_categories
        ORDER BY category_name ASC
    ");

    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        'success' => true,
        'categories' => $categories
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}