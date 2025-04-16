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
SELECT k.kod, s.nazev as sortiment, ka.nazev as kategorie, k.obrazek, k.vektor, k.cislo_dilu, kt.nazev as typ, 
k.konkurence_braking, k.konkurence_ngbrakes, k.od, k.hd, k.id, k.thk, k.poznamka, 
k.publikovat, k.aktualizovano, k.aktualizoval
FROM d_kotouce k
LEFT JOIN c_sortiment s on s.kod = k.sortiment
LEFT JOIN c_kategorie ka on ka.kod = k.kategorie
LEFT JOIN c_kotouc_typ kt on kt.kod = k.typ;

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
select
 	ad.cislo_dilu as cislo_dilu,
	ka.nazev as kategorie,
	sk.nazev as subkategorie,
	vr.nazev as vyrobce,
	vk.vozidlo,
	CONCAT(
            		vr.nazev,
            		' ',
            
            	if (
            		ISNULL(vz.typ),
            		'',
            		CONCAT(vz.typ, ' ')
            	),
            
            if (
            	ISNULL(vz.objem),
            	'',
            	CONCAT(vz.objem, ' ')
            ),
            
            if (
            	ISNULL(vz.oznaceni),
            	'',
            	CONCAT(vz.oznaceni, ' ')
            ),
            
            if (
            	ISNULL(vz.rok_od),
            	'',
            	CONCAT(vz.rok_od, '-')
            ),
            
            if (
            	ISNULL(vz.rok_do),
            	'',
            	CONCAT(
            
            		if (ISNULL(vz.rok_od), '-', ''),
            		vz.rok_do
            	)
            )
            	) as oznaceni_vozidla,
	vz.typ,
	vz.objem,
	ad.prumer,
	ad.typ_uchyceni,
	ad.roztec_brzdic,
	vz.oznaceni as specialni_oznaceni,
	vz.rok_od,
	vz.rok_do,
	pz.nazev_eng as pozice,
    ad.publikovat
from c_vozidlo_adapter as vk
inner join d_vozidlo as vz on vk.vozidlo = vz.kod
inner join d_vyrobce as vr on vz.vyrobce = vr.kod
inner join c_pozice as pz on vk.pozice = pz.kod
inner join c_subkategorie sk on vz.subkategorie = sk.kod
inner join c_kategorie ka on sk.kategorie = ka.kod
inner join v_adapter_detail ad on vk.adapter = ad.kod
order by ad.cislo_dilu asc
limit 18446744073709551615;

-- Create view for vozidlo desticky data
CREATE OR REPLACE VIEW v_vozidlo_desticka AS
select
	de.cislo_dilu as cislo_dilu,
	ka.nazev as kategorie,
	sk.nazev as subkategorie,
	vr.nazev as vyrobce,
	vd.vozidlo,
	CONCAT(
            		vr.nazev,
            		' ',
            
            	if (
            		ISNULL(vz.typ),
            		'',
            		CONCAT(vz.typ, ' ')
            	),
            
            if (
            	ISNULL(vz.objem),
            	'',
            	CONCAT(vz.objem, ' ')
            ),
            
            if (
            	ISNULL(vz.oznaceni),
            	'',
            	CONCAT(vz.oznaceni, ' ')
            ),
            
            if (
            	ISNULL(vz.rok_od),
            	'',
            	CONCAT(vz.rok_od, '-')
            ),
            
            if (
            	ISNULL(vz.rok_do),
            	'',
            	CONCAT(
            
            		if (ISNULL(vz.rok_od), '-', ''),
            		vz.rok_do
            	)
            )
            	) as oznaceni_vozidla,
	vz.typ as typ,
	vz.objem as objem,
	ad.obrazek,
	ad.vektor,
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
	de.material,
	de.oem_cisla,
	vz.oznaceni as specialni_oznaceni,
	vz.rok_od as rok_od,
	vz.rok_do as rok_do,
	pz.nazev_eng as pozice,
	de.publikovat
from c_vozidlo_desticka vd
inner join d_vozidlo vz on vd.vozidlo = vz.kod
inner join d_vyrobce vr on vz.vyrobce = vr.kod
inner join c_pozice pz on vd.pozice = pz.kod
inner join c_subkategorie sk on vz.subkategorie = sk.kod
inner join c_kategorie ka on sk.kategorie = ka.kod
inner join v_desticka_detail de on vd.desticka = de.kod
order by cast(de.cislo_dilu as unsigned) asc
limit 18446744073709551615;

