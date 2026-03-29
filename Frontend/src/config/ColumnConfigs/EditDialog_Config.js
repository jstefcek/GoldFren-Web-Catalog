const serverUrl = import.meta.env.VITE_API_URL;

export const SelectValueConfig = {
  // Vyrobce category
  vyrobce: [
    {api: `${serverUrl}/api/goldfren/internal/vozidla/vyrobce`, param_key: "kategorie_kod", param_value: "kategorie"},
  ],

  // Vehicle categorie
  kategorie_vozidel: [
    {id: 1, label: "Motocykly", value: 1},
    {id: 2, label: "Automobily", value: 2},
    {id: 3, label: "Jízdní kola", value: 3},
    {id: 4, label: "Letadla", value: 4},
    {id: 5, label: "Průmysl", value: 5},
    {id: 6, label: "Motokáry", value: 6},
  ],

  // Vehicle subcategorie
  subkategorie_vozidel: [
    {id: 1, label: "Motocross", category: "Motocykly", value: 1},
    {id: 2, label: "Silniční", category: "Motocykly",  value: 2},
    {id: 3, label: "ATV", category: "Motocykly", value: 3},
    {id: 4, label: "Závodní", category: "Motocykly", value: 4},
    {id: 5, label: "Bike", category: "Motocykly", value: 5},
    {id: 6, label: "Nezařazeno", category: "Motocykly", value: 6},
    {id: 7, label: "Motard", category: "Motocykly", value: 7},
    {id: 8, label: "Nezařazeno", category: "Automobily", value: 8},
    {id: 9, label: "Osobní", category: "Automobily", value: 9},
    {id: 10, label: "Závodní", category: "Automobily", value: 10},
    {id: 11, label: "Kamión", category: "Automobily", value: 11},
    {id: 12, label: "Nezařazeno", category: "Jízdní kola", value: 12},
    {id: 13, label: "Horské kolo", category: "Jízdní kola", value: 13},
    {id: 14, label: "Rám", category: "Jízdní kola", value: 14},
    {id: 15, label: "Nezařazeno", category: "Letadla", value: 15},
    {id: 16, label: "-", category: "Letadla", value: 16},
    {id: 17, label: "Nezařazeno", category: "Průmysl", value: 17},
    {id: 18, label: "-", category: "Průmysl", value: 18},
    {id: 19, label: "Nezařazeno", category: "Motokáry", value: 19},
    {id: 20, label: "Závodní", category: "Motokáry", value: 20},
    {id: 21, label: "Sněžný", category: "Motocykly", value: 21},
  ],

  // Attachment type
  typ_uchyceni: [
    {id: 1, label: "Axis", value: "Axis"},
    {id: 2, label: "Radial", value: "Radial"},
  ],

  // Desticky type 
  typ_desticky: [
    {id: 1, label: "L a P stejné", value: 1},
    {id: 2, label: "L a P zrcadlové", value: 2},
    {id: 3, label: "L a P různé", value: 3},
  ],

  // Kotouc type
  typ_kotouce: [
    {id: 1, label: "OEM", value: 1},
    {id: 2, label: "Oversize", value: 2},
  ]
};

// Function to build sortiment board data structure
const buildSortimentBoard = (row = {}) => {
  const assigned = [];
  const groupedAssigned =
    row.sortimenty_grouped ||
    row.prirazene_sortimenty ||
    row.prirazene_polozky ||
    {};

  Object.entries(groupedAssigned).forEach(([groupKey, items]) => {
    (items || []).forEach((item) => {
      assigned.push({
        ...item,
        group: item.group || groupKey,
      });
    });
  });

  const available = (row.dostupne_sortimenty || row.available_sortimenty || []).map(
    (item) => ({
      ...item,
      group: item.group || item.type || "general",
    })
  );

  return {
    assigned,
    available,
    changes: [],
  };
};

