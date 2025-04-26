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

  // Brzdice web column config
  brzdice: [
    {key: "obrazek", label: "datagrid.picture", type: "image", sortable: false },
    {key: "vektor", label: "datagrid.vektor", type: "vector", sortable: false },
    {key: "cislo_dilu", label: "datagrid.part_number", sortable: true, filterable: true, link: true },
    {key: "typ_uchyceni", label: "datagrid.attached_type", sortable: true, filterable: true },
    {key: "pocet_pistku", label: "datagrid.pistku_count", sortable: true, filterable: true },
    {key: "popis", label: "datagrid.description", sortable: true, filterable: true },
  ],

  // Desticky web column config
  desticky: [
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

};
