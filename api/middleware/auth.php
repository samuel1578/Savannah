<?php
/**
 * Authentication and CSRF Middleware
 */

require_once __DIR__ . '/../config/session.php';

// Start secure session for all API requests
start_secure_session();

/**
 * Require the user to be authenticated.
 * Returns 401 Unauthorized if not logged in.
 */
function require_auth()
{
    if (!isset($_SESSION['user_id'])) {

        header('Content-Type: application/json', true, 401);

        echo json_encode([
            'success' => false,
            'error' => 'Authentication required',
            'code' => 'UNAUTHORIZED'
        ]);

        exit();
    }
}

/**
 * Validate CSRF token for state-changing requests.
 */
function validate_csrf()
{
    $method = $_SERVER['REQUEST_METHOD'];

    if (!in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH'])) {
        return;
    }

    $headers = getallheaders();
    $client_token = null;

    foreach ($headers as $key => $value) {

        if (strcasecmp($key, 'X-CSRF-Token') === 0) {
            $client_token = $value;
            break;
        }
    }

    if (!$client_token && $method === 'POST') {

        $input = json_decode(
            file_get_contents('php://input'),
            true
        );

        $client_token = $input['csrf_token'] ?? null;
    }

    if (
        !$client_token ||
        !isset($_SESSION['csrf_token']) ||
        !hash_equals($_SESSION['csrf_token'], $client_token)
    ) {

        header('Content-Type: application/json', true, 403);

        echo json_encode([
            'success' => false,
            'error' => 'Invalid or missing CSRF token',
            'code' => 'INVALID_CSRF'
        ]);

        exit();
    }
}

/**
 * Generate a CSRF token if one does not already exist.
 */
function get_or_create_csrf_token()
{
    if (empty($_SESSION['csrf_token'])) {

        $_SESSION['csrf_token'] = bin2hex(
            random_bytes(32)
        );
    }

    return $_SESSION['csrf_token'];
}

/**
 * Polyfill for environments where getallheaders()
 * is unavailable.
 */
if (!function_exists('getallheaders')) {

    function getallheaders()
    {
        $headers = [];

        foreach ($_SERVER as $name => $value) {

            if (substr($name, 0, 5) === 'HTTP_') {

                $headers[
                    str_replace(
                        ' ',
                        '-',
                        ucwords(
                            strtolower(
                                str_replace(
                                    '_',
                                    ' ',
                                    substr($name, 5)
                                )
                            )
                        )
                    )
                ] = $value;
            }
        }

        return $headers;
    }
}