-- Create view for vozidlo hadicky data
CREATE OR REPLACE VIEW v_vozidlo_hadicka AS
select
	ha.cislo_dilu as cislo_dilu,
	ka.nazev as kategorie,
	sk.nazev as subkategorie,
	vr.nazev as vyrobce,
	vb.vozidlo,
	CONCAT(
            		vr.nazev,
            		' ',
            
            	if (
            		ISNULL(vz.typ),
            		'',
            		CONCAT(vz.typ, ' ')
            	),
            
            if (
            	ISNULL(vz.objem),
            	'',
            	CONCAT(vz.objem, ' ')
            ),
            
            if (
            	ISNULL(vz.oznaceni),
            	'',
            	CONCAT(vz.oznaceni, ' ')
            ),
            
            if (
            	ISNULL(vz.rok_od),
            	'',
            	CONCAT(vz.rok_od, '-')
            ),
            
            if (
            	ISNULL(vz.rok_do),
            	'',
            	CONCAT(
            
            		if (ISNULL(vz.rok_od), '-', ''),
            		vz.rok_do
            	)
            )
            	) as oznaceni_vozidla,
	vz.typ,
	vz.objem,
	vz.oznaceni as specialni_oznaceni,
	ha.obrazek,
	ha.vektor,
	vz.rok_od,
	vz.rok_do,
	pz.nazev_eng as pozice,
    ha.publikovat
from c_vozidlo_hadicka vb
inner join d_vozidlo vz on vb.vozidlo = vz.kod
inner join d_vyrobce vr on vz.vyrobce = vr.kod
inner join c_pozice pz on vb.pozice = pz.kod
inner join c_subkategorie sk on vz.subkategorie = sk.kod
inner join c_kategorie ka on sk.kategorie = ka.kod
inner join v_hadicky_detail ha on vb.hadicka = ha.kod
order by ha.cislo_dilu asc
limit 18446744073709551615;

-- Create view for vozidlo kotouc data
CREATE OR REPLACE VIEW v_vozidlo_kotouc AS
(
  SELECT
    ko.cislo_dilu as cislo_dilu,
    ka.nazev as kategorie,
    sk.nazev as subkategorie,
    vr.nazev as vyrobce,
    vk.vozidlo,
    CONCAT(
      vr.nazev, ' ',
      IF(ISNULL(vz.typ), '', CONCAT(vz.typ, ' ')),
      IF(ISNULL(vz.objem), '', CONCAT(vz.objem, ' ')),
      IF(ISNULL(vz.oznaceni), '', CONCAT(vz.oznaceni, ' ')),
      IF(ISNULL(vz.rok_od), '', CONCAT(vz.rok_od, '-')),
      IF(ISNULL(vz.rok_do), '', CONCAT(IF(ISNULL(vz.rok_od), '-', ''), vz.rok_do))
    ) as oznaceni_vozidla,
    vz.typ as typ_vozidla,
    vz.objem,
    ko.obrazek,
    ko.vektor,
    ko.od as vnejsi_prumer,
    ko.hd as roztecny_prumer,
    ko.id as vnitrni_prumer,
    ko.thk as tloustka,
    ko.typ as typ,
    vz.rok_od,
    vz.rok_do,
    pz.nazev_eng as pozice,
    ko.publikovat
  FROM c_vozidlo_kotouc AS vk
  INNER JOIN d_vozidlo AS vz ON vk.vozidlo = vz.kod
  INNER JOIN d_vyrobce AS vr ON vz.vyrobce = vr.kod
  INNER JOIN c_pozice AS pz ON vk.pozice = pz.kod
  INNER JOIN c_subkategorie sk ON vz.subkategorie = sk.kod
  INNER JOIN c_kategorie ka ON sk.kategorie = ka.kod
  INNER JOIN v_kotouc_detail ko ON vk.kotouc = ko.kod
  WHERE ko.publikovat = 1
)
UNION DISTINCT
(
  SELECT
    CONCAT(ko.cislo_dilu, '-', kv.varianta) as cislo_dilu,
    ka.nazev as kategorie,
    sk.nazev as subkategorie,
    vr.nazev as vyrobce,
    vk.vozidlo,
    CONCAT(
      vr.nazev, ' ',
      IF(ISNULL(vz.typ), '', CONCAT(vz.typ, ' ')),
      IF(ISNULL(vz.objem), '', CONCAT(vz.objem, ' ')),
      IF(ISNULL(vz.oznaceni), '', CONCAT(vz.oznaceni, ' ')),
      IF(ISNULL(vz.rok_od), '', CONCAT(vz.rok_od, '-')),
      IF(ISNULL(vz.rok_do), '', CONCAT(IF(ISNULL(vz.rok_od), '-', ''), vz.rok_do))
    ) as oznaceni_vozidla,
    vz.typ as typ_vozidla,
    vz.objem,
    kv.obrazek,
    ko.vektor,
    ko.od as vnejsi_prumer,
    ko.hd as roztecny_prumer,
    ko.id as vnitrni_prumer,
    ko.thk as tloustka,
    ko.typ as typ,
    vz.rok_od,
    vz.rok_do,
    pz.nazev_eng as pozice,
    ko.publikovat
  FROM c_vozidlo_kotouc AS vk
  INNER JOIN d_vozidlo AS vz ON vk.vozidlo = vz.kod
  INNER JOIN d_vyrobce AS vr ON vz.vyrobce = vr.kod
  INNER JOIN c_pozice AS pz ON vk.pozice = pz.kod
  INNER JOIN c_subkategorie sk ON vz.subkategorie = sk.kod
  INNER JOIN c_kategorie ka ON sk.kategorie = ka.kod
  INNER JOIN v_kotouc_detail ko ON vk.kotouc = ko.kod
  INNER JOIN c_kotouc_varianta kv ON vk.kotouc = kv.kotouc
  WHERE ko.publikovat = 1 AND kv.publikovat = 1
)
ORDER BY cislo_dilu ASC
LIMIT 18446744073709551615;

