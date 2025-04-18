import React, { useState } from "react";
import { categories } from "./Categories";
import { filterConfigs } from "./CategoriesFilters";
import { CustomSelect } from "./ui/CustomSelect";
import { CustomRangeSlider } from "./ui/CustomRange";

// Use for card component
export const Card = ({ className = "", children }) => (
  <div className={`bg-white border rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);

// Used for button component
export const Button = ({
  variant = "default",
  size = "md",
  active = false,
  className = "",
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium select-none transition focus:outline-none cursor-pointer";
  const variantStyles = {
    default: "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-200",
  };
  const sizeStyles = {
    md: "h-12 px-6",
    icon: "h-20 w-20 p-0",
  };
  const activeStyles = active ? "bg-zinc-300" : "";

  return (
    <button
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${activeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Used for tooltip menu
export const Tooltip = ({ label, children }) => (
  <div className="group relative flex flex-col items-center">
    {children}
    <div className="absolute bottom-full mb-2 hidden group-hover:flex z-20">
      <span className="relative bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-800">
        {label}
      </span>
    </div>
  </div>
);

// Setup icon name and icon size
const CategoryIcon = ({ name }) => (
  <img src={`/icons/${name}.svg`} alt={name} className="h-18 w-18" />
);

/* --------------------------------------------------------------------------
  MAIN COMPONENT
---------------------------------------------------------------------------*/
export default function CategorySearch() {
  const [selectedCat, setSelectedCat] = useState(categories[0].key);
  const [formState, setFormState] = useState({});

  const fields = filterConfigs[selectedCat] || [];

  const handleChange = (name) => (e) =>
    setFormState((p) => ({ ...p, [name]: e.target.value }));
  const handleReset = () => setFormState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({ category: selectedCat, ...formState });
  };

  const getInputClass = (isDisabled, hasValue) =>
    `border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-400 ${
      hasValue ? "text-black" : "text-gray-400"
    } ${isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50" : ""}`;

  return (
    <Card className="max-w-2xl mx-auto p-6 border-gray-300">
      {/* ICON BAR */}
      <div className="-mx-6 -mt-6 overflow-x-auto rounded-t-2xl border-b border-gray-200 scrollbar-thin">
        <div className="flex w-fit">
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
      </div>

      {/* FILTER FORM */}
      <form
        className="space-y-4 pt-4"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        {fields.map(
          ({ name, label, placeholder, type, options, dependsOn, minValue, maxValue, step }) => {
            const isDisabled = dependsOn && !formState[dependsOn];

            const Properties = {
              key: name,
              name,
              label,
              value: formState[name] || "",
              onChange: handleChange(name),
              placeholder,
              disabled: isDisabled,
            };

            switch (type) {
              case "select":
                return <CustomSelect {...Properties} options={options} />;

                case "range-slider":
                  return (
                    <CustomRangeSlider
                      key={name}
                      label={label}
                      min={minValue}
                      max={maxValue}
                      step={step}
                      valueMin={formState[`${name}_min`] ?? minValue}
                      valueMax={formState[`${name}_max`] ?? maxValue}
                      disabled={isDisabled}
                      onChangeMin={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          [`${name}_min`]: Math.min(Number(e.target.value), prev[`${name}_max`] || maxValue),
                        }))
                      }
                      onChangeMax={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          [`${name}_max`]: Math.max(Number(e.target.value), prev[`${name}_min`] || minValue),
                        }))
                      }
                    />
                  );

              case "number":
                return (
                  <div key={name} className="flex flex-col gap-1">
                    <label htmlFor={name} className="font-sm text-medium">
                      {label}
                    </label>
                    <input
                      type="number"
                      id={name}
                      placeholder={placeholder}
                      value={formState[name] || ""}
                      onChange={handleChange(name)}
                      disabled={isDisabled}
                      className={getInputClass(isDisabled, !!formState[name])}
                    />
                  </div>
                );

              default:
                return (
                  <div key={name} className="flex flex-col gap-1">
                    <label htmlFor={name} className="font-sm text-medium">
                      {label}
                    </label>
                    <input
                      type="text"
                      id={name}
                      placeholder={placeholder}
                      value={formState[name] || ""}
                      onChange={handleChange(name)}
                      disabled={isDisabled}
                      className={getInputClass(isDisabled, !!formState[name])}
                    />
                  </div>
                );
            }
          }
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 pt-2">
          <Button
            type="submit"
            className="w-32 bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-600 rounded-xl"
          >
            Vyhledat
          </Button>
          <Button
            type="reset"
            className="w-32 border rounded-xl hover:bg-gray-300 hover:text-black"
          >
            Resetovat
          </Button>
        </div>
      </form>
    </Card>
  );
}
