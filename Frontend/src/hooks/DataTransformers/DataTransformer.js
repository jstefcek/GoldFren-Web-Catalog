export const dataTransformers = {
    adaptery: (data) => {
      if (data.data && Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          // Transform data
          id: item.kod,
          sortiment: item.sortiment,
          kategorie: item.kategorie,
          obrazek: item.obrazek ? "http://localhost/GoldFren_Media/adaptery/image/" + item.obrazek : null,
          vektor: item.vektor ? "http://localhost/GoldFren_Media/adaptery/vector/" + item.vektor : null,
          cislo_dilu: item.cislo_dilu,
          typ: item.typ,
          prumer: item.prumer,
          popis: item.popis,
          typ_uchyceni: item.typ_uchyceni,
          roztec_brzdice: item.roztec_brzdice,
          poznamka: item.poznamka,
          publikovat: item.publikovat,
          aktualizovano: item.aktualizovano,
          aktualizoval: item.aktualizoval,
        }));
      }
      return [];
    },
    
    desticky: (data) => {
      if (data.data && Array.isArray(data.data)) {
        return data.data.map(item => ({
          ...item,
          // Transform data
          id: item.kod
          
        }));
      }
      return [];
    },
    
  };