-- Create view for vozidlo brzdic data
CREATE OR REPLACE VIEW v_vozidlo_brzdic AS
select
	bo.cislo_dilu as cislo_dilu,
	ka.nazev as kategorie,
	sk.nazev as subkategorie,
	vr.nazev as vyrobce,
	vb.vozidlo,
	CONCAT(
            		vr.nazev,
            		' ',
            
            	if (
            		ISNULL(vz.typ),
            		'',
            		CONCAT(vz.typ, ' ')
            	),
            
            if (
            	ISNULL(vz.objem),
            	'',
            	CONCAT(vz.objem, ' ')
            ),
            
            if (
            	ISNULL(vz.oznaceni),
            	'',
            	CONCAT(vz.oznaceni, ' ')
            ),
            
            if (
            	ISNULL(vz.rok_od),
            	'',
            	CONCAT(vz.rok_od, '-')
            ),
            
            if (
            	ISNULL(vz.rok_do),
            	'',
            	CONCAT(
            
            		if (ISNULL(vz.rok_od), '-', ''),
            		vz.rok_do
            	)
            )
            	) as oznaceni_vozidla,
	vz.typ,
	vz.objem,
	bo.obrazek,
	bo.vektor,
	bo.typ_uchyceni,
	bo.pocet_pistku,
	vz.oznaceni as specialni_oznaceni,
	vz.rok_od,
	vz.rok_do,
	pz.nazev_eng as pozice,
    bo.publikovat
from c_vozidlo_brzdic as vb
inner join d_vozidlo as vz on vb.vozidlo = vz.kod
inner join d_vyrobce as vr on vz.vyrobce = vr.kod
inner join c_pozice as pz on vb.pozice = pz.kod
inner join c_subkategorie sk on vz.subkategorie = sk.kod
inner join c_kategorie ka on sk.kategorie = ka.kod
inner join v_brzdice_detail bo on vb.brzdic = bo.kod
order by bo.cislo_dilu asc
limit 18446744073709551615;

-- Create view for vozidlo pumpy data
CREATE OR REPLACE VIEW v_vozidlo_pumpa AS
select
	vpd.cislo_dilu as cislo_dilu,
	ka.nazev as kategorie,
	sk.nazev as subkategorie,
	vr.nazev as vyrobce,
	vp.vozidlo,
	CONCAT(
            		vr.nazev,
            		' ',
            
            	if (
            		ISNULL(vz.typ),
            		'',
            		CONCAT(vz.typ, ' ')
            	),
            
            if (
            	ISNULL(vz.objem),
            	'',
            	CONCAT(vz.objem, ' ')
            ),
            
            if (
            	ISNULL(vz.oznaceni),
            	'',
            	CONCAT(vz.oznaceni, ' ')
            ),
            
            if (
            	ISNULL(vz.rok_od),
            	'',
            	CONCAT(vz.rok_od, '-')
            ),
            
            if (
            	ISNULL(vz.rok_do),
            	'',
            	CONCAT(
            
            		if (ISNULL(vz.rok_od), '-', ''),
            		vz.rok_do
            	)
            )
            	) as oznaceni_vozidla,
	vz.typ,
	vz.objem,
	vpd.prumer,
	vpd.obrazek,
	vpd.vektor,
	vz.oznaceni as specialni_oznaceni,
	vz.rok_od,
	vz.rok_do,
	pz.nazev_eng as pozice,
    vpd.publikovat
