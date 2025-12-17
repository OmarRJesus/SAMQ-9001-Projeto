-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: samq9001
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acoes_pac`
--

DROP TABLE IF EXISTS `acoes_pac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acoes_pac` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nc_id` int NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `porque` text,
  `responsavel` varchar(100) DEFAULT NULL,
  `onde` varchar(255) DEFAULT NULL,
  `como` text,
  `quanto` varchar(100) DEFAULT NULL,
  `prazo` date DEFAULT NULL,
  `estado` enum('Pendente','Concluída') DEFAULT 'Pendente',
  `observacoes` text,
  PRIMARY KEY (`id`),
  KEY `nc_id` (`nc_id`),
  CONSTRAINT `acoes_pac_ibfk_1` FOREIGN KEY (`nc_id`) REFERENCES `nao_conformidades` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acoes_pac`
--

LOCK TABLES `acoes_pac` WRITE;
/*!40000 ALTER TABLE `acoes_pac` DISABLE KEYS */;
INSERT INTO `acoes_pac` VALUES (1,1,'Contactar fornecedor para recarga',NULL,'João Silva',NULL,NULL,NULL,'2024-12-20','Concluída',NULL),(2,1,'Comprar extintor novo',NULL,'antero',NULL,NULL,NULL,'2025-12-23','Concluída',NULL),(3,3,'teste',NULL,'eu',NULL,NULL,NULL,'2025-12-23','Concluída',NULL),(4,3,'what','why','who','where','how','1','2025-12-17','Concluída',''),(5,1,'Comprar','Fora de prazo','Eu','Hoje','Na loja','100','2025-12-15','Concluída',''),(7,8,'a','a','a','a','a','a','2025-12-15','Concluída',''),(8,2,'a','aa','a','a','a','a','2025-12-17','Concluída',''),(9,2,'a','a','a','a','a','a','2025-12-18','Concluída','');
/*!40000 ALTER TABLE `acoes_pac` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos`
--

DROP TABLE IF EXISTS `documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `tipo` enum('PDF','DOCX') NOT NULL,
  `seccao` varchar(100) NOT NULL,
  `url_ficheiro` varchar(255) NOT NULL,
  `data_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Pendente','Aprovado','Obsoleto') DEFAULT 'Pendente',
  `versao` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos`
--

LOCK TABLES `documentos` WRITE;
/*!40000 ALTER TABLE `documentos` DISABLE KEYS */;
INSERT INTO `documentos` VALUES (1,'Manual da Qualidade 2024','PDF','Qualidade','/docs/manual_v1.pdf','2025-12-10 12:16:49','Aprovado',1),(15,'Manual de Vendas','PDF','RH','ficheiro_exemplo.pdf','2025-12-11 16:12:47','Obsoleto',1),(16,'Manual de Vendas','PDF','RH','ficheiro_exemplo.pdf','2025-12-11 16:12:53','Obsoleto',2),(17,'Manual da Qualidade 2025','PDF','Qualidade','ficheiro_exemplo.pdf','2025-12-11 16:36:49','Obsoleto',1),(18,'Manual da Qualidade 2025','PDF','Qualidade','ficheiro_exemplo.pdf','2025-12-12 12:35:21','Obsoleto',2),(19,'Manual da Qualidade 2025','PDF','Qualidade','ficheiro_exemplo.pdf','2025-12-16 23:09:48','Obsoleto',3),(20,'Manual de Vendas','PDF','RH','ficheiro_exemplo.pdf','2025-12-17 10:10:07','Aprovado',3),(21,'Manual de Vendas','PDF','RH','ficheiro_exemplo.pdf','2025-12-17 10:10:36','Obsoleto',3),(22,'Manual da Qualidade 2025','PDF','Qualidade','ficheiro_exemplo.pdf','2025-12-17 10:50:29','Aprovado',4);
/*!40000 ALTER TABLE `documentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indicadores`
--

DROP TABLE IF EXISTS `indicadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indicadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `meta` decimal(10,2) NOT NULL,
  `unidade` varchar(20) DEFAULT '%',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indicadores`
--

LOCK TABLES `indicadores` WRITE;
/*!40000 ALTER TABLE `indicadores` DISABLE KEYS */;
INSERT INTO `indicadores` VALUES (1,'Eficácia do Sistema',90.00,'%'),(2,'Satisfação do Cliente',4.50,'Escala 1-5');
/*!40000 ALTER TABLE `indicadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicoes_kpi`
--

DROP TABLE IF EXISTS `medicoes_kpi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicoes_kpi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `indicador_id` int NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `data_medicao` date NOT NULL,
  `data_registo` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `indicador_id` (`indicador_id`),
  CONSTRAINT `medicoes_kpi_ibfk_1` FOREIGN KEY (`indicador_id`) REFERENCES `indicadores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicoes_kpi`
