-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           8.0.28 - MySQL Community Server - GPL
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.5.0.6677
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
DROP DATABASE IF EXISTS `pge`;
CREATE DATABASE IF NOT EXISTS `pge` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pge`;

-- Copiando estrutura para tabela pge.aluno
DROP TABLE IF EXISTS `aluno`;
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

-- Copiando dados para a tabela pge.aluno: ~20 rows (aproximadamente)
INSERT INTO `aluno` (`email`, `nome`, `ra`, `cpf`, `nasc`, `cod_turma`) VALUES
	('alexandre@gmail.com', 'Alexandre Souza', '23500', '45678901234', '2004-09-15', 'T01'),
	('benjamin@gmail.com', 'Benjamin Almeida', '23501', '78901234567', '2003-01-15', 'T01'),
	('daniel@gmail.com', 'Daniel Rocha', '23502', '67890123456', '2004-09-26', 'T01'),
	('elias@gmail.com', 'Elias Cardoso', '23503', '90123456789', '2003-06-28', 'T01'),
	('flavia@gmail.com', 'Flávia Araújo', '23504', '34567890123', '2004-10-21', 'T01'),
	('frederico@gmail.com', 'Frederico Sousa', '23505', '34567890123', '2004-08-10', 'T02'),
	('fabiano@gmail.com', 'Fabiano Mendes', '23506', '45678901234', '2004-02-20', 'T02'),
	('gabriel@gmail.com', 'Gabriel Cavalcanti', '23507', '56789012345', '2004-09-02', 'T02'),
	('gael@gmail.com', 'Gael Menezes', '23508', '67890123456', '2005-03-13', 'T02'),
	('italo@gmail.com', 'Ítalo Andrade', '23509', '34567890123', '2004-11-28', 'T02'),
	('mauricio@gmail.com', 'Maurício Cunha', '23510', '45678901234', '2004-06-09', 'T03'),
	('murilo@gmail.com', 'Murilo Duarte', '23511', '56789012345', '2005-12-20', 'T03'),
	('micael@gmail.com', 'Micael Figueiredo', '23512', '67890123456', '2006-06-30', 'T03'),
	('alicia@gmail.com', 'Alícia Vieira', '23513', '67890123456', '2004-10-17', 'T03'),
	('barbara@gmail.com', 'Bárbara Xavier', '23514', '78901234567', '2005-04-27', 'T03'),
	('bianca@gmail.com', 'Bianca Coelho', '23515', '89012345678', '2005-11-08', 'T04'),
	('fatima@gmail.com', 'Fátima Carvalho', '23516', '23456789012', '2006-04-10', 'T04'),
	('fernanda@gmail.com', 'Fernanda Ribeiro', '235517', '45678901234', '2003-05-02', 'T04'),
	('manuela@gmail.com', 'Manuela Peixoto', '23518', '89012345678', '2004-10-05', 'T04'),
	('natasha@gmail.com', 'Natasha Cunha', '23519', '34567890123', '2006-05-30', 'T04');

-- Copiando estrutura para tabela pge.disciplina
DROP TABLE IF EXISTS `disciplina`;
CREATE TABLE IF NOT EXISTS `disciplina` (
  `codigo` varchar(10) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `rp_professor` varchar(15) NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `FK_disciplina_professor` (`rp_professor`),
  CONSTRAINT `FK_disciplina_professor` FOREIGN KEY (`rp_professor`) REFERENCES `professor` (`rp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.disciplina: ~11 rows (aproximadamente)
INSERT INTO `disciplina` (`codigo`, `nome`, `rp_professor`) VALUES
	('095', 'Tecnologia ', '23008'),
	('100', 'Artes ', '23010'),
	('253', 'Fisica ', '23005'),
	('327', 'Matemática ', '23001'),
	('340', 'Historia ', '23004'),
	('404', 'Biologia ', '23003'),
	('458', 'Quimica ', '23006'),
	('488', 'Lingua Portuguesa ', '23002'),
	('742', 'Ingles ', '23009'),
	('888', 'Ética', '23256'),
	('978', 'Sociologia ', '23007');

