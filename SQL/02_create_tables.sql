-- Switch to the database
USE goldfren_data;

-- Table structure for table 'c_sortiment'
CREATE TABLE IF NOT EXISTS `c_sortiment` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod sortimentu',
  `nazev` varchar(255) NOT NULL COMMENT 'Nazev sortimentu',
  `image_categories` varchar(255) NOT NULL COMMENT 'Kategorie obrazku',
  `publikovat` tinyint DEFAULT '1' COMMENT 'Zda se ma sortiment publikovat na webu',
  PRIMARY KEY (`kod`)
) COMMENT='Ciselnik nazvu sortimentu';

-- Table structure for table 'c_kategorie'
CREATE TABLE IF NOT EXISTS `c_kategorie` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod kategorie',
  `ikona` varchar(255) DEFAULT NULL COMMENT 'Ikona kategorie zobrazovana na webu',
  `nazev` varchar(255) DEFAULT NULL COMMENT 'Nazev kategorie',
  `nazev_eng` varchar(255) DEFAULT NULL COMMENT 'Nazev kategorie v anglictine',
  PRIMARY KEY (`kod`)
) COMMENT='Ciselnik nazvu kategorii';

-- Table structure for table 'd_adapter'
CREATE TABLE IF NOT EXISTS `d_adapter` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod adapteru',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `obrazek` varchar(255) DEFAULT NULL COMMENT 'Obrázek adapteru',
  `vektor` varchar(255) DEFAULT NULL COMMENT 'Vektor adapteru',
  `cislo_dilu` varchar(255) DEFAULT NULL COMMENT 'Cislo dilu',
  `typ` int DEFAULT NULL COMMENT 'Typ adapteru',
  `prumer` decimal(5,2) DEFAULT NULL COMMENT 'Prumer adapteru',
  `popis` varchar(255) DEFAULT NULL COMMENT 'Popis adapteru',
  `poznamka` varchar(255) DEFAULT NULL COMMENT 'Poznamka k adapteru',
  `publikovat` tinyint DEFAULT NULL COMMENT 'Zda se ma adapter publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` varchar(10) DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  CONSTRAINT `FK_ADAPT_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`),
  CONSTRAINT `FK_ADAPT_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`)
) COMMENT='Tabulka adapteru';

-- Table structure for table 'd_brzdice'
CREATE TABLE IF NOT EXISTS `d_brzdice` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod brzdice',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `obrazek` varchar(255) DEFAULT NULL COMMENT 'Obrazek brzdice',
  `vektor` varchar(255) DEFAULT NULL COMMENT 'Vektor brzdice',
  `cislo_dilu` varchar(255) DEFAULT NULL COMMENT 'Cislo dilu brzdice',
  `popis` varchar(255) DEFAULT NULL COMMENT 'Popis brzdice',
  `typ_uchyceni` varchar(10) DEFAULT NULL COMMENT 'Typ uchyceni brzdice',
  `poznamka` text COMMENT 'Poznamka k brzdicu',
  `publikovat` tinyint DEFAULT NULL COMMENT 'Zda se ma adapter publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  CONSTRAINT `FK_BRZD_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`),
  CONSTRAINT `FK_BRZD_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`)
) COMMENT='Tabulka brzdicu';

