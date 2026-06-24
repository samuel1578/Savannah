<?php

require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    // Require authentication for admin access
    require_auth();

    $db = Database::getInstance()->getConnection();

    /*
    |--------------------------------------------------------------------------
    | Fetch All Submissions
    |--------------------------------------------------------------------------
    */

    $stmt = $db->query("
        SELECT
            id,
            name,
            experience_type,
            preferred_date,
            email,
            message,
            status,
            admin_notes,
            created_at,
            updated_at
        FROM contact_submissions
        ORDER BY created_at DESC
    ");

    $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        'success' => true,
        'submissions' => $submissions
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}