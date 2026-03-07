-- NoticeHub Production Schema
-- Compatible with MySQL 8.0+

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Users
-- ----------------------------
CREATE TABLE IF NOT EXISTS `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','STUDENT') NOT NULL DEFAULT 'STUDENT',
  `department` varchar(255) NOT NULL,
  `year` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for Notices
-- ----------------------------
CREATE TABLE IF NOT EXISTS `Notices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('EXAM','DRIVE','EVENT','GENERAL') NOT NULL DEFAULT 'GENERAL',
  `department` varchar(255) NOT NULL,
  `year` varchar(255) NOT NULL,
  `publish_date` datetime NOT NULL,
  `status` enum('ACTIVE','ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `department` (`department`),
  KEY `publish_date` (`publish_date`),
  KEY `category` (`category`),
  KEY `status` (`status`),
  CONSTRAINT `notices_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for NoticeReadStatuses
-- ----------------------------
CREATE TABLE IF NOT EXISTS `NoticeReadStatuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `notice_id` int(11) NOT NULL,
  `read_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `notice_read_statuses_user_id_notice_id_unique` (`user_id`,`notice_id`),
  KEY `notice_id` (`notice_id`),
  CONSTRAINT `notice_read_statuses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notice_read_statuses_ibfk_2` FOREIGN KEY (`notice_id`) REFERENCES `Notices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for DriveRegistrations
-- ----------------------------
CREATE TABLE IF NOT EXISTS `DriveRegistrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `drive_id` int(11) NOT NULL,
  `registered_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `drive_registrations_user_id_drive_id_unique` (`user_id`,`drive_id`),
  KEY `drive_id` (`drive_id`),
  CONSTRAINT `drive_registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `drive_registrations_ibfk_2` FOREIGN KEY (`drive_id`) REFERENCES `Notices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