-- Copiando estrutura para tabela pge.frequencia
DROP TABLE IF EXISTS `frequencia`;
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.frequencia: ~21 rows (aproximadamente)
INSERT INTO `frequencia` (`cod_frequencia`, `ra_aluno`, `cod_disciplina`, `data_frequencia`, `presenca`) VALUES
	(12, '23500', '327', '2023-05-08', 1),
	(13, '23501', '327', '2023-05-08', 0),
	(14, '23502', '327', '2023-05-08', 1),
	(15, '23503', '327', '2023-05-08', 1),
	(16, '23504', '327', '2023-05-08', 1),
	(17, '23505', '458', '2023-05-09', 1),
	(18, '23506', '458', '2023-05-09', 0),
	(19, '23507', '458', '2023-05-09', 0),
	(20, '23508', '458', '2023-05-09', 1),
	(21, '23509', '458', '2023-05-09', 1),
	(22, '23510', '340', '2023-05-10', 1),
	(23, '23511', '340', '2023-05-10', 1),
	(24, '23512', '340', '2023-05-10', 1),
	(25, '23513', '340', '2023-05-10', 1),
	(26, '23514', '340', '2023-05-10', 1),
	(27, '23515', '404', '2023-05-11', 0),
	(28, '23516', '404', '2023-05-11', 1),
	(29, '23517', '404', '2023-05-11', 1),
	(30, '23518', '404', '2023-05-11', 0),
	(31, '23519', '404', '2023-05-11', 1),
	(32, '23500', '327', '2023-05-20', 1);

-- Copiando estrutura para tabela pge.horario
DROP TABLE IF EXISTS `horario`;
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

-- Copiando dados para a tabela pge.horario: ~40 rows (aproximadamente)
INSERT INTO `horario` (`cod_turma`, `cod_disciplina`, `hora`, `dia_semana`) VALUES
	('T01', '327', '07:00 - 10:00', 'Segunda-Feira'),
	('T01', '458', '10:20-12:00', 'Segunda-Feira'),
	('T01', '340', '07:00 - 10:00 ', 'Terca-Feira'),
	('T01', '440', '10:20-12:00', 'Terca-Feira'),
	('T01', '488', '7:00 - 8:00', 'Quarta-Feira'),
	('T01', '253', '10:20-12:00', 'Quarta-Feira'),
	('T01', '978', '07:00 - 10:00', 'Quinta-Feira'),
	('T01', '095', '10:20-12:00', 'Quinta-Feira'),
	('T01', '742', '07:00 - 10:00', 'Sexta-Feira'),
	('T01', '100', '10:20-12:00', 'Sexta-Feira'),
	('T02', '100', '07:00 - 10:00', 'Segunda-Feira'),
	('T02', '742', '10:20-12:00', 'Segunda-Feira'),
	('T02', '095', '07:00 - 10:00 ', 'Terça-Feira'),
	('T02', '978', '10:20-12:00', 'Terça-Feira'),
	('T02', '253', '07:00 - 10:00', 'Quarta-Feira'),
	('T02', '488', '10:20-12:00', 'Quarta-Feira'),
	('T02', '440', '07:00 - 10:00', 'Quinta-Feira'),
	('T02', '340', '10:20-12:00', 'Quinta-Feira'),
	('T02', '458', '07:00 - 10:00', 'Sexta-Feira'),
	('T02', '327', '10:20-12:00', 'Sexta-Feira'),
	('T03', '340', '07:00 - 10:00', 'Segunda-Feira'),
	('T03', '100', '10:20-12:00', 'Segunda-Feira'),
	('T03', '742', '07:00 - 10:00', 'Terça-Feira'),
	('T03', '095', '10:20-12:00', 'Terça-Feira'),
	('T03', '978', '07:00 - 10:00', 'Quarta-Feira'),
	('T03', '253', '10:20-12:00', 'Quarta-Feira'),
	('T03', '488', '07:00 - 10:00', 'Quinta-Feira'),
	('T03', '440', '10:20-12:00', 'Quinta-Feira'),
	('T03', '327', '07:00 - 10:00', 'Sexta-Feira'),
	('T03', '458', '10:20-12:00', 'Sexta-Feira'),
	('T04', '340', '07:00 - 10:00', 'Segunda-Feira'),
	('T04', '100', '10:20-12:00', 'Segunda-Feira'),
	('T04', '742', '07:00 - 10:00', 'Terça-Feira'),
	('T04', '095', '10:20-12:00', 'Terça-Feira'),
	('T04', '978', '07:00 - 10:00', 'Quarta-Feira'),
	('T04', '253', '10:20-12:00', 'Quarta-Feira'),
	('T04', '488', '07:00 - 10:00', 'Quinta-Feira'),
	('T04', '440', '10:20-12:00', 'Quinta-Feira'),
	('T04', '327', '07:00 - 10:00', 'Sexta-Feira'),
	('T04', '458', '10:20-12:00', 'Sexta-Feira');

