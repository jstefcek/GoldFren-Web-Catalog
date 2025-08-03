import { SelectValueConfig } from "../ColumnConfigs/EditDialog_Config";

const serverUrl = import.meta.env.VITE_API_URL;

export const dialogColumnsConfig = {
    // Configuration for the dialog columns
    // User configuration
    users: {
        addEndpoint: (id = "") => `${serverUrl}/api/goldfren/internal/users/register/${id}`,
        fields: [
            {key: "username", label: "Uživatelské jméno", placeholder: "", type: "input", editable: false, show: true, dataType: "string", },
            {key: "first_name", label: "Křestní jméno", placeholder: "Zadejte křestní jméno", type: "input", editable: true, show: true, dataType: "string", },
            {key: "last_name", label: "Přijmení", placeholder: "Zadejte přijmení", type: "input", editable: true, show: true, dataType: "string", },
            {key: "email", label: "E-mail", placeholder: "Zadejte e-mail", type: "input", editable: true, show: true, dataType: "string",},
            {key: "password", label: "Heslo", placeholder: "Zadejte heslo", type: "password", editable: true, show: true, dataType: "string", },
            {key: "is_staff", label: "Administrátorská práva", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: false, show: true, dataType: "boolean", },
            {key: "is_valid", label: "Status účtu", type: "button", buttonValue: { true: "Aktivní", false: "Deaktivován" }, editable: true, show: true, dataType: "boolean", },
        ],
    },

    // Adaptery configuration
    adaptery: {
        addEndpoint: (kod = "") => `${serverUrl}/api/goldfren/internal/adaptery/create/${kod}`,
        fields: [
          {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
          {key: "obrazek", label: "Obrázek adaptéru", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor adaptéru", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie adaptéru", placeholder: "Vyberte kategorii adaptéru", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
          {key: "typ", label: "Typ adaptéru", placeholder: "Zadejte typ adaptéru", type: "input", editable: true, show: true, dataType: "string", },
          {key: "prumer", label: "Průměr adaptéru [mm]", placeholder: "Zadejte průměr adaptéru", type: "input", editable: true, show: true, dataType: "string", },
          {key: "typ_uchyceni", label: "Typ uchycení", placeholder: "Zadejte typ uchycení", value: SelectValueConfig.typ_uchyceni, type: "select", editable: true, show: true, dataType: "string", },
          {key: "roztec_brzdice", label: "Rozteč brzdiče [mm]", placeholder: "Zadejte rozteč brzdiče", type: "input", editable: true, show: true, dataType: "string", },
          {key: "popis", label: "Popis adaptéru", placeholder: "Zadejte popis adaptéru", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
    },

    // Brzdice configuration
      brzdice: {
        addEndpoint: (kod = "") => `${serverUrl}/api/goldfren/internal/brzdice/create/${kod}`,
        fields: [
          {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
          {key: "obrazek", label: "Obrázek brzdiče", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor brzdiče", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie brzdiče", placeholder: "Vyberte kategorii brzdiče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
          {key: "typ_uchyceni", label: "Typ uchycení", placeholder: "Zadejte typ uchycení", type: "input", editable: true, show: true, dataType: "string", },
          {key: "pocet_pistku", label: "Počet pístků", placeholder: "Zadejte počet pístků", type: "input", editable: true, show: true, dataType: "string", },
          {key: "popis", label: "Popis brzdiče", placeholder: "Zadejte popis brzdiče", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Desticky configuration
      desticky: {
        addEndpoint: (kod = "") => `${serverUrl}/api/goldfren/internal/desticky/create/${kod}`,
        fields: [
          {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
          {key: "obrazek", label: "Obrázek destičky", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor destičky", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie destičky", placeholder: "Vyberte kategorii destičky", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
          {key: "typ", label: "Typ destičky", value: SelectValueConfig.typ_desticky, type: "select", editable: true, show: true, dataType: "string", },
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
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Kotouce configuration
      kotouce: {
        addEndpoint: (kod = "") => `${serverUrl}/api/goldfren/internal/kotouce/create/${kod}`,
        fields: [
          {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
          {key: "obrazek", label: "Obrázek kotouče", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor kotouče", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie kotouče", placeholder: "Vyberte kategorii kotouče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
          {key: "typ", label: "Typ kotouče", value: SelectValueConfig.typ_kotouce, type: "select", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
          {key: "vnejsi_prumer", label: "Průměr vnější (mm)", placeholder: "Zadejte vnější průměr", type: "input", editable: true, show: true, dataType: "string", },
          {key: "roztecny_prumer", label: "Rozteč děr kotouče (mm)", placeholder: "Zadejte rozteč děr", type: "input", editable: true, show: true, dataType: "string", },
          {key: "vnitrni_prumer", label: "Vnitřní průměr (mm)", placeholder: "Zadejte vnitřní průměr", type: "input", editable: true, show: true, dataType: "string", },
          {key: "tloustka", label: "Tloušťka kotouče (mm)", placeholder: "Zadejte tloušťku kotouče", type: "input", editable: true, show: true, dataType: "string", },
          {key: "konkurence_braking", label: "Braking", placeholder: "Zadejte konkurenci Braking", type: "input", editable: true, show: true, dataType: "string", },
          {key: "konkurence_ngbrakes", label: "NGBrakes", placeholder: "Zadejte konkurenci NGBrakes", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Hadicky configuration
      hadicky: {
        addEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/hadicky/create/${kod}`,
        fields: [
          {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
          {key: "obrazek", label: "Obrázek hadičky", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor hadičky", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie hadičky", placeholder: "Vyberte kategorii hadičky", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
          {key: "popis", label: "Popis hadičky", placeholder: "Zadejte popis hadičky", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Pumpy configuration
      pumpy: {
        addEndpoint: (kod = "") => `${serverUrl}/api/goldfren/internal/pumpy/create/${kod}`,
        fields: [
          {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
          {key: "obrazek", label: "Obrázek pumpy", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor pumpy", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie pumpy", placeholder: "Vyberte kategorii pumpy", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
          {key: "prumer", label: "Průměr pumpy [mm]", placeholder: "Zadejte průměr pumpy", type: "input", editable: true, show: true, dataType: "string", },
          {key: "popis", label: "Popis pumpy", placeholder: "Zadejte popis pumpy", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Prislusenstvi configuration
      prislusenstvi: {
        addEndpoint: (kod = "") => `${serverUrl}/api/goldfren/internal/prislusenstvi/create/${kod}`,
        fields: [
          {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
          {key: "obrazek", label: "Obrázek příslušenství", type: "image", editable: false, show: true, dataType: "image", },
          {key: "vektor", label: "Vektor příslušenství", type: "image", editable: false, show: true, dataType: "image", },
          {key: "kategorie", label: "Kategorie příslušenství", placeholder: "Vyberte kategorii příslušenství", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
          {key: "popis", label: "Popis příslušenství", placeholder: "Zadejte popis příslušenství", type: "input", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      },
    
      // Vehicle configuration
      vozidla: {
        addEndpoint: (kod = "") => `${serverUrl}/api/goldfren/internal/vozidla/create/${kod}`,
        fields: [
          {key: "nazev_modelu", label: "Model vozidla", type: "input", editable: false, show: true, dataType: "string", },
          {key: "kategorie", label: "Kategorie vozidla", placeholder: "Vyberte kategorii vozidla", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
          {key: "subkategorie", label: "Subkategorie vozidla", placeholder: "Zadejte subkategorii vozidla", value: SelectValueConfig.subkategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
          {key: "vyrobce", label: "Výrobce vozidla", placeholder: "Zadejte výrobce vozidla", value: SelectValueConfig.vyrobce, type: "select", editable: true, show: true, dataType: "string", },
          {key: "typ", label: "Typ vozidla", placeholder: "Zadejte typ vozidla", type: "input", editable: true, show: true, dataType: "string", },
          {key: "oznaceni", label: "Označení vozidla", placeholder: "Zadejte označení vozidla", type: "textarea", editable: true, show: true, dataType: "string", },
          {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku k vozidlu", type: "textarea", editable: true, show: true, dataType: "string", },
          {key: "rok_od", label: "Rok od", placeholder: "Zadejte rok výroby od", type: "input", editable: true, show: true, dataType: "string", },
          {key: "rok_do", label: "Rok do", placeholder: "Zadejte rok výroby do", type: "input", editable: true, show: true, dataType: "string", },
          {key: "vykon", label: "Výkon [kW]", placeholder: "Zadejte výkon vozidla", type: "input", editable: true, show: true, dataType: "string", },
          {key: "objem", label: "Objem [cm3]", placeholder: "Zadejte objem vozidla", type: "input", editable: true, show: true, dataType: "string", },
          {key: "publikovat", label: "Publikovat vozidlo?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
        ],
      }
}