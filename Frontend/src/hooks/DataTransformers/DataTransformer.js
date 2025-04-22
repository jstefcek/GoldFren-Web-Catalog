export const dataTransformers = {
    // Adaptery transformed data
    adaptery: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? "http://localhost/GoldFren_Media/adaptery/image/" + item.obrazek : null,
          vektor: item.vektor ? "http://localhost/GoldFren_Media/adaptery/vector/" + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          prumer: item.prumer,
          popis: item.popis,
          typ_uchyceni: item.typ_uchyceni,
          roztec_brzdice: item.roztec_brzdice,
        }));
      }
      return [];
    },

    // Brzdice transformed data
    brzdice: (data) => {
      if (Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? "http://localhost/GoldFren_Media/brzdice/image/" + item.obrazek : null,
          vektor: item.vektor ? "http://localhost/GoldFren_Media/brzdice/vector/" + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ_uchyceni: item.typ_uchyceni,
          pocet_pistku: item.pocet_pistku,
          popis: item.popis,
        }));
      }
      return [];
    },
    
    // Desticky transformed data
    desticky: (data) => {
      if (Array.isArray(data)) {
        return data.map(item => ({
          ...item,
          id: item.kod,
          obrazek: item.obrazek ? "http://localhost/GoldFren_Media/desticky/image/" + item.obrazek : null,
          // TODO: stahnout vectory z c41 DB
          //vektor: item.vektor ? "http://localhost/GoldFren_Media/desticky/vector/" + item.vektor : null,
          vektor: null,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          material_text: item.material_text,
          oem_cisla: item.oem_cisla,
          obchodni_nazev: item.obchodni_nazev,
          // Konurence
          konkurence_sbs: item.konkurence.sbs,
          konkurence_ebs: item.konkurence.ebs,
          konkurence_ferodo: item.konkurence.ferodo,
          konkurence_a2z: item.konkurence.a2z,
          konkurence_rapco: item.konkurence.rapco,
          konkurence_grove: item.konkurence.grove,
          konkurence_cleveland: item.konkurence.konkurence_cleveland,
          konkurence_matco: item.konkurence_matco,
        }));
      }
      return [];
    },
    
  };