import { useState, useEffect } from "react";
import { Eye, EyeOff, ImageOff } from "lucide-react";
import BooleanToggleButton from "../ui/Custom_ButtonToggle";
import { CustomImageViewer } from "../ui/Custom_ImageViewer";
import { formatDateLong } from "../../utils/utils";

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

  useEffect(() => {
    if (col.type !== "image") return;

    // If the value is a File, create an object URL for preview
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setImageSrc(url);
      // Revoke the created URL when value changes or component unmounts
      return () => URL.revokeObjectURL(url);
    }

    // For string values (already uploaded images), just use the raw value
    setImageSrc(value || null);
  }, [value, col.type]);

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
      <label className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1">
        {t(col.label)}
        {col.required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {hasError && <span className="mt-1 text-xs text-red-600">{error}</span>}
    </div>
  );

  // Invisible field: reserve layout space but render a non-interactive placeholder
  if (col.type === "invisible" || col.key === "invisible") {
    // Keep the same vertical space as a normal field, but don't render label or border.
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
    return wrapper(
      <div className="relative">
        {imageSrc ? (
          <CustomImageViewer
            key={`${col.key}-${imageSrc}`} // Force re-render when imageSrc changes
            src={imageSrc}
            alt={col.label}
            fullSize={true}
            className="h-64 w-full object-contain border border-gray-300 rounded-md bg-white"
            allowUpload={!isDisabled(col)}
            onUpload={(file) => {
              onChange(col.key, file);
            }}
            allowDelete={!isDisabled(col)}
            onDelete={() => {
              onChange(col.key, null);
            }}
          />
        ) : (
          <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-md 
            ${hasError ? 'border-red-600' : 'border-gray-300'} 
            ${isDisabled(col) ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:border-gray-400'}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
              {!isDisabled(col) && (
                <p className="text-sm text-gray-500">{t("Klikněte pro nahrání obrázku")}</p>
              )}
            </div>
            {!isDisabled(col) && (
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
