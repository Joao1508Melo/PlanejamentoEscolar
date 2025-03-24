-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           8.0.28 - MySQL Community Server - GPL
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.2.0.6576
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para pge
CREATE DATABASE IF NOT EXISTS `pge` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pge`;

-- Copiando estrutura para tabela pge.aluno
CREATE TABLE IF NOT EXISTS `aluno` (
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nome` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ra` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cpf` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nasc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cod_turma` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  KEY `ra` (`ra`),
  KEY `FK_aluno_turma` (`cod_turma`),
  CONSTRAINT `FK_aluno_turma` FOREIGN KEY (`cod_turma`) REFERENCES `turma` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.aluno: ~2 rows (aproximadamente)
INSERT INTO `aluno` (`email`, `nome`, `ra`, `cpf`, `nasc`, `cod_turma`) VALUES
	('2@2', '2', '2', '2', '2222-02-22', '1'),
	('3@3', '3', '3', '3', '3333-03-31', '1');

-- Copiando estrutura para tabela pge.disciplina
CREATE TABLE IF NOT EXISTS `disciplina` (
  `codigo` varchar(10) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `rp_professor` varchar(15) NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `FK_disciplina_professor` (`rp_professor`),
  CONSTRAINT `FK_disciplina_professor` FOREIGN KEY (`rp_professor`) REFERENCES `professor` (`rp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.disciplina: ~1 rows (aproximadamente)
INSERT INTO `disciplina` (`codigo`, `nome`, `rp_professor`) VALUES
	('1', '1', '1');

-- Copiando estrutura para tabela pge.frequencia
CREATE TABLE IF NOT EXISTS `frequencia` (
  `cod_frequencia` int NOT NULL AUTO_INCREMENT,
  `ra_aluno` varchar(15) NOT NULL,
  `cod_disciplina` varchar(10) NOT NULL,
  `data_frequencia` varchar(20) DEFAULT NULL,
  `presenca` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`cod_frequencia`),
  KEY `FK_frequencia_aluno` (`ra_aluno`),
  KEY `FK_frequencia_disciplina` (`cod_disciplina`),
  CONSTRAINT `FK_frequencia_aluno` FOREIGN KEY (`ra_aluno`) REFERENCES `aluno` (`ra`),
  CONSTRAINT `FK_frequencia_disciplina` FOREIGN KEY (`cod_disciplina`) REFERENCES `disciplina` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.frequencia: ~0 rows (aproximadamente)
INSERT INTO `frequencia` (`cod_frequencia`, `ra_aluno`, `cod_disciplina`, `data_frequencia`, `presenca`) VALUES
	(4, '2', '1', '1111-11-11', 0);

-- Copiando estrutura para tabela pge.horario
CREATE TABLE IF NOT EXISTS `horario` (
  `cod_turma` varchar(10) NOT NULL,
  `cod_disciplina` varchar(10) NOT NULL,
  `hora` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '00:00',
  `dia_semana` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Segunda-Feira',
  KEY `FK_horario_turma` (`cod_turma`),
  KEY `FK_horario_disciplina` (`cod_disciplina`),
  CONSTRAINT `FK_horario_disciplina` FOREIGN KEY (`cod_disciplina`) REFERENCES `disciplina` (`codigo`),
  CONSTRAINT `FK_horario_turma` FOREIGN KEY (`cod_turma`) REFERENCES `turma` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.horario: ~0 rows (aproximadamente)
INSERT INTO `horario` (`cod_turma`, `cod_disciplina`, `hora`, `dia_semana`) VALUES
	('1', '1', '13:00', 'Segunda-Feira'),
	('1', '1', '14:00', 'Quinta-Feira'),
	('1', '1', '13:00', 'Quinta-Feira'),
	('1', '1', '12:00', 'Terça-Feira'),
	('1', '1', '17:00', 'Sexta-Feira'),
	('1', '1', '16:00', 'Quarta-Feira'),
	('1', '1', '14:15', 'Segunda-Feira');

-- Copiando estrutura para tabela pge.login
CREATE TABLE IF NOT EXISTS `login` (
  `usuario` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `senha` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tipo_usuario` varchar(30) NOT NULL DEFAULT 'aluno',
  `foto` varchar(255) NOT NULL DEFAULT '../../../images/user.png',
  PRIMARY KEY (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela pge.login: ~4 rows (aproximadamente)
INSERT INTO `login` (`usuario`, `senha`, `tipo_usuario`, `foto`) VALUES
	('1', '1', 'professor', '../../../images/user.png'),
	('2', '2', 'aluno', '../../../images/user.png'),
	('3', '3', 'aluno', '../../../images/user.png'),
	('admin', 'admin', 'admin', '../../../images/admin.png');

-- Copiando estrutura para tabela pge.nota
CREATE TABLE IF NOT EXISTS `nota` (
  `cod_nota` int NOT NULL AUTO_INCREMENT,
  `cod_disciplina` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `p1` double NOT NULL,
  `p2` double NOT NULL,
  `t` double NOT NULL,
  `media` double NOT NULL,
  `ra_aluno` varchar(15) NOT NULL,
  PRIMARY KEY (`cod_nota`) USING BTREE,
  KEY `FK_nota_aluno` (`ra_aluno`),
  KEY `FK_nota_disciplina` (`cod_disciplina`),
  CONSTRAINT `FK_nota_aluno` FOREIGN KEY (`ra_aluno`) REFERENCES `aluno` (`ra`),
  CONSTRAINT `FK_nota_disciplina` FOREIGN KEY (`cod_disciplina`) REFERENCES `disciplina` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.nota: ~0 rows (aproximadamente)
INSERT INTO `nota` (`cod_nota`, `cod_disciplina`, `p1`, `p2`, `t`, `media`, `ra_aluno`) VALUES
	(4, '1', 10, 10, 10, 10, '2');

-- Copiando estrutura para tabela pge.professor
CREATE TABLE IF NOT EXISTS `professor` (
  `rp` varchar(15) NOT NULL,
  `nome` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cpf` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nasc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`rp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.professor: ~1 rows (aproximadamente)
INSERT INTO `professor` (`rp`, `nome`, `cpf`, `email`, `nasc`) VALUES
	('1', '1', '1', '1@1.com', '1111-11-11');

-- Copiando estrutura para tabela pge.turma
CREATE TABLE IF NOT EXISTS `turma` (
  `codigo` varchar(10) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `sala` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.turma: ~1 rows (aproximadamente)
INSERT INTO `turma` (`codigo`, `nome`, `sala`) VALUES
	('1', '1', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
