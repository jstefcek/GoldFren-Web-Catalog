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
  `publikovat` int DEFAULT NULL COMMENT 'Zda se ma adapter publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
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
  `pocet_pistku` int DEFAULT NULL COMMENT 'Pocet pistku brzdice',
  `poznamka` text COMMENT 'Poznamka k brzdicu',
  `publikovat` int DEFAULT NULL COMMENT 'Zda se ma adapter publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  CONSTRAINT `FK_BRZD_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`),
  CONSTRAINT `FK_BRZD_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`)
) COMMENT='Tabulka brzdicu';

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
  `publikovat` int DEFAULT NULL COMMENT 'Zda se ma adapter publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  KEY `FK_DEST_sortiment` (`sortiment`),
  KEY `FK_DEST_kategorie` (`kategorie`),
  KEY `FK_DEST_typ` (`typ`),
  CONSTRAINT `FK_DEST_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`),
  CONSTRAINT `FK_DEST_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`),
  CONSTRAINT `FK_DEST_typ` FOREIGN KEY (`typ`) REFERENCES `c_desticka_typ` (`kod`)
) COMMENT='Tabulka desticek';

-- Table structure for table 'c_kotouc_typ'
CREATE TABLE IF NOT EXISTS `c_kotouc_typ` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod typu kotouce',
  `nazev` varchar(255) NOT NULL COMMENT 'Nazev typu kotouce',
  PRIMARY KEY (`kod`)
) COMMENT='Tabulka typu kotoucu';

-- Table structure for table 'd_kotouce'
CREATE TABLE IF NOT EXISTS `d_kotouce` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod kotouce',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `obrazek` varchar(255) DEFAULT NULL COMMENT 'Obrazek kotouce',
  `vektor` varchar(255) DEFAULT NULL COMMENT 'Vektor kotouce',
  `cislo_dilu` varchar(255) DEFAULT NULL COMMENT 'Cislo dilu kotouce',
  `typ` int DEFAULT NULL COMMENT 'Typ kotouce',
  `konkurence_braking` varchar(255) DEFAULT NULL COMMENT 'Konkurence Braking',
  `konkurence_ngbrakes` varchar(255) DEFAULT NULL COMMENT 'Konkurence NGBrakes',
  `od` decimal(5,2) DEFAULT NULL COMMENT 'OD',
  `hd` decimal(5,2) DEFAULT NULL COMMENT 'HD',
  `id` decimal(5,2) DEFAULT NULL COMMENT 'ID',
  `thk` decimal(5,2) DEFAULT NULL COMMENT 'THK',
  `poznamka` text DEFAULT NULL COMMENT 'Poznamka ke kotouci',
  `publikovat` tinyint DEFAULT NULL COMMENT 'Zda se ma adapter publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  UNIQUE KEY `cislo_dilu` (`cislo_dilu`),
  KEY `FK_KOTC_sortiment` (`sortiment`),
  KEY `FK_KOTC_typ` (`typ`),
  CONSTRAINT `FK_KOTC_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`),
  CONSTRAINT `FK_KOTC_typ` FOREIGN KEY (`typ`) REFERENCES `c_kotouc_typ` (`kod`)
) COMMENT='Tabulka kotoucu';

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
  `publikovat` int DEFAULT NULL COMMENT 'Zda se ma prislusenstvi publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
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
  `publikovat` int DEFAULT NULL COMMENT 'Zda se ma pumpa publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Cas posledni aktualizace',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo aktualizoval zaznam',
  PRIMARY KEY (`kod`),
  CONSTRAINT `FK_PUMP_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`),
  CONSTRAINT `FK_PUMP_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`)
) COMMENT 'Tabulka brzdových pump';

-- Creates table for brzdove hadicky
CREATE TABLE `d_hadicka` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod hadicky',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `obrazek` varchar(255) DEFAULT NULL COMMENT 'Obrazek hadicky',
  `vektor` varchar(255) DEFAULT NULL COMMENT 'Vektor hadicky',
  `cislo_dilu` varchar(255) DEFAULT NULL COMMENT 'Cislo dilu hadicky',
  `popis` varchar(255) DEFAULT NULL COMMENT 'Popis hadicky',
  `poznamka` text COMMENT 'Poznamka hadicky',
  `publikovat` int DEFAULT NULL COMMENT 'Jestli se ma zaznam publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy byl zaznam aktualizovan',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo zaznam aktualizoval',
  PRIMARY KEY (`kod`),
  KEY `FK_HADI_sortiment` (`sortiment`),
  KEY `FK_HADI_kategorie` (`kategorie`),
  CONSTRAINT `FK_HADI_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`),
  CONSTRAINT `FK_HADI_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`)
) COMMENT='Tabulka brzdovych hadicek';

