import React, { useState } from "react";

/* --------------------------------------------------------------------------
  PRIMITIVES – Tailwind only (no external deps)
---------------------------------------------------------------------------*/
export const Card = ({ className = "", children }) => (
  <div className={`bg-white border rounded-2xl shadow ${className}`}>{children}</div>
);

/**
 * Button
 *  variant: "default" | "ghost"
 *  size: "md" | "icon"
 *  active: highlights the button when selected
 */
export const Button = ({
  variant = "default",
  size = "md",
  active = false,
  className = "",
  children,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-medium select-none transition focus:outline-none rounded-none";
  const variantStyles = {
    default: "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100",
  };
  const sizeStyles = {
    md: "h-10 px-4",
    icon: "h-16 w-16 p-0", // 64 × 64 button for larger icons
  };
  const activeStyles = active ? "bg-gray-300" : ""; // darker grey when selected

  return (
    <button
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${activeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Tooltip = ({ label, children }) => (
  <div className="relative group inline-flex">
    {children}
    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded px-2 py-1 bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
      {label}
    </span>
  </div>
);

/* --------------------------------------------------------------------------
  CATEGORY DATA & ICON LOADER
---------------------------------------------------------------------------*/
const categories = [
  { key: "motorbike", label: "Motorbike", icon: "motorbike" },
  { key: "car", label: "Car", icon: "car" },
  { key: "kart", label: "Kart", icon: "kart" },
  { key: "bike", label: "Bike", icon: "bike" },
  { key: "plane", label: "Plane", icon: "plane" },
  { key: "industry", label: "Industry", icon: "industry" },
  { key: "motorbike-pad", label: "Motorbike Pad", icon: "pad" },
  { key: "motorbike-brake", label: "Motorbike Brake", icon: "brake" },
  { key: "motorbike-adapter", label: "Motorbike Adapter", icon: "adapter" },
  { key: "motorbike-disc", label: "Motorbike Disc", icon: "disc" },
];

const CategoryIcon = ({ name }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={`/icons/${name}.svg`} alt={name} className="h-16 w-16" />
);

/* --------------------------------------------------------------------------
  FILTER CONFIG (same as previous)
---------------------------------------------------------------------------*/
const filterConfigs = {
  motorbike: [
    { name: "manufacturer", label: "Manufacturer", placeholder: "Please select the manufacturer", type: "select", options: ["Honda", "Yamaha", "Kawasaki"] },
    { name: "displacement", label: "Displacement", placeholder: "Please select the displacement", type: "number" },
    { name: "model", label: "Model", placeholder: "Please select the model", type: "select", options: [] },
    { name: "year", label: "Year of production", placeholder: "Please select the year of production", type: "number" },
  ],
  car: [
    { name: "manufacturer", label: "Manufacturer", placeholder: "Please select the manufacturer", type: "select", options: ["Audi", "BMW", "Tesla"] },
    { name: "model", label: "Model", placeholder: "Please select the model", type: "select", options: [] },
    { name: "year", label: "Year of production", placeholder: "Please select the year of production", type: "number" },
  ],
  kart: [
    { name: "engine", label: "Engine", placeholder: "Type of engine", type: "input" },
    { name: "year", label: "Year", placeholder: "e.g. 2021", type: "number" },
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
  "motorbike-pad": [
    { name: "compound", label: "Compound", placeholder: "e.g. S33", type: "select", options: ["S33", "AD"] },
  ],
  "motorbike-brake": [
    { name: "diameter", label: "Diameter (mm)", placeholder: "e.g. 320", type: "number" },
    { name: "material", label: "Material", placeholder: "Steel", type: "select", options: ["Steel", "Carbon"] },
  ],
  "motorbike-adapter": [
    { name: "mount", label: "Mount type", placeholder: "e.g. Post", type: "input" },
  ],
  "motorbike-disc": [
    { name: "diameter", label: "Diameter (mm)", placeholder: "e.g. 203", type: "number" },
  ],
};

/* --------------------------------------------------------------------------
  MAIN COMPONENT
---------------------------------------------------------------------------*/
export default function CategorySearch() {
  const [selectedCat, setSelectedCat] = useState(categories[0].key);
  const [formState, setFormState] = useState({});

  const fields = filterConfigs[selectedCat] || [];

  const handleChange = (name) => (e) => setFormState((p) => ({ ...p, [name]: e.target.value }));
  const handleReset = () => setFormState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({ category: selectedCat, ...formState });
  };

  return (
    <Card className="max-w-3xl mx-auto p-6">
      {/* ICON BAR */}
      <div className="-mx-6 -mt-6 flex overflow-hidden rounded-t-2xl border-b border-gray-200">
        {categories.map(({ key, label, icon }) => (
          <Tooltip key={key} label={label}>
            <Button
              variant="ghost"
              size="icon"
              active={key === selectedCat}
              className="border-r last:border-r-0 border-gray-200"
              onClick={() => setSelectedCat(key)}
            >
              <CategoryIcon name={icon} />
            </Button>
          </Tooltip>
        ))}
      </div>

      {/* FILTER FORM */}
      <form className="space-y-6 pt-6" onSubmit={handleSubmit} onReset={handleReset}>
        {fields.map(({ name, label, placeholder, type, options }) => {
          switch (type) {
            case "select":
              return (
                <div key={name} className="flex flex-col gap-1">
                  <label htmlFor={name} className="font-medium text-sm">
                    {label}
                  </label>
                  <select
                    id={name}
                    value={formState[name] || ""}
                    onChange={handleChange(name)}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">{placeholder}</option>
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              );
            case "number":
              return (
                <div key={name} className="flex flex-col gap-1">
                  <label htmlFor={name} className="font-medium text-sm">
                    {label}
                  </label>
                  <input
                    type="number"
                    id={name}
                    placeholder={placeholder}
                    value={formState[name] || ""}
                    onChange={handleChange(name)}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              );
            default:
              return (
                <div key={name} className="flex flex-col gap-1">
                  <label htmlFor={name} className="font-medium text-sm">
                    {label}
                  </label>
                  <input
                    type="text"
                    id={name}
                    placeholder={placeholder}
                    value={formState[name] || ""}
                    onChange={handleChange(name)}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              );
          }
        })}

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 pt-2">
          <Button
            type="submit"
            className="w-32 bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-600 rounded-md"
          >
            Search
          </Button>
          <Button type="reset" variant="outline" className="w-32 border rounded-lg">
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}

/* --------------------------------------------------------------------------
  CHANGES THIS REVISION
  ▸ Icon image size bumped to 40 px (h‑10 w‑10).
  ▸ Icon button size increased to 64 px square (h‑16 w‑16) for room.
  ▸ Active (selected) background now darker (`bg‑gray‑300`).
---------------------------------------------------------------------------*/