import { SelectValueConfig } from "../ColumnConfigs/EditDialog_Config";

const serverUrl = import.meta.env.VITE_API_URL;

export const dialogColumnsConfig = {
    // Configuration for the dialog columns
    // User configuration
    users: {
        addEndpoint: () => `${serverUrl}/api/goldfren/internal/users/register`,
        fields: [
            {key: "username", label: "Uživatelské jméno", placeholder: "", type: "input", editable: false, show: true, dataType: "string", },
            {key: "first_name", label: "Křestní jméno", placeholder: "Zadejte křestní jméno", type: "input", editable: true, show: true, dataType: "string", required: true },
            {key: "last_name", label: "Přijmení", placeholder: "Zadejte přijmení", type: "input", editable: true, show: true, dataType: "string", required: true },
            {key: "email", label: "E-mail", placeholder: "Zadejte e-mail", type: "input", editable: true, show: true, dataType: "string", required: true },
            {key: "password", label: "Heslo", placeholder: "Zadejte heslo", type: "password", editable: true, show: true, dataType: "string", required: true },
            {key: "is_staff", label: "Administrátorská práva", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: false, show: true, dataType: "boolean", },
            {key: "is_valid", label: "Status účtu", type: "button", buttonValue: { true: "Aktivní", false: "Deaktivován" }, editable: true, show: true, dataType: "boolean", },
        ],
    },

    // Adaptery configuration
    adaptery: {
        addEndpoint: () => `${serverUrl}/api/goldfren/internal/adaptery/create`,
        fields: [
          {key: "cislo_dilu", label: "Označení dílu", placeholder: "Zadejte označení brzdového adaptéru", type: "text", editable: true, show: true, dataType: "string", required: true },
          {key: "obrazek", label: "Obrázek adaptéru", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor adaptéru", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie adaptéru", placeholder: "Vyberte kategorii adaptéru", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "typ", label: "Typ adaptéru", placeholder: "Zadejte typ adaptéru", type: "input", editable: true, show: true, dataType: "string", },
          {key: "prumer", label: "Průměr adaptéru [mm]", placeholder: "Zadejte průměr adaptéru", type: "input", editable: true, show: true, dataType: "string", required: true },
          {key: "typ_uchyceni", label: "Typ uchycení", placeholder: "Zadejte typ uchycení", value: SelectValueConfig.typ_uchyceni, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "roztec_brzdice", label: "Rozteč brzdiče [mm]", placeholder: "Zadejte rozteč brzdiče", type: "input", editable: true, show: true, dataType: "string", },
          {key: "popis", label: "Popis adaptéru", placeholder: "Zadejte popis adaptéru", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
    },

      // Brzdice configuration
      brzdice: {
        addEndpoint: () => `${serverUrl}/api/goldfren/internal/brzdice/create`,
        fields: [
          {key: "cislo_dilu", label: "Označení dílu", placeholder: "Zadejte označení brzdiče", type: "text", editable: true, show: true, dataType: "string", required: true },
          {key: "obrazek", label: "Obrázek brzdiče", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor brzdiče", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie brzdiče", placeholder: "Vyberte kategorii brzdiče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "typ_uchyceni", label: "Typ uchycení", placeholder: "Zadejte typ uchycení", type: "input", editable: true, show: true, dataType: "string", },
          {key: "pocet_pistku", label: "Počet pístků", placeholder: "Zadejte počet pístků", type: "input", editable: true, show: true, dataType: "string", required: true },
          {key: "popis", label: "Popis brzdiče", placeholder: "Zadejte popis brzdiče", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Desticky configuration
      desticky: {
        addEndpoint: () => `${serverUrl}/api/goldfren/internal/desticky/create`,
        fields: [
          {key: "cislo_dilu", label: "Označení dílu", placeholder: "Zadejte označení brzdové destičky", type: "text", editable: true, show: true, dataType: "string", required: true },
          {key: "obrazek", label: "Obrázek destičky", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor destičky", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie destičky", placeholder: "Vyberte kategorii destičky", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "typ", label: "Typ destičky", value: SelectValueConfig.typ_desticky, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "material_text", label: "Materiál", placeholder: "Zadejte materiál", type: "textarea", editable: true, show: true, dataType: "string", },
          {key: "oem_cisla", label: "OEM čísla", placeholder: "Zadejte OEM čísla", type: "textarea", editable: true, show: true, dataType: "string", required: true },
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
        ],
      },
    
      // Kotouce configuration
      kotouce: {
        addEndpoint: () => `${serverUrl}/api/goldfren/internal/kotouce/create`,
        fields: [
          {key: "cislo_dilu", label: "Označení dílu", type: "text", placeholder: "Zadejte označení brzdového kotouče", editable: true, show: true, dataType: "string", required: true },
          {key: "obrazek", label: "Obrázek kotouče", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor kotouče", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie kotouče", placeholder: "Vyberte kategorii kotouče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "typ", label: "Typ kotouče", value: SelectValueConfig.typ_kotouce, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "vnejsi_prumer", label: "Průměr vnější (mm)", placeholder: "Zadejte vnější průměr", type: "input", editable: true, show: true, dataType: "string", required: true },
          {key: "roztecny_prumer", label: "Rozteč děr kotouče (mm)", placeholder: "Zadejte rozteč děr", type: "input", editable: true, show: true, dataType: "string", required: true },
          {key: "vnitrni_prumer", label: "Vnitřní průměr (mm)", placeholder: "Zadejte vnitřní průměr", type: "input", editable: true, show: true, dataType: "string", required: true },
          {key: "tloustka", label: "Tloušťka kotouče (mm)", placeholder: "Zadejte tloušťku kotouče", type: "input", editable: true, show: true, dataType: "string", required: true },
          {key: "konkurence_braking", label: "Braking", placeholder: "Zadejte konkurenci Braking", type: "input", editable: true, show: true, dataType: "string", },
          {key: "konkurence_ngbrakes", label: "NGBrakes", placeholder: "Zadejte konkurenci NGBrakes", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Hadicky configuration
      hadicky: {
        addEndpoint: () => `${serverUrl}/api/goldfren/internal/hadicky/create`,
        fields: [
          {key: "cislo_dilu", label: "Označení dílu", placeholder: "Zadejte číslo brzdové hadičky", type: "text", editable: true, show: true, dataType: "string", required: true  },
          {key: "obrazek", label: "Obrázek hadičky", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor hadičky", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie hadičky", placeholder: "Vyberte kategorii hadičky", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "popis", label: "Popis hadičky", placeholder: "Zadejte popis hadičky", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Pumpy configuration
      pumpy: {
        addEndpoint: () => `${serverUrl}/api/goldfren/internal/pumpy/create`,
        fields: [
          {key: "cislo_dilu", label: "Označení dílu", placeholder: "Zadejte označení brzdové pumpy", type: "text", editable: true, show: true, dataType: "string", required: true },
          {key: "obrazek", label: "Obrázek pumpy", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor pumpy", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie pumpy", placeholder: "Vyberte kategorii pumpy", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "prumer", label: "Průměr pumpy [mm]", placeholder: "Zadejte průměr pumpy", type: "input", editable: true, show: true, dataType: "string", required: true },
          {key: "popis", label: "Popis pumpy", placeholder: "Zadejte popis pumpy", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Prislusenstvi configuration
      prislusenstvi: {
        addEndpoint: () => `${serverUrl}/api/goldfren/internal/prislusenstvi/create`,
        fields: [
          {key: "cislo_dilu", label: "Označení dílu", placeholder: "Zadejte označení příslušenství", type: "text", editable: true, show: true, dataType: "string", required: true },
          {key: "obrazek", label: "Obrázek příslušenství", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor příslušenství", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie příslušenství", placeholder: "Vyberte kategorii příslušenství", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "popis", label: "Popis příslušenství", placeholder: "Zadejte popis příslušenství", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Vehicle configuration
      vozidla: {
        addEndpoint: () => `${serverUrl}/api/goldfren/internal/vozidla/create`,
        fields: [
          {key: "nazev_modelu", label: "Model vozidla", placeholder: "Model vozidla", type: "input", editable: false, show: true, dataType: "string", },
          {key: "kategorie", label: "Kategorie vozidla", placeholder: "Vyberte kategorii vozidla", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "subkategorie", label: "Subkategorie vozidla", placeholder: "Zadejte subkategorii vozidla", value: SelectValueConfig.subkategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "vyrobce", label: "Výrobce vozidla", placeholder: "Zadejte výrobce vozidla", value: SelectValueConfig.vyrobce, type: "select", editable: true, show: true, dataType: "string", required: true },
          {key: "typ", label: "Model vozidla", placeholder: "Zadejte model vozidla", type: "input", editable: true, show: true, dataType: "string", required: true },
          {key: "oznaceni", label: "Speciální označení vozidla", placeholder: "Zadejte označení vozidla", type: "textarea", editable: true, show: true, dataType: "string" },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku k vozidlu", type: "textarea", editable: true, show: true, dataType: "string", },
          {key: "rok_od", label: "Rok od", placeholder: "Zadejte rok výroby od", type: "input", editable: true, show: true, dataType: "string", required: true },
          {key: "rok_do", label: "Rok do", placeholder: "Zadejte rok výroby do", type: "input", editable: true, show: true, dataType: "string", },
          {key: "vykon", label: "Výkon [kW]", placeholder: "Zadejte výkon vozidla", type: "input", editable: true, show: true, dataType: "string", },
          {key: "objem", label: "Objem [cm3]", placeholder: "Zadejte objem vozidla", type: "input", editable: true, show: true, dataType: "string" },
          {key: "publikovat", label: "Publikovat vozidlo?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      }
}