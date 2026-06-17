<?php
/**
 * Login Rate Limiting Middleware
 * Protects against brute-force attacks.
 */

require_once __DIR__ . '/../config/database.php';

/**
 * Get the client's IP address securely.
 */
function get_client_ip() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

/**
 * Checks if a login lockout is active for the given email and IP.
 * Returns the number of seconds remaining if locked out, or 0 if not locked out.
 */
function check_login_lockout($email, $ip) {
    try {
        $db = Database::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            SELECT failed_attempts, locked_until 
            FROM login_attempts 
            WHERE ip_address = :ip AND email = :email
        ");
        
        $stmt->execute([
            ':ip' => $ip,
            ':email' => $email
        ]);
        
        $attempt = $stmt->fetch();
        
        if ($attempt && $attempt['locked_until'] !== null) {
            $locked_until_time = strtotime($attempt['locked_until']);
            $current_time = time();
            
            if ($locked_until_time > $current_time) {
                // User is locked out. Return remaining seconds.
                return $locked_until_time - $current_time;
            } else {
                // Lockout period has expired. We can reset the lockout.
                reset_failed_attempts($email, $ip);
            }
        }
    } catch (PDOException $e) {
        error_log("Rate Limit Check Error: " . $e->getMessage());
        // Fail-safe: do not lock out if database has an issue, but log it
    }
    
    return 0;
}

/**
 * Registers a failed login attempt.
 * If failed attempts reach 5, locks out the user/IP combination for 15 minutes.
 * Returns the total failed attempts or false on error.
 */
function register_failed_attempt($email, $ip) {
    try {
        $db = Database::getInstance()->getConnection();
        
        // Check if a record already exists
        $stmt = $db->prepare("
            SELECT failed_attempts 
            FROM login_attempts 
            WHERE ip_address = :ip AND email = :email
        ");
        $stmt->execute([
            ':ip' => $ip,
            ':email' => $email
        ]);
        $attempt = $stmt->fetch();
        
        if (!$attempt) {
            // First failed attempt
            $stmt = $db->prepare("
                INSERT INTO login_attempts (ip_address, email, failed_attempts, last_failed_attempt, locked_until)
                VALUES (:ip, :email, 1, CURRENT_TIMESTAMP, NULL)
            ");
            $stmt->execute([
                ':ip' => $ip,
                ':email' => $email
            ]);
            return 1;
        } else {
            $new_failed_count = $attempt['failed_attempts'] + 1;
            
            if ($new_failed_count >= 5) {
                // Lockout for 15 minutes
                $stmt = $db->prepare("
                    UPDATE login_attempts 
                    SET failed_attempts = :count, 
                        last_failed_attempt = CURRENT_TIMESTAMP,
                        locked_until = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE)
                    WHERE ip_address = :ip AND email = :email
                ");
            } else {
                $stmt = $db->prepare("
                    UPDATE login_attempts 
                    SET failed_attempts = :count, 
                        last_failed_attempt = CURRENT_TIMESTAMP
                    WHERE ip_address = :ip AND email = :email
                ");
            }
            
            $stmt->execute([
                ':count' => $new_failed_count,
                ':ip' => $ip,
                ':email' => $email
            ]);
            
            return $new_failed_count;
        }
    } catch (PDOException $e) {
        error_log("Register Failed Attempt Error: " . $e->getMessage());
        return false;
    }
}

/**
 * Resets failed login attempts for the given email and IP.
 */
function reset_failed_attempts($email, $ip) {
    try {
        $db = Database::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            DELETE FROM login_attempts 
            WHERE ip_address = :ip AND email = :email
        ");
        
        $stmt->execute([
            ':ip' => $ip,
            ':email' => $email
        ]);
        
        return true;
    } catch (PDOException $e) {
        error_log("Reset Failed Attempts Error: " . $e->getMessage());
        return false;
    }
}
