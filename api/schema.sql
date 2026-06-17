-- Savannah Water CMS Database Schema
-- Phase 1: Secure Admin Authentication Foundation

CREATE DATABASE IF NOT EXISTS `savannah_cms` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `savannah_cms`;

-- Table for admin users
CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for tracking login attempts and rate limiting
CREATE TABLE IF NOT EXISTS `login_attempts` (
    `ip_address` VARCHAR(45) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `failed_attempts` INT DEFAULT 0,
    `last_failed_attempt` TIMESTAMP NULL DEFAULT NULL,
    `locked_until` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`ip_address`, `email`),
    INDEX `idx_lockout` (`ip_address`, `email`, `locked_until`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default admin user (email: admin@savannahwater.com, password: Password123!)
-- Password hash generated using password_hash('Password123!', PASSWORD_BCRYPT)
INSERT INTO `admin_users` (`email`, `password_hash`)
VALUES ('admin@savannahwater.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE `email` = `email`;
