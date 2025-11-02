-- Switch to the database
USE goldfren_data;

-- View structure for view 'v_adapter_detail'
CREATE OR REPLACE VIEW v_adapter_detail AS
SELECT a.kod, s.nazev as sortiment, k.nazev as kategorie, a.obrazek, a.vektor, a.cislo_dilu, a.typ, a.prumer, a.popis, aa.typ_uchyceni, aa.roztec_brzdic, a.poznamka, a.publikovat, a.aktualizovano, a.aktualizoval 
FROM d_adapter a 
LEFT JOIN c_sortiment s on s.kod = a.sortiment
LEFT JOIN c_kategorie k on k.kod = a.kategorie
LEFT JOIN d_adapter_attachment aa on a.kod = aa.adapter_kod;

-- View structure for view 'v_brzdice_detail'
CREATE OR REPLACE VIEW v_brzdice_detail AS
SELECT b.kod, s.nazev as sortiment, k.nazev as kategorie, b.obrazek, b.vektor, b.cislo_dilu, b.popis, b.typ_uchyceni, b.pocet_pistku, b.poznamka, b.publikovat, b.aktualizovano, b.aktualizoval
FROM d_brzdice b
LEFT JOIN c_sortiment s on s.kod = b.sortiment
LEFT JOIN c_kategorie k on k.kod = b.kategorie;

-- View structure for view 'v_desticka_detail'
CREATE OR REPLACE VIEW v_desticka_detail AS
SELECT d.kod, s.nazev as sortiment, k.nazev as kategorie, d.obrazek, d.vektor, d.cislo_dilu, dt.nazev as typ, d.plech_a_material, d.plech_a_tloustka, d.plech_a_matrice, d.plech_b_material, 
d.plech_b_tloustka, d.plech_b_matrice, d.izolator_a_material, d.izolator_a_tloustka, d.izolator_a_matrice, d.izolator_b_material, d.izolator_b_tloustka, 
d.izolator_b_matrice, d.segment_a_material, d.segment_a_tloustka, d.segment_a_matrice, d.segment_b_material, d.segment_b_tloustka, d.segment_b_matrice, 
d.konkurence_sbs, d.konkurence_ebc, d.konkurence_ferodo, d.konkurence_a2z, d.konkurence_rapco, d.konkurence_grove, d.konkurence_cleveland, d.konkurence_matco, 
d.material, d.poznamka, d.oem_cisla, d.obchodni_nazev, d.publikovat, d.aktualizovano, d.aktualizoval
FROM d_desticka d
LEFT JOIN c_sortiment s on s.kod = d.sortiment
LEFT JOIN c_kategorie k on k.kod = d.kategorie
LEFT JOIN c_desticka_typ dt on dt.kod = d.typ;

-- View structure for view 'v_kotouc_detail'
CREATE OR REPLACE VIEW v_kotouc_detail AS
SELECT * FROM 
	(SELECT k.kod, k.cislo_dilu, s.nazev as sortiment, ka.nazev as kategorie, k.obrazek, k.vektor, kt.nazev as typ, 
	k.konkurence_braking, k.konkurence_ngbrakes, k.od, k.hd, k.id, k.thk, k.poznamka, 
	k.publikovat, k.aktualizovano, k.aktualizoval
	FROM d_kotouce k
	LEFT JOIN c_sortiment s on s.kod = k.sortiment
	LEFT JOIN c_kategorie ka on ka.kod = k.kategorie
	LEFT JOIN c_kotouc_typ kt on kt.kod = k.typ
	UNION
	SELECT k.kod, CONCAT(k.cislo_dilu, '-', ckv.varianta) as cislo_dilu, s.nazev as sortiment, ka.nazev as kategorie, k.obrazek, COALESCE(CONCAT(NULLIF(ckv.obrazek, ''), '.svg'), k.vektor) as vektor, kt.nazev as typ, 
	k.konkurence_braking, k.konkurence_ngbrakes, k.od, k.hd, k.id, k.thk, k.poznamka, 
	k.publikovat, k.aktualizovano, k.aktualizoval
	FROM d_kotouce k 
	JOIN c_kotouc_varianta ckv ON ckv.kotouc = k.kod
	LEFT JOIN c_sortiment s on s.kod = k.sortiment
	LEFT JOIN c_kategorie ka on ka.kod = k.kategorie
	LEFT JOIN c_kotouc_typ kt on kt.kod = k.typ) kotouce
ORDER BY kotouce.cislo_dilu ASC;

