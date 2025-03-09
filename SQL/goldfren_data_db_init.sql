-- Creates the database and the table for the Goldfren data
CREATE DATABASE IF NOT EXISTS goldfren_data;

-- Switch to the database
USE goldfren_data;

-- Table structure for table 'sortiment'
CREATE TABLE IF NOT EXISTS `c_sortiment` (
  `Kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod sortimentu',
  `Nazev` varchar(255) NOT NULL COMMENT 'Nazev sortimentu',
  `Nazev_ENG` varchar(255) NOT NULL COMMENT 'Nazev sortimentu v anglictine',
  PRIMARY KEY (`Kod`)
) COMMENT='Ciselnik nazvu sortimentu';

-- Table data for table 'sortiment'
TRUNCATE c_sortiment;
INSERT INTO c_sortiment (Kod, Nazev, Nazev_ENG) VALUES
	 (1,'destička','pad'),
	 (2,'kotouč','disc'),
	 (3,'brzdový třmen','brake caliper'),
	 (4,'hadička','hose'),
	 (5,'příslušenství','accessory'),
	 (6,'adaptér','adapter'),
	 (7,'pumpa','pump');