-- Copiando estrutura para tabela pge.login
DROP TABLE IF EXISTS `login`;
CREATE TABLE IF NOT EXISTS `login` (
  `usuario` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `senha` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tipo_usuario` varchar(30) NOT NULL DEFAULT 'aluno',
  `foto` varchar(255) NOT NULL DEFAULT '../../../images/user.png',
  PRIMARY KEY (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Copiando dados para a tabela pge.login: ~32 rows (aproximadamente)
INSERT INTO `login` (`usuario`, `senha`, `tipo_usuario`, `foto`) VALUES
	('23001', '1234', 'professor', '../../../images/user.png'),
	('23002', '12345678910', 'professor', '../../../images/user.png'),
	('23003', '98765432101', 'professor', '../../../images/user.png'),
	('23004', '45968231796', 'professor', '../../../images/user.png'),
	('23005', '19546703529', 'professor', '../../../images/user.png'),
	('23006', '64853197560', 'professor', '../../../images/user.png'),
	('23007', '35497681568', 'professor', '../../../images/user.png'),
	('23008', '84756130295', 'professor', '../../../images/user.png'),
	('23009', '45681349760', 'professor', '../../../images/user.png'),
	('23010', '21564987306', 'professor', '../../../images/user.png'),
	('23256', '1234', 'professor', '../../../images/user.png'),
	('23500', '1234', 'aluno', '../../../images/user.png'),
	('23501', '78901234567', 'aluno', '../../../images/user.png'),
	('23502', '67890123456', 'aluno', '../../../images/user.png'),
	('23503', '90123456789', 'aluno', '../../../images/user.png'),
	('23504', '34567890123', 'aluno', '../../../images/user.png'),
	('23505', '34567890123', 'aluno', '../../../images/user.png'),
	('23506', '45678901234', 'aluno', '../../../images/user.png'),
	('23507', '56789012345', 'aluno', '../../../images/user.png'),
	('23508', '67890123456', 'aluno', '../../../images/user.png'),
	('23509', '34567890123', 'aluno', '../../../images/user.png'),
	('23510', '45678901234', 'aluno', '../../../images/user.png'),
	('23511', '56789012345', 'aluno', '../../../images/user.png'),
	('23512', '67890123456', 'aluno', '../../../images/user.png'),
	('23513', '67890123456', 'aluno', '../../../images/user.png'),
	('23514', '78901234567', 'aluno', '../../../images/user.png'),
	('23515', '89012345678', 'aluno', '../../../images/user.png'),
	('23516', '23456789012', 'aluno', '../../../images/user.png'),
	('23517', '45678901234', 'aluno', '../../../images/user.png'),
	('23518', '89012345678', 'aluno', '../../../images/user.png'),
	('23519', '34567890123', 'aluno', '../../../images/user.png'),
	('admin', 'admin', 'admin', '../../../images/admin.png');

-- Copiando estrutura para tabela pge.nota
DROP TABLE IF EXISTS `nota`;
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.nota: ~2 rows (aproximadamente)
INSERT INTO `nota` (`cod_nota`, `cod_disciplina`, `p1`, `p2`, `t`, `media`, `ra_aluno`) VALUES
	(1, '100', 10, 10, 10, 10, '23500'),
	(29, '327', 10, 10, 10, 10, '23500');

-- Copiando estrutura para tabela pge.professor
DROP TABLE IF EXISTS `professor`;
CREATE TABLE IF NOT EXISTS `professor` (
  `rp` varchar(15) NOT NULL,
  `nome` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cpf` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nasc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`rp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.professor: ~11 rows (aproximadamente)
INSERT INTO `professor` (`rp`, `nome`, `cpf`, `email`, `nasc`) VALUES
	('23001', 'Alberto Santos', '46949219083', 'alberto@gmail.com.br', '1979-05-04'),
	('23002', 'Maria Silva', '12345678910', 'maria@gmail.com', '1985-10-15'),
	('23003', 'João Pereira', '98765432101', 'joao@gmail.com', '1990-03-22'),
	('23004', 'Ana Oliveira', '45968231796', 'ana@gmail.com', '1988-07-01'),
	('23005', 'Pedro Santos', '19546703529', 'pedro@gmail.com', '1982-12-09'),
	('23006', 'Sandra Souza', '64853197560', 'sandra@gmail.com', '1976-06-18'),
	('23007', 'Lucas Ferreira', '35497681568', 'lucas@gmail.com', '1995-04-27'),
	('23008', 'Carolina Lima', '84756130295', 'carolina@gmail.com', '1998-09-12'),
	('23009', 'Rafaela Costa', '45681349760', 'rafaela@gmail.com', '1987-02-28'),
	('23010', 'Fernando Almeida', '21564987306', 'fernando@gmail.com', '1980-11-07'),
	('23256', 'Ziraldo Silva', '123456789', 'Ziraldo@fatec.edu.br', '1992-02-02');

-- Copiando estrutura para tabela pge.turma
DROP TABLE IF EXISTS `turma`;
CREATE TABLE IF NOT EXISTS `turma` (
  `codigo` varchar(10) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `sala` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela pge.turma: ~4 rows (aproximadamente)
INSERT INTO `turma` (`codigo`, `nome`, `sala`) VALUES
	('T01', 'Turma A', 1),
	('T02', 'Turma B', 2),
	('T03', 'Turma C', 3),
	('T04', 'Turma D', 4);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
