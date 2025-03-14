-- Creates the database and the table for the Goldfren data
CREATE DATABASE IF NOT EXISTS goldfren_data;

-- Switch to the database
USE goldfren_data;

-- Table structure for table 'c_sortiment'
CREATE TABLE IF NOT EXISTS `c_sortiment` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod sortimentu',
  `nazev` varchar(255) NOT NULL COMMENT 'Nazev sortimentu',
  `nazev_eng` varchar(255) NOT NULL COMMENT 'Nazev sortimentu v anglictine',
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

-- View structure for view 'v_adapter_detail'
CREATE OR REPLACE VIEW v_adapter_detail AS
SELECT a.kod, s.nazev as sortiment, k.nazev as kategorie, a.obrazek, a.vektor, a.cislo_dilu, a.typ, a.prumer, a.popis, a.poznamka, a.publikovat, a.aktualizovano, a.aktualizoval 
FROM d_adapter a 
LEFT JOIN c_sortiment s on s.kod = a.sortiment
LEFT JOIN c_kategorie k on k.kod = a.kategorie
  WHERE a.publikovat = 1;

-- Table structure for table 'd_brzdice'
CREATE TABLE IF NOT EXISTS `d_brzdice` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod brzdice',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `obrazek` varchar(255) DEFAULT NULL COMMENT 'Obrazek brzdice',
  `vektor` varchar(255) DEFAULT NULL COMMENT 'Vektor brzdice',
  `cislo_dilu` varchar(255) DEFAULT NULL COMMENT 'Cislo dilu brzdice',
  `popis` varchar(255) DEFAULT NULL COMMENT 'Popis brzdice',
  `poznamka` text COMMENT 'Poznamka k brzdicu',
  `publikovat` tinyint DEFAULT NULL COMMENT 'Zda se ma adapter publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  CONSTRAINT `FK_BRZD_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`),
  CONSTRAINT `FK_BRZD_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`)
) COMMENT='Tabulka brzdicu';

-- View structure for view 'v_brzdice_detail'
CREATE OR REPLACE VIEW v_brzdice_detail AS
SELECT b.kod, s.nazev as sortiment, k.nazev as kategorie, b.obrazek, b.vektor, b.cislo_dilu, b.popis, b.poznamka, b.publikovat, b.aktualizovano, b.aktualizoval
FROM d_brzdice b
LEFT JOIN c_sortiment s on s.kod = b.sortiment
LEFT JOIN c_kategorie k on k.kod = b.kategorie;

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

-- View structure for view 'v_desticka_detail'
CREATE OR REPLACE VIEW v_desticka_detail AS
SELECT d.kod, s.nazev as sortiment, k.nazev as kategorie, d.obrazek, d.vektor, d.cislo_dilu, d.typ, d.plech_a_material, d.plech_a_tloustka, d.plech_a_matrice, d.plech_b_material, 
d.plech_b_tloustka, d.plech_b_matrice, d.izolator_a_material, d.izolator_a_tloustka, d.izolator_a_matrice, d.izolator_b_material, d.izolator_b_tloustka, 
d.izolator_b_matrice, d.segment_a_material, d.segment_a_tloustka, d.segment_a_matrice, d.segment_b_material, d.segment_b_tloustka, d.segment_b_matrice, 
d.konkurence_sbs, d.konkurence_ebc, d.konkurence_ferodo, d.konkurence_a2z, d.konkurence_rapco, d.konkurence_grove, d.konkurence_cleveland, d.konkurence_matco, 
d.material, d.poznamka, d.oem_cisla, d.obchodni_nazev, d.publikovat, d.aktualizovano, d.aktualizoval
FROM d_desticka d
LEFT JOIN c_sortiment s on s.kod = d.sortiment
LEFT JOIN c_kategorie k on k.kod = d.kategorie;