from c_vozidlo_pumpa as vp
inner join d_vozidlo as vz on vp.vozidlo = vz.kod
inner join d_vyrobce as vr on vz.vyrobce = vr.kod
inner join c_pozice as pz on vp.pozice = pz.kod
inner join c_subkategorie sk on vz.subkategorie = sk.kod
inner join c_kategorie ka on sk.kategorie = ka.kod
inner join v_pumpy_detail vpd on vp.pumpa = vpd.kod
order by vpd.cislo_dilu asc
limit 18446744073709551615;

-- Create view for vozidlo prislusenstvi data
CREATE OR REPLACE VIEW v_vozidlo_prislusenstvi AS
select
	vpd.cislo_dilu as cislo_dilu,
	ka.nazev as kategorie,
	sk.nazev as subkategorie,
	vr.nazev as vyrobce,
	vp.vozidlo,
	CONCAT(
            		vr.nazev,
            		' ',
            
            	if (
            		ISNULL(vz.typ),
            		'',
            		CONCAT(vz.typ, ' ')
            	),
            
            if (
            	ISNULL(vz.objem),
            	'',
            	CONCAT(vz.objem, ' ')
            ),
            
            if (
            	ISNULL(vz.oznaceni),
            	'',
            	CONCAT(vz.oznaceni, ' ')
            ),
            
            if (
            	ISNULL(vz.rok_od),
            	'',
            	CONCAT(vz.rok_od, '-')
            ),
            
            if (
            	ISNULL(vz.rok_do),
            	'',
            	CONCAT(
            
            		if (ISNULL(vz.rok_od), '-', ''),
            		vz.rok_do
            	)
            )
            	) as oznaceni_vozidla,
	vz.typ,
	vz.objem,
	vpd.obrazek,
	vpd.vektor,
	vpd.typ as typ_prislusenstvi,
	vz.oznaceni as specialni_oznaceni,
	vz.rok_od,
	vz.rok_do,
	pz.nazev_eng as pozice,
    vpd.publikovat
from c_vozidlo_prislusenstvi as vp
inner join d_vozidlo as vz on vp.vozidlo = vz.kod
inner join d_vyrobce as vr on vz.vyrobce = vr.kod
inner join c_pozice as pz on vp.pozice = pz.kod
inner join c_subkategorie sk on vz.subkategorie = sk.kod
inner join c_kategorie ka on sk.kategorie = ka.kod
inner join v_prislusenstvi_detail vpd on vp.prislusenstvi = vpd.kod
order by vpd.cislo_dilu asc
limit 18446744073709551615;

-- Create view for vozidlo data, for filtering based on kategorie
CREATE OR REPLACE VIEW v_vozidla AS
SELECT     vz.kod AS vozidlo_kod,
		   vr.kategorie as kategorie_kod,
		   vr.kod as vyrobce_kod,
           vr.nazev AS vyrobce,
           Ifnull(vz.objem, 'Not available') AS objem,
           Concat( vr.nazev, ' ', 
           		IF ( Isnull(vz.typ), '', Concat(vz.typ, ' ') ), 
           		IF ( Isnull(vz.objem), '', Concat(vz.objem, ' ') ), 
           		IF ( Isnull(vz.oznaceni), '', Concat(vz.oznaceni, ' ') ), 
           		IF ( Isnull(vz.rok_od), '', Concat(vz.rok_od, ' - ') ), 
           		IF ( Isnull(vz.rok_do), 'Now', Concat( 
           		IF (Isnull(vz.rok_od), '-', ''), vz.rok_do ) ) ) AS model,
           Concat(vz.rok_od, ' - ', Ifnull(vz.rok_do, 'Now')) AS rok_vyroby
FROM       d_vyrobce vr
INNER JOIN d_vozidlo vz
ON         vr.kod = vz.vyrobce
ORDER BY   vyrobce ASC,
           cast(objem as unsigned) ASC,
           model ASC;