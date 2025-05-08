import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import i18next from 'i18next';

export const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  optional = false,
  placeholder = "Vyberte...",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownTop, setDropdownTop] = useState(0);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  const filteredOptions = options.filter((o) =>
    o.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownTop(rect.height + 32);
    }
  }, [open]);

  const handleSelect = (val) => {
    onChange({ target: { value: val } });
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="flex flex-col gap-1 relative" ref={wrapperRef}>
      <label htmlFor={name} className="font-sm text-medium text-gray-800">
        {i18next.t(label)} 
          {!optional && (
            <span className="font-sm text-medium text-red-800">
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
        } ${disabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""}`}
        disabled={disabled}
      >
        {value || i18next.t(placeholder)}
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          className="absolute z-50 w-full bg-white border rounded-lg shadow-xl overflow-hidden"
          style={{ top: dropdownTop }}
        >
          {/* Search input with search icon */}
          <div className="relative">
            <input
              type="text"
              className="w-full px-3 py-2 pr-10 border-b border-gray-200 focus:outline-none placeholder-gray-400 text-black"
              placeholder={i18next.t(placeholder)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* List of options */}
          <ul className="max-h-48 overflow-auto text-sm">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 cursor-pointer hover:bg-red-100 ${
                    option === value ? "bg-red-50 font-medium" : ""
                  }`}
                >
                  {option.toString()}
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