-- View structure for view 'v_pumpy_detail'
CREATE OR REPLACE VIEW v_pumpy_detail AS
SELECT p.kod, s.nazev as sortiment, k.nazev as kategorie, p.obrazek, p.vektor, p.cislo_dilu, p.prumer, p.popis, p.poznamka, p.publikovat, p.aktualizovano, p.aktualizoval 
FROM d_pumpa p
LEFT JOIN c_sortiment s on s.kod = p.sortiment
LEFT JOIN c_kategorie k on k.kod = p.kategorie;

-- View structure for view 'v_hadicky_detail'
CREATE OR REPLACE VIEW v_hadicky_detail AS
SELECT h.kod, s.nazev as sortiment, k.nazev as kategorie, h.obrazek, h.vektor, h.cislo_dilu, h.popis, h.poznamka, h.publikovat, h.aktualizovano, h.aktualizoval 
FROM d_hadicka h
LEFT JOIN c_sortiment s on s.kod = h.sortiment
LEFT JOIN c_kategorie k on k.kod = h.kategorie;

-- View structure for view 'v_prislusenstvi_detail'
CREATE OR REPLACE VIEW v_prislusenstvi_detail AS
SELECT p.kod, s.nazev as sortiment, k.nazev as kategorie, p.obrazek, p.vektor, p.cislo_dilu, p.typ, p.popis, p.poznamka, p.publikovat, p.aktualizovano, p.aktualizoval 
FROM d_prislusenstvi p
LEFT JOIN c_sortiment s on s.kod = p.sortiment
LEFT JOIN c_kategorie k on k.kod = p.kategorie;

-- Create view for vozidlo adapter data
CREATE OR REPLACE VIEW v_vozidlo_adapter AS
WITH pos AS (
  SELECT
    vk.adapter,
    vk.vozidlo,
    GROUP_CONCAT(DISTINCT pz.nazev_eng ORDER BY pz.nazev_eng SEPARATOR ', ') AS pozice
  FROM c_vozidlo_adapter vk
  JOIN c_pozice pz ON pz.kod = vk.pozice
  GROUP BY vk.adapter, vk.vozidlo
)
SELECT
  ad.kod,
  ad.cislo_dilu,
  ka.nazev AS kategorie,
  sk.nazev AS subkategorie,
  vr.nazev AS vyrobce,
  pos.vozidlo,
  CONCAT(
    vr.nazev, ' ',
    IFNULL(CONCAT(vz.typ,' '),''),
    IFNULL(CONCAT(vz.objem,' '),''),
    IFNULL(CONCAT(vz.oznaceni,' '),'')
  ) AS oznaceni_vozidla,
  vz.typ,
  vz.objem,
  ad.prumer,
  ad.typ_uchyceni,
  ad.roztec_brzdic,
  vz.oznaceni AS specialni_oznaceni,
  ad.obrazek,
  ad.vektor,
  vz.rok_od,
  vz.rok_do,
  pos.pozice,        
  ad.publikovat
FROM pos
JOIN v_adapter_detail ad ON ad.kod = pos.adapter
JOIN d_vozidlo vz        ON vz.kod = pos.vozidlo
JOIN d_vyrobce vr        ON vr.kod = vz.vyrobce
JOIN c_subkategorie sk   ON sk.kod = vz.subkategorie
JOIN c_kategorie ka      ON ka.kod = sk.kategorie
ORDER BY ad.cislo_dilu ASC;

-- Create view for vozidlo desticky data
CREATE OR REPLACE VIEW v_vozidlo_desticka AS
WITH pozice AS (
  SELECT
    vd.desticka,
    vd.vozidlo,
    GROUP_CONCAT(DISTINCT pz.nazev_eng ORDER BY pz.nazev_eng SEPARATOR ', ') AS pozice
  FROM c_vozidlo_desticka vd
  JOIN c_pozice pz ON pz.kod = vd.pozice
  GROUP BY vd.desticka, vd.vozidlo
)
SELECT
  de.kod,
  de.cislo_dilu,
  ka.nazev AS kategorie,
  sk.nazev AS subkategorie,
  vr.nazev AS vyrobce,
  pz.vozidlo,                                  
  CONCAT(
    vr.nazev, ' ',
    IFNULL(CONCAT(vz.typ,' '),''),
    IFNULL(CONCAT(vz.objem,' '),''),
    IFNULL(CONCAT(vz.oznaceni,' '),'')
  ) AS oznaceni_vozidla,
  de.typ, 
  vz.objem,
  de.obrazek, 
  de.vektor,
  de.konkurence_sbs, 
  de.konkurence_ebc, 
  de.konkurence_ferodo,
  de.konkurence_a2z, 
  de.konkurence_rapco, 
  de.konkurence_grove,
  de.konkurence_cleveland, 
  de.konkurence_matco,
  de.material, de.oem_cisla,
  vz.oznaceni AS specialni_oznaceni,
  vz.rok_od,
  IFNULL(vz.rok_do, YEAR(CURDATE())) AS rok_do,
  pz.pozice,
  de.publikovat
