import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import i18next from 'i18next';
import { fetchAPI } from "../../../hooks/SearchForm_APIHook";

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
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [loadedKey, setLoadedKey] = useState("");
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  // Filter options based on search term
  const allOptions = getDataAPI
  ? dynamicOptions
  : options.map((opt) =>
      typeof opt === "object" ? opt : { value: opt, label: opt }
    );

  const filteredOptions = allOptions.filter((o) =>
    o.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
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

  // Set dropdown position based on button height
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownTop(rect.height + 32);
    }
  }, [open]);

  // Handle option selection
  const handleSelect = (val) => {
    const selectedOption = allOptions.find((opt) => opt.value === val);
  
    onChange({ 
      target: { 
        name,
        value: val,
        vozidlo_kod: selectedOption?.vozidlo_kod 
      }
    });
  
    setOpen(false);
    setSearchTerm("");
  };

  // Get static data when API isnt provided
  useEffect(() => {
    if (!getDataAPI && options.length > 0) {
      setDynamicOptions(
        options.map((opt) =>
          typeof opt === "object"
            ? opt
            : { value: opt, label: opt }
        )
      );
    }
  }, [options, getDataAPI]);

  // Fetch data from API if getDataAPI is provided
  const fetchData = async () => {
    if (!getDataAPI) return;

    try {
      const params = getDataAPI_params.map((key) => formState[key] ?? "");
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

  // Reset dynamic options when selected category changes
  useEffect(() => {
    setDynamicOptions([]);
    setLoadedKey("");
  }, [selectedCat]);

  // Fetch data when component mounts or when dependencies change
  useEffect(() => {
    if (!open || !getDataAPI) return;
  
    // Build key based on params and category
    const keyParams = getDataAPI_params.map((p) => formState[p] ?? "").join("|");
    const currentKey = `${getDataAPI}-${selectedCat}-${keyParams}`;
  
    // If category changed or param values changed, reload
    if (loadedKey !== currentKey) {
      fetchData();
      setLoadedKey(currentKey);
    }
  }, [open, getDataAPI, getDataAPI_params, formState, selectedCat]);

  return (
    <div className="flex flex-col gap-1 relative text-sm md:text-base" ref={wrapperRef}>
      {/* Label text */}
      <label htmlFor={name} className="font-medium text-gray-800">
        {i18next.t(label)} 
        {!optional && (
          <span className="text-red-800">
            &nbsp;*
          </span>
        )}
      </label>

      {/* Button / field */}
      <button
        type="button"
        ref={buttonRef}
        onClick={() => !disabled && setOpen(!open)}
        className={`relative border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-400 text-left w-full ${
          value ? "text-black" : "text-gray-400"
        } ${disabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""} text-sm md:text-base`}
        disabled={disabled}
      >
        {allOptions.find(opt => opt.value === value)?.label || i18next.t(placeholder)}
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          className="absolute z-50 w-full bg-white border rounded-lg shadow-xl overflow-hidden text-sm md:text-base"
          style={{ top: dropdownTop }}
        >
          {/* Search input with search icon */}
          <div className="relative">
            <input
              type="text"
              className="w-full px-3 py-2 pr-10 border-b border-gray-200 focus:outline-none placeholder-gray-400 text-black text-sm md:text-base"
              placeholder={i18next.t(placeholder)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* List of options */}
          <ul className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-3 py-2 cursor-pointer hover:bg-red-100 ${
                    option === value ? "bg-red-50 font-medium" : ""
                  }`}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">Nenalezeno</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};