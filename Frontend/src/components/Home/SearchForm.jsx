import React, { useState } from "react";
import { categories } from "./Categories";
import { filterConfigs } from "./CategoriesFilters";

export const Card = ({ className = "", children }) => (
  <div className={`bg-white border rounded-2xl shadow-xl ${className}`}>{children}</div>
);

export const Button = ({
  variant = "default",
  size = "md",
  active = false,
  className = "",
  children,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-medium select-none transition focus:outline-none";
  const variantStyles = {
    default: "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-300",
  };
  const sizeStyles = {
    md: "h-12 px-6",
    icon: "h-16 w-16 p-0", 
  };
  const activeStyles = active ? "bg-gray-400" : ""; 

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

// Velikost ikon v search menu
const CategoryIcon = ({ name }) => (
  <img src={`/icons/${name}.svg`} alt={name} className="h-16 w-16" />
);

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
    <Card className="max-w-2xl mx-auto p-6 border-gray-300">
      {/* ICON BAR */}
      <div className="-mx-6 -mt-6 flex overflow-hidden rounded-t-2xl border-b border-gray-200">
        {categories.map(({ key, label, icon }) => (
          <Tooltip key={key} label={label}>
            <Button
              variant="ghost"
              size="icon"
              active={key === selectedCat}
              className="border-r last:border-r-0 border-gray-300"
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
            className="w-32 bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-600 rounded-xl"
          >
            Vyhledat
          </Button>
          <Button type="reset" variant="outline" className="w-32 border rounded-xl">
            Resetovat
          </Button>
        </div>
      </form>
    </Card>
  );
}