export const dialogColumnsConfig = {
  // Edit dialog configuration
  
  // User configuration
  users: {
    primaryKey: "id",
    editEndpoint: (id) => `${serverUrl}/api/goldfren/internal/users/${id}`,
    fields: [
      {key: "id", label: "ID", type: "text", placeholder: "", editable: false, show: false, dataType: "string", },
      {key: "username", label: "Uživatelské jméno", placeholder: "", type: "input", editable: false, show: true, dataType: "string", },
      {key: "first_name", label: "Křestní jméno", placeholder: "Zadejte křestní jméno", type: "input", editable: true, show: true, dataType: "string", required: true },
      {key: "last_name", label: "Přijmení", placeholder: "Zadejte přijmení", type: "input", editable: true, show: true, dataType: "string", required: true },
      {key: "email", label: "E-mail", placeholder: "Zadejte e-mail", type: "input", editable: true, show: true, dataType: "string", required: true},
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "is_staff", label: "Administrátorská práva", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: false, show: true, dataType: "boolean", },
      {key: "is_valid", label: "Status účtu", type: "button", buttonValue: { true: "Aktivní", false: "Deaktivován" }, editable: true, show: true, dataType: "boolean", },
      {key: "date_joined", label: "Datum registrace uživatele", placeholder: "", type: "text", editable: false, show: true, dataType: "date", },
      {key: "last_login", label: "Poslední přihlášení", placeholder: "", type: "text", editable: false, show: true, dataType: "date", },
    ],
  },

  // Adapter configuration
  adaptery: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/adaptery/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", required: true },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek adaptéru", type: "image", editable: true, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor adaptéru", type: "image", editable: true, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie adaptéru", placeholder: "Vyberte kategorii adaptéru", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
      {key: "typ", label: "Typ adaptéru", placeholder: "Zadejte typ adaptéru", type: "input", editable: true, show: true, dataType: "string", },
      {key: "prumer", label: "Průměr adaptéru [mm]", placeholder: "Zadejte průměr adaptéru", type: "input", editable: true, show: true, dataType: "string", required: true },
      {key: "typ_uchyceni", label: "Typ uchycení", placeholder: "Zadejte typ uchycení", value: SelectValueConfig.typ_uchyceni, type: "select", editable: true, show: true, dataType: "string", required: true },
      {key: "roztec_brzdice", label: "Rozteč brzdiče [mm]", placeholder: "Zadejte rozteč brzdiče", type: "input", editable: true, show: true, dataType: "string", },
      {key: "popis", label: "Popis adaptéru", placeholder: "Zadejte popis adaptéru", type: "input", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "publikovat", label: "Publikovat?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: false, show: true, dataType: "date", },
    ],
  },

  // Brzdice configuration
  brzdice: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/brzdice/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", required: true },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek brzdiče", type: "image", editable: true, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor brzdiče", type: "image", editable: true, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie brzdiče", placeholder: "Vyberte kategorii brzdiče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
      {key: "typ_uchyceni", label: "Typ uchycení", placeholder: "Zadejte typ uchycení", type: "input", editable: true, show: true, dataType: "string", required: true },
      {key: "pocet_pistku", label: "Počet pístků", placeholder: "Zadejte počet pístků", type: "input", editable: true, show: true, dataType: "string", },
      {key: "popis", label: "Popis brzdiče", placeholder: "Zadejte popis brzdiče", type: "input", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: false, show: true, dataType: "date", },
    ],
  },

  // Desticky configuration
  desticky: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/desticky/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", required: true },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek destičky", type: "image", editable: true, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor destičky", type: "image", editable: true, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie destičky", placeholder: "Vyberte kategorii destičky", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
      {key: "typ", label: "Typ destičky", value: SelectValueConfig.typ_desticky, type: "select", editable: true, show: true, dataType: "string", required: true },
      {key: "material_text", label: "Materiál", placeholder: "Zadejte materiál", type: "textarea", editable: true, show: true, dataType: "string", },
      {key: "oem_cisla", label: "OEM čísla", placeholder: "Zadejte OEM čísla", type: "textarea", editable: true, show: true, dataType: "string", },
      {key: "konkurence_sbs", label: "SBS", placeholder: "Zadejte konkurenci SBS", type: "input", editable: true, show: true, dataType: "string", },
      {key: "konkurence_ebc", label: "EBC", placeholder: "Zadejte konkurenci EBC", type: "input", editable: true, show: true, dataType: "string", },
      {key: "konkurence_ferodo", label: "Ferodo", placeholder: "Zadejte konkurenci Ferodo", type: "input", editable: true, show: true, dataType: "string", },
      {key: "konkurence_a2z", label: "A2Z", placeholder: "Zadejte konkurenci A2Z", type: "input", editable: true, show: true, dataType: "string", },
      {key: "konkurence_rapco", label: "Rapco", placeholder: "Zadejte konkurenci Rapco", type: "input", editable: true, show: true, dataType: "string", },
      {key: "konkurence_grove", label: "Grove", placeholder: "Zadejte konkurenci Grove", type: "input", editable: true, show: true, dataType: "string", },
      {key: "konkurence_cleveland", label: "Cleveland", placeholder: "Zadejte konkurenci Cleveland", type: "input", editable: true, show: true, dataType: "string", },
      {key: "konkurence_matco", label: "Matco", placeholder: "Zadejte konkurenci Matco", type: "input", editable: true, show: true, dataType: "string", },

      {key: "material_label", label: "Specifikace materiálu destičky", type: "label", label_type: "big", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "material_plech_a_label", label: "Plech A", type: "label", label_type: "medium", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "material_plech_a_material", label: "Materiál", placeholder: "Zadejte materiál plechu A", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_plech_a_tloustka", label: "Tloušťka", placeholder: "Zadejte tloušťku plechu A", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_plech_a_matrice", label: "Matrice", placeholder: "Zadejte matrici plechu A", type: "input", editable: true, show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },

      {key: "material_plech_b_label", label: "Plech B", type: "label", label_type: "medium", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "material_plech_b_material", label: "Materiál plechu B", placeholder: "Zadejte materiál plechu B", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_plech_b_tloustka", label: "Tloušťka plechu B", placeholder: "Zadejte tloušťku plechu B", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_plech_b_matrice", label: "Matrice plechu B", placeholder: "Zadejte matrici plechu B", type: "input", editable: true, show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },

      {key: "material_izolator_a_label", label: "Izolátor A", type: "label", label_type: "medium", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "material_izolator_a_material", label: "Materiál izolátoru A", placeholder: "Zadejte materiál izolátoru A", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_izolator_a_tloustka", label: "Tloušťka izolátoru A", placeholder: "Zadejte tloušťku izolátoru A", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_izolator_a_matrice", label: "Matrice izolátoru A", placeholder: "Zadejte matrici izolátoru A", type: "input", editable: true, show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      
      {key: "material_izolator_b_label", label: "Izolátor B", type: "label", label_type: "medium", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "material_izolator_b_material", label: "Materiál izolátoru B", placeholder: "Zadejte materiál izolátoru B", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_izolator_b_tloustka", label: "Tloušťka izolátoru B", placeholder: "Zadejte tloušťku izolátoru B", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_izolator_b_matrice", label: "Matrice izolátoru B", placeholder: "Zadejte matrici izolátoru B", type: "input", editable: true, show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },

      {key: "material_segment_a_label", label: "Segment A", type: "label", label_type: "medium", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "material_segment_a_material", label: "Materiál segmentu A", placeholder: "Zadejte materiál segmentu A", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_segment_a_tloustka", label: "Tloušťka segmentu A", placeholder: "Zadejte tloušťku segmentu A", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_segment_a_matrice", label: "Matrice segmentu A", placeholder: "Zadejte matrici segmentu A", type: "input", editable: true, show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      
      {key: "material_segment_b_label", label: "Segment B", type: "label", label_type: "medium", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "material_segment_b_material", label: "Materiál segmentu B", placeholder: "Zadejte materiál segmentu B", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_segment_b_tloustka", label: "Tloušťka segmentu B", placeholder: "Zadejte tloušťku segmentu B", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_segment_b_matrice", label: "Matrice segmentu B", placeholder: "Zadejte matrici segmentu B", type: "input", editable: true, show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },

      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: false, show: true, dataType: "date", },
    ],
  },

  // Kotouce configuration
  kotouce: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/kotouce/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", required: true },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek kotouče", type: "image", editable: true, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor kotouče", type: "image", editable: true, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie kotouče", placeholder: "Vyberte kategorii kotouče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
      {key: "typ", label: "Typ kotouče", value: SelectValueConfig.typ_kotouce, type: "select", editable: true, show: true, dataType: "string", required: true },
      {key: "poznamka", label: "Poznámka", type: "input", editable: true, show: true, dataType: "string", },
      {key: "vnejsi_prumer", label: "Průměr vnější (mm)", placeholder: "Zadejte vnější průměr", type: "input", editable: true, show: true, dataType: "string", required: true },
      {key: "roztecny_prumer", label: "Rozteč děr kotouče (mm)", placeholder: "Zadejte rozteč děr", type: "input", editable: true, show: true, dataType: "string", required: true },
      {key: "vnitrni_prumer", label: "Vnitřní průměr (mm)", placeholder: "Zadejte vnitřní průměr", type: "input", editable: true, show: true, dataType: "string", required: true },
      {key: "tloustka", label: "Tloušťka kotouče (mm)", placeholder: "Zadejte tloušťku kotouče", type: "input", editable: true, show: true, dataType: "string", required: true },
      {key: "konkurence_braking", label: "Braking", placeholder: "Zadejte konkurenci Braking", type: "input", editable: true, show: true, dataType: "string", },
      {key: "konkurence_ngbrakes", label: "NGBrakes", placeholder: "Zadejte konkurenci NGBrakes", type: "input", editable: true, show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: false, show: true, dataType: "date", },
    ],
  },

  // Hadicky configuration
  hadicky: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/hadicky/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", required: true },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      
      {key: "obrazek", label: "Obrázek hadičky", type: "image", editable: true, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor hadičky", type: "image", editable: true, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie hadičky", placeholder: "Vyberte kategorii hadičky", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
      {key: "poznamka", label: "Poznámka", type: "input", placeholder: "Zadejte poznámku", editable: true, show: true, dataType: "string", },
      
      {key: "typ", label: "Typ", type: "input", placeholder: "Zadejte typ", editable: true, show: true, dataType: "string", },
      {key: "is_superbike", label: "Pro superbike?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      
      {key: "homologace_label", label: "Homologace hadičky", type: "label", label_type: "big", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "is_homologation", label: "Existuje homologace?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "homologacni_cislo", label: "Homologační číslo", type: "input", placeholder: "Zadejte homologační číslo", editable: true, show: true, dataType: "string", },

      {key: "brzda_label", label: "Typ brzdy", type: "label", label_type: "big", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "is_brake_active", label: "Je brzda aktivní?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "system_brzdy", label: "Systém brzdy", type: "input", placeholder: "Zadejte systém brzdy", editable: true, show: true, dataType: "string", },

      {key: "zavit_label", label: "Rozměry závitu", type: "label", label_type: "big", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "zavit_hlavni_valec", label: "Hlavní závit válec", type: "input", placeholder: "Zadejte rozteč hlavního závitu válec", editable: true, show: true, dataType: "number", min: 0, max: 10, step: 0.1, decimalPlaces: 1},
      {key: "zavit_trmen_roztec", label: "Rozteč závitu třmenu", type: "input", placeholder: "Zadejte rozteč závitu třmenu", editable: true, show: true, dataType: "number", min: 0, max: 10, step: 0.1, decimalPlaces: 1},
      {key: "zavit_roztec", label: "Rozteč závitu", type: "input", placeholder: "Zadejte rozteč závitu", editable: true, show: true, dataType: "number", min: 0, max: 10, step: 0.1, decimalPlaces: 1},
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },

      {key: "ostatni_label", label: "Ostatní", type: "label", label_type: "big", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "fitting", label: "Fitting hadičky", type: "input", placeholder: "Zadejte fitting hadičky", editable: true, show: true, dataType: "string", },
      {key: "kod_sady", label: "Kód sady", type: "input", placeholder: "Zadejte kód sady", editable: true, show: true, dataType: "string", },
      {key: "tuv_certifikat", label: "TUV certifikát", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "montazni_navod", label: "Montážní návod", type: "input", placeholder: "Zadejte montážní návod", editable: true, show: true, dataType: "string", },

      {key: "trubicky_label", label: "Detail trubiček", type: "label", label_type: "big", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "pocet_hadicek", label: "Počet hadiček", type: "input", placeholder: "Zadejte počet hadiček", editable: true, show: true, dataType: "number", min: 0, max: 20, step: 1},
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "detail_trubicek",  label: "Detailní informace o trubičkách", card_label: "Trubička", type: "card", editable: true, show: true, dataType: "array", fields: [
        {key: "delka", label: "Délka trubičky", type: "input", placeholder: "Zadejte délku trubičky", editable: true, show: true, dataType: "number", min: 0, max: 200, step: 0.1, decimalPlaces: 1},
        {key: "fitting_kontektoru_a", label: "Fitting kontektoru A", type: "input", placeholder: "Zadejte fitting kontektoru A", editable: true, show: true, dataType: "string", },
        {key: "fitting_kontektoru_b", label: "Fitting kontektoru B", type: "input", placeholder: "Zadejte fitting kontektoru B", editable: true, show: true, dataType: "string", },
        {key: "zapojeni_a", label: "Zapojení A", type: "input", placeholder: "Zadejte zapojení A", editable: true, show: true, dataType: "string", },
        {key: "zapojeni_b", label: "Zapojení B", type: "input", placeholder: "Zadejte zapojení B", editable: true, show: true, dataType: "string", },
      ]},

      {key: "prislusenstvi_label", label: "Detail příslušenství", type: "label", label_type: "big", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "detail_prislusenstvi",  label: "Detailní informace o příslušenství", card_label: "Příslušenství", type: "card", editable: true, show: true, dataType: "array", fields: [
        {key: "nazev", label: "Název příslušenství", type: "input", placeholder: "Zadejte název příslušenství", editable: true, show: true, dataType: "string", },
        {key: "pocet", label: "Počet", type: "input", placeholder: "Zadejte počet", editable: true, show: true, dataType: "number", min: 0, max: 25, step: 1},
      ]},

      {key: "stav_label", label: "Publikace a poslední aktualizace", type: "label", label_type: "big", show: true, dataType: "string", },
      {key: "invisible", label: "Invisible Field", type: "invisible", editable: false, show: true, },
      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: false, show: true, dataType: "date", },
    ],
  },

  // Pumpy configuration
  pumpy: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/pumpy/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", required: true },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek pumpy", type: "image", editable: true, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor pumpy", type: "image", editable: true, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie pumpy", placeholder: "Vyberte kategorii pumpy", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
      {key: "prumer", label: "Průměr pumpy [mm]", placeholder: "Zadejte průměr pumpy", type: "input", editable: true, show: true, dataType: "string", required: true },
      {key: "popis", label: "Popis pumpy", placeholder: "Zadejte popis pumpy", type: "input", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", type: "input", editable: true, show: true, dataType: "string", },
      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: false, show: true, dataType: "date", },
    ],
  },

  // Prislusenstvi configuration
  prislusenstvi: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/prislusenstvi/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", required: true },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek příslušenství", type: "image", editable: true, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor příslušenství", type: "image", editable: true, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie příslušenství", placeholder: "Vyberte kategorii příslušenství", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
      {key: "typ", label: "Typ příslušenství", placeholder: "Zadejte typ příslušenství", type: "input", editable: true, show: true, dataType: "string", },
      {key: "popis", label: "Popis příslušenství", placeholder: "Zadejte popis příslušenství", type: "input", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", type: "input", editable: true, show: true, dataType: "string", },
      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: false, show: true, dataType: "date", },
    ],
  },

  // Vehicle configuration
  vozidla: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/vozidla/update/${kod}`,
    fields: [
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "nazev_modelu", label: "Model vozidla", type: "input", editable: false, show: true, dataType: "string", },
      {key: "kategorie", label: "Kategorie vozidla", placeholder: "Vyberte kategorii vozidla", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: false, show: true, dataType: "string", required: true},
      {key: "subkategorie", label: "Subkategorie vozidla", placeholder: "Zadejte subkategorii vozidla", value: SelectValueConfig.subkategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true},
      {key: "vyrobce", label: "Výrobce vozidla", placeholder: "Zadejte výrobce vozidla", value: SelectValueConfig.vyrobce, type: "select", editable: true, show: true, dataType: "string", required: true},
      {key: "typ", label: "Model vozidla", placeholder: "Zadejte model vozidla", type: "input", editable: true, show: true, dataType: "string", required: true},
      {key: "oznaceni", label: "Speciální označení vozidla", placeholder: "Zadejte označení vozidla", type: "textarea", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku k vozidlu", type: "textarea", editable: true, show: true, dataType: "string", },
      {key: "rok_od", label: "Rok od", placeholder: "Zadejte rok výroby od", type: "input", editable: true, show: true, dataType: "string", required: true},
      {key: "rok_do", label: "Rok do", placeholder: "Zadejte rok výroby do", type: "input", editable: true, show: true, dataType: "string", },
      {key: "vykon", label: "Výkon [kW]", placeholder: "Zadejte výkon vozidla", type: "input", editable: true, show: true, dataType: "string", },
      {key: "objem", label: "Objem [cm3]", placeholder: "Zadejte objem vozidla", type: "input", editable: true, show: true, dataType: "string", },
      {key: "publikovat", label: "Publikovat vozidlo?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "text", editable: false, show: true, dataType: "date", },
    ],
  },

  // Vozidlo sortiment configuration
  vozidlo_sortiment: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/vozidla/sortiment/update/${kod}`,
    currentEndpoint: (kod, key) => `${serverUrl}/api/goldfren/internal/vozidla/sortiment/assaigned/${kod}/type/${key}`,
    availableEndpoint: (kod, key) => `${serverUrl}/api/goldfren/internal/vozidla/sortiment/available/${kod}/type/${key}`,
    fields: [
      {key: "adaptery", label: "Adaptéry", type: "setup_board", editable: true, show: true, dataType: "object", boardLabels: {   assigned: "Již přiřazené položky",   changes: "Připravené změny",   available: "Dostupné položky", }, buildInitial: buildSortimentBoard, required: false },
      {key: "brzdice", label: "Brzdiče", type: "setup_board", editable: true, show: true, dataType: "object", boardLabels: {   assigned: "Již přiřazené položky",   changes: "Připravené změny",   available: "Dostupné položky", }, buildInitial: buildSortimentBoard, required: false },
      {key: "desticky", label: "Destičky", type: "setup_board", editable: true, show: true, dataType: "object", boardLabels: {   assigned: "Již přiřazené položky",   changes: "Připravené změny",   available: "Dostupné položky", }, buildInitial: buildSortimentBoard, required: false },
      {key: "kotouce", label: "Kotouče", type: "setup_board", editable: true, show: true, dataType: "object", boardLabels: {   assigned: "Již přiřazené položky",   changes: "Připravené změny",   available: "Dostupné položky", }, buildInitial: buildSortimentBoard, required: false },
      {key: "hadicky", label: "Hadičky", type: "setup_board", editable: true, show: true, dataType: "object", boardLabels: {   assigned: "Již přiřazené položky",   changes: "Připravené změny",   available: "Dostupné položky", }, buildInitial: buildSortimentBoard, required: false },
      {key: "pumpy", label: "Pumpy", type: "setup_board", editable: true, show: true, dataType: "object", boardLabels: {   assigned: "Již přiřazené položky",   changes: "Připravené změny",   available: "Dostupné položky", }, buildInitial: buildSortimentBoard, required: false },
      {key: "prislusenstvi", label: "Příslušenství", type: "setup_board", editable: true, show: true, dataType: "object", boardLabels: {   assigned: "Již přiřazené položky",   changes: "Připravené změny",   available: "Dostupné položky", }, buildInitial: buildSortimentBoard, required: false },
    ],
  },

  // Vyrobce configuration
  vyrobce: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/vozidla/vyrobce/update/${kod}`,
    fields: [
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "nazev", label: "Název výrobce", type: "input", editable: true, show: true, dataType: "string", required: true},
      {key: "kategorie", label: "Kategorie výrobce", placeholder: "Vyberte kategorii výrobce", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true},
      {key: "aktualizovano", label: "Aktualizováno", type: "text", editable: false, show: true, dataType: "date", },
      {key: "publikovat", label: "Publikovat výrobce?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
    ],
  }

};
