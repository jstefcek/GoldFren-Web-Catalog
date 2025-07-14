import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import i18next from 'i18next';
import { fetchAPI } from "../../../hooks/SearchForm_APIHook";

// Deduplicate by label with case-insensitive
const useUniqueByLabel = (options) =>
  useMemo(() => {
    const seen = new Set();
    return options.filter(({ label = "" }) => {
      const key = label.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [options]);

export const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  optional = false,
  placeholder = "Vyberte...",
  disabled = false,
  getDataAPI = null,
  getDataAPI_params = [],
  formState = {},
  selectedCat = null,
  resetSignal = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [loadedKey, setLoadedKey] = useState("");
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  // Map options to standard format
  const allOptionsRaw = getDataAPI
    ? dynamicOptions
    : options.map((opt) =>
        typeof opt === "object" ? opt : { value: opt, label: opt }
      );

  // Deduplicate by label
  const allOptions = useUniqueByLabel(allOptionsRaw);

  // Filter options by search
  const filteredOptions = allOptions.filter((o) =>
    o.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set dropdown top offset
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownTop(rect.height + 32);
    }
  }, [open]);

  // Handle selection
  const handleSelect = (val) => {
    const selectedOption = allOptions.find((opt) => opt.value === val);

    onChange({
      target: {
        name,
        value: selectedOption,
        vozidlo_kod: selectedOption?.vozidlo_kod,
      },
    });

    setOpen(false);
    setSearchTerm("");
  };

  // Prepare static options on mount
  useEffect(() => {
    if (!getDataAPI && options.length > 0) {
      setDynamicOptions(
        options.map((opt) =>
          typeof opt === "object" ? opt : { value: opt, label: opt }
        )
      );
    }
  }, [options, getDataAPI]);

  // Fetch dynamic options
  const fetchData = async () => {
    if (!getDataAPI) return;
    try {
      const params = getDataAPI_params.map((key) => {
        const val = formState[key];
        if (val && typeof val === "object" && val.value !== undefined) {
          return val.value;
        }
        return val ?? "";
      });
      const transformed = await fetchAPI(
        getDataAPI,
        getDataAPI_params,
        params,
        {},
        name,
        selectedCat
      );
      setDynamicOptions(transformed);
    } catch (err) {
      console.error("Failed to fetch options:", err);
    }
  };

  // Reset when category changes
  useEffect(() => {
    setDynamicOptions([]);
    setLoadedKey("");
  }, [selectedCat]);

  // Reset when resetSignal changes - dependent fields are reset
  useEffect(() => {
    if (resetSignal !== undefined) {
      setDynamicOptions([]);
      setLoadedKey("");
      setSearchTerm("");
      setOpen(false);
    }
  }, [resetSignal]);

  // Fetch options on open
  useEffect(() => {
    if (!open || !getDataAPI) return;

    const keyParams = getDataAPI_params.map((p) => formState[p] ?? "").join("|");
    const currentKey = `${getDataAPI}-${selectedCat}-${keyParams}`;

    if (loadedKey !== currentKey) {
      fetchData();
      setLoadedKey(currentKey);
    }
  }, [open, getDataAPI, getDataAPI_params, formState, selectedCat]);

  return (
    <div
      className="flex flex-col gap-1 relative text-sm md:text-base"
      ref={wrapperRef}
    >
      {/* Label */}
      <label htmlFor={name} className="font-medium text-gray-800">
        {i18next.t(label)}
        {!optional && <span className="text-red-800">&nbsp;*</span>}
      </label>

      {/* Input field with search */}
      <div className="relative" ref={buttonRef}>
        <input
          type="text"
          className={`w-full border rounded-lg px-3 py-2 pr-10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm md:text-base ${
            disabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""
          } ${value ? "text-black" : "text-gray-700"}`}
          placeholder={i18next.t(placeholder)}
          onClick={() => !disabled && setOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={
            searchTerm ||
            (typeof value === "object" && value !== null
              ? value.label
              : allOptions.find((opt) => opt.value === value)?.label || "")
          }
          disabled={disabled}
        />
        {open ? (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        ) : (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        )}
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          className="absolute z-50 w-full bg-white border rounded-lg shadow-xl overflow-hidden text-sm md:text-base"
          style={{ top: dropdownTop }}
        >
          <ul className="max-h-70 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-3 py-2 cursor-pointer hover:bg-red-100 ${
                    (typeof value === "object" && value?.value === option.value) ||
                    value === option.value
                      ? "bg-red-50 font-medium"
                      : ""
                  }`}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">{i18next.t("not_found")}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};