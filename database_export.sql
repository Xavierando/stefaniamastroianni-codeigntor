/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.2.2-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: stefaniamastroianni
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `ContactSubmission`
--

DROP TABLE IF EXISTS `ContactSubmission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ContactSubmission` (
  `id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContactSubmission`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ContactSubmission` WRITE;
/*!40000 ALTER TABLE `ContactSubmission` DISABLE KEYS */;
INSERT INTO `ContactSubmission` VALUES
('c_69b6837d201ef','Anna Giorgi','anna.g@email.it','Buongiorno Stefania, vorrei avere maggiori informazioni sul corso di massaggio infantile. Quando inizierà il prossimo ciclo?',0,'2026-03-15 09:01:33'),
('c_69b6837d20242','Giulia Ferri','g.ferri@email.it','Ciao! Ho visto che organizzi dei cerchi di donne per la luna nuova. Ci sono ancora posti disponibili per il prossimo evento del 15?',1,'2026-03-13 10:01:33');
/*!40000 ALTER TABLE `ContactSubmission` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `GalleryImage`
--

DROP TABLE IF EXISTS `GalleryImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `GalleryImage` (
  `id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `alt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GalleryImage`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `GalleryImage` WRITE;
/*!40000 ALTER TABLE `GalleryImage` DISABLE KEYS */;
INSERT INTO `GalleryImage` VALUES
('3af83db4af96ab72fe7d8fc966d556a6','/uploads/1773570205_6626bcbd98d713c72cc9.webp','','2026-03-15 10:23:25'),
('a4ec5520de19b5521f2f495f4bc0a879','/uploads/1773570197_b09ff9028813a9bf5c32.webp','','2026-03-15 10:23:17'),
('c724873b4522101fec78259470394fba','/uploads/1773570257_6380cddaf2b3e524d201.webp','','2026-03-15 10:24:17'),
('dcda4d43430aef4ed9393ba4c58c458f','/uploads/1773570228_a92232dc44aa1088c58c.webp','','2026-03-15 10:23:48'),
('e5dcdee0d90a1a8e097f17ee1ae8b547','/uploads/1773570188_badb42e8a13114faf612.webp','','2026-03-15 10:23:08'),
('fa69630fc301d149289993171f3d36fb','/uploads/1773570238_1c61e7f3967a26e1a720.webp','','2026-03-15 10:23:58');
/*!40000 ALTER TABLE `GalleryImage` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `NewsletterSubscriber`
--

DROP TABLE IF EXISTS `NewsletterSubscriber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `NewsletterSubscriber` (
  `id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NewsletterSubscriber`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `NewsletterSubscriber` WRITE;
/*!40000 ALTER TABLE `NewsletterSubscriber` DISABLE KEYS */;
INSERT INTO `NewsletterSubscriber` VALUES
('nl_69b6837d14569','chiara.rossi@email.it','2026-03-05 10:01:33'),
('nl_69b6837d14597','mario.bianchi@email.it','2026-03-10 10:01:33'),
('nl_69b6837d145a0','elisa.verdi@email.it','2026-03-13 10:01:33');
/*!40000 ALTER TABLE `NewsletterSubscriber` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Review`
--

DROP TABLE IF EXISTS `Review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Review` (
  `id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imageUrl` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Review`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Review` WRITE;
/*!40000 ALTER TABLE `Review` DISABLE KEYS */;
INSERT INTO `Review` VALUES
('rev_69b6837ceb30a','Chiara M.','Ho frequentato il corso di yoga in gravidanza con Stefania. È stata un\'esperienza meravigliosa che mi ha aiutato ad arrivare al parto serena e centrata. La consiglio di cuore!','MATERNITA',NULL,'2026-01-15 10:01:32'),
('rev_69b6837ceb33f','Martina D.','L\'accompagnamento al parto mi ha fornito strumenti pratici e una grande consapevolezza. Grazie a Stefania ho vissuto il momento più importante della mia vita con forza e senza paura.','MATERNITA',NULL,'2025-12-15 10:01:32'),
('rev_69b6837ceb346','Valentina R.','I massaggi ayurvedici durante l\'ottavo mese sono stati fondamentali per alleviare il mal di schiena e la pesantezza alle gambe. Un vero momento di coccola solo per me.','MATERNITA',NULL,'2026-02-15 10:01:32'),
('rev_69b6837ceb34c','Alessia S.','Il corso post-parto con il mio bambino è diventato il nostro momento preferito della settimana. È bellissimo poter riprendere contatto col proprio corpo in un ambiente così dolce e non giudicante.','MATERNITA','/uploads/reviews/1773569937_a1710870a5e3d8431960.webp','2026-02-28 10:01:32'),
('rev_69b6837ceb352','Sara B.','I trattamenti di Stefania sono un vero toccasana. Riesce sempre a capire di cosa ha bisogno il mio corpo e dopo ogni seduta mi sento rinata, leggera e piena di energia positiva.','TRATTAMENTI',NULL,'2026-02-28 10:01:32'),
('rev_69b6837ceb359','Elena F.','Le consulenze sui fiori di Bach mi hanno aiutato a superare un periodo di forte ansia lavorativa. Stefania ascolta senza giudicare e sa guidarti con grande empatia.','CONSULENZE','/uploads/reviews/1773569910_19edbe8d0ea68dbfa947.webp','2026-03-10 10:01:32'),
('rev_69b6837ceb35e','Francesca L.','Il cerchio di donne è stato potente e trasformativo. Un momento magico di condivisione autentica. Grazie Stefania per creare questi spazi sicuri e necessari.','YOGA',NULL,'2026-02-15 10:01:32');
/*!40000 ALTER TABLE `Review` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `shortDescription` text COLLATE utf8mb4_general_ci,
  `slug` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `date` datetime DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `imageUrl` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES
(1,'Cerchio di Luna Nuova','Un incontro speciale tra donne per celebrare l\'energia della luna nuova, condividere, meditare e piantare i semi delle nostre nuove intenzioni in un ambiente protetto e accogliente.','Celebriamo l\'energia della luna nuova con meditazione e condivisione.','cerchio-luna-nuova','TRATTAMENTI','2026-03-29 20:30:00','Studio di Roma',25.00,'/images/home/Pratiche-di-Yoga.webp','2026-03-15 10:01:32','2026-03-15 10:01:32'),
(2,'Ritiro Yoga di Primavera','Un weekend immersi nella natura per risvegliare il corpo e la mente dopo l\'inverno. Pratiche di yoga, meditazione, passeggiate consapevoli e cibo sano.','Un weekend nella natura per ritrovare l\'equilibrio con pratiche di yoga e meditazione.','ritiro-yoga-primavera','YOGA','2026-04-29 10:00:00','Agriturismo nel Bosco',250.00,'/images/home/home-hero-yoga.webp','2026-03-15 10:01:32','2026-03-15 10:01:32'),
(3,'Workshop: Il Massaggio del Neonato','Un incontro pratico per neo-genitori per imparare le tecniche base del massaggio infantile, favorendo il rilassamento del bebè e rafforzando il legame affettivo.','Tecniche base di massaggio infantile per neo-genitori in un ambiente sereno.','workshop-massaggio-neonato','MATERNITA','2026-03-22 10:00:00','Studio di Roma',40.00,'/images/maternita/Servizi-maternita-2.webp','2026-03-15 10:01:32','2026-03-15 10:01:32');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `version` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `class` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `group` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `namespace` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `time` int NOT NULL,
  `batch` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(14,'2026-03-15-000001','App\\Database\\Migrations\\ContactSubmission','default','App',1773568891,1),
(15,'2026-03-15-000002','App\\Database\\Migrations\\NewsletterSubscriber','default','App',1773568891,1),
(16,'2026-03-15-000003','App\\Database\\Migrations\\ServiceOffering','default','App',1773568891,1),
(17,'2026-03-15-000004','App\\Database\\Migrations\\Review','default','App',1773568891,1),
(18,'2026-03-15-000005','App\\Database\\Migrations\\GalleryImage','default','App',1773568892,1),
(19,'2026-03-15-084326','App\\Database\\Migrations\\SplitServicesAndEvents','default','App',1773568892,1),
(20,'2026-03-15-095904','App\\Database\\Migrations\\AddShortDescriptionToEvents','default','App',1773568892,1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `duration` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imageUrl` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
('srv_69b6837cbd72e','yoga-in-gravidanza','Yoga in Gravidanza','Un percorso dolce e consapevole per accompagnare la donna durante la gestazione, lavorando sul respiro, sulla flessibilità e sulla connessione profonda con il proprio bambino.','YOGA','45.00','60','/images/yoga/Pratiche-di-Yoga.webp','2026-03-15 10:01:32','2026-03-15 10:01:32'),
('srv_69b6837cbd736','massaggio-ayurvedico-gravidanza','Massaggio Ayurvedico in Gravidanza','Trattamento dolce, avvolgente e rilassante, specifico per alleviare le tensioni muscolari, migliorare la circolazione e donare un profondo senso di benessere alla futura mamma.','MATERNITA','70.00','90','/images/maternita/Servizi-maternita-2.webp','2026-03-15 10:01:32','2026-03-15 10:01:32'),
('srv_69b6837cbd738','trattamento-olistico-ribilanciante','Trattamento Olistico Ribilanciante','Un massaggio profondo che unisce diverse tecniche per sciogliere i blocchi fisici ed energetici, ripristinando l\'armonia tra corpo, mente e spirito.','TRATTAMENTI','60.00','60','/images/trattamenti/trattamenti-olistici-1.webp','2026-03-15 10:01:32','2026-03-15 10:01:32'),
('srv_69b6837cbd739','consulenza-fiori-di-bach','Consulenza Fiori di Bach','Colloquio individuale per individuare i rimedi floreali più adatti a supportare il riequilibrio emozionale e superare momenti di stress, ansia o cambiamento.','CONSULENZE','50.00','60','/images/consulenze/consulenze-2.webp','2026-03-15 10:01:32','2026-03-15 10:01:32'),
('srv_69b6837cbd73a','lettura-astrologica-evolutiva','Lettura Astrologica Evolutiva','Un\'analisi profonda del tema natale per comprendere i propri talenti, le sfide karmiche e il percorso di crescita personale, in un\'ottica di evoluzione spirituale.','CONSULENZE','80.00','90','/images/consulenze/consulenze-1.webp','2026-03-15 10:01:32','2026-03-15 10:01:32'),
('srv_69b6837cbd73c','accompagnamento-al-parto','Accompagnamento al Parto','Incontri informativi ed esperienziali per prepararsi fisicamente ed emotivamente al momento della nascita, acquisendo strumenti pratici per la gestione del dolore.','MATERNITA','80.00','120','/images/maternita/Servizi-maternita-1.webp','2026-03-15 10:01:32','2026-03-15 10:01:32'),
('srv_69b6837cbd73d','yoga-post-parto-bebe','Yoga Post Parto con Bebè','Un corso dolce per recuperare il tono muscolare del pavimento pelvico e dell\'addome, rafforzando contemporaneamente il legame con il proprio bambino in uno spazio accogliente.','MATERNITA','45.00','60','/images/maternita/Servizi-maternita-2.webp','2026-03-15 10:01:32','2026-03-15 10:01:32'),
('srv_69b6837cbd73e','hatha-yoga-tradizionale','Hatha Yoga Tradizionale','Lezioni di yoga adatte a tutti i livelli per ritrovare equilibrio, flessibilità e forza attraverso asana classiche e tecniche di respirazione pranayama.','YOGA','50.00','75','/images/home/Pratiche-di-Yoga.webp','2026-03-15 10:01:32','2026-03-15 10:01:32'),
('srv_69b6837cbd73f','trattamento-sonoro-campane-tibetane','Trattamento Sonoro con Campane Tibetane','Un massaggio vibrazionale profondo in cui le frequenze sonore avvolgono il corpo, sciogliendo tensioni e inducendo uno stato meditativo di profondo rilassamento.','TRATTAMENTI','60.00','60','/images/trattamenti/trattamenti-olistici-1.webp','2026-03-15 10:01:32','2026-03-15 10:01:32');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-03-15 11:29:53
