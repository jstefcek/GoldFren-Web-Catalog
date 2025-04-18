// Specific configuration for filters based on category
export const filterConfigs = {
    motorbike: [
      { name: "vyrobce", label: "Výrobce motocyklu", placeholder: "Vyberte prosím výrobce", type: "select", options: ["Honda", "Yamaha", "Kawasaki", "BMW", "AJS", "TET"] },
      { name: "objem", label: "Zdvihový objem", placeholder: "Vyberte prosím zdvihový objem", type: "select", options: [], dependsOn: "vyrobce" },
      { name: "model", label: "Model motocyklu", placeholder: "Vyberte prosím model", type: "select", options: [], dependsOn: "objem" },
      { name: "year", label: "Rok výroby", placeholder: "Zadejte prosím rok výroby", type: "text", optional: true, dependsOn: "model" },
    ],
    car: [
      { name: "manufacturer", label: "Manufacturer", placeholder: "Please select the manufacturer", type: "select", options: ["Audi", "BMW", "Tesla"] },
      { name: "model", label: "Model", placeholder: "Please select the model", type: "select", options: [] },
      { name: "year", label: "Year of production", placeholder: "Please select the year of production", type: "number" },
    ],
    kart: [
      { name: "engine", label: "Engine", placeholder: "Type of engine", type: "input" },
      { name: "year", label: "Year", placeholder: "e.g. 2021", type: "range-slider", minValue: 0, maxValue: 200, step: 1 },
    ],
    bike: [
      { name: "type", label: "Type", placeholder: "Mountain, Road…", type: "select", options: ["Road", "Mountain", "Hybrid"] },
      { name: "frame", label: "Frame size", placeholder: "e.g. 56 cm", type: "input" },
    ],
    plane: [
      { name: "manufacturer", label: "Manufacturer", placeholder: "e.g. Cessna", type: "input" },
      { name: "model", label: "Model", placeholder: "e.g. 172", type: "input" },
    ],
    industry: [
      { name: "application", label: "Application", placeholder: "e.g. Conveyor", type: "input" },
      { name: "material", label: "Material", placeholder: "e.g. Steel", type: "select", options: ["Steel", "Aluminium"] },
    ],
    pad: [
      { name: "compound", label: "Compound", placeholder: "e.g. S33", type: "select", options: ["S33", "AD"] },
    ],
    brake: [
      { name: "diameter", label: "Diameter (mm)", placeholder: "e.g. 320", type: "number" },
      { name: "material", label: "Material", placeholder: "Steel", type: "select", options: ["Steel", "Carbon"] },
    ],
    adapter: [
      { name: "mount", label: "Mount type", placeholder: "e.g. Post", type: "input" },
    ],
    disc: [
      { name: "diameter", label: "Diameter (mm)", placeholder: "e.g. 203", type: "number" },
    ],
  };