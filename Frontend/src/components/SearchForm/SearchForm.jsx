import React, { useState } from "react";
import { categories } from "./Categories";
import { filterConfigs } from "./CategoriesFilters";
import { CustomSelect } from "./ui/CustomSelect";
import { CustomRangeSlider } from "./ui/CustomRange";
import { Button } from "./ui/CustomButton";
import { Tooltip } from "./ui/CustomTooltip";
import { Card } from "./ui/CustomCard";
import i18next from 'i18next';

// Setup icon name and icon size
const CategoryIcon = ({ name }) => (
  <img src={`/icons/${name}.svg`} alt={name} className="h-18 w-18" />
);

// Main component
export default function CategorySearch() {
  const [selectedCat, setSelectedCat] = useState(categories[0].key);
  const [formState, setFormState] = useState({});
  const [resetSignal, setResetSignal] = useState(false);

  const fields = filterConfigs[selectedCat] || [];

  // Handle input changes
  const handleChange = (name) => (e) =>
    setFormState((p) => ({ ...p, [name]: e.target.value }));
  
  // Handle reset action
  const handleReset = () => {
    setFormState({}); setResetSignal(!resetSignal);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({ category: selectedCat, ...formState });
  };

  const getInputClass = (isDisabled, hasValue) =>
    `border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-400 ${
      hasValue ? "text-black" : "text-gray-400"
    } ${isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50" : ""}`;

  // Function to check if a field should be shown based on dependency conditions
  const shouldShowField = (field) => {
    // If there's no dependency, always show the field
    if (!field.dependsOn) return true;
    
    // If the field has a dependsOnShow flag explicitly set to false, respect that
    if (field.dependsOnShow === false) return false;
    
    // If dependsOnShow is true (default), show the field regardless of dependencies
    if (field.dependsOnShow === true) return true;
    
    // Otherwise check the normal dependencies
    if (!field.dependsOnValue) {
      return !!formState[field.dependsOn];
    }
    
    // Check if dependent field has a specific value
    return formState[field.dependsOn] === field.dependsOnValue;
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 border-gray-300 mb-12">
      {/* ICON BAR */}
      <div className="-mx-6 -mt-6 overflow-x-auto rounded-t-2xl border-b border-gray-200 scrollbar-thin">
        <div className="flex w-fit overflow-visible">
          {categories.map(({ key, label, icon }) => (
            <Tooltip key={key} label={label}>
              <Button
                variant="ghost"
                size="icon"
                active={key === selectedCat}
                className="border-r last:border-r-0 border-gray-300"
                onClick={() => {
                  setSelectedCat(key);
                  setFormState({}); // Reset form state when changing category
                }}
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
        {fields
          .filter(field => shouldShowField(field))
          .map(({ 
            name, 
            label, 
            placeholder, 
            type, 
            options, 
            optional = false,
            dependsOn, 
            dependsOnValue,
            dependsOnShow = true,
            minValue, 
            maxValue, 
            step 
          }) => {
            const isDisabled = dependsOn && !formState[dependsOn];

            // Extract all props
            const props = {
              name,
              label,
              value: formState[name] || "",
              onChange: handleChange(name),
              placeholder,
              disabled: isDisabled,
              optional,
              dependsOn,
              dependsOnValue,
              dependsOnShow
            };

            switch (type) {
              case "select":
                return <CustomSelect 
                  key={name}
                  {...props} 
                  options={options} 
                />;

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
                    resetSignal={resetSignal}
                    onChangeMin={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        [`${name}_min`]: value,
                      }))
                    }
                    onChangeMax={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        [`${name}_max`]: value,
                      }))
                    }
                  />
                );

              case "number":
                return (
                  <div key={name} className="flex flex-col gap-1">
                    <label htmlFor={name} className="font-sm text-medium text-gray-800">
                      {i18next.t ? i18next.t(label) : label}
                    </label>
                    <input
                      type="number"
                      id={name}
                      placeholder={i18next.t ? i18next.t(placeholder) : placeholder}
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
                    <label htmlFor={name} className="font-sm text-medium text-gray-800">
                      {i18next.t ? i18next.t(label) : label}
                    </label>
                    <input
                      type="text"
                      id={name}
                      placeholder={i18next.t ? i18next.t(placeholder) : placeholder}
                      value={formState[name] || ""}
                      onChange={handleChange(name)}
                      disabled={isDisabled}
                      className={getInputClass(isDisabled, !!formState[name])}
                    />
                  </div>
                );
            }
          })}

        {/* Required fields */}
        <p className="text-xs text-red-800 mt-4">
          {i18next.t ? i18next.t("search.required_fields") : "* Required fields"} 
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 pt-2">
          <Button
            type="submit"
            className="w-32 bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-600 rounded-xl"
          >
            {i18next.t ? i18next.t("search.search") : "Search"}
          </Button>
          <Button
            type="reset"
            className="w-32 border rounded-xl hover:bg-gray-300 hover:text-black"
          >
            {i18next.t ? i18next.t("search.reset") : "Reset"}
          </Button>
        </div>

      </form>
    </Card>
  );
}