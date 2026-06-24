<?php

require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../middleware/auth.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    require_auth();
    validate_csrf();

    $db = Database::getInstance()->getConnection();

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['id']) || !isset($input['subject']) || !isset($input['message'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }

    // Get the submission
    $stmt = $db->prepare("
        SELECT id, name, email, experience_type, message
        FROM contact_submissions
        WHERE id = ?
        LIMIT 1
    ");

    $stmt->execute([$input['id']]);
    $submission = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$submission) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Submission not found']);
        exit;
    }

    // Build the email
    $to = $submission['email'];
    $subject = $input['subject'];
    $userMessage = $submission['message'];
    $adminResponse = $input['message'];

    $emailBody = "Dear {$submission['name']},\n\n";
    $emailBody .= "Thank you for reaching out regarding your interest in {$submission['experience_type']}.\n\n";
    $emailBody .= "--- Original Message ---\n";
    $emailBody .= "{$userMessage}\n\n";
    $emailBody .= "--- Response ---\n";
    $emailBody .= "{$adminResponse}\n\n";
    $emailBody .= "We look forward to connecting with you soon.\n\n";
    $emailBody .= "Warm regards,\n";
    $emailBody .= "Savannah Water Team\n";
    $emailBody .= "https://savannahdrinks.co.uk";

    $headers = "From: Savannah Water <hello@savannahwater.com>\r\n";
    $headers .= "Reply-To: hello@savannahwater.com\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Note: Email sending is now handled via mailto: on the frontend
    // We keep this script to update the status and log the follow-up in the database.
    
    // Optional: You can still try to send a server-side backup email if needed, 
    // but for now we skip it to avoid 500 errors if mail() is not configured.
    /*
    $mailSent = mail($to, $subject, $emailBody, $headers);
    if (!$mailSent) {
        // Log error but don't fail the request
    }
    */

    // Update status to replied
    $stmt = $db->prepare("
        UPDATE contact_submissions
        SET status = 'replied', updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->execute([$input['id']]);

    // Log the follow-up
    $stmt = $db->prepare("
        INSERT INTO contact_followups (submission_id, subject, message)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$input['id'], $input['subject'], $input['message']]);

    echo json_encode([
        'success' => true,
        'message' => 'Follow-up logged and status updated successfully'
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}