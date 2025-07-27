const serverUrl = import.meta.env.VITE_API_URL;

export const SelectValueConfig = {
  // Vehicle categorie
  kategorie_vozidel: [
    {id: 1, label: "Motocykly", value: 1},
    {id: 2, label: "Automobily", value: 2},
    {id: 3, label: "Jízdní kola", value: 3},
    {id: 4, label: "Letadla", value: 4},
    {id: 5, label: "Průmysl", value: 5},
    {id: 6, label: "Motokáry", value: 6},
  ],

  // Attachment type
  typ_uchyceni: [
    {id: 1, label: "Axis", value: "Axis"},
    {id: 2, label: "Radial", value: "Radial"},
  ]
};

export const dialogColumnsConfig = {
  // Edit dialog 
  // User configuration
  user: {
    primaryKey: "id",
    editEndpoint: (id) => `${serverUrl}/api/goldfren/internal/users/${id}`,
    fields: [
      {key: "id", label: "ID", type: "text", placeholder: "", editable: false, show: false, dataType: "string", },
      {key: "username", label: "Uživatelské jméno", placeholder: "", type: "input", editable: false, show: true, dataType: "string", },
      {key: "first_name", label: "Křestní jméno", placeholder: "Zadejte křestní jméno", type: "input", editable: true, show: true, dataType: "string", },
      {key: "last_name", label: "Přijmení", placeholder: "Zadejte přijmení", type: "input", editable: true, show: true, dataType: "string", },
      {key: "email", label: "E-mail", placeholder: "Zadejte e-mail", type: "input", editable: true, show: true, dataType: "string",},
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
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek adaptéru", type: "image", editable: false, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor adaptéru", type: "image", editable: false, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie adaptéru", placeholder: "Vyberte kategorii adaptéru", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
      {key: "prumer", label: "Průměr adaptéru [mm]", placeholder: "Zadejte průměr adaptéru", type: "input", editable: true, show: true, dataType: "string", },
      {key: "typ_uchyceni", label: "Typ uchycení", placeholder: "Zadejte typ uchycení", value: SelectValueConfig.typ_uchyceni, type: "select", editable: true, show: true, dataType: "string", },
      {key: "roztec_brzdice", label: "Rozteč brzdiče [mm]", placeholder: "Zadejte rozteč brzdiče", type: "input", editable: true, show: true, dataType: "string", },
      {key: "popis", label: "Popis adaptéru", placeholder: "Zadejte popis adaptéru", type: "input", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
      {key: "publikovat", label: "Publikovat?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: true, show: true, dataType: "date", },
    ],
  },

  // Brzdice configuration
  brzdice: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/brzdice/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek brzdiče", type: "image", editable: false, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor brzdiče", type: "image", editable: false, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie brzdiče", placeholder: "Vyberte kategorii brzdiče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
      {key: "typ_uchyceni", label: "Typ uchycení", placeholder: "Zadejte typ uchycení", type: "input", editable: true, show: true, dataType: "string", },
      {key: "pocet_pistku", label: "Počet pístků", placeholder: "Zadejte počet pístků", type: "input", editable: true, show: true, dataType: "string", },
      {key: "popis", label: "Popis brzdiče", placeholder: "Zadejte popis brzdiče", type: "input", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", placeholder: "Zadejte poznámku", type: "input", editable: true, show: true, dataType: "string", },
      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: true, show: true, dataType: "date", },
    ],
  },

  // Desticky configuration
  desticky: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/desticky/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek destičky", type: "image", editable: false, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor destičky", type: "image", editable: false, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie destičky", placeholder: "Vyberte kategorii destičky", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
      {key: "typ", label: "Typ destičky", type: "input", editable: true, show: true, dataType: "string", },
      {key: "material_text", label: "Materiál", placeholder: "Zadejte materiál", type: "input", editable: true, show: true, dataType: "string", },
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
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: true, show: true, dataType: "date", },
    ],
  },

  // Kotouce configuration
  kotouce: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/kotouce/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek kotouče", type: "image", editable: false, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor kotouče", type: "image", editable: false, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie kotouče", placeholder: "Vyberte kategorii kotouče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
      {key: "typ", label: "Typ kotouče", type: "input", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", type: "input", editable: true, show: true, dataType: "string", },
      {key: "vnejsi_prumer", label: "Průměr vnější (mm)", type: "input", editable: true, show: true, dataType: "string", },
      {key: "roztecny_prumer", label: "Rozteč děr kotouče (mm)", type: "input", editable: true, show: true, dataType: "string", },
      {key: "vnitrni_prumer", label: "Vnitřní průměr (mm)", type: "input", editable: true, show: true, dataType: "string", },
      {key: "tloustka", label: "Tloušťka kotouče (mm)", type: "input", editable: true, show: true, dataType: "string", },
      {key: "konkurence_braking", label: "Braking", type: "input", editable: true, show: true, dataType: "string", },
      {key: "konkurence_ngbrakes", label: "NGBrakes", type: "input", editable: true, show: true, dataType: "string", },
      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: true, show: true, dataType: "date", },
    ],
  },

  // Hadicky configuration
  hadicky: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/hadicky/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek kotouče", type: "image", editable: false, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor kotouče", type: "image", editable: false, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie kotouče", placeholder: "Vyberte kategorii kotouče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
      {key: "popis", label: "Popis hadičky", placeholder: "Zadejte popis hadičky", type: "input", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", type: "input", editable: true, show: true, dataType: "string", },
      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
    ],
  },

  // Pumpy configuration
  pumpy: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/pumpy/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek kotouče", type: "image", editable: false, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor kotouče", type: "image", editable: false, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie kotouče", placeholder: "Vyberte kategorii kotouče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
      {key: "prumer", label: "Průměr adaptéru [mm]", placeholder: "Zadejte průměr adaptéru", type: "input", editable: true, show: true, dataType: "string", },
      {key: "popis", label: "Popis pumpy", placeholder: "Zadejte popis pumpy", type: "input", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", type: "input", editable: true, show: true, dataType: "string", },
      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: true, show: true, dataType: "date", },
    ],
  },

  // Prislusenstvi configuration
  prislusenstvi: {
    primaryKey: "kod",
    editEndpoint: (kod) => `${serverUrl}/api/goldfren/internal/prislusenstvi/update/${kod}`,
    fields: [
      {key: "cislo_dilu", label: "Číslo dílu", type: "text", editable: true, show: true, dataType: "string", },
      {key: "kod", label: "ID", type: "text", editable: false, show: false, dataType: "string", },
      {key: "obrazek", label: "Obrázek kotouče", type: "image", editable: false, show: true, dataType: "image", },
      {key: "vektor", label: "Vektor kotouče", type: "image", editable: false, show: true, dataType: "image", },
      {key: "kategorie", label: "Kategorie kotouče", placeholder: "Vyberte kategorii kotouče", value: SelectValueConfig.kategorie_vozidel, type: "select", editable: true, show: true, dataType: "string", },
      {key: "popis", label: "Popis příslušenství", placeholder: "Zadejte popis příslušenství", type: "input", editable: true, show: true, dataType: "string", },
      {key: "poznamka", label: "Poznámka", type: "input", editable: true, show: true, dataType: "string", },
      {key: "publikovat", label: "Publikovat díl?", type: "button", buttonValue: { true: "Ano", false: "Ne" }, editable: true, show: true, dataType: "boolean", },
      {key: "aktualizovano", label: "Aktualizováno", type: "input", editable: true, show: true, dataType: "date", },
    ],
  },

};
