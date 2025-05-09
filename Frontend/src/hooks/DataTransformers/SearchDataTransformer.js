// Transfrom data from API to options
export const transformers = {
  // Vyrobce data
  vyrobce: (data) =>
    data.map((item) => ({
      value: item.kod,
      label: item.nazev,
    })),

  // Objem data
  objem: (data) => {
    const seen = new Set();
    return data
      .map((item) => ({ value: item.objem, label: item.objem }))
      .filter((option) => {
        if (seen.has(option.value)) return false;
            seen.add(option.value);
            return true;
      });
  },

  // Model data
  model: (data) =>
    data.map((item) => ({
      value: item.model,
      label: item.model,
      vozidlo_kod: item.vozidlo_kod,
    })),

  // Rok vyroby data
  year: (data) =>
    data.map((item) => ({
      value: item.rok_vyroby,
      label: item.rok_vyroby,
      vozidlo_kod: item.vozidlo_kod,
    })),
};
