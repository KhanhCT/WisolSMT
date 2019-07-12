-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.6.41 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for smt
DROP DATABASE IF EXISTS `smt`;
CREATE DATABASE IF NOT EXISTS `smt` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `smt`;

-- Dumping structure for table smt.account
DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `disabled` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table smt.factory
DROP TABLE IF EXISTS `factory`;
CREATE TABLE IF NOT EXISTS `factory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `disabled` varchar(255) DEFAULT NULL,
  `factory_code` varchar(50) NOT NULL,
  `factory_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table smt.product
DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barcode` varchar(50) DEFAULT NULL,
  `product_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table smt.productdtl
DROP TABLE IF EXISTS `productdtl`;
CREATE TABLE IF NOT EXISTS `productdtl` (
  `WorkingDate` varchar(15) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `exported_qty` int(11) NOT NULL,
  `remain_qty` int(11) NOT NULL,
  PRIMARY KEY (`WorkingDate`,`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table smt.productiondtl
DROP TABLE IF EXISTS `productiondtl`;
CREATE TABLE IF NOT EXISTS `productiondtl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkingDate` varchar(15) NOT NULL COMMENT 'Date format MM/DD/YYYY',
  `FactoryID` int(11) NOT NULL,
  `ShiftID` int(11) NOT NULL,
  `LineID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Amount` int(11) NOT NULL,
  `StartTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `StopTime` timestamp NULL DEFAULT NULL,
  `Message` varchar(40) DEFAULT NULL,
  `Finished` bit(1) NOT NULL,
  PRIMARY KEY (`WorkingDate`,`id`,`FactoryID`,`ShiftID`,`LineID`,`ProductID`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table smt.productionline
DROP TABLE IF EXISTS `productionline`;
CREATE TABLE IF NOT EXISTS `productionline` (
  `LineID` int(11) NOT NULL AUTO_INCREMENT,
  `FactoryID` int(11) NOT NULL,
  `LineCode` varchar(50) NOT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `Disabled` bit(1) DEFAULT NULL,
  PRIMARY KEY (`FactoryID`,`LineID`),
  KEY `LineID` (`LineID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table smt.productionplan
DROP TABLE IF EXISTS `productionplan`;
CREATE TABLE IF NOT EXISTS `productionplan` (
  `WorkingDate` varchar(15) NOT NULL COMMENT 'Date format MM/DD/YYYY',
  `FactoryID` int(11) NOT NULL,
  `LineID` int(11) NOT NULL,
  `ShiftID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `OrderedQty` int(11) DEFAULT NULL,
  `GoodProdQty` int(11) DEFAULT NULL,
  `RemainQty` int(11) DEFAULT NULL,
  `Disabled` bit(1) DEFAULT NULL,
  PRIMARY KEY (`WorkingDate`,`FactoryID`,`LineID`,`ShiftID`,`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table smt.shift
DROP TABLE IF EXISTS `shift`;
CREATE TABLE IF NOT EXISTS `shift` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
