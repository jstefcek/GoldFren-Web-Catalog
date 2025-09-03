const serverUrl = import.meta.env.VITE_API_URL;

export const dataTransformers = {
    // Adaptery transformed data
    adaptery: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/adaptery/image/` + item.obrazek : null,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/adaptery/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          prumer: item.prumer,
          popis: item.popis,
          typ_uchyceni: item.typ_uchyceni,
          roztec_brzdice: item.roztec_brzdice,
        }));
      }
      return [];
    },

    // Adapter detail transformed data
    adapter_detail: (data) => {
      if (data) {
        return {
          ...data,
          id: data.kod,
          obrazek: data.obrazek ? `${serverUrl}/GoldFren_Media/adaptery/image/` + data.obrazek : null,
          vektor: data.vektor ? `${serverUrl}/GoldFren_Media/adaptery/vector/` + data.vektor : null,
          cislo_dilu: data.cislo_dilu,
          typ: data.typ,
          prumer: data.prumer,
          popis: data.popis,
          typ_uchyceni: data.typ_uchyceni,
          roztec_brzdice: data.roztec_brzdice,
        };
      }
      return {};
    },

    // Adapter vozidla transformed data
    adapter_vozidla: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          vyrobce: item.vyrobce,
          kategorie: item.kategorie,
          subkategorie: item.subkategorie,
          oznaceni_vozidla: item.oznaceni_vozidla,
          objem: item.objem,
          rok_od: item.rok_od,
          rok_do: item.rok_do,
          pozice: item.pozice,
        }));
      }
      return [];
    },

    // Brzdice transformed data
    brzdice: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/brzdice/image/` + item.obrazek : null,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/brzdice/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ_uchyceni: item.typ_uchyceni,
          pocet_pistku: item.pocet_pistku,
          popis: item.popis,
        }));
      }
      return [];
    },

    // Brzdice detail transformed data
    brzdic_detail: (data) => {
      if (data) {
        return {
          ...data,
          id: data.kod,
          obrazek: data.obrazek ? `${serverUrl}/GoldFren_Media/brzdice/image/` + data.obrazek : null,
          vektor: data.vektor ? `${serverUrl}/GoldFren_Media/brzdice/vector/` + data.vektor : null,
          cislo_dilu: data.cislo_dilu,
          typ_uchyceni: data.typ_uchyceni,
          pocet_pistku: data.pocet_pistku,
          popis: data.popis,
        };
      }
      return {};
    },

    // Brzdic vozidla transformed data
    brzdic_vozidla: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          vyrobce: item.vyrobce,
          kategorie: item.kategorie,
          subkategorie: item.subkategorie,
          oznaceni_vozidla: item.oznaceni_vozidla,
          objem: item.objem,
          rok_od: item.rok_od,
          rok_do: item.rok_do,
          pozice: item.pozice,
        }));
      }
      return [];
    },
    
    // Desticky transformed data
    desticky: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/desticky/image/` + item.obrazek : null,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/desticky/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          material_text: item.material_text,
          oem_cisla: item.oem_cisla,
          obchodni_nazev: item.obchodni_nazev,
          // Konkurence
          konkurence_sbs: item.konkurence.sbs,
          konkurence_ebc: item.konkurence.ebc,
          konkurence_ferodo: item.konkurence.ferodo,
          konkurence_a2z: item.konkurence.a2z,
          konkurence_rapco: item.konkurence.rapco,
          konkurence_grove: item.konkurence.grove,
          konkurence_cleveland: item.konkurence.konkurence_cleveland,
          konkurence_matco: item.konkurence_matco,
          // Material
            // Plech A
            material_plech_a_material: item.material.plech_a.material,
            material_plech_a_tloustka: item.material.plech_a.tloustka,
            material_plech_a_matrice: item.material.plech_a.matrice,
            // Plech B
            material_plech_b_material: item.material.plech_b.material,
            material_plech_b_tloustka: item.material.plech_b.tloustka,
            material_plech_b_matrice: item.material.plech_b.matrice,
            // Izolator A
            material_izolator_a_material: item.material.izolator_a.material,
            material_izolator_a_tloustka: item.material.izolator_a.tloustka,
            material_izolator_a_matrice: item.material.izolator_a.matrice,
            // Izolator B
            material_izolator_b_material: item.material.izolator_b.material,
            material_izolator_b_tloustka: item.material.izolator_b.tloustka,
            material_izolator_b_matrice: item.material.izolator_b.matrice,
            // Segment A
            material_segment_a_material: item.material.segment_a.material,
            material_segment_a_tloustka: item.material.segment_a.tloustka,
            material_segment_a_matrice: item.material.segment_a.matrice,
            // Segment B
            material_segment_b_material: item.material.segment_b.material,
            material_segment_b_tloustka: item.material.segment_b.tloustka,
            material_segment_b_matrice: item.material.segment_b.matrice,
        }));
      }
      return [];
    },

    // Desticka detail transformed data
    desticka_detail: (data) => {
      if (data) {
        return {
          ...data,
          id: data.kod,
          image: data.obrazek ? `${serverUrl}/GoldFren_Media/desticky/image/` + data.obrazek : null,
          vektor: data.vektor ? `${serverUrl}/GoldFren_Media/desticky/vector/` + data.vektor : null,
          cislo_dilu: data.cislo_dilu,
          typ: data.typ,
          material: data.material_text,
          oem_cisla: data.oem_cisla || null,
          obchodni_nazev: data.obchodni_nazev,
          konkurence: {
            sbs: data.konkurence?.sbs || null,
            ebc: data.konkurence?.ebc || null,
            ferodo: data.konkurence?.ferodo || null,
            a2z: data.konkurence?.a2z || null,
            rapco: data.konkurence?.rapco || null,
            grove: data.konkurence?.grove || null,
            cleveland: data.konkurence?.cleveland || null,
            matco: data.konkurence?.matco || null
          }
        };
      }
      return {};
    },

    // Desticka vozidla transformed data
    desticka_vozidla: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          vyrobce: item.vyrobce,
          kategorie: item.kategorie,
          subkategorie: item.subkategorie,
          oznaceni_vozidla: item.oznaceni_vozidla,
          objem: item.objem,
          rok_od: item.rok_od,
          rok_do: item.rok_do,
          pozice: item.pozice,
        }));
      }
      return [];
    },

    // Kotouce transformed data
    kotouce: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/kotouce/image/` + item.obrazek : null,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/kotouce/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          vnejsi_prumer: item.od,
          roztecny_prumer: item.hd,
          vnitrni_prumer: item.id,
          tloustka: item.thk,
          konkurence_branking: item.konkurence_branking,
          konkurence_ngbrakes: item.konkurence_ngbrakes,
          poznamka: item.poznamka,
        }));
      }
      return [];
    },

    // Kotouc detail transformed data
    kotouc_detail: (data) => {
      if (data) {
        return {
          ...data,
          id: data.kod,
          obrazek: data.obrazek ? `${serverUrl}/GoldFren_Media/kotouce/image/` + data.obrazek : null,
          vektor: data.vektor ? `${serverUrl}/GoldFren_Media/kotouce/vector/` + data.vektor : null,
          cislo_dilu: data.cislo_dilu,
          typ: data.typ,
          vnejsi_prumer: data.od,
          roztecny_prumer: data.hd,
          vnitrni_prumer: data.id,
          tloustka: data.thk,
          konkurence_branking: data.konkurence_branking,
          konkurence_ngbrakes: data.konkurence_ngbrakes,
          poznamka: data.poznamka,
        };
      }
      return {};
    },

    // Kotouc vozidla transformed data
    kotouc_vozidla: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          vyrobce: item.vyrobce,
          kategorie: item.kategorie,
          subkategorie: item.subkategorie,
          oznaceni_vozidla: item.oznaceni_vozidla,
          objem: item.objem,
          rok_od: item.rok_od,
          rok_do: item.rok_do,
          pozice: item.pozice,
        }));
      }
      return [];
    },

    // Hadicky transformed data
    hadicky: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/hadicky/image/` + item.obrazek : null,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/hadicky/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          poznamka: item.poznamka,
        }));
      }
      return [];
    },

    // Hadicka detail transformed data
    hadicka_detail: (data) => {
      if (data) {
        return {
          ...data,
          id: data.kod,
          obrazek: data.obrazek ? `${serverUrl}/GoldFren_Media/hadicky/image/` + data.obrazek : null,
          vektor: data.vektor ? `${serverUrl}/GoldFren_Media/hadicyk/vector/` + data.vektor : null,
          cislo_dilu: data.cislo_dilu,
          poznamka: data.poznamka,
        };
      }
      return {};
    },

    // Hadicka vozidla transformed data
    hadicka_vozidla: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          vyrobce: item.vyrobce,
          kategorie: item.kategorie,
          subkategorie: item.subkategorie,
          oznaceni_vozidla: item.oznaceni_vozidla,
          objem: item.objem,
          rok_od: item.rok_od,
          rok_do: item.rok_do,
          pozice: item.pozice,
        }));
      }
      return [];
    },

    // Pumpy transformed data
    pumpy: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/pumpy/image/` + item.obrazek : null,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/pumpy/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          prumer: item.prumer,
          popis: item.popis,
          poznamka: item.poznamka,
        }));
      }
      return [];
    },

    // Pumpa detail transformed data
    pumpa_detail: (data) => {
      if (data) {
        return {
          ...data,
          id: data.kod,
          obrazek: data.obrazek ? `${serverUrl}/GoldFren_Media/pumpy/image/` + data.obrazek : null,
          vektor: data.vektor ? `${serverUrl}/GoldFren_Media/pumpy/vector/` + data.vektor : null,
          cislo_dilu: data.cislo_dilu,
          prumer: data.prumer,
          popis: data.popis,
          poznamka: data.poznamka,
        };
      }
      return {};
    },

    // Pumpa vozidla transformed data
    pumpa_vozidla: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          vyrobce: item.vyrobce,
          kategorie: item.kategorie,
          subkategorie: item.subkategorie,
          oznaceni_vozidla: item.oznaceni_vozidla,
          objem: item.objem,
          rok_od: item.rok_od,
          rok_do: item.rok_do,
          pozice: item.pozice,
        }));
      }
      return [];
    },

    // Prislusenstvi transformed data
    prislusenstvi: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/prislusenstvi/image/` + item.obrazek : null,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/prislusenstvi/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          popis: item.popis,
          poznamka: item.poznamka,
        }));
      }
      return [];
    },

    // Prislusenstvi detail transformed data
    prislusenstvi_detail: (data) => {
      if (data) {
        return {
          ...data,
          id: data.kod,
          obrazek: data.obrazek ? `${serverUrl}/GoldFren_Media/prislusenstvi/image/` + data.obrazek : null,
          vektor: data.vektor ? `${serverUrl}/GoldFren_Media/prislusenstvi/vector/` + data.vektor : null,
          cislo_dilu: data.cislo_dilu,
          typ: data.typ,
          popis: data.popis,
          poznamka: data.poznamka,
        };
      }
      return {};
    },

    // Prislusenstvi vozidla transformed data
    prislusenstvi_vozidla: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          vyrobce: item.vyrobce,
          kategorie: item.kategorie,
          subkategorie: item.subkategorie,
          oznaceni_vozidla: item.oznaceni_vozidla,
          objem: item.objem,
          rok_od: item.rok_od,
          rok_do: item.rok_do,
          pozice: item.pozice,
        }));
      }
      return [];
    },

    // Pad transformed data
    pad: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/desticky/image/` + item.obrazek : null,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/desticky/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          material_text: item.material,
          oem_cisla: item.oem_cisla,
          obchodni_nazev: item.obchodni_nazev,
          // Konurence
          konkurence_sbs: item.konkurence_sbs,
          konkurence_ebc: item.konkurence_ebc,
          konkurence_ferodo: item.konkurence_ferodo,
          konkurence_a2z: item.konkurence_a2z,
          konkurence_rapco: item.konkurence_rapco,
          konkurence_grove: item.konkurence_grove,
          konkurence_cleveland: item.konkurence_konkurence_cleveland,
          konkurence_matco: item.konkurence_matco,
          pozice: item.pozice,
        }));
      }
      return [];
    },

    // Caliper transformed data 
    caliper: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/brzdice/image/` + item.obrazek : null,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/brzdice/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ_uchyceni: item.typ_uchyceni,
          pocet_pistku: item.pocet_pistku,
          popis: item.popis,
          pozice: item.pozice
        }));
      }
      return [];
    },

    // Adapter transformed data
    adapter: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/adaptery/image/` + item.obrazek : null,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/adaptery/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          prumer: item.prumer,
          popis: item.popis,
          typ_uchyceni: item.typ_uchyceni,
          roztec_brzdice: item.roztec_brzdice,
          pozice: item.pozice,
        }));
      }
      return [];
    },

    // Disc transformed data
    disc: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          vektor: item.vektor ? `${serverUrl}/GoldFren_Media/kotouce/vector/` + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          vnejsi_prumer: item.vnejsi_prumer,
          roztecny_prumer: item.roztecny_prumer,
          vnitrni_prumer: item.vnitrni_prumer,
          tloustka: item.tloustka,
          pozice: item.pozice,
        }));
      }
      return [];
    },

    // Adaptery for sortiment transformed data
    adaptery_sortiment: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          cislo_dilu: item.cislo_dilu,
          prumer: item.prumer,
          typ_uchyceni: item.typ_uchyceni,
          roztec_brzdice: item.roztec_brzdice,
          pozice: item.pozice,
          oznaceni_vozidla: item.oznaceni_vozidla,
        }));
      }
      return [];
    },

    // Brzdice for sortiment transformed data
    brzdice_sortiment: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          cislo_dilu: item.cislo_dilu,
          typ_uchyceni: item.typ_uchyceni,
          pocet_pistku: item.pocet_pistku,
          oznaceni_vozidla: item.oznaceni_vozidla,
        }));
      }
      return [];
    },

    // Desticky for sortiment transformed data
    desticky_sortiment: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          material_text: item.material_text,
          oem_cisla: item.oem_cisla,
          oznaceni_vozidla: item.oznaceni_vozidla,
        }));
      }
      return [];
    },

    // Kotouce for sortiment transformed data
    kotouce_sortiment: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          vnejsi_prumer: item.od,
          roztecny_prumer: item.hd,
          vnitrni_prumer: item.id,
          tloustka: item.thk,
          oznaceni_vozidla: item.oznaceni_vozidla,
        }));
      }
      return [];
    },

    // Hadicky for sortiment transformed data
    hadicky_sortiment: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          cislo_dilu: item.cislo_dilu,
          poznamka: item.poznamka,
          oznaceni_vozidla: item.oznaceni_vozidla,
        }));
      }
      return [];
    },

    // Pumpy for sortiment transformed data
    pumpy_sortiment: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          cislo_dilu: item.cislo_dilu,
          prumer: item.prumer,
          oznaceni_vozidla: item.oznaceni_vozidla,
        }));
      }
      return [];
    },

    // Prislusenstvi for sortiment transformed data
    prislusenstvi_sortiment: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          poznamka: item.poznamka,
          oznaceni_vozidla: item.oznaceni_vozidla,
        }));
      }
      return [];
    },
    
  };