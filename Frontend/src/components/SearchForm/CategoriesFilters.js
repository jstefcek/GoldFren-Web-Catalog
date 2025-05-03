// Specific configuration for filters based on category
export const filterConfigs = {
  motorbike: [
    {
      name: "vyrobce",
      label: "search.manufacturer_motorbike",
      placeholder: "search.manufacturer_motorbike_placeholder",
      type: "select",
      options: [],
      api: "/api/goldfren/internal/vozidla/vyrobce",
      api_params: ["kategorie_kod"]
    },
    {
      name: "objem",
      label: "search.motor_volume",
      placeholder: "search.motor_volume_placeholder",
      type: "select",
      options: [],
      dependsOn: "vyrobce",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod" ]
    },
    {
      name: "model",
      label: "search.motorbike_model",
      placeholder: "search.motorbike_model_placeholder",
      type: "select",
      options: [],
      dependsOn: "objem",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod", "objem" ]
    },
    {
      name: "year",
      label: "search.year_manufactured",
      placeholder: "search.year_manufactured_placeholder",
      type: "select",
      optional: true,
      dependsOn: "model",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod", "objem", "model" ]
    },
  ],
  car: [
    {
      name: "vyrobce",
      label: "search.manufacturer_car",
      placeholder: "search.manufacturer_car_placeholder",
      type: "select",
      options: [],
      api: "/api/goldfren/internal/vozidla/vyrobce",
      api_params: ["kategorie_kod"]
    },
    {
      name: "objem",
      label: "search.motor_volume",
      placeholder: "search.motor_volume_placeholder",
      type: "select",
      options: [],
      dependsOn: "vyrobce",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod" ]
    },
    {
      name: "model",
      label: "search.car_model",
      placeholder: "search.car_model_placeholder",
      type: "select",
      options: [],
      dependsOn: "objem",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod", "objem" ]
    },
    {
      name: "year",
      label: "search.year_manufactured",
      placeholder: "search.year_manufactured_placeholder",
      type: "select",
      optional: true,
      dependsOn: "model",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod", "objem", "model" ]
    },
  ],
  kart: [
    {
      name: "vyrobce",
      label: "search.manufacturer_kart",
      placeholder: "search.manufacturer_kart_placeholder",
      type: "select",
      options: [],
      api: "/api/goldfren/internal/vozidla/vyrobce",
      api_params: ["kategorie_kod"]
    },
    {
      name: "objem",
      label: "search.motor_volume",
      placeholder: "search.motor_volume_placeholder",
      type: "select",
      options: [],
      dependsOn: "vyrobce",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod" ]
    },
    {
      name: "model",
      label: "search.kart_model",
      placeholder: "search.kart_model_placeholder",
      type: "select",
      options: [],
      dependsOn: "objem",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod", "objem" ]
    },
    {
      name: "year",
      label: "search.year_manufactured",
      placeholder: "search.year_manufactured_placeholder",
      type: "select",
      optional: true,
      dependsOn: "model",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod", "objem", "model" ]
    },
  ],
  bike: [
    {
      name: "vyrobce",
      label: "search.manufacturer_bike",
      placeholder: "search.manufacturer_bike_placeholder",
      type: "select",
      options: [],
      api: "/api/goldfren/internal/vozidla/vyrobce",
      api_params: ["kategorie_kod"]
    },
    {
      name: "model",
      label: "search.bike_model",
      placeholder: "search.bike_model_placeholder",
      type: "select",
      options: [],
      dependsOn: "vyrobce",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod" ]
    },
    {
      name: "year",
      label: "search.year_manufactured",
      placeholder: "search.year_manufactured_placeholder",
      type: "select",
      optional: true,
      dependsOn: "model",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod", "model" ]
    },
  ],
  plane: [
    {
      name: "vyrobce",
      label: "search.manufacturer_plane",
      placeholder: "search.manufacturer_plane_placeholder",
      type: "select",
      options: [],
      api: "/api/goldfren/internal/vozidla/vyrobce",
      api_params: ["kategorie_kod"]
    },
    {
      name: "objem",
      label: "search.motor_volume",
      placeholder: "search.motor_volume_placeholder",
      type: "select",
      options: [],
      dependsOn: "vyrobce",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod" ]
    },
    {
      name: "model",
      label: "search.plane_model",
      placeholder: "search.plane_model_placeholder",
      type: "select",
      options: [],
      dependsOn: "objem",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod", "objem" ]
    },
    {
      name: "year",
      label: "search.year_manufactured",
      placeholder: "search.year_manufactured_placeholder",
      type: "select",
      optional: true,
      dependsOn: "model",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod", "objem", "model" ]
    },
  ],
  industry: [
    {
      name: "vyrobce",
      label: "search.manufacturer_industry",
      placeholder: "search.manufacturer_industry_placeholder",
      type: "select",
      options: [],
      api: "/api/goldfren/internal/vozidla/vyrobce",
      api_params: ["kategorie_kod"]
    },
    {
      name: "model",
      label: "search.industry_model",
      placeholder: "search.industry_model_placeholder",
      type: "select",
      options: [],
      dependsOn: "vyrobce",
      api: "/api/goldfren/internal/vozidla/filter",
      api_params: ["kategorie_kod", "vyrobce_kod" ]
    },
  ],
  pad: [
    {
      name: "compound",
      label: "Compound",
      placeholder: "e.g. S33",
      type: "select",
      options: ["S33", "AD"],
    },
  ],
  brake: [
    {
      name: "diameter",
      label: "Diameter (mm)",
      placeholder: "e.g. 320",
      type: "number",
    },
    {
      name: "material",
      label: "Material",
      placeholder: "Steel",
      type: "select",
      options: ["Steel", "Carbon"],
    },
  ],
  adapter: [
    {
      name: "mount",
      label: "Mount type",
      placeholder: "e.g. Post",
      type: "input",
    },
  ],
  disc: [
    {
      name: "diameter",
      label: "Diameter (mm)",
      placeholder: "e.g. 203",
      type: "number",
    },
  ],
};