--

LOCK TABLES `medicoes_kpi` WRITE;
/*!40000 ALTER TABLE `medicoes_kpi` DISABLE KEYS */;
INSERT INTO `medicoes_kpi` VALUES (1,1,85.00,'2024-01-01','2025-12-10 16:52:27'),(2,1,88.00,'2024-02-01','2025-12-10 16:52:27'),(3,1,94.00,'2025-12-10','2025-12-10 16:52:27'),(4,1,85.00,'2024-01-01','2025-12-10 16:52:31'),(5,1,88.00,'2024-02-01','2025-12-10 16:52:31'),(6,1,94.00,'2025-12-10','2025-12-10 16:52:31'),(7,2,5.00,'2025-12-11','2025-12-12 12:40:50'),(8,1,85.00,'2025-12-10','2025-12-16 22:37:10'),(9,1,95.00,'2025-12-16','2025-12-16 22:54:04'),(10,1,85.00,'2025-12-15','2025-12-16 22:55:30'),(11,1,96.00,'2025-12-17','2025-12-17 10:48:58');
/*!40000 ALTER TABLE `medicoes_kpi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nao_conformidades`
--

DROP TABLE IF EXISTS `nao_conformidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nao_conformidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descricao` text NOT NULL,
  `setor` varchar(100) NOT NULL,
  `risco` enum('Baixo','Médio','Alto') NOT NULL,
  `status` enum('Aberta','Em Análise','Resolvida','Fechada') DEFAULT 'Aberta',
  `data_registo` datetime DEFAULT CURRENT_TIMESTAMP,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `causa_raiz` text,
  `resultado_eficacia` enum('Eficaz','Não Eficaz') DEFAULT NULL,
  `obs_eficacia` text,
  `registado_por` varchar(50) DEFAULT 'Sistema',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nao_conformidades`
--

LOCK TABLES `nao_conformidades` WRITE;
/*!40000 ALTER TABLE `nao_conformidades` DISABLE KEYS */;
INSERT INTO `nao_conformidades` VALUES (1,'Extintor fora da validade','Segurança','Alto','Fechada','2025-12-10 11:43:38','2025-12-10 11:43:38','2025-12-16 23:13:46','oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo','Eficaz','Eficaz','Sistema'),(2,'Procedimento desatualizado','Logística','Médio','Resolvida','2025-12-10 11:43:38','2025-12-10 11:43:38','2025-12-17 10:53:12','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',NULL,NULL,'Sistema'),(3,'Erro na calibração do sensor','Produção','Médio','Aberta','2025-12-10 11:43:38','2025-12-10 11:43:38','2025-12-15 16:04:00','oooooooooooooooaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','Não Eficaz','O problema voltou a acontecer','Sistema'),(7,'teste','Produção','Baixo','Aberta','2025-12-16 23:46:44','2025-12-16 23:46:44','2025-12-16 23:46:44',NULL,NULL,NULL,'Auditor'),(8,'teste2','Produção','Alto','Resolvida','2025-12-16 23:52:23','2025-12-16 23:52:23','2025-12-16 23:52:43','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',NULL,NULL,'Diretor');
/*!40000 ALTER TABLE `nao_conformidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilizadores`
--

DROP TABLE IF EXISTS `utilizadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilizadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cargo` enum('Diretor','Auditor','Chefe de Secção') NOT NULL,
  `setor` varchar(50) DEFAULT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilizadores`
--

LOCK TABLES `utilizadores` WRITE;
/*!40000 ALTER TABLE `utilizadores` DISABLE KEYS */;
INSERT INTO `utilizadores` VALUES (1,'Ana Silva','ana@empresa.com','Diretor',NULL,'2025-12-15 16:55:50'),(2,'Carlos Auditor','carlos@empresa.com','Auditor',NULL,'2025-12-15 16:55:50'),(3,'João Logística','joao@empresa.com','Chefe de Secção','Logística','2025-12-15 16:55:50');
/*!40000 ALTER TABLE `utilizadores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-17 11:17:11
