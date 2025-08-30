import { useState } from "react";
import { Eye, EyeOff, ImageOff } from "lucide-react";
import BooleanToggleButton from "../ui/Custom_ButtonToggle";

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

  // Helpers
  const normalizeInputType = (t) => (t === "input" ? "text" : t || "text");
  const hasError = !!error;

  // Control class used between components
  const controlClass = (col) =>
    `${
      isDisabled(col) ? "text-gray-700 bg-gray-100 cursor-not-allowed" : "text-gray-900 bg-white focus:ring-2"
    } px-3 py-2 border ${
      hasError ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-gray-600"
    } text-gray-700 rounded-md text-sm focus:outline-none focus:ring-2`;

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

  // --- Controls ---
  // Image preview field
  if (col.type === "image") {
    return wrapper(
      value ? (
        <img
          src={value}
          alt={col.label}
          className={`max-w-full max-h-48 object-contain border ${
            hasError ? "border-red-600" : "border-gray-300"
          } rounded-md bg-white`}
          onBlur={() => onBlur(col.key)}
        />
      ) : (
        <div
          className={`max-w-full h-48 flex items-center justify-center border ${
            hasError ? "border-red-600" : "border-gray-300"
          } rounded-md bg-gray-50 text-gray-400`}
          onBlur={() => onBlur(col.key)}
          tabIndex={0}
        >
          <ImageOff size={32} />
        </div>
      )
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
        className={controlClass(col)}
      >
        <option value="">
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
        className={controlClass(col)}
      >
        <option value="">{col.placeholder || t("Vyberte kategorii")}</option>
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
        className={controlClass(col)}
      >
        <option value="">{col.placeholder || t("Vyberte subkategorii")}</option>
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
        className={controlClass(col)}
      >
        <option value="">{col.placeholder || t("Vyberte možnost")}</option>
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