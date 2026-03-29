import { 
  extractFileName, 
  isFileObject, 
  generateFilename, 
  removeEmptyDictFromArray 
} from "../../utils/utils";

// Helper function to normalize board data structure
const normalizeBoard = (board) => ({
  assigned: Array.isArray(board?.assigned) ? board.assigned : [],
  changes: Array.isArray(board?.changes) ? board.changes : [],
  available: Array.isArray(board?.available) ? board.available : [],
});

// Helper function to transform board data into INS/DEL operations
const transformBoardToOperations = (board) => {
  const normalized = normalizeBoard(board);
  const changes = normalized.changes || [];

  // INS: items with action === "added" (user added from available)
  const INS = changes
    .filter((item) => item.action === "added")
    .map((item) => ({
      kod: item.kod,
      pozice: item.pozice,
      source: "added_from_available",
    }));

  // DEL: items with action === "removed" (user removed from assigned)
  const DEL = changes
    .filter((item) => item.action === "removed")
    .map((item) => ({
      kod: item.kod,
      pozice: item.pozice,
      source: "removed_from_assigned",
    }));

  // Build result object only with operations that have items
  const result = {};
  if (INS.length > 0) {
    result.INS = INS;
  }
  if (DEL.length > 0) {
    result.DEL = DEL;
  }

  return result;
};

