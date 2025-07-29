export function transformFormData(category, formData) {
  switch (category) {
    // User category data transformation
    case "users":
      return {
        // Default data fields
        first_name: formData.first_name || "",
        last_name: formData.last_name || "",
        email: formData.email || "",
        is_staff: !!formData.is_staff,
        is_valid: !!formData.is_valid,
    };

    // Adaptery category data transformation
    case "adaptery":
      return {
        // Default data fields
        kategorie: parseInt(formData.kategorie) || null,
        obrazek: formData.obrazek ? extractFileName(formData.obrazek) : null,
        vektor: formData.vektor ? extractFileName(formData.vektor) : null,
        cislo_dilu: formData.cislo_dilu || "",
        typ: parseInt(formData.typ) || null,
        publikovat: !!formData.publikovat,
        aktualizovano: new Date().toISOString(),
        poznamka: formData.poznamka || null,

        // Adaptery specific fields
        prumer: parseFloat(formData.prumer) || 0.0,
        typ_uchyceni: formData.typ_uchyceni || "",
        roztec_brzdic: parseFloat(formData.roztec_brzdic) || 0.0,
        popis: formData.popis || null,
    };

    // Brzdice category data transformation
    case "brzdice":
      return {
        // Default data fields
        kategorie: parseInt(formData.kategorie) || null,
        obrazek: formData.obrazek ? extractFileName(formData.obrazek) : null,
        vektor: formData.vektor ? extractFileName(formData.vektor) : null,
        cislo_dilu: formData.cislo_dilu || "",
        publikovat: !!formData.publikovat,
        aktualizovano: new Date().toISOString(),
        poznamka: formData.poznamka || null, 

        // Brzdice specific fields
        typ_uchyceni: formData.typ_uchyceni || "",
        pocet_pistku: parseInt(formData.pocet_pistku) || null,
        popis: formData.popis || null,
    };

    // Desticky category data transformation
    case "desticky":
      return {
        // Default data fields
        kategorie: parseInt(formData.kategorie) || null,
        obrazek: formData.obrazek ? extractFileName(formData.obrazek) : null,
        vektor: formData.vektor ? extractFileName(formData.vektor) : null,
        cislo_dilu: formData.cislo_dilu || "",
        typ: parseInt(formData.typ) || null,
        publikovat: !!formData.publikovat,
        aktualizovano: new Date().toISOString(),
        obchodni_nazev: formData.obchodni_nazev || null,
        material_text: formData.material_text || "",
        poznamka: formData.poznamka || null,
        oem_cisla: formData.oem_cisla || "",

        // Material data
        material: {
          plech_a: {
            material: formData.material?.plech_a?.material || null,
            tloustka: parseFloat(formData.material?.plech_a?.tloustka) || null,
            matrice: formData.material?.plech_a?.matrice || null,
          },
          plech_b: {
            material: formData.material?.plech_b?.material || null,
            tloustka: parseFloat(formData.material?.plech_b?.tloustka) || null,
            matrice: formData.material?.plech_b?.matrice || null,
          },
          izolator_a: {
            material: formData.material?.izolator_a?.material || null,
            tloustka: parseFloat(formData.material?.izolator_a?.tloustka) || null,
            matrice: formData.material?.izolator_a?.matrice || null,
          },
          izolator_b: {
            material: formData.material?.izolator_b?.material || null,
            tloustka: parseFloat(formData.material?.izolator_b?.tloustka) || null,
            matrice: formData.material?.izolator_b?.matrice || null,
          },
          segment_a: {
            material: formData.material?.segment_a?.material || null,
            tloustka: parseFloat(formData.material?.segment_a?.tloustka) || null,
            matrice: formData.material?.segment_a?.matrice || null,
          },
          segment_b: {
            material: formData.material?.segment_b?.material || null,
            tloustka: parseFloat(formData.material?.segment_b?.tloustka) || null,
            matrice: formData.material?.segment_b?.matrice || null,
          },
        },

        // Konkurence data
        konkurence: {
          sbs: formData.konkurence_sbs || null,
          ebc: formData.konkurence_ebc || null,
          ferodo: formData.konkurence_ferodo || null,
          a2z: formData.konkurence_a2z || null,
          rapco: formData.konkurence_rapco || null,
          grove: formData.konkurence_grove || null,
          cleveland: formData.konkurence_cleveland || null,
          matco: formData.konkurence_matco || null,
        },
      };

    // Kotouce category data transformation
    case "kotouce":
      return {
        // Default data fields
        kategorie: parseInt(formData.kategorie) || null,
        obrazek: formData.obrazek ? extractFileName(formData.obrazek) : null,
        vektor: formData.vektor ? extractFileName(formData.vektor) : null,
        cislo_dilu: formData.cislo_dilu || "",
        typ: formData.typ || null,
        publikovat: !!formData.publikovat,
        aktualizovano: new Date().toISOString(),
        poznamka: formData.poznamka || null,

        // Kotouce specific fields
        konkurence_braking: formData.konkurence_braking || null,
        konkurence_ngbrakes: formData.konkurence_ngbrakes || null,
        od: formData.vnejsi_prumer || null,
        hd: formData.roztecny_prumer || null,
        thk: formData.tloustka || null,
        id: formData.vnitrni_prumer || null
    };

    // Hadicky category data transformation
    case "hadicky":
      return {
        // Default data fields
        kategorie: parseInt(formData.kategorie) || null,
        obrazek: formData.obrazek ? extractFileName(formData.obrazek) : null,
        vektor: formData.vektor ? extractFileName(formData.vektor) : null,
        cislo_dilu: formData.cislo_dilu || "",
        typ: parseInt(formData.typ) || null,
        publikovat: !!formData.publikovat,
        aktualizovano: new Date().toISOString(),
        poznamka: formData.poznamka || null,

        // Hadicky specific fields
        popis: formData.popis || null
    };

    // Pumpy category data transformation
    case "pumpy":
      return {
        // Default data fields
        kategorie: parseInt(formData.kategorie) || null,
        obrazek: formData.obrazek ? extractFileName(formData.obrazek) : null,
        vektor: formData.vektor ? extractFileName(formData.vektor) : null,
        cislo_dilu: formData.cislo_dilu || "",
        typ: parseInt(formData.typ) || null,
        publikovat: !!formData.publikovat,
        aktualizovano: new Date().toISOString(),
        poznamka: formData.poznamka || null,

        // Pumpy specific fields
        prumer: parseFloat(formData.prumer) || null,
        popis: formData.popis || null
    };

    // Prislusenstvi category data transformation
    case "prislusenstvi":
      return {
        // Default data fields
        kategorie: parseInt(formData.kategorie) || null,
        obrazek: formData.obrazek ? extractFileName(formData.obrazek) : null,
        vektor: formData.vektor ? extractFileName(formData.vektor) : null,
        cislo_dilu: formData.cislo_dilu || "",
        typ: formData.typ || null,
        publikovat: !!formData.publikovat,
        aktualizovano: new Date().toISOString(),
        poznamka: formData.poznamka || null,

        // Prislusenstvi specific fields
        popis: formData.popis || null
    };

    // Default case for unsupported categories
    default:
      throw new Error(`Unsupported category: ${category}`);
  }
}

// Helper function to extract file name from a URL or path
function extractFileName(urlOrPath) {
  return urlOrPath?.split("/").pop();
}