-- Tabel structure for table 'd_desticka'
CREATE TABLE IF NOT EXISTS `d_desticka` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod desticky',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `obrazek` varchar(255) DEFAULT NULL COMMENT 'Obrazek desticky',
  `vektor` varchar(255) COMMENT 'Vektor desticky',
  `cislo_dilu` varchar(255) DEFAULT NULL COMMENT 'Cislo dilu desticky',
  `typ` int DEFAULT NULL COMMENT 'Typ desticky',
  `plech_a_material` varchar(255) DEFAULT NULL COMMENT 'Material plechu A',
  `plech_a_tloustka` decimal(5,2) DEFAULT NULL COMMENT 'Tloustka plechu A',
  `plech_a_matrice` varchar(255) DEFAULT NULL COMMENT 'Matrice plechu A',
  `plech_b_material` varchar(255) DEFAULT NULL COMMENT 'Material plechu B',
  `plech_b_tloustka` decimal(5,2) DEFAULT NULL COMMENT 'Tloustka plechu B',
  `plech_b_matrice` varchar(255) DEFAULT NULL COMMENT 'Matrice plechu A',
  `izolator_a_material` varchar(255) DEFAULT NULL COMMENT 'Izolator materialu A',
  `izolator_a_tloustka` decimal(5,2) DEFAULT NULL COMMENT 'Tloustka izolatoru A',
  `izolator_a_matrice` varchar(255) DEFAULT NULL COMMENT 'Matrice izolatoru A',
  `izolator_b_material` varchar(255) DEFAULT NULL COMMENT 'Izolator materialu B',
  `izolator_b_tloustka` decimal(5,2) DEFAULT NULL COMMENT 'Tloustka izolatoru B',
  `izolator_b_matrice` varchar(255) DEFAULT NULL COMMENT 'Matrice izolatoru B',
  `segment_a_material` varchar(255) DEFAULT NULL COMMENT 'Material segmentu A',
  `segment_a_tloustka` decimal(5,2) DEFAULT NULL COMMENT 'Tloustka segmentu A',
  `segment_a_matrice` varchar(255) DEFAULT NULL COMMENT 'Matrice segmentu A',
  `segment_b_material` varchar(255) DEFAULT NULL COMMENT 'Material segmentu B',
  `segment_b_tloustka` decimal(5,2) DEFAULT NULL COMMENT 'Tloustka segmentu B',
  `segment_b_matrice` varchar(255) DEFAULT NULL COMMENT 'Matrice segmentu B',
  `konkurence_sbs` varchar(255) DEFAULT NULL COMMENT 'SBS konkurence',
  `konkurence_ebc` varchar(255) DEFAULT NULL COMMENT 'EBC konkurence',
  `konkurence_ferodo` varchar(255) DEFAULT NULL COMMENT 'FERODO konkurence',
  `konkurence_a2z` varchar(255) DEFAULT NULL COMMENT 'A2Z konkurence',
  `konkurence_rapco` varchar(255) DEFAULT NULL COMMENT 'RAPCO konkurence',
  `konkurence_grove` varchar(255) DEFAULT NULL COMMENT 'GROVE konkurence',
  `konkurence_cleveland` varchar(255) DEFAULT NULL COMMENT 'CLEVELAND konkurence',
  `konkurence_matco` varchar(255) DEFAULT NULL COMMENT 'MATCO konkurence',
  `material` varchar(255) DEFAULT NULL COMMENT 'Material',
  `poznamka` text DEFAULT NULL COMMENT 'Poznamka pro desticku',
  `oem_cisla` text DEFAULT NULL COMMENT 'OEM cislo desticky',
  `obchodni_nazev` varchar(255) DEFAULT NULL COMMENT 'Obchodni nazev desticky',
  `publikovat` tinyint DEFAULT NULL COMMENT 'Zda se ma adapter publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  CONSTRAINT `FK_DEST_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`),
  CONSTRAINT `FK_DEST_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`)
) COMMENT='Tabulka desticek';

-- Table structure for table 'c_desticka_cast'
CREATE TABLE IF NOT EXISTS `c_desticka_cast` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod casti desticky',
  `nazev` varchar(255) DEFAULT NULL COMMENT 'Nazev casti desticky',
  PRIMARY KEY (`kod`)
) COMMENT='Tabulka casti desticek';

-- Table structure for table 'c_desticka_typ'
CREATE TABLE IF NOT EXISTS `c_desticka_typ` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod typu desticky',
  `nazev` varchar(255) NOT NULL COMMENT 'Nazev typu desticky',
  PRIMARY KEY (`kod`)
) COMMENT='Tabulka typu desticek';

-- Table structure for table 'd_kotouce'
CREATE TABLE IF NOT EXISTS `d_kotouce` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod kotouce',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `obrazek` varchar(255) DEFAULT NULL COMMENT 'Obrazek kotouce',
  `vektor` varchar(255) DEFAULT NULL COMMENT 'Vektor kotouce',
  `cislo_dilu` varchar(255) DEFAULT NULL COMMENT 'Cislo dilu kotouce',
  `typ` smallint DEFAULT NULL COMMENT 'Typ kotouce',
  `konkurence_braking` varchar(255) DEFAULT NULL COMMENT 'Konkurence Braking',
  `konkurence_ngbrakes` varchar(255) DEFAULT NULL COMMENT 'Konkurence NGBrakes',
  `od` decimal(5,2) DEFAULT NULL COMMENT 'OD',
  `hd` decimal(5,2) DEFAULT NULL COMMENT 'HD',
  `id` decimal(5,2) DEFAULT NULL COMMENT 'ID',
  `thk` decimal(5,2) DEFAULT NULL COMMENT 'THK',
  `poznamka` text DEFAULT NULL COMMENT 'Poznamka ke kotouci',
  `publikovat` tinyint DEFAULT NULL COMMENT 'Zda se ma adapter publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  UNIQUE KEY `cislo_dilu` (`cislo_dilu`),
  CONSTRAINT `FK_KOTC_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`)
) COMMENT='Tabulka kotoucu';