FROM pozice pz
JOIN v_desticka_detail de ON de.kod = pz.desticka
JOIN d_vozidlo vz         ON vz.kod = pz.vozidlo
JOIN d_vyrobce vr         ON vr.kod = vz.vyrobce
JOIN c_subkategorie sk    ON sk.kod = vz.subkategorie
JOIN c_kategorie ka       ON ka.kod = sk.kategorie
ORDER BY cast(de.cislo_dilu as unsigned) ASC;

-- Create view for vozidlo hadicky data
CREATE OR REPLACE VIEW v_vozidlo_hadicka AS
WITH pozice AS (
  SELECT
    vb.hadicka,
    vb.vozidlo,
    GROUP_CONCAT(DISTINCT pz.nazev_eng ORDER BY pz.nazev_eng SEPARATOR ', ') AS pozice
  FROM c_vozidlo_hadicka vb
  JOIN c_pozice pz ON pz.kod = vb.pozice
  GROUP BY vb.hadicka, vb.vozidlo
)
SELECT
  ha.kod,
  ha.cislo_dilu,
  ka.nazev AS kategorie,
  sk.nazev AS subkategorie,
  vr.nazev AS vyrobce,
  pz.vozidlo,
  CONCAT(
    vr.nazev, ' ',
    IFNULL(CONCAT(vz.typ,' '),''),
    IFNULL(CONCAT(vz.objem,' '),''),
    IFNULL(CONCAT(vz.oznaceni,' '),'')
  ) AS oznaceni_vozidla,
  vz.typ,
  vz.objem,
  vz.oznaceni AS specialni_oznaceni,
  ha.obrazek,
  ha.vektor,
  ha.poznamka,
  vz.rok_od,
  vz.rok_do,
  pz.pozice,    
  ha.publikovat
FROM pozice pz
JOIN v_hadicky_detail ha ON ha.kod = pz.hadicka
JOIN d_vozidlo vz        ON vz.kod = pz.vozidlo
JOIN d_vyrobce vr        ON vr.kod = vz.vyrobce
JOIN c_subkategorie sk   ON sk.kod = vz.subkategorie
JOIN c_kategorie ka      ON ka.kod = sk.kategorie
ORDER BY ha.cislo_dilu ASC;

-- Create view for vozidlo kotouc data
CREATE OR REPLACE VIEW v_vozidlo_kotouc AS
WITH pos AS (
  SELECT
    vk.kotouc,
    vk.vozidlo,
    GROUP_CONCAT(DISTINCT pz.nazev_eng ORDER BY pz.nazev_eng SEPARATOR ', ') AS pozice
  FROM c_vozidlo_kotouc vk
  JOIN c_pozice pz ON pz.kod = vk.pozice
  GROUP BY vk.kotouc, vk.vozidlo
)
SELECT
	ko.kod,
	ko.cislo_dilu,
	ka.nazev AS kategorie,
	sk.nazev AS subkategorie,
	vr.nazev AS vyrobce,
	pos.vozidlo,
	CONCAT(
		vr.nazev, ' ',
		IFNULL(CONCAT(vz.typ,' '), ''),
		IFNULL(CONCAT(vz.objem,' '), ''),
		IFNULL(CONCAT(vz.oznaceni,' '), '')
	) AS oznaceni_vozidla,
	vz.typ       AS typ_vozidla,
	vz.objem,
	ko.obrazek,
	ko.vektor,
	ko.od        AS vnejsi_prumer,
	ko.hd        AS roztecny_prumer,
	ko.id        AS vnitrni_prumer,
	ko.thk       AS tloustka,
	ko.typ,
	vz.rok_od,
	vz.rok_do,
	pos.pozice,
	ko.publikovat
FROM pos
JOIN v_kotouc_detail ko ON ko.kod = pos.kotouc AND ko.publikovat = 1
JOIN d_vozidlo vz       ON vz.kod = pos.vozidlo
JOIN d_vyrobce vr       ON vr.kod = vz.vyrobce
JOIN c_subkategorie sk  ON sk.kod = vz.subkategorie
JOIN c_kategorie ka     ON ka.kod = sk.kategorie
ORDER BY ko.cislo_dilu ASC;

