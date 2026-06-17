<?php
/**
 * Secure Session Configuration and Management
 */

function start_secure_session()
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    // Cross-origin support for localhost/Vercel -> Bluehost API
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None'
    ]);

    ini_set('session.use_only_cookies', 1);
    ini_set('session.use_strict_mode', 1);
    ini_set('session.cookie_httponly', 1);
    ini_set('session.cookie_secure', 1);

    session_start();

    $timeout_duration = 1800; // 30 minutes

    if (
        isset($_SESSION['last_activity']) &&
        (time() - $_SESSION['last_activity']) > $timeout_duration
    ) {

        destroy_secure_session();

        http_response_code(401);

        header('Content-Type: application/json');

        echo json_encode([
            'success' => false,
            'error' => 'Session expired',
            'code' => 'SESSION_EXPIRED'
        ]);

        exit;
    }

    $_SESSION['last_activity'] = time();
}

function destroy_secure_session()
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {

        $params = session_get_cookie_params();

        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'] ?? '',
            true,
            true
        );
    }

    session_destroy();
}

