-- Schema for TechTimeoff application
-- Run this in MySQL Workbench or via mysql CLI

CREATE DATABASE IF NOT EXISTS `user_auth` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `user_auth`;

-- Users table (used by existing Flask login/signup code)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `role` ENUM('user','admin') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leave requests table (frontend sends from, to, type, note, notify)
CREATE TABLE IF NOT EXISTS `leave_requests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `days` DECIMAL(6,2) GENERATED ALWAYS AS (
    TIMESTAMPDIFF(DAY, `start_date`, `end_date`) + 1
  ) STORED,
  `leave_type` VARCHAR(120) NOT NULL,
  `note` TEXT NULL,
  `notify` JSON NULL,
  `status` ENUM('Pending','Approved','Rejected','Cancelled') NOT NULL DEFAULT 'Pending',
  `approver_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leave_user` (`user_id`),
  KEY `idx_leave_status` (`status`),
  CONSTRAINT `fk_leave_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional table for audit or notifications if needed later
CREATE TABLE IF NOT EXISTS `leave_notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `leave_id` INT UNSIGNED NOT NULL,
  `recipient` VARCHAR(255) NOT NULL,
  `sent_at` TIMESTAMP NULL,
  `method` VARCHAR(50) NULL,
  PRIMARY KEY (`id`),
  KEY `idx_notif_leave` (`leave_id`),
  CONSTRAINT `fk_notif_leave` FOREIGN KEY (`leave_id`) REFERENCES `leave_requests`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Helpful view to join leaves with users (for quick admin listing)
CREATE OR REPLACE VIEW `v_leave_with_user` AS
SELECT lr.id, u.username, u.full_name, lr.start_date, lr.end_date, lr.days, lr.leave_type, lr.status, lr.created_at
FROM leave_requests lr
JOIN users u ON lr.user_id = u.id;