export function transformFormData(category, formData, componentId = null) {
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
        obrazek: isFileObject(formData.obrazek) ? generateFilename(formData.obrazek, componentId) : (formData.obrazek ? extractFileName(formData.obrazek) : null),
        vektor: isFileObject(formData.vektor) ? generateFilename(formData.vektor, componentId) : (formData.vektor ? extractFileName(formData.vektor) : null),
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
        obrazek: isFileObject(formData.obrazek) ? generateFilename(formData.obrazek, componentId) : (formData.obrazek ? extractFileName(formData.obrazek) : null),
        vektor: isFileObject(formData.vektor) ? generateFilename(formData.vektor, componentId) : (formData.vektor ? extractFileName(formData.vektor) : null),
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
        obrazek: isFileObject(formData.obrazek) ? generateFilename(formData.obrazek, componentId) : (formData.obrazek ? extractFileName(formData.obrazek) : null),
        vektor: isFileObject(formData.vektor) ? generateFilename(formData.vektor, componentId) : (formData.vektor ? extractFileName(formData.vektor) : null),
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
            material: formData.material_plech_a_material || null,
            tloustka: parseFloat(formData.material_plech_a_tloustka) || null,
            matrice: formData.material_plech_a_matrice || null,
          },
          plech_b: {
            material: formData.material_plech_b_material || null,
            tloustka: parseFloat(formData.material_plech_b_tloustka) || null,
            matrice: formData.material_plech_b_matrice || null,
          },
          izolator_a: {
            material: formData.material_izolator_a_material || null,
            tloustka: parseFloat(formData.material_izolator_a_tloustka) || null,
            matrice: formData.material_izolator_a_matrice || null,
          },
          izolator_b: {
            material: formData.material_izolator_b_material || null,
            tloustka: parseFloat(formData.material_izolator_b_tloustka) || null,
            matrice: formData.material_izolator_b_matrice || null,
          },
          segment_a: {
            material: formData.material_segment_a_material || null,
            tloustka: parseFloat(formData.material_segment_a_tloustka) || null,
            matrice: formData.material_segment_a_matrice || null,
          },
          segment_b: {
            material: formData.material_segment_b_material || null,
            tloustka: parseFloat(formData.material_segment_b_tloustka) || null,
            matrice: formData.material_segment_b_matrice || null,
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
        obrazek: isFileObject(formData.obrazek) ? generateFilename(formData.obrazek, componentId) : (formData.obrazek ? extractFileName(formData.obrazek) : null),
        vektor: isFileObject(formData.vektor) ? generateFilename(formData.vektor, componentId) : (formData.vektor ? extractFileName(formData.vektor) : null),
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
        obrazek: isFileObject(formData.obrazek) ? generateFilename(formData.obrazek, componentId) : (formData.obrazek ? extractFileName(formData.obrazek) : null),
        vektor: isFileObject(formData.vektor) ? generateFilename(formData.vektor, componentId) : (formData.vektor ? extractFileName(formData.vektor) : null),
        cislo_dilu: formData.cislo_dilu || "",
        publikovat: !!formData.publikovat,
        aktualizovano: new Date().toISOString(),
        poznamka: formData.poznamka || null,

        // Hadicky specific fields
        typ: formData.typ || null,
        is_superbike: !!formData.is_superbike,
        is_homologation: !!formData.is_homologation,
        homologacni_cislo: formData.homologacni_cislo || null,
        is_brake_active: !!formData.is_brake_active,
        system_brzdy: formData.system_brzdy || null,
        fitting: formData.fitting || null,
        tuv_certifikat: !!formData.tuv_certifikat,
        kod_sady: formData.kod_sady || null,
        zavit_hlavni_valec: formData.zavit_hlavni_valec || null,
        zavit_trmen_roztec: formData.zavit_trmen_roztec || null,
        zavit_roztec: formData.zavit_roztec || null,
        montazni_navod: formData.montazni_navod || null,
        pocet_hadicek: formData.pocet_hadicek || null,

        // Hadicky complex fileds 
        // Hadicka - detail_trubicek (delka, fitting_kontektoru_a, fitting_kontektoru_b, zapojeni_a, zapojeni_b)
        detail_trubicek: removeEmptyDictFromArray(formData.detail_trubicek || []),

        // Hadicka - detail_prislusenstvi (nazev, pocet)
        detail_prislusenstvi: removeEmptyDictFromArray(formData.detail_prislusenstvi || []),
    };

    // Pumpy category data transformation
    case "pumpy":
      return {
        // Default data fields
        kategorie: parseInt(formData.kategorie) || null,
        obrazek: isFileObject(formData.obrazek) ? generateFilename(formData.obrazek, componentId) : (formData.obrazek ? extractFileName(formData.obrazek) : null),
        vektor: isFileObject(formData.vektor) ? generateFilename(formData.vektor, componentId) : (formData.vektor ? extractFileName(formData.vektor) : null),
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
        obrazek: isFileObject(formData.obrazek) ? generateFilename(formData.obrazek, componentId) : (formData.obrazek ? extractFileName(formData.obrazek) : null),
        vektor: isFileObject(formData.vektor) ? generateFilename(formData.vektor, componentId) : (formData.vektor ? extractFileName(formData.vektor) : null),
        cislo_dilu: formData.cislo_dilu || "",
        typ: formData.typ || null,
        publikovat: !!formData.publikovat,
        aktualizovano: new Date().toISOString(),
        poznamka: formData.poznamka || null,

        // Prislusenstvi specific fields
        popis: formData.popis || null
    };

    // Vozidla category data transformation
    case "vozidla":
      return {
        // Default data fields
        kod: formData.kod || null,
        kategorie: parseInt(formData.kategorie) || null,
        subkategorie: parseInt(formData.subkategorie) || null,
        vyrobce: formData.vyrobce || "",
        typ: formData.typ || "",
        oznaceni: formData.oznaceni || "",
        poznamka: formData.poznamka || "",
        rok_od: formData.rok_od ? parseInt(formData.rok_od) : null,
        rok_do: formData.rok_do ? parseInt(formData.rok_do) : null,
        vykon: formData.vykon ? parseFloat(formData.vykon) : null,
        objem: formData.objem ? parseFloat(formData.objem) : null,
        publikovat: !!formData.publikovat,
        aktualizovano: new Date().toISOString(),
    };

    // Vozidlo sortiment data transformation
    case "vozidlo_sortiment":
      return {
        adaptery: transformBoardToOperations(formData.adaptery),
        brzdice: transformBoardToOperations(formData.brzdice),
        desticky: transformBoardToOperations(formData.desticky),
        kotouce: transformBoardToOperations(formData.kotouce),
        hadicky: transformBoardToOperations(formData.hadicky),
        pumpy: transformBoardToOperations(formData.pumpy),
        prislusenstvi: transformBoardToOperations(formData.prislusenstvi),
      };

    // Vyrobce category data transformation
    case "vyrobce":
      return {
        kategorie: parseInt(formData.kategorie) || null,
        nazev: formData.nazev || "",
        publikovat: !!formData.publikovat,
    };

    // Default case for unsupported categories
    default:
      throw new Error(`Unsupported category to edit data: ${category}`);
  }
}