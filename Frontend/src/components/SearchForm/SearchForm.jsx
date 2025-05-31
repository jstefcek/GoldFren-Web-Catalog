import React, { useState, useEffect } from "react";
import { categories } from "./Categories";
import { filterConfigs } from "./CategoriesFilters";
import { CustomSelect } from "./ui/CustomSelect";
import { CustomRangeSlider } from "./ui/CustomRange";
import { Button } from "./ui/CustomButton";
import { Tooltip } from "./ui/CustomTooltip";
import { Card } from "./ui/CustomCard";
import i18next from "i18next";

// CategoryIcon component to display category icons
const CategoryIcon = ({ name }) => (
  <img
    src={`/icons/${name}.svg`}
    alt={name}
    className="h-14 w-14 sm:h-16 sm:w-16"
    loading="lazy"
    draggable={false}
  />
);

export default function CategorySearch({ isSearchComplete }) {
  const [selectedCat, setSelectedCat] = useState(categories[0].key);
  const [formState, setFormState] = useState({});
  const [resetSignal, setResetSignal] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const currentCategory = categories.find((cat) => cat.key === selectedCat);
  const categoryType = currentCategory?.type || "unknown";

  // Get the filter configuration for the selected category
  const fields = React.useMemo(() => filterConfigs[selectedCat] || [], [selectedCat]);

  // Function to determine if a field should be shown based on its dependencies
  const shouldShowField = React.useCallback(
    (field) => {
      if (!field.dependsOn) return true;

      if (field.dependsOnShow === false) return false;

      if (field.dependsOnShow === true) return true;

      if (!field.dependsOnValue) {
        return !!formState[field.dependsOn];
      }

      return formState[field.dependsOn] === field.dependsOnValue;
    },
    [formState]
  );

  // Set defualt value if the range slider is initialize
  useEffect(() => {
    const initialRangeValues = {};
    
    // If range should be shown give him init values
    fields
      .filter((field) => field.type === "range-slider" && shouldShowField(field))
      .forEach((field) => {
        const name = field.name;
        
        // Check for min value
        if (formState[`${name}_min`] === undefined) {
          initialRangeValues[`${name}_min`] = field.minValue;
        }
        
        // Check for max value
        if (formState[`${name}_max`] === undefined) {
          initialRangeValues[`${name}_max`] = field.maxValue;
        }
      });
      
    // If the ranges are set then continue
    if (Object.keys(initialRangeValues).length > 0) {
      setFormState((prev) => ({
        ...prev,
        ...initialRangeValues,
      }));
    }
  }, [selectedCat, fields, formState, shouldShowField]);

  // Handle input changes
  const handleChange = (name) => (e) =>
    setFormState((prev) => ({
      ...prev,
      [name]: e.target.value,
      ...(e.target.vozidlo_kod && { ["vozidlo_kod"]: e.target.vozidlo_kod }),
    }));

  // Handle reset button click
  const handleReset = () => {
    setFormState({});
    setResetSignal(!resetSignal);
    setMissingFields([]);
    isSearchComplete(null)
  };

  // Handle form submission and validate required fields
  const handleSubmit = (e) => {
    e.preventDefault();

    const visibleFields = fields.filter(shouldShowField);
    const requiredFields = visibleFields.filter((f) => !f.optional);
    const optionalFields = visibleFields.filter((f) => f.optional);

    // Validate required fields
    const missing = requiredFields
      .filter(({ name, type }) => {
        if (type === "range-slider") return false;
        const value = formState[name];
        if (typeof value === "string") return value.trim() === "";
        return value === undefined || value === null || value === "";
      })
      .map((f) => f.label);

    // Determine if at least one optional field has meaningful input
    const atLeastOneOptionalFilled = optionalFields.some(
      ({ name, type }) => {
        if (type === "range-slider") {
          const minVal = formState[`${name}_min`];
          const maxVal = formState[`${name}_max`];
          
          // Only consider filled if values differ from defaults
          return (
            (minVal !== undefined) ||
            (maxVal !== undefined)
          );
        } else {
          const val = formState[name];
          return (
            val !== undefined && val !== null && val.toString().trim() !== ""
          );
        }
      }
    );

    // Handle validation errors
    if (
      missing.length > 0 ||
      (requiredFields.length === 0 && !atLeastOneOptionalFilled)
    ) {
      setMissingFields(
        missing.length > 0
          ? missing
          : [
              i18next.t("search.at_least_one_required") ||
                "Please fill at least one filter.",
            ]
      );
      return;
    }

    // If everything is valid, proceed with the search and reset missing fields
    setMissingFields([]);

    // Check for vozidlo_kod
    const vozidloKod = formState.vozidlo_kod || null;
    
    // Is search is complete return the results
    if (isSearchComplete) {
      if (categoryType === "vehicle") {
        isSearchComplete({
          category: selectedCat,
          type: "vehicle",
          vozidlo_kod: vozidloKod,
          api: currentCategory.api || null,
          filters: { ...formState },
        });
      } else {
        isSearchComplete({
          category: selectedCat,
          type: "sortiment",
          api: currentCategory.api || null,
          page_category: currentCategory.page_category || null,
          filters: { ...formState },
        });
      }
    }

    console.table({ category: selectedCat, ...formState });
  };

  // Function to get the input class based on state
  const getInputClass = (isDisabled, hasValue) =>
    [
      "w-full border rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600",
      hasValue ? "text-black" : "text-gray-400",
      isDisabled &&
        "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 border-gray-200",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <Card className="max-w-2xl mx-4 sm:mx-auto p-6 sm:p-6 border-gray-200 shadow-lg mb-12">
      {/* CATEGORY ICON BAR */}
      <div className="-mx-6 -mt-6 overflow-x-auto rounded-t-2xl border-b border-gray-100 scrollbar-thin scrollbar-thumb-gray-400/50 hover:scrollbar-thumb-gray-500/60">
        <div className="flex w-fit">
          {categories.map(({ key, label, icon }) => (
            <Tooltip key={key} label={label} position="bottom">
              <Button
                variant="ghost"
                size="icon"
                active={key === selectedCat}
                className="border-r last:border-r-0 border-gray-300"
                onClick={() => {
                  setSelectedCat(key);
                  setFormState({});
                  setMissingFields([]);
                  isSearchComplete(null);
                }}
                aria-label={label}
              >
                <CategoryIcon name={icon} />
              </Button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* FILTER FORM */}
      <form
        className="flex flex-col gap-6 pt-6"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        {fields.filter(shouldShowField).map((field) => {
          const {
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
            step,
            getDataAPI,
            getDataAPI_params,
          } = field;

          // Check if the field should be disabled based on its dependencies
          const isDisabled =
            dependsOn &&
            (formState[dependsOn] === undefined ||
              (dependsOnValue !== undefined &&
                formState[dependsOn] !== dependsOnValue));

          // Common properties for input types
          const commonProps = {
            name,
            label,
            value: formState[name] || "",
            onChange: handleChange(name),
            placeholder,
            disabled: isDisabled,
            optional,
            dependsOn,
            dependsOnValue,
            dependsOnShow,
          };

          {
            /* FILTER FORM - Select component */
          }
          switch (type) {
            case "select":
              return (
                <CustomSelect
                  key={name}
                  {...commonProps}
                  options={options}
                  getDataAPI={getDataAPI}
                  getDataAPI_params={getDataAPI_params}
                  formState={formState}
                  selectedCat={selectedCat}
                />
              );

            /* FILTER FORM - Range slider component */
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

            /* FILTER FORM - Number component */
            case "number":
              return (
                <div key={name} className="flex flex-col gap-1">
                  <label
                    htmlFor={name}
                    className="text-sm font-medium text-gray-800"
                  >
                    {i18next.t ? i18next.t(label) : label}
                    {!optional && <span className="text-red-600"> *</span>}
                  </label>
                  <input
                    type="number"
                    id={name}
                    label={label}
                    onChange={handleChange(name)}
                    placeholder={i18next.t(placeholder)}
                    disabled={isDisabled}
                    className={getInputClass(isDisabled, !!formState[name])}
                  />
                </div>
              );

            /* FILTER FORM - Text component */
            default:
              return (
                <div key={name} className="flex flex-col gap-1">
                  <label
                    htmlFor={name}
                    className="text-sm md:text-base font-medium text-gray-800"
                  >
                    {i18next.t ? i18next.t(label) : label}
                    {!optional && <span className="text-red-600"> *</span>}
                  </label>
                  <input
                    type="text"
                    id={name}
                    onChange={handleChange(name)}
                    placeholder={i18next.t(placeholder)}
                    className={`${getInputClass(
                      isDisabled,
                      !!formState[name]
                    )} text-sm md:text-base text-gray-800`}
                  />
                </div>
              );
          }
        })}

        {/* REQUIRED FIELDS - text */}
        <p className="text-xs font-normal text-red-800 -mt-3">
          {i18next.t
            ? i18next.t("search.required_fields")
            : "* Required fields"}
        </p>

        {/* MISSING FIELDS - text */}
        {missingFields.length > 0 && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-300 font-bold text-sm md:text-base">
            {i18next.t
              ? i18next.t("search.required_fields_warning")
              : "Please select all required fields (*) before searching..."}
            <ul className="list-disc list-inside mt-1 font-normal">
              {missingFields.map((label, idx) => (
                <li key={idx}>
                  {i18next.t
                    ? i18next.t("search.fill_required_text") + i18next.t(label)
                    : label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ACTION BUTTONS - part */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-2">
          <Button
            type="submit"
            className="w-full sm:w-36 bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-600 rounded-xl"
          >
            {i18next.t ? i18next.t("search.search") : "Search"}
          </Button>
          <Button
            type="reset"
            className="w-full sm:w-36 border border-gray-300 rounded-xl hover:bg-gray-100 hover:text-black"
          >
            {i18next.t ? i18next.t("search.reset") : "Reset"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