-- Creates table for vyrobce
CREATE TABLE `d_vyrobce` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod vyrobce',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `nazev` varchar(255) DEFAULT NULL COMMENT 'Nazev vyrobce',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy byl zaznam aktualizovan',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo zaznam aktualizoval',
  PRIMARY KEY (`kod`),
  UNIQUE KEY `UQ_VYRO_kategorie` (`kategorie`,`nazev`),
  KEY `kategorie` (`kategorie`),
  CONSTRAINT `FK_VYRO_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`)
) COMMENT='Tabulka vyrobcu vozidel';

-- Creates table for pozice of sortiment
CREATE TABLE `c_pozice` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod pozice',
  `sortiment` int DEFAULT NULL COMMENT 'Kod sortimentu',
  `nazev` varchar(255) DEFAULT NULL COMMENT 'Nazev pozice v CZ',
  `nazev_eng` varchar(255) DEFAULT NULL COMMENT 'Nazev pozice v EN',
  PRIMARY KEY (`kod`),
  CONSTRAINT `FK_POZI_sortiment` FOREIGN KEY (`sortiment`) REFERENCES `c_sortiment` (`kod`)
) COMMENT='Tabulka pozice jednotliveho sortimentu';

-- Creates table for subkategorie
CREATE TABLE `c_subkategorie` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod subkategorie',
  `kategorie` int DEFAULT NULL COMMENT 'Kod kategorie',
  `nazev` varchar(255) DEFAULT NULL COMMENT 'Nazev subkategorie v CZ',
  `nazev_eng` varchar(255) DEFAULT NULL COMMENT 'Nazev subkategorie v EN',
  PRIMARY KEY (`kod`),
  KEY `kategorie` (`kategorie`),
  CONSTRAINT `FK_SUBK_kategorie` FOREIGN KEY (`kategorie`) REFERENCES `c_kategorie` (`kod`)
) COMMENT='Tabulka subkategorii vozidel';