-- Table structure for table 'c_kotouc_typ'
CREATE TABLE IF NOT EXISTS `c_kotouc_typ` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod typu kotouce',
  `nazev` varchar(255) NOT NULL COMMENT 'Nazev typu kotouce',
  PRIMARY KEY (`kod`)
) COMMENT='Tabulka typu kotoucu';

-- Creates a config table that will track which columns should be visiabled for specific sortiment
CREATE TABLE IF NOT EXISTS `c_view_config` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod zaznamu',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `attribut` varchar(255) NOT NULL COMMENT 'Nazev atributu',
  `publikovat` tinyint DEFAULT 0 COMMENT 'Zda se ma attribut publikovat na webu a API',
  `vytvoreno` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Cas vytvoreni',
  `vytvoril` int DEFAULT NULL COMMENT 'Kdo vytvoril zaznam',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  CONSTRAINT `FK_CONFIG_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`)
) COMMENT='Tabulka nastaveni zobrazeni attributu na webu a API pro jednotlivy sortiment';

-- Creates table for attachment info about adapters
CREATE TABLE IF NOT EXISTS `d_adapter_attachment` (
  `adapter_kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod zaznamu',
  `typ_uchyceni` VARCHAR(10) NOT NULL COMMENT 'Typ uchyceni adapteru',
  `roztec_brzdic` decimal(5,2) DEFAULT NULL COMMENT 'Roztec pro brzdic',
  PRIMARY KEY (`adapter_kod`),
  CONSTRAINT `FK_ADAPT_kod` FOREIGN KEY (`adapter_kod`) REFERENCES `d_adapter` (`kod`)
) COMMENT='Tabulka nastaveni zobrazeni attributu na webu a API pro jednotlivy sortiment';

-- Creates table for prislusenstvi
CREATE TABLE `d_prislusenstvi` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod prislusenstvi',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `obrazek` varchar(255) DEFAULT NULL COMMENT 'Obrazek prislusenstvi',
  `vektor` varchar(255) DEFAULT NULL COMMENT 'Vektor prislusenstvi',
  `cislo_dilu` varchar(255) DEFAULT NULL COMMENT 'Cislo dilu prislusenstvi',
  `typ` varchar(255) DEFAULT NULL COMMENT 'Typ prislusenstvi',
  `popis` varchar(255) DEFAULT NULL COMMENT 'Popis prislusenstvi',
  `poznamka` text DEFAULT NULL COMMENT 'Poznamka k prislusenstvi',
  `publikovat` tinyint DEFAULT NULL COMMENT 'Zda se ma prislusenstvi publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` tinyint DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  CONSTRAINT `FK_PRIS_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`),
  CONSTRAINT `FK_PRIS_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`)
) COMMENT 'Tabulka prislusenstvi';

-- Creates table for pumpy
CREATE TABLE `d_pumpa` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod pumpy',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `obrazek` varchar(255) DEFAULT NULL COMMENT 'Obrazek pumpy',
  `vektor` varchar(255) DEFAULT NULL COMMENT 'Vektor pumpy',
  `cislo_dilu` varchar(255) DEFAULT NULL COMMENT 'Cislo dilu pumpy',
  `prumer` decimal(5,2) DEFAULT NULL COMMENT 'Prumer pumpy',
  `popis` varchar(255) DEFAULT NULL COMMENT 'Popis pumpy',
  `poznamka` text DEFAULT NULL COMMENT 'Poznamka k pumpe',
  `publikovat` tinyint DEFAULT NULL COMMENT 'Zda se ma pumpa publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` tinyint DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  CONSTRAINT `FK_PUMP_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`),
  CONSTRAINT `FK_PUMP_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`)
) COMMENT 'Tabulka brzdových pump';