-- Create view for vozidlo brzdic data
CREATE OR REPLACE VIEW v_vozidlo_brzdic AS
WITH pos AS (
  SELECT
    vb.brzdic,
    vb.vozidlo,
    GROUP_CONCAT(DISTINCT pz.nazev_eng ORDER BY pz.nazev_eng SEPARATOR ', ') AS pozice
  FROM c_vozidlo_brzdic vb
  JOIN c_pozice pz ON pz.kod = vb.pozice
  GROUP BY vb.brzdic, vb.vozidlo
)
SELECT
  bo.kod,
  bo.cislo_dilu,
  ka.nazev AS kategorie,
  sk.nazev AS subkategorie,
  vr.nazev AS vyrobce,
  pos.vozidlo,
  CONCAT(
    vr.nazev, ' ',
    IFNULL(CONCAT(vz.typ,' '),''),
    IFNULL(CONCAT(vz.objem,' '),''),
    IFNULL(CONCAT(vz.oznaceni,' '),'')
  ) AS oznaceni_vozidla,
  vz.typ,
  vz.objem,
  bo.obrazek,
  bo.vektor,
  bo.typ_uchyceni,
  bo.pocet_pistku,
  vz.oznaceni AS specialni_oznaceni,
  vz.rok_od,
  vz.rok_do,
  pos.pozice,
  bo.publikovat
FROM pos
JOIN v_brzdice_detail bo ON bo.kod = pos.brzdic
JOIN d_vozidlo vz        ON vz.kod = pos.vozidlo
JOIN d_vyrobce vr        ON vr.kod = vz.vyrobce
JOIN c_subkategorie sk   ON sk.kod = vz.subkategorie
JOIN c_kategorie ka      ON ka.kod = sk.kategorie
ORDER BY bo.cislo_dilu ASC;

-- Create view for vozidlo pumpy data
CREATE OR REPLACE VIEW v_vozidlo_pumpa AS
WITH pos AS (
  SELECT
    vp.pumpa,
    vp.vozidlo,
    GROUP_CONCAT(DISTINCT pz.nazev_eng ORDER BY pz.nazev_eng SEPARATOR ', ') AS pozice
  FROM c_vozidlo_pumpa vp
  JOIN c_pozice pz ON pz.kod = vp.pozice
  GROUP BY vp.pumpa, vp.vozidlo
)
SELECT
  vpd.kod,
  vpd.cislo_dilu,
  ka.nazev AS kategorie,
  sk.nazev AS subkategorie,
  vr.nazev AS vyrobce,
  pos.vozidlo,
  CONCAT(
    vr.nazev, ' ',
    IFNULL(CONCAT(vz.typ,' '),''),
    IFNULL(CONCAT(vz.objem,' '),''),
    IFNULL(CONCAT(vz.oznaceni,' '),'')
  ) AS oznaceni_vozidla,
  vz.typ,
  vz.objem,
  vpd.prumer,
  vpd.obrazek,
  vpd.vektor,
  vpd.popis,
  vpd.poznamka,
  vz.oznaceni AS specialni_oznaceni,
  vz.rok_od,
  vz.rok_do,
  pos.pozice,
  vpd.publikovat
FROM pos
JOIN v_pumpy_detail vpd ON vpd.kod = pos.pumpa
JOIN d_vozidlo vz       ON vz.kod = pos.vozidlo
JOIN d_vyrobce vr       ON vr.kod = vz.vyrobce
JOIN c_subkategorie sk  ON sk.kod = vz.subkategorie
JOIN c_kategorie ka     ON ka.kod = sk.kategorie
ORDER BY vpd.cislo_dilu ASC;

-- Create view for vozidlo prislusenstvi data
CREATE OR REPLACE VIEW v_vozidlo_prislusenstvi AS
WITH pos AS (
  SELECT
    vp.prislusenstvi,
    vp.vozidlo,
    GROUP_CONCAT(DISTINCT pz.nazev_eng ORDER BY pz.nazev_eng SEPARATOR ', ') AS pozice
  FROM c_vozidlo_prislusenstvi vp
  JOIN c_pozice pz ON pz.kod = vp.pozice
  GROUP BY vp.prislusenstvi, vp.vozidlo
)
SELECT
  vpd.kod,
  vpd.cislo_dilu,
  ka.nazev AS kategorie,
  sk.nazev AS subkategorie,
  vr.nazev AS vyrobce,
  pos.vozidlo,
  CONCAT(
    vr.nazev, ' ',
    IFNULL(CONCAT(vz.typ,' '),''),
    IFNULL(CONCAT(vz.objem,' '),''),
    IFNULL(CONCAT(vz.oznaceni,' '),'')
  ) AS oznaceni_vozidla,
  vz.typ,
  vz.objem,
  vpd.obrazek,
  vpd.vektor,
  vpd.typ AS typ_prislusenstvi,
  vz.oznaceni AS specialni_oznaceni,
  vz.rok_od,
  vz.rok_do,
  pos.pozice,
  vpd.publikovat
