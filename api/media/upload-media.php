<?php

require_once __DIR__ . '/../middleware/cors.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

require_auth();
validate_csrf();

try {

    if (!isset($_FILES['file'])) {
        throw new Exception('No file uploaded');
    }

    $file = $_FILES['file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Upload failed');
    }

    $allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Invalid file type');
    }

    $maxSize = 10 * 1024 * 1024;

    if ($file['size'] > $maxSize) {
        throw new Exception('File exceeds 10MB limit');
    }

    $uploadDir = dirname(__DIR__, 2) . '/uploads/media/';

    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);

    $newFilename =
        uniqid('media_', true) . '.' . $extension;

    $destination =
        $uploadDir . $newFilename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception('Unable to save file');
    }

    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("
        INSERT INTO media_assets
        (
            filename,
            file_path,
            file_type,
            file_size,
            alt_text
        )
        VALUES
        (?, ?, ?, ?, ?)
    ");

    $publicPath =
        '/uploads/media/' . $newFilename;

    $stmt->execute([
        $file['name'],
        $publicPath,
        $file['type'],
        $file['size'],
        ''
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Upload successful'
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}