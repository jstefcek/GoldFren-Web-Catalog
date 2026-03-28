import {useState, useEffect, useRef} from "react";
import { Eye, EyeOff, ImageOff } from "lucide-react";
import BooleanToggleButton from "../ui/Custom_ButtonToggle";
import { CustomImageViewer } from "../ui/Custom_ImageViewer";
import { formatDateLong, isFileObject } from "../../utils/utils";
import SetupBoard from "../DialogField_Components/Setup_Board";

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
  dialogConfig = null,
  rowData = null,
  access_token = null,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const [imageSrc, setImageSrc] = useState(null);
  const [imageKey, setImageKey] = useState(0);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (col.type !== "image") return;

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

    setImageKey((prev) => prev + 1);

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [value, col.type, col.key]);

  const normalizeInputType = (t2) => (t2 === "input" ? "text" : t2 || "text");
  const hasError = !!error;

  const controlClass = (col2, isPlaceholder = false) => {
    const textColor = isDisabled(col2)
      ? "text-gray-700"
      : isPlaceholder
      ? "text-gray-400"
      : "text-gray-900";

    return `${textColor} ${
      isDisabled(col2) ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:ring-2"
    } px-3 py-2 border ${
      hasError ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-gray-600"
    } rounded-md text-sm focus:outline-none focus:ring-2`;
  };

  const wrapper = (children) => (
    <div className="flex flex-col">
      <label className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-1">
        {t(col.label)}
        {col.required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {hasError && <span className="mt-1 text-xs text-red-600">{error}</span>}
    </div>
  );
  // Handlers for image upload and delete actions to update the value in parent component
  const handleImageReplace = (file) => onChange(col.key, file);
  const handleImageDelete = () => onChange(col.key, null);

  // Special handling for invisible fields to render a hidden input and an empty div for layout consistency, while being hidden from assistive technologies
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

  // Special handling for image type to use CustomImageViewer component with upload and delete functionality
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
          <label
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-md 
            ${hasError ? "border-red-600" : "border-gray-300"} 
            ${disabled ? "cursor-not-allowed bg-gray-50" : "cursor-pointer hover:border-gray-400"}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
              {!disabled && <p className="text-sm text-gray-500">{t("Klikněte pro nahrání obrázku")}</p>}
            </div>
            {!disabled && (
              <input
                type="file"
                className="hidden"
                accept="image/*,.svg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange(col.key, file);
                }}
                onBlur={() => onBlur(col.key)}
              />
            )}
          </label>
        )}
      </div>
    );
  }

  // Special handling for boolean fields with button type to use BooleanToggleButton component
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

  // Special handling for vyrobce to use options from config and display placeholder based on whether options are available
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

  // Special handling for kategorie to use options from config and display placeholder
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
        <option value="" className="text-gray-400">
          {col.placeholder || t("Vyberte kategorii")}
        </option>
        {col.value.map((opt) => (
          <option key={opt.id} value={opt.value}>
            {t(opt.label)}
          </option>
        ))}
      </select>
    );
  }

  // Special handling for subkategorie to use filtered options based on selected kategorie
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
        <option value="" className="text-gray-400">
          {col.placeholder || t("Vyberte subkategorii")}
        </option>
        {filteredSubkategorie.map((opt) => (
          <option key={opt.id} value={opt.value}>
            {t(opt.label)}
          </option>
        ))}
      </select>
    );
  }

  // General handling for any other select fields defined in config with value array
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
        <option value="" className="text-gray-400">
          {col.placeholder || t("Vyberte možnost")}
        </option>
        {col.value.map((opt) => (
          <option key={opt.id} value={opt.value}>
            {t(opt.label)}
          </option>
        ))}
      </select>
    );
  }

  // Special handling for textarea type to render a multiline input
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

  // Special handling for label type to render as non-editable text with different sizes
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
        <input type="hidden" value={value || ""} onChange={(e) => onChange(col.key, e.target.value)} />
        <span className={labelClassName}>{t(col.label)}</span>
      </div>
    );
  }

  // Special handling for setup_board type to render the SetupBoard component
  if (col.type === "setup_board") {
    const disabled = isDisabled(col);
    return wrapper(
      <SetupBoard
        col={col}
        value={value}
        t={t}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        dialogConfig={dialogConfig}
        rowData={rowData}
        access_token={access_token}
      />
    );
  }

  // Special handling for password fields to allow toggling visibility
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

  // Special handling for non-editable username and model name fields to be read-only
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

  // Special handling for date fields to display formatted date and be read-only
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

  // Special handling for numeric inputs to allow empty value and proper step
  if (col.type === "input" && col.dataType === "number") {
    // Display empty string if value is null, undefined, or empty to allow clearing the input, otherwise display the number with fixed decimal places if specified
    const displayValue = value !== null && value !== undefined && value !== ""
      ? Number(value).toFixed(col.decimalPlaces || 1)
      : "";

    return wrapper(
      <input
        type="number"
        inputmode="decimal"
        value={displayValue}
        min={col.min}
        max={col.max}
        step={col.step || 0.1}
        onChange={(e) => onChange(col.key, e.target.value)}
        onBlur={() => onBlur(col.key)}
        placeholder={col.placeholder || ""}
        disabled={isDisabled(col)}
        readOnly={isDisabled(col)}
        className={controlClass(col)}
      />
    );
  }

  // Default to text input for any other types
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