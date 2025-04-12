-- Switch to the database
USE goldfren_data;

-- View structure for view 'v_adapter_detail'
CREATE OR REPLACE VIEW v_adapter_detail AS
SELECT a.kod, s.nazev as sortiment, k.nazev as kategorie, a.obrazek, a.vektor, a.cislo_dilu, a.typ, a.prumer, a.popis, aa.typ_uchyceni, aa.roztec_brzdic, a.poznamka, a.publikovat, a.aktualizovano, a.aktualizoval 
FROM d_adapter a 
LEFT JOIN c_sortiment s on s.kod = a.sortiment
LEFT JOIN c_kategorie k on k.kod = a.kategorie
LEFT JOIN d_adapter_attachment aa on a.kod = aa.adapter_kod
  WHERE a.publikovat = 1;

-- View structure for view 'v_brzdice_detail'
CREATE OR REPLACE VIEW v_brzdice_detail AS
SELECT b.kod, s.nazev as sortiment, k.nazev as kategorie, b.obrazek, b.vektor, b.cislo_dilu, b.popis, b.typ_uchyceni, b.poznamka, b.publikovat, b.aktualizovano, b.aktualizoval
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