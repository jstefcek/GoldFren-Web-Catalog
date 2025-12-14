export const columnsConfig = {
  // Adaptery web column config
  adaptery: [
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true },
    {key: "typ", label: "datagrid.type", sortable: true, filterable: true },
    {key: "prumer",label: "datagrid.diameter", sortable: true, filterable: true },
    {key: "typ_uchyceni", label: "datagrid.attached_type", sortable: true, filterable: true },
    {key: "roztec_brzdice", label: "datagrid.brakepad_spacing", sortable: true, filterable: true },
  ],

  // Adapter vozidla web column config
  adapter_vozidla: [
    {key: "vyrobce", label: "datagrid.manufacturer", sortable: true, filterable: true },
    {key: "kategorie", label: "datagrid.category", sortable: true, filterable: true },
    {key: "subkategorie", label: "datagrid.subcategory", sortable: true, filterable: true },
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "objem", label: "datagrid.volume", sortable: true, filterable: true },
    {key: "rok_od", label: "datagrid.year_from", sortable: true, filterable: true },
    {key: "rok_do", label: "datagrid.year_to", sortable: true, filterable: true },
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
  ],

  // Brzdice web column config
  brzdice: [
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true },
    {key: "typ_uchyceni", label: "datagrid.attached_type", sortable: true, filterable: true },
    {key: "pocet_pistku", label: "datagrid.pistku_count", sortable: true, filterable: true },
    {key: "popis", label: "datagrid.description", sortable: true, filterable: true },
  ],

  // Brzdic vozidla web column config
  brzdic_vozidla: [
    {key: "vyrobce", label: "datagrid.manufacturer", sortable: true, filterable: true },
    {key: "kategorie", label: "datagrid.category", sortable: true, filterable: true },
    {key: "subkategorie", label: "datagrid.subcategory", sortable: true, filterable: true },
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "objem", label: "datagrid.volume", sortable: true, filterable: true },
    {key: "rok_od", label: "datagrid.year_from", sortable: true, filterable: true },
    {key: "rok_do", label: "datagrid.year_to", sortable: true, filterable: true },
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
  ],

  // Desticky web column config
  desticky: [
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "material_text", label: "datagrid.material_text", sortable: true, filterable: true,},
    {key: "oem_cisla", label: "datagrid.oem_cisla", sortable: true, filterable: true, maxRows: 3, useTruncation: true,},
    {key: "konkurence_sbs", label: "SBS", sortable: true, filterable: true,},
    {key: "konkurence_ebc", label: "EBC", sortable: true, filterable: true,},
    {key: "konkurence_ferodo", label: "Ferodo", sortable: true, filterable: true,},
    {key: "konkurence_a2z", label: "A2Z", sortable: true, filterable: true,},
    {key: "konkurence_rapco", label: "Rapco", sortable: true, filterable: true,},
    {key: "konkurence_grove", label: "Grove", sortable: true, filterable: true,},
    {key: "konkurence_cleveland", label: "Cleveland", sortable: true, filterable: true,},
    {key: "konkurence_matco", label: "Matco", sortable: true, filterable: true,},
  ],

  // Desticka vozidla web column config
  desticka_vozidla: [
    {key: "vyrobce", label: "datagrid.manufacturer", sortable: true, filterable: true },
    {key: "kategorie", label: "datagrid.category", sortable: true, filterable: true },
    {key: "subkategorie", label: "datagrid.subcategory", sortable: true, filterable: true },
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "objem", label: "datagrid.volume", sortable: true, filterable: true },
    {key: "rok_od", label: "datagrid.year_from", sortable: true, filterable: true },
    {key: "rok_do", label: "datagrid.year_to", sortable: true, filterable: true },
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
  ],

  // Kotouce web column config
  kotouce: [
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "typ", label: "datagrid.type", sortable: true, filterable: true,},
    {key: "vnejsi_prumer", label: "datagrid.outer_diameter", sortable: true, filterable: true,},
    {key: "roztecny_prumer", label: "datagrid.pitch_diameter", sortable: true, filterable: true,},
    {key: "vnitrni_prumer", label: "datagrid.inside_diameter", sortable: true, filterable: true,},
    {key: "tloustka", label: "datagrid.thickness", sortable: true, filterable: true,},
    {key: "konkurence_braking", label: "Braking", sortable: true, filterable: true,},
    {key: "konkurence_ngbrakes", label: "NGBrakes", sortable: true, filterable: true,},
    {key: "poznamka", label: "datagrid.note", sortable: true, filterable: true,},
  ],

  // Kotouc vozidla web column config
  kotouc_vozidla: [
    {key: "vyrobce", label: "datagrid.manufacturer", sortable: true, filterable: true },
    {key: "kategorie", label: "datagrid.category", sortable: true, filterable: true },
    {key: "subkategorie", label: "datagrid.subcategory", sortable: true, filterable: true },
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "objem", label: "datagrid.volume", sortable: true, filterable: true },
    {key: "rok_od", label: "datagrid.year_from", sortable: true, filterable: true },
    {key: "rok_do", label: "datagrid.year_to", sortable: true, filterable: true },
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
  ],

  // Hadicky web column config
  hadicky: [
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "poznamka", label: "datagrid.note", sortable: true, filterable: true,},
  ],

  // Hadicka vozidla web column config
  hadicka_vozidla: [
    {key: "vyrobce", label: "datagrid.manufacturer", sortable: true, filterable: true },
    {key: "kategorie", label: "datagrid.category", sortable: true, filterable: true },
    {key: "subkategorie", label: "datagrid.subcategory", sortable: true, filterable: true },
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "objem", label: "datagrid.volume", sortable: true, filterable: true },
    {key: "rok_od", label: "datagrid.year_from", sortable: true, filterable: true },
    {key: "rok_do", label: "datagrid.year_to", sortable: true, filterable: true },
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
  ],

  // Pumpy web column config
  pumpy: [
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "prumer", label: "datagrid.diameter", sortable: true, filterable: true,},
    {key: "poznamka", label: "datagrid.note", sortable: true, filterable: true,},
  ],

  // Pumpy vozidla web column config
  pumpa_vozidla: [
    {key: "vyrobce", label: "datagrid.manufacturer", sortable: true, filterable: true },
    {key: "kategorie", label: "datagrid.category", sortable: true, filterable: true },
    {key: "subkategorie", label: "datagrid.subcategory", sortable: true, filterable: true },
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "objem", label: "datagrid.volume", sortable: true, filterable: true },
    {key: "rok_od", label: "datagrid.year_from", sortable: true, filterable: true },
    {key: "rok_do", label: "datagrid.year_to", sortable: true, filterable: true },
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
  ],

  // Prislusenstvi web column config
  prislusenstvi: [
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "typ", label: "datagrid.type", sortable: true, filterable: true,},
    {key: "popis", label: "datagrid.description", sortable: true, filterable: true,},
    {key: "poznamka", label: "datagrid.note", sortable: true, filterable: true,},
  ],

  // Prislusenstvi vozidla web column config
  prislusenstvi_vozidla: [
    {key: "vyrobce", label: "datagrid.manufacturer", sortable: true, filterable: true },
    {key: "kategorie", label: "datagrid.category", sortable: true, filterable: true },
    {key: "subkategorie", label: "datagrid.subcategory", sortable: true, filterable: true },
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "objem", label: "datagrid.volume", sortable: true, filterable: true },
    {key: "rok_od", label: "datagrid.year_from", sortable: true, filterable: true },
    {key: "rok_do", label: "datagrid.year_to", sortable: true, filterable: true },
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
  ],

  // Home page search column config - pad
  pad: [
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true,},
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "material_text", label: "datagrid.material_text", sortable: true, filterable: true,},
    {key: "oem_cisla", label: "datagrid.oem_cisla", sortable: true, filterable: true, maxRows: 3, useTruncation: true,},
    {key: "konkurence_sbs", label: "SBS", sortable: true, filterable: true,},
    {key: "konkurence_ebs", label: "EBS", sortable: true, filterable: true,},
    {key: "konkurence_ferodo", label: "Ferodo", sortable: true, filterable: true,},
    {key: "konkurence_a2z", label: "A2Z", sortable: true, filterable: true,},
    {key: "konkurence_rapco", label: "Rapco", sortable: true, filterable: true,},
    {key: "konkurence_grove", label: "Grove", sortable: true, filterable: true,},
    {key: "konkurence_cleveland", label: "Cleveland", sortable: true, filterable: true,},
    {key: "konkurence_matco", label: "Matco", sortable: true, filterable:true,},
  ],

  // Home page search column config - caliper
  caliper: [
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true },
    {key: "typ_uchyceni", label: "datagrid.attached_type", sortable: true, filterable: true },
    {key: "pocet_pistku", label: "datagrid.pistku_count", sortable: true, filterable: true },
    {key: "popis", label: "datagrid.description", sortable: true, filterable: true },
  ],

  // Home page search column config - adapter
  adapter: [
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true },
    {key: "typ", label: "datagrid.type", sortable: true, filterable: true },
    {key: "prumer",label: "datagrid.diameter", sortable: true, filterable: true },
    {key: "typ_uchyceni", label: "datagrid.attached_type", sortable: true, filterable: true },
    {key: "roztec_brzdice", label: "datagrid.brakepad_spacing", sortable: true, filterable: true },
  ],

  // Home page search column config - disc
  disc: [
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "typ", label: "datagrid.type", sortable: true, filterable: true,},
    {key: "vnejsi_prumer", label: "datagrid.outer_diameter", sortable: true, filterable: true,},
    {key: "roztecny_prumer", label: "datagrid.pitch_diameter", sortable: true, filterable: true,},
    {key: "vnitrni_prumer", label: "datagrid.inside_diameter", sortable: true, filterable: true,},
    {key: "tloustka", label: "datagrid.thickness", sortable: true, filterable: true,},
  ],

  // Home page search column config - desticky vozidla
  desticky_home: [
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true,},
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "material", label: "datagrid.material_text", sortable: true, filterable: true,},
    {key: "oem_cisla", label: "datagrid.oem_cisla", sortable: true, filterable: true, maxRows: 3, useTruncation: true,},
    {key: "konkurence_sbs", label: "SBS", sortable: true, filterable: true,},
    {key: "konkurence_ebc", label: "EBC", sortable: true, filterable: true,},
    {key: "konkurence_ferodo", label: "Ferodo", sortable: true, filterable: true,},
    {key: "konkurence_a2z", label: "A2Z", sortable: true, filterable: true,},
    {key: "konkurence_rapco", label: "Rapco", sortable: true, filterable: true,},
    {key: "konkurence_grove", label: "Grove", sortable: true, filterable: true,},
    {key: "konkurence_cleveland", label: "Cleveland", sortable: true, filterable: true,},
    {key: "konkurence_matco", label: "Matco", sortable: true, filterable:true,},
  ],

  // Home page search column config - desticky vozidla
  kotouce_home: [
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "typ", label: "datagrid.type", sortable: true, filterable: true,},
    {key: "vnejsi_prumer", label: "datagrid.outer_diameter", sortable: true, filterable: true,},
    {key: "roztecny_prumer", label: "datagrid.pitch_diameter", sortable: true, filterable: true,},
    {key: "vnitrni_prumer", label: "datagrid.inside_diameter", sortable: true, filterable: true,},
    {key: "tloustka", label: "datagrid.thickness", sortable: true, filterable: true,},
  ],

  // Home page search column config - hadicky vozidla
  hadicky_home: [
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "poznamka", label: "datagrid.note", sortable: true, filterable: true,},
  ],

  // Home page search column config - adaptery vozidla
  adaptery_home: [
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true },
    {key: "typ_adapter", label: "datagrid.type", sortable: true, filterable: true },
    {key: "prumer",label: "datagrid.diameter", sortable: true, filterable: true },
    {key: "typ_uchyceni", label: "datagrid.attached_type", sortable: true, filterable: true },
    {key: "roztec_brzdice", label: "datagrid.brakepad_spacing", sortable: true, filterable: true },
  ],

  // Admin page column config
  users: [
    {key: "is_valid", label: "datagrid.user.is_valid", sortable: true, filterable: true },
    {key: "username", label: "datagrid.user.username", sortable: true, filterable: true, link: true },
    {key: "first_name", label: "datagrid.user.first_name", sortable: true, filterable: true },
    {key: "last_name", label: "datagrid.user.last_name", sortable: true, filterable: true },
    {key: "is_staff", label: "datagrid.user.is_staff", sortable: true, filterable: true },
    {key: "date_joined", label: "datagrid.user.date_joined", type: "date", sortable: true, filterable: true },
    {key: "last_login", label: "datagrid.user.last_login", type: "date", sortable: true, filterable: true },
  ],

  // Vozidla column config
  vozidla: [
    {key: "kod", label: "datagrid.vehicle.code", sortable: true, filterable: true, link: true },
    {key: "subkategorie", label: "datagrid.vehicle.subcategory", sortable: true, filterable: true },
    {key: "vyrobce", label: "datagrid.vehicle.manufacturer", sortable: true, filterable: true },
    {key: "model", label: "datagrid.vehicle.model", sortable: true, filterable: true },
    {key: "rok_od", label: "datagrid.vehicle.year_from", sortable: true, filterable: true },
    {key: "rok_do", label: "datagrid.vehicle.year_to", sortable: true, filterable: true },
    {key: "sortiment_setup", label: null, type: "sortiment_setup", dialogCategory: "vozidlo_sortiment", dialogTitle: "Úprava sortimentu vozidla", buttonLabel: "datagrid.vehicle.sortiment_setup_open_text", sortable: false, filterable: false },
    {key: "publikovat", label: "datagrid.vehicle.publish", type: "boolean", sortable: true, filterable: true },
  ],

  // Desticky - Admin page for sortiment export based on manufacturer
  desticky_sortiment: [
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true,},
    {key: "material", label: "datagrid.material_text", sortable: true, filterable: true,},
    {key: "oem_cisla", label: "datagrid.oem_cisla", sortable: true, filterable: true, maxRows: 3, useTruncation: true,},
  ],

  // Kotouce - Admin page for sortiment export based on manufacturer
  kotouce_sortiment: [
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
    {key: "vnejsi_prumer", label: "datagrid.outer_diameter", sortable: true, filterable: true,},
    {key: "roztecny_prumer", label: "datagrid.pitch_diameter", sortable: true, filterable: true,},
    {key: "vnitrni_prumer", label: "datagrid.inside_diameter", sortable: true, filterable: true,},
    {key: "tloustka", label: "datagrid.thickness", sortable: true, filterable: true,},
  ],

  // Hadicky - Admin page for sortiment export based on manufacturer
  hadicky_sortiment: [
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
    {key: "poznamka", label: "datagrid.note", sortable: true, filterable: true,},
  ],

  // Adaptery - Admin page for sortiment export based on manufacturer
  adaptery_sortiment: [
    {key: "oznaceni_vozidla", label: "datagrid.vehicle_type", sortable: true, filterable: true },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true,},
    {key: "pozice", label: "datagrid.position", sortable: true, filterable: true },
    {key: "prumer",label: "datagrid.diameter", sortable: true, filterable: true },
    {key: "typ_uchyceni", label: "datagrid.attached_type", sortable: true, filterable: true },
    {key: "roztec_brzdice", label: "datagrid.brakepad_spacing", sortable: true, filterable: true },
  ],

  // Vyrobce custom page
  vyrobce: [
    {key: "kategorie_nazev", label: "datagrid.manufacturer_admin.category", sortable: true, filterable: true },
    {key: "nazev", label: "datagrid.manufacturer_admin.name", sortable: true, filterable: true, link: true,},
    {key: "aktualizovano", label: "datagrid.manufacturer_admin.updated_at", type: "date", sortable: true, filterable: true,},
    {key: "publikovat", label: "datagrid.manufacturer_admin.publish", type: "boolean", sortable: true, filterable: true },
  ]
};
