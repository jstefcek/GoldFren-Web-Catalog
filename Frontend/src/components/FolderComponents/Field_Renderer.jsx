import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, ImageOff } from "lucide-react";
import BooleanToggleButton from "../ui/Custom_ButtonToggle";
import { CustomImageViewer } from "../ui/Custom_ImageViewer";
import { formatDateLong, isFileObject } from "../../utils/utils";

// Reusable field renderer with wrapper
export default function FieldRenderer({
  col,
  value,
  t,
  isDisabled,
  onChange,
  onBlur,
  error,
  vyrobceOptions = [],
  filteredSubkategorie = [],
}) {
  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Keep a stable preview URL for image fields
  const [imageSrc, setImageSrc] = useState(null);
  const [imageKey, setImageKey] = useState(0);
  const objectUrlRef = useRef(null);

  // Shared filters for setup boards
  const [boardFilters, setBoardFilters] = useState({ assigned: "", changes: "", available: "" });

  useEffect(() => {
    if (col.type !== "image") return;

    // Clean up previous object URL first
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    let nextUrl = null;

    if (!value) {
      setImageSrc(null);
    } else if (typeof value === "string") {
      setImageSrc(value);
    } else if (isFileObject(value)) {
      nextUrl = URL.createObjectURL(value);
      setImageSrc(nextUrl);
      objectUrlRef.current = nextUrl;
    } else {
      setImageSrc(null);
    }

    // Force component re-render by updating the key
    setImageKey(prev => prev + 1);

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [value, col.type, col.key]);

  // Helpers
  const normalizeInputType = (t) => (t === "input" ? "text" : t || "text");
  const hasError = !!error;

  // Control class used between components
  const controlClass = (col, isPlaceholder = false) => {
    const textColor = isDisabled(col)
      ? "text-gray-700"
      : isPlaceholder
      ? "text-gray-400"
      : "text-gray-900";

    return `${textColor} ${
      isDisabled(col) ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:ring-2"
    } px-3 py-2 border ${
      hasError ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-gray-600"
    } rounded-md text-sm focus:outline-none focus:ring-2`;
  };

  const wrapper = (children) => (
    <div className="flex flex-col">
      <label className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-1">
        {t(col.label)}
        {col.required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {hasError && <span className="mt-1 text-xs text-red-600">{error}</span>}
    </div>
  );

  // Handle image replacement
  const handleImageReplace = (file) => {
    onChange(col.key, file);
  };

  // Handle image deletion
  const handleImageDelete = () => {
    onChange(col.key, null);
  };

  // Invisible field: reserve layout space but render a non-interactive placeholder
  if (col.type === "invisible" || col.key === "invisible") {
    return (
      <div className="flex flex-col" aria-hidden="true">
        <div className="h-5 mb-1" />
        <div
          className={`${controlClass(col)} pointer-events-none select-none bg-transparent border-transparent`}
          tabIndex={-1}
        />
      </div>
    );
  }

  // --- Controls ---
  // Image preview field
  if (col.type === "image") {
    const componentKey = `${col.key}-${imageKey}`;
    const disabled = isDisabled(col);

    return wrapper(
      <div className="relative">
        {imageSrc ? (
          <CustomImageViewer
            key={componentKey}
            src={imageSrc}
            alt={col.label}
            fullSize={true}
            className="h-64 w-full object-contain border border-gray-300 rounded-md bg-white"
            allowUpload={!disabled}
            onUpload={handleImageReplace}
            allowDelete={!disabled}
            onDelete={handleImageDelete}
          />
        ) : (
          // Show upload area when NO image
          <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-md 
            ${hasError ? 'border-red-600' : 'border-gray-300'} 
            ${disabled ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:border-gray-400'}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
              {!disabled && (
                <p className="text-sm text-gray-500">{t("Klikněte pro nahrání obrázku")}</p>
              )}
            </div>
            {!disabled && (
              <input
                type="file"
                className="hidden"
                accept="image/*,.svg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(col.key, file);
                  }
                }}
                onBlur={() => onBlur(col.key)}
              />
            )}
          </label>
        )}
      </div>
    );
  }

  // Toggle buttons field
  if (col.type === "button") {
    return wrapper(
      <div onBlur={() => onBlur(col.key)}>
        <BooleanToggleButton
          value={!!value}
          editable={col.editable !== false}
          onChange={(val) => onChange(col.key, val)}
          labels={col.buttonValue || { true: "Ano", false: "Ne" }}
        />
      </div>
    );
  }

  // Manufacturer select field
  if (col.key === "vyrobce") {
    const noOptions = (vyrobceOptions || []).length === 0;
    return wrapper(
      <select
        value={value || ""}
        onChange={(e) => onChange(col.key, e.target.value)}
        onBlur={() => onBlur(col.key)}
        disabled={isDisabled(col)}
        className={controlClass(col, !value)}
        style={!value ? { color: "#8b919cff" } : undefined}
      >
        <option value="" className="text-gray-400">
          {col.placeholder ||
            (noOptions ? t("Nejprve vyberte kategorii") : t("Vyberte výrobce"))}
        </option>
        {!noOptions &&
          vyrobceOptions.map((opt) => (
            <option key={opt.id ?? opt.value} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
      </select>
    );
  }

  // Kategorie select field
  if (col.key === "kategorie") {
    return wrapper(
      <select
        value={value || ""}
        onChange={(e) => onChange(col.key, e.target.value)}
        onBlur={() => onBlur(col.key)}
        disabled={isDisabled(col)}
        className={controlClass(col, !value)}
        style={!value ? { color: "#8b919cff" } : undefined}
      >
        <option value="" className="text-gray-400">{col.placeholder || t("Vyberte kategorii")}</option>
        {col.value.map((opt) => (
          <option key={opt.id} value={opt.value}>
            {t(opt.label)}
          </option>
        ))}
      </select>
    );
  }

  // Subkategorie select field
  if (col.key === "subkategorie") {
    return wrapper(
      <select
        value={value || ""}
        onChange={(e) => onChange(col.key, e.target.value)}
        onBlur={() => onBlur(col.key)}
        disabled={isDisabled(col)}
        className={controlClass(col, !value)}
        style={!value ? { color: "#8b919cff" } : undefined}
      >
        <option value="" className="text-gray-400">{col.placeholder || t("Vyberte subkategorii")}</option>
        {filteredSubkategorie.map((opt) => (
          <option key={opt.id} value={opt.value}>
            {t(opt.label)}
          </option>
        ))}
      </select>
    );
  }

  // Static select field
  if (col.type === "select" && Array.isArray(col.value)) {
    return wrapper(
      <select
        value={value || ""}
        onChange={(e) => onChange(col.key, e.target.value)}
        onBlur={() => onBlur(col.key)}
        disabled={isDisabled(col)}
        className={controlClass(col, !value)}
        style={!value ? { color: "#8b919cff" } : undefined}
      >
        <option value="" className="text-gray-400">{col.placeholder || t("Vyberte možnost")}</option>
        {col.value.map((opt) => (
          <option key={opt.id} value={opt.value}>
            {t(opt.label)}
          </option>
        ))}
      </select>
    );
  }

  // Textarea field
  if (col.type === "textarea") {
    return wrapper(
      <textarea
        value={value || ""}
        onChange={(e) => onChange(col.key, e.target.value)}
        onBlur={() => onBlur(col.key)}
        rows={5}
        placeholder={col.placeholder || ""}
        disabled={isDisabled(col)}
        readOnly={isDisabled(col)}
        className={controlClass(col) + " resize-y"}
      />
    );
  }

  // Label field
  if (col.type === "label") {
    let labelClassName = "text-gray-900 font-bold ";
    
    switch (col.label_type) {
      case "big":
        labelClassName += "text-2xl mt-4";
        break;
      case "medium":
        labelClassName += "text-lg mt-4";
        break;
      default:
        labelClassName += "text-base";
    }

    return (
      <div className="flex flex-col">
        <input 
          type="hidden"
          value={value || ""}
          onChange={(e) => onChange(col.key, e.target.value)}
        />
        <span className={labelClassName}>{t(col.label)}</span>
      </div>
    );
  }

  // Setup board field
  if (col.type === "setup_board") {
    const boardValue = value || {};
    const assigned = Array.isArray(boardValue.assigned) ? boardValue.assigned : [];
    const changes = Array.isArray(boardValue.changes) ? boardValue.changes : [];
    const available = Array.isArray(boardValue.available) ? boardValue.available : [];
    const disabled = isDisabled(col);

    // Labels with translations
    const labels = {
      assigned: col.boardLabels?.assigned ? t(col.boardLabels.assigned) : t("setup_board.assigned"),
      changes: col.boardLabels?.changes ? t(col.boardLabels.changes) : t("setup_board.changes"),
      available: col.boardLabels?.available ? t(col.boardLabels.available) : t("setup_board.available"),
    };

    // Badge tone based on action
    const badgeTone = (action) => {
      switch (action) {
        case "added":
          return {
            bg: "bg-green-50",
            text: "text-green-800",
            chip: "bg-green-100 text-green-800 border-green-200",
          };
        case "removed":
          return {
            bg: "bg-red-50",
            text: "text-red-800",
            chip: "bg-red-100 text-red-800 border-red-200",
          };
        default:
          return {
            bg: "bg-amber-50",
            text: "text-amber-800",
            chip: "bg-amber-100 text-amber-800 border-amber-200",
          };
      }
    };

    // Format item display
    const formatItem = (item) => {
      const parts = [item.label || item.kod || item.id];
      if (item.pozice) parts.push(`pozice ${item.pozice}`);
      return parts.filter(Boolean).join(" • ");
    };

    // Filter helper
    const filterItems = (items, key) => {
      const needle = (boardFilters[key] || "").toLowerCase();
      if (!needle) return items;
      return items.filter((item) => formatItem(item).toLowerCase().includes(needle));
    };

    // Update the entire board value
    const updateBoard = (next) => {
      if (disabled) return;
      onChange(col.key, next);
      onBlur(col.key);
    };

    // Remove item from assigned list
    const handleRemoveFromAssigned = (item) => {
      if (disabled) return;
      const nextAssigned = assigned.filter((i) => i.kod !== item.kod || i.pozice !== item.pozice);
      const nextChanges = [...changes, { ...item, action: "removed" }];
      const nextAvailable = available.filter((i) => i.kod !== item.kod || i.pozice !== item.pozice);
      updateBoard({
        assigned: nextAssigned,
        changes: nextChanges,
        available: nextAvailable,
      });
    };

    // Add item from available list
    const handleAddFromAvailable = (item) => {
      if (disabled) return;
      const nextAvailable = available.filter((i) => i.kod !== item.kod || i.pozice !== item.pozice);
      const nextChanges = [...changes, { ...item, action: "added" }];
      const nextAssigned = assigned.filter((i) => i.kod !== item.kod || i.pozice !== item.pozice);
      updateBoard({
        assigned: nextAssigned,
        changes: nextChanges,
        available: nextAvailable,
      });
    };

    // Remove change from changes list
    const handleChangeRemoval = (change) => {
      if (disabled) return;
      const nextChanges = changes.filter(
        (c) => !(c.kod === change.kod && c.pozice === change.pozice && c.action === change.action)
      );

      let nextAssigned = assigned;
      let nextAvailable = available;

      if (change.action === "added") {
        nextAvailable = [...available, { ...change }];
      }
      if (change.action === "removed") {
        nextAssigned = [...assigned, { ...change }];
      }

      updateBoard({ assigned: nextAssigned, changes: nextChanges, available: nextAvailable });
    };

    // Column component for layout
    const Column = ({ title, filterKey, children }) => (
      <div className="flex-1 min-w-[220px]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="font-bold text-gray-800 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-300" />
            {t(title)}
          </div>
          {filterKey && (
            <input
              type="text"
              value={boardFilters[filterKey]}
              placeholder={t("Filtrovat")}
              onChange={(e) =>
                setBoardFilters((prev) => ({
                  ...prev,
                  [filterKey]: e.target.value,
                }))
              }
              disabled={disabled}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          )}
        </div>
        <div
          className="flex flex-col gap-2 border border-gray-200 rounded-xl p-4 bg-white shadow-sm overflow-y-auto"
          style={{ height: "240px" }}
        >
          {children}
        </div>
      </div>
    );

    // Item row component
    const ItemRow = ({ item, action, onClick, buttonLabel }) => (
      <div
        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left ${
          action ? badgeTone(action).chip : "border-gray-200 bg-gray-50"
        }`}
      >
        <span className="text-sm font-medium text-gray-900 break-words leading-snug">
          {formatItem(item)}
        </span>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`text-xs font-semibold px-2 py-1 rounded-md shadow-sm transition-colors ${
            action === "removed"
              ? "bg-white text-red-700 border border-red-300 hover:bg-red-50"
              : action === "added"
              ? "bg-white text-green-700 border border-green-300 hover:bg-green-50"
              : "bg-gray-900 text-white border border-gray-900 hover:bg-gray-800"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    );

    const filteredAssigned = filterItems(assigned, "assigned");
    const filteredChanges = filterItems(changes, "changes");
    const filteredAvailable = filterItems(available, "available");

    return wrapper(
      <div className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Column title={labels.assigned} filterKey="assigned">
            {filteredAssigned.length === 0 ? (
              <span className="text-sm text-gray-500">{t("Žádné přiřazené záznamy")}</span>
            ) : (
              filteredAssigned.map((item) => (
                <ItemRow
                  key={`${item.kod || item.id || item.label}-assigned-${item.pozice || ""}`}
                  item={item}
                  buttonLabel="−"
                  onClick={() => handleRemoveFromAssigned(item)}
                />
              ))
            )}
          </Column>

          <Column title={labels.changes} filterKey="changes">
            {filteredChanges.length === 0 ? (
              <span className="text-sm text-gray-500">{t("Žádné změny")}</span>
            ) : (
              filteredChanges.map((change) => (
                <ItemRow
                  key={`${change.kod || change.id || change.label}-change-${change.action}-${change.pozice || ""}`}
                  item={change}
                  action={change.action}
                  buttonLabel={t("Odebrat")}
                  onClick={() => handleChangeRemoval(change)}
                />
              ))
            )}
          </Column>

          <Column title={labels.available} filterKey="available">
            {filteredAvailable.length === 0 ? (
              <span className="text-sm text-gray-500">{t("Žádné dostupné záznamy")}</span>
            ) : (
              filteredAvailable.map((item) => (
                <ItemRow
                  key={`${item.kod || item.id || item.label}-available-${item.pozice || ""}`}
                  item={item}
                  buttonLabel="+"
                  onClick={() => handleAddFromAvailable(item)}
                />
              ))
            )}
          </Column>
        </div>
      </div>
    );
  }

  // Password field
  if (col.type === "password") {
    return wrapper(
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value || ""}
          onChange={(e) => onChange(col.key, e.target.value)}
          onBlur={() => onBlur(col.key)}
          placeholder={col.placeholder || ""}
          disabled={isDisabled(col)}
          readOnly={isDisabled(col)}
          className={controlClass(col) + " w-full"}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          disabled={isDisabled(col)}
          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  }

  // Read-only fields
  if (col.key === "username" || col.key === "nazev_modelu") {
    return wrapper(
      <input
        type="text"
        value={value || ""}
        disabled
        onBlur={() => onBlur(col.key)}
        className={`px-3 py-2 border ${
          hasError ? "border-red-600" : "border-gray-300"
        } bg-gray-100 text-gray-700 rounded-md text-sm cursor-not-allowed`}
      />
    );
  }

  // Transform date to czech format
  if (col.dataType === "date" && value) {
    const date = new Date(value);
    return wrapper(
      <input
        type="text"
        value={formatDateLong(date)}
        disabled
        onBlur={() => onBlur(col.key)}
        className={`px-3 py-2 border ${
          hasError ? "border-red-600" : "border-gray-300"
        } bg-gray-100 text-gray-700 rounded-md text-sm cursor-not-allowed`}
      />
    );
  }

  // Default input field
  return wrapper(
    <input
      type={normalizeInputType(col.type)}
      value={value || ""}
      onChange={(e) => onChange(col.key, e.target.value)}
      onBlur={() => onBlur(col.key)}
      placeholder={col.placeholder || ""}
      disabled={isDisabled(col)}
      readOnly={isDisabled(col)}
      className={controlClass(col)}
    />
  );
}
