USE `user_auth`;

-- Create table for storing user profiles
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `department` VARCHAR(255) NOT NULL,
  `joining_date` DATE NOT NULL,
  `qualification` VARCHAR(255) NOT NULL,
  `specialization` VARCHAR(255),
  `phone` VARCHAR(20),
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `profile_image` LONGTEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_profiles_user_id` (`user_id`),
  UNIQUE KEY `uq_user_profiles_email` (`email`),
  CONSTRAINT `fk_user_profiles_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create table for leave balances
CREATE TABLE IF NOT EXISTS `leave_balances` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `leave_type` ENUM('Casual', 'Sick', 'Earned') NOT NULL,
  `days_available` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `year` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_leave_balances_user_type_year` (`user_id`, `leave_type`, `year`),
  CONSTRAINT `fk_leave_balances_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample profile data (replace user_id with actual ID from your users table)
INSERT INTO user_profiles (
    user_id,
    name,
    email,
    role,
    department,
    joining_date,
    qualification,
    specialization,
    phone,
    gender
) VALUES (
    1, -- Replace with actual user_id
    'Kritika Yadav',
    'kritika.yadav@jims.edu',
    'Teacher',
    'Computer Applications',
    '2020-09-01',
    'MCA',
    'Web Development',
    '+91 999-999-9999',
    'Female'
);

-- Insert sample leave balances
INSERT INTO leave_balances (user_id, leave_type, days_available, year) VALUES
(1, 'Casual', 6, YEAR(CURRENT_DATE)),
(1, 'Sick', 4, YEAR(CURRENT_DATE)),
(1, 'Earned', 2, YEAR(CURRENT_DATE));