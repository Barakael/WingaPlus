-- MySQL dump 10.13  Distrib 9.5.0, for macos14.7 (x86_64)
--
-- Host: 127.0.0.1    Database: wingaplus_db
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '8c59afc2-c054-11f0-8ed6-b5133f055cbe:1-31060';

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model_id` bigint unsigned DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `changes` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_logs_user_id_created_at_index` (`user_id`,`created_at`),
  KEY `activity_logs_model_model_id_index` (`model`,`model_id`),
  KEY `activity_logs_action_index` (`action`),
  CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,1,'delete','User',15,'Deleted user: Test Storekeeper',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-06 10:46:14','2026-01-06 10:46:14'),(2,1,'delete','User',14,'Deleted user: Test Storekeeper',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-06 10:46:19','2026-01-06 10:46:19'),(3,1,'delete','User',13,'Deleted user: Test Storekeeper',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-06 10:46:22','2026-01-06 10:46:22'),(4,1,'delete','User',16,'Deleted user: Barakael lucas',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-06 10:46:26','2026-01-06 10:46:26'),(5,1,'delete','User',9,'Deleted user: Anna Mgeni',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-06 10:46:36','2026-01-06 10:46:36'),(6,1,'update','User',17,'Updated user: Barakael lucas','{\"new\": {\"id\": 17, \"name\": \"Barakael lucas\", \"role\": \"storekeeper\", \"email\": \"barakaellucas2020@gmail.com\", \"phone\": null, \"status\": \"active\", \"shop_id\": 6, \"created_at\": \"2026-01-06T13:47:32.000000Z\", \"updated_at\": \"2026-01-20T19:13:14.000000Z\", \"invitation_token\": \"vDR0QLUCkhKlCX9NpETfW8I3egLohnnj689BlvNks4NmmfjHczXOy1ta6DT5\", \"email_verified_at\": null}, \"old\": {\"id\": 17, \"name\": \"Barakael lucas\", \"role\": \"storekeeper\", \"email\": \"barakaellucas2020@gmail.com\", \"phone\": null, \"status\": \"active\", \"shop_id\": 6, \"created_at\": \"2026-01-06T13:47:32.000000Z\", \"updated_at\": \"2026-01-20T19:13:14.000000Z\", \"invitation_token\": \"vDR0QLUCkhKlCX9NpETfW8I3egLohnnj689BlvNks4NmmfjHczXOy1ta6DT5\", \"email_verified_at\": null}}','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-20 16:13:18','2026-01-20 16:13:18');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `shop_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_shop_id_name_index` (`shop_id`,`name`),
  CONSTRAINT `categories_shop_id_foreign` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Phones','Mobile phones and smartphones',1,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(2,'Laptops','Laptops and notebook computers',1,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(3,'Accessories','Phone and laptop accessories',1,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(4,'Phones','Mobile phones and smartphones',2,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(5,'Laptops','Laptops and notebook computers',2,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(6,'Accessories','Phone and laptop accessories',2,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(7,'Phones','Mobile phones and smartphones',3,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(8,'Laptops','Laptops and notebook computers',3,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(9,'Accessories','Phone and laptop accessories',3,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(10,'Phones','Mobile phones and smartphones',4,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(11,'Laptops','Laptops and notebook computers',4,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(12,'Accessories','Phone and laptop accessories',4,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(13,'Phones','Mobile phones and smartphones',5,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(14,'Laptops','Laptops and notebook computers',5,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(15,'Accessories','Phone and laptop accessories',5,'2026-01-05 08:24:40','2026-01-05 08:24:40'),(16,'Cameras',NULL,1,'2026-01-05 08:28:31','2026-01-05 08:28:31'),(17,'Phones','Mobile phones and smartphones',6,'2026-01-05 08:37:02','2026-01-05 08:37:02'),(18,'Laptops','Laptops and notebook computers',6,'2026-01-05 08:37:02','2026-01-05 08:37:02'),(19,'Accessories','Phone and laptop accessories',6,'2026-01-05 08:37:02','2026-01-05 08:37:02');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenditures`
--

DROP TABLE IF EXISTS `expenditures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenditures` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `salesman_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `expenditure_date` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `expenditures_salesman_id_foreign` (`salesman_id`),
  CONSTRAINT `expenditures_salesman_id_foreign` FOREIGN KEY (`salesman_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenditures`
--

LOCK TABLES `expenditures` WRITE;
/*!40000 ALTER TABLE `expenditures` DISABLE KEYS */;
INSERT INTO `expenditures` VALUES (1,11,'Transport',10000.00,'matumizi yasiyo na lazima','2025-12-02 00:00:00','2025-12-02 15:08:33','2025-12-02 15:39:27');
/*!40000 ALTER TABLE `expenditures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `laptop_models`
--

DROP TABLE IF EXISTS `laptop_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laptop_models` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `series` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `processor_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `release_year` year DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `laptop_models_brand_series_index` (`brand`,`series`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laptop_models`
--

LOCK TABLES `laptop_models` WRITE;
/*!40000 ALTER TABLE `laptop_models` DISABLE KEYS */;
INSERT INTO `laptop_models` VALUES (1,'Apple','MacBook Air','MacBook Air 13\" (2019)','MacBook Air 13\" (2019)','Intel Core i5',2019,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(2,'Apple','MacBook Air','MacBook Air 13\" (2020)','MacBook Air 13\" (2020)','Intel Core i5',2020,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(3,'Apple','MacBook Air','MacBook Air 13\" M1 (2020)','MacBook Air 13\" M1 (2020)','Apple M1',2020,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(4,'Apple','MacBook Air','MacBook Air 13\" M2 (2022)','MacBook Air 13\" M2 (2022)','Apple M2',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(5,'Apple','MacBook Air','MacBook Air 13\" M3 (2024)','MacBook Air 13\" M3 (2024)','Apple M3',2024,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(6,'Apple','MacBook Air','MacBook Air 15\" M3 (2024)','MacBook Air 15\" M3 (2024)','Apple M3',2024,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(7,'Apple','MacBook Pro','MacBook Pro 13\" (2019)','MacBook Pro 13\" (2019)','Intel Core i5/i7',2019,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(8,'Apple','MacBook Pro','MacBook Pro 13\" (2020)','MacBook Pro 13\" (2020)','Intel Core i5/i7',2020,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(9,'Apple','MacBook Pro','MacBook Pro 13\" M1 (2020)','MacBook Pro 13\" M1 (2020)','Apple M1',2020,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(10,'Apple','MacBook Pro','MacBook Pro 14\" M1 Pro (2021)','MacBook Pro 14\" M1 Pro (2021)','Apple M1 Pro',2021,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(11,'Apple','MacBook Pro','MacBook Pro 14\" M2 Pro (2023)','MacBook Pro 14\" M2 Pro (2023)','Apple M2 Pro',2023,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(12,'Apple','MacBook Pro','MacBook Pro 14\" M3 Pro (2023)','MacBook Pro 14\" M3 Pro (2023)','Apple M3 Pro',2023,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(13,'Apple','MacBook Pro','MacBook Pro 16\" M1 Pro (2021)','MacBook Pro 16\" M1 Pro (2021)','Apple M1 Pro/Max',2021,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(14,'Apple','MacBook Pro','MacBook Pro 16\" M3 Pro (2023)','MacBook Pro 16\" M3 Pro (2023)','Apple M3 Pro/Max',2023,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(15,'Apple','MacBook Pro','MacBook Pro 16\" M4 Pro (2024)','MacBook Pro 16\" M4 Pro (2024)','Apple M4 Pro/Max',2024,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(16,'Dell','XPS','XPS 13 9300','Dell XPS 13 9300 (2020)','Intel Core i5/i7 10th Gen',2020,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(17,'Dell','XPS','XPS 13 9310','Dell XPS 13 9310 (2021)','Intel Core i5/i7 11th Gen',2021,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(18,'Dell','XPS','XPS 13 Plus 9320','Dell XPS 13 Plus 9320 (2022)','Intel Core i5/i7 12th Gen',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(19,'Dell','XPS','XPS 13 9340','Dell XPS 13 9340 (2024)','Intel Core Ultra 5/7',2024,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(20,'Dell','XPS','XPS 15 9500','Dell XPS 15 9500 (2020)','Intel Core i5/i7/i9 10th Gen',2020,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(21,'Dell','XPS','XPS 15 9520','Dell XPS 15 9520 (2022)','Intel Core i5/i7/i9 12th Gen',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(22,'Dell','Inspiron','Inspiron 15 5000','Dell Inspiron 15 5000 (2021)','Intel Core i5/i7 11th Gen',2021,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(23,'Dell','Inspiron','Inspiron 15 3000','Dell Inspiron 15 3000 (2022)','Intel Core i3/i5',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(24,'HP','Pavilion','Pavilion 15','HP Pavilion 15 (2021)','Intel Core i5/i7 11th Gen',2021,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(25,'HP','Pavilion','Pavilion Aero 13','HP Pavilion Aero 13 (2022)','AMD Ryzen 5/7',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(26,'HP','Envy','Envy 13','HP Envy 13 (2021)','Intel Core i5/i7 11th Gen',2021,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(27,'HP','Envy','Envy x360 15','HP Envy x360 15 (2022)','AMD Ryzen 5/7',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(28,'HP','Spectre','Spectre x360 13','HP Spectre x360 13 (2021)','Intel Core i5/i7 11th Gen',2021,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(29,'HP','Spectre','Spectre x360 14','HP Spectre x360 14 (2023)','Intel Core i5/i7 13th Gen',2023,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(30,'Lenovo','ThinkPad','ThinkPad X1 Carbon Gen 7','Lenovo ThinkPad X1 Carbon Gen 7 (2019)','Intel Core i5/i7 8th Gen',2019,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(31,'Lenovo','ThinkPad','ThinkPad X1 Carbon Gen 9','Lenovo ThinkPad X1 Carbon Gen 9 (2021)','Intel Core i5/i7 11th Gen',2021,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(32,'Lenovo','ThinkPad','ThinkPad X1 Carbon Gen 11','Lenovo ThinkPad X1 Carbon Gen 11 (2023)','Intel Core i5/i7 13th Gen',2023,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(33,'Lenovo','IdeaPad','IdeaPad 5','Lenovo IdeaPad 5 (2022)','AMD Ryzen 5/7',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(34,'Lenovo','Yoga','Yoga 9i','Lenovo Yoga 9i (2022)','Intel Core i7 12th Gen',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(35,'Lenovo','Legion','Legion 5 Pro','Lenovo Legion 5 Pro (2022)','AMD Ryzen 7',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(36,'Asus','ZenBook','ZenBook 14','Asus ZenBook 14 (2022)','Intel Core i5/i7 12th Gen',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(37,'Asus','VivoBook','VivoBook 15','Asus VivoBook 15 (2021)','Intel Core i3/i5',2021,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(38,'Asus','ROG','ROG Zephyrus G14','Asus ROG Zephyrus G14 (2022)','AMD Ryzen 9',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(39,'Acer','Aspire','Aspire 5','Acer Aspire 5 (2021)','Intel Core i5/i7 11th Gen',2021,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(40,'Acer','Swift','Swift 3','Acer Swift 3 (2022)','AMD Ryzen 5/7',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51'),(41,'Acer','Predator','Predator Helios 300','Acer Predator Helios 300 (2022)','Intel Core i7 12th Gen',2022,'2026-01-23 17:59:51','2026-01-23 17:59:51');
/*!40000 ALTER TABLE `laptop_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `laptop_variants`
--

DROP TABLE IF EXISTS `laptop_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laptop_variants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `laptop_model_id` bigint unsigned NOT NULL,
  `ram` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `laptop_variants_laptop_model_id_index` (`laptop_model_id`),
  CONSTRAINT `laptop_variants_laptop_model_id_foreign` FOREIGN KEY (`laptop_model_id`) REFERENCES `laptop_models` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=252 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laptop_variants`
--

LOCK TABLES `laptop_variants` WRITE;
/*!40000 ALTER TABLE `laptop_variants` DISABLE KEYS */;
INSERT INTO `laptop_variants` VALUES (1,1,'8GB','128GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(2,1,'8GB','128GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(3,1,'8GB','128GB SSD','Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(4,1,'8GB','256GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(5,1,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(6,1,'8GB','256GB SSD','Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(7,1,'16GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(8,1,'16GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(9,1,'16GB','512GB SSD','Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(10,2,'8GB','256GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(11,2,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(12,2,'8GB','256GB SSD','Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(13,2,'8GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(14,2,'8GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(15,2,'8GB','512GB SSD','Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(16,2,'16GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(17,2,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(18,2,'16GB','1TB SSD','Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(19,3,'8GB','256GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(20,3,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(21,3,'8GB','256GB SSD','Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(22,3,'8GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(23,3,'8GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(24,3,'8GB','512GB SSD','Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(25,3,'16GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(26,3,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(27,3,'16GB','1TB SSD','Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(28,3,'16GB','2TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(29,3,'16GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(30,3,'16GB','2TB SSD','Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(31,4,'8GB','256GB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(32,4,'8GB','256GB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(33,4,'8GB','256GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(34,4,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(35,4,'8GB','512GB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(36,4,'8GB','512GB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(37,4,'8GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(38,4,'8GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(39,4,'16GB','1TB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(40,4,'16GB','1TB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(41,4,'16GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(42,4,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(43,4,'24GB','2TB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(44,4,'24GB','2TB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(45,4,'24GB','2TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(46,4,'24GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(47,5,'8GB','256GB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(48,5,'8GB','256GB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(49,5,'8GB','256GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(50,5,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(51,5,'16GB','512GB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(52,5,'16GB','512GB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(53,5,'16GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(54,5,'16GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(55,5,'24GB','1TB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(56,5,'24GB','1TB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(57,5,'24GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(58,5,'24GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(59,5,'24GB','2TB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(60,5,'24GB','2TB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(61,5,'24GB','2TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(62,5,'24GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(63,6,'8GB','256GB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(64,6,'8GB','256GB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(65,6,'8GB','256GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(66,6,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(67,6,'16GB','512GB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(68,6,'16GB','512GB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(69,6,'16GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(70,6,'16GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(71,6,'24GB','1TB SSD','Midnight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(72,6,'24GB','1TB SSD','Starlight','2026-01-23 17:59:51','2026-01-23 17:59:51'),(73,6,'24GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(74,6,'24GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(75,7,'8GB','256GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(76,7,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(77,7,'8GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(78,7,'8GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(79,7,'16GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(80,7,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(81,7,'16GB','2TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(82,7,'16GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(83,8,'8GB','256GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(84,8,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(85,8,'16GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(86,8,'16GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(87,8,'16GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(88,8,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(89,8,'32GB','2TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(90,8,'32GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(91,9,'8GB','256GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(92,9,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(93,9,'8GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(94,9,'8GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(95,9,'16GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(96,9,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(97,9,'16GB','2TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(98,9,'16GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(99,10,'16GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(100,10,'16GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(101,10,'16GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(102,10,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(103,10,'32GB','2TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(104,10,'32GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(105,11,'16GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(106,11,'16GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(107,11,'16GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(108,11,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(109,11,'32GB','2TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(110,11,'32GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(111,12,'18GB','512GB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(112,12,'18GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(113,12,'18GB','1TB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(114,12,'18GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(115,12,'36GB','2TB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(116,12,'36GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(117,12,'36GB','4TB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(118,12,'36GB','4TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(119,13,'16GB','512GB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(120,13,'16GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(121,13,'16GB','1TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(122,13,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(123,13,'32GB','2TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(124,13,'32GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(125,13,'64GB','4TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(126,13,'64GB','4TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(127,13,'64GB','8TB SSD','Space Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(128,13,'64GB','8TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(129,14,'18GB','512GB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(130,14,'18GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(131,14,'36GB','1TB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(132,14,'36GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(133,14,'48GB','2TB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(134,14,'48GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(135,14,'128GB','4TB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(136,14,'128GB','4TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(137,14,'128GB','8TB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(138,14,'128GB','8TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(139,15,'24GB','512GB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(140,15,'24GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(141,15,'48GB','1TB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(142,15,'48GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(143,15,'64GB','2TB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(144,15,'64GB','2TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(145,15,'128GB','4TB SSD','Space Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(146,15,'128GB','4TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(147,16,'8GB','256GB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(148,16,'8GB','256GB SSD','Frost White','2026-01-23 17:59:51','2026-01-23 17:59:51'),(149,16,'16GB','512GB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(150,16,'16GB','512GB SSD','Frost White','2026-01-23 17:59:51','2026-01-23 17:59:51'),(151,16,'32GB','1TB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(152,16,'32GB','1TB SSD','Frost White','2026-01-23 17:59:51','2026-01-23 17:59:51'),(153,17,'8GB','256GB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(154,17,'8GB','256GB SSD','Frost White','2026-01-23 17:59:51','2026-01-23 17:59:51'),(155,17,'16GB','512GB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(156,17,'16GB','512GB SSD','Frost White','2026-01-23 17:59:51','2026-01-23 17:59:51'),(157,17,'32GB','1TB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(158,17,'32GB','2TB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(159,18,'16GB','512GB SSD','Platinum','2026-01-23 17:59:51','2026-01-23 17:59:51'),(160,18,'16GB','512GB SSD','Graphite','2026-01-23 17:59:51','2026-01-23 17:59:51'),(161,18,'32GB','1TB SSD','Platinum','2026-01-23 17:59:51','2026-01-23 17:59:51'),(162,18,'32GB','1TB SSD','Graphite','2026-01-23 17:59:51','2026-01-23 17:59:51'),(163,18,'32GB','2TB SSD','Platinum','2026-01-23 17:59:51','2026-01-23 17:59:51'),(164,19,'16GB','512GB SSD','Platinum','2026-01-23 17:59:51','2026-01-23 17:59:51'),(165,19,'16GB','512GB SSD','Graphite','2026-01-23 17:59:51','2026-01-23 17:59:51'),(166,19,'32GB','1TB SSD','Platinum','2026-01-23 17:59:51','2026-01-23 17:59:51'),(167,19,'32GB','1TB SSD','Graphite','2026-01-23 17:59:51','2026-01-23 17:59:51'),(168,19,'64GB','2TB SSD','Platinum','2026-01-23 17:59:51','2026-01-23 17:59:51'),(169,20,'8GB','256GB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(170,20,'16GB','512GB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(171,20,'32GB','1TB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(172,20,'64GB','2TB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(173,21,'16GB','512GB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(174,21,'32GB','1TB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(175,21,'64GB','2TB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(176,21,'64GB','4TB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(177,22,'8GB','256GB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(178,22,'8GB','512GB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(179,22,'16GB','512GB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(180,22,'16GB','1TB SSD','Platinum Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(181,23,'4GB','128GB SSD','Carbon Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(182,23,'8GB','256GB SSD','Carbon Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(183,23,'8GB','512GB SSD','Carbon Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(184,23,'16GB','512GB SSD','Carbon Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(185,24,'8GB','256GB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(186,24,'8GB','512GB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(187,24,'16GB','512GB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(188,24,'16GB','1TB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(189,25,'8GB','256GB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(190,25,'8GB','256GB SSD','Pale Rose Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(191,25,'16GB','512GB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(192,25,'16GB','512GB SSD','Pale Rose Gold','2026-01-23 17:59:51','2026-01-23 17:59:51'),(193,26,'8GB','256GB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(194,26,'8GB','512GB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(195,26,'16GB','512GB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(196,26,'16GB','1TB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(197,27,'8GB','256GB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(198,27,'16GB','512GB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(199,27,'16GB','1TB SSD','Natural Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(200,28,'8GB','256GB SSD','Nightfall Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(201,28,'8GB','256GB SSD','Poseidon Blue','2026-01-23 17:59:51','2026-01-23 17:59:51'),(202,28,'16GB','512GB SSD','Nightfall Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(203,28,'16GB','512GB SSD','Poseidon Blue','2026-01-23 17:59:51','2026-01-23 17:59:51'),(204,28,'16GB','1TB SSD','Nightfall Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(205,28,'16GB','2TB SSD','Nightfall Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(206,29,'16GB','512GB SSD','Nightfall Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(207,29,'16GB','1TB SSD','Nightfall Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(208,29,'32GB','2TB SSD','Nightfall Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(209,30,'8GB','256GB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(210,30,'16GB','512GB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(211,30,'16GB','1TB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(212,31,'8GB','256GB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(213,31,'16GB','512GB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(214,31,'16GB','1TB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(215,31,'32GB','2TB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(216,32,'16GB','512GB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(217,32,'32GB','1TB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(218,32,'32GB','2TB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(219,33,'8GB','256GB SSD','Platinum Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(220,33,'8GB','512GB SSD','Platinum Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(221,33,'16GB','512GB SSD','Platinum Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(222,33,'16GB','1TB SSD','Platinum Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(223,34,'16GB','512GB SSD','Storm Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(224,34,'16GB','512GB SSD','Oatmeal','2026-01-23 17:59:51','2026-01-23 17:59:51'),(225,34,'16GB','1TB SSD','Storm Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(226,34,'32GB','1TB SSD','Storm Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(227,35,'16GB','512GB SSD','Storm Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(228,35,'16GB','1TB SSD','Storm Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(229,35,'32GB','1TB SSD','Storm Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(230,36,'8GB','256GB SSD','Pine Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(231,36,'8GB','512GB SSD','Pine Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(232,36,'16GB','512GB SSD','Pine Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(233,36,'16GB','1TB SSD','Pine Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(234,37,'4GB','128GB SSD','Slate Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(235,37,'8GB','256GB SSD','Slate Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(236,37,'8GB','512GB SSD','Slate Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(237,37,'16GB','512GB SSD','Slate Gray','2026-01-23 17:59:51','2026-01-23 17:59:51'),(238,38,'16GB','512GB SSD','Moonlight White','2026-01-23 17:59:51','2026-01-23 17:59:51'),(239,38,'16GB','1TB SSD','Moonlight White','2026-01-23 17:59:51','2026-01-23 17:59:51'),(240,38,'32GB','1TB SSD','Moonlight White','2026-01-23 17:59:51','2026-01-23 17:59:51'),(241,39,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(242,39,'8GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(243,39,'16GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(244,39,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(245,40,'8GB','256GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(246,40,'8GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(247,40,'16GB','512GB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(248,40,'16GB','1TB SSD','Silver','2026-01-23 17:59:51','2026-01-23 17:59:51'),(249,41,'16GB','512GB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(250,41,'16GB','1TB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51'),(251,41,'32GB','1TB SSD','Black','2026-01-23 17:59:51','2026-01-23 17:59:51');
/*!40000 ALTER TABLE `laptop_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_09_19_000000_create_warranties_table',1),(5,'2025_09_19_122249_add_store_name_to_warranties_table',1),(6,'2025_09_27_071057_create_sales_orders_table',1),(7,'2025_09_27_080000_create_sales_table',1),(8,'2025_09_27_120000_add_product_name_to_sales_table',1),(9,'2025_09_27_130000_add_warranty_id_to_sales_table',1),(10,'2025_09_28_150000_alter_sales_make_salesman_nullable',1),(11,'2025_09_28_160000_add_cost_and_ganji_to_sales_table',1),(12,'2025_10_04_080000_add_warranty_fields_to_sales_table',1),(13,'2025_10_06_055947_drop_foreign_key_sales_salesman_id',1),(14,'2025_10_06_065442_add_category_fields_to_sales_table',1),(15,'2025_10_07_000000_create_shops_table',1),(16,'2025_10_07_072159_create_targets_table',1),(17,'2025_10_07_075709_modify_targets_table',1),(18,'2025_10_07_082048_add_role_and_shop_id_to_users_table',1),(19,'2025_10_07_083013_create_personal_access_tokens_table',1),(20,'2025_10_07_113549_add_phone_to_users_table',1),(21,'2025_10_22_211409_add_service_fields_to_sales_table',1),(22,'2025_10_22_213553_create_services_table',1),(23,'2025_10_22_214401_modify_services_table_remove_status_add_service_date',1),(24,'2025_10_26_000000_add_offers_to_sales_and_services_tables',1),(25,'2025_10_27_191559_normalize_product_names_to_lowercase',1),(26,'2025_11_07_000000_enhance_shops_table',1),(27,'2025_11_07_000001_create_products_table',1),(28,'2025_11_07_000002_create_activity_logs_table',1),(29,'2025_11_07_120000_create_password_reset_tokens_table',1),(30,'2025_11_07_130000_add_status_to_users_table',1),(31,'2025_11_09_092239_create_categories_table',1),(32,'2025_11_09_111748_add_category_specific_fields_to_products_and_seed_categories',1),(33,'2025_11_15_000001_update_sales_category_enum_to_include_laptops',2),(34,'2025_11_16_000000_create_expenditures_table',3),(35,'2025_01_05_add_invitation_token_to_users',4),(36,'2025_01_20_000000_add_serial_number_to_sales_table',4),(37,'2026_01_23_000001_create_phone_models_table',5),(38,'2026_01_23_000002_create_laptop_models_table',5),(39,'2026_01_23_000003_update_products_table_for_devices',5),(40,'2026_05_18_152800_add_logo_path_to_shops_table',6);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'api-token','d1d754b5c746faf0d1e043572718ae564f96fc29b56a87f80a21e9f3b9713841','[\"*\"]','2025-11-14 18:55:15',NULL,'2025-11-14 18:55:15','2025-11-14 18:55:15'),(2,'App\\Models\\User',10,'api-token','6c0892dbd712f650e210142309bba6024b574db24d344571c03bcd4390ed7b67','[\"*\"]','2025-11-14 22:19:40',NULL,'2025-11-14 18:56:07','2025-11-14 22:19:40'),(3,'App\\Models\\User',11,'api-token','3f5d7a5501c7015b20cfee394a614efbf3d3973305809b6dbd2e9aaf01486d87','[\"*\"]','2025-11-14 22:26:43',NULL,'2025-11-14 22:20:14','2025-11-14 22:26:43'),(4,'App\\Models\\User',10,'api-token','eb7b5a98ea2ea60de76662de16a7a4a9b5bf3579411102d0f0ff18af579436cb','[\"*\"]','2025-11-15 00:16:04',NULL,'2025-11-14 23:05:48','2025-11-15 00:16:04'),(6,'App\\Models\\User',11,'api-token','d4ccb4f0095b4b83027b392518161a343088dc97a6edc43cb594b9da340e4422','[\"*\"]','2025-11-15 00:26:25',NULL,'2025-11-15 00:26:24','2025-11-15 00:26:25'),(7,'App\\Models\\User',1,'api-token','d5c70feaa2797b32457f364ba0583edc01970b105f0c73f032451c6993c1b30d','[\"*\"]','2025-11-15 11:37:22',NULL,'2025-11-15 11:37:22','2025-11-15 11:37:22'),(8,'App\\Models\\User',1,'api-token','0b09fc5ad2fb7e9e37aab7381efd203b7627aeb3164d27c0cf8598e148f214d9','[\"*\"]','2025-11-16 07:56:39',NULL,'2025-11-16 07:54:59','2025-11-16 07:56:39'),(9,'App\\Models\\User',9,'api-token','6262149b5ad85c443911caee2dd46c27cbe076d81f17a3360c6f6246e0d27388','[\"*\"]','2025-11-16 07:57:18',NULL,'2025-11-16 07:57:07','2025-11-16 07:57:18'),(11,'App\\Models\\User',1,'api-token','99e8be27894763ccd24c2c186862ed059c389f078c0ede5b1d29de262ed8127a','[\"*\"]','2025-11-16 08:50:15',NULL,'2025-11-16 08:50:15','2025-11-16 08:50:15'),(12,'App\\Models\\User',4,'api-token','161ee13ef631ba04eea142668a5e1948d9e108bade651aa8eeeb741c599875e2','[\"*\"]','2025-11-16 08:52:52',NULL,'2025-11-16 08:51:03','2025-11-16 08:52:52'),(13,'App\\Models\\User',4,'api-token','f029489cbb692079486d5fc5061a9f9e20ec5d0655cf3b7d60bf8fcab7faa9c9','[\"*\"]','2025-11-16 08:52:44',NULL,'2025-11-16 08:52:28','2025-11-16 08:52:44'),(14,'App\\Models\\User',1,'api-token','c67d3f187b5bf2d37315a345789a2ac8a22a7db31cee93b2e7d2fed708b3a021','[\"*\"]','2025-11-17 13:38:55',NULL,'2025-11-17 13:38:48','2025-11-17 13:38:55'),(15,'App\\Models\\User',1,'api-token','2248be2fafc7611ed400c0708af4dcefb57a86e1ca3504944a123fe4bc77744a','[\"*\"]','2025-11-17 13:39:50',NULL,'2025-11-17 13:39:50','2025-11-17 13:39:50'),(16,'App\\Models\\User',11,'api-token','8d25e00614eb3a81840262ea460fe286ba88203073be6605f2110be32bacce16','[\"*\"]','2025-11-17 16:42:40',NULL,'2025-11-17 13:40:33','2025-11-17 16:42:40'),(17,'App\\Models\\User',1,'api-token','4a873e939a6330ea3777b3a7945f017453ff1bbd2dbf170631c885535e8d628f','[\"*\"]','2025-11-22 02:06:06',NULL,'2025-11-22 02:04:56','2025-11-22 02:06:06'),(18,'App\\Models\\User',11,'api-token','61c7a40864355843b6790fd22b25ebd68f5971e26ac570d2fb8cbb27c155ef7d','[\"*\"]','2025-11-22 02:07:15',NULL,'2025-11-22 02:06:41','2025-11-22 02:07:15'),(19,'App\\Models\\User',1,'api-token','609b83f53f53c3acc6f56f39b8e0eadd96a09e19878ddfbb46bc054b954a22d2','[\"*\"]','2025-11-29 02:03:09',NULL,'2025-11-29 01:57:50','2025-11-29 02:03:09'),(20,'App\\Models\\User',1,'api-token','f3858e905785499f105e6dba7ab05d3849f4a78c44e8d2a0209442f03ded47bc','[\"*\"]','2025-11-29 02:08:03',NULL,'2025-11-29 02:04:50','2025-11-29 02:08:03'),(21,'App\\Models\\User',1,'api-token','685620d6924f4c6d467c148c8fb69fda58dd2d917ba20b0d33d0e215a4accefc','[\"*\"]','2025-12-02 14:06:57',NULL,'2025-12-02 14:06:51','2025-12-02 14:06:57'),(22,'App\\Models\\User',1,'api-token','28bfa13ddd456e49b062f211d153205cc86b089096ff4fc8cc89ed5a7a4f7024','[\"*\"]','2025-12-02 14:07:18',NULL,'2025-12-02 14:07:08','2025-12-02 14:07:18'),(23,'App\\Models\\User',11,'api-token','527c8edd27165734268c4b7ec82935dcf5460412c20f58c5f621b86f50622a3b','[\"*\"]','2025-12-02 17:04:04',NULL,'2025-12-02 14:07:49','2025-12-02 17:04:04'),(24,'App\\Models\\User',1,'api-token','5d5a6a922c43500737da42d7289e9aac0dc744f9443f5259ff7837ac1fb06cea','[\"*\"]','2026-01-03 07:15:14',NULL,'2026-01-03 07:15:01','2026-01-03 07:15:14'),(25,'App\\Models\\User',1,'api-token','a4a4b64ae983d8739d938cfb8d85e42c7e18818a838e37992ad36e89015266e6','[\"*\"]','2026-01-03 07:17:32',NULL,'2026-01-03 07:17:08','2026-01-03 07:17:32'),(26,'App\\Models\\User',1,'api-token','6017308f36f621e607284e1ab455e7813cdb2593dd44ebaeabf45198083bb502','[\"*\"]','2026-01-03 07:18:20',NULL,'2026-01-03 07:18:03','2026-01-03 07:18:20'),(27,'App\\Models\\User',11,'api-token','903ccead900163223f251f363776b46c561c58d24109534cf584da9bfc0a5edc','[\"*\"]','2026-01-03 07:30:45',NULL,'2026-01-03 07:19:15','2026-01-03 07:30:45'),(28,'App\\Models\\User',1,'api-token','c25ae57c20292592211380354a3139bfa723dd9f90302c2ee137aba53e8b63c8','[\"*\"]','2026-01-03 07:31:23',NULL,'2026-01-03 07:31:11','2026-01-03 07:31:23'),(29,'App\\Models\\User',2,'api-token','e06e3a2609492062d9a5a2b786717721537236037f7002196e253e583b0f1e37','[\"*\"]','2026-01-05 12:59:39',NULL,'2026-01-03 07:31:59','2026-01-05 12:59:39'),(30,'App\\Models\\User',2,'api-token','980a729ac2bd5d46ff6a7c3b41e82013a7ad3a4c3f40bb41ed9a768a2491e5f6','[\"*\"]','2026-01-05 08:28:39',NULL,'2026-01-04 05:43:23','2026-01-05 08:28:39'),(31,'App\\Models\\User',12,'api-token','cee95618cb4160ad610616b648f1c666ad412a08354b806ebf22d601e92cce66','[\"*\"]','2026-01-05 12:59:33',NULL,'2026-01-05 08:36:36','2026-01-05 12:59:33'),(32,'App\\Models\\User',1,'api-token','98c927df79a94563c82fd97fa2819cf73713d99a6251b9237825e2286d39086c','[\"*\"]','2026-01-05 14:42:44',NULL,'2026-01-05 14:42:40','2026-01-05 14:42:44'),(33,'App\\Models\\User',12,'api-token','a50c57c2580c018d97c1bb9930309f639cd9c830745258920ac1a6db33db6b34','[\"*\"]','2026-01-05 16:15:41',NULL,'2026-01-05 14:43:11','2026-01-05 16:15:41'),(34,'App\\Models\\User',12,'api-token','a695362c6c114a6b497deea99cbd085bc201e4ffe60690bebcbcc759751c9822','[\"*\"]','2026-01-05 16:20:24',NULL,'2026-01-05 16:15:48','2026-01-05 16:20:24'),(35,'App\\Models\\User',12,'api-token','b07b260b63000efa33dee029e04d45caa833b963e47d834731ec844705123d3c','[\"*\"]','2026-01-05 16:20:33',NULL,'2026-01-05 16:20:33','2026-01-05 16:20:33'),(36,'App\\Models\\User',12,'api-token','b8b9b17ad37247581f2661db8d3e30a9a6515deec9a50cbc556c98b9b2a745e1','[\"*\"]','2026-01-05 16:25:13',NULL,'2026-01-05 16:21:30','2026-01-05 16:25:13'),(37,'App\\Models\\User',1,'api-token','07b8a126aabdb1b25ed2d177e44ef9ee8a8e49173722125cc6f4ce178185067a','[\"*\"]','2026-01-06 09:33:45',NULL,'2026-01-06 09:33:22','2026-01-06 09:33:45'),(38,'App\\Models\\User',1,'api-token','2623addb0daff45325a63496e6c09292be091316ddedc28a4b469f1c3b8de35a','[\"*\"]','2026-01-06 09:34:03',NULL,'2026-01-06 09:33:52','2026-01-06 09:34:03'),(39,'App\\Models\\User',12,'api-token','b110d02792b7dd10e5fcd822e71e157d46cb518754f7ccd7e91c8e1ba920356a','[\"*\"]','2026-01-06 10:22:21',NULL,'2026-01-06 09:34:36','2026-01-06 10:22:21'),(40,'App\\Models\\User',12,'test-token','3038c2707f539c98893617c83367e538b70725c5ef74ef7e2652a04df3fb0f3a','[\"*\"]','2026-01-06 10:24:13',NULL,'2026-01-06 10:03:52','2026-01-06 10:24:13'),(41,'App\\Models\\User',12,'api-token','d6dbc0e3b0c091de6c6a939e4502ee4dd96ced4238b1c6d1187dc2ddae77368d','[\"*\"]','2026-01-06 10:45:45',NULL,'2026-01-06 10:24:41','2026-01-06 10:45:45'),(42,'App\\Models\\User',1,'api-token','5133f9e682e6ca7c53347ae38c66c7135e8a69e4a3b6f6c1cbcd3b3a131c8561','[\"*\"]','2026-01-06 10:46:36',NULL,'2026-01-06 10:45:55','2026-01-06 10:46:36'),(43,'App\\Models\\User',12,'api-token','db573a8de99bcfda4c85408dcbdf3f7e58c0520a776cfc69d31ade0f8d2f8589','[\"*\"]','2026-01-06 12:11:37',NULL,'2026-01-06 10:47:03','2026-01-06 12:11:37'),(44,'App\\Models\\User',1,'api-token','980a5cba7a456415b6746aa1e5470f26c65d10ae53aa0500e1b845e1a405a6d2','[\"*\"]','2026-01-20 16:12:06',NULL,'2026-01-20 16:11:20','2026-01-20 16:12:06'),(45,'App\\Models\\User',1,'api-token','4cec3f0f8ec89ded10415fe5d59aa9c08e4c7ee2a5bc555b99b807b5021c6b81','[\"*\"]','2026-01-20 16:13:18',NULL,'2026-01-20 16:12:40','2026-01-20 16:13:18'),(46,'App\\Models\\User',17,'api-token','204294b5075a16f01c87ff6f25a751402df4e9a65e89af7c7a0988ad56195fb2','[\"*\"]','2026-01-20 16:13:34',NULL,'2026-01-20 16:13:30','2026-01-20 16:13:34'),(47,'App\\Models\\User',1,'api-token','13dbbe1c1f74d083c9e56817f08dd22d84879ed413bca4150ead756580ec6573','[\"*\"]','2026-01-20 16:15:27',NULL,'2026-01-20 16:15:03','2026-01-20 16:15:27'),(48,'App\\Models\\User',12,'api-token','cbbdb446a9d31ae680502735cd04008cf59b68b8f162bcafab9d55f25ea148d8','[\"*\"]','2026-01-20 16:37:02',NULL,'2026-01-20 16:19:29','2026-01-20 16:37:02'),(49,'App\\Models\\User',1,'api-token','c507781a26f10e5f941c4f46d6f3fcb07cb9a195d82c2a47566d67860e418af7','[\"*\"]','2026-01-23 17:00:01',NULL,'2026-01-23 17:00:01','2026-01-23 17:00:01'),(50,'App\\Models\\User',12,'api-token','d01ca7fc8aba16eec436f15fb7dd9618dfe420c6456527f9fd52c5f3147558ed','[\"*\"]','2026-01-23 17:15:07',NULL,'2026-01-23 17:00:32','2026-01-23 17:15:07'),(51,'App\\Models\\User',5,'api-token','ec18ffefbf7b127119aea72e3f7b479c48d9b3579fdbfdb6473cb60d0d0b9cc8','[\"*\"]','2026-04-12 11:40:01',NULL,'2026-04-12 11:39:49','2026-04-12 11:40:01'),(52,'App\\Models\\User',5,'api-token','98dc8bab1bd875e4748407f7573f27185ffbe43586482c350f5a2d58b5f9b177','[\"*\"]','2026-04-12 11:44:39',NULL,'2026-04-12 11:44:39','2026-04-12 11:44:39'),(53,'App\\Models\\User',5,'api-token','c96b27dfeb14791582fc4000399d5123c12f252d1999494127925bae59744879','[\"*\"]','2026-04-12 11:51:35',NULL,'2026-04-12 11:48:21','2026-04-12 11:51:35'),(54,'App\\Models\\User',5,'api-token','37c45df561f1e69ba076afcc9310fb089902c62351d05a7847238ad384e2be57','[\"*\"]','2026-04-12 11:53:40',NULL,'2026-04-12 11:53:40','2026-04-12 11:53:40'),(55,'App\\Models\\User',5,'api-token','5803b9248a16f8826fd151c4a7c0c7a2c3b83a347f1be8ede4dfbba0f6471da9','[\"*\"]','2026-04-12 11:54:36',NULL,'2026-04-12 11:54:35','2026-04-12 11:54:36'),(56,'App\\Models\\User',5,'api-token','6ebdbbbb5489db0179096c4ccdb3ac09dc573479e651c8dd349b9d299afd7e44','[\"*\"]','2026-04-12 12:03:27',NULL,'2026-04-12 12:03:27','2026-04-12 12:03:27');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phone_colors`
--

DROP TABLE IF EXISTS `phone_colors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phone_colors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `phone_variant_id` bigint unsigned NOT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_colors_phone_variant_id_color_unique` (`phone_variant_id`,`color`),
  KEY `phone_colors_phone_variant_id_index` (`phone_variant_id`),
  CONSTRAINT `phone_colors_phone_variant_id_foreign` FOREIGN KEY (`phone_variant_id`) REFERENCES `phone_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=776 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone_colors`
--

LOCK TABLES `phone_colors` WRITE;
/*!40000 ALTER TABLE `phone_colors` DISABLE KEYS */;
INSERT INTO `phone_colors` VALUES (1,1,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(2,1,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(3,2,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(4,2,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(5,3,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(6,3,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(7,3,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(8,4,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(9,4,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(10,4,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(11,5,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(12,5,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(13,5,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(14,6,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(15,6,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(16,6,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(17,7,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(18,7,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(19,7,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(20,8,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(21,8,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(22,8,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(23,9,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(24,9,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(25,9,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(26,9,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(27,9,'Coral','2026-01-23 17:55:59','2026-01-23 17:55:59'),(28,9,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(29,10,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(30,10,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(31,10,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(32,10,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(33,10,'Coral','2026-01-23 17:55:59','2026-01-23 17:55:59'),(34,10,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(35,11,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(36,11,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(37,11,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(38,11,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(39,11,'Coral','2026-01-23 17:55:59','2026-01-23 17:55:59'),(40,11,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(41,12,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(42,12,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(43,12,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(44,12,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(45,12,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(46,12,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(47,13,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(48,13,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(49,13,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(50,13,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(51,13,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(52,13,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(53,14,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(54,14,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(55,14,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(56,14,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(57,14,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(58,14,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(59,15,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(60,15,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(61,15,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(62,15,'Midnight Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(63,16,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(64,16,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(65,16,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(66,16,'Midnight Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(67,17,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(68,17,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(69,17,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(70,17,'Midnight Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(71,18,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(72,18,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(73,18,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(74,18,'Midnight Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(75,19,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(76,19,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(77,19,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(78,19,'Midnight Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(79,20,'Space Gray','2026-01-23 17:55:59','2026-01-23 17:55:59'),(80,20,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(81,20,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(82,20,'Midnight Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(83,21,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(84,21,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(85,21,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(86,21,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(87,21,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(88,21,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(89,22,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(90,22,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(91,22,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(92,22,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(93,22,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(94,22,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(95,23,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(96,23,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(97,23,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(98,23,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(99,23,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(100,23,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(101,24,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(102,24,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(103,24,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(104,24,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(105,24,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(106,24,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(107,25,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(108,25,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(109,25,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(110,25,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(111,25,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(112,25,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(113,26,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(114,26,'White','2026-01-23 17:55:59','2026-01-23 17:55:59'),(115,26,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(116,26,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(117,26,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(118,26,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(119,27,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(120,27,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(121,27,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(122,27,'Pacific Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(123,28,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(124,28,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(125,28,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(126,28,'Pacific Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(127,29,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(128,29,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(129,29,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(130,29,'Pacific Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(131,30,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(132,30,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(133,30,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(134,30,'Pacific Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(135,31,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(136,31,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(137,31,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(138,31,'Pacific Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(139,32,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(140,32,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(141,32,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(142,32,'Pacific Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(143,33,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(144,33,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(145,33,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(146,33,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(147,33,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(148,33,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(149,34,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(150,34,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(151,34,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(152,34,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(153,34,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(154,34,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(155,35,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(156,35,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(157,35,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(158,35,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(159,35,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(160,35,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(161,36,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(162,36,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(163,36,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(164,36,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(165,36,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(166,36,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(167,37,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(168,37,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(169,37,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(170,37,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(171,37,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(172,37,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(173,38,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(174,38,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(175,38,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(176,38,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(177,38,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(178,38,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(179,39,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(180,39,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(181,39,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(182,39,'Sierra Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(183,39,'Alpine Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(184,40,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(185,40,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(186,40,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(187,40,'Sierra Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(188,40,'Alpine Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(189,41,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(190,41,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(191,41,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(192,41,'Sierra Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(193,41,'Alpine Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(194,42,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(195,42,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(196,42,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(197,42,'Sierra Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(198,42,'Alpine Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(199,43,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(200,43,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(201,43,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(202,43,'Sierra Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(203,43,'Alpine Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(204,44,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(205,44,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(206,44,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(207,44,'Sierra Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(208,44,'Alpine Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(209,45,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(210,45,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(211,45,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(212,45,'Sierra Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(213,45,'Alpine Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(214,46,'Graphite','2026-01-23 17:55:59','2026-01-23 17:55:59'),(215,46,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(216,46,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(217,46,'Sierra Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(218,46,'Alpine Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(219,47,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(220,47,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(221,47,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(222,47,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(223,47,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(224,47,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(225,48,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(226,48,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(227,48,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(228,48,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(229,48,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(230,48,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(231,49,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(232,49,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(233,49,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(234,49,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(235,49,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(236,49,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(237,50,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(238,50,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(239,50,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(240,50,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(241,50,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(242,50,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(243,51,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(244,51,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(245,51,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(246,51,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(247,51,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(248,51,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(249,52,'Midnight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(250,52,'Starlight','2026-01-23 17:55:59','2026-01-23 17:55:59'),(251,52,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(252,52,'Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(253,52,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(254,52,'(PRODUCT)RED','2026-01-23 17:55:59','2026-01-23 17:55:59'),(255,53,'Space Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(256,53,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(257,53,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(258,53,'Deep Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(259,54,'Space Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(260,54,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(261,54,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(262,54,'Deep Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(263,55,'Space Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(264,55,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(265,55,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(266,55,'Deep Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(267,56,'Space Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(268,56,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(269,56,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(270,56,'Deep Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(271,57,'Space Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(272,57,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(273,57,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(274,57,'Deep Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(275,58,'Space Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(276,58,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(277,58,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(278,58,'Deep Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(279,59,'Space Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(280,59,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(281,59,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(282,59,'Deep Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(283,60,'Space Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(284,60,'Silver','2026-01-23 17:55:59','2026-01-23 17:55:59'),(285,60,'Gold','2026-01-23 17:55:59','2026-01-23 17:55:59'),(286,60,'Deep Purple','2026-01-23 17:55:59','2026-01-23 17:55:59'),(287,61,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(288,61,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(289,61,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(290,61,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(291,61,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(292,62,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(293,62,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(294,62,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(295,62,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(296,62,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(297,63,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(298,63,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(299,63,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(300,63,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(301,63,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(302,64,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(303,64,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(304,64,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(305,64,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(306,64,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(307,65,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(308,65,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(309,65,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(310,65,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(311,65,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(312,66,'Black','2026-01-23 17:55:59','2026-01-23 17:55:59'),(313,66,'Blue','2026-01-23 17:55:59','2026-01-23 17:55:59'),(314,66,'Green','2026-01-23 17:55:59','2026-01-23 17:55:59'),(315,66,'Yellow','2026-01-23 17:55:59','2026-01-23 17:55:59'),(316,66,'Pink','2026-01-23 17:55:59','2026-01-23 17:55:59'),(317,67,'Natural Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(318,67,'Blue Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(319,67,'White Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(320,67,'Black Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(321,68,'Natural Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(322,68,'Blue Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(323,68,'White Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(324,68,'Black Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(325,69,'Natural Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(326,69,'Blue Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(327,69,'White Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(328,69,'Black Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(329,70,'Natural Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(330,70,'Blue Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(331,70,'White Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(332,70,'Black Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(333,71,'Natural Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(334,71,'Blue Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(335,71,'White Titanium','2026-01-23 17:55:59','2026-01-23 17:55:59'),(336,71,'Black Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(337,72,'Natural Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(338,72,'Blue Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(339,72,'White Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(340,72,'Black Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(341,73,'Natural Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(342,73,'Blue Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(343,73,'White Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(344,73,'Black Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(345,74,'Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(346,74,'White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(347,74,'Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(348,74,'Teal','2026-01-23 17:56:00','2026-01-23 17:56:00'),(349,74,'Ultramarine','2026-01-23 17:56:00','2026-01-23 17:56:00'),(350,75,'Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(351,75,'White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(352,75,'Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(353,75,'Teal','2026-01-23 17:56:00','2026-01-23 17:56:00'),(354,75,'Ultramarine','2026-01-23 17:56:00','2026-01-23 17:56:00'),(355,76,'Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(356,76,'White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(357,76,'Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(358,76,'Teal','2026-01-23 17:56:00','2026-01-23 17:56:00'),(359,76,'Ultramarine','2026-01-23 17:56:00','2026-01-23 17:56:00'),(360,77,'Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(361,77,'White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(362,77,'Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(363,77,'Teal','2026-01-23 17:56:00','2026-01-23 17:56:00'),(364,77,'Ultramarine','2026-01-23 17:56:00','2026-01-23 17:56:00'),(365,78,'Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(366,78,'White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(367,78,'Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(368,78,'Teal','2026-01-23 17:56:00','2026-01-23 17:56:00'),(369,78,'Ultramarine','2026-01-23 17:56:00','2026-01-23 17:56:00'),(370,79,'Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(371,79,'White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(372,79,'Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(373,79,'Teal','2026-01-23 17:56:00','2026-01-23 17:56:00'),(374,79,'Ultramarine','2026-01-23 17:56:00','2026-01-23 17:56:00'),(375,80,'Desert Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(376,80,'Natural Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(377,80,'White Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(378,80,'Black Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(379,81,'Desert Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(380,81,'Natural Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(381,81,'White Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(382,81,'Black Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(383,82,'Desert Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(384,82,'Natural Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(385,82,'White Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(386,82,'Black Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(387,83,'Desert Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(388,83,'Natural Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(389,83,'White Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(390,83,'Black Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(391,84,'Desert Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(392,84,'Natural Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(393,84,'White Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(394,84,'Black Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(395,85,'Desert Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(396,85,'Natural Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(397,85,'White Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(398,85,'Black Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(399,86,'Desert Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(400,86,'Natural Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(401,86,'White Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(402,86,'Black Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(403,87,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(404,87,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(405,87,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(406,88,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(407,88,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(408,88,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(409,89,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(410,89,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(411,89,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(412,90,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(413,90,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(414,90,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(415,91,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(416,91,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(417,91,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(418,92,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(419,92,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(420,92,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(421,93,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(422,93,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(423,93,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(424,94,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(425,94,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(426,94,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(427,95,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(428,95,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(429,95,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(430,96,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(431,96,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(432,96,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(433,97,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(434,97,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(435,97,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(436,98,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(437,98,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(438,98,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(439,99,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(440,99,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(441,99,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(442,100,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(443,100,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(444,100,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(445,101,'Cosmic Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(446,101,'Deep Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(447,101,'Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(448,102,'Cosmic Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(449,102,'Cosmic Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(450,102,'Cloud Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(451,102,'Cloud Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(452,103,'Cosmic Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(453,103,'Cosmic Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(454,103,'Cloud Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(455,103,'Cloud Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(456,104,'Cosmic Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(457,104,'Cosmic Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(458,105,'Cosmic Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(459,105,'Cosmic Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(460,106,'Cosmic Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(461,106,'Cosmic Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(462,107,'Phantom Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(463,107,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(464,107,'Phantom Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(465,107,'Phantom Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(466,108,'Phantom Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(467,108,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(468,108,'Phantom Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(469,108,'Phantom Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(470,109,'Phantom Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(471,109,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(472,109,'Phantom Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(473,109,'Phantom Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(474,110,'Phantom Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(475,110,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(476,110,'Phantom Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(477,110,'Phantom Pink','2026-01-23 17:56:00','2026-01-23 17:56:00'),(478,111,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(479,111,'Phantom Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(480,111,'Phantom Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(481,111,'Phantom Navy','2026-01-23 17:56:00','2026-01-23 17:56:00'),(482,111,'Phantom Brown','2026-01-23 17:56:00','2026-01-23 17:56:00'),(483,112,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(484,112,'Phantom Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(485,112,'Phantom Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(486,112,'Phantom Navy','2026-01-23 17:56:00','2026-01-23 17:56:00'),(487,112,'Phantom Brown','2026-01-23 17:56:00','2026-01-23 17:56:00'),(488,113,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(489,113,'Phantom Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(490,113,'Phantom Titanium','2026-01-23 17:56:00','2026-01-23 17:56:00'),(491,113,'Phantom Navy','2026-01-23 17:56:00','2026-01-23 17:56:00'),(492,113,'Phantom Brown','2026-01-23 17:56:00','2026-01-23 17:56:00'),(493,114,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(494,114,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(495,114,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(496,114,'Pink Gold','2026-01-23 17:56:00','2026-01-23 17:56:00'),(497,114,'Bora Purple','2026-01-23 17:56:00','2026-01-23 17:56:00'),(498,115,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(499,115,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(500,115,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(501,115,'Pink Gold','2026-01-23 17:56:00','2026-01-23 17:56:00'),(502,115,'Bora Purple','2026-01-23 17:56:00','2026-01-23 17:56:00'),(503,116,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(504,116,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(505,116,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(506,116,'Pink Gold','2026-01-23 17:56:00','2026-01-23 17:56:00'),(507,116,'Bora Purple','2026-01-23 17:56:00','2026-01-23 17:56:00'),(508,117,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(509,117,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(510,117,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(511,117,'Pink Gold','2026-01-23 17:56:00','2026-01-23 17:56:00'),(512,117,'Bora Purple','2026-01-23 17:56:00','2026-01-23 17:56:00'),(513,118,'Burgundy','2026-01-23 17:56:00','2026-01-23 17:56:00'),(514,118,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(515,118,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(516,118,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(517,119,'Burgundy','2026-01-23 17:56:00','2026-01-23 17:56:00'),(518,119,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(519,119,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(520,119,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(521,120,'Burgundy','2026-01-23 17:56:00','2026-01-23 17:56:00'),(522,120,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(523,120,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(524,120,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(525,121,'Burgundy','2026-01-23 17:56:00','2026-01-23 17:56:00'),(526,121,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(527,121,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(528,121,'Phantom White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(529,122,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(530,122,'Cream','2026-01-23 17:56:00','2026-01-23 17:56:00'),(531,122,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(532,122,'Lavender','2026-01-23 17:56:00','2026-01-23 17:56:00'),(533,123,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(534,123,'Cream','2026-01-23 17:56:00','2026-01-23 17:56:00'),(535,123,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(536,123,'Lavender','2026-01-23 17:56:00','2026-01-23 17:56:00'),(537,124,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(538,124,'Cream','2026-01-23 17:56:00','2026-01-23 17:56:00'),(539,124,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(540,124,'Lavender','2026-01-23 17:56:00','2026-01-23 17:56:00'),(541,125,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(542,125,'Cream','2026-01-23 17:56:00','2026-01-23 17:56:00'),(543,125,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(544,125,'Lavender','2026-01-23 17:56:00','2026-01-23 17:56:00'),(545,126,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(546,126,'Cream','2026-01-23 17:56:00','2026-01-23 17:56:00'),(547,126,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(548,126,'Lavender','2026-01-23 17:56:00','2026-01-23 17:56:00'),(549,127,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(550,127,'Cream','2026-01-23 17:56:00','2026-01-23 17:56:00'),(551,127,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(552,127,'Lavender','2026-01-23 17:56:00','2026-01-23 17:56:00'),(553,127,'Lime','2026-01-23 17:56:00','2026-01-23 17:56:00'),(554,127,'Sky Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(555,128,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(556,128,'Cream','2026-01-23 17:56:00','2026-01-23 17:56:00'),(557,128,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(558,128,'Lavender','2026-01-23 17:56:00','2026-01-23 17:56:00'),(559,128,'Lime','2026-01-23 17:56:00','2026-01-23 17:56:00'),(560,128,'Sky Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(561,129,'Phantom Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(562,129,'Cream','2026-01-23 17:56:00','2026-01-23 17:56:00'),(563,129,'Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(564,129,'Lavender','2026-01-23 17:56:00','2026-01-23 17:56:00'),(565,129,'Lime','2026-01-23 17:56:00','2026-01-23 17:56:00'),(566,129,'Sky Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(567,130,'Onyx Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(568,130,'Marble Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(569,130,'Cobalt Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(570,130,'Amber Yellow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(571,131,'Onyx Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(572,131,'Marble Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(573,131,'Cobalt Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(574,131,'Amber Yellow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(575,132,'Onyx Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(576,132,'Marble Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(577,132,'Cobalt Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(578,132,'Amber Yellow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(579,133,'Onyx Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(580,133,'Marble Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(581,133,'Cobalt Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(582,133,'Amber Yellow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(583,134,'Onyx Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(584,134,'Marble Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(585,134,'Cobalt Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(586,134,'Amber Yellow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(587,135,'Titanium Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(588,135,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(589,135,'Titanium Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(590,135,'Titanium Yellow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(591,135,'Titanium Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(592,135,'Titanium Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(593,136,'Titanium Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(594,136,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(595,136,'Titanium Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(596,136,'Titanium Yellow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(597,136,'Titanium Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(598,136,'Titanium Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(599,137,'Titanium Gray','2026-01-23 17:56:00','2026-01-23 17:56:00'),(600,137,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(601,137,'Titanium Violet','2026-01-23 17:56:00','2026-01-23 17:56:00'),(602,137,'Titanium Yellow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(603,137,'Titanium Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(604,137,'Titanium Green','2026-01-23 17:56:00','2026-01-23 17:56:00'),(605,138,'Titanium Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(606,138,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(607,138,'Sparkling Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(608,139,'Titanium Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(609,139,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(610,139,'Sparkling Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(611,140,'Titanium Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(612,140,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(613,140,'Sparkling Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(614,141,'Titanium Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(615,141,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(616,141,'Sparkling Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(617,142,'Titanium Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(618,142,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(619,142,'Sparkling Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(620,143,'Titanium Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(621,143,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(622,143,'Sparkling Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(623,144,'Titanium Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(624,144,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(625,144,'Sparkling Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(626,145,'Titanium Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(627,145,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(628,145,'Sparkling Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(629,146,'Titanium Silver','2026-01-23 17:56:00','2026-01-23 17:56:00'),(630,146,'Titanium Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(631,146,'Sparkling Blue','2026-01-23 17:56:00','2026-01-23 17:56:00'),(632,147,'Just Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(633,147,'Clearly White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(634,147,'Oh So Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(635,148,'Just Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(636,148,'Clearly White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(637,148,'Oh So Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(638,149,'Just Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(639,149,'Clearly White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(640,149,'Oh So Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(641,150,'Just Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(642,150,'Clearly White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(643,150,'Oh So Orange','2026-01-23 17:56:00','2026-01-23 17:56:00'),(644,151,'Just Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(645,151,'Sorta Sage','2026-01-23 17:56:00','2026-01-23 17:56:00'),(646,152,'Stormy Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(647,152,'Kinda Coral','2026-01-23 17:56:00','2026-01-23 17:56:00'),(648,152,'Sorta Seafoam','2026-01-23 17:56:00','2026-01-23 17:56:00'),(649,153,'Stormy Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(650,153,'Kinda Coral','2026-01-23 17:56:00','2026-01-23 17:56:00'),(651,153,'Sorta Seafoam','2026-01-23 17:56:00','2026-01-23 17:56:00'),(652,154,'Stormy Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(653,154,'Cloudy White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(654,154,'Sorta Sunny','2026-01-23 17:56:00','2026-01-23 17:56:00'),(655,155,'Stormy Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(656,155,'Cloudy White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(657,155,'Sorta Sunny','2026-01-23 17:56:00','2026-01-23 17:56:00'),(658,156,'Stormy Black','2026-01-23 17:56:00','2026-01-23 17:56:00'),(659,156,'Cloudy White','2026-01-23 17:56:00','2026-01-23 17:56:00'),(660,156,'Sorta Sunny','2026-01-23 17:56:00','2026-01-23 17:56:00'),(661,157,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(662,157,'Snow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(663,157,'Lemongrass','2026-01-23 17:56:00','2026-01-23 17:56:00'),(664,158,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(665,158,'Snow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(666,158,'Lemongrass','2026-01-23 17:56:00','2026-01-23 17:56:00'),(667,159,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(668,159,'Snow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(669,159,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(670,160,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(671,160,'Snow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(672,160,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(673,161,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(674,161,'Snow','2026-01-23 17:56:00','2026-01-23 17:56:00'),(675,161,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(676,162,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(677,162,'Rose','2026-01-23 17:56:00','2026-01-23 17:56:00'),(678,162,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(679,162,'Mint','2026-01-23 17:56:00','2026-01-23 17:56:00'),(680,163,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(681,163,'Rose','2026-01-23 17:56:00','2026-01-23 17:56:00'),(682,163,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(683,163,'Mint','2026-01-23 17:56:00','2026-01-23 17:56:00'),(684,164,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(685,164,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(686,164,'Bay','2026-01-23 17:56:00','2026-01-23 17:56:00'),(687,164,'Mint','2026-01-23 17:56:00','2026-01-23 17:56:00'),(688,165,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(689,165,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(690,165,'Bay','2026-01-23 17:56:00','2026-01-23 17:56:00'),(691,165,'Mint','2026-01-23 17:56:00','2026-01-23 17:56:00'),(692,166,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(693,166,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(694,166,'Bay','2026-01-23 17:56:00','2026-01-23 17:56:00'),(695,166,'Mint','2026-01-23 17:56:00','2026-01-23 17:56:00'),(696,167,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(697,167,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(698,167,'Bay','2026-01-23 17:56:00','2026-01-23 17:56:00'),(699,167,'Mint','2026-01-23 17:56:00','2026-01-23 17:56:00'),(700,168,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(701,168,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(702,168,'Wintergreen','2026-01-23 17:56:00','2026-01-23 17:56:00'),(703,168,'Peony','2026-01-23 17:56:00','2026-01-23 17:56:00'),(704,169,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(705,169,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(706,169,'Wintergreen','2026-01-23 17:56:00','2026-01-23 17:56:00'),(707,169,'Peony','2026-01-23 17:56:00','2026-01-23 17:56:00'),(708,170,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(709,170,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(710,170,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(711,170,'Rose Quartz','2026-01-23 17:56:00','2026-01-23 17:56:00'),(712,171,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(713,171,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(714,171,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(715,171,'Rose Quartz','2026-01-23 17:56:00','2026-01-23 17:56:00'),(716,172,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(717,172,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(718,172,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(719,172,'Rose Quartz','2026-01-23 17:56:00','2026-01-23 17:56:00'),(720,173,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(721,173,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(722,173,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(723,173,'Rose Quartz','2026-01-23 17:56:00','2026-01-23 17:56:00'),(724,174,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(725,174,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(726,174,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(727,174,'Rose Quartz','2026-01-23 17:56:00','2026-01-23 17:56:00'),(728,175,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(729,175,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(730,175,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(731,175,'Rose Quartz','2026-01-23 17:56:00','2026-01-23 17:56:00'),(732,176,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(733,176,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(734,176,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(735,176,'Rose Quartz','2026-01-23 17:56:00','2026-01-23 17:56:00'),(736,177,'Obsidian','2026-01-23 17:56:00','2026-01-23 17:56:00'),(737,177,'Porcelain','2026-01-23 17:56:00','2026-01-23 17:56:00'),(738,177,'Hazel','2026-01-23 17:56:00','2026-01-23 17:56:00'),(739,177,'Rose Quartz','2026-01-23 17:56:00','2026-01-23 17:56:00'),(740,178,'Moonstone','2026-01-23 17:56:00','2026-01-23 17:56:00'),(741,178,'Jade','2026-01-23 17:56:00','2026-01-23 17:56:00'),(742,178,'Indigo','2026-01-23 17:56:00','2026-01-23 17:56:00'),(743,178,'Frost','2026-01-23 17:56:00','2026-01-23 17:56:00'),(744,179,'Moonstone','2026-01-23 17:56:00','2026-01-23 17:56:00'),(745,179,'Jade','2026-01-23 17:56:00','2026-01-23 17:56:00'),(746,179,'Indigo','2026-01-23 17:56:00','2026-01-23 17:56:00'),(747,179,'Frost','2026-01-23 17:56:00','2026-01-23 17:56:00'),(748,180,'Moonstone','2026-01-23 17:56:00','2026-01-23 17:56:00'),(749,180,'Jade','2026-01-23 17:56:00','2026-01-23 17:56:00'),(750,180,'Indigo','2026-01-23 17:56:00','2026-01-23 17:56:00'),(751,180,'Frost','2026-01-23 17:56:00','2026-01-23 17:56:00'),(752,181,'Moonstone','2026-01-23 17:56:00','2026-01-23 17:56:00'),(753,181,'Jade','2026-01-23 17:56:00','2026-01-23 17:56:00'),(754,181,'Indigo','2026-01-23 17:56:00','2026-01-23 17:56:00'),(755,181,'Frost','2026-01-23 17:56:00','2026-01-23 17:56:00'),(756,182,'Moonstone','2026-01-23 17:56:00','2026-01-23 17:56:00'),(757,182,'Jade','2026-01-23 17:56:00','2026-01-23 17:56:00'),(758,182,'Indigo','2026-01-23 17:56:00','2026-01-23 17:56:00'),(759,182,'Frost','2026-01-23 17:56:00','2026-01-23 17:56:00'),(760,183,'Moonstone','2026-01-23 17:56:00','2026-01-23 17:56:00'),(761,183,'Jade','2026-01-23 17:56:00','2026-01-23 17:56:00'),(762,183,'Indigo','2026-01-23 17:56:00','2026-01-23 17:56:00'),(763,183,'Frost','2026-01-23 17:56:00','2026-01-23 17:56:00'),(764,184,'Moonstone','2026-01-23 17:56:00','2026-01-23 17:56:00'),(765,184,'Jade','2026-01-23 17:56:00','2026-01-23 17:56:00'),(766,184,'Indigo','2026-01-23 17:56:00','2026-01-23 17:56:00'),(767,184,'Frost','2026-01-23 17:56:00','2026-01-23 17:56:00'),(768,185,'Moonstone','2026-01-23 17:56:00','2026-01-23 17:56:00'),(769,185,'Jade','2026-01-23 17:56:00','2026-01-23 17:56:00'),(770,185,'Indigo','2026-01-23 17:56:00','2026-01-23 17:56:00'),(771,185,'Frost','2026-01-23 17:56:00','2026-01-23 17:56:00'),(772,186,'Moonstone','2026-01-23 17:56:00','2026-01-23 17:56:00'),(773,186,'Jade','2026-01-23 17:56:00','2026-01-23 17:56:00'),(774,186,'Indigo','2026-01-23 17:56:00','2026-01-23 17:56:00'),(775,186,'Frost','2026-01-23 17:56:00','2026-01-23 17:56:00');
/*!40000 ALTER TABLE `phone_colors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phone_models`
--

DROP TABLE IF EXISTS `phone_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phone_models` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `generation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `release_year` year DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `phone_models_brand_generation_index` (`brand`,`generation`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone_models`
--

LOCK TABLES `phone_models` WRITE;
/*!40000 ALTER TABLE `phone_models` DISABLE KEYS */;
INSERT INTO `phone_models` VALUES (1,'Apple','iPhone X','X','iPhone X',2017,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(2,'Apple','iPhone XS','XS','iPhone XS',2018,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(3,'Apple','iPhone XS','XS Max','iPhone XS Max',2018,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(4,'Apple','iPhone XR','XR','iPhone XR',2018,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(5,'Apple','iPhone 11','11','iPhone 11',2019,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(6,'Apple','iPhone 11','11 Pro','iPhone 11 Pro',2019,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(7,'Apple','iPhone 11','11 Pro Max','iPhone 11 Pro Max',2019,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(8,'Apple','iPhone 12','12','iPhone 12',2020,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(9,'Apple','iPhone 12','12 mini','iPhone 12 mini',2020,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(10,'Apple','iPhone 12','12 Pro','iPhone 12 Pro',2020,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(11,'Apple','iPhone 12','12 Pro Max','iPhone 12 Pro Max',2020,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(12,'Apple','iPhone 13','13','iPhone 13',2021,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(13,'Apple','iPhone 13','13 mini','iPhone 13 mini',2021,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(14,'Apple','iPhone 13','13 Pro','iPhone 13 Pro',2021,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(15,'Apple','iPhone 13','13 Pro Max','iPhone 13 Pro Max',2021,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(16,'Apple','iPhone 14','14','iPhone 14',2022,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(17,'Apple','iPhone 14','14 Plus','iPhone 14 Plus',2022,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(18,'Apple','iPhone 14','14 Pro','iPhone 14 Pro',2022,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(19,'Apple','iPhone 14','14 Pro Max','iPhone 14 Pro Max',2022,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(20,'Apple','iPhone 15','15','iPhone 15',2023,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(21,'Apple','iPhone 15','15 Plus','iPhone 15 Plus',2023,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(22,'Apple','iPhone 15','15 Pro','iPhone 15 Pro',2023,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(23,'Apple','iPhone 15','15 Pro Max','iPhone 15 Pro Max',2023,'2026-01-23 17:55:59','2026-01-23 17:55:59'),(24,'Apple','iPhone 16','16','iPhone 16',2024,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(25,'Apple','iPhone 16','16 Plus','iPhone 16 Plus',2024,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(26,'Apple','iPhone 16','16 Pro','iPhone 16 Pro',2024,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(27,'Apple','iPhone 16','16 Pro Max','iPhone 16 Pro Max',2024,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(28,'Apple','iPhone 17','17','iPhone 17',2025,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(29,'Apple','iPhone 17','17 Air','iPhone 17 Air',2025,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(30,'Apple','iPhone 17','17 Pro','iPhone 17 Pro',2025,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(31,'Samsung','S20','S20','Galaxy S20',2020,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(32,'Samsung','S20','S20+','Galaxy S20+',2020,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(33,'Samsung','S20','S20 Ultra','Galaxy S20 Ultra',2020,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(34,'Samsung','S21','S21','Galaxy S21',2021,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(35,'Samsung','S21','S21+','Galaxy S21+',2021,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(36,'Samsung','S21','S21 Ultra','Galaxy S21 Ultra',2021,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(37,'Samsung','S22','S22','Galaxy S22',2022,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(38,'Samsung','S22','S22+','Galaxy S22+',2022,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(39,'Samsung','S22','S22 Ultra','Galaxy S22 Ultra',2022,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(40,'Samsung','S23','S23','Galaxy S23',2023,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(41,'Samsung','S23','S23+','Galaxy S23+',2023,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(42,'Samsung','S23','S23 Ultra','Galaxy S23 Ultra',2023,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(43,'Samsung','S24','S24','Galaxy S24',2024,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(44,'Samsung','S24','S24+','Galaxy S24+',2024,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(45,'Samsung','S24','S24 Ultra','Galaxy S24 Ultra',2024,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(46,'Samsung','S25','S25','Galaxy S25',2025,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(47,'Samsung','S25','S25+','Galaxy S25+',2025,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(48,'Samsung','S25','S25 Ultra','Galaxy S25 Ultra',2025,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(49,'Google','Pixel 4','Pixel 4','Google Pixel 4',2019,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(50,'Google','Pixel 4','Pixel 4 XL','Google Pixel 4 XL',2019,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(51,'Google','Pixel 5','Pixel 5','Google Pixel 5',2020,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(52,'Google','Pixel 6','Pixel 6','Google Pixel 6',2021,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(53,'Google','Pixel 6','Pixel 6 Pro','Google Pixel 6 Pro',2021,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(54,'Google','Pixel 7','Pixel 7','Google Pixel 7',2022,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(55,'Google','Pixel 7','Pixel 7 Pro','Google Pixel 7 Pro',2022,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(56,'Google','Pixel 8','Pixel 8','Google Pixel 8',2023,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(57,'Google','Pixel 8','Pixel 8 Pro','Google Pixel 8 Pro',2023,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(58,'Google','Pixel 9','Pixel 9','Google Pixel 9',2024,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(59,'Google','Pixel 9','Pixel 9 Pro','Google Pixel 9 Pro',2024,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(60,'Google','Pixel 9','Pixel 9 Pro XL','Google Pixel 9 Pro XL',2024,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(61,'Google','Pixel 10','Pixel 10','Google Pixel 10',2025,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(62,'Google','Pixel 10','Pixel 10 Pro','Google Pixel 10 Pro',2025,'2026-01-23 17:56:00','2026-01-23 17:56:00'),(63,'Google','Pixel 10','Pixel Fold','Google Pixel Fold',2025,'2026-01-23 17:56:00','2026-01-23 17:56:00');
/*!40000 ALTER TABLE `phone_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phone_variants`
--

DROP TABLE IF EXISTS `phone_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phone_variants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `phone_model_id` bigint unsigned NOT NULL,
  `storage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_variants_phone_model_id_storage_unique` (`phone_model_id`,`storage`),
  CONSTRAINT `phone_variants_phone_model_id_foreign` FOREIGN KEY (`phone_model_id`) REFERENCES `phone_models` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone_variants`
--

LOCK TABLES `phone_variants` WRITE;
/*!40000 ALTER TABLE `phone_variants` DISABLE KEYS */;
INSERT INTO `phone_variants` VALUES (1,1,'64GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(2,1,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(3,2,'64GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(4,2,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(5,2,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(6,3,'64GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(7,3,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(8,3,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(9,4,'64GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(10,4,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(11,4,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(12,5,'64GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(13,5,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(14,5,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(15,6,'64GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(16,6,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(17,6,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(18,7,'64GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(19,7,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(20,7,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(21,8,'64GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(22,8,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(23,8,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(24,9,'64GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(25,9,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(26,9,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(27,10,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(28,10,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(29,10,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(30,11,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(31,11,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(32,11,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(33,12,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(34,12,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(35,12,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(36,13,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(37,13,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(38,13,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(39,14,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(40,14,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(41,14,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(42,14,'1TB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(43,15,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(44,15,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(45,15,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(46,15,'1TB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(47,16,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(48,16,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(49,16,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(50,17,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(51,17,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(52,17,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(53,18,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(54,18,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(55,18,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(56,18,'1TB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(57,19,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(58,19,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(59,19,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(60,19,'1TB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(61,20,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(62,20,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(63,20,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(64,21,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(65,21,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(66,21,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(67,22,'128GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(68,22,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(69,22,'512GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(70,22,'1TB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(71,23,'256GB','2026-01-23 17:55:59','2026-01-23 17:55:59'),(72,23,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(73,23,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(74,24,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(75,24,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(76,24,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(77,25,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(78,25,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(79,25,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(80,26,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(81,26,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(82,26,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(83,26,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(84,27,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(85,27,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(86,27,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(87,28,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(88,28,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(89,28,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(90,28,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(91,28,'2TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(92,29,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(93,29,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(94,29,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(95,29,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(96,29,'2TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(97,30,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(98,30,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(99,30,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(100,30,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(101,30,'2TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(102,31,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(103,32,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(104,33,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(105,33,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(106,33,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(107,34,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(108,34,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(109,35,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(110,35,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(111,36,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(112,36,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(113,36,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(114,37,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(115,37,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(116,38,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(117,38,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(118,39,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(119,39,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(120,39,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(121,39,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(122,40,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(123,40,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(124,40,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(125,41,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(126,41,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(127,42,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(128,42,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(129,42,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(130,43,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(131,43,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(132,43,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(133,44,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(134,44,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(135,45,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(136,45,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(137,45,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(138,46,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(139,46,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(140,46,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(141,47,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(142,47,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(143,47,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(144,48,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(145,48,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(146,48,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(147,49,'64GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(148,49,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(149,50,'64GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(150,50,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(151,51,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(152,52,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(153,52,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(154,53,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(155,53,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(156,53,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(157,54,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(158,54,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(159,55,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(160,55,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(161,55,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(162,56,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(163,56,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(164,57,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(165,57,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(166,57,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(167,57,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(168,58,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(169,58,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(170,59,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(171,59,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(172,59,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(173,59,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(174,60,'128GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(175,60,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(176,60,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(177,60,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(178,61,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(179,61,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(180,61,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(181,62,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(182,62,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(183,62,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(184,63,'256GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(185,63,'512GB','2026-01-23 17:56:00','2026-01-23 17:56:00'),(186,63,'1TB','2026-01-23 17:56:00','2026-01-23 17:56:00');
/*!40000 ALTER TABLE `phone_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `device_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_color_id` bigint unsigned DEFAULT NULL,
  `laptop_variant_id` bigint unsigned DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `cost_price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `min_stock` int NOT NULL DEFAULT '0',
  `shop_id` bigint unsigned DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `source` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imei` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serial_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ram` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive','out_of_stock') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_unique` (`sku`),
  UNIQUE KEY `products_imei_unique` (`imei`),
  UNIQUE KEY `products_serial_number_unique` (`serial_number`),
  KEY `products_shop_id_foreign` (`shop_id`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_phone_color_id_foreign` (`phone_color_id`),
  KEY `products_laptop_variant_id_foreign` (`laptop_variant_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_laptop_variant_id_foreign` FOREIGN KEY (`laptop_variant_id`) REFERENCES `laptop_variants` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_phone_color_id_foreign` FOREIGN KEY (`phone_color_id`) REFERENCES `phone_colors` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_shop_id_foreign` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'iPhone 15 Pro','IPH15P-128','Smartphones',NULL,NULL,NULL,NULL,3500000.00,3200000.00,15,5,1,'Latest iPhone 15 Pro 128GB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(2,'Samsung Galaxy S24','SAM-S24-256','Smartphones',NULL,NULL,NULL,NULL,2800000.00,2500000.00,20,5,1,'Samsung Galaxy S24 256GB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(3,'Tecno Spark 10 Pro','TEC-SP10P','Smartphones',NULL,NULL,NULL,NULL,450000.00,380000.00,50,10,1,'Tecno Spark 10 Pro budget smartphone',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(4,'Infinix Hot 30','INF-HOT30','Smartphones',NULL,NULL,NULL,NULL,380000.00,320000.00,45,10,1,'Infinix Hot 30 affordable smartphone',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(5,'Xiaomi Redmi Note 13','XIA-RN13','Smartphones',NULL,NULL,NULL,NULL,650000.00,550000.00,30,8,1,'Xiaomi Redmi Note 13 Pro',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(6,'JBL Flip 6','JBL-FLIP6','Accessories',NULL,NULL,NULL,NULL,180000.00,150000.00,25,5,1,'JBL Flip 6 Bluetooth Speaker',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(7,'Samsung Earbuds Pro','SAM-EBP','Accessories',NULL,NULL,NULL,NULL,250000.00,200000.00,18,5,1,'Samsung Galaxy Buds Pro',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(8,'Phone Case Universal','CASE-UNI','Accessories',NULL,NULL,NULL,NULL,15000.00,8000.00,100,20,1,'Universal silicone phone case',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(9,'iPhone 14','IPH14-128','Smartphones',NULL,NULL,NULL,NULL,2800000.00,2500000.00,10,3,2,'iPhone 14 128GB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(10,'Samsung Galaxy A54','SAM-A54','Smartphones',NULL,NULL,NULL,NULL,1200000.00,1000000.00,25,5,2,'Samsung Galaxy A54 5G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(11,'Tecno Camon 20','TEC-CAM20','Smartphones',NULL,NULL,NULL,NULL,550000.00,470000.00,35,8,2,'Tecno Camon 20 Pro',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(12,'Screen Protector','SCPROT-UNI','Accessories',NULL,NULL,NULL,NULL,10000.00,5000.00,150,30,2,'Tempered glass screen protector',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(13,'Fast Charger 33W','CHRG-33W','Accessories',NULL,NULL,NULL,NULL,35000.00,25000.00,40,10,2,'33W Fast Charger USB-C',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2025-11-14 18:53:39','2025-11-14 18:53:39',NULL),(14,'Cover 11 pro',NULL,NULL,19,NULL,NULL,NULL,12000.00,10000.00,20,5,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-01-20 16:34:37','2026-01-20 16:34:37',NULL),(15,'iPhone 15 pro',NULL,NULL,17,NULL,NULL,NULL,1800000.00,1600000.00,3,1,6,NULL,'Zunny','351312232343',NULL,NULL,'Space Black','128GB',NULL,'active','2026-01-20 16:35:37','2026-01-20 16:35:37',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warranty_id` bigint unsigned DEFAULT NULL,
  `salesman_id` bigint unsigned DEFAULT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(15,2) NOT NULL,
  `cost_price` decimal(15,2) DEFAULT NULL,
  `offers` decimal(10,2) DEFAULT NULL COMMENT 'Offers/discounts given to customer',
  `selling_price` decimal(15,2) NOT NULL,
  `expenses` decimal(15,2) DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `has_warranty` tinyint(1) NOT NULL DEFAULT '0',
  `warranty_start` datetime DEFAULT NULL,
  `warranty_end` datetime DEFAULT NULL,
  `warranty_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warranty_details` json DEFAULT NULL,
  `is_service` tinyint(1) NOT NULL DEFAULT '0',
  `service_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_details` json DEFAULT NULL,
  `ganji` decimal(15,2) DEFAULT NULL,
  `warranty_months` int DEFAULT NULL,
  `sale_date` datetime NOT NULL,
  `reference_store` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('phones','accessories','laptops') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `laptop_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imei` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serial_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ram` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storage` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_salesman_id_foreign` (`salesman_id`),
  KEY `sales_warranty_id_foreign` (`warranty_id`),
  CONSTRAINT `sales_warranty_id_foreign` FOREIGN KEY (`warranty_id`) REFERENCES `warranties` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'samsung s22','samsung s22',NULL,10,'Baraka',NULL,1,1200000.00,1000000.00,20000.00,1200000.00,NULL,1200000.00,0,NULL,NULL,NULL,NULL,0,NULL,NULL,180000.00,NULL,'2025-11-15 00:03:06','Yusuph','phones','Samsung S22',NULL,'213121212',NULL,NULL,'blue','256GB','2025-11-14 21:03:06','2025-11-14 21:03:06'),(2,'macbook pro 2020','macbook pro 2020',NULL,10,'Baraka',NULL,1,5000000.00,1000000.00,20000.00,5000000.00,NULL,5000000.00,0,NULL,NULL,NULL,NULL,0,NULL,NULL,3980000.00,NULL,'2025-11-15 00:30:43','The Connect','laptops',NULL,NULL,NULL,NULL,NULL,'Black','256GB SSD','2025-11-14 21:30:43','2025-11-14 21:30:43'),(3,'samsung s22','samsung s22',NULL,10,'Baraka','0629288966',1,1500000.00,1200000.00,20000.00,1500000.00,NULL,1500000.00,1,'2025-11-15 00:43:18','2026-11-15 00:43:18','active','{\"color\": \"Space Black\", \"storage\": \"128GB\", \"cost_price\": 1200000, \"phone_name\": \"Samsung S22 \", \"imei_number\": \"2313212122\", \"selling_price\": 1500000, \"customer_email\": \"barakaellucas2019@gmail.com\"}',0,NULL,NULL,280000.00,12,'2025-11-15 00:43:18','Yusuph',NULL,'Samsung S22 ',NULL,'2313212122',NULL,NULL,'Space Black','128GB','2025-11-14 21:43:18','2025-11-14 21:43:18'),(4,'samsung s22','samsung s22',NULL,10,'Baraka','12212121212',1,1200000.00,1000000.00,20000.00,1200000.00,NULL,1200000.00,1,'2025-11-15 00:57:29','2026-11-15 00:57:29','active','{\"color\": \"blue\", \"storage\": \"128GB\", \"cost_price\": 1000000, \"phone_name\": \"Samsung s22\", \"imei_number\": \"3242122312\", \"selling_price\": 1200000, \"customer_email\": \"barakaellucas2020@gmail.com\"}',0,NULL,NULL,180000.00,12,'2025-11-15 00:57:29','the store',NULL,'Samsung s22',NULL,'3242122312',NULL,NULL,'blue','128GB','2025-11-14 21:57:29','2025-11-14 21:57:29'),(5,'samsung s22','samsung s22',NULL,10,'Baraka','122312123',1,1200000.00,1000000.00,20000.00,1200000.00,NULL,1200000.00,1,'2025-11-15 01:06:30','2026-11-15 01:06:30','active','{\"color\": \"Space Black\", \"storage\": \"256GB\", \"cost_price\": 1000000, \"phone_name\": \"Samsung S22\", \"imei_number\": \"23313123122\", \"selling_price\": 1200000, \"customer_email\": \"barakaellucas2020@gmail.com\"}',0,NULL,NULL,180000.00,12,'2025-11-15 01:06:30','Yusuph',NULL,'Samsung S22',NULL,'23313123122',NULL,NULL,'Space Black','256GB','2025-11-14 22:06:30','2025-11-14 22:06:30'),(6,'samsung s22','samsung s22',NULL,11,'Baraka','12123121212',1,1200000.00,1000000.00,10000.00,1200000.00,NULL,1200000.00,1,'2025-11-15 01:21:20','2026-11-15 01:21:20','active','{\"color\": \"Space Black\", \"storage\": \"128GB\", \"cost_price\": 1000000, \"phone_name\": \"Samsung S22\", \"imei_number\": \"2312132312\", \"selling_price\": 1200000, \"customer_email\": \"barakaellucas2020@gmail.com\"}',0,NULL,NULL,190000.00,12,'2025-11-15 01:21:20','The connect',NULL,'Samsung S22',NULL,'2312132312',NULL,NULL,'Space Black','128GB','2025-11-14 22:21:20','2025-11-14 22:21:20'),(7,'iphone 15','iphone 15',NULL,4,'barakael',NULL,1,1500000.00,1200000.00,12000.00,1500000.00,NULL,1500000.00,0,NULL,NULL,NULL,NULL,0,NULL,NULL,288000.00,NULL,'2025-11-16 11:52:03','baraka','phones','iPhone 15',NULL,'35231212232',NULL,NULL,'space','256GB','2025-11-16 08:52:03','2025-11-16 08:52:03'),(8,'samsung s22','samsung s22',NULL,11,'Barakael lucas','78909233',1,1200000.00,1000000.00,12000.00,1200000.00,NULL,1200000.00,1,'2025-11-17 16:41:41','2026-11-17 16:41:41','active','{\"color\": \"space Black\", \"storage\": \"128GB\", \"cost_price\": 1000000, \"phone_name\": \"Samsung s22\", \"imei_number\": \"3512122121212\", \"selling_price\": 1200000, \"customer_email\": \"barakaellucas2019@gmail.com\"}',0,NULL,NULL,188000.00,12,'2025-11-17 16:41:41','Yusuph',NULL,'Samsung s22',NULL,'3512122121212',NULL,NULL,'space Black','128GB','2025-11-17 13:41:41','2025-11-17 13:41:41'),(9,'17 pro max','17 pro max',NULL,11,'Rama',NULL,1,4500000.00,1000000.00,0.00,4500000.00,NULL,4500000.00,0,NULL,NULL,NULL,NULL,0,NULL,NULL,3500000.00,NULL,'2025-11-17 17:28:02','The Connect','phones','17 Pro Max',NULL,'3546689080090',NULL,NULL,'Orange','256GB','2025-11-17 14:28:02','2025-11-17 14:28:02'),(10,'iphone 15 pro','iphone 15 pro',NULL,12,'Barakael lucas','0629288966',1,1200000.00,1000000.00,20000.00,1200000.00,NULL,1200000.00,1,'2026-01-05 11:38:56','2027-01-05 11:38:56','active','{\"color\": \"Space Black\", \"storage\": \"256GB\", \"cost_price\": 1000000, \"phone_name\": \"iPhone 15 Pro\", \"imei_number\": \"3512321212312\", \"selling_price\": 1200000, \"customer_email\": \"barakaellucas2019@gmail.com\"}',0,NULL,NULL,180000.00,12,'2026-01-05 11:38:56','Zunny Store','phones','iPhone 15 Pro',NULL,'3512321212312',NULL,NULL,'Space Black','256GB','2026-01-05 08:38:56','2026-01-05 08:38:56');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_orders`
--

DROP TABLE IF EXISTS `sales_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `salesman_id` bigint unsigned NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','quoted','confirmed','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `items` json NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(15,2) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `valid_until` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_orders_salesman_id_foreign` (`salesman_id`),
  CONSTRAINT `sales_orders_salesman_id_foreign` FOREIGN KEY (`salesman_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_orders`
--

LOCK TABLES `sales_orders` WRITE;
/*!40000 ALTER TABLE `sales_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `device_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issue_price` decimal(10,2) NOT NULL,
  `service_price` decimal(10,2) NOT NULL,
  `final_price` decimal(10,2) NOT NULL,
  `offers` decimal(10,2) DEFAULT NULL COMMENT 'Offers/discounts given to customer',
  `cost_price` decimal(10,2) NOT NULL,
  `ganji` decimal(10,2) NOT NULL,
  `salesman_id` bigint unsigned NOT NULL,
  `service_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `services_salesman_id_foreign` (`salesman_id`),
  CONSTRAINT `services_salesman_id_foreign` FOREIGN KEY (`salesman_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'samsung s22','Display','Baraka','John',100000.00,10000.00,150000.00,0.00,110000.00,40000.00,10,'2025-11-15','2025-11-14 21:04:03','2025-11-14 21:04:03'),(2,'iphone 15 pro','Battery','Baraka','John',100000.00,20000.00,150000.00,0.00,120000.00,30000.00,11,'2025-12-02','2025-12-02 14:09:21','2025-12-02 14:09:21');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('0Eb5l8FcvXlpHpBakMX2upQS1ziqiaKNr94N4cGl',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibWJYUWtoU1pOT3U3cjVGQnp3bFFZTXZGb3lTb1J5bnNJazB0WnhVMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776004790),('0yBdlbozmZskA15qOQ0ED5iEO1uEHvM4k3xOq70o',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVUpjcTNxbHl5NVQxSTJrOGEzSTF0enZwSFpMQlVJOG5WcGI2YjFOcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005482),('1PTFjjJwLdiTfr4OU0AIobrxl1fobteNzyr5oUei',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMnFueFJ2dGRkaUZNekJJMHF2NFlSS3J6RHhyUTFGQThuOFRrWEs3SCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776006207),('43odTMiVQ2LK3HJA4zMw1kVdaL8GZQd45ffGID3C',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2NmOEhCcWJUUFI1VzJXS0JCd3JUdXd2MGttY0ZkQzVqVXBjOVVEbSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005620),('92HfcdLBZaJeXVL0aXDVpWE8rAuJXFB0RtSoFfmq',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoia2xSUW1BVFpkeHJjS1l5b0hBdEtucndwaUc5UXBqbldjNEk4RWJpSSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005362),('arwXOqLxeGr1XMqKQ94uZHrGzcxJzddrw9NquNUd',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzhuSm9Ib1hCb1FSdW4xRThTMk9MRXJpRzFoWFVrYzR0Q0J6SkdGNCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005493),('E0Oft6hdYA6xkJNPQSarJFJeRdeoZu4t98vMD5oP',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibW5KWlVCM1lPYnRmaG1UVmJySEJLVmdIN3lkQjQ4akZyQVdTTnZndyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005079),('f5IUxTQRuhWSCzwbxTXpzJJ7ahdM4PmwQzZN8dOm',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1','YTozOntzOjY6Il90b2tlbiI7czo0MDoiT0p3bzllOEdxRGNzcHROUGxpNFhUMDFMVDEwVG1MbjZHNTFKSk0wSiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005322),('fp5VekQ0hmBPQDWIeddR5lCreWM1d45PhVrNFbk9',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoieUhrN0tVYTlpTElVdUNCbjZKalE1NkhhR3QwM2hHT0R4QWh5dWJJSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005301),('FQLc6W0Crin8yxURUGJf10j0kGZ29KrqW0WJTCPs',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUlRINTlxM2h6QkZTek9Sbkl0V3V0NDFQQXNLeFc1UW9mR3lrWm1GRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005482),('FSkTLlUEbws3c58FonaGzJR95aewsr4octzXif4k',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVGg3VWphUEFhMmhXU2E5UmRTZkpiSzF2bDhNUEpMMHlSQ3hRME9PVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005079),('gbdOLODTzl1o26bFTufgiCokLkxNXBGqsWBFZVKo',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMGRQNnc1RjIwekxMRTFkYXVhOExVMlBmSVdlakxpR3JnZkxVWjVPeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005330),('H516Q8QzzqQqgiBkqM0xUjDHjXYTR5HNWyc11P4m',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidkRsVWZRMWtPa0F5cWZhOFBqODY0enNDbWF3R0RiZ1ZlbXpuOGNPRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005493),('HP0R6EnUpxsh6ZDjSoGunV6gNwwnqGLpYcCuMTLE',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzBhcGRWR2dUbWhJYkRmam5oY01YYzhaWVZJMmZaTWM3NVZpSGU0VyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005469),('IKntynOSfe4WJWfp5pbb5M7o7ZJjgZlEVoLMXFTe',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWUY1U0VONmZRNmNHMHo5Q09ZQ0Njamo4enJDQThobWpKVVlycFNmZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776006207),('iz65QpSKeypRUUoJIDPsdmo8CUiJsYXqFMZTrNB4',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiRldYRkhUZjF5YXBZNEhiRGE1UFgxbHJkVHFJYXp6VEI2dlpWdjBLMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005378),('jfbT2ztDEbCdtle6nvCaZDJGJrCIpZLebUwwSIGA',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2tBVTBxQzc3RVVvZWhvUW1ZdXpOM0c2cHVuWGwwa2w5UjNGSXIwVCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005378),('K2Zcu0WawTBFQqTRVkhLQpi8pXE161qlcOjAaM14',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMWdVeXBQYWN3c0gyMGk4Nk9mWUZmdG8wb1FRRUk0dkxmNUMzZDA0WCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005675),('Lf1IFEku7O5JzDDf3IK0VSIMypEtOFdDc5UGTYBM',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQVh5dDZFMEIwalZmWjFQakR1alJXdk9zcmdaSFJ5ZGhEYzc1NTRTaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005620),('LmA4tAB5NzhKnEWiYsVMlLBPhW9XroMXWrkJs7Ww',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTzlLQlJMSnZYdE5xY3IyWHQwd25LWENZQlZyWldURnhEVFhsY3R1WCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005361),('lQXm0CGgsUqZFCbhVRSuD8NjDqhoxOaf4QIvtTS8',NULL,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1','YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0Z0R252SlA1eGhheXRzdWpPV2lvU1ZBSkY2QWNIRzUxaDZtQzA4RCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005322),('NDygXQpJjA6wWOzzYRw52HEQuK84fkLQl4vyFY22',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoicmNaSjlXY3ZnYmFQUDAxYjJNRGREUUhtWmlvWmpVR1hoNnY1VnhtUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776004801),('pmKqfkVwJEAH3qg6ducjmF0pdmKt6cZBp9nf84Be',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWjA4MWY4RkU2OWJObFlaRUNDQ3E0VmJBWGRQU3VZUUZmRjZHbTcwSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005330),('qmUd82AcSKjeSVQA6FmBG9AQmTtSYsZKIIVz7f9D',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMElFNXAwNGEzN1pCNHp2RTNBVGNyZDduR2lqeFNYZThBVkJEQUtiZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005301),('tZrDxnQC04107kdcDvoHIpb0NZRrOhZgj0DyDzqx',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ3JlTFpFMW12bGE0SUxkWlpEZzdYVWRxV3ZyMjFwS3ZSM3g5RWJjYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005495),('UPdAXO44XRQ2XFmvYOSU6JmN3WMeeIv3J9oqyDSq',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiS3VwRktDRWgwTTNVN21CbWk3YXUzbXNpWmcxSE9jTU9JaWtBTUhPcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005361),('V9ZEUr6Qbe3xsUpNInf1yDQ3pOn3DSYF1GOpz9Vr',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYWltR3NoQkZPbHZLT1NHQlJUa1l6VlREUmZTRnJodEdSUFpHcHBxYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005495),('viLk9TtaqrNbCCziRfcXCRv965q9AnTO5WNE6r08',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiclRQVTFTZ2c1YmMyUWt0dlczMUZ2WHhWd09aRUxIWHU3S2N6WmtNNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005675),('VM6Hh5tzPuZL3zxyhNmILDLKS8wm0eEkCf3ubsPB',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUHBxdndPRVlqa0lYZ2JzVjN3MDlENEsxMzlYbUJ0U3liZVpPN2I5aiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005469),('w7UPnJ08J9YgnNd0Cm9MPzZxXUIOe4e5D5pwRIi8',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiamMzcEdHeFJIT21hNzVZVG1JemFjWnZNNjJ2V3Vzd1VvZVkwTmp6USI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776004801),('y6h9EX0RVRJrss1Ce75KfaMqABU2raIoCUowOs44',NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 16; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.260 Mobile Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTG1hQWpxSFM2QVZVU1lFVUduQnVUQWhZZUtDUmZ0THNjRFM1RFdyMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776005362),('YPEVOYxR8gMRzsdawvO6j9oKMoLCwxz21O8UJifu',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidTZPOXEyUHlpVmVPTzJaN1BQczZWWFNpYlJSY2dwRmZnZGlSUU5pNCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1776004790);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shops` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_id` bigint unsigned DEFAULT NULL,
  `status` enum('active','inactive','suspended') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `description` text COLLATE utf8mb4_unicode_ci,
  `logo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shops_owner_id_foreign` (`owner_id`),
  CONSTRAINT `shops_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--

LOCK TABLES `shops` WRITE;
/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` VALUES (1,'Winga Electronics - Dar es Salaam','Kariakoo','Kariakoo Market, Dar es Salaam','+255 712 345 678','dar@wingaelectronics.co.tz',NULL,'active','Main branch in Dar es Salaam specializing in smartphones and electronics',NULL,'2025-11-14 18:53:38','2025-11-14 18:53:38'),(2,'Winga Electronics - Arusha','Arusha Central','Clock Tower, Arusha','+255 713 456 789','arusha@wingaelectronics.co.tz',NULL,'active','Arusha branch serving northern Tanzania',NULL,'2025-11-14 18:53:38','2025-11-14 18:53:38'),(3,'Winga Electronics - Mwanza','Mwanza City','Kenyatta Road, Mwanza','+255 714 567 890','mwanza@wingaelectronics.co.tz',NULL,'active','Lakeside branch in Mwanza',NULL,'2025-11-14 18:53:38','2025-11-14 18:53:38'),(4,'Winga Mobile - Dodoma','Dodoma Capital','Nyerere Square, Dodoma','+255 715 678 901','dodoma@wingamobile.co.tz',NULL,'active','Capital city mobile phone shop',NULL,'2025-11-14 18:53:38','2025-11-14 18:53:38'),(5,'Winga Tech - Mbeya','Mbeya Town','Iyunga Street, Mbeya','+255 716 789 012','mbeya@wingatech.co.tz',NULL,'inactive','Southern highlands tech shop - Currently under renovation',NULL,'2025-11-14 18:53:38','2025-11-14 18:53:38'),(6,'Baraka Shop','Dar-es-salaam','','0629288966',NULL,12,'active','',NULL,'2026-01-05 08:37:02','2026-01-05 08:37:02');
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `targets`
--

DROP TABLE IF EXISTS `targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `targets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `salesman_id` bigint unsigned NOT NULL,
  `team_id` bigint unsigned DEFAULT NULL,
  `shop_id` bigint unsigned DEFAULT NULL,
  `target_value` decimal(15,2) NOT NULL,
  `status` enum('active','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `bonus_amount` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `period` enum('monthly','yearly') COLLATE utf8mb4_unicode_ci NOT NULL,
  `metric` enum('profit','items_sold') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `targets_salesman_id_foreign` (`salesman_id`),
  CONSTRAINT `targets_salesman_id_foreign` FOREIGN KEY (`salesman_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `targets`
--

LOCK TABLES `targets` WRITE;
/*!40000 ALTER TABLE `targets` DISABLE KEYS */;
INSERT INTO `targets` VALUES (2,11,NULL,NULL,5000000.00,'active',NULL,'2025-12-02 16:50:18','2026-01-03 07:29:48','December Target','monthly','profit');
/*!40000 ALTER TABLE `targets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` enum('super_admin','shop_owner','storekeeper','salesman') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'salesman',
  `invitation_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `shop_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_invitation_token_unique` (`invitation_token`),
  KEY `users_shop_id_foreign` (`shop_id`),
  CONSTRAINT `users_shop_id_foreign` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super Admin','admin@wingaplus.com','+255 700 000 000',NULL,'$2y$12$cQOccaOiy9ksXMLtWsNC.OD/VPS35jO/.IkkLny5ElmmUJtu6DnRy',NULL,'2025-11-14 18:53:38','2025-11-14 18:53:38','super_admin',NULL,'active',NULL),(2,'John Mwamba','john@wingaelectronics.co.tz','+255 712 111 111',NULL,'$2y$12$dGfaMDzK6lz1rhfP8vu.P.gGXJ6VAm9mg1.PEvb6KZewdWToGiU8O',NULL,'2025-11-14 18:53:38','2025-11-14 18:53:38','shop_owner',NULL,'active',1),(3,'Grace Moshi','grace@wingaelectronics.co.tz','+255 713 222 222',NULL,'$2y$12$gPpeORX3wC7bdzipJ4GiduDqZJ2toP982jyUTDdCLEwDH4U.A8sp.',NULL,'2025-11-14 18:53:38','2025-11-14 18:53:38','shop_owner',NULL,'active',2),(4,'James Kikwete','james@wingaelectronics.co.tz','+255 712 333 333',NULL,'$2y$12$zwrRoTRpVo3BIDVtH0ARduqUc0c3M5axJTmbt70xhA.nE8NL6vJxK',NULL,'2025-11-14 18:53:38','2025-11-14 18:53:38','salesman',NULL,'active',1),(5,'Mary Nyerere','mary@wingaelectronics.co.tz','+255 712 444 444',NULL,'$2y$12$AdgHh3Fu4ht6UmHh1JyprO0ZIllZGlomxb8HbLu4m0.4orXzStNxO',NULL,'2025-11-14 18:53:39','2025-11-14 18:53:39','salesman',NULL,'active',1),(6,'David Mwinyi','david@wingaelectronics.co.tz','+255 712 555 555',NULL,'$2y$12$GV/LS/id3hXA8jeUSx9tb.zGSVo/H8iRWYIRIrAHPOI4XmABgMzGu',NULL,'2025-11-14 18:53:39','2025-11-14 18:53:39','salesman',NULL,'active',1),(7,'Sarah Kilimanjaro','sarah@wingaelectronics.co.tz','+255 713 666 666',NULL,'$2y$12$5rq4L3LHeADTypfBMIjhg.ee0YCDu1v4yWgBdeYA5WsWKmACzqR1G',NULL,'2025-11-14 18:53:39','2025-11-14 18:53:39','salesman',NULL,'active',2),(8,'Peter Meru','peter@wingaelectronics.co.tz','+255 713 777 777',NULL,'$2y$12$CsvE2CuAi5D50Zv/oSl6hOIruxAkO4KvvTRaYhTdPyXxrJSXW10JW',NULL,'2025-11-14 18:53:39','2025-11-14 18:53:39','salesman',NULL,'active',2),(10,'Blessings','winga@wingaplus.com',NULL,NULL,'$2y$12$.tFDcaTs4BE3Ra041RUtCeBg7dl0kSkpfcU6SotIETQPx.Y.I2iYa',NULL,'2025-11-14 18:56:07','2025-11-14 18:56:07','salesman',NULL,'active',NULL),(11,'Baraka Store','baraka@wingaplus.com',NULL,NULL,'$2y$12$vD/Y7QoQJnx3KKZZEg.qn.jAUNTHZigle.8RhyMLyY2GLldXC20Xi',NULL,'2025-11-14 22:20:14','2026-01-03 07:18:21','salesman',NULL,'active',NULL),(12,'Blessings Store','barakaellucas2019@gmail.com','0629288966',NULL,'$2y$12$3CHtLWStwBgx8HsPv4CvYeEZUaiGEeHLY5ZUYvEolrbAE4xoOKq3e',NULL,'2026-01-05 08:36:36','2026-01-05 08:37:47','shop_owner',NULL,'active',NULL),(17,'Barakael lucas','barakaellucas2020@gmail.com',NULL,NULL,'$2y$12$XyhivIwX5mK2cINUYPnqse3P1vn.kgGVsWUI1SE0Ql9/cYeXJaNxC',NULL,'2026-01-06 10:47:32','2026-01-20 16:13:14','storekeeper','vDR0QLUCkhKlCX9NpETfW8I3egLohnnj689BlvNks4NmmfjHczXOy1ta6DT5','active',6);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warranties`
--

DROP TABLE IF EXISTS `warranties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warranties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `phone_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `imei_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `warranty_period` int NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warranties`
--

LOCK TABLES `warranties` WRITE;
/*!40000 ALTER TABLE `warranties` DISABLE KEYS */;
/*!40000 ALTER TABLE `warranties` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-18 15:53:35