-- Creates table for vozidlo
CREATE TABLE `d_vozidlo` (
  `kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod vozidla',
  `subkategorie` int DEFAULT NULL COMMENT 'Kod subkategorie vozidla',
  `vyrobce` int DEFAULT NULL COMMENT 'Kod vyrobce vozidla',
  `typ` varchar(255) DEFAULT NULL COMMENT 'Typ vozidla',
  `objem` int DEFAULT NULL COMMENT 'Objem vozidla',
  `oznaceni` varchar(255) DEFAULT NULL COMMENT 'Oznaceni vozidla',
  `rok_od` smallint DEFAULT NULL COMMENT 'Rok vyroby vozidla od',
  `mesic_od` smallint DEFAULT NULL COMMENT 'Mesic vyroby vozidla od',
  `rok_do` smallint DEFAULT NULL COMMENT 'Rok vyroby vozidla do',
  `mesic_do` smallint DEFAULT NULL COMMENT 'Mesic vyroby vozidla do',
  `vykon` smallint DEFAULT NULL COMMENT 'Vykon vozidla',
  `poznamka` text COMMENT 'Poznamka k vozidlu',
  `index` smallint DEFAULT NULL COMMENT 'Index vozidla',
  `publikovat` int DEFAULT NULL COMMENT 'Jestli se ma vozidlo publikovat na webu',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy bylo vozidlo aktualizovano',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo aktualizoval vozidlo',
  PRIMARY KEY (`kod`),
  KEY `subkategorie` (`subkategorie`),
  KEY `vyrobce` (`vyrobce`),
  KEY `typ` (`typ`),
  KEY `oznaceni` (`oznaceni`),
  KEY `rok_od` (`rok_od`),
  KEY `rok_do` (`rok_do`),
  CONSTRAINT `FK_VOZI_subkategorie` FOREIGN KEY (`subkategorie`) REFERENCES `c_subkategorie` (`kod`),
  CONSTRAINT `FK_VOZI_vyrobce` FOREIGN KEY (`vyrobce`) REFERENCES `d_vyrobce` (`kod`)
) COMMENT='Tabulka vozidel';

-- Creates table for vozidlo_adapter
CREATE TABLE `c_vozidlo_adapter` (
  `vozidlo` int NOT NULL COMMENT 'Kod vozidla',
  `adapter` int NOT NULL COMMENT 'Kod adapteru',
  `pozice` int NOT NULL COMMENT 'Kod pozice',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy byl zaznam aktualizovan',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo zaznam aktualizoval',
  PRIMARY KEY (`vozidlo`,`adapter`,`pozice`),
  KEY `adapter` (`adapter`),
  KEY `pozice` (`pozice`),
  CONSTRAINT `FK_VZADPT_adapter` FOREIGN KEY (`adapter`) REFERENCES `d_adapter` (`kod`),
  CONSTRAINT `FK_VZADPT_pozice` FOREIGN KEY (`pozice`) REFERENCES `c_pozice` (`kod`),
  CONSTRAINT `FK_VZADPT_vozidlo` FOREIGN KEY (`vozidlo`) REFERENCES `d_vozidlo` (`kod`) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT='Tabulka pro spojeni adapteru s vozidly';

-- Creates table for vozidlo prislusenstvi
CREATE TABLE `c_vozidlo_prislusenstvi` (
  `vozidlo` int NOT NULL COMMENT 'Kod vozidla',
  `prislusenstvi` int NOT NULL COMMENT 'Kod prislusenstvi',
  `pozice` int NOT NULL COMMENT 'Kod pozice',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy byl zaznam aktualizovan',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo zaznam aktualizoval',
  PRIMARY KEY (`vozidlo`,`prislusenstvi`,`pozice`),
  KEY `prislusenstvi` (`prislusenstvi`),
  KEY `pozice` (`pozice`),
  CONSTRAINT `FK_VZPRIS_prislusenstvi` FOREIGN KEY (`prislusenstvi`) REFERENCES `d_prislusenstvi` (`kod`),
  CONSTRAINT `FK_VZPRIS_pozice` FOREIGN KEY (`pozice`) REFERENCES `c_pozice` (`kod`),
  CONSTRAINT `FK_VZPRIS_vozidlo` FOREIGN KEY (`vozidlo`) REFERENCES `d_vozidlo` (`kod`) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT='Tabulka pro spojeni prislusenstvi s vozidly';

-- Creates table for vozidlo kotouc
CREATE TABLE `c_vozidlo_kotouc` (
  `vozidlo` int NOT NULL COMMENT 'Kod vozidla',
  `kotouc` int NOT NULL COMMENT 'Kod kotouce',
  `pozice` int NOT NULL COMMENT 'Kod pozice',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy byl zaznam aktualizovan',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo zaznam aktualizoval',
  PRIMARY KEY (`vozidlo`,`kotouc`,`pozice`),
  KEY `pozice` (`pozice`),
  KEY `kotouc` (`kotouc`),
  CONSTRAINT `FK_VZKOTO_kotouc` FOREIGN KEY (`kotouc`) REFERENCES `d_kotouce` (`kod`),
  CONSTRAINT `FK_VZKOTO_pozice` FOREIGN KEY (`pozice`) REFERENCES `c_pozice` (`kod`),
  CONSTRAINT `FK_VZKOTO_vozidlo` FOREIGN KEY (`vozidlo`) REFERENCES `d_vozidlo` (`kod`) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT='Tabulka pro spojeni kotoucu s vozidly';

-- Creates table for vozidlo brzdic
CREATE TABLE `c_vozidlo_brzdic` (
  `vozidlo` int NOT NULL COMMENT 'Kod vozidla',
  `brzdic` int NOT NULL COMMENT 'Kod brzdice',
  `pozice` int NOT NULL COMMENT 'Kod pozice',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy byl zaznam aktualizovan',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo zaznam aktualizoval',
  PRIMARY KEY (`vozidlo`,`brzdic`,`pozice`),
  KEY `brzdic` (`brzdic`),
  KEY `pozice` (`pozice`),
  CONSTRAINT `FK_VZBRZD` FOREIGN KEY (`brzdic`) REFERENCES `d_brzdice` (`kod`),
  CONSTRAINT `FK_VZBRZD_pozice` FOREIGN KEY (`pozice`) REFERENCES `c_pozice` (`kod`),
  CONSTRAINT `FK_VZBRZD_vozidlo` FOREIGN KEY (`vozidlo`) REFERENCES `d_vozidlo` (`kod`) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT='Tabulka pro spojeni brzdicu s vozidly';

-- Creates table for vozidlo desticka
CREATE TABLE `c_vozidlo_desticka` (
  `vozidlo` int NOT NULL COMMENT 'Kod vozidla',
  `desticka` int NOT NULL COMMENT 'Kod desticky',
  `pozice` int NOT NULL COMMENT 'Kod pozice',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy byl zaznam aktualizovan',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo zaznam aktualizoval',
  PRIMARY KEY (`vozidlo`,`desticka`,`pozice`),
  KEY `desticka` (`desticka`),
  KEY `pozice` (`pozice`),
  CONSTRAINT `FK_VZDEST` FOREIGN KEY (`desticka`) REFERENCES `d_desticka` (`kod`),
  CONSTRAINT `FK_VZDEST_pozice` FOREIGN KEY (`pozice`) REFERENCES `c_pozice` (`kod`),
  CONSTRAINT `FK_VZDEST_vozidlo` FOREIGN KEY (`vozidlo`) REFERENCES `d_vozidlo` (`kod`) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT='Tabulka pro spojeni desticky s vozidly';

-- Creates table for vozidlo hadicka
CREATE TABLE `c_vozidlo_hadicka` (
  `vozidlo` int NOT NULL COMMENT 'Kod vozidla',
  `hadicka` int NOT NULL COMMENT 'Kod hadicky',
  `pozice` int NOT NULL COMMENT 'Kod pozice',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy byl zaznam aktualizovan',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo zaznam aktualizoval',
  PRIMARY KEY (`vozidlo`,`hadicka`,`pozice`),
  KEY `hadicka` (`hadicka`),
  KEY `pozice` (`pozice`),
  CONSTRAINT `FK_VZHADI_hadicka` FOREIGN KEY (`hadicka`) REFERENCES `d_hadicka` (`kod`),
  CONSTRAINT `FK_VZHADI_pozice` FOREIGN KEY (`pozice`) REFERENCES `c_pozice` (`kod`),
  CONSTRAINT `FK_VZHADI_vozidlo` FOREIGN KEY (`vozidlo`) REFERENCES `d_vozidlo` (`kod`) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT='Tabulka pro spojeni desticky s vozidly';

-- Creates table for vozidlo pumpa
CREATE TABLE `c_vozidlo_pumpa` (
  `vozidlo` int NOT NULL COMMENT 'Kod vozidla',
  `pumpa` int NOT NULL COMMENT 'Kod pumpy',
  `pozice` int NOT NULL COMMENT 'Kod pozice',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy byl zaznam aktualizovan',
  `aktualizoval` smallint DEFAULT NULL COMMENT 'Kdo zaznam aktualizoval',
  PRIMARY KEY (`vozidlo`,`pumpa`,`pozice`),
  KEY `pumpa` (`pumpa`),
  KEY `pozice` (`pozice`),
  CONSTRAINT `FK_VZPUMP_pumpa` FOREIGN KEY (`pumpa`) REFERENCES `d_pumpa` (`kod`),
  CONSTRAINT `FK_VZPUMP_pozice` FOREIGN KEY (`pozice`) REFERENCES `c_pozice` (`kod`),
  CONSTRAINT `FK_VZPUMP_vozidlo` FOREIGN KEY (`vozidlo`) REFERENCES `d_vozidlo` (`kod`) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT='Tabulka pro spojeni pumpy s vozidly';

-- Creates table for kotouce varianty
CREATE TABLE `c_kotouc_varianta` (
  `varianta_kod` int NOT NULL AUTO_INCREMENT COMMENT 'Kod varianty kotouce',
  `kotouc` int DEFAULT NULL COMMENT 'Kod kotouce',
  `varianta` int DEFAULT NULL COMMENT 'Varianta kotouce',
  `obrazek` int DEFAULT NULL COMMENT 'Nazev obrazku',
  `publikovat` int DEFAULT NULL COMMENT 'Jestli se ma zaznam publikovat',
  `aktualizovano` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Kdy byl zaznam aktualizovan',
  `aktualizoval` int DEFAULT NULL COMMENT 'Kdo zaznam aktualizoval',
  PRIMARY KEY (`varianta_kod`),
  UNIQUE KEY `UQ_KOTO_varianta` (`kotouc`,`varianta`),
  CONSTRAINT `FK_KOTO_varianta` FOREIGN KEY (`kotouc`) REFERENCES `d_kotouce` (`kod`) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT='Tabulka s varianty kotoucu';