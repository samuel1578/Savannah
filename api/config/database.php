<?php
/**
 * Savannah Water CMS
 * Database Connection Configuration
 * Debug Version
 */

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');

define('DB_NAME', 'kxxdbhmy_savannah_cms');
define('DB_USER', 'kxxdbhmy_savannah_admin');
define('DB_PASS', 'samuel1578');

class Database
{
    private static $instance = null;
    private $conn;

    private function __construct()
    {
        try {

            $dsn = sprintf(
                "mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4",
                DB_HOST,
                DB_PORT,
                DB_NAME
            );

            $this->conn = new PDO(
                $dsn,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );

        } catch (PDOException $e) {

            echo json_encode([
                'success' => false,
                'error' => $e->getMessage(),
                'database' => DB_NAME,
                'user' => DB_USER
            ]);

            exit;
        }
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function getConnection()
    {
        return $this->conn;
    }
}