FROM pos
JOIN v_prislusenstvi_detail vpd ON vpd.kod = pos.prislusenstvi
JOIN d_vozidlo vz               ON vz.kod = pos.vozidlo
JOIN d_vyrobce vr               ON vr.kod = vz.vyrobce
JOIN c_subkategorie sk          ON sk.kod = vz.subkategorie
JOIN c_kategorie ka             ON ka.kod = sk.kategorie
ORDER BY vpd.cislo_dilu ASC;

-- Create view for vozidlo data, for filtering based on kategorie
CREATE OR REPLACE VIEW v_vozidla AS
SELECT data.vozidlo_kod, data.kategorie_kod, data.vyrobce_kod, data.vyrobce, data.objem, data.model, data.rok_vyroby, data.oznaceni
FROM (
	SELECT
		vz.kod AS vozidlo_kod,
		vr.kategorie AS kategorie_kod,
		vr.kod AS vyrobce_kod,
		vr.nazev AS vyrobce,
		vz.typ,
		IFNULL(vz.objem, 'Not available') AS objem,
		TRIM(
		  IFNULL(
		    CONCAT(
		      vz.typ, ' ',
		      IF(vz.objem IS NULL, '', CONCAT(vz.objem, ' ')),
		      IF(vz.oznaceni IS NULL, '', vz.oznaceni)
		    ),
		    vz.oznaceni
		  )
		) AS model,
		IFNULL(CONCAT(vz.rok_od, ' - ', IFNULL(vz.rok_do, YEAR(CURDATE()))), 'Not specified') AS rok_vyroby,
		vz.oznaceni,
		IFNULL(vz.publikovat, 1) as publikovat
	FROM
		d_vyrobce vr
	INNER JOIN d_vozidlo vz ON vr.kod = vz.vyrobce
	ORDER BY
		vyrobce ASC,
		cast(objem as unsigned) ASC,
		model ASC
) data
WHERE data.publikovat = 1;

-- Vozidlo detail view
CREATE OR REPLACE VIEW v_vozidla_detail AS
select
    data.kod AS kod,
    data.kategorie AS kategorie,
    data.subkategorie AS subkategorie,
    trim(ifnull(concat(data.vyrobce, ' ', data.model), data.model)) AS nazev_modelu,
    data.vyrobce AS vyrobce,
    data.model AS model,
    data.typ AS typ,
    data.oznaceni AS oznaceni,
    data.rok_od AS rok_od,
    data.rok_do AS rok_do,
    data.vykon AS vykon,
    data.objem AS objem,
    data.poznamka AS poznamka,
    data.publikovat AS publikovat,
    data.aktualizovano AS aktualizovano,
    data.aktualizoval AS aktualizoval
from
    (
    select
        dv.kod AS kod,
        ck.nazev AS kategorie,
        cs.nazev AS subkategorie,
        dv2.nazev AS vyrobce,
        trim(ifnull(concat(dv.typ, ' ', if((dv.objem is null), '', concat(dv.objem, ' ')), if((dv.oznaceni is null), '', dv.oznaceni)), dv.oznaceni)) AS model,
        dv.typ AS typ,
        dv.oznaceni AS oznaceni,
        dv.rok_od AS rok_od,
        ifnull(dv.rok_do, year(curdate())) AS rok_do,
        dv.vykon AS vykon,
        dv.objem AS objem,
        dv.poznamka AS poznamka,
        ifnull(dv.publikovat, 1) AS publikovat,
        dv.aktualizovano AS aktualizovano,
        dv.aktualizoval AS aktualizoval
    from
        (((goldfren_data.d_vozidlo dv
    left join goldfren_data.d_vyrobce dv2 on
        ((dv2.kod = dv.vyrobce)))
    left join goldfren_data.c_kategorie ck on
        ((ck.kod = dv2.kategorie)))
    left join goldfren_data.c_subkategorie cs on
        ((cs.kod = dv.subkategorie)))) data
order by
    data.vyrobce,
    data.model;