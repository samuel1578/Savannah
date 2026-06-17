<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "STEP 1<br>";

require_once __DIR__ . '/config/database.php';

echo "STEP 2<br>";

try {

    $db = Database::getInstance()->getConnection();

    echo "STEP 3 - DATABASE CONNECTED<br>";

    $stmt = $db->query("SELECT NOW() as server_time");

    $result = $stmt->fetch();

    echo "<pre>";
    print_r($result);
    echo "</pre>";

} catch (Throwable $e) {

    echo "<h2>ERROR</h2>";

    echo "<pre>";
    echo $e->getMessage();
    echo "</pre>";
}