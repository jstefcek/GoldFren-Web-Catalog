export function transformFormData(category, formData) {
  switch (category) {
    
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
            tloustka: parseFloat(formData.material?.plech_a?.tloustka) || 0.0,
            matrice: formData.material?.plech_a?.matrice || null,
          },
          plech_b: {
            material: formData.material?.plech_b?.material || null,
            tloustka: parseFloat(formData.material?.plech_b?.tloustka) || 0.0,
            matrice: formData.material?.plech_b?.matrice || null,
          },
          izolator_a: {
            material: formData.material?.izolator_a?.material || null,
            tloustka: parseFloat(formData.material?.izolator_a?.tloustka) || 0.0,
            matrice: formData.material?.izolator_a?.matrice || null,
          },
          izolator_b: {
            material: formData.material?.izolator_b?.material || null,
            tloustka: parseFloat(formData.material?.izolator_b?.tloustka) || 0.0,
            matrice: formData.material?.izolator_b?.matrice || null,
          },
          segment_a: {
            material: formData.material?.segment_a?.material || null,
            tloustka: parseFloat(formData.material?.segment_a?.tloustka) || 0.0,
            matrice: formData.material?.segment_a?.matrice || null,
          },
          segment_b: {
            material: formData.material?.segment_b?.material || null,
            tloustka: parseFloat(formData.material?.segment_b?.tloustka) || 0.0,
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

    // case "brzdice":
    //   return transformBrzdice(formData);

    // Default case for unsupported categories
    default:
      throw new Error(`Unsupported category: ${category}`);
  }
}

// Helper function to extract file name from a URL or path
function extractFileName(urlOrPath) {
  return urlOrPath?.split("/").pop();
}
