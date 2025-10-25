export const EXCEL_COLUMN_CONFIG = {
  // Base table styling
  tableStyle: {
    theme: 'TableStyleMedium2',
    showRowStripes: true,
    showColumnStripes: false,
    showFirstColumn: true,
    showLastColumn: false
  },

  // Category-specific column configurations
  // Admin sortiment exports
  adaptery_sortiment: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'prumer', header: 'Diameter [mm]' },
      { key: 'typ_uchyceni', header: 'Mounting Type' },
      { key: 'roztec_brzdice', header: 'Brake Caliper Spacing' },
      { key: 'oznaceni_vozidla', header: 'Vehicle Model' }
    ]
  },

  brzdice_sortiment: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'typ_uchyceni', header: 'Mounting Type' },
      { key: 'pocet_pistku', header: 'Number of Pistons' },
      { key: 'oznaceni_vozidla', header: 'Vehicle Model' }
    ]
  },

  desticky_sortiment: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'material_text', header: 'Material' },
      { key: 'oem_cisla', header: 'OEM Numbers' },
      { key: 'oznaceni_vozidla', header: 'Vehicle Model' }
    ]
  },

  kotouce_sortiment: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'typ', header: 'Type' },
      { key: 'vnejsi_prumer', header: 'Outer Diameter [mm]' },
      { key: 'roztecny_prumer', header: 'Pitch Diameter [mm]' },
      { key: 'vnitrni_prumer', header: 'Inner Diameter [mm]' },
      { key: 'tloustka', header: 'Thickness [mm]' },
      { key: 'oznaceni_vozidla', header: 'Vehicle Model' }
    ]
  },

  hadicky_sortiment: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'poznamka', header: 'Special Note' },
      { key: 'oznaceni_vozidla', header: 'Vehicle Model' }
    ]
  },

  pumpy_sortiment: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'prumer', header: 'Diameter [mm]' },
      { key: 'oznaceni_vozidla', header: 'Vehicle Model' }
    ]
  },

  prislusenstvi_sortiment: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'typ', header: 'Type' },
      { key: 'poznamka', header: 'Special Note' },
      { key: 'oznaceni_vozidla', header: 'Vehicle Model' }
    ]
  },

  // Public pages export configs
  // ------------------------------------------------------------
  adaptery_public: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'typ', header: 'Type' },
      { key: 'prumer', header: 'Diameter [mm]' },
      { key: 'typ_uchyceni', header: 'Mounting Type' },
      { key: 'roztec_brzdice', header: 'Brake Caliper Spacing' }
    ]
  },

  brzdice_public: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'typ_uchyceni', header: 'Mounting Type' },
      { key: 'pocet_pistku', header: 'Number of Pistons' },
      { key: 'popis', header: 'Description' },
    ]
  },

  desticky_public: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'material_text', header: 'Material' },
      { key: 'oem_cisla', header: 'OEM Numbers' },
      { key: 'konkurence_sbs', header: 'SBS' },
      { key: 'konkurence_ebc', header: 'EBC' },
      { key: 'konkurence_ferodo', header: 'Ferodo' },
      { key: 'konkurence_a2z', header: 'A2Z' },
      { key: 'konkurence_rapco', header: 'Rapco' },
      { key: 'konkurence_grove', header: 'Grove' },
      { key: 'konkurence_cleveland', header: 'Cleveland' },
      { key: 'konkurence_matco', header: 'Matco' },
    ]
  },

  kotouce_public: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'typ', header: 'Type' },
      { key: 'vnejsi_prumer', header: 'Outer Diameter [mm]' },
      { key: 'roztecny_prumer', header: 'Pitch Diameter [mm]' },
      { key: 'vnitrni_prumer', header: 'Inner Diameter [mm]' },
      { key: 'tloustka', header: 'Thickness [mm]' },
      { key: 'konkurence_braking', header: 'Braking' },
      { key: 'konkurence_ngbrakes', header: 'NGBrakes' },
      { key: 'poznamka', header: 'Description' }
    ]
  },

  hadicky_public: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'poznamka', header: 'Description' },
    ]
  },

  pumpy_public: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'prumer', header: 'Diameter [mm]' },
      { key: 'poznamka', header: 'Description' },
    ]
  },

  prislusenstvi_public: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'typ', header: 'Type' },
      { key: 'popis', header: 'Description' },
      { key: 'poznamka', header: 'Special Note' },
    ]
  }
};