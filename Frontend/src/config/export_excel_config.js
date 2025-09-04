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
  adaptery_sortiment: {
    columns: [
      { key: 'cislo_dilu', header: 'Sortiment Number' },
      { key: 'prumer', header: 'Diameter' },
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
      { key: 'vnejsi_prumer', header: 'Outer Diameter' },
      { key: 'roztecny_prumer', header: 'Pitch Diameter' },
      { key: 'vnitrni_prumer', header: 'Inner Diameter' },
      { key: 'tloustka', header: 'Thickness' },
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
      { key: 'prumer', header: 'Diameter' },
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
  }
};