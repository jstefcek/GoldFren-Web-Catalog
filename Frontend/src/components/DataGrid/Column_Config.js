export const columnsConfig = {
  adaptery: [
    { 
        key: "obrazek", 
        i18n: "datagrid.picture", 
        type: "image",
        sortable: false 
    },
    { 
        key: "vektor", 
        i18n: "datagrid.vektor", 
        type: "vector",
        sortable: false 
    },
    {
      key: "cislo_dilu",
      i18n: "datagrid.part_number",
      sortable: true,
      filterable: true,
      link: true,
    },
    { 
        key: "typ", 
        i18n: "datagrid.type", 
        sortable: true, 
        filterable: true },
    {
      key: "prumer",
      i18n: "datagrid.diameter",
      sortable: true,
      filterable: true,
      
    },
    {
      key: "typ_uchyceni",
      i18n: "datagrid.attached_type",
      sortable: true,
      filterable: true,
    },
    {
      key: "roztec_brzdice",
      i18n: "datagrid.brakepad_spacing",
      sortable: true,
      filterable: true,
    },
